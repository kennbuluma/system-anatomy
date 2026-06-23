import { SQLClient, MongoClientLike, StressOptions, TestResult } from './types';

// Basic stress tester for SQL-like clients
export async function stressTestSQL(client: SQLClient, options: StressOptions): Promise<TestResult> {
  const concurrency = options.concurrency || 10;
  const duration = (options.durationSeconds || 15) * 1000;
  const query = options.query || 'SELECT 1';

  let running = true;
  const metrics = { totalRequests: 0, errors: 0, latencies: [] as number[] };

  const worker = async () => {
    while (running) {
      const start = Date.now();
      try {
        await client.query(query, options.params || []);
        metrics.totalRequests += 1;
        metrics.latencies.push(Date.now() - start);
      } catch (err) {
        metrics.errors += 1;
      }
    }
  };

  const workers = Array.from({ length: concurrency }).map(() => worker());
  await new Promise((res) => setTimeout(res, duration));
  running = false;
  await Promise.allSettled(workers);

  return { success: metrics.errors === 0, metrics };
}

// Basic stress tester for Mongo-like clients
export async function stressTestMongo(client: MongoClientLike, dbName: string, collectionName: string, options: StressOptions): Promise<TestResult> {
  const concurrency = options.concurrency || 10;
  const duration = (options.durationSeconds || 15) * 1000;

  let running = true;
  const metrics = { totalOps: 0, errors: 0, latencies: [] as number[] };

  const worker = async () => {
    const col = client.db(dbName).collection(collectionName);
    while (running) {
      const start = Date.now();
      try {
        await col.insertOne({ ts: Date.now(), payload: Math.random() });
        metrics.totalOps += 1;
        metrics.latencies.push(Date.now() - start);
      } catch (err) {
        metrics.errors += 1;
      }
    }
  };

  const workers = Array.from({ length: concurrency }).map(() => worker());
  await new Promise((res) => setTimeout(res, duration));
  running = false;
  await Promise.allSettled(workers);

  return { success: metrics.errors === 0, metrics };
}

// Simple query analyzer: runs EXPLAIN (SQL) or explain() (Mongo) to flag possible inefficiencies
export async function analyzeSQLQuery(client: SQLClient, sql: string): Promise<TestResult> {
  try {
    const explainSql = `EXPLAIN ANALYZE ${sql}`;
    const res = await client.query(explainSql);
    // crude heuristic: look for 'Seq Scan' or 'Full Table Scan' in result text
    const text = JSON.stringify(res.rows || res);
    const issues: string[] = [];
    if (/Seq Scan|Seq Scan on|Full Table Scan|All Nodes/.test(text)) issues.push('Potential full table scan or sequential scan');
    if (/Temporary|Sort\b/.test(text)) issues.push('Temporary sort or large sort detected');
    return { success: issues.length === 0, details: issues.join('; ') || 'No obvious issues', metrics: { explain: text } };
  } catch (err: any) {
    return { success: false, details: String(err) };
  }
}

export async function analyzeMongoQuery(client: MongoClientLike, dbName: string, collectionName: string, pipelineOrQuery: any): Promise<TestResult> {
  try {
    const col = client.db(dbName).collection(collectionName);
    // if pipeline: use aggregate with explain, otherwise find().explain()
    if (Array.isArray(pipelineOrQuery)) {
      const res = await (col as any).aggregate(pipelineOrQuery).explain();
      const json = JSON.stringify(res);
      const issues: string[] = [];
      if (/COLLSCAN|IXSCAN/.test(json)) issues.push('Collection scan or missing index');
      return { success: issues.length === 0, details: issues.join('; ') || 'No obvious issues', metrics: { explain: res } };
    } else {
      const res = await (col as any).find(pipelineOrQuery).explain();
      const json = JSON.stringify(res);
      const issues: string[] = [];
      if (/COLLSCAN|IXSCAN/.test(json)) issues.push('Collection scan or missing index');
      return { success: issues.length === 0, details: issues.join('; ') || 'No obvious issues', metrics: { explain: res } };
    }
  } catch (err: any) {
    return { success: false, details: String(err) };
  }
}

// ACID compliance checks (best-effort smoke tests)
export async function checkSQLACID(client: SQLClient): Promise<TestResult> {
  try {
    // Attempt a simple transactional test: create temp table, insert, rollback, ensure no row
    await client.query('BEGIN');
    await client.query('CREATE TEMP TABLE IF NOT EXISTS tmp_acid_test(id SERIAL PRIMARY KEY, val TEXT)');
    await client.query("INSERT INTO tmp_acid_test(val) VALUES('tx-test')");
    await client.query('ROLLBACK');
    const res = await client.query("SELECT count(*) as c FROM tmp_acid_test");
    const count = Number(res.rows?.[0]?.c ?? 0);
    return { success: count === 0, details: count === 0 ? 'Rollback respected' : 'Rollback leaked rows', metrics: { count } };
  } catch (err: any) {
    try { await client.query('ROLLBACK'); } catch (_) {}
    return { success: false, details: String(err) };
  }
}

export async function checkMongoACID(client: MongoClientLike, dbName: string): Promise<TestResult> {
  try {
    // Mongo multi-document transactions require replica set; best-effort: startTransaction only if supported
    const session: any = (client as any).startSession?.();
    if (!session || !session.startTransaction) return { success: true, details: 'Mongo not in replica-set or transactions unsupported; skip' };
    session.startTransaction();
    const col = client.db(dbName).collection('tmp_acid_test');
    await col.insertOne({ val: 'tx-test' });
    await session.abortTransaction();
    session.endSession();
    const found = await col.findOne({ val: 'tx-test' });
    return { success: !found, details: !found ? 'Transaction rollback respected' : 'Rollback leaked document' };
  } catch (err: any) {
    return { success: false, details: String(err) };
  }
}

// Idempotency test -- run same write multiple times and ensure only one effect when intended
export async function testSQLIdempotency(client: SQLClient, idempotentUpsertSql: string, params: any[]): Promise<TestResult> {
  try {
    // Run upsert multiple times and check row count
    await client.query('BEGIN');
    await client.query('CREATE TEMP TABLE IF NOT EXISTS tmp_idempotency(id TEXT PRIMARY KEY, v INT)');
    await client.query(idempotentUpsertSql, params);
    await client.query(idempotentUpsertSql, params);
    await client.query('COMMIT');
    const res = await client.query('SELECT count(*) as c FROM tmp_idempotency');
    const count = Number(res.rows?.[0]?.c ?? 0);
    return { success: count === 1, details: count === 1 ? 'Idempotent' : `Not idempotent; ${count} rows` };
  } catch (err: any) {
    try { await client.query('ROLLBACK'); } catch (_) {}
    return { success: false, details: String(err) };
  }
}

export async function testMongoIdempotency(client: MongoClientLike, dbName: string, collectionName: string, key: any, doc: any): Promise<TestResult> {
  try {
    const col = client.db(dbName).collection(collectionName);
    await col.deleteOne(key);
    await col.updateOne(key, { $setOnInsert: doc }, { upsert: true });
    await col.updateOne(key, { $setOnInsert: doc }, { upsert: true });
    const count = await col.countDocuments(key as any);
    return { success: count === 1, details: count === 1 ? 'Idempotent' : `Not idempotent; ${count} documents` };
  } catch (err: any) {
    return { success: false, details: String(err) };
  }
}

// Security checks: naive checks for open access, simple injection vulnerability testing
export async function basicSQLSecurityChecks(client: SQLClient, sampleTable: string): Promise<TestResult> {
  try {
    // Attempt SQL injection harmlessly via explain
    const inj = `EXPLAIN ANALYZE SELECT * FROM ${sampleTable} WHERE 'x' = 'x' OR 1=1`; 
    await client.query(inj);
    // If query succeeded, we still need to check permissions, but this is a placeholder
    return { success: true, details: 'Basic injection attempt executed (review results manually)' };
  } catch (err: any) {
    return { success: false, details: String(err) };
  }
}

export async function basicMongoSecurityChecks(client: MongoClientLike, dbName: string, collectionName: string): Promise<TestResult> {
  try {
    // Check if collection allows empty read
    const col = client.db(dbName).collection(collectionName);
    const one = await col.findOne({});
    return { success: true, details: one ? 'Collection readable' : 'Collection empty or not readable' };
  } catch (err: any) {
    return { success: false, details: String(err) };
  }
}

// Backup/recovery test (best-effort): runs a simple snapshot/restore hook where supported - placeholder implementations
export async function testSQLBackupRestore(client: SQLClient): Promise<TestResult> {
  try {
    // Best-effort: create a table, insert row, copy to temp, drop, restore
    await client.query('CREATE TEMP TABLE IF NOT EXISTS tmp_backup(id SERIAL PRIMARY KEY, v TEXT)');
    await client.query("INSERT INTO tmp_backup(v) VALUES('backup-test')");
    const res = await client.query('SELECT count(*) as c FROM tmp_backup');
    const c1 = Number(res.rows?.[0]?.c ?? 0);
    // simulate backup by copying to another temp table
    await client.query('CREATE TEMP TABLE IF NOT EXISTS tmp_backup_copy AS TABLE tmp_backup');
    await client.query('TRUNCATE tmp_backup');
    await client.query('INSERT INTO tmp_backup SELECT * FROM tmp_backup_copy');
    const res2 = await client.query('SELECT count(*) as c FROM tmp_backup');
    const c2 = Number(res2.rows?.[0]?.c ?? 0);
    return { success: c1 === c2 && c1 > 0, details: `Backup/restore simulated, rows ${c1}->${c2}` };
  } catch (err: any) {
    return { success: false, details: String(err) };
  }
}

export async function testMongoBackupRestore(client: MongoClientLike, dbName: string, collectionName: string): Promise<TestResult> {
  try {
    const col = client.db(dbName).collection(collectionName);
    await col.insertOne({ backup_test: Date.now() });
    const docs = await col.find({ backup_test: { $exists: true } }).toArray?.() || [];
    // Best-effort only
    return { success: docs.length > 0, details: `Found ${docs.length} backup markers` };
  } catch (err: any) {
    return { success: false, details: String(err) };
  }
}

// Logging and audit trail tests (smoke)
export async function testLoggingAndAudit(client: SQLClient | MongoClientLike, kind: 'sql' | 'mongo'): Promise<TestResult> {
  try {
    if (kind === 'sql') {
      // Check pg_catalog or information_schema for logging settings (very database specific)
      return { success: true, details: 'SQL logging check placeholder - inspect DB configs' };
    } else {
      return { success: true, details: 'Mongo logging check placeholder - inspect mongod settings and oplog' };
    }
  } catch (err: any) {
    return { success: false, details: String(err) };
  }
}

export default {
  stressTestSQL,
  stressTestMongo,
  analyzeSQLQuery,
  analyzeMongoQuery,
  checkSQLACID,
  checkMongoACID,
  testSQLIdempotency,
  testMongoIdempotency,
  basicSQLSecurityChecks,
  basicMongoSecurityChecks,
  testSQLBackupRestore,
  testMongoBackupRestore,
  testLoggingAndAudit,
};
