import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Network } from "lucide-react";
import { ADR_RECORDS } from "../data/adrs";
import { useSystemCommand } from "../context/SystemCommandContext";
import { useSpatial, TABS } from "../SpatialContext";
import { ledgerReveal } from "../lib/motion";

export default function TrustCenter() {
  const { openAdrs, openEnterpriseExplorer, playClickSound } = useSystemCommand();
  const { setActiveTab } = useSpatial();

  return (
    <section className="pointer-events-none relative isolate w-full py-8 sm:py-14">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12 lg:px-16 space-y-10">
        <motion.div
          {...ledgerReveal}
          className="max-w-2xl space-y-5"
        >
          <p className="kicker text-emerald-400/80">Records</p>
          <h1 className="font-display text-[2.5rem] sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[0.95] tracking-[-0.04em] text-white">
            Decision records
          </h1>
          <p className="lede">
            The record set. Comparisons sit in Evidence.
          </p>
        </motion.div>

        <div className="pointer-events-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {ADR_RECORDS.map((adr, index) => (
            <button
              key={adr.id}
              type="button"
              onClick={() => {
                playClickSound?.();
                openAdrs(adr.id);
              }}
              className="group text-left rounded-2xl border border-obsidian-border/80 bg-slate-950/70 p-5 sm:p-6 hover:border-emerald-400/40"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="kicker text-emerald-400/80">
                  Plate {String(index + 1).padStart(2, "0")} · {adr.id}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  {adr.currentStatus === "Verified" ? "Documented" : adr.currentStatus || "Documented"}
                </span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-[-0.03em] group-hover:text-emerald-300">
                {adr.title}
              </h2>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed line-clamp-3">
                {adr.problem || adr.context}
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs font-medium text-cyan-electric">
                Open folio
                <ArrowRight size={12} className="group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>

        <div className="pointer-events-auto grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setActiveTab(TABS.POINT_CLOUD)}
            className="rounded-2xl border border-obsidian-border/70 bg-obsidian/50 p-4 text-left hover:border-emerald-400/40"
          >
            <p className="kicker text-emerald-400/80 mb-2">Evidence</p>
            <p className="font-sans text-sm text-slate-300">Modeled comparisons sit in Evidence, not here.</p>
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound?.();
              openEnterpriseExplorer();
            }}
            className="rounded-2xl border border-obsidian-border/70 bg-obsidian/50 p-4 text-left hover:border-cyan-electric/40"
          >
            <p className="kicker text-cyan-electric/80 mb-2 flex items-center gap-2">
              <Network size={12} /> Map
            </p>
            <p className="font-sans text-sm text-slate-300">A spatial view of the systems. Click a node for a short note.</p>
          </button>
        </div>
      </div>
    </section>
  );
}
