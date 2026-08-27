import React from "react";
import { FileText } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSystemCommand } from "../context/SystemCommandContext";

const cn = (...inputs) => twMerge(clsx(inputs));

const STATUS_TONE = {
  Simulation: "text-cyan-electric border-cyan-electric/30 bg-cyan-electric/10",
  Prototype: "text-amber-300 border-amber-400/30 bg-amber-400/10",
  Documented: "text-slate-300 border-obsidian-border bg-obsidian",
  Pending: "text-slate-400 border-obsidian-border bg-obsidian",
};

function Cell({ label, children }) {
  if (!children) return null;
  return (
    <div>
      <div className="kicker text-slate-500 mb-1">{label}</div>
      <p className="font-sans text-sm text-slate-300 leading-relaxed">{children}</p>
    </div>
  );
}

export default function EvidenceCard({
  title,
  status = "Documented",
  comparison = {},
  relatedAdr,
}) {
  const { openAdrs, playClickSound } = useSystemCommand();
  const tone = STATUS_TONE[status] || STATUS_TONE.Documented;
  const { frame, chosen, notChosen, consequence } = comparison;

  return (
    <article className="rounded-xl border border-obsidian-border/70 bg-obsidian/70 p-4 sm:p-5 space-y-4">
      <header className="flex items-start justify-between gap-3">
        <h4 className="font-display text-base font-bold tracking-[-0.02em] text-white">{title}</h4>
        <span className={cn("kicker shrink-0 rounded-full border px-2 py-0.5", tone)}>
          {status}
        </span>
      </header>

      {frame && <p className="lede text-base">{frame}</p>}

      <div className="grid gap-3 sm:grid-cols-2">
        <Cell label="Chosen">{chosen}</Cell>
        <Cell label="Not chosen">{notChosen}</Cell>
      </div>

      <Cell label="What followed">{consequence}</Cell>

      {relatedAdr && (
        <button
          type="button"
          onClick={() => {
            playClickSound();
            openAdrs(relatedAdr);
          }}
          className="inline-flex items-center gap-1.5 font-sans text-xs text-cyan-electric hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
        >
          <FileText size={12} /> Open the record
        </button>
      )}
    </article>
  );
}
