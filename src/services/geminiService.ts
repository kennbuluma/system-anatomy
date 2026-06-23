import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_INSTRUCTION = "You are the System Anatomy Analysis Engine, a highly specialized AI designed for systems engineering, code refactoring, and performance optimization. You assist users in diagnosing systemic failures, identifying bottlenecks, and providing technical strategies for rebuilding or refactoring complex software systems. Your tone is professional, analytical, and technical. You use monospaced formatting for code snippets and technical data. You are concise and focus on root cause analysis and engineering excellence.";

// Predetermined responses for when backend is unavailable
export const FALLBACK_OPTIONS = [
  {
    title: "Database Performance Analysis",
    description: "Analyze query patterns, indexing strategies, and database bottlenecks"
  },
  {
    title: "Memory Leak Detection",
    description: "Identify memory management issues and resource leaks"
  },
  {
    title: "API Latency Optimization",
    description: "Profile and optimize API response times and throughput"
  },
  {
    title: "Microservices Architecture Review",
    description: "Assess service boundaries and inter-service communication patterns"
  },
  {
    title: "Load Balancing Strategy",
    description: "Evaluate load distribution and scaling capabilities"
  },
  {
    title: "Security Vulnerability Assessment",
    description: "Identify potential security weaknesses and compliance issues"
  },
  {
    title: "Cache Architecture Design",
    description: "Implement multi-level caching strategies and cache invalidation patterns"
  },
  {
    title: "Container Orchestration",
    description: "Kubernetes deployment, resource management, and scaling configuration"
  },
  {
    title: "Database Replication & HA",
    description: "High availability, failover strategies, and data consistency models"
  },
  {
    title: "Code Quality & Refactoring",
    description: "Technical debt assessment, code metrics, and modernization pathways"
  },
  {
    title: "Logging & Monitoring Strategy",
    description: "Centralized logging, APM, alerting, and observability implementation"
  },
  {
    title: "Concurrency & Race Conditions",
    description: "Deadlock detection, thread safety, and concurrent access patterns"
  },
  {
    title: "Network Performance Tuning",
    description: "Protocol optimization, bandwidth management, and latency reduction"
  },
  {
    title: "Data Pipeline & ETL Analysis",
    description: "Stream processing, batch processing, and data flow optimization"
  },
  {
    title: "Testing Strategy & Coverage",
    description: "Unit, integration, and E2E testing; test automation best practices"
  },
  {
    title: "Disaster Recovery Planning",
    description: "RTO/RPO targets, backup strategies, and recovery procedures"
  },
  {
    title: "Cost Optimization Analysis",
    description: "Resource utilization, cloud spend analysis, and efficiency improvements"
  },
  {
    title: "System Documentation Review",
    description: "Documentation quality, architecture diagrams, and knowledge management"
  }
];

export const FALLBACK_RESPONSES: Record<string, string> = {
  "Database Performance Analysis": "DATABASE PERFORMANCE ANALYSIS\n\nKey areas to investigate:\n• Query Execution Plans: Use EXPLAIN to identify sequential scans vs. index usage\n• Index Strategy: Verify composite index usage and missing indexes on frequently filtered columns\n• Connection Pooling: Ensure connection pool size matches concurrent request volume\n• Lock Contention: Monitor for table locks during peak load periods\n• Replication Lag: Check if read replicas are falling behind primary database\n• Cache Hit Rate: Implement caching layer if DB hit rate is suboptimal\n• Table Statistics: Update statistics for query planner optimization\n• Partition Strategy: Consider table partitioning for large datasets\n\nRecommended tools: pgAdmin, MySQL Workbench, DataGrip, New Relic Database monitoring, pg_stat_statements",
  
  "Memory Leak Detection": "MEMORY LEAK DETECTION STRATEGY\n\nDiagnostic approach:\n• Baseline Measurement: Record initial memory consumption at startup\n• Load Testing: Generate consistent traffic and monitor memory growth over time\n• Heap Profiling: Use V8 profiler (Node.js) or JVM tools (Java) to identify unreleased objects\n• Event Listener Cleanup: Verify all event listeners are properly removed\n• Timer Clearance: Ensure setTimeout/setInterval callbacks are cleared\n• Large Object Retention: Check for accumulated large data structures not being garbage collected\n• WeakMap/WeakSet Usage: Utilize weak references for cache-like structures\n• Circular References: Break circular object references that prevent garbage collection\n\nRecommended tools: Chrome DevTools, Node.js heapdump, Java Flight Recorder, Valgrind, Clinic.js",
  
  "API Latency Optimization": "API LATENCY OPTIMIZATION ROADMAP\n\nOptimization tactics:\n• Endpoint Profiling: Identify slow endpoints using APM (New Relic, DataDog, Jaeger)\n• Database Query Time: Profile database time vs. network vs. processing time\n• Connection Pooling: Implement connection reuse to eliminate connection overhead\n• Caching Strategy: Add Redis/Memcached for frequently accessed data\n• Async Operations: Convert blocking I/O to async/non-blocking patterns\n• Rate Limiting: Prevent cascading failures from overload\n• CDN Integration: Serve static assets from edge locations\n• Compression: Enable gzip/brotli compression for responses\n• HTTP/2 & HTTP/3: Implement multiplexing and header compression\n• Request Batching: Combine multiple API calls into single requests\n\nRecommended metrics: p50, p95, p99 latency percentiles, SLO monitoring",
  
  "Microservices Architecture Review": "MICROSERVICES ARCHITECTURE ASSESSMENT\n\nKey evaluation points:\n• Service Boundaries: Validate that services follow domain boundaries (DDD)\n• Data Consistency: Review eventual consistency patterns and SAGA implementations\n• Service Discovery: Evaluate naming service and load balancing strategy\n• API Contracts: Verify backward compatibility and versioning strategy (semantic versioning)\n• Resilience Patterns: Check for circuit breakers, timeouts, and retry logic (with exponential backoff)\n• Observability: Ensure distributed tracing (OpenTelemetry), centralized logging, and metrics collection\n• Deployment Strategy: Review canary deployments, blue-green deployments, and rollback procedures\n• Message Queue: Evaluate async communication patterns and message ordering\n• Authorization: Implement service-to-service authentication and authorization\n\nRecommended patterns: Service mesh (Istio), API Gateway (Kong/Envoy), event streaming (Kafka/RabbitMQ)",
  
  "Load Balancing Strategy": "LOAD BALANCING & SCALING ANALYSIS\n\nAssessment framework:\n• Algorithm Choice: Round-robin vs. least-connections vs. IP-hash suitability\n• Health Checks: Verify liveness and readiness probe configuration\n• Session Affinity: Determine sticky session requirements and sticky-cookie strategy\n• Horizontal Scaling: Review auto-scaling triggers and scale-up/down latency\n• Rate Limiting: Implement per-client or per-IP rate limits\n• Geographic Distribution: Consider multi-region failover and latency optimization\n• State Management: Ensure session state is sharable across load-balanced instances\n• Connection Draining: Graceful shutdown with in-flight request handling\n• Overload Shedding: Drop requests when capacity is exhausted\n\nRecommended solutions: NGINX, HAProxy, cloud-native LBs (ALB/NLB), Envoy Proxy",
  
  "Security Vulnerability Assessment": "SECURITY VULNERABILITY ASSESSMENT\n\nCritical areas:\n• Authentication: Validate JWT/OAuth implementation and token expiration\n• Authorization: Ensure RBAC/ABAC policies are correctly enforced\n• Input Validation: Check for SQL injection, XSS, and CSRF vulnerabilities\n• Data Encryption: Verify TLS for transit and encryption at rest for sensitive data\n• Secrets Management: Ensure API keys and credentials are not hardcoded or logged\n• Dependency Vulnerabilities: Run SAST tools (Snyk, Trivy) on dependencies\n• OWASP Compliance: Audit against OWASP Top 10 and CWE-25 priority recommendations\n• Rate Limiting: Implement DDoS protection and brute-force attack mitigation\n• Audit Logging: Log security events for compliance and forensics\n• TLS/SSL: Use TLS 1.3+, validate certificate chains, implement HSTS\n\nRecommended tools: Burp Suite, OWASP ZAP, SonarQube, npm audit, Snyk, Trivy",
  
  "Cache Architecture Design": "CACHE ARCHITECTURE DESIGN STRATEGY\n\nImplementation framework:\n• Cache Levels: Design L1 (in-memory), L2 (Redis), L3 (CDN) caching hierarchy\n• Eviction Policies: Choose LRU, LFU, or TTL-based expiration strategies\n• Cache Invalidation: Implement event-driven or time-based invalidation patterns\n• Write-Through vs Write-Back: Determine cache-aside vs write-through strategies\n• Distributed Cache: Configure replication and consistency for Redis/Memcached\n• Cache Warming: Pre-populate caches during deployment or scheduled intervals\n• Cache Stampede Prevention: Implement probabilistic early expiration or locks\n• Cache Key Design: Use hierarchical, versioned keys for easy invalidation\n• Monitoring: Track cache hit rates, evictions, and memory pressure\n\nRecommended solutions: Redis, Memcached, Varnish, CDN providers (CloudFlare, Akamai)",
  
  "Container Orchestration": "CONTAINER ORCHESTRATION & KUBERNETES ANALYSIS\n\nKey configuration areas:\n• Cluster Architecture: Node sizing, control plane HA, and etcd backup strategy\n• Pod Specifications: Resource requests/limits, health checks, and scheduling policies\n• Auto-scaling: HPA (CPU/memory-based) and VPA (right-sizing) configuration\n• Networking: Service mesh integration, network policies, and ingress configuration\n• Storage: PVC provisioning, storage classes, and data persistence strategy\n• RBAC & Security: Service account permissions, network policies, Pod security policies\n• Resource Quotas: Namespace quotas and limit ranges for multi-tenant clusters\n• Monitoring & Logging: Prometheus/Grafana for metrics, ELK/Loki for logs\n• Deployment Strategy: Rolling updates, canary releases, Helm chart management\n• Cost Optimization: Node affinity, pod eviction policies, spot instances\n\nRecommended tools: kubectl, Helm, kustomize, Prometheus, Grafana, Jaeger",
  
  "Database Replication & HA": "DATABASE REPLICATION & HIGH AVAILABILITY STRATEGY\n\nDesign considerations:\n• Replication Topology: Master-slave, master-master, or multi-master configurations\n• Consistency Levels: Strong consistency vs eventual consistency trade-offs\n• Failover Mechanism: Automatic failover with split-brain prevention\n• Recovery Point Objective (RPO): Minimize data loss in failure scenarios\n• Recovery Time Objective (RTO): Minimize downtime during failover\n• Backup Strategy: Full backups, incremental backups, and WAL archiving\n• Replication Lag Monitoring: Alert on replication delays exceeding thresholds\n• Backup Testing: Regular restore drills to validate recovery procedures\n• Point-in-Time Recovery: WAL retention and flashback capabilities\n• Multi-Region Setup: Geographic redundancy and disaster recovery\n\nRecommended solutions: PostgreSQL (streaming replication), MySQL (Group Replication), MongoDB (replica sets)",
  
  "Code Quality & Refactoring": "CODE QUALITY & REFACTORING ASSESSMENT\n\nEvaluation metrics:\n• Technical Debt Ratio: Estimated effort to address code issues\n• Cyclomatic Complexity: Identify overly complex functions (target < 10)\n• Code Duplication: Find and consolidate repeated code patterns\n• Test Coverage: Aim for 80%+ coverage with meaningful tests\n• SOLID Principles: Validate Single Responsibility, Open/Closed, Liskov, Interface, Dependency Inversion\n• Design Patterns: Identify anti-patterns and suggest improvements\n• Dead Code Removal: Eliminate unused functions, variables, and dependencies\n• Type Safety: Increase type coverage in TypeScript/Go projects\n• Documentation: Ensure code comments and API documentation are current\n• Security Issues: Static analysis for security vulnerabilities\n\nRecommended tools: SonarQube, Codacy, CodeClimate, ESLint, Pylint, Clippy",
  
  "Logging & Monitoring Strategy": "LOGGING & MONITORING STRATEGY\n\nImplementation roadmap:\n• Centralized Logging: Aggregate logs from all services (ELK, Loki, Splunk)\n• Structured Logging: Use JSON format with consistent field names\n• Log Levels: Appropriate use of DEBUG, INFO, WARN, ERROR, CRITICAL\n• Sensitive Data: Scrub PII, credentials, and secrets from logs\n• Log Retention: Define retention policies based on compliance requirements\n• Metrics Collection: Prometheus, StatsD, or OpenMetrics format\n• Alerting Rules: Define thresholds for critical metrics (CPU, memory, latency, errors)\n• SLI/SLO Definition: Specify Service Level Indicators and Objectives\n• Tracing: Distributed tracing with OpenTelemetry for request flow visibility\n• Dashboard Design: Create actionable dashboards for different stakeholders\n\nRecommended stack: Prometheus + Grafana + Loki + Jaeger, or ELK/OpenSearch + Kibana",
  
  "Concurrency & Race Conditions": "CONCURRENCY & RACE CONDITION ANALYSIS\n\nDiagnostic approach:\n• Thread Safety: Identify unprotected shared state access\n• Synchronization: Verify locks, mutexes, and semaphores usage\n• Deadlock Detection: Find circular wait conditions in lock acquisition\n• Memory Ordering: Validate memory visibility with volatile/atomic semantics\n• Race Condition Testing: Use stress testing and race detection tools\n• Lock Contention: Monitor lock wait times and optimize contention hotspots\n• Atomic Operations: Replace locks with atomic compare-and-swap (CAS)\n• Immutability: Prefer immutable data structures where possible\n• Actor Model: Consider actor-based concurrency for complex scenarios\n• Goroutine/Thread Pools: Right-size concurrency pools\n\nRecommended tools: ThreadSanitizer, Helgrind, go-race, Java Lock Monitor",
  
  "Network Performance Tuning": "NETWORK PERFORMANCE TUNING STRATEGY\n\nOptimization areas:\n• TCP Tuning: Adjust window size, buffer sizes, and keep-alive parameters\n• DNS Resolution: Cache DNS, use local DNS servers, implement connection pooling\n• Bandwidth Optimization: Enable compression, reduce payload sizes\n• Protocol Selection: HTTP/2 multiplexing, HTTP/3 QUIC for faster handshakes\n• Packet Loss Handling: TCP retransmission tuning, UDP with redundancy\n• Latency Reduction: Minimize round trips, implement request batching\n• BGP & Routing: Optimize routing paths for multi-region deployments\n• DDoS Mitigation: Rate limiting, traffic scrubbing, WAF integration\n• MTU Optimization: Path MTU discovery to prevent fragmentation\n• Network Monitoring: Tcpdump, Wireshark analysis for packet-level issues\n\nRecommended tools: iperf3, NetCat, Wireshark, tcpdump, cloudshark",
  
  "Data Pipeline & ETL Analysis": "DATA PIPELINE & ETL OPTIMIZATION STRATEGY\n\nDesign framework:\n• Data Sources: Identify source systems and update frequency\n• Ingestion Method: Batch vs stream vs event-driven ingestion\n• Transformation Logic: Spark, Flink, or serverless functions for transformations\n• Data Quality: Validation, deduplication, and error handling\n• Scalability: Partition schemes, parallel processing, and resource allocation\n• Failure Handling: Retry logic, dead-letter queues, and recovery procedures\n• Monitoring: Data freshness SLAs, pipeline latency, and error rates\n• Schema Evolution: Handle schema changes without breaking downstream systems\n• Cost Optimization: Optimize compute resources and storage tiering\n• Data Lineage: Track data provenance for compliance and debugging\n\nRecommended tools: Apache Spark, Flink, Kafka, dbt, Airflow, Great Expectations",
  
  "Testing Strategy & Coverage": "TESTING STRATEGY & COVERAGE ASSESSMENT\n\nTesting framework:\n• Unit Tests: Fast, isolated tests of individual functions (target > 80% coverage)\n• Integration Tests: Test component interactions and external dependencies\n• End-to-End Tests: Full user workflows across all layers\n• Contract Testing: Verify API contracts between services\n• Performance Tests: Load testing, stress testing, and soak testing\n• Security Tests: Penetration testing, vulnerability scanning, SAST/DAST\n• Chaos Engineering: Test system resilience under failure conditions\n• Test Automation: CI/CD integration with automated test execution\n• Flaky Test Detection: Identify and fix non-deterministic tests\n• Test Data Management: Fixtures, factories, and database seeding\n\nRecommended tools: Jest, pytest, JUnit, Playwright, K6, JMeter, OWASP ZAP",
  
  "Disaster Recovery Planning": "DISASTER RECOVERY & BUSINESS CONTINUITY PLANNING\n\nPlanning components:\n• RTO/RPO Targets: Define acceptable downtime and data loss windows\n• Backup Strategy: Full, incremental, and differential backup schedules\n• Geographic Redundancy: Multi-region deployment with failover procedures\n• Data Replication: Synchronous vs asynchronous replication trade-offs\n• Recovery Procedures: Documented step-by-step recovery runbooks\n• Recovery Testing: Regular disaster recovery drills and validation\n• Communication Plan: Escalation procedures and stakeholder notification\n• Change Management: Version control for infrastructure and configurations\n• Documentation: Keep disaster recovery plans updated and accessible\n• Insurance & Compliance: Document compliance with regulatory requirements\n\nRecommended approaches: Active-passive failover, active-active with conflict resolution",
  
  "Cost Optimization Analysis": "COST OPTIMIZATION & RESOURCE EFFICIENCY ANALYSIS\n\nOptimization strategies:\n• Resource Right-sizing: Analyze CPU/memory utilization and adjust allocations\n• Compute Optimization: Reserved instances, spot instances, and on-demand for variable workloads\n• Storage Tiering: Cold/warm/hot data classification with appropriate storage classes\n• Data Transfer: Minimize egress charges, use private links for internal communication\n• Unused Resources: Identify and remove unused resources, services, and databases\n• Architectural Changes: Serverless vs containers vs VMs trade-offs\n• Scheduling: Scale down non-critical systems during off-hours\n• Database Optimization: Connection pooling, query optimization, index cleanup\n• Monitoring: Cost attribution by service, team, or project\n• FinOps: Implement cost governance and budgeting practices\n\nRecommended tools: Cloud Cost Analytics, Kubecost, Cloudability, Infracost",
  
  "System Documentation Review": "SYSTEM DOCUMENTATION & KNOWLEDGE MANAGEMENT\n\nDocumentation audit:\n• Architecture Documentation: Current system diagrams, decision records, and rationale\n• API Documentation: OpenAPI/Swagger specs with examples and error codes\n• Runbooks: Step-by-step procedures for common operations and troubleshooting\n• Troubleshooting Guides: Known issues, solutions, and escalation procedures\n• Deployment Guides: Environment setup, configuration, and deployment procedures\n• Architecture Decision Records (ADRs): Rationale for major technical decisions\n• Onboarding Materials: Quick-start guides for new team members\n• Dependency Maps: Understand service dependencies and communication flows\n• Glossary: Define domain-specific terminology and acronyms\n• Video Tutorials: Record walkthroughs for complex procedures\n\nRecommended tools: MkDocs, Confluence, Notion, GitHub Wiki, Archimate diagrams"
};

export async function generateChatResponse(messages: Message[]): Promise<string> {
  const model = "gemini-3-flash-preview";
  
  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating response:", error);
    return "An error occurred while communicating with the AI. Please try again.";
  }
}

export async function* generateChatResponseStream(messages: Message[]) {
  const model = "gemini-3-flash-preview";
  
  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  try {
    const response = await ai.models.generateContentStream({
      model,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    for await (const chunk of response) {
      yield chunk.text || "";
    }
  } catch (error) {
    console.error("Error generating streaming response:", error);
    // Yield a special marker for fallback mode
    yield "___FALLBACK_MODE___";
  }
}
