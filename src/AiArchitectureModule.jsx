import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Cpu,
  FileText,
  Filter,
  ArrowRight,
} from "lucide-react";
import { useSpatial, TABS } from "./SpatialContext";
import { useSystemCommand } from "./context/SystemCommandContext";
import CapabilityNavigationModule from "./components/CapabilityNavigationModule";
import { ADR_RECORDS } from "./data/adrs";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

const MODES = {
  BEFORE: "before",
  AFTER: "after",
};

const METRICS = {
  [MODES.BEFORE]: [
    { label: "Time to close", value: "14.2 h", note: "Manual queue" },
    { label: "Routing steps", value: "4", note: "Human handoffs" },
    { label: "Queue depth", value: "47", note: "Modeled storm" },
    { label: "Operator role", value: "Every ticket", note: "L1 bottleneck" },
  ],
  [MODES.AFTER]: [
    { label: "Time to close", value: "320 ms", note: "Modeled proxy" },
    { label: "Routing steps", value: "0", note: "Machine-readable SOP" },
    { label: "Queue depth", value: "0", note: "Modeled storm" },
    { label: "Operator role", value: "Supervise", note: "Exception path" },
  ],
};

const LOG_POOLS = {
  [MODES.BEFORE]: [
    { prefix: "WAIT", message: "Ticket #8821 unassigned for 4.2h", color: "text-amber-400" },
    { prefix: "QUEUE", message: "ServiceNow L1 depth 47", color: "text-red-400" },
    { prefix: "HAND", message: "Salesforce case #4492 waiting on routing", color: "text-amber-400" },
    { prefix: "LOOP", message: "SAP incident stuck in approval", color: "text-red-400" },
  ],
  [MODES.AFTER]: [
    { prefix: "INGEST", message: "SAP webhook captured", color: "text-cyan-electric" },
    { prefix: "SOP", message: "Machine-readable SOP #409 applied", color: "text-cyan-electric" },
    { prefix: "CLOSE", message: "Context payload closed in 18ms (modeled)", color: "text-emerald-glow" },
    { prefix: "NORM", message: "ServiceNow event normalized", color: "text-emerald-glow" },
  ],
};

const VIEWS = [
  { id: "compare", label: "Compare", icon: Cpu },
  { id: "decisions", label: "Decisions", icon: FileText },
  { id: "index", label: "Index", icon: Filter },
];

export default function AiArchitectureModule() {
  const { setActiveTab } = useSpatial();
  const { openAdrs, openFlagships, playClickSound } = useSystemCommand();
  const [view, setView] = useState("compare");
  const [mode, setMode] = useState(MODES.BEFORE);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const logIndexRef = useRef(0);
  const terminalRef = useRef(null);

  useEffect(() => {
    setTerminalLogs([]);
    logIndexRef.current = 0;
  }, [mode]);

  useEffect(() => {
    const interval = setInterval(() => {
      const pool = LOG_POOLS[mode];
      const log = pool[logIndexRef.current % pool.length];
      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      logIndexRef.current += 1;
      setTerminalLogs((prev) => {
        const next = [
          ...prev,
          {
            id: `${mode}-${logIndexRef.current}`,
            timestamp,
            prefix: log.prefix,
            message: log.message,
            color: log.color,
          },
        ];
        if (next.length > 6) next.shift();
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [mode]);

  useEffect(() => {
    if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [terminalLogs]);

  const isBefore = mode === MODES.BEFORE;

  return (
    <section className="pointer-events-none relative isolate w-full py-8 sm:py-14">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12 lg:px-16 space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-6 lg:grid-cols-12 lg:items-end"
        >
          <div className="space-y-4 lg:col-span-7">
            <p className="kicker text-emerald-glow/80">Evidence</p>
            <h1 className="font-display text-[2.5rem] sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[0.95] tracking-[-0.04em] text-white">
              How it was decided
            </h1>
          </div>
          <p className="lede lg:col-span-5 lg:text-right">
            Before/after models and architecture records. Nothing here is a live SLA.
          </p>
        </motion.div>

        <div className="pointer-events-auto space-y-8">
          <div className="inline-flex rounded-xl border border-emerald-glow/20 bg-obsidian-surface/50 p-1">
            {VIEWS.map((item) => {
              const Icon = item.icon;
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setView(item.id);
                  }}
                  className={cn(
                    "relative inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 font-sans text-[13px] font-medium tracking-wide",
                    active ? "text-emerald-glow" : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="evidence-pill"
                      className="absolute inset-0 rounded-lg border border-emerald-glow/35 bg-emerald-glow/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon size={14} className="relative" />
                  <span className="relative">{item.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {view === "compare" && (
              <motion.div
                key="compare"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className="relative overflow-hidden rounded-2xl border border-emerald-glow/20 bg-slate-950/70 shadow-[0_0_80px_rgba(0,255,135,0.06)]"
              >
                <div className="dossier-sheen hidden md:block" aria-hidden="true" />
                <div className="relative z-10 p-5 sm:p-8 space-y-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-glow/80 mb-1">
                        Signature comparison
                      </div>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-[-0.03em]">
                        A ticket storm, two ways
                      </h2>
                      <p className="mt-1 text-sm text-slate-400">
                        Simulated routing. Not a production SLA.
                      </p>
                    </div>
                    <div className="inline-flex self-start rounded-full border border-obsidian-border bg-obsidian p-1">
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setMode(MODES.BEFORE);
                        }}
                        className={cn(
                          "rounded-full px-4 py-2 font-sans text-xs font-bold uppercase min-h-[40px]",
                          isBefore ? "bg-amber-400/15 text-amber-300 border border-amber-400/40" : "text-slate-500"
                        )}
                      >
                        Before
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setMode(MODES.AFTER);
                        }}
                        className={cn(
                          "rounded-full px-4 py-2 font-sans text-xs font-bold uppercase min-h-[40px]",
                          !isBefore ? "bg-cyan-electric/15 text-cyan-electric border border-cyan-electric/40" : "text-slate-500"
                        )}
                      >
                        After
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {METRICS[mode].map((m) => (
                      <div
                        key={m.label}
                        className="rounded-xl border border-obsidian-border/80 bg-obsidian/80 p-4"
                      >
                        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 mb-2">
                          {m.label}
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${mode}-${m.label}`}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className={cn(
                              "font-sans text-2xl sm:text-3xl font-extrabold tracking-tight",
                              isBefore ? "text-amber-300" : "text-cyan-electric"
                            )}
                          >
                            {m.value}
                          </motion.div>
                        </AnimatePresence>
                        <div className="mt-1 text-[11px] text-slate-500">{m.note}</div>
                      </div>
                    ))}
                  </div>

                  <div className="overflow-hidden rounded-xl border border-obsidian-border bg-obsidian">
                    <div className="flex items-center justify-between border-b border-obsidian-border px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-cyan-electric" />
                        <span className="font-sans text-xs font-bold uppercase text-slate-300">
                          Simulated stream
                        </span>
                      </div>
                      <span className="font-mono text-[10px] uppercase text-slate-500">
                        {isBefore ? "Manual queue" : "Modeled proxy"}
                      </span>
                    </div>
                    <div ref={terminalRef} className="h-44 overflow-y-auto bg-slate-950/90 p-4 font-mono text-xs">
                      <AnimatePresence initial={false}>
                        {terminalLogs.map((log) => (
                          <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-1.5 flex items-baseline gap-2.5"
                          >
                            <span className="shrink-0 text-slate-600">{log.timestamp}</span>
                            <span className={cn("shrink-0 font-bold", log.color)}>{log.prefix}</span>
                            <span className="text-slate-300">{log.message}</span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {view === "decisions" && (
              <motion.div
                key="decisions"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {ADR_RECORDS.map((adr) => (
                  <button
                    key={adr.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      openAdrs(adr.id);
                    }}
                    className="group text-left rounded-2xl border border-obsidian-border/80 bg-slate-950/70 p-5 transition-colors hover:border-emerald-glow/40"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-emerald-glow/80">
                        {adr.id}
                      </span>
                      <span className="font-mono text-[10px] uppercase text-slate-500">Documented</span>
                    </div>
                    <h3 className="font-sans text-lg font-bold text-white group-hover:text-emerald-glow transition-colors">
                      {adr.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-400 line-clamp-3 leading-relaxed">
                      {adr.problem || adr.context}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-cyan-electric">
                      Open record <ArrowRight size={12} />
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {view === "index" && (
              <motion.div
                key="index"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <CapabilityNavigationModule
                  onOpenDossier={(mission) => openFlagships(mission)}
                  onStartDiscovery={() => setActiveTab(TABS.AIRSPACE)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="pt-2 flex items-center justify-between pointer-events-auto border-t border-obsidian-border/40">
          <span className="font-sans text-xs text-slate-400">If you want to talk, send a brief.</span>
          <button
            type="button"
            onClick={() => setActiveTab(TABS.AIRSPACE)}
            className="inline-flex items-center gap-2 font-sans text-xs font-bold text-emerald-glow hover:text-emerald-300 transition-colors group py-2"
          >
            <span>Start a brief</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
