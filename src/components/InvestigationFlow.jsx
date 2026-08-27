import React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Network,
  BookOpen,
} from "lucide-react";
import EvidenceCard from "./EvidenceCard";

function Block({ icon: Icon, kicker, title, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="rounded-2xl border border-obsidian-border/70 bg-slate-950/60 p-5 sm:p-7"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon size={14} className="text-cyan-electric" />
        <span className="kicker text-cyan-electric/80">
          {kicker}
        </span>
      </div>
      <h3 className="font-sans text-lg sm:text-xl font-bold text-white mb-3">{title}</h3>
      {children}
    </motion.section>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-obsidian-border bg-obsidian px-2.5 py-1 font-sans text-xs tracking-wide text-slate-300">
      {children}
    </span>
  );
}

export default function InvestigationFlow({ mission }) {
  const ledger = mission.decisionLedger || mission.engineeringReview?.decisionLedger || [];
  const constraints = mission.engineeringReview?.hardConstraints || [];
  const primaryDecision = ledger[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Block icon={AlertTriangle} kicker="01 · Situation" title="Why this existed">
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {mission.businessProblem?.business || mission.missionObjective}
        </p>
        {mission.businessProblem?.operational && (
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            {mission.businessProblem.operational}
          </p>
        )}
        {constraints.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {constraints.slice(0, 4).map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>
        )}
      </Block>

      <Block icon={CheckCircle2} kicker="02 · Decision" title="What was chosen">
        <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
          {primaryDecision?.decision || mission.engineeringIntelligence?.primaryEngineeringPattern || "See architecture notes."}
        </p>
        {primaryDecision?.reason && (
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">{primaryDecision.reason}</p>
        )}
        {ledger.length > 1 && (
          <div className="mt-4 grid gap-2">
            {ledger.slice(1, 4).map((d) => (
              <div key={d.decision} className="rounded-lg border border-obsidian-border/60 bg-obsidian/50 px-3 py-2">
                <div className="font-sans text-xs font-semibold text-slate-200">{d.decision}</div>
                {d.tradeoff && <div className="text-[11px] text-slate-500 mt-0.5">{d.tradeoff}</div>}
              </div>
            ))}
          </div>
        )}
      </Block>

      <Block icon={Network} kicker="03 · System" title="How it is shaped">
        <p className="font-mono text-xs sm:text-sm text-cyan-electric/90 leading-relaxed">
          {mission.architecture}
        </p>
        {mission.technologyStack?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {mission.technologyStack.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        )}
      </Block>

      <Block icon={BookOpen} kicker="04 · Aftermath" title="What it taught">
        <p className="text-sm text-slate-300 leading-relaxed">{mission.businessImpact}</p>
        {mission.lessonsLearned?.length > 0 && (
          <ul className="mt-4 space-y-2">
            {mission.lessonsLearned.slice(0, 3).map((l) => (
              <li key={l} className="text-sm text-slate-400 leading-relaxed pl-3 border-l border-cyan-electric/30">
                {l}
              </li>
            ))}
          </ul>
        )}
      </Block>

      {mission.evidence && mission.evidence.length > 0 && (
        <div className="pt-2 space-y-3">
          <h3 className="kicker text-slate-500">
            Evidence
          </h3>
          {mission.evidence.slice(0, 3).map((ev, i) => (
            <EvidenceCard
              key={i}
              title={ev.title}
              status={ev.verificationStatus || "Documented"}
              comparison={{ frame: ev.detail }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
