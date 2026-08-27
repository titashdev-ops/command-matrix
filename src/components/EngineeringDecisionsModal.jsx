import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, GitCommit } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSystemCommand } from "../context/SystemCommandContext";
import { ADR_RECORDS } from "../data/adrs";
import AdrSimulatorTab from "./AdrSimulatorTab";
import { useModal } from "../hooks/useModal";
import { useRef } from "react";
import { modalReveal, overlayFade } from "../lib/motion";
import BriefCover from "./BriefCover";

const cn = (...inputs) => twMerge(clsx(inputs));

export default function EngineeringDecisionsModal() {
  const { isAdrsOpen, closeAdrs, playClickSound, targetAdrId, setTargetAdrId } = useSystemCommand();
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
          {...overlayFade}
          className="pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-2 sm:p-4 md:p-8 backdrop-blur-md overflow-hidden"
          onClick={closeAdrs}
          role="presentation"
        >
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="adr-title"
          onClick={(e) => e.stopPropagation()}
          initial={modalReveal.initial}
          animate={modalReveal.animate}
          exit={modalReveal.exit}
          transition={modalReveal.transition}
          className="relative flex h-full max-h-[96vh] sm:max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface/95 shadow-2xl overscroll-contain"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-obsidian-border/60 bg-obsidian/80 p-3 sm:p-4 md:px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div>
                <div className="font-display text-sm sm:text-base font-bold tracking-tight text-white">Decision records</div>
                <div className="font-sans text-xs text-slate-500">Architecture choices, written down</div>
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
                  <FileText size={12} /> Records
                </button>
                <button type="button"
                  onClick={() => { playClickSound(); setViewMode("SIMULATOR"); }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded font-sans text-xs font-semibold tracking-wide transition-all",
                    viewMode === "SIMULATOR"
                      ? "bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <GitCommit size={12} /> Trade-off model
                </button>
              </div>
            </div>

            <button type="button"
              onClick={() => { playClickSound(); closeAdrs(); }}
              aria-label="Close records"
              className="flex relative after:absolute after:content-[''] after:-inset-3 min-h-[32px] min-w-[32px] sm:h-10 sm:w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-obsidian-border hover:text-slate-200 transition-colors duration-200 focus:ring-2 focus:ring-cyan-electric focus:outline-none shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
            >
              <X size={20} />
            </button>
          </div>

          {/* Header note */}
          <div className="border-b border-obsidian-border/60 bg-obsidian/70 px-4 py-2.5 sm:px-6 shrink-0">
            <p className="font-sans text-xs sm:text-sm text-slate-400">
              Choices I would defend. Not a live system.
            </p>
          </div>
          
          {viewMode === "SIMULATOR" ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
              <AdrSimulatorTab />
            </div>
          ) : (
          <div className="flex h-full min-h-0 flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="w-full shrink-0 overflow-y-auto max-h-44 md:max-h-none border-b border-obsidian-border/60 bg-obsidian/50 p-2.5 sm:p-4 md:w-80 md:border-b-0 md:border-r md:p-6 custom-scrollbar">
              <div className="mb-2 sm:mb-4 kicker text-slate-500">Records</div>
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
                    className="max-w-4xl space-y-8"
                  >
                    <BriefCover
                      titleId="adr-title"
                      status={activeAdr.currentStatus === "Verified" ? "Documented" : (activeAdr.currentStatus || "Documented")}
                      kicker={activeAdr.date}
                      title={activeAdr.title}
                      lede={activeAdr.problem}
                      situation={activeAdr.context}
                      choice={activeAdr.decision}
                      cost={activeAdr.tradeoffs}
                      consequence={activeAdr.consequences}
                    />

                    {(activeAdr.rejectedAlternatives || []).length > 0 && (
                      <section>
                        <h3 className="kicker text-slate-500 mb-3">Not chosen</h3>
                        <div className="grid gap-2">
                          {(activeAdr.rejectedAlternatives || []).map((opt, i) => (
                            <div key={i} className="rounded-lg border border-obsidian-border/80 bg-obsidian/50 px-3 py-2">
                              <div className="font-sans text-sm font-semibold text-slate-200">{opt.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{opt.description}</div>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
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
