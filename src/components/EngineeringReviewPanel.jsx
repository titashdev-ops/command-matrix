import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Lock, GitBranch } from "lucide-react";
import { coverReveal } from "../lib/motion";

function Cell({ label, children }) {
  return (
    <div className="rounded-xl border border-obsidian-border/80 bg-obsidian/70 p-4">
      <div className="kicker text-amber-300/80 mb-2">{label}</div>
      <div className="font-sans text-sm text-slate-200 leading-relaxed">{children}</div>
    </div>
  );
}

export default function EngineeringReviewPanel({ mission }) {
  if (!mission) return null;

  const review = mission.engineeringReview || {};
  const ledger = mission.decisionLedger?.length ? mission.decisionLedger : review.decisionLedger || [];
  const constraints = review.hardConstraints || [];
  const risks = review.riskReview || {};
  const evolution = review.evolutionReview || [];
  const problem =
    review.technicalProblem ||
    mission.businessProblem?.business ||
    mission.missionObjective;
  const decision = ledger[0]?.decision || "See the brief.";
  const why =
    mission.executiveSummary?.split(". ").slice(0, 1).join(". ") ||
    mission.businessImpact;
  const status = mission.implementationStatus || "Documented";

  return (
    <div className="space-y-8 text-slate-100">
      <motion.section
        {...coverReveal}
        className="relative overflow-hidden rounded-2xl border border-amber-400/25 bg-slate-950/75 p-6 sm:p-8 shadow-[0_0_80px_rgba(251,191,36,0.08)]"
      >
        <div className="dossier-sheen hidden md:block" aria-hidden="true" />
        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="kicker rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-1 text-amber-300">
              {status}
            </span>
            <span className="kicker text-slate-500">Review</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-[-0.035em] text-white">
            {mission.projectName}
          </h2>
          <p className="lede max-w-2xl">
            {why}
          </p>
          <p className="font-sans text-sm text-slate-500">
            What I would defend in a review. Modeled — not a live SLA.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6">
          <Cell label="Problem">{problem}</Cell>
          <Cell label="Decision">{decision}</Cell>
          <Cell label="Status">{status} · {mission.classification}</Cell>
        </div>
      </motion.section>

      {constraints.length > 0 && (
        <section>
          <div className="kicker text-slate-500 mb-3 flex items-center gap-2">
            <Lock size={12} /> Constraints
          </div>
          <div className="flex flex-wrap gap-2">
            {constraints.slice(0, 5).map((c) => (
              <span
                key={c}
                className="rounded-full border border-obsidian-border bg-obsidian px-3 py-1.5 font-sans text-xs text-slate-300"
              >
                {c}
              </span>
            ))}
          </div>
        </section>
      )}

      {ledger.length > 0 && (
        <section className="space-y-3">
          <div className="kicker text-slate-500 flex items-center gap-2">
            <GitBranch size={12} /> Choices
          </div>
          {ledger.slice(0, 4).map((dec) => (
            <div
              key={dec.decision}
              className="rounded-xl border border-obsidian-border/80 bg-slate-950/60 p-4 sm:p-5"
            >
              <div className="flex items-start gap-2 mb-2">
                <CheckCircle2 size={14} className="text-emerald-glow mt-0.5 shrink-0" />
                <h3 className="font-display text-base font-bold text-white tracking-[-0.02em]">
                  {dec.decision}
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{dec.reason}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {dec.alternative && (
                  <p className="text-xs text-slate-500">
                    Not chosen: {dec.alternative}
                  </p>
                )}
                {dec.tradeoff && (
                  <p className="text-xs text-amber-200/80">Trade-off: {dec.tradeoff}</p>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {(risks.currentLimitations || risks.technicalDebt || risks.mitigationStrategy) && (
        <section>
          <div className="kicker text-slate-500 mb-3 flex items-center gap-2">
            <AlertTriangle size={12} /> Limits
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {risks.currentLimitations && (
              <Cell label="Limits">{risks.currentLimitations}</Cell>
            )}
            {risks.technicalDebt && <Cell label="Debt">{risks.technicalDebt}</Cell>}
            {risks.mitigationStrategy && (
              <Cell label="Mitigation">{risks.mitigationStrategy}</Cell>
            )}
          </div>
        </section>
      )}

      {evolution.length > 0 && (
        <section>
          <div className="kicker text-slate-500 mb-3">How it moved</div>
          <ul className="space-y-2">
            {evolution.slice(0, 4).map((evo) => (
              <li
                key={evo.phase}
                className="pl-3 border-l border-amber-400/30 text-sm text-slate-300"
              >
                <span className="font-semibold text-white">{evo.phase}.</span>{" "}
                {evo.architectureState}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
