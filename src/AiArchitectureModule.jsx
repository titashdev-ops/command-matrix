/* --- FILE: src/AiArchitectureModule.jsx --- */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Cpu,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Server,
  FileText,
  Filter,
  ArrowRight,
  GitCommit,
  Activity,
} from "lucide-react";
import { useSpatial, TABS } from "./SpatialContext";
import { useSystemCommand } from "./context/SystemCommandContext";
import CapabilityNavigationModule from "./components/CapabilityNavigationModule";
import { ADR_RECORDS } from "./data/adrs";
import EvidenceCard from "./components/EvidenceCard";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

const BENCHMARK_MODES = {
  LEGACY: "legacy",
  AI: "ai",
};

const METRICS = {
  [BENCHMARK_MODES.LEGACY]: [
    { label: "Resolution Time", value: "14.2 Hours", icon: AlertTriangle, color: "text-amber-500" },
    { label: "SLA Breach Deflection", value: "32% Risk", icon: AlertTriangle, color: "text-red-500" },
    { label: "Human Intervention", value: "4 Touchpoints", icon: Server, color: "text-slate-400" },
    { label: "Stack Coverage", value: "SN • SF • SAP", icon: Server, color: "text-slate-400" },
  ],
  [BENCHMARK_MODES.AI]: [
    { label: "Resolution Time", value: "320 Milliseconds", icon: Zap, color: "text-cyan-electric" },
    { label: "SLA Breach Deflection", value: "99.8% Protected", icon: CheckCircle2, color: "text-emerald-glow" },
    { label: "Human Intervention", value: "0 Touchpoints", sub: "Autonomous", icon: Cpu, color: "text-emerald-glow" },
    { label: "Stack Coverage", value: "SN • SF • SAP", icon: Server, color: "text-cyan-electric" },
  ],
};

const LOG_POOLS = {
  [BENCHMARK_MODES.LEGACY]: [
    { prefix: "[WARN]", message: "Ticket #8821 unassigned for 4.2h", prefixColor: "text-amber-500" },
    { prefix: "[ALERT]", message: "Escalation bottleneck in ServiceNow queue", prefixColor: "text-red-500" },
    { prefix: "[FAIL]", message: "SLA threshold breached — L1 queue depth 47", prefixColor: "text-red-500" },
    { prefix: "[WARN]", message: "Salesforce case #4492 awaiting manual routing", prefixColor: "text-amber-500" },
    { prefix: "[ALERT]", message: "SAP incident #7712 stuck in approval loop", prefixColor: "text-red-500" },
  ],
  [BENCHMARK_MODES.AI]: [
    { prefix: "[INGEST]", message: "Webhook payload captured from SAP ECC", prefixColor: "text-cyan-electric" },
    { prefix: "[AI-PROXY]", message: "Machine-Readable SOP #409 executed", prefixColor: "text-cyan-electric" },
    { prefix: "[SUCCESS]", message: "Context payload enriched & closed in 18ms", prefixColor: "text-emerald-glow" },
    { prefix: "[INGEST]", message: "ServiceNow event stream normalized via proxy", prefixColor: "text-cyan-electric" },
    { prefix: "[SUCCESS]", message: "Salesforce case auto-resolved in 42ms", prefixColor: "text-emerald-glow" },
  ],
};

const PAGE_2_TABS = [
  { id: "benchmark", label: "BENCHMARK SIMULATOR", icon: Cpu },
  { id: "adrs", label: "ADR LEDGER & DECISIONS", icon: FileText },
  { id: "capability", label: "PROBLEM-FIRST INDEX", icon: Filter },
];

export default function AiArchitectureModule() {
  const { setActiveTab } = useSpatial();
  const { openAdrs, openFlagships, playClickSound } = useSystemCommand();
  const [activeInspectorTab, setActiveInspectorTab] = useState("benchmark");
  const [benchmarkMode, setBenchmarkMode] = useState(BENCHMARK_MODES.LEGACY);
  const [selectedAdrId, setSelectedAdrId] = useState(ADR_RECORDS[0]?.id || "");
  const [terminalLogs, setTerminalLogs] = useState([]);
  const logIndexRef = useRef(0);
  const terminalRef = useRef(null);

  useEffect(() => {
    setTerminalLogs([]);
    logIndexRef.current = 0;
  }, [benchmarkMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      const pool = LOG_POOLS[benchmarkMode];
      const log = pool[logIndexRef.current % pool.length];
      const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
      logIndexRef.current += 1;
      setTerminalLogs((prev) => {
        const next = [...prev, { id: `${benchmarkMode}-${logIndexRef.current}`, timestamp, prefix: log.prefix, message: log.message, prefixColor: log.prefixColor }];
        if (next.length > 7) next.shift();
        return next;
      });
    }, 1400);
    return () => clearInterval(interval);
  }, [benchmarkMode]);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [terminalLogs]);

  const isLegacy = benchmarkMode === BENCHMARK_MODES.LEGACY;
  const activeAdr = ADR_RECORDS.find((a) => a.id === selectedAdrId) || ADR_RECORDS[0];

  return (
    <>
      <section className="pointer-events-none relative isolate w-full py-12 sm:py-20">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12 lg:px-16 space-y-10">
          
          {/* Calm Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl space-y-3"
          >
            <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
              Empirical Benchmarks &{" "}
              <span className="bg-gradient-to-br from-emerald-glow via-teal-300 to-cyan-electric bg-clip-text text-transparent">
                System Evidence
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
              Modeled performance comparisons, architecture decision records, and constraint-based system narratives.
            </p>
          </motion.div>

          {/* Clean Inspector Control Bar */}
          <div className="space-y-6 pointer-events-auto">
            <div className="flex flex-wrap items-center gap-2 border-b border-obsidian-border/60 pb-2">
              {PAGE_2_TABS.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeInspectorTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setActiveInspectorTab(tab.id);
                    }}
                    className={cn(
                      "px-4 py-2 rounded-lg font-sans text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border min-h-[40px]",
                      isSelected
                        ? "bg-emerald-glow/10 text-emerald-glow border-emerald-glow/40"
                        : "bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-slate-900/60"
                    )}
                  >
                    <Icon size={14} className={isSelected ? "text-emerald-glow" : "text-slate-500"} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Benchmark Simulator + Stack Health */}
            {activeInspectorTab === "benchmark" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Mode Switcher */}
                <div className="flex items-center justify-between gap-4 border-b border-obsidian-border/40 pb-3">
                  <div className="inline-flex rounded-lg border border-obsidian-border bg-obsidian-surface/80 p-1">
                    <button
                      onClick={() => setBenchmarkMode(BENCHMARK_MODES.LEGACY)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-md px-4 py-1.5 font-sans text-xs font-bold uppercase transition-all cursor-pointer",
                        isLegacy ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-slate-400 hover:text-slate-200"
                      )}
                    >
                      <AlertTriangle size={13} />
                      Legacy Flow
                    </button>
                    <button
                      onClick={() => setBenchmarkMode(BENCHMARK_MODES.AI)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-md px-4 py-1.5 font-sans text-xs font-bold uppercase transition-all cursor-pointer",
                        !isLegacy ? "bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/30" : "text-slate-400 hover:text-slate-200"
                      )}
                    >
                      <Cpu size={13} />
                      Serverless AI Proxy
                    </button>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 font-sans text-[10px] text-emerald-glow">
                    <Activity size={12} />
                    <span>99.99% Stack Uptime Verified (SN • SF • SAP)</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {METRICS[benchmarkMode].map((m) => (
                    <EvidenceCard
                      key={m.label}
                      title={m.label}
                      status={benchmarkMode === "ai" ? "Verified" : "Archived"}
                      source="Benchmark"
                      results={{
                        Measurement: m.value,
                        Context: m.sub || "N/A"
                      }}
                    />
                  ))}
                </div>

                {/* Live Terminal */}
                <div className="overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface/80">
                  <div className="flex items-center justify-between border-b border-obsidian-border bg-obsidian-surface/90 px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Terminal size={14} className="text-cyan-electric" />
                      <span className="font-sans text-xs text-slate-300 font-bold uppercase">
                        Simulated Execution Ingress
                      </span>
                    </div>
                    <span className={cn("font-sans text-[10px] uppercase font-bold", isLegacy ? "text-red-400" : "text-emerald-glow")}>
                      {isLegacy ? "HIGH FRICTION QUEUE" : "SUB-SECOND PROXY"}
                    </span>
                  </div>
                  <div ref={terminalRef} className="h-56 overflow-y-auto bg-slate-950/90 p-4 font-sans text-xs">
                    <AnimatePresence initial={false}>
                      {terminalLogs.map((log) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="mb-1.5 flex items-baseline gap-2.5"
                        >
                          <span className="shrink-0 text-slate-600">[{log.timestamp}]</span>
                          <span className={cn("shrink-0 font-bold", log.prefixColor)}>{log.prefix}</span>
                          <span className="text-slate-300">{log.message}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 2: Linear-Style ADR Master-Detail Inspector */}
            {activeInspectorTab === "adrs" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4"
              >
                {/* Left Master List */}
                <div className="md:col-span-4 space-y-2">
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-sans text-xs text-slate-400 uppercase font-bold">ADR MASTER LIST</span>
                    <button
                      type="button"
                      onClick={() => openAdrs()}
                      className="font-sans text-[10px] text-cyan-electric hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Full Lab</span>
                      <GitCommit size={12} />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {ADR_RECORDS.map((adr) => {
                      const isSelected = adr.id === selectedAdrId;
                      return (
                        <button
                          key={adr.id}
                          type="button"
                          onClick={() => setSelectedAdrId(adr.id)}
                          className={cn(
                            "w-full text-left p-3 rounded-lg transition-all cursor-pointer border font-sans text-xs flex flex-col gap-1",
                            isSelected
                              ? "bg-slate-900 border-cyan-electric/50 text-white"
                              : "bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                          )}
                        >
                          <div className="flex items-center justify-between font-sans text-[10px]">
                            <span className={isSelected ? "text-cyan-electric font-bold" : "text-slate-500"}>
                              {adr.id.toUpperCase()}
                            </span>
                            <span className="text-slate-500">{adr.date}</span>
                          </div>
                          <span className="font-semibold line-clamp-1">{adr.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Minimal Detail Pane */}
                <div className="md:col-span-8 p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="font-sans text-[10px] text-cyan-electric font-bold uppercase">{activeAdr.id.toUpperCase()} // DECISION RECORD</span>
                      <h2 className="text-lg font-bold text-white font-sans mt-0.5">{activeAdr.title}</h2>
                    </div>
                    <span className="font-sans text-[10px] text-emerald-glow border border-emerald-glow/30 px-2.5 py-0.5 rounded bg-emerald-glow/10 font-bold">
                      Accepted
                    </span>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                    <div>
                      <span className="font-sans text-[10px] uppercase text-slate-500 block mb-1 font-bold">Context & Problem</span>
                      <p className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">{activeAdr.context}</p>
                    </div>

                    <div>
                      <span className="font-sans text-[10px] uppercase text-slate-500 block mb-1 font-bold">Decision Outcome</span>
                      <p className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">{activeAdr.decision}</p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => openAdrs()}
                      className="font-sans text-xs text-cyan-electric hover:underline flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <span>Open Interactive ADR Inspector</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab 3: Problem-First Index */}
            {activeInspectorTab === "capability" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CapabilityNavigationModule 
                  onOpenDossier={(mission) => {
                    openFlagships(mission);
                  }}
                  onStartDiscovery={() => setActiveTab(TABS.AIRSPACE)}
                />
              </motion.div>
            )}

          </div>

          {/* Quiet Primary CTA Link */}
          <div className="pt-4 flex items-center justify-between pointer-events-auto border-t border-obsidian-border/40">
            <span className="font-sans text-xs text-slate-400">
              Satisfied with the engineering evidence?
            </span>
            <button
              type="button"
              onClick={() => setActiveTab(TABS.AIRSPACE)}
              className="inline-flex items-center gap-2 font-sans text-xs font-bold text-emerald-glow hover:text-emerald-300 transition-colors cursor-pointer group py-2"
            >
              <span>Proceed to Conversion & Engagement</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </section>
    </>
  );
}

