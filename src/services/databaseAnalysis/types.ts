export type SQLClient = {
  query: (sql: string, params?: any[]) => Promise<{ rows?: any[]; rowCount?: number; } & Record<string, any>>;
};

export type MongoCollectionLike = {
  insertOne: (doc: any) => Promise<any>;
  findOne: (query: any) => Promise<any>;
  updateOne: (q: any, u: any, opts?: any) => Promise<any>;
  deleteOne: (q: any) => Promise<any>;
  aggregate?: (pipeline: any[]) => Promise<any>;
  find?: (q: any) => { toArray: () => Promise<any[]>; explain?: () => Promise<any> };
  countDocuments?: (q: any) => Promise<number>;
};

export type MongoClientLike = {
  db: (name?: string) => {
    collection: (name: string) => MongoCollectionLike;
  };
  startSession?: () => any;
};

export type StressOptions = {
  concurrency?: number;
  durationSeconds?: number;
  query?: string;
  params?: any[];
};

export type TestResult = {
  success: boolean;
  details?: string;
  metrics?: Record<string, any>;
};
