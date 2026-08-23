import React from "react";
import { motion } from "framer-motion";
import { Search, AlertTriangle, FileSearch, FlaskConical, Lock, GitBranch, TableProperties, Network, Code, CheckCircle2, Activity, Scale, BookOpen, FastForward } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import EvidenceCard from "./EvidenceCard";

const cn = (...inputs) => twMerge(clsx(inputs));

export default function InvestigationFlow({ mission }) {
  const sections = [
    { id: "problem", icon: AlertTriangle, title: "Problem", content: mission.businessProblem?.business || mission.missionObjective || "Evidence Pending" },
    { id: "context", icon: Search, title: "Context", content: mission.businessProblem?.operational || mission.executiveSummary || "Evidence Pending" },
    { id: "constraints", icon: Lock, title: "Constraints", content: mission.engineeringReview?.hardConstraints?.join(" \n\n ") || "Evidence Pending" },
    { id: "options", icon: GitBranch, title: "Options Considered", content: mission.engineeringReview?.decisionLedger?.map(d => `- ${d.alternative || "Standard Monolith"}`).join("\n") || "Evidence Pending" },
    { id: "decision", icon: CheckCircle2, title: "Decision", content: mission.engineeringReview?.decisionLedger?.map(d => `${d.decision}: ${d.reason}`).join("\n\n") || "Evidence Pending" },
    { id: "architecture", icon: Network, title: "Architecture", content: mission.architecture || "Evidence Pending" },
    { id: "implementation", icon: Code, title: "Implementation", content: mission.technologyStack?.join(" • ") || "Evidence Pending" },
    { id: "tradeoffs", icon: Scale, title: "Trade-offs", content: mission.engineeringReview?.decisionLedger?.map(d => `- ${d.decision}: ${d.tradeoff}`).join("\n") || "Evidence Pending" },
    { id: "validation", icon: Activity, title: "Validation", content: mission.businessImpact || "Evidence Pending" },
    { id: "lessons", icon: BookOpen, title: "Lessons Learned", content: mission.lessonsLearned?.map(l => `- ${l}`).join("\n") || "Evidence Pending" },
    { id: "future", icon: FastForward, title: "Future Improvements", content: mission.longTermVision || "Evidence Pending" },
  ];

  return (
    <div className="space-y-16 max-w-4xl mx-auto py-8">
      
      {/* Title */}
      <div>
        <h1 className="font-sans text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">{mission.projectName}</h1>
        <p className="font-sans font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Activity size={14} />
          Investigation Record
        </p>
      </div>

      {/* Investigation Steps */}
      <div className="relative border-l border-obsidian-border/50 ml-4 pl-8 space-y-12">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative group"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[41px] top-1 w-6 h-6 rounded-full bg-obsidian border border-obsidian-border flex items-center justify-center group-hover:border-cyan-electric transition-colors duration-200 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-cyan-electric transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50" />
              </div>
              
              <div className="flex items-center gap-3 mb-2">
                <Icon size={16} className="text-slate-400 group-hover:text-cyan-electric transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50" />
                <h3 className="font-sans font-medium text-slate-400 uppercase tracking-wider">{section.title}</h3>
              </div>
              
              <div className="text-slate-300 font-mono text-sm sm:text-base leading-relaxed bg-obsidian-surface/30 p-4 rounded-lg border border-obsidian-border/30 whitespace-pre-line">
                {section.content}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Embedded Evidence Cards */}
      {mission.evidence && mission.evidence.length > 0 && (
        <div className="pt-8 ">
          <h3 className="font-sans font-medium text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            Case Evidence
          </h3>
          <div className="space-y-4">
            {mission.evidence.map((ev, i) => (
              <EvidenceCard 
                key={i}
                title={ev.title}
                status={ev.verificationStatus || "Simulation"}
                source={ev.type}
                methodology={{ Detail: ev.detail }}
                results={ev.url && ev.url.startsWith("http") ? { URL: ev.url } : {}}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
