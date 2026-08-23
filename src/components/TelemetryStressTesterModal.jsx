import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Activity, Sliders, ShieldAlert, Cpu, Database, RefreshCw, Terminal, 
  CheckCircle2, Zap, AlertTriangle, Layers, Server, Download, Copy, Check, BarChart2
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSystemCommand } from "../context/SystemCommandContext";
import { useModal } from "../hooks/useModal";

const cn = (...inputs) => twMerge(clsx(inputs));

const TOPOLOGIES = [
  {
    id: "UAV_C2_MQTT",
    name: "Spatial UAV Telemetry & Flight C2",
    stack: "MQTT Broker // WebSockets // TimescaleDB // Redis Hot-Tier",
    baseServiceRate: 3500, // req/sec per worker
    baseProcessingMs: 4,
    dbSensitivity: 0.8,
    memoryPerReqMb: 0.012,
    defaultSafeguard: "Zustand Transient Ref Isolation + Instanced Buffer Batching"
  },
  {
    id: "HEALTHCARE_EMR",
    name: "Prodent OS Enterprise Healthcare EMR",
    stack: "Kafka Event Sourcing // GraphQL Federation // PostgreSQL // Redis",
    baseServiceRate: 1800,
    baseProcessingMs: 12,
    dbSensitivity: 2.2,
    memoryPerReqMb: 0.035,
    defaultSafeguard: "CQRS Read-Replica Offloading + Kafka Consumer In-Memory Batching"
  },
  {
    id: "VECTOR_GRAPH_AI",
    name: "Hybrid RAG Knowledge Graph Engine",
    stack: "Pinecone Vector DB // Neo4j Subgraph // Vercel Edge // OpenAI Proxy",
    baseServiceRate: 900,
    baseProcessingMs: 28,
    dbSensitivity: 3.5,
    memoryPerReqMb: 0.08,
    defaultSafeguard: "Sub-Graph Bloom Filter Caching + Nearest-Neighbor Vector Fallback"
  }
];

export default function TelemetryStressTesterModal() {
  const { isStressTesterOpen, closeStressTester, playClickSound } = useSystemCommand();
  const [selectedTopId, setSelectedTopId] = useState("UAV_C2_MQTT");
  const [activeTab, setActiveTab] = useState("SIMULATOR"); // "SIMULATOR" | "CAPACITY_PLAN"
  const [copied, setCopied] = useState(false);
  const modalRef = useRef(null);

  useModal({ isOpen: isStressTesterOpen, onClose: closeStressTester, ref: modalRef });

  // --- Interactive Load Inputs ---
  const [concurrency, setConcurrency] = useState(8000); // Arrival rate lambda (req/sec)
  const [networkJitter, setNetworkJitter] = useState(12); // ms
  const [packetLoss, setPacketLoss] = useState(0.5); // %
  const [lockContention, setLockContention] = useState(15); // %

  // --- Interactive Architectural Tuning Controls ---
  const [workerCount, setWorkerCount] = useState(4); // 1 - 16 instances
  const [batchSize, setBatchSize] = useState(32); // 1 - 128 batching depth
  const [dbPoolLimit, setDbPoolLimit] = useState(40); // 10 - 200 DB conns
  const [circuitThreshold, setCircuitThreshold] = useState(250); // ms cutoff

  // Live Historical Telemetry Stream
  const [history, setHistory] = useState(() => Array(30).fill({ latency: 18, queueWait: 2, throughput: 7950 }));
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [chaosActive, setChaosActive] = useState(false);
  const logsContainerRef = useRef(null);

  const topology = TOPOLOGIES.find(t => t.id === selectedTopId) || TOPOLOGIES[0];

  // Effective Load considering Chaos Injection
  const effectiveConcurrency = chaosActive ? Math.round(concurrency * 2.8) : concurrency;
  const effectiveJitter = chaosActive ? networkJitter + 45 : networkJitter;

  // --- Queuing Theory & Mathematical Modeling (M/M/c Queue Physics) ---
  // 1. Service Capacity
  const batchEfficiencyFactor = Math.min(2.2, 1 + Math.log2(batchSize) * 0.18);
  const totalServiceCapacity = Math.round(topology.baseServiceRate * workerCount * batchEfficiencyFactor);
  
  // 2. System Utilization (rho)
  const rawUtilization = effectiveConcurrency / Math.max(1, totalServiceCapacity);
  const isOverloaded = rawUtilization >= 0.98;

  // 3. Queue Wait Time (M/M/c approximation via Pollaczek-Khinchine / hyperbolic growth near saturation)
  const effectiveRho = Math.min(0.97, rawUtilization);
  const queueWaitMs = isOverloaded
    ? Math.min(1200, 150 + (rawUtilization - 0.98) * 4500)
    : Math.round((effectiveRho / (1 - effectiveRho)) * (topology.baseProcessingMs * 0.4));

  // 4. DB Lock Wait Component
  const dbConnDemand = (effectiveConcurrency / 200) * (lockContention / 10);
  const poolSaturation = Math.min(1.0, dbConnDemand / dbPoolLimit);
  const dbLockWaitMs = Math.round(lockContention * topology.dbSensitivity * (1 + poolSaturation * 2.5));

  // 5. Memory RSS & GC Penalty
  const estimatedMemoryMb = Math.round(128 + (effectiveConcurrency * topology.memoryPerReqMb * (1 + queueWaitMs / 100)));
  const memoryPressurePct = Math.min(100, Math.round((estimatedMemoryMb / (workerCount * 1024)) * 100));
  const gcPausePenaltyMs = memoryPressurePct > 80 ? Math.round((memoryPressurePct - 80) * 4.5) : 0;

  // 6. Total Raw P99 Latency
  const networkRttMs = Math.round(effectiveJitter + (packetLoss * 12));
  const totalP99Raw = Math.round(
    topology.baseProcessingMs + queueWaitMs + dbLockWaitMs + networkRttMs + gcPausePenaltyMs
  );

  // 7. Circuit Breaker Load Shedding
  const circuitBreakerTripped = totalP99Raw > circuitThreshold;
  const effectiveThroughput = circuitBreakerTripped
    ? Math.round(effectiveConcurrency * (circuitThreshold / Math.max(circuitThreshold, totalP99Raw)))
    : Math.round(effectiveConcurrency * (1 - packetLoss / 100));

  const effectiveP99 = circuitBreakerTripped ? Math.min(circuitThreshold + 15, totalP99Raw) : totalP99Raw;

  const circuitStateLabel = circuitBreakerTripped
    ? "CIRCUIT OPEN // SHEDDING LOAD"
    : effectiveP99 > 150 || rawUtilization > 0.85
      ? "HIGH UTILIZATION // ADAPTIVE BATCHING"
      : "NOMINAL OPERATIONAL";

  // Live Telemetry Tick Generator
  useEffect(() => {
    if (!isStressTesterOpen) return;

    const interval = setInterval(() => {
      const liveLatency = Math.max(4, effectiveP99 + Math.round((Math.random() - 0.5) * 8));
      const liveQueue = Math.max(0, queueWaitMs + Math.round((Math.random() - 0.5) * 4));
      const liveTp = Math.max(0, effectiveThroughput + Math.round((Math.random() - 0.5) * 120));

      setHistory(prev => [...prev.slice(1), { latency: liveLatency, queueWait: liveQueue, throughput: liveTp }]);

      // Log stream
      const timeStr = new Date().toISOString().substring(11, 19);
      let level = "INFO";
      let logText = "";

      if (chaosActive) {
        level = "CRITICAL";
        logText = `[CHAOS INJECTION ACTIVE] Simulated Traffic Burst: ${effectiveConcurrency} req/s // Latency Spike: ${liveLatency}ms!`;
      } else if (circuitBreakerTripped) {
        level = "CRITICAL";
        logText = `[CIRCUIT BREAKER] P99 (${effectiveP99}ms) exceeded threshold (${circuitThreshold}ms). Shedding ${(100 - (liveTp/effectiveConcurrency)*100).toFixed(1)}% traffic.`;
      } else if (rawUtilization > 0.85) {
        level = "WARN";
        logText = `[QUEUE SATURATION] Utilization at ${(rawUtilization*100).toFixed(1)}%. Queue wait: ${queueWaitMs}ms // Worker pool: ${workerCount} pods.`;
      } else {
        logText = `[METRIC TICK] Ingest: ${effectiveConcurrency} req/s // P99: ${liveLatency}ms // Queue: ${queueWaitMs}ms // DB Pool: ${Math.round(poolSaturation*100)}% used.`;
      }

      setTerminalLogs(prev => [...prev.slice(-30), { timestamp: timeStr, level, msg: logText }]);
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isStressTesterOpen, effectiveP99, queueWaitMs, effectiveThroughput, circuitBreakerTripped, 
    circuitThreshold, rawUtilization, effectiveConcurrency, workerCount, poolSaturation, chaosActive
  ]);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  if (!isStressTesterOpen) return null;

  // Chart rendering points
  const chartHeight = 70;
  const chartWidth = 380;
  const maxLatVal = Math.max(100, ...history.map(h => h.latency));
  const pointsLatency = history.map((h, i) => {
    const x = (i / (history.length - 1)) * chartWidth;
    const y = chartHeight - (h.latency / maxLatVal) * (chartHeight - 10);
    return `${x},${y}`;
  }).join(" ");

  const handleCopyCapacityPlan = () => {
    const recommendedWorkers = Math.ceil((concurrency * 1.3) / (topology.baseServiceRate * batchEfficiencyFactor));
    const recommendedDbPool = Math.min(150, Math.max(20, Math.ceil((concurrency / 100) * 1.5)));

    const report = [
      `=== ENTERPRISE CAPACITY PLANNING & SIMULATED LOAD SPECIFICATION ===`,
      `Topology Target: ${topology.name}`,
      `Tech Stack: ${topology.stack}`,
      `Note: Modeled estimation via M/M/c queuing theory equations (Evidence Simulation Tool).`,
      `---------------------------------------------------------------`,
      `[SIMULATED LOAD PARAMETERS]`,
      `Target Ingestion Concurrency: ${concurrency.toLocaleString()} req/sec`,
      `Network Latency Jitter: ${networkJitter} ms | Packet Loss: ${packetLoss}%`,
      `Database Lock Contention: ${lockContention}%`,
      `---------------------------------------------------------------`,
      `[MODELED SYSTEM METRICS]`,
      `P99 End-to-End Latency: ${effectiveP99} ms (Base: ${topology.baseProcessingMs}ms, Queue: ${queueWaitMs}ms, DB Lock: ${dbLockWaitMs}ms, Network: ${networkRttMs}ms, GC: ${gcPausePenaltyMs}ms)`,
      `Effective System Throughput: ${effectiveThroughput.toLocaleString()} ops/sec`,
      `Cluster Worker Count: ${workerCount} pods | Utilization Rate: ${(rawUtilization*100).toFixed(1)}%`,
      `Memory Pressure: ${memoryPressurePct}% (${estimatedMemoryMb} MB RSS)`,
      `Circuit Breaker Status: ${circuitStateLabel}`,
      `---------------------------------------------------------------`,
      `[RECOMMENDED INFRASTRUCTURE SIZING]`,
      `Recommended Compute Replicas: ${recommendedWorkers} Pods (e.g., 2 vCPU / 4GB RAM per pod)`,
      `Recommended Database Connection Pool: ${recommendedDbPool} Connections`,
      `Recommended Ingestion Batch Size: ${batchSize} Items per flush`,
      `Circuit Breaker Cutoff Threshold: ${circuitThreshold} ms`,
      `Safeguard Architecture: ${topology.defaultSafeguard}`,
      `---------------------------------------------------------------`,
      `Generated by Titash Dev System Command Telemetry Stress-Tester (Capacity Planning Tool)`
    ].join('\n');

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-auto fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-md overflow-hidden"
        onClick={closeStressTester}
        role="presentation" // outer div
      >
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="stress-tester-title"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 22,
            mass: 0.85,
            bounce: 0.22,
          }}
          className="relative flex h-full max-h-[96vh] sm:max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-cyan-electric/40 bg-obsidian-surface/95 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-obsidian-border/60 bg-obsidian/90 p-4 sm:px-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-electric/30 bg-cyan-electric/10 text-cyan-electric">
                <Activity size={20} />
              </div>
              <div>
                <h2 id="stress-tester-title" className="font-mono text-sm sm:text-base font-bold tracking-widest text-cyan-electric">
                  TELEMETRY & ARCHITECTURE STRESS-TESTER
                </h2>
                <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">
                  M/M/c Queuing Mathematics & Modeled Capacity Planning Tool
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Tab Switcher */}
              <div className="flex items-center gap-1 rounded-lg border border-obsidian-border bg-obsidian-surface/80 p-1">
                <button type="button"
                  onClick={() => { playClickSound(); setActiveTab("SIMULATOR"); }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded font-sans text-xs font-bold transition-all",
                    activeTab === "SIMULATOR"
                      ? "bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <Sliders size={12} /> MODELED LOAD SIMULATOR
                </button>
                <button type="button"
                  onClick={() => { playClickSound(); setActiveTab("CAPACITY_PLAN"); }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded font-sans text-xs font-bold transition-all",
                    activeTab === "CAPACITY_PLAN"
                      ? "bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <Server size={12} /> CAPACITY PLAN MODEL
                </button>
              </div>

              <button type="button"
                onClick={() => { playClickSound(); closeStressTester(); }}
                aria-label="Close Stress-Tester"
                className="flex relative after:absolute after:content-[''] after:-inset-3 min-h-[32px] min-w-[32px] sm:h-9 sm:w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-obsidian-border hover:text-slate-200 transition-colors duration-200 focus:ring-2 focus:ring-cyan-electric focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Engineering Intelligence Lab Banner */}
          <div className="border-b border-obsidian-border/60 bg-gradient-to-r from-cyan-electric/10 via-obsidian/80 to-purple-500/10 px-4 py-2.5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 font-sans font-medium text-slate-400 uppercase tracking-wider text-cyan-electric">
                <span className="inline-block h-2 w-2 rounded-full bg-cyan-electric animate-pulse" />
                ENGINEERING INTELLIGENCE LAB
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">Telemetry Capacity & Resilience Simulation Module</span>
              </div>
              <p className="font-sans text-xs text-slate-300 max-w-3xl leading-snug">
                Interactive engineering exercises demonstrating systems thinking, architectural trade-offs, capacity planning, and engineering decision-making through transparent simulation and evidence-based reasoning.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 shrink-0 font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">
              <span className="px-2 py-0.5 rounded border border-cyan-electric/30 bg-cyan-electric/10 text-cyan-electric">Simulation</span>
              <span className="px-2 py-0.5 rounded border border-emerald-glow/30 bg-emerald-glow/10 text-emerald-glow">Educational</span>
              <span className="px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 text-purple-300">Model-Based</span>
            </div>
          </div>

          {activeTab === "CAPACITY_PLAN" ? (
            /* --- CAPACITY PLANNING TAB --- */
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
              <div className="p-5 rounded-xl border border-cyan-electric/30 bg-cyan-electric/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-sans text-sm font-bold text-cyan-electric flex items-center gap-2">
                    <Server size={18} /> Modeled Infrastructure Sizing & Capacity Specification
                  </h3>
                  <p className="font-sans text-xs text-slate-300 mt-1">
                    Calculated hardware and cluster specifications derived from queuing theory for target topology: <strong className="text-slate-200">{topology.name}</strong>.
                  </p>
                </div>

                <button type="button"
                  onClick={handleCopyCapacityPlan}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-glow/50 bg-emerald-glow/10 font-sans text-xs font-bold text-emerald-glow hover:bg-emerald-glow/20 transition-all duration-200 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "SPEC COPIED!" : "COPY CAPACITY SPEC"}
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 rounded-xl border border-obsidian-border bg-obsidian-surface/60 space-y-2">
                  <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">Recommended Compute Pods</div>
                  <div className="font-sans text-2xl font-bold text-cyan-electric">
                    {Math.ceil((concurrency * 1.3) / (topology.baseServiceRate * batchEfficiencyFactor))} Pods
                  </div>
                  <p className="font-sans text-xs text-slate-400">
                    Provides 30% headroom over {concurrency.toLocaleString()} req/s peak load with batch size {batchSize}.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-obsidian-border bg-obsidian-surface/60 space-y-2">
                  <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">Recommended DB Pool Limit</div>
                  <div className="font-sans text-2xl font-bold text-emerald-glow">
                    {Math.min(150, Math.max(20, Math.ceil((concurrency / 100) * 1.5)))} Connections
                  </div>
                  <p className="font-sans text-xs text-slate-400">
                    Prevents Postgres / Timescale connection exhaustion under {lockContention}% lock contention.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-obsidian-border bg-obsidian-surface/60 space-y-2">
                  <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">Circuit Cutoff Latency</div>
                  <div className="font-sans text-2xl font-bold text-amber-400">
                    {circuitThreshold} ms
                  </div>
                  <p className="font-sans text-xs text-slate-400">
                    Sheds incoming overflow traffic when P99 queue wait exceeds SLA threshold.
                  </p>
                </div>
              </div>

              {/* Technical Breakdown Matrix */}
              <div className="p-5 rounded-xl border border-obsidian-border bg-obsidian-surface/40 space-y-4">
                <h4 className="font-sans text-xs font-bold uppercase text-white flex items-center gap-2">
                  <BarChart2 size={16} className="text-cyan-electric" /> Queuing Theory Delay Decomposition
                </h4>

                <div className="space-y-3 font-sans text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Base Execution Time:</span>
                      <span className="text-white font-bold">{topology.baseProcessingMs} ms</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded overflow-hidden">
                      <div className="h-full bg-cyan-electric" style={{ width: `${Math.min(100, (topology.baseProcessingMs / effectiveP99) * 100)}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>M/M/c Queue Wait Time:</span>
                      <span className="text-amber-400 font-bold">{queueWaitMs} ms</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: `${Math.min(100, (queueWaitMs / effectiveP99) * 100)}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Database Lock Contention Wait:</span>
                      <span className="text-purple-400 font-bold">{dbLockWaitMs} ms</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded overflow-hidden">
                      <div className="h-full bg-purple-400" style={{ width: `${Math.min(100, (dbLockWaitMs / effectiveP99) * 100)}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-slate-300">
                      <span>Network RTT & Packet Drop Overhead:</span>
                      <span className="text-rose-400 font-bold">{networkRttMs} ms</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded overflow-hidden">
                      <div className="h-full bg-rose-400" style={{ width: `${Math.min(100, (networkRttMs / effectiveP99) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Portfolio Story & Engineering Takeaways Summary */}
              <div className="p-5 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-3">
                <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-purple-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={16} /> Engineering Takeaways & Capacity Insights
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded border border-purple-500/40 bg-purple-500/10 font-normal">
                    Interactive Engineering Evidence
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-surface/60 space-y-1">
                    <span className="font-sans text-xs uppercase text-cyan-electric font-bold block">Engineering Skill Demonstrated</span>
                    <p className="text-slate-300">
                      Systems capacity planning, queue delay decomposition, and backpressure mitigation under synthetic load.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-surface/60 space-y-1">
                    <span className="font-sans text-xs uppercase text-emerald-glow font-bold block">Why This Is Valuable</span>
                    <p className="text-slate-300">
                      Prevents catastrophic cascading outages by mathematically sizing worker pools and database connection caps before deployment.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-surface/60 space-y-1">
                    <span className="font-sans text-xs uppercase text-amber-400 font-bold block">Key Trade-off Observed</span>
                    <p className="text-slate-300">
                      Larger ingestion batch sizes optimize database throughput, but increase per-batch assembly latency during light traffic.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-surface/60 space-y-1">
                    <span className="font-sans text-xs uppercase text-purple-400 font-bold block">Flagship Project Links</span>
                    <p className="text-slate-300">
                      Applied across <strong>ops.dronly.in</strong>, <strong>Healthcare Systems Initiative</strong>, <strong>Prodent OS</strong>, <strong>Career OS</strong>, and <strong>Personal OS</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* --- LIVE SIMULATOR TAB --- */
            <div className="flex flex-1 flex-col lg:flex-row overflow-y-auto custom-scrollbar">
              
              {/* Left Control Panel: Load & Architectural Tuning */}
              <div className="w-full lg:w-5/12 border-b lg:border-b-0 lg:border-r border-obsidian-border/60 p-4 sm:p-5 space-y-5 bg-obsidian/40">
                
                {/* Simulation Model Boundaries & Info Panel */}
                <div className="p-3.5 rounded-lg border border-cyan-electric/30 bg-cyan-electric/5 space-y-2">
                  <div className="flex items-center justify-between font-sans font-medium text-slate-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Sliders size={13} /> Simulation Model Boundaries</span>
                    <span className="text-xs px-1.5 py-0.5 rounded border border-cyan-electric/40 bg-cyan-electric/10">Model-Based</span>
                  </div>
                  <p className="font-sans text-xs text-slate-300 leading-snug">
                    This interactive tool evaluates <strong>modeled load capacity</strong> using M/M/c queuing formulas. It simulates P99 latency growth, lock contention, and circuit breaker trip thresholds under synthetic concurrency spikes.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs text-slate-400">
                    <div><strong className="text-emerald-glow">Demonstrates:</strong> Systems capacity planning & backpressure reasoning.</div>
                    <div><strong className="text-rose-400">Not Claimed:</strong> Physical server benchmarks or production validation.</div>
                  </div>
                </div>

                {/* Topology Selector */}
                <div>
                  <label className="mb-2 block font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Cpu size={14} className="text-cyan-electric" /> Select Architecture Topology
                  </label>
                  <div className="grid gap-2">
                    {TOPOLOGIES.map((top) => {
                      const isSelected = top.id === selectedTopId;
                      return (
                        <button type="button"
                          key={top.id}
                          onClick={() => { playClickSound(); setSelectedTopId(top.id); }}
                          className={cn(
                            "flex flex-col text-left p-2.5 rounded-lg border transition-all duration-200",
                            isSelected
                              ? "border-cyan-electric/60 bg-cyan-electric/10 shadow-cyan-glow"
                              : "border-obsidian-border bg-obsidian-surface/40 hover:border-slate-500 hover:bg-obsidian-surface/80"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className={cn("font-sans text-xs font-bold", isSelected ? "text-cyan-electric" : "text-white")}>
                              {top.name}
                            </span>
                            {isSelected && <CheckCircle2 size={14} className="text-cyan-electric shrink-0" />}
                          </div>
                          <span className="mt-1 font-sans text-xs text-slate-400">
                            {top.stack}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section A: Ingestion Load & Network Stress */}
                <div className="space-y-3  pt-3">
                  <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Zap size={13} /> Load & Network Stress Sliders
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Concurrency */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-sans text-sm">
                        <span className="text-slate-300">Ingestion Load</span>
                        <span className="font-bold text-cyan-electric">{concurrency.toLocaleString()} req/s</span>
                      </div>
                      <input
                        type="range"
                        min="1000"
                        max="50000"
                        step="1000"
                        value={concurrency}
                        onChange={(e) => setConcurrency(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                      />
                    </div>

                    {/* Network Jitter */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-sans text-sm">
                        <span className="text-slate-300">Network Jitter</span>
                        <span className="font-bold text-amber-400">{networkJitter} ms</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="150"
                        step="5"
                        value={networkJitter}
                        onChange={(e) => setNetworkJitter(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                      />
                    </div>

                    {/* Lock Contention */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-sans text-sm">
                        <span className="text-slate-300">DB Lock Contention</span>
                        <span className="font-bold text-purple-400">{lockContention}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="80"
                        step="2"
                        value={lockContention}
                        onChange={(e) => setLockContention(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                      />
                    </div>

                    {/* Packet Drop */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-sans text-sm">
                        <span className="text-slate-300">Packet Drop Rate</span>
                        <span className="font-bold text-rose-400">{packetLoss}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        value={packetLoss}
                        onChange={(e) => setPacketLoss(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Interactive Architectural Mitigation Knobs */}
                <div className="space-y-3  pt-3">
                  <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-emerald-glow flex items-center gap-1.5">
                    <Sliders size={13} /> Interactive Infrastructure Tuning Knobs
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Worker Pod Count */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-sans text-sm">
                        <span className="text-slate-300">Worker Pods</span>
                        <span className="font-bold text-emerald-glow">{workerCount} Pods</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="16"
                        step="1"
                        value={workerCount}
                        onChange={(e) => setWorkerCount(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                      />
                    </div>

                    {/* Batch Size */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-sans text-sm">
                        <span className="text-slate-300">Ingestion Batching</span>
                        <span className="font-bold text-cyan-electric">{batchSize} items</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="128"
                        step="8"
                        value={batchSize}
                        onChange={(e) => setBatchSize(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                      />
                    </div>

                    {/* DB Pool Limit */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-sans text-sm">
                        <span className="text-slate-300">DB Pool Conns</span>
                        <span className="font-bold text-purple-400">{dbPoolLimit} Limit</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="200"
                        step="10"
                        value={dbPoolLimit}
                        onChange={(e) => setDbPoolLimit(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                      />
                    </div>

                    {/* Circuit Breaker Limit */}
                    <div className="space-y-1">
                      <div className="flex justify-between font-sans text-sm">
                        <span className="text-slate-300">Circuit Threshold</span>
                        <span className="font-bold text-amber-400">{circuitThreshold} ms</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="800"
                        step="25"
                        value={circuitThreshold}
                        onChange={(e) => setCircuitThreshold(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button type="button"
                    onClick={() => {
                      playClickSound();
                      setChaosActive(prev => !prev);
                    }}
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-2 px-3 border rounded font-sans text-xs font-bold transition-all min-h-[44px]",
                      chaosActive
                        ? "border-rose-500 bg-rose-500/20 text-rose-400 animate-pulse"
                        : "border-amber-500/50 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                    )}
                  >
                    <Zap size={14} /> {chaosActive ? "STOP CHAOS SPIKE" : "INJECT CHAOS SPIKE"}
                  </button>

                  <button type="button"
                    onClick={() => {
                      playClickSound();
                      setChaosActive(false);
                      setConcurrency(8000);
                      setNetworkJitter(12);
                      setLockContention(15);
                      setPacketLoss(0.5);
                      setWorkerCount(4);
                      setBatchSize(32);
                      setDbPoolLimit(40);
                      setCircuitThreshold(250);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 border border-obsidian-border bg-obsidian-surface/60 rounded font-mono text-xs text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors duration-200 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                  >
                    <RefreshCw size={14} /> RESET PARAMETERS
                  </button>
                </div>
              </div>

              {/* Right Telemetry Dashboard & Live Stream */}
              <div className="w-full lg:w-7/12 p-4 sm:p-5 space-y-4 flex flex-col justify-between">
                
                {/* Real-Time Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-lg border border-obsidian-border bg-obsidian-surface/60">
                    <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">P99 Latency</div>
                    <div className={cn("font-sans text-lg font-bold mt-0.5", effectiveP99 > circuitThreshold ? "text-rose-400 animate-pulse" : effectiveP99 > 120 ? "text-amber-400" : "text-cyan-electric")}>
                      {effectiveP99} <span className="text-xs font-normal text-slate-400">ms</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-obsidian-border bg-obsidian-surface/60">
                    <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">Effective Ops/s</div>
                    <div className="font-sans text-lg font-bold text-emerald-glow mt-0.5">
                      {effectiveThroughput.toLocaleString()}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-obsidian-border bg-obsidian-surface/60">
                    <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">Queue Wait</div>
                    <div className="font-sans text-lg font-bold text-amber-400 mt-0.5">
                      {queueWaitMs} <span className="text-xs font-normal text-slate-400">ms</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-obsidian-border bg-obsidian-surface/60">
                    <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">Cluster Util</div>
                    <div className={cn("font-sans text-lg font-bold mt-0.5", rawUtilization > 0.95 ? "text-rose-400" : rawUtilization > 0.8 ? "text-amber-400" : "text-purple-400")}>
                      {(rawUtilization * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Circuit Breaker Status Banner */}
                <div className={cn(
                  "p-3 rounded-lg border flex items-center justify-between font-sans text-xs font-bold tracking-wider",
                  circuitBreakerTripped
                    ? "border-rose-500/50 bg-rose-500/10 text-rose-400"
                    : rawUtilization > 0.85
                      ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                      : "border-emerald-glow/40 bg-emerald-glow/10 text-emerald-glow"
                )}>
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={16} />
                    <span>{circuitStateLabel}</span>
                  </div>
                  <span className="text-xs font-normal text-slate-300">AUTO-SCALING DISPATCHER</span>
                </div>

                {/* SVG Oscillogram Chart */}
                <div className="p-3.5 rounded-lg border border-obsidian-border bg-obsidian-surface/40">
                  <div className="flex justify-between items-center mb-1.5 font-sans text-xs text-slate-400">
                    <span>SIMULATED P99 LATENCY OSCILLOGRAM (30 TICKS)</span>
                    <span className="text-cyan-electric">MAX: {maxLatVal}ms</span>
                  </div>
                  <div className="w-full overflow-hidden">
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-16 overflow-visible">
                      <polyline
                        fill="none"
                        stroke={circuitBreakerTripped ? "#f43f5e" : "#06b6d4"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={pointsLatency}
                      />
                    </svg>
                  </div>
                </div>

                {/* Active Safeguard Technique */}
                <div className="p-3 rounded-lg border border-purple-500/30 bg-purple-500/5 space-y-1">
                  <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Database size={13} /> Active Architecture Safeguard Strategy
                  </div>
                  <p className="font-sans text-xs text-slate-300">
                    {topology.defaultSafeguard}
                  </p>
                </div>

                {/* Live Console Logs */}
                <div ref={logsContainerRef} className="p-3 rounded-lg border border-obsidian-border bg-slate-950 font-mono text-xs h-32 overflow-y-auto space-y-1 custom-scrollbar">
                  <div className="text-slate-500 pb-1 border-b border-slate-800 flex items-center gap-1.5">
                    <Terminal size={12} className="text-cyan-electric" /> SIMULATED RESILIENCE LOGS
                  </div>
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-slate-600 shrink-0">{log.timestamp}</span>
                      <span className={cn(
                        "shrink-0 font-bold",
                        log.level === "CRITICAL" ? "text-rose-400" : log.level === "WARN" ? "text-amber-400" : "text-cyan-electric"
                      )}>
                        [{log.level}]
                      </span>
                      <span className="text-slate-300 truncate">{log.msg}</span>
                    </div>
                  ))}
                </div>

                {/* Engineering Takeaways Summary Card */}
                <div className="p-3.5 rounded-lg border border-purple-500/30 bg-purple-500/5 space-y-2">
                  <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-purple-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><ShieldAlert size={14} /> Engineering Takeaways</span>
                    <span className="text-xs px-1.5 py-0.5 rounded border border-purple-500/40 bg-purple-500/10">Evidence</span>
                  </div>
                  <p className="font-sans text-xs text-slate-300 leading-snug">
                    Simulates queue wait accumulation, cluster worker auto-scaling, and circuit breaker trip thresholds. Demonstrates systems resilience principles applied in <strong>ops.dronly.in</strong>, <strong>Healthcare Systems Initiative</strong>, <strong>Prodent OS</strong>, <strong>Career OS</strong>, and <strong>Personal OS</strong>.
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex shrink-0 items-center justify-between border-t border-obsidian-border/60 bg-obsidian/90 p-3 sm:px-6 backdrop-blur-md">
            <div className="hidden sm:flex items-center gap-2 font-mono text-sm text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SIMULATOR STATUS: ONLINE</span>
              <span className="text-slate-600">|</span>
              <span>PRESS ESC OR CLICK BELOW TO CLOSE</span>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button type="button"
                onClick={handleCopyCapacityPlan}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-cyan-electric/40 bg-cyan-electric/10 font-sans text-xs font-bold text-cyan-electric hover:bg-cyan-electric/20 transition-all duration-200 min-h-[44px] sm:min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "SPEC COPIED!" : "EXPORT CAPACITY PLAN"}</span>
              </button>

              <button type="button"
                onClick={() => {
                  playClickSound();
                  closeStressTester();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-rose-500/50 bg-rose-500/10 font-sans text-xs font-bold text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all duration-200 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
              >
                <X size={14} />
                <span>CLOSE STRESS TESTER</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
