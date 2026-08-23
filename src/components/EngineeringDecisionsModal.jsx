import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, ChevronRight, CheckCircle, AlertTriangle, Activity, GitCommit } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSystemCommand } from "../context/SystemCommandContext";
import { useSpatial, TABS } from "../SpatialContext";
import { ADR_RECORDS } from "../data/adrs";
import AdrSimulatorTab from "./AdrSimulatorTab";
import { useModal } from "../hooks/useModal";
import { useRef } from "react";

const cn = (...inputs) => twMerge(clsx(inputs));

export default function EngineeringDecisionsModal() {
  const { setActiveTab } = useSpatial();
  const { openEnterpriseExplorer, isAdrsOpen, closeAdrs, playClickSound, targetAdrId, setTargetAdrId } = useSystemCommand();
  const [activeAdrId, setActiveAdrId] = useState(ADR_RECORDS[0]?.id);

  useEffect(() => {
    if (targetAdrId && typeof targetAdrId === "string") {
      setActiveAdrId(targetAdrId);
      setTargetAdrId(null);
    }
  }, [targetAdrId, setTargetAdrId]);
  const [viewMode, setViewMode] = useState("RECORDS"); // "RECORDS" | "SIMULATOR"
  const modalRef = useRef(null);

  useModal({ isOpen: isAdrsOpen, onClose: closeAdrs, ref: modalRef });

  if (!isAdrsOpen) return null;

  const activeAdr = ADR_RECORDS.find(a => a.id === activeAdrId);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-2 sm:p-4 md:p-8 backdrop-blur-md overflow-hidden"
        onClick={closeAdrs}
        role="presentation" // Outer div shouldn't be the dialog if it doesn't have the content trapped
      >
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="adr-title"
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
          className="relative flex h-full max-h-[96vh] sm:max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface/95 shadow-2xl overscroll-contain"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-obsidian-border/60 bg-obsidian/80 p-3 sm:p-4 md:px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div>
                <div className="font-mono text-xs sm:text-sm font-bold tracking-widest text-cyan-electric">ENGINEERING DECISION MATRIX (ADR)</div>
                <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-500">Architecture Review & Technical Reasoning</div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 rounded-lg border border-obsidian-border bg-obsidian-surface/80 p-1">
                <button type="button"
                  onClick={() => { playClickSound(); setViewMode("RECORDS"); }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded font-sans text-xs font-bold tracking-wider transition-all",
                    viewMode === "RECORDS"
                      ? "bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <FileText size={12} /> RECORD INDEX
                </button>
                <button type="button"
                  onClick={() => { playClickSound(); setViewMode("SIMULATOR"); }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded font-sans text-xs font-bold tracking-wider transition-all",
                    viewMode === "SIMULATOR"
                      ? "bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <GitCommit size={12} /> DECISION SIMULATOR
                </button>
              </div>
            </div>

            <button type="button"
              onClick={() => { playClickSound(); closeAdrs(); }}
              aria-label="Close ADRs"
              className="flex relative after:absolute after:content-[''] after:-inset-3 min-h-[32px] min-w-[32px] sm:h-10 sm:w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-obsidian-border hover:text-slate-200 transition-colors duration-200 focus:ring-2 focus:ring-cyan-electric focus:outline-none shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Engineering Intelligence Lab Header Banner */}
          <div className="border-b border-obsidian-border/60 bg-gradient-to-r from-cyan-electric/10 via-obsidian/80 to-purple-500/10 px-4 py-2.5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 font-sans font-medium text-slate-400 uppercase tracking-wider text-cyan-electric">
                <span className="inline-block h-2 w-2 rounded-full bg-cyan-electric animate-pulse" />
                ENGINEERING INTELLIGENCE LAB
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">Architectural Decision & Trade-Off Module</span>
              </div>
              <p className="font-sans text-xs text-slate-300 max-w-3xl leading-snug">
                Interactive engineering exercises demonstrating systems thinking, architectural trade-offs, capacity planning, and engineering decision-making through transparent simulation and evidence-based reasoning.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 shrink-0 font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">
              <span className="px-2 py-0.5 rounded border border-cyan-electric/30 bg-cyan-electric/10 text-cyan-electric">Simulation</span>
              <span className="px-2 py-0.5 rounded border border-emerald-glow/30 bg-emerald-glow/10 text-emerald-glow">Educational</span>
              <span className="px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 text-purple-300">Decision-Support</span>
            </div>
          </div>
          
          {viewMode === "SIMULATOR" ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
              <AdrSimulatorTab />
            </div>
          ) : (
          <div className="flex h-full min-h-0 flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="w-full shrink-0 overflow-y-auto max-h-44 md:max-h-none border-b border-obsidian-border/60 bg-obsidian/50 p-2.5 sm:p-4 md:w-80 md:border-b-0 md:border-r md:p-6 custom-scrollbar">
              <div className="mb-2 sm:mb-4 font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-500">Record Index</div>
              <div className="flex flex-col gap-1.5 sm:gap-2">
                {ADR_RECORDS.map((adr) => {
                  const isActive = activeAdrId === adr.id;
                  return (
                    <button type="button"
                      key={adr.id}
                      onClick={() => {
                        playClickSound();
                        setActiveAdrId(adr.id);
                      }}
                      className={cn(
                        "flex items-start gap-2.5 sm:gap-3 rounded-lg border p-2.5 sm:p-3 text-left transition-all duration-300",
                        isActive
                          ? "border-cyan-electric/50 bg-cyan-electric/10 shadow-cyan-glow"
                          : "border-transparent text-slate-400 hover:bg-obsidian-surface/60 hover:border-obsidian-border hover:text-slate-200"
                      )}
                    >
                      <FileText size={16} className={cn("mt-0.5 shrink-0", isActive ? "text-cyan-electric" : "text-slate-500")} />
                      <div>
                        <div className={cn("font-sans text-xs sm:text-sm font-bold leading-tight mb-0.5 sm:mb-1", isActive ? "text-cyan-electric" : "text-slate-300")}>{adr.title}</div>
                        <div className="font-sans font-medium text-slate-400 uppercase tracking-wider opacity-70">{adr.date}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              <AnimatePresence mode="wait">
                {activeAdr && (
                  <motion.div
                    key={activeAdr.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-4xl space-y-8"
                  >
                    <div className="border-b border-obsidian-border/60 pb-6 relative">
                      {/* Glow effect */}
                      <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-electric/5 rounded-full blur-3xl pointer-events-none" />
                      
                      <h2 id="adr-title" className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3 relative z-10">{activeAdr.title}</h2>
                      <div className="flex flex-wrap items-center gap-4 font-sans text-xs text-slate-500 relative z-10">
                        <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-emerald-glow" /> Status: {activeAdr.currentStatus || "Verified"}</span>
                        <span className="flex items-center gap-1.5"><FileText size={14} /> ID: {activeAdr.id.toUpperCase()}</span>
                        <span className="flex items-center gap-1.5 opacity-60">| Date: {activeAdr.date}</span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Context */}
                      <section className="space-y-4">
                        <div>
                          <h3 className="font-sans font-medium text-slate-400 uppercase tracking-wider text-cyan-electric mb-2 flex items-center gap-2"><ChevronRight size={14} /> Problem & Context</h3>
                          <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-slate-700 pl-4">{activeAdr.context}</p>
                        </div>
                        <div>
                          <h3 className="font-sans font-medium text-slate-400 uppercase tracking-wider text-amber-500 mb-2 flex items-center gap-2"><AlertTriangle size={14} /> Problem Statement</h3>
                          <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-slate-700 pl-4">{activeAdr.problem}</p>
                        </div>
                      </section>

                      {/* Decision & Trade-offs */}
                      <div className="space-y-4">
                        <section className="border border-emerald-glow/30 bg-emerald-glow/5 p-4 rounded-xl">
                          <h3 className="font-sans font-medium text-slate-400 uppercase tracking-wider text-emerald-glow mb-2 flex items-center gap-2"><CheckCircle size={14} /> Decision</h3>
                          <p className="text-slate-200 font-medium text-sm">{activeAdr.decision}</p>
                        </section>
                        <section className="border border-amber-500/30 bg-amber-500/5 p-4 rounded-xl">
                          <h3 className="font-sans font-medium text-slate-400 uppercase tracking-wider text-amber-500 mb-2 flex items-center gap-2"><AlertTriangle size={14} /> Trade-offs</h3>
                          <p className="text-slate-300 text-sm leading-relaxed">{activeAdr.tradeoffs}</p>
                        </section>
                      </div>
                    </div>

                    {/* Rejected Alternatives */}
                    <section>
                      <h3 className="font-sans font-medium text-slate-400 uppercase tracking-wider text-cyan-electric mb-3 flex items-center gap-2"><ChevronRight size={14} /> Rejected Alternatives</h3>
                      <div className="grid gap-3">
                        {(activeAdr.rejectedAlternatives || []).map((opt, i) => (
                          <div key={i} className="border border-rose-500/30 bg-rose-500/5 p-3 rounded-lg flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 hover:border-rose-500/50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50">
                            <div className="font-sans font-bold text-rose-300 shrink-0 sm:w-1/3 text-sm">{opt.name}</div>
                            <div className="text-sm text-slate-400">{opt.description}</div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Consequences */}
                    <section>
                      <h3 className="font-sans font-medium text-slate-400 uppercase tracking-wider text-cyan-electric mb-3 flex items-center gap-2"><ChevronRight size={14} /> Consequences (Outcome)</h3>
                      <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-emerald-glow/50 bg-emerald-glow/5 p-3 rounded-r-lg">{activeAdr.consequences}</p>
                    </section>

                    {/* Contextual Intelligence */}
                    <section className="border border-obsidian-border bg-obsidian-surface/80 p-5 rounded-xl">
                      <h3 className="font-sans font-medium text-slate-400 uppercase tracking-wider text-purple-400 mb-4 flex items-center gap-2"><Activity size={14} /> Contextual Intelligence</h3>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
                        
                        <div className="space-y-1">
                          <div className="text-slate-400 uppercase tracking-wider mb-1">Related Components</div>
                          <div className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-300">{activeAdr.relatedComponents || "Evidence Pending"}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-slate-400 uppercase tracking-wider mb-1">Related Architecture</div>
                          {activeAdr.relatedArchitecture && activeAdr.relatedArchitecture !== "Evidence Pending" ? (
                            <button type="button" onClick={() => openEnterpriseExplorer()} className="w-full text-left px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-electric/50 transition-colors duration-200 rounded text-cyan-electric/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50">{activeAdr.relatedArchitecture}</button>
                          ) : (
                            <div className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-500">Evidence Pending</div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="text-slate-400 uppercase tracking-wider mb-1">Related Documentation</div>
                          <div className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-300">{activeAdr.relatedDocumentation || "Documentation Pending"}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-slate-400 uppercase tracking-wider mb-1">Related Evidence</div>
                          {activeAdr.relatedBenchmarks && activeAdr.relatedBenchmarks !== "Benchmark Pending" ? (
                            <button type="button" onClick={() => { closeAdrs(); setActiveTab(TABS.TRUST_CENTER); }} className="w-full text-left px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-400/50 transition-colors duration-200 rounded text-emerald-400/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50">{activeAdr.relatedBenchmarks}</button>
                          ) : (
                            <div className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-slate-500">Benchmark Pending</div>
                          )}
                        </div>
                      </div>
                    </section>
                  </motion.div>
                )}
</AnimatePresence>
            </div>
          </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
