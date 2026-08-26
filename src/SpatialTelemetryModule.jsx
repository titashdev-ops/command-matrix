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
      
      <section className="pointer-events-none relative isolate w-full py-8 sm:py-14">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12 lg:px-16 space-y-10">
          
          <motion.div
            initial="hidden"
            animate="show"
            variants={staggerHero}
            className="relative grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16"
          >
            <div className="hud-bloom hidden md:block" aria-hidden="true" />
            <div className="relative space-y-5 lg:col-span-7">
              <motion.p variants={heroItem} className="kicker text-cyan-electric/80">
                Command Matrix
              </motion.p>
              <motion.h1
                variants={heroName}
                className="hologram-name font-display text-[2.85rem] sm:text-6xl lg:text-[4.4rem] font-extrabold leading-[0.92] tracking-[-0.045em] drop-shadow-[0_0_42px_rgba(0,240,255,0.22)]"
              >
                Titash Dev
              </motion.h1>
              <motion.p
                variants={heroItem}
                className="kicker text-transparent bg-clip-text bg-gradient-to-r from-cyan-electric via-teal-200 to-emerald-glow tracking-[0.22em]"
              >
                Systems Architect
              </motion.p>
            </div>
            <motion.p
              variants={heroItem}
              className="lede lg:col-span-5 lg:pb-2 lg:text-right"
            >
              I design operating systems for fleets, clinics, and talent graphs. This HUD is the portfolio. The systems inside are modeled — not live ops.
            </motion.p>
          </motion.div>

          {/* Named case studies first */}
          <div className="pointer-events-auto">
            <FloatingIntelligenceModules />
          </div>

          {/* Quiet, Discreet Primary CTA Link */}
          <div className="pt-4 flex items-center justify-between pointer-events-auto border-t border-obsidian-border/40">
            <span className="font-sans text-xs text-slate-400">
              Comparisons and decision records sit in Evidence.
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
