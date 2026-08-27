import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { coverReveal, galleryReveal, ledgerReveal, springSoft } from "../lib/motion";

const cn = (...inputs) => twMerge(clsx(inputs));

export function briefFromMission(mission) {
  if (!mission) return {};
  const ledger = mission.decisionLedger?.length
    ? mission.decisionLedger
    : mission.engineeringReview?.decisionLedger || [];
  const first = ledger[0] || {};
  return {
    status: mission.implementationStatus || "Documented",
    kicker: mission.domain,
    title: mission.projectName,
    lede:
      mission.executiveSummary?.split(". ").slice(0, 1).join(". ") ||
      mission.businessImpact,
    situation:
      mission.engineeringReview?.technicalProblem ||
      mission.businessProblem?.business ||
      mission.missionObjective,
    choice: first.decision || mission.engineeringIntelligence?.primaryEngineeringPattern,
    cost: first.tradeoff || first.tradeOffs,
    consequence: mission.businessImpact,
  };
}

const TONES = {
  gallery: {
    wrap: "border border-cyan-electric/25 shadow-[0_0_90px_rgba(0,240,255,0.12)]",
    chip: "border-cyan-electric/30 bg-cyan-electric/10 text-cyan-electric",
    cell: "text-cyan-electric/70",
    motion: galleryReveal,
    labels: ["Situation", "Choice", "Cost"],
  },
  judgment: {
    wrap: "border border-amber-400/30 shadow-[0_0_80px_rgba(251,191,36,0.12)]",
    chip: "border-amber-400/40 bg-amber-400/10 text-amber-300",
    cell: "text-amber-300/80",
    motion: coverReveal,
    labels: ["The bind", "What I picked", "What I gave up"],
  },
  ledger: {
    wrap: "border border-emerald-glow/25 shadow-[0_0_70px_rgba(52,211,153,0.1)]",
    chip: "border-emerald-glow/30 bg-emerald-glow/10 text-emerald-glow",
    cell: "text-emerald-glow/80",
    motion: ledgerReveal,
    labels: ["Why", "Pick", "Price"],
  },
  note: {
    wrap: "border border-obsidian-border/80 shadow-none",
    chip: "border-obsidian-border bg-obsidian text-slate-300",
    cell: "text-slate-500",
    motion: coverReveal,
    labels: ["Situation", "Choice", "Cost"],
  },
};

function Cell({ label, children, delay = 0, toneClass }) {
  if (!children) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springSoft, delay }}
      className="rounded-xl border border-obsidian-border/70 bg-obsidian/55 p-4 backdrop-blur-md"
    >
      <div className={cn("kicker mb-2", toneClass)}>{label}</div>
      <div className="font-sans text-sm text-slate-200 leading-relaxed">{children}</div>
    </motion.div>
  );
}

export default function BriefCover({
  kicker,
  status,
  title,
  lede,
  situation,
  choice,
  cost,
  consequence,
  note,
  layoutId,
  titleId,
  className,
  compact = false,
  tone = "gallery",
}) {
  const t = TONES[tone] || TONES.gallery;
  return (
    <motion.section
      {...t.motion}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-slate-950/70",
        t.wrap,
        compact ? "p-4 sm:p-5" : "p-6 sm:p-8",
        className
      )}
    >
      <div className="dossier-sheen hidden md:block" aria-hidden="true" />
      <div className="relative z-10 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {status && (
            <span className={cn("kicker rounded-full border px-2.5 py-1", t.chip)}>
              {status}
            </span>
          )}
          {kicker && <span className="kicker text-slate-500">{kicker}</span>}
        </div>
        {title && (
          <motion.h2
            id={titleId}
            layoutId={layoutId}
            className={cn(
              "font-display font-extrabold tracking-[-0.035em] text-white",
              compact ? "text-lg sm:text-xl" : "text-2xl sm:text-4xl"
            )}
          >
            {title}
          </motion.h2>
        )}
        {lede && <p className={cn("lede max-w-2xl", compact && "text-base")}>{lede}</p>}
        {note && <p className="font-sans text-sm text-slate-500">{note}</p>}
        {(situation || choice || cost) && (
          <div className={cn("grid gap-3", compact ? "sm:grid-cols-2" : "sm:grid-cols-3", !compact && "pt-2")}>
            <Cell label={t.labels[0]} delay={0.04} toneClass={t.cell}>{situation}</Cell>
            <Cell label={t.labels[1]} delay={0.1} toneClass={t.cell}>{choice}</Cell>
            <Cell label={t.labels[2]} delay={0.16} toneClass={t.cell}>{cost}</Cell>
          </div>
        )}
        {consequence && (
          <p className="font-sans text-sm text-slate-400 leading-relaxed pt-1">
            <span className="kicker text-slate-500 mr-2">Then</span>
            {consequence}
          </p>
        )}
      </div>
    </motion.section>
  );
}
