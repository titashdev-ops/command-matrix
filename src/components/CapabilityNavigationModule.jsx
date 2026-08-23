/* --- FILE: src/components/CapabilityNavigationModule.jsx --- */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, AlertTriangle, Cpu, Lock, CheckCircle2, ArrowRight, 
  Layers, ShieldCheck, Zap, Activity, Filter, Eye
} from "lucide-react";
import { CASE_STUDIES } from "../data/missions";
import { useSystemCommand } from "../context/SystemCommandContext";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

export const CAPABILITY_PROBLEM_CATEGORIES = [
  {
    id: "all",
    label: "ALL PROBLEMS",
    desc: "View all technical problem domains and architecture reviews."
  },
  {
    id: "telemetry",
    label: "HIGH CONCURRENCY & TELEMETRY",
    desc: "Ingesting 50k+ events/sec, spatial coordinate indexing, sub-33ms render loops.",
    targetMissionId: "ops-dronly"
  },
  {
    id: "healthcare",
    label: "HIPAA COMPLIANCE & IMMUTABLE LOGS",
    desc: "Zero-tamper clinical event streams, FHIR interoperability, zero PHI cloud leaks.",
    targetMissionId: "healthcare-os"
  },
  {
    id: "ai-graph",
    label: "LOCAL AI & VECTOR-GRAPH ENGINES",
    desc: "Air-gapped semantic search, Zod schema extraction, hybrid vector-graph indexing.",
    targetMissionId: "prodent-os"
  },
  {
    id: "crdt-sync",
    label: "LOCAL-FIRST & CRDT SYNC",
    desc: "0ms local input response, offline Yjs state vector merges, browser Wasm search.",
    targetMissionId: "career-os"
  },
  {
    id: "spiking",
    label: "0-TO-1 SPIKING & DISCOVERY",
    desc: "Rapid technical feasibility validation, C4 architecture models, zero premature debt.",
    targetMissionId: "future-research"
  }
];

export default function CapabilityNavigationModule({ onOpenDossier, onStartDiscovery }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { playClickSound, openContact } = useSystemCommand();

  const filteredMissions = CASE_STUDIES.filter((m) => {
    if (selectedCategory === "all") return true;
    const categoryMatch = CAPABILITY_PROBLEM_CATEGORIES.find(c => c.id === selectedCategory);
    return categoryMatch && categoryMatch.targetMissionId === m.missionId;
  });

  return (
    <div className="space-y-6 font-sans my-8">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-xl bg-slate-950/90 border border-amber-400/40 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-400/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/30">
              <Compass size={20} />
            </div>
            <div>
              <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-amber-400 font-bold">
                PROBLEM-FIRST ARCHITECTURE NAVIGATION
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Explore Work by Problem Domain Rather Than Project Name
              </h2>
            </div>
          </div>

          <span className="font-sans text-xs px-3 py-1 rounded-full border border-cyan-electric/40 bg-cyan-electric/10 text-cyan-electric font-bold">
            Capability-Led Index
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-4xl">
          Select the specific technical constraint or operational challenge your engineering team is facing to review proven architectural solutions and engineering trade-offs.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {CAPABILITY_PROBLEM_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                playClickSound();
                setSelectedCategory(cat.id);
              }}
              className={cn(
                "px-3.5 py-2 rounded-lg font-sans text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border min-h-[40px]",
                isSelected
                  ? "bg-amber-400/20 text-amber-300 border-amber-400/60 shadow-lg"
                  : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900"
              )}
            >
              <Filter size={12} className={isSelected ? "text-amber-400" : "text-slate-500"} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Problem Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMissions.map((mission) => {
          const review = mission.engineeringReview || {};
          return (
            <div
              key={mission.missionId}
              className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-amber-400/50 transition-all duration-200 space-y-4 flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="font-sans font-medium text-slate-400 uppercase tracking-wider text-cyan-electric font-bold">
                    {mission.classification}
                  </span>
                  <span className="font-sans text-xs text-slate-500">
                    {mission.projectName}
                  </span>
                </div>

                {/* Problem Title & Description */}
                <h3 className="text-base font-bold text-white font-sans group-hover:text-amber-300 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50">
                  {mission.problemSolved || mission.businessProblem?.business}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {review.technicalProblem || mission.businessProblem?.operational}
                </p>

                {/* Hard Constraints Badge List */}
                {review.hardConstraints && (
                  <div className="pt-2 space-y-1.5 font-sans text-xs">
                    <span className="text-amber-400 font-bold uppercase block flex items-center gap-1">
                      <Lock size={11} /> Hard System Constraints:
                    </span>
                    <ul className="space-y-1 text-slate-300">
                      {review.hardConstraints.slice(0, 3).map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">›</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3  flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (onOpenDossier) onOpenDossier(mission);
                  }}
                  className="flex-1 py-2 px-3 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-sans text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                >
                  <Eye size={14} className="text-amber-400" />
                  <span>Review System Architecture</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (onStartDiscovery) {
                      onStartDiscovery(mission.missionId);
                    } else {
                      openContact();
                    }
                  }}
                  className="py-2 px-3 rounded-lg border border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 font-sans text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                >
                  <span>Discuss Problem</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
