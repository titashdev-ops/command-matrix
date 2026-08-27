import React from "react";
import BriefCover, { briefFromMission } from "./BriefCover";

export default function EngineeringReviewPanel({ mission }) {
  if (!mission) return null;

  const review = mission.engineeringReview || {};
  const ledger = mission.decisionLedger?.length ? mission.decisionLedger : review.decisionLedger || [];
  const rest = ledger.slice(1, 3);
  const bind = (review.hardConstraints || []).slice(0, 2).join(" · ");
  const risks = review.riskReview || {};
  const limit = [risks.currentLimitations, risks.mitigationStrategy].filter(Boolean).slice(0, 2);
  const moved = (review.evolutionReview || []).slice(-1)[0];
  const brief = briefFromMission(mission);

  return (
    <div className="space-y-8 text-slate-100">
      <BriefCover
        {...brief}
        note="What I would defend."
        tone="judgment"
        className="border-amber-400/25 shadow-[0_0_80px_rgba(251,191,36,0.08)]"
      />

      {bind && (
        <p className="font-sans text-sm text-slate-300 leading-relaxed">
          <span className="kicker text-amber-300/80 mr-2">The bind</span>
          {bind}
        </p>
      )}

      {rest.length > 0 && (
        <section className="space-y-3">
          <div className="kicker text-slate-500">Also</div>
          {rest.map((dec) => (
            <p key={dec.decision} className="font-sans text-sm text-slate-300 leading-relaxed pl-3 border-l border-amber-400/30">
              <span className="font-semibold text-white">{dec.decision}.</span>{" "}
              {dec.tradeoff || dec.tradeOffs || dec.reason}
            </p>
          ))}
        </section>
      )}

      {limit.length > 0 && (
        <p className="font-sans text-sm text-slate-400 leading-relaxed">
          <span className="kicker text-amber-300/80 mr-2">Limits</span>
          {limit.join(" ")}
        </p>
      )}

      {moved && (
        <p className="font-sans text-sm text-slate-400 leading-relaxed">
          <span className="kicker text-slate-500 mr-2">Now</span>
          {moved.architectureState}
        </p>
      )}
    </div>
  );
}
