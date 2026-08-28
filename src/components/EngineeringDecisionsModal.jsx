import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, ChevronRight, BookOpen } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSystemCommand } from "../context/SystemCommandContext";
import { ADR_RECORDS } from "../data/adrs";
import AdrSimulatorTab from "./AdrSimulatorTab";
import { useModal } from "../hooks/useModal";
import { modalReveal, overlayFade, easeLux } from "../lib/motion";
import BriefCover from "./BriefCover";

const cn = (...inputs) => twMerge(clsx(inputs));

const pageTurn = {
  initial: { opacity: 0, x: 28 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.42, ease: easeLux },
};

export default function EngineeringDecisionsModal() {
  const { isAdrsOpen, closeAdrs, playClickSound, targetAdrId, setTargetAdrId } = useSystemCommand();
  const [activeAdrId, setActiveAdrId] = useState(ADR_RECORDS[0]?.id);
  const [plate, setPlate] = useState(1);
  const modalRef = useRef(null);

  useEffect(() => {
    if (targetAdrId && typeof targetAdrId === "string") {
      setActiveAdrId(targetAdrId);
      setPlate(1);
      setTargetAdrId(null);
    }
  }, [targetAdrId, setTargetAdrId]);

  useModal({ isOpen: isAdrsOpen, onClose: closeAdrs, ref: modalRef });

  if (!isAdrsOpen) return null;

  const activeAdr = ADR_RECORDS.find((a) => a.id === activeAdrId);
  const status =
    activeAdr?.currentStatus === "Verified"
      ? "Documented"
      : activeAdr?.currentStatus || "Documented";

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
          className="relative flex h-full max-h-[96vh] sm:max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-emerald-glow/25 bg-obsidian-surface/95 shadow-[0_0_80px_rgba(52,211,153,0.08)] overscroll-contain"
        >
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-obsidian-border/60 bg-obsidian/80 p-4 sm:px-6 sm:py-5">
            <div className="min-w-0 space-y-3">
              <p className="kicker text-emerald-glow/80">Decision folio</p>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-[-0.03em] text-white">
                Picks, written down
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 1, label: "Record" },
                  { id: 2, label: "Trade-off model" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setPlate(item.id);
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1.5 font-sans text-xs font-medium min-h-[36px]",
                      plate === item.id
                        ? "border-emerald-glow/40 bg-emerald-glow/10 text-emerald-glow"
                        : "border-obsidian-border text-slate-500 hover:text-slate-200"
                    )}
                  >
                    Plate {String(item.id).padStart(2, "0")} · {item.label}
                  </button>
                ))}
              </div>
              <p className="font-sans text-xs text-slate-500">
                Choices I would defend. Not a live system.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                closeAdrs();
              }}
              aria-label="Close records"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-obsidian-border hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
            >
              <X size={20} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            {plate === 1 ? (
              <motion.div
                key="plate-01"
                {...pageTurn}
                className="flex min-h-0 flex-1 flex-col md:flex-row"
              >
                <div className="w-full shrink-0 overflow-y-auto max-h-44 md:max-h-none border-b border-obsidian-border/60 bg-obsidian/50 p-2.5 sm:p-4 md:w-80 md:border-b-0 md:border-r md:p-6 custom-scrollbar">
                  <div className="mb-2 sm:mb-4 kicker text-slate-500">Record index</div>
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    {ADR_RECORDS.map((adr) => {
                      const isActive = activeAdrId === adr.id;
                      return (
                        <button
                          type="button"
                          key={adr.id}
                          onClick={() => {
                            playClickSound();
                            setActiveAdrId(adr.id);
                          }}
                          className={cn(
                            "flex items-start gap-2.5 sm:gap-3 rounded-lg border p-2.5 sm:p-3 text-left",
                            isActive
                              ? "border-cyan-electric/50 bg-cyan-electric/10 shadow-cyan-glow"
                              : "border-transparent text-slate-400 hover:bg-obsidian-surface/60 hover:border-obsidian-border hover:text-slate-200"
                          )}
                        >
                          <FileText
                            size={16}
                            className={cn("mt-0.5 shrink-0", isActive ? "text-cyan-electric" : "text-slate-500")}
                          />
                          <div>
                            <div className={cn("font-sans text-xs sm:text-sm font-medium leading-tight mb-0.5", isActive ? "text-cyan-electric" : "text-slate-300")}>
                              {adr.title}
                            </div>
                            <div className="font-sans text-[11px] text-slate-500">{adr.date}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
                  <AnimatePresence mode="wait">
                    {activeAdr && (
                      <motion.div key={activeAdr.id} className="max-w-4xl space-y-8">
                        <BriefCover
                          titleId="adr-title"
                          status={status}
                          kicker={activeAdr.date}
                          title={activeAdr.title}
                          lede={activeAdr.problem}
                          situation={activeAdr.context}
                          choice={activeAdr.decision}
                          cost={activeAdr.tradeoffs}
                          consequence={activeAdr.consequences}
                          tone="ledger"
                        />

                        {(activeAdr.rejectedAlternatives || []).length > 0 && (
                          <section>
                            <h3 className="kicker text-slate-500 mb-3">Not chosen</h3>
                            <div className="grid gap-2">
                              {(activeAdr.rejectedAlternatives || []).map((opt) => (
                                <div key={opt.name} className="rounded-lg border border-obsidian-border/80 bg-obsidian/50 px-3 py-2">
                                  <div className="font-sans text-sm font-medium text-slate-200">{opt.name}</div>
                                  <div className="text-xs text-slate-500 mt-0.5">{opt.description}</div>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            playClickSound();
                            setPlate(2);
                          }}
                          className="inline-flex items-center gap-2 font-sans text-xs font-medium text-emerald-glow hover:text-emerald-200"
                        >
                          Turn to plate 02 · Trade-off model
                          <ChevronRight size={14} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="plate-02"
                {...pageTurn}
                className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar"
              >
                <div className="mb-6 max-w-2xl space-y-2">
                  <p className="kicker text-cyan-electric/80">Plate 02 · Teaching model</p>
                  <h3 className="font-display text-2xl font-extrabold tracking-[-0.03em] text-white">
                    Trade-off model
                  </h3>
                  <p className="lede">
                    A walk-through of constraint trade-offs. Numbers here are simulated teaching artifacts.
                  </p>
                </div>
                <AdrSimulatorTab />
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setPlate(1);
                  }}
                  className="mt-6 inline-flex items-center gap-2 font-sans text-xs font-medium text-slate-400 hover:text-slate-200"
                >
                  <BookOpen size={14} />
                  Back to plate 01 · Record
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
