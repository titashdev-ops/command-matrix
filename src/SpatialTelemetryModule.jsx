import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import SystemsIntelligenceCanvas from "./components/SystemsIntelligenceCanvas";
import FloatingIntelligenceModules from "./components/FloatingIntelligenceModules";
import {
  ArrowRight,
  Crosshair,
} from "lucide-react";
import { useSpatial, TABS } from "./SpatialContext";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

export default function SpatialTelemetryModule() {
  const { setActiveTab, targetLock, setTargetLock } = useSpatial();

  return (
    <>
      
      <section className="pointer-events-none relative isolate w-full py-8 sm:py-14">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12 lg:px-16 space-y-10">
          
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
            }}
            className="relative max-w-3xl space-y-5"
          >
            <div className="hud-bloom hidden md:block" aria-hidden="true" />
            <motion.p
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } } }}
              className="font-mono text-[10px] tracking-[0.32em] uppercase text-cyan-electric/80"
            >
              Portfolio · Spatial HUD
            </motion.p>
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 240, damping: 22 } } }}
              className="hologram-name font-sans text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold leading-[1.05] tracking-tight drop-shadow-[0_0_42px_rgba(0,240,255,0.22)]"
            >
              Titash Dev
            </motion.h1>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } } }}
              className="font-mono text-sm tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-electric via-teal-200 to-emerald-glow"
            >
              Systems Architect
            </motion.p>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 24 } } }}
              className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-2xl"
            >
              Architecture case studies in UAV operations, clinical systems, and talent graphs. Modeled systems — not a live command center.
            </motion.p>
          </motion.div>

          {/* Named case studies first */}
          <div className="pointer-events-auto">
            <FloatingIntelligenceModules />
          </div>

          {/* Quiet, Discreet Primary CTA Link */}
          <div className="pt-4 flex items-center justify-between pointer-events-auto border-t border-obsidian-border/40">
            <span className="font-sans text-xs text-slate-400">
              Decision records and modeled comparisons live in Evidence.
            </span>
            <button
              type="button"
              onClick={() => setActiveTab(TABS.POINT_CLOUD)}
              className="inline-flex items-center gap-2 font-sans text-xs font-bold text-cyan-electric hover:text-cyan-300 transition-colors cursor-pointer group py-2"
            >
              <span>Open evidence</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Topology canvas — atmosphere, not the story */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden overflow-hidden rounded-2xl border border-cyan-electric/25 bg-slate-950/55 shadow-[0_20px_60px_rgba(0,0,0,0.55),0_0_80px_rgba(0,240,255,0.08),_inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl pointer-events-auto md:flex md:flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-emerald-900/10 pointer-events-none" />
            <div className="flex items-center justify-between border-b border-obsidian-border/60 bg-obsidian-surface/80 px-5 py-3 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <Crosshair size={15} className="text-cyan-electric" />
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-200">
                  System topology model
                </span>
              </div>
              <span className="font-sans text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                Interactive · not live ops
              </span>
            </div>

            <div className="relative p-2 sm:p-4 flex-1 min-h-[360px]">
              <SystemsIntelligenceCanvas />
            </div>

            <AnimatePresence>
              {targetLock && (
                <motion.div
                  initial={{ opacity: 0, y: 12, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: 12, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-obsidian-border/60 bg-obsidian-surface/90 px-5 py-3.5 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="mb-0.5 font-sans text-[10px] uppercase tracking-wider text-slate-500">Selected node</div>
                      <div className="font-sans text-sm font-semibold text-white">{targetLock.label}</div>
                      <div className="mt-0.5 font-sans text-xs text-cyan-electric">
                        ID: {targetLock.id.toUpperCase()}
                      </div>
                    </div>
                    <button
                      onClick={() => setTargetLock(null)}
                      className="rounded-md border border-obsidian-border bg-obsidian px-3 py-1 font-sans text-[10px] uppercase tracking-wider text-slate-400 transition-colors hover:text-white cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>
    </>
  );
}
