/* --- FILE: src/SpatialTelemetryModule.jsx --- */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import SystemsIntelligenceCanvas from "./components/SystemsIntelligenceCanvas";
import FloatingIntelligenceModules from "./components/FloatingIntelligenceModules";
import { useSystemCommand } from "./context/SystemCommandContext";
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
  const { openContact, openFlagships } = useSystemCommand();

  return (
    <>
      
      <section className="pointer-events-none relative isolate w-full py-12 sm:py-20">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12 lg:px-16 space-y-12">
          
          {/* Calm Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl space-y-3"
          >
            <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-white">
              Product Strategist &{" "}
              <span className="bg-gradient-to-br from-cyan-electric via-teal-300 to-emerald-glow bg-clip-text text-transparent">
                Systems Architect
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
              Resilient enterprise software connecting complex operational workflows with AI-driven automation. Specialized in high-concurrency event pipelines, spatial computing, and multi-stack SaaS integration.
            </p>
          </motion.div>

          {/* Visual Hero — Systems Intelligence Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.99, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-2xl border border-cyan-electric/20 bg-slate-950/60 shadow-[0_20px_50px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl pointer-events-auto flex flex-col"
          >
            {/* Ambient subtle bloom behind canvas */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-emerald-900/10 pointer-events-none" />
            <div className="flex items-center justify-between border-b border-obsidian-border/60 bg-obsidian-surface/80 px-5 py-3 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <Crosshair size={15} className="text-cyan-electric" />
                <span className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-200">
                  Systems Intelligence Control Topology
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-glow opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-glow" />
                </span>
                <span className="font-sans text-[10px] uppercase tracking-wider text-emerald-glow font-bold">
                  Interactive Node Network
                </span>
              </div>
            </div>

            <div className="relative p-2 sm:p-4 flex-1 min-h-[440px]">
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
                      <div className="mb-0.5 font-sans text-[10px] uppercase tracking-wider text-slate-500">Target Lock Acquired</div>
                      <div className="font-sans text-sm font-semibold text-white">{targetLock.label}</div>
                      <div className="mt-0.5 font-sans text-xs text-cyan-electric">
                        ID: {targetLock.id.toUpperCase()} // X:{targetLock.x} Y:{targetLock.y}
                      </div>
                    </div>
                    <button
                      onClick={() => setTargetLock(null)}
                      className="rounded-md border border-obsidian-border bg-obsidian px-3 py-1 font-sans text-[10px] uppercase tracking-wider text-slate-400 transition-colors hover:text-white cursor-pointer"
                    >
                      Release Lock
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Integrated Flagship Missions */}
          <div className="space-y-3 pointer-events-auto">
            <div className="flex items-center justify-between border-b border-obsidian-border/40 pb-2">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400">
                FLAGSHIP MISSIONS
              </span>
              <span className="font-sans text-[10px] text-slate-500">
                Inspect architecture dossiers
              </span>
            </div>

            <FloatingIntelligenceModules onOpenMissionControl={() => openFlagships()} />
          </div>

          {/* Quiet, Discreet Primary CTA Link */}
          <div className="pt-4 flex items-center justify-between pointer-events-auto border-t border-obsidian-border/40">
            <span className="font-sans text-xs text-slate-400">
              Ready to review empirical benchmarks and ADR records?
            </span>
            <button
              type="button"
              onClick={() => setActiveTab(TABS.POINT_CLOUD)}
              className="inline-flex items-center gap-2 font-sans text-xs font-bold text-cyan-electric hover:text-cyan-300 transition-colors cursor-pointer group py-2"
            >
              <span>Explore Technical Evidence</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </section>
    </>
  );
}
