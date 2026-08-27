import React from "react";
import { FileText } from "lucide-react";
import { useSystemCommand } from "../context/SystemCommandContext";
import BriefCover from "./BriefCover";

export default function EvidenceCard({
  title,
  status = "Documented",
  comparison = {},
  relatedAdr,
}) {
  const { openAdrs, playClickSound } = useSystemCommand();
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
        <button
          type="button"
          onClick={() => {
            playClickSound();
            openAdrs(relatedAdr);
          }}
          className="inline-flex items-center gap-1.5 font-sans text-xs text-cyan-electric hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 px-1"
        >
          <FileText size={12} /> See the choice
        </button>
      )}
    </div>
  );
}
