import React from "react";
import { motion, AnimatePresence } from "framer-motion";

import SystemsIntelligenceCanvas from "./components/SystemsIntelligenceCanvas";
import FloatingIntelligenceModules from "./components/FloatingIntelligenceModules";
import {
  ArrowRight,
  Crosshair,
} from "lucide-react";
import { useSpatial, TABS } from "./SpatialContext";
import { staggerHero, heroItem, heroName } from "./lib/motion";

export default function SpatialTelemetryModule() {
  const { setActiveTab, targetLock, setTargetLock } = useSpatial();

  return (
    <>
      
      <section className="pointer-events-none relative isolate w-full py-4 sm:py-8">
        <div className="relative z-10 w-full space-y-8">
          
          <motion.div
            initial={false}
            animate="show"
            variants={staggerHero}
            className="relative max-w-3xl"
          >
            <div className="hud-bloom hidden md:block" aria-hidden="true" />
            <div className="relative space-y-4">
              <motion.p variants={heroItem} className="kicker text-cyan-electric/80">
                Titash Deb · Systems architect
              </motion.p>
              <motion.h1
                variants={heroName}
                className="font-display text-[2.05rem] font-extrabold leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl lg:text-[4.25rem]"
              >
                Architecture
                <span className="block text-slate-300">case studies</span>
              </motion.h1>
              <motion.p variants={heroItem} className="lede max-w-xl">
                Featured studies, each with the decision and the tradeoff written down. The library holds more. A portfolio simulation — not a live operations platform.
              </motion.p>
            </div>
          </motion.div>

          {/* Named case studies first */}
          <div className="pointer-events-auto">
            <FloatingIntelligenceModules />
          </div>

          {/* Quiet, Discreet Primary CTA Link */}
          <div className="pointer-events-auto flex flex-col gap-2 border-t border-obsidian-border/40 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-sans text-xs text-slate-400">
              Comparisons and decision records are on Compare.
            </span>
            <button
              type="button"
              onClick={() => setActiveTab(TABS.POINT_CLOUD)}
              className="inline-flex items-center gap-2 font-sans text-xs font-bold text-cyan-electric hover:text-cyan-300 transition-colors cursor-pointer group py-2"
            >
              <span>Open Compare</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Topology canvas — atmosphere, not the story */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="relative hidden overflow-hidden rounded-2xl border border-cyan-electric/25 bg-slate-950/55 shadow-[0_20px_60px_rgba(0,0,0,0.55),0_0_80px_rgba(0,240,255,0.08),_inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl pointer-events-auto md:flex md:flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-emerald-900/10 pointer-events-none" />
            <div className="flex items-center justify-between border-b border-obsidian-border/60 bg-obsidian-surface/80 px-5 py-3 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <Crosshair size={15} className="text-cyan-electric" />
                <span className="font-sans text-xs font-semibold tracking-wider text-slate-200">
                  System topology
                </span>
              </div>
              <span className="font-sans text-[10px] tracking-wide text-slate-500">
                A model · not live ops
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
                      <div className="mb-0.5 font-sans text-[10px] tracking-wide text-slate-500">Selected</div>
                      <div className="font-sans text-sm font-semibold text-white">{targetLock.label}</div>
                      <div className="mt-0.5 font-sans text-xs text-cyan-electric">
                        ID: {targetLock.id.toUpperCase()}
                      </div>
                    </div>
                    <button
                      onClick={() => setTargetLock(null)}
                      className="rounded-md border border-obsidian-border bg-obsidian px-3 py-1 font-sans text-[10px] tracking-wide text-slate-400 transition-colors hover:text-white cursor-pointer"
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
