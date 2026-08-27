import React from "react";
import BriefCover, { briefFromMission } from "./BriefCover";

function Note({ kicker, children, tone = "slate" }) {
  if (!children) return null;
  const kick = tone === "amber" ? "text-amber-300/80" : "text-slate-500";
  return (
    <p className="font-sans text-sm text-slate-300 leading-relaxed">
      <span className={`kicker ${kick} mr-2`}>{kicker}</span>
      {children}
    </p>
  );
}

function judgmentFrom(mission) {
  if (mission.judgment) return mission.judgment;
  const review = mission.engineeringReview || {};
  const ledger = mission.decisionLedger?.length
    ? mission.decisionLedger
    : review.decisionLedger || [];
  const rest = ledger.slice(1, 3);
  const risks = review.riskReview || {};
  const moved = (review.evolutionReview || []).slice(-1)[0];
  return {
    bind: (review.hardConstraints || []).slice(0, 2).join(" · "),
    also: rest
      .map((d) => [d.decision, d.tradeoff || d.reason].filter(Boolean).join(" — "))
      .join(" "),
    limit: [risks.currentLimitations, risks.mitigationStrategy].filter(Boolean)[0],
    now: moved?.architectureState,
  };
}

export default function EngineeringReviewPanel({ mission }) {
  if (!mission) return null;

  const brief = briefFromMission(mission);
  const note = judgmentFrom(mission);

  return (
    <div className="space-y-6 text-slate-100">
      <BriefCover
        {...brief}
        note="What I would defend."
        tone="judgment"
        className="border-amber-400/25 shadow-[0_0_80px_rgba(251,191,36,0.08)]"
      />

      <div className="space-y-4 max-w-2xl">
        <Note kicker="Held to" tone="amber">
          {note.bind}
        </Note>
        <Note kicker="Also">{note.also}</Note>
        <Note kicker="The edge" tone="amber">
          {note.limit}
        </Note>
        <Note kicker="Now">{note.now}</Note>
      </div>
    </div>
  );
}
