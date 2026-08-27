import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { coverReveal, galleryReveal, ledgerReveal, noteReveal, springSoft } from "../lib/motion";

const cn = (...inputs) => twMerge(clsx(inputs));

export function briefFromMission(mission) {
  if (!mission) return {};
  const authored = mission.brief || {};
  const ledger = mission.decisionLedger?.length
    ? mission.decisionLedger
    : mission.engineeringReview?.decisionLedger || [];
  const first = ledger[0] || {};
  return {
    status: mission.implementationStatus || "Documented",
    kicker: mission.domain,
    title: mission.projectName,
    lede:
      authored.lede ||
      mission.executiveSummary?.split(". ").slice(0, 1).join(". ") ||
      mission.businessImpact,
    situation:
      authored.situation ||
      mission.engineeringReview?.technicalProblem ||
      mission.businessProblem?.business ||
      mission.missionObjective,
    choice:
      authored.choice ||
      first.decision ||
      mission.engineeringIntelligence?.primaryEngineeringPattern,
    cost: authored.cost || first.tradeoff || first.tradeOffs,
    consequence: authored.consequence || mission.businessImpact,
  };
}

const TONES = {
  gallery: {
    wrap: "border-cyan-electric/25 shadow-[0_0_110px_rgba(0,240,255,0.14)]",
    chip: "border-cyan-electric/30 bg-cyan-electric/12 text-cyan-electric",
    cell: "border-cyan-electric/15 bg-cyan-electric/7 text-cyan-electric/80",
    motion: galleryReveal,
    labels: ["Situation", "Choice", "Cost"],
    sweep: "from-cyan-electric/25 via-cyan-electric/10 to-transparent",
    rail: "from-cyan-electric/45 to-transparent",
    then: "text-cyan-electric/80",
  },
  judgment: {
    wrap: "border-amber-400/30 shadow-[0_0_95px_rgba(251,191,36,0.15)]",
    chip: "border-amber-400/40 bg-amber-400/12 text-amber-300",
    cell: "border-amber-400/15 bg-amber-400/7 text-amber-200/80",
    motion: coverReveal,
    labels: ["The bind", "What I picked", "What I gave up"],
    sweep: "from-amber-400/25 via-amber-400/10 to-transparent",
    rail: "from-amber-400/45 to-transparent",
    then: "text-amber-300/80",
  },
  ledger: {
    wrap: "border-emerald-glow/25 shadow-[0_0_90px_rgba(52,211,153,0.12)]",
    chip: "border-emerald-glow/30 bg-emerald-glow/12 text-emerald-glow",
    cell: "border-emerald-glow/15 bg-emerald-glow/7 text-emerald-glow/80",
    motion: ledgerReveal,
    labels: ["Why", "Pick", "Price"],
    sweep: "from-emerald-glow/25 via-emerald-glow/10 to-transparent",
    rail: "from-emerald-glow/45 to-transparent",
    then: "text-emerald-glow/80",
  },
  note: {
    wrap: "border-obsidian-border/80 shadow-[0_0_60px_rgba(15,23,42,0.2)]",
    chip: "border-obsidian-border bg-obsidian text-slate-200",
    cell: "border-obsidian-border/70 bg-obsidian/62 text-slate-300/80",
    motion: noteReveal,
    labels: ["Situation", "Choice", "Cost"],
    sweep: "from-slate-500/20 via-transparent to-transparent",
    rail: "from-slate-500/35 to-transparent",
    then: "text-slate-400",
  },
};

function Cell({ label, children, delay = 0, toneClass }) {
  if (!children) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springSoft, delay }}
      className="rounded-xl border p-4 backdrop-blur-md transition-colors duration-300"
    >
      <div className={cn("kicker mb-2", toneClass)}>{label}</div>
      <div className="font-sans text-sm text-slate-100 leading-relaxed">{children}</div>
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
        "relative isolate overflow-hidden rounded-2xl bg-slate-950/80",
        t.wrap,
        compact ? "p-4 sm:p-5" : "p-6 sm:p-8",
        className
      )}
    >
      <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-90", t.sweep)} aria-hidden="true" />
      <div className={cn("pointer-events-none absolute inset-y-0 left-0 w-px bg-gradient-to-b opacity-70", t.rail)} aria-hidden="true" />
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
            <Cell label={t.labels[0]} delay={0.04} toneClass={t.then}>
              {situation}
            </Cell>
            <Cell label={t.labels[1]} delay={0.1} toneClass={t.then}>
              {choice}
            </Cell>
            <Cell label={t.labels[2]} delay={0.16} toneClass={t.then}>
              {cost}
            </Cell>
          </div>
        )}

        {consequence && (
          <p className={cn("font-sans text-sm leading-relaxed pt-1", t.then)}>
            <span className="kicker mr-2 text-slate-500">Then</span>
            {consequence}
          </p>
        )}
      </div>
    </motion.section>
  );
}
