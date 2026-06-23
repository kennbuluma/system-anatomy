import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Code, 
  Zap, 
  Shield, 
  Cpu, 
  Terminal, 
  ArrowRight, 
  BarChart3, 
  Layers, 
  User, 
  Database, 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onSetPreloadPrompt?: (prompt: string) => void;
  onGoToAuth: () => void;
}

export default function LandingPage({ onStart, onSetPreloadPrompt, onGoToAuth }: LandingPageProps) {
  // Navigation active tab tracking
  const [activeSection, setActiveSection] = useState('hero');
  
  // Interactive node selector state
  const [selectedNode, setSelectedNode] = useState<string>('db_master');
  
  // Terminal commands widget state
  const [terminalHistory, setTerminalHistory] = useState<Array<{ type: 'input' | 'output'; text: string }>>([
    { type: 'output', text: 'SYSTEM ANATOMY BOOT v4.8.0...' },
    { type: 'output', text: 'ARCHITECT CREDENTIALS LOADED: KENN BULUMA (SENIOR PLATFORM ARCHITECT)' },
    { type: 'output', text: 'Enter "help" to view diagnostic options.' }
  ]);
  const [terminalInput, setTerminalInput] = useState('');

  // Diagnostic wizard state
  const [concurrentUsers, setConcurrentUsers] = useState<number>(1200);
  const [dbRecords, setDbRecords] = useState<string>('10M+');
  const [apiLatency, setApiLatency] = useState<number>(310);
  const [cloudProvider, setCloudProvider] = useState<string>('GCP');
  const [primaryBottleneck, setPrimaryBottleneck] = useState<string>('db_locks');
  const [contactEmail, setContactEmail] = useState('');
  const [triageSubmitted, setTriageSubmitted] = useState(false);
  const [triageLoading, setTriageLoading] = useState(false);

  // Anonymized Specimens accordion state
  const [expandedSpecimen, setExpandedSpecimen] = useState<number | null>(0);

  // live system generation simulation
  const [telemetry, setTelemetry] = useState({
    cpuUsage: 42,
    dbConnections: 188,
    responseTimeMs: 24,
    cacheHitRate: 98.4,
    activeThreats: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        cpuUsage: Math.floor(38 + Math.random() * 12),
        dbConnections: Math.floor(180 + Math.random() * 15),
        responseTimeMs: Math.floor(21 + Math.random() * 6),
        cacheHitRate: parseFloat((98.1 + Math.random() * 0.6).toFixed(2)),
        activeThreats: 0
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Compute calculated Architectural Risk Score based on inputs
  const calculateEntropyScore = () => {
    let base = 25;
    if (concurrentUsers > 5000) base += 25;
    else if (concurrentUsers > 2000) base += 15;
    
    if (dbRecords === '100M+') base += 20;
    else if (dbRecords === '50M+') base += 12;

    if (apiLatency > 400) base += 25;
    else if (apiLatency > 200) base += 15;

    if (primaryBottleneck === 'db_locks') base += 15;
    if (primaryBottleneck === 'memory_leak') base += 20;
    if (primaryBottleneck === 'io_wait') base += 10;
    
    return Math.min(base, 99);
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    const newHistory = [...terminalHistory, { type: 'input' as const, text: terminalInput }];

    switch(cmd) {
      case 'help':
        newHistory.push({ type: 'output', text: 'AVAILABLE PROTOCOLS:\n  - ls             List components\n  - cat bio.md     Fetch architect credentials\n  - cat tech.json   Dissect stack expertise\n  - stats          Print active telemetry specs\n  - clear          Flush console buffer' });
        break;
      case 'ls':
        newHistory.push({ type: 'output', text: 'DIRECTORY EXPORT:\n  - bio.md             [1.2 KB] ROOT_CREDENTIALS\n  - tech.json          [0.8 KB] SYSTEM_Expertise\n  - specimen_db.bin    [256 KB] ANONYMIZED_TELEMETRY\n  - forever_arc.yaml   [4.1 KB] TARGET_BLUEPRINTS' });
        break;
      case 'cat bio.md':
        newHistory.push({ type: 'output', text: 'BIO.MD DECONSTRUCTION:\n  - NAME: Kenn Buluma\n  - ROLE: Principal Systems Architect & Fractional CTO\n  - TRACK: 8+ Years Enterprise Platform & Scale Engineering\n  - METRICS: Designed & maintained backend architectures servicing up to 12.5M concurrent queries daily.\n  - PHILOSOPHY: Write zero-noise, predictable, hyper-optimized infrastructure. Eliminate resource leaks before they bleed runway.' });
        break;
      case 'cat tech.json':
        newHistory.push({ type: 'output', text: 'TECH.JSON CORE CONFIG:\n{\n  "languages": ["Node.JS/TypeScript", "Go", "Java/C++", "C#"],\n  "databases": ["PostgreSQL (Expert-Level Lock Resolution)", "Redis (Sub-ms caching)", "Elastic", "Spanner"],\n  "infrastructure": ["GCP/Firebase", "AWS Cloud Engine", "Kubernetes", "Docker Engine", "TerraformIAC"],\n  "specialties": ["Distributed Consensus", "Connection Pooling", "Zero-Allocation Parsing", "Low-Latency pipelines"]\n}' });
        break;
      case 'stats':
        newHistory.push({ type: 'output', text: `SYS STATS READOUT:\n  - AVG API DELAY: ${telemetry.responseTimeMs}ms\n  - DB SEED CONNECTION POOL: ${telemetry.dbConnections}/512\n  - CACHE EXPLOITATION LEVEL: ${telemetry.cacheHitRate}%\n  - ENGINE CPU LOAD: ${telemetry.cpuUsage}%\n  - HEALTH THREAT CODE: 0x000 (SECURE_NOMINAL)` });
        break;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;
      default:
        newHistory.push({ type: 'output', text: `ERR: COMM_PROTOCOL_UNRECOGNIZED: "${cmd}". Enter "help" for a roadmap of permissible queries.` });
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  const submitTriageRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail.trim()) return;

    setTriageLoading(true);

    const entropy = calculateEntropyScore();
    const recommendedAction = entropy > 70 
      ? "IMMEDIATE ARCHITECTURAL HOTFIX REQUIRED." 
      : entropy > 45 
        ? "ARCHITECTURE ASSURANCE INTERVENTION RECOMMEND."
        : "PREVENTATIVE ANALYSIS ADVISED.";

    // Save triage context to transmit directly to the chat session
    const preprompt = `SYSTEM DIAGNOSTIC RUNTIME EXPORT:
- Business Email: ${contactEmail}
- Target Infrastructure Provider: ${cloudProvider}
- Traffic Velocity Profile: ${concurrentUsers} concurrent active routines
- DB Seed Density: ${dbRecords} records in dataset
- Average Platform Latency: ${apiLatency}ms Response Wait time
- Identified Primary Core Constraint: ${primaryBottleneck}
- Computed System Entropy Score: ${entropy}%
- Recommended Protocol Action: ${recommendedAction}

Hello Kenn, I am requesting a 30-Minute Architecture Triage based on these computed architectural risk parameters. Let's analyze my bottleneck context:`;

    if (onSetPreloadPrompt) {
      onSetPreloadPrompt(preprompt);
    }

    setTimeout(() => {
      setTriageLoading(false);
      setTriageSubmitted(true);
    }, 1200);
  };

  const handleLaunchChatWithState = () => {
    const entropy = calculateEntropyScore();
    const recommendedAction = entropy > 70 
      ? "IMMEDIATE ARCHITECTURAL HOTFIX REQUIRED." 
      : "PREVENTATIVE STRUCTURE VERIFICATION ADVISABLE.";
    
    const prefilledText = `I would like to run a diagnostic analysis for my environment:
- Infrastructure Model: ${cloudProvider}
- Current Active Concurrent Sockets: ${concurrentUsers}
- System Dataset Depth: ${dbRecords}
- Platform Average API Latency: ${apiLatency}ms
- Identified Primary Resource Bottleneck: ${primaryBottleneck}
- Computed Entropy Vector: ${entropy}%
- Priority Mandate: ${recommendedAction}`;

    if (onSetPreloadPrompt) {
      onSetPreloadPrompt(prefilledText);
    }
    onStart(); // Launch the chat view
  };

  // Node architecture metrics reference
  const nodes: Record<string, { label: string; status: string; metric: string; desc: string }> = {
    load_balancer: {
      label: 'Edge Gateway (Load Balancer)',
      status: 'NOMINAL',
      metric: 'nginx-ingress rps: 8,421',
      desc: 'Layer 7 load balancing with SSL termination. Distributes incoming socket queues linearly over active compute shards.'
    },
    api_gateway: {
      label: 'API Core gateway Shards',
      status: 'NOMINAL',
      metric: 'Active pods: 12/12',
      desc: 'Orchestrating authentication routines, rate limiting, system trace correlation contexts, and asynchronous webhook dispatching.'
    },
    db_master: {
      label: 'PostgreSQL Database (Primary DB)',
      status: 'DEGRADED_STATE',
      metric: 'Row Lock Wait Time: 780ms',
      desc: 'Exhibiting deadlock escalation under concurrent writes. Index scan coverage stands at only 34%, forcing sequential disc scans.'
    },
    redis_replica: {
      label: 'Redis Session Cache Cluster',
      status: 'OPTIMAL',
      metric: 'Cache hit level: 98.4%',
      desc: 'In-memory dynamic storage key structures executing session evaluations and query output caching. Avoids DB thrashing.'
    },
    worker_pool: {
      label: 'RabbitMQ Async Worker Cluster',
      status: 'NOMINAL',
      metric: 'Pending Shard Queue: 12 items',
      desc: 'Processing heavyweight analytical database updates and parallel cloud storage transactions out of band.'
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white overflow-x-hidden relative">
      
      {/* Decorative backgrounds removed for a clean, simple layout */}

      {/* FIXED TOP HEADER & TELEMETRY */}
      <nav className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 md:px-12 z-50 border-b border-[#d1d1d1] bg-white/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-black animate-pulse rounded-full" />
          <span className="font-mono text-sm font-bold tracking-[0.25em] uppercase text-black">
            systemanatomy<span className="text-black">.dev</span>
          </span>
          <span className="hidden lg:inline-block font-mono text-[9px] px-2 py-0.5 border border-[#d5d5d5] bg-[#f5f5f5] rounded text-[#4d4d4d]">
            NODE: L_GW_04
          </span>
        </div>
        
        {/* Navigation Shards */}
        <div className="hidden md:flex items-center gap-8 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#4d4d4d]">
          <a href="#anatomy" className="hover:text-black hover:underline transition-all underline-offset-4">01. Anatomy Specs</a>
          <a href="#specimens" className="hover:text-black hover:underline transition-all underline-offset-4">02. Specimens</a>
          <a href="#architect" className="hover:text-black hover:underline transition-all underline-offset-4">03. Credentials</a>
          <a href="#triage" className="hover:text-black hover:underline transition-all underline-offset-4">04. Consultation</a>
        </div>

        <button 
          onClick={onStart}
          className="px-4 py-2 border border-[#00000033] text-black font-mono text-[10px] uppercase font-bold tracking-widest bg-transparent hover:bg-[#f2f2f2] active:bg-[#e8e8e8] transition-all cursor-pointer"
        >
          [ ANALYZER PORTAL ]
        </button>
        <button
          onClick={onGoToAuth}
          className="px-4 py-2 border border-[#00000033] text-black font-mono text-[10px] uppercase font-bold tracking-widest bg-transparent hover:bg-[#f2f2f2] active:bg-[#e8e8e8] transition-all cursor-pointer"
        >
          [ AUDIT DASHBOARD ]
        </button>
      </nav>

      {/* SYSTEM TELEMETRY STRIP - Beneath Navbar */}
      <div className="pt-16 border-b border-[#dcdcdc] bg-[#f7f7f7] relative z-40">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex flex-wrap justify-between items-center gap-4 text-xs text-[#4d4d4d] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping" />
            <span className="uppercase text-[9px] tracking-wider text-[#a3a3a3]">Live Diagnostic Stream</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 lg:gap-10 text-[10px]">
            <div>API DELAY: <span className="text-black font-bold">{telemetry.responseTimeMs}ms</span></div>
            <div>CONN LIMITS: <span className="text-black font-bold">{telemetry.dbConnections}/512</span></div>
            <div>CACHE EXPLOIT: <span className="text-black font-bold">{telemetry.cacheHitRate}%</span></div>
            <div>SYS CORE TEMP: <span className="text-black font-bold">{telemetry.cpuUsage}% LOAD</span></div>
            <div className="hidden sm:block">DIAGNOSTIC HIERARCHY: <span className="text-black">NOMINAL_RESTORE_ACTIVE</span></div>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <header id="hero" className="relative pt-20 pb-28 px-6 md:px-12 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Credentials copy */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3  border border-[#d5d5d5] bg-[#f7f7f7] font-mono text-[9px] uppercase tracking-[0.25em] text-black py-1.5 rounded-none">
              <Terminal className="w-3.5 h-3.5 animate-pulse" />
              <span>PRINCIPAL SYSTEMS AUDITOR & FRACTIONAL CTO</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.9] text-black uppercase">
              Eliminating <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-[#4d4d4d] to-black">Architectural</span> <br />
              Entropy.
            </h1>

            <p className="text-[#4d4d4d] text-sm md:text-base leading-relaxed max-w-xl font-sans">
              Precision engineering and Fractional CTO services for scaling startups and FinTech enterprises. We dissect bottleneck constraints, construct highly redundant system blueprints, and build strictly backend database foundations that do not fail under scale.
            </p>

            {/* CTA Elements */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 font-mono">
              <a 
                href="#triage"
                className="px-8 py-4 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-[#111111] active:bg-[#222222] transition-colors flex items-center justify-center gap-3 text-center"
              >
                <span>Request a 30-Minute Architecture Triage</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </a>
              <a 
                href="#anatomy"
                className="px-8 py-4 border border-[#cccccc] hover:border-[#666] bg-[#f7f7f7] text-black text-[10px] font-bold uppercase tracking-widest transition-all text-center"
              >
                View Methodology
              </a>
            </div>

            {/* Quick trust metric badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#e0e0e0] max-w-lg font-mono text-[10px]">
              <div>
                <p className="text-[#4d4d4d] uppercase tracking-wider mb-1">Scale Threshold</p>
                <p className="text-black font-bold text-sm">12.5M DAILY REQS</p>
              </div>
              <div>
                <p className="text-[#4d4d4d] uppercase tracking-wider mb-1">Track Record</p>
                <p className="text-black font-bold text-sm">8+ YEARS LEADERSHIP</p>
              </div>
              <div>
                <p className="text-[#4d4d4d] uppercase tracking-wider mb-1">Focused Shards</p>
                <p className="text-black font-bold text-sm">FINTECH / HIGH-CONCURRENCY</p>
              </div>
            </div>
          </div>

          {/* Interactive Live Target Architecture Map (Visual Component) */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="border border-[#d8d8d8] bg-[#f7f7f7] p-6 relative overflow-hidden group rounded-none">
              
              {/* Monospace decorative grid indicators */}
              <div className="absolute top-2 right-3 font-mono text-[8px] opacity-25 text-[#4d4d4d]">
                MODULE: NODE_DIAG_MAP_X402
              </div>

              <div className="mb-6 flex items-center gap-3">
                <div className="w-3 h-3 border border-[#cccccc] flex items-center justify-center bg-[#f5f5f5]">
                  <Layers className="w-2 h-2 text-black" />
                </div>
                <h3 className="font-mono text-[10px] font-bold text-[#5a5a5a] uppercase tracking-widest">
                  Live System Node Diagnostics
                </h3>
              </div>

              {/* Interactive SVG Node Diagram representing physical servers */}
              <div className="relative h-64 bg-[#f3f3f3] border border-[#d8d8d8] flex items-center justify-center p-4">
                
                {/* Visual Connector cables using styled SVGs */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                  <path d="M 50 130 L 150 70" stroke="#222" strokeWidth="1.5" strokeDasharray="4 2" />
                  <path d="M 50 130 L 150 190" stroke="#222" strokeWidth="1.5" />
                  <path d="M 150 70 L 250 130" stroke="#222" strokeWidth="1.5" />
                  <path d="M 150 190 L 250 130" stroke="#222" strokeWidth="1.5" />
                  <path d="M 250 130 L 350 130" stroke="#000000" strokeWidth="1.5" />
                  
                  {/* Dynamic packet transfer animations */}
                  <circle r="3" fill="#000000" style={{ transformBox: 'fill-box' }}>
                    <animateMotion dur="4s" repeatCount="Infinity" path="M 150 70 L 250 130" />
                  </circle>
                  <circle r="2.5" fill="#444444" style={{ transformBox: 'fill-box' }}>
                    <animateMotion dur="2.5s" repeatCount="Infinity" path="M 250 130 L 320 130" />
                  </circle>
                </svg>

                {/* Node Shards mapped layout */}
                <div className="relative w-full h-full flex flex-col justify-between" style={{ zIndex: 11 }}>
                  
                  {/* Row 1: Load Balancer & Shards */}
                  <div className="flex justify-between items-center px-4">
                    <button 
                      onClick={() => setSelectedNode('load_balancer')} 
                      className={`px-2 py-1.5 border text-[9px] font-mono transition-all ${
                        selectedNode === 'load_balancer' 
                          ? 'border-black text-black bg-[#f4f4f4]' 
                          : 'border-[#d8d8d8] text-[#4d4d4d] hover:border-white'
                      }`}
                    >
                      [ L_BAL ]
                    </button>
                    
                    <button 
                      onClick={() => setSelectedNode('api_gateway')} 
                      className={`px-2 py-1.5 border text-[9px] font-mono transition-all ${
                        selectedNode === 'api_gateway' 
                          ? 'border-black text-black bg-[#f4f4f4]' 
                          : 'border-[#d8d8d8] text-[#4d4d4d] hover:border-white'
                      }`}
                    >
                      [ API_GW ]
                    </button>
                  </div>

                  {/* Row 2: Secondary core logic */}
                  <div className="flex justify-around items-center">
                    <button 
                      onClick={() => setSelectedNode('redis_replica')} 
                      className={`px-2 py-1.5 border text-[9px] font-mono transition-all ${
                        selectedNode === 'redis_replica' 
                          ? 'border-black text-black bg-[#f4f4f4]' 
                          : 'border-[#d8d8d8] text-[#4d4d4d] hover:border-white'
                      }`}
                    >
                      [ REDIS_CACHE ]
                    </button>
                  </div>

                  {/* Row 3: PostgreSQL Database Master (Degraded node highlight) */}
                  <div className="flex justify-between items-center px-4">
                    <button 
                      onClick={() => setSelectedNode('db_master')} 
                      className={`px-2 py-1.5 border text-[9px] font-mono transition-all relative ${
                        selectedNode === 'db_master' 
                          ? 'border-[#808080] text-[#4d4d4d] bg-[#f4f4f4]' 
                          : 'border-[#d8d8d8] text-[#4d4d4d] hover:border-[#808080]'
                      }`}
                    >
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                      [ DB_POSTGRES ]
                    </button>

                    <button 
                      onClick={() => setSelectedNode('worker_pool')} 
                      className={`px-2 py-1.5 border text-[9px] font-mono transition-all ${
                        selectedNode === 'worker_pool' 
                          ? 'border-black text-black bg-[#f4f4f4]' 
                          : 'border-[#d8d8d8] text-[#4d4d4d] hover:border-white'
                      }`}
                    >
                      [ WORKER_QUE ]
                    </button>
                  </div>

                </div>
              </div>

              {/* Dynamic Readout of Clicked Node */}
              <div className="mt-4 p-4 border border-[#d1d1d1] bg-[#f3f3f3] font-mono rounded-none">
                <div className="flex justify-between items-center border-b border-[#d1d1d1] pb-2 mb-2">
                  <span className="text-[10px] text-black font-bold uppercase">
                    {nodes[selectedNode].label}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 font-bold ${
                    nodes[selectedNode].status.includes('DEGRADED') 
                      ? 'bg-[#f4f4f4] text-[#4d4d4d] border border-[#d8d8d8]' 
                      : 'bg-black/10 text-black border border-black/30'
                  }`}>
                    {nodes[selectedNode].status}
                  </span>
                </div>
                <p className="text-[10px] text-[#4d4d4d] leading-relaxed mb-2 font-sans">
                  {nodes[selectedNode].desc}
                </p>
                <div className="text-[9px] text-black flex justify-between">
                  <span>METRIC_DENSITY:</span>
                  <span>{nodes[selectedNode].metric}</span>
                </div>
              </div>

              {/* Technical disclaimer */}
              <p className="mt-3 text-[8.5px] text-[#555] font-mono uppercase tracking-wider text-center">
                Interactive node panel. Select Shards for physical anatomy readout.
              </p>

            </div>
          </div>

        </div>
      </header>

      {/* SECTION 2: THE CORE FRAMEWORKS / SERVICES COMPONENT */}
      <section id="anatomy" className="py-28 px-6 md:px-12 border-t border-[#e0e0e0] relative z-20">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end mb-20">
            <div className="lg:col-span-8">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-black mb-3">
                01 // SERVICES & BLUEPRINTS
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-black">
                Core Engineering Frameworks
              </h3>
            </div>
            <div className="lg:col-span-4">
              <p className="text-xs text-[#4d4d4d] max-w-sm leading-relaxed font-sans">
                Our capabilities are separated neatly based on implementation intensity. We interface both with senior technologists on lock hierarchies and with founders on runway safety.
              </p>
            </div>
          </div>

          {/* Pillars: Infrastructure vs Leadership comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 font-mono">
            
            {/* PILLAR A: Deep-Tier Systems Anatomy (For CTOs/VPEs) */}
            <div className="border border-[#d8d8d8] bg-[#f7f7f7] p-8 space-y-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start border-b border-[#d8d8d8] pb-6 mb-6">
                  <div>
                    <span className="text-[9px] text-black block mb-1">PILLAR A_STAGES</span>
                    <h4 className="text-lg font-bold uppercase text-black tracking-widest">
                      Deep-Tier Systems Anatomy
                    </h4>
                  </div>
                  <Database className="w-5 h-5 text-black" />
                </div>
                
                <p className="text-xs text-[#4d4d4d] mb-8 font-sans leading-relaxed">
                  Engineered exclusively for hands-on engineering directors, CTOs, and tech leaders facing physical scalability boundaries, code decay, and database thrashing.
                </p>

                {/* Grid layout of 2 Target Service metrics */}
                <div className="space-y-8">
                  
                  {/* Service 1 */}
                  <div className="p-4 border border-[#ffffff03] bg-[#f3f3f3] hover:border-[#cccccc]/40 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 border border-[#d8d8d8] flex items-center justify-center text-[10px] text-black font-bold">
                        01
                      </div>
                      <h5 className="text-xs font-bold text-black uppercase tracking-wider">
                        High-Concurrency Backend Performance
                      </h5>
                    </div>
                    <p className="text-[11px] text-[#4d4d4d] leading-relaxed font-sans pl-9">
                      Low-latency optimization from the database layer upward. Deep, surgical expertise in PostgreSQL execution paths, transaction lock resolutions, connection pooling limits, and Redis caching layers for sub-millisecond authentication and session management.
                    </p>
                  </div>

                  {/* Service 2 */}
                  <div className="p-4 border border-[#ffffff03] bg-[#f3f3f3] hover:border-[#cccccc]/40 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 border border-[#d8d8d8] flex items-center justify-center text-[10px] text-black font-bold">
                        02
                      </div>
                      <h5 className="text-xs font-bold text-black uppercase tracking-wider">
                        Resilient Cloud Modernization
                      </h5>
                    </div>
                    <p className="text-[11px] text-[#4d4d4d] leading-relaxed font-sans pl-9">
                      Designing bulletproof cloud deployment architectures and zero-downtime release pipelines utilizing Google Cloud Platform (GCP) and Firebase. We orchestrate reliable infrastructure using Terraform, guaranteeing zero deployment drift and absolute isolation of development parameters.
                    </p>
                  </div>

                </div>
              </div>

              <div className="pt-4 border-t border-[#d1d1d1]/80 flex justify-between items-center text-[10px] text-neutral-500">
                <span>AUDIT_DEPTH: LEVEL_3_DIAGNOSTICS</span>
                <span className="text-black">CODENAME: CONCURRENCY</span>
              </div>
            </div>

            {/* PILLAR B: Fractional Technical Leadership (For CEOs/Founders) */}
            <div className="border border-[#d8d8d8] bg-[#f7f7f7] p-8 space-y-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start border-b border-[#d8d8d8] pb-6 mb-6">
                  <div>
                    <span className="text-[9px] text-black block mb-1">PILLAR B_STAGES</span>
                    <h4 className="text-lg font-bold uppercase text-black tracking-widest">
                      Fractional Technical Leadership
                    </h4>
                  </div>
                  <Server className="w-5 h-5 text-black" />
                </div>
                
                <p className="text-xs text-[#4d4d4d] mb-8 font-sans leading-relaxed">
                  Tailored design for founders, executives, start-up CEOs and business leaders requiring reliable high-level tech strategy, cost audits, or scaling support.
                </p>

                {/* Grid layout of 2 Target Service metrics */}
                <div className="space-y-8">
                  
                  {/* Service 3 */}
                  <div className="p-4 border border-[#ffffff03] bg-[#f3f3f3] hover:border-[#cccccc]/40 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 border border-[#d8d8d8] flex items-center justify-center text-[10px] text-black font-bold">
                        03
                      </div>
                      <h5 className="text-xs font-bold text-black uppercase tracking-wider">
                        Architectural System Audits
                      </h5>
                    </div>
                    <p className="text-[11px] text-[#4d4d4d] leading-relaxed font-sans pl-9">
                      A brutal, impartial diagnostic analysis of your current backend stack. We identify memory leaks, compute-throttled bottleneck constraints, sequential table-scan penalties, and server-side security vulnerabilities before they crash your production environment.
                    </p>
                  </div>

                  {/* Service 4 */}
                  <div className="p-4 border border-[#ffffff03] bg-[#f3f3f3] hover:border-[#cccccc]/40 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 border border-[#d8d8d8] flex items-center justify-center text-[10px] text-black font-bold">
                        04
                      </div>
                      <h5 className="text-xs font-bold text-black uppercase tracking-wider">
                        Fractional CTO Advisory
                      </h5>
                    </div>
                    <p className="text-[11px] text-[#4d4d4d] leading-relaxed font-sans pl-9">
                      On-demand, senior technical leadership and strategic engineering direction. We bridge the gap between your immediate business runway and your engineering team's output, vetting senior hires, optimizing hosting overhead, and preventing expensive architectural rewrites.
                    </p>
                  </div>

                </div>
              </div>

              <div className="pt-4 border-t border-[#d1d1d1]/80 flex justify-between items-center text-[10px] text-neutral-500">
                <span>INTUITION_METRICS: BUSINESS_VELOCITY</span>
                <span className="text-black">CODENAME: PREVENT_REWRITES</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 3: PROVEN SPECIMENS / CASE STUDIES (NDA-Compliant) */}
      <section id="specimens" className="py-28 px-6 md:px-12 border-t border-[#e0e0e0] bg-[#f7f7f7]/40 relative z-20">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-20">
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-black mb-3">
              02 // TRACK RECORD SPECIMENS
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-black">
              Surgical Interventions
            </h3>
            <p className="text-xs text-[#4d4d4d] max-w-xl mt-4 font-sans leading-relaxed">
              NDA and intellectual property structures forbid sharing individual internal git repositories. Instead, we analyze 3 specific, real system deconstructions demonstrating enterprise performance gains and resource restorations from current/past systems.
            </p>
          </div>

          {/* Interactive Collapsible / Tabbed Specimens Accordion */}
          <div className="space-y-4 max-w-4xl font-mono">
            {[
              {
                id: 1,
                title: 'Case 1: Banking Backbone Overhaul',
                focus: 'Legacy migration to modern Java/Spring Boot microservices',
                problem: 'Legacy Oracle mainframe systems throttling transactions to 180ms avg latency. Rigid monolithic deployment loops resulting in multi-hour maintenance windows and high outage rates.',
                intervention: 'Spearheaded gradual strand-by-strand deconstruction of monolithic nodes. Migrated to containerized Java 21 / Spring Boot microservices on Kubernetes. Restructured relational schema to enable parallel distributed processing.',
                outcome: 'Reduced transaction compute overhead by 45%. Saved $120,000 annually in redundant mainframe licenses and cloud overhead, restoring 99.99% core transaction availability.'
              },
              {
                id: 2,
                title: 'Case 2: FinTech Scaling Protocol',
                focus: 'PostgreSQL indexing and horizontal scaling for transaction volume',
                problem: 'Critical write amplification locks on checkout ledger datasets. Rapid volume amplification caused sequential table scans, locking database routines and causing transaction timeouts.',
                intervention: 'Re-architected database connection allocations and pooled lock systems. Implemented vertical database splitting, PostgreSQL table partitioning, partial dynamic B-Tree indexing, and query path tuning.',
                outcome: 'Successfully scaled the transactional engine to support 12,000 peak requests/sec. Latency collapsed by 72% from 400ms to 12ms under concurrent peak loads.'
              },
              {
                id: 3,
                title: 'Case 3: High-Velocity Authentication Architecture',
                focus: 'Engineered a secure, low-latency authentication and session storage system utilizing Redis cache on a high-traffic platform',
                problem: 'User session verification latency of 180ms causing sluggish response times. Relational storage of dynamic JWT caches and session maps resulted in extreme read amplification bottlenecks.',
                intervention: 'Engineered secure session caching models utilizing a distributed Redis cluster with automatic key evictions. Standardized dynamic JWT encryption strategies, relieving core backend servers from persistent state validation.',
                outcome: 'Restored sub-millisecond response latency for security validation checks. Relieved master database CPU overhead by 68% and fully eliminated authentication login timeout faults.'
              }
            ].map((specimen, idx) => {
              const isOpen = expandedSpecimen === idx;
              return (
                <div 
                  key={specimen.id}
                  className={`border transition-all ${
                    isOpen ? 'border-black bg-[#f3f3f3]' : 'border-[#d1d1d1] bg-[#f3f3f3] hover:border-[#cccccc]'
                  }`}
                >
                  <button
                    onClick={() => setExpandedSpecimen(isOpen ? null : idx)}
                    className="w-full text-left p-6 flex justify-between items-center gap-4 cursor-pointer"
                  >
                    <div>
                      <span className="text-[9px] text-black font-mono tracking-wider block mb-1">
                        SPECIMEN_0{specimen.id} // FOCUS: {specimen.focus}
                      </span>
                      <h4 className="text-sm md:text-base font-bold uppercase text-black tracking-wide">
                        {specimen.title}
                      </h4>
                    </div>
                    <div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-black" />
                      ) : (
                        <ChevronDown className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 border-t border-[#dcdcdc] space-y-4 text-xs font-sans">
                          {/* Problem/Intervention/Outcome Breakdown */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                            
                            <div className="space-y-2 border-l border-[#808080]/30 pl-4 bg-red-950/5 p-3">
                              <span className="font-mono text-[9px] font-bold text-[#4d4d4d] block tracking-wider uppercase">
                                [01_IDENTIFIED_PAIN]
                              </span>
                              <p className="text-[#5a5a5a] leading-relaxed text-[11px]">
                                {specimen.problem}
                              </p>
                            </div>

                            <div className="space-y-2 border-l border-black/30 pl-4 bg-black/5 p-3">
                              <span className="font-mono text-[9px] font-bold text-black block tracking-wider uppercase">
                                [02_ENGINEER_RESOLVE]
                              </span>
                              <p className="text-[#5a5a5a] leading-relaxed text-[11px]">
                                {specimen.intervention}
                              </p>
                            </div>

                            <div className="space-y-2 border-l border-white/20 pl-4 bg-white/[0.02] p-3">
                              <span className="font-mono text-[9px] font-bold text-black block tracking-wider uppercase">
                                [03_BUSINESS_OUTCOME]
                              </span>
                              <p className="text-black/90 font-medium leading-relaxed text-[11px]">
                                {specimen.outcome}
                              </p>
                            </div>

                          </div>

                          <div className="flex justify-end pt-4 font-mono text-[8.5px] text-[#555]">
                            REF_INTEGRITY_VERIFIABLE_VIA_LINKEDIN
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 4: THE PEDIGREE & HUMAN TRUST (De-anonymization) */}
      <section id="architect" className="py-28 px-6 md:px-12 border-t border-[#e0e0e0] relative overflow-hidden z-20">
        
        {/* Subtle decorative grid backing */}
        <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] bg-black/5 blur-[80px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Biography Copy */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-black mb-3">
                03 // PRINCIPAL CREDENTIALS
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-black">
                Engineered by Kenn Buluma
              </h3>
              
              <p className="text-xs font-mono text-[#4d4d4d] uppercase tracking-widest pl-2 border-l border-black">
                8+ years specializing in core platform diagnostics and high-concurrency infrastructures.
              </p>

              <div className="text-xs space-y-4 text-[#5a5a5a] font-sans leading-relaxed">
                <p>
                  I construct reliable scale mechanisms for technical founders and enterprise decision-makers. Having designed infrastructure systems handling over 12 million concurrent operations daily in past corporate tech positions, I transition this knowledge directly to scaling clients.
                </p>
                <p>
                  As an independent Fractional CTO and Platform Consultant, my priority is straightforward: write highly predictable, self-healing platforms that safeguard investment runway, keep API response latency low, and eliminate database congestion. I do not engage in trendy frameworks or over-engineered infrastructure hype. My work represents architectural pragmatism and technical execution.
                </p>
              </div>

              {/* Verified Links & Actions */}
              <div className="flex flex-wrap items-center gap-6 pt-4 font-mono text-[10px]">
                <a 
                  href="https://linkedin.com"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-black hover:text-black transition-colors underline underline-offset-4 decoration-neutral-700 hover:decoration-black"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Verify Credentials on LinkedIn</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                <span className="text-[#333]">|</span>

                <span className="text-[#4d4d4d]">
                  GCP CERTIFIED SECURITY SPECS // AWS CORES
                </span>
              </div>
            </div>

            {/* Interactive Terminal Widget Mock representing real-time bio diagnostics */}
            <div className="lg:col-span-5">
              <div className="border border-[#d8d8d8] bg-[#f3f3f3] font-mono text-xs rounded-none shadow-2xl relative">
                
                {/* Header terminal controls */}
                <div className="bg-[#0f0f0f] px-4 py-3 border-b border-[#d1d1d1] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-red-500/30 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-yellow-500/30 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-black/30 rounded-full" />
                  </div>
                  <span className="text-[9px] text-[#666] tracking-widest">systemanatomy_cli_v1.0.sh</span>
                  <Terminal className="w-3.5 h-3.5 text-[#555]" />
                </div>

                {/* Simulated Screen with text */}
                <div className="p-4 h-64 overflow-y-auto space-y-2 text-[11px] text-black/80 scrollbar-thin scrollbar-thumb-neutral-800">
                  {terminalHistory.map((item, index) => (
                    <div key={index} className="whitespace-pre-wrap leading-relaxed">
                      {item.type === 'input' ? (
                        <div className="text-[#4d4d4d]">
                          guest@systemanatomy:~$ <span className="text-black">{item.text}</span>
                        </div>
                      ) : (
                        <div className="text-[#4d4d4d] font-mono text-[10.5px]">
                          {item.text}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Input handler */}
                <form onSubmit={handleTerminalSubmit} className="border-t border-[#d1d1d1] bg-white px-4 py-3 flex items-center gap-2">
                  <span className="text-[#4d4d4d] font-bold">guest@systemanatomy:~$</span>
                  <input 
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Type help or ls..."
                    className="flex-1 bg-transparent text-black border-none outline-none focus:ring-0 text-[11px] font-mono p-0"
                  />
                  <button type="submit" className="text-[10px] text-[#4d4d4d] hover:text-black uppercase tracking-wider">
                    EXECUTE
                  </button>
                </form>

              </div>
              <p className="text-[8.5px] text-[#555] font-mono text-center mt-2.5 uppercase tracking-wider">
                Type <span className="text-[#4d4d4d]">cat bio.md</span> or <span className="text-[#4d4d4d]">cat tech.json</span> above for credential variables.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: INTERACTIVE TRIAGE WIZARD & CONVERSION FUNNEL */}
      <section id="triage" className="py-28 px-6 md:px-12 border-t border-[#e0e0e0] bg-[#0c0c0c]/80 relative z-20">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Copy Side */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-black mb-3">
                04 // INTERACTIVE TRIAGE FUNNEL
              </h2>
              <h3 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-black">
                Your MVP is breaking under scale. Let's build your Forever Architecture.
              </h3>
              
              <p className="text-[#4d4d4d] text-sm font-sans leading-relaxed">
                Do not wait for database locks to result in dynamic failure vectors or security exposure. Fill out our simple on-site diagnostic matrix to calculate your system risk parameters instantly. 
              </p>

              <div className="p-5 border border-[#d1d1d1] bg-[#f3f3f3] font-mono space-y-3 rounded-none">
                <span className="text-[9px] font-bold text-black block tracking-wide uppercase">
                  [REDUCE_CONVERSTION_FRICTION]
                </span>
                <p className="text-[11px] text-[#5a5a5a] leading-relaxed font-sans">
                  No forceful enterprise pricing agreements. This diagnostic triage lets us explore one active query leak, analyze GCP configuration settings, and give real, immediate system audits before finalizing consultation agreements.
                </p>
                <div className="text-[10px] text-neutral-500">
                  CODE COGNIZANCE: <span className="text-black">AUD-01 SYSTEMATIC</span>
                </div>
              </div>

              {/* Launch Chat Prompt */}
              <div className="pt-4 border-t border-[#e0e0e0] space-y-3">
                <p className="font-mono text-[10px] text-[#4d4d4d] uppercase tracking-widest">
                  Prefer direct diagnostic AI audits?
                </p>
                <button
                  onClick={handleLaunchChatWithState}
                  className="px-6 py-3 border border-[#cccccc] hover:border-black/40 hover:bg-black/5 text-[10.5px] font-mono uppercase tracking-wider text-[#5a5a5a] flex items-center gap-3 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-black" />
                  <span>Interactive AI Chat Diagnosis</span>
                </button>
              </div>

            </div>

            {/* Diagnostic Matrix Form Container */}
            <div className="lg:col-span-7">
              <div className="border border-[#d8d8d8] bg-[#f7f7f7] p-8 space-y-8 rounded-none relative">
                
                <h4 className="font-mono text-xs font-bold text-black uppercase tracking-widest border-b border-[#d1d1d1] pb-4">
                  Architectural Estimator & Triage Dispatch
                </h4>

                <form onSubmit={submitTriageRequest} className="space-y-6">
                  
                  {/* Select metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                    
                    <div className="space-y-2">
                      <label className="text-[#4d4d4d] uppercase">01 // CONCURRENT ACTIVE ROUTINES</label>
                      <select 
                        value={concurrentUsers}
                        onChange={(e) => setConcurrentUsers(Number(e.target.value))}
                        className="w-full bg-[#f3f3f3] border border-[#d8d8d8] text-black p-3 rounded-none focus:outline-none focus:border-black/50"
                      >
                        <option value={500}>&lt; 500 active threads</option>
                        <option value={1200}>1,000 — 2,500 active threads</option>
                        <option value={5000}>2,500 — 10,000 active threads</option>
                        <option value={20000}>10,000+ scaling peak threads</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[#4d4d4d] uppercase">02 // DATA DB SEED DEPTH</label>
                      <select 
                        value={dbRecords}
                        onChange={(e) => setDbRecords(e.target.value)}
                        className="w-full bg-[#f3f3f3] border border-[#d8d8d8] text-black p-3 rounded-none focus:outline-none focus:border-black/50"
                      >
                        <option value=" under 5M records">Under 5 Million Rows</option>
                        <option value="10M+ rows">10 Million — 50M Rows</option>
                        <option value="50M+ rows">50 Million — 100M Rows</option>
                        <option value="100M+ heavy rows">100M+ Transaction Ledger Rows</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[#4d4d4d] uppercase">03 // INFRASTRUCTURE ENVIRONMENT</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['AWS', 'GCP', 'MULTI-CLOUD'].map(prov => (
                          <button
                            key={prov}
                            type="button"
                            onClick={() => setCloudProvider(prov)}
                            className={`p-2 border text-[10px] text-center font-bold ${
                              cloudProvider === prov 
                                ? 'border-black text-black bg-[#f4f4f4]' 
                                : 'border-[#d8d8d8] text-[#4d4d4d] bg-transparent hover:border-neutral-700'
                            }`}
                          >
                            {prov}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[#4d4d4d] uppercase">04 // CHRONIC BOTTLENECK CONSTRAINT</label>
                      <select 
                        value={primaryBottleneck}
                        onChange={(e) => setPrimaryBottleneck(e.target.value)}
                        className="w-full bg-[#f3f3f3] border border-[#d8d8d8] text-black p-3 rounded-none focus:outline-none focus:border-black/50"
                      >
                        <option value="db_locks">PostgreSQL Row Locks / Thread Sages</option>
                        <option value="memory_leak">Memory Leaks / JVM Garbage Throttles</option>
                        <option value="io_wait">Slow External Webhook Shards (I/O Wait)</option>
                        <option value="deployment">Deployment Parity Drift / Cluttered Shipped Pipelines</option>
                      </select>
                    </div>

                  </div>

                  {/* Latency Slider */}
                  <div className="space-y-2 font-mono text-xs pt-4 border-t border-[#151515]">
                    <div className="flex justify-between items-center text-[#4d4d4d]">
                      <span>05 // AVERAGE API LATENCY CONGESTION</span>
                      <span className="text-[#e11d48] font-bold">{apiLatency}ms</span>
                    </div>
                    <input 
                      type="range"
                      min="50"
                      max="1200"
                      step="50"
                      value={apiLatency}
                      onChange={(e) => setApiLatency(Number(e.target.value))}
                      className="w-full accent-black"
                    />
                    <div className="flex justify-between text-[9px] text-[#444] font-mono">
                      <span>50ms (IDEAL_REST)</span>
                      <span>1,200ms (CRITICAL_OVERHEAT)</span>
                    </div>
                  </div>

                  {/* Calculated dynamic Risk Meter */}
                  <div className="p-4 border border-[#d1d1d1] bg-[#f3f3f3] flex items-center justify-between font-mono">
                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-500 uppercase">COMPUTED SYSTEM ENTROPY SCORE:</span>
                      <div className="flex items-center gap-2">
                        {calculateEntropyScore() > 70 ? (
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-black" />
                        )}
                        <span className={`text-base font-bold ${calculateEntropyScore() > 70 ? 'text-[#4d4d4d]' : 'text-black'}`}>
                          {calculateEntropyScore()}% RISK VELOCITY
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-500 uppercase block">INTERVENTION URGENCY:</span>
                      <span className={`text-[11px] font-bold uppercase ${
                        calculateEntropyScore() > 70 ? 'text-red-500' : 'text-[#5a5a5a]'
                      }`}>
                        {calculateEntropyScore() > 70 ? 'CRITICAL_HAZARD' : 'NOMINAL_PREVENTATIVE'}
                      </span>
                    </div>
                  </div>

                  {/* Email Input & Submit Shard */}
                  <div className="space-y-3 pt-4 border-t border-[#151515]">
                    {!triageSubmitted ? (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input 
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="ENTER CTO/FOUNDER WORK EMAIL..."
                          className="flex-1 bg-[#f3f3f3] border border-[#d8d8d8] text-black p-4 text-xs font-mono rounded-none focus:outline-none focus:border-black/60 placeholder:text-neutral-700"
                        />
                        <button
                          type="submit"
                          disabled={triageLoading}
                          className="px-8 py-4 bg-black text-white font-mono text-xs uppercase font-bold tracking-widest hover:bg-[#111111] transition-colors disabled:opacity-50 text-center"
                        >
                          {triageLoading ? 'TRANSMITTING...' : 'REQUEST SYSTEM TRIAGE'}
                        </button>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 border border-black/30 bg-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <p className="text-black font-mono text-xs font-bold uppercase tracking-wider">
                            ✓ DIAGNOSTIC REPORT TRANSMITTED SECURELY
                          </p>
                          <p className="text-[#4d4d4d] text-[11px] font-sans">
                            Kenn Buluma will analyze your computed metrics details and reach out within 1 business day.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            // launch chat with preload content
                            onStart();
                          }}
                          className="px-4 py-2 bg-[#ffffff10] hover:bg-[#ffffff20] text-black font-mono text-[9px] uppercase tracking-wider"
                        >
                          OPEN DIRECT AI ASSESS
                        </button>
                      </motion.div>
                    )}
                  </div>

                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 md:px-12 border-t border-[#dcdcdc] bg-[#f3f3f3] relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 font-mono">
          
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-black rounded-full" />
            <span className="text-xs uppercase font-bold tracking-widest text-[#4d4d4d]">
              SYSTEMANATOMY.DEV
            </span>
          </div>

          <div className="text-center md:text-right space-y-2">
            <p className="text-[10px] text-neutral-600 uppercase tracking-widest leading-relaxed">
              © 2026 SYSTEM ANATOMY • ALL INTELLECTUAL METRICS SECURED
            </p>
            <div className="flex justify-center md:justify-end gap-6 text-[10px]">
              <a 
                href="https://kennbuluma.github.io" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#5a5a5a] hover:text-black transition-colors underline decoration-[#b0b0b0]"
              >
                Founder Portfolio
              </a>
              <span className="text-[#333]">|</span>
              <a 
                href="https://linkedin.com"
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#5a5a5a] hover:text-black transition-colors"
              >
                LinkedIn Authority
              </a>
            </div>
          </div>
          
        </div>
      </footer>

    </div>
  );
}
