import React from "react";
import { AlertTriangle, CheckCircle2, Lock, GitBranch } from "lucide-react";
import BriefCover from "./BriefCover";

export default function EngineeringReviewPanel({ mission }) {
  if (!mission) return null;

  const review = mission.engineeringReview || {};
  const ledger = mission.decisionLedger?.length ? mission.decisionLedger : review.decisionLedger || [];
  const constraints = review.hardConstraints || [];
  const risks = review.riskReview || {};
  const evolution = review.evolutionReview || [];
  const situation =
    review.technicalProblem ||
    mission.businessProblem?.business ||
    mission.missionObjective;
  const choice = ledger[0]?.decision || mission.engineeringIntelligence?.primaryEngineeringPattern;
  const cost = ledger[0]?.tradeoff || ledger[0]?.tradeOffs;
  const lede =
    mission.executiveSummary?.split(". ").slice(0, 1).join(". ") ||
    mission.businessImpact;
  const status = mission.implementationStatus || "Documented";

  return (
    <div className="space-y-8 text-slate-100">
      <BriefCover
        kicker="Review"
        status={status}
        title={mission.projectName}
        lede={lede}
        situation={situation}
        choice={choice}
        cost={cost}
        note="What I would defend."
        className="border-amber-400/25 shadow-[0_0_80px_rgba(251,191,36,0.08)]"
      />

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
                {(dec.tradeoff || dec.tradeOffs) && (
                  <p className="text-xs text-amber-200/80">Cost: {dec.tradeoff || dec.tradeOffs}</p>
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
              <div className="rounded-xl border border-obsidian-border/80 bg-obsidian/70 p-4">
                <div className="kicker text-amber-300/80 mb-2">Limits</div>
                <div className="font-sans text-sm text-slate-200 leading-relaxed">{risks.currentLimitations}</div>
              </div>
            )}
            {risks.technicalDebt && (
              <div className="rounded-xl border border-obsidian-border/80 bg-obsidian/70 p-4">
                <div className="kicker text-amber-300/80 mb-2">Debt</div>
                <div className="font-sans text-sm text-slate-200 leading-relaxed">{risks.technicalDebt}</div>
              </div>
            )}
            {risks.mitigationStrategy && (
              <div className="rounded-xl border border-obsidian-border/80 bg-obsidian/70 p-4">
                <div className="kicker text-amber-300/80 mb-2">Mitigation</div>
                <div className="font-sans text-sm text-slate-200 leading-relaxed">{risks.mitigationStrategy}</div>
              </div>
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
