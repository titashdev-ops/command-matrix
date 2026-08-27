import React from "react";
import BriefCover from "./BriefCover";

export default function EvidenceCard({
  title,
  status = "Documented",
  comparison = {},
  relatedAdr,
}) {
  const { frame, chosen, notChosen, consequence } = comparison;
  const cost = notChosen || undefined;

  return (
    <div className="space-y-2">
      <BriefCover
        compact
        tone="note"
        status={status}
        title={title}
        lede={frame}
        choice={chosen}
        cost={cost}
        consequence={consequence}
      />
      {relatedAdr && (
        <p className="px-1 font-sans text-[11px] uppercase tracking-[0.18em] text-slate-500">
          Record {relatedAdr}
        </p>
      )}
    </div>
  );
}
