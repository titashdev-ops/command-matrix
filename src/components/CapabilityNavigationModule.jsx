import React, { useState } from "react";
import { Compass, Lock, Eye, Filter } from "lucide-react";
import { CASE_STUDIES } from "../data/missions";
import { useSystemCommand } from "../context/SystemCommandContext";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

export const CAPABILITY_PROBLEM_CATEGORIES = [
  {
    id: "all",
    label: "All work",
    desc: "Open every problem shape."
  },
  {
    id: "telemetry",
    label: "Telemetry",
    desc: "High-rate systems and spatial maps.",
    targetMissionId: "ops-dronly"
  },
  {
    id: "healthcare",
    label: "Clinical records",
    desc: "Audit trails, privacy, and care workflows.",
    targetMissionId: "prodent-os"
  },
  {
    id: "ai-graph",
    label: "AI + graphs",
    desc: "Semantic search and structured retrieval.",
    targetMissionId: "career-os"
  },
  {
    id: "crdt-sync",
    label: "Local-first sync",
    desc: "Offline state, merges, and browser-native search.",
    targetMissionId: "personal-os"
  },
  {
    id: "spiking",
    label: "0-to-1 discovery",
    desc: "Feasibility checks and architecture sketches.",
    targetMissionId: "future-research"
  }
];

export default function CapabilityNavigationModule({ onOpenDossier }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { playClickSound } = useSystemCommand();

  const filteredMissions = CASE_STUDIES.filter((m) => {
    if (selectedCategory === "all") return true;
    const categoryMatch = CAPABILITY_PROBLEM_CATEGORIES.find((c) => c.id === selectedCategory);
    return categoryMatch && categoryMatch.targetMissionId === m.missionId;
  });

  return (
    <div className="my-8 space-y-6 font-sans">
      <div className="space-y-3 rounded-xl border border-amber-400/40 bg-slate-950/90 p-5 shadow-xl sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-400/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-2 text-amber-300">
              <Compass size={20} />
            </div>
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-wider text-amber-400/80">
                Problem-shape index
              </p>
              <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                Explore work by problem shape, not project name.
              </h2>
            </div>
          </div>

          <span className="rounded-full border border-cyan-electric/40 bg-cyan-electric/10 px-3 py-1 text-xs font-bold text-cyan-electric">
            Editorial index
          </span>
        </div>

        <p className="max-w-4xl text-xs leading-relaxed text-slate-300 sm:text-sm">
          Choose the constraint. The cards stay short on purpose.
        </p>
      </div>

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
                "flex min-h-[40px] cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-bold transition-all",
                isSelected
                  ? "border-amber-400/60 bg-amber-400/20 text-amber-300 shadow-lg"
                  : "border-slate-800 bg-slate-900/80 text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              <Filter size={12} className={isSelected ? "text-amber-400" : "text-slate-500"} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredMissions.map((mission) => {
          const review = mission.engineeringReview || {};
          const bind = review.hardConstraints?.[0] || mission.businessProblem?.operational || mission.missionObjective;
          return (
            <div
              key={mission.missionId}
              className="group flex flex-col justify-between space-y-4 rounded-lg border border-slate-800/80 bg-slate-950/50 p-5 transition-colors duration-200 hover:border-amber-400/40"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-cyan-electric">
                    {mission.classification}
                  </span>
                  <span className="font-sans text-xs text-slate-500">
                    {mission.projectName}
                  </span>
                </div>

                <h3 className="font-sans text-base font-bold text-white transition-colors duration-200 group-hover:text-amber-300">
                  {mission.problemSolved || mission.businessProblem?.business || mission.missionObjective}
                </h3>

                <p className="font-sans text-xs leading-relaxed text-slate-300">
                  {review.technicalProblem || mission.businessProblem?.operational}
                </p>

                {bind && (
                  <div className="rounded-xl border border-obsidian-border/80 bg-slate-950/60 p-4">
                    <div className="kicker mb-2 flex items-center gap-1 text-amber-300/80">
                      <Lock size={11} /> The bind
                    </div>
                    <p className="text-xs leading-relaxed text-slate-200">{bind}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    if (onOpenDossier) onOpenDossier(mission);
                  }}
                  className="flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 transition-all duration-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                >
                  <Eye size={14} className="text-amber-400" />
                  Open dossier
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
