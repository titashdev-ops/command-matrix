import React from "react";
import { motion } from "framer-motion";
import { Network, BookOpen } from "lucide-react";
import EvidenceCard from "./EvidenceCard";
import { galleryReveal } from "../lib/motion";

function Block({ icon: Icon, kicker, title, children }) {
  return (
    <motion.section
      {...galleryReveal}
      className="relative overflow-hidden rounded-2xl border border-obsidian-border/70 bg-slate-950/60 p-5 sm:p-7"
    >
      <div className="dossier-sheen hidden md:block" aria-hidden="true" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Icon size={14} className="text-cyan-electric" />
          <span className="kicker text-cyan-electric/80">{kicker}</span>
        </div>
        <h3 className="font-sans text-lg sm:text-xl font-bold text-white mb-3">{title}</h3>
        {children}
      </div>
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
  const lessons = (mission.lessonsLearned || []).slice(0, 3);
  const evidence = (mission.evidence || []).slice(0, 3);
  const stack = mission.technologyStack || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {(mission.architecture || stack.length > 0) && (
        <Block icon={Network} kicker="Shape" title="How it is put together">
          {mission.architecture && (
            <p className="font-sans text-sm text-slate-300 leading-relaxed">{mission.architecture}</p>
          )}
          {stack.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {stack.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          )}
        </Block>
      )}

      {lessons.length > 0 && (
        <Block icon={BookOpen} kicker="Then" title="What it taught">
          <ul className="space-y-2">
            {lessons.map((l) => (
              <li key={l} className="text-sm text-slate-400 leading-relaxed pl-3 border-l border-cyan-electric/30">
                {l}
              </li>
            ))}
          </ul>
        </Block>
      )}

      {evidence.length > 0 && (
        <div className="pt-2 space-y-3">
          <h3 className="kicker text-slate-500">Notes</h3>
          {evidence.map((ev, i) => (
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
