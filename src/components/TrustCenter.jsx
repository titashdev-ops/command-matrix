import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Activity, Database, Briefcase, Mail, Link as LinkIcon, Network } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { ADR_RECORDS } from "../data/adrs";
import EvidenceCard from "./EvidenceCard";
import { useSystemCommand } from "../context/SystemCommandContext";
import { noteReveal, ledgerReveal, galleryReveal } from "../lib/motion";

const cn = (...inputs) => twMerge(clsx(inputs));

const TRUST_SECTIONS = [
  { id: "benchmarks", label: "Comparisons", kicker: "Side by side", icon: Activity, tone: "cyan" },
  { id: "adrs", label: "Ledger", kicker: "Compact picks", icon: FileText, tone: "emerald" },
  { id: "reports", label: "Notes", kicker: "Quiet pages", icon: Database, tone: "slate" },
  { id: "diagrams", label: "Diagrams", kicker: "A map of the work", icon: Network, tone: "cyan" },
  { id: "resume", label: "Resume", kicker: "The paper trail", icon: Briefcase, tone: "amber" },
];

export default function TrustCenter() {
  const [activeSection, setActiveSection] = useState("benchmarks");
  const { openAdrs, openEnterpriseExplorer, openContact, openResume } = useSystemCommand();

  const active = TRUST_SECTIONS.find((s) => s.id === activeSection) || TRUST_SECTIONS[0];
  const headerMotion = active.tone === "emerald" ? ledgerReveal : active.tone === "slate" ? noteReveal : galleryReveal;

  return (
    <div className="flex flex-col h-[75vh] min-h-[500px] border border-obsidian-border/60 rounded-2xl overflow-hidden bg-obsidian-surface shadow-2xl">
      <motion.div {...headerMotion} className="relative overflow-hidden flex flex-col border-b border-obsidian-border/60 p-6 sm:p-8 bg-obsidian/80">
        <div className="dossier-sheen hidden md:block" aria-hidden="true" />
        <div className="relative z-10">
          <div className="kicker text-slate-500 mb-2">{active.kicker}</div>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-[-0.045em]">{active.label}</h2>
        </div>
      </motion.div>

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        <div className="w-full shrink-0 border-b border-obsidian-border/60 bg-obsidian/40 overflow-x-auto overflow-y-hidden p-3 flex flex-row gap-2 md:w-64 md:flex-col md:overflow-y-auto md:overflow-x-hidden md:border-b-0 md:border-r md:p-4">
          {TRUST_SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            const Icon = section.icon;
            return (
              <button type="button"
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors font-sans text-sm tracking-wide",
                  isActive
                    ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
                )}
              >
                <Icon size={14} />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-obsidian/20 relative">
          {activeSection === "benchmarks" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EvidenceCard
                  title="WebRTC vs HLS"
                  status="Simulation"
                  comparison={{
                    frame: "An operator needs a live-feeling viewport. This is a comparison, not a field test.",
                    chosen: "WebRTC for the loop.",
                    notChosen: "HLS. Fine for playback, too slow if someone is still flying.",
                    consequence: "The model stays in the sub-second range. Treat it as a teaching note, not a measured SLA.",
                  }}
                  relatedAdr="adr-001"
                />
                <EvidenceCard
                  title="Vectors vs generation"
                  status="Simulation"
                  comparison={{
                    frame: "Retrieval has to stay cheap next to the model.",
                    chosen: "A vector store at the edge of the prompt.",
                    notChosen: "Stuffing the whole graph into context.",
                    consequence: "In this model, lookup is small versus generation. Numbers here are teaching artifacts.",
                  }}
                  relatedAdr="adr-003"
                />
                <EvidenceCard
                  title="Ingress under burst"
                  status="Simulation"
                  comparison={{
                    frame: "Positions arrive faster than a naive table can take them.",
                    chosen: "Streaming ingress with a hot cache.",
                    notChosen: "Polling a cold relational table.",
                    consequence: "The bottleneck moves to storage IOPS. Not a measured ingest profile.",
                  }}
                  relatedAdr="adr-004"
                />
              </div>
            </div>
          )}

          {activeSection === "adrs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-sans text-sm tracking-wide text-slate-400">Records</h3>
                <button type="button" onClick={openAdrs} className="px-3 py-1 bg-obsidian-surface hover:bg-slate-800 border border-obsidian-border text-xs font-sans text-cyan-electric rounded transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]">
                  Open records
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {ADR_RECORDS.map((adr) => (
                  <EvidenceCard
                    key={adr.id}
                    title={adr.title}
                    status={adr.currentStatus || "Documented"}
                    comparison={{
                      frame: adr.problem,
                      chosen: adr.decision,
                      notChosen: (adr.rejectedAlternatives || []).map((a) => a.name).join(" · "),
                      consequence: adr.consequences,
                    }}
                    relatedAdr={adr.id}
                  />
                ))}
              </div>
            </div>
          )}

          {activeSection === "reports" && (
            <div className="space-y-4">
              <h3 className="font-sans text-sm tracking-wide text-slate-400 mb-4">Notes</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EvidenceCard
                  title="Clinic records"
                  status="Simulation"
                  comparison={{
                    frame: "A clinic cannot guess who saw what.",
                    chosen: "Short tokens, field encryption, an audit trail.",
                    notChosen: "Long-lived session cookies on a shared workstation.",
                    consequence: "The model isolates a record. It is not a certified clinic.",
                  }}
                  relatedAdr="adr-005"
                />
              </div>
            </div>
          )}

          {activeSection === "diagrams" && (
            <div className="space-y-4">
              <h3 className="font-sans text-sm tracking-wide text-slate-400 mb-4">Diagrams</h3>
              <button
                type="button"
                onClick={openEnterpriseExplorer}
                className="w-full p-8 text-left rounded-xl border border-obsidian-border/70 bg-obsidian/60 hover:border-cyan-electric/40 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
              >
                <Network size={24} className="text-cyan-electric mb-3" />
                <p className="font-display text-lg font-bold text-white">Open the system map</p>
                <p className="mt-1 font-sans text-sm text-slate-400">A spatial view of the case-study systems. Click a node for a short note.</p>
              </button>
            </div>
          )}

          {activeSection === "resume" && (
            <div className="space-y-4">
              <h3 className="font-sans text-sm tracking-wide text-slate-400 mb-4">Resume</h3>
              <div className="flex flex-wrap gap-4">
                <button type="button"
                  onClick={openResume}
                  className="flex flex-col items-center justify-center gap-3 p-6 border border-obsidian-border/60 rounded-lg bg-obsidian-surface hover:bg-slate-800 transition-colors duration-200 cursor-pointer w-44 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px]"
                >
                  <FileText size={24} className="text-cyan-electric" />
                  <span className="font-sans text-xs text-slate-300">Resume</span>
                </button>
                <a
                  href="https://linkedin.com/in/titashneogi"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center gap-3 p-6 border border-obsidian-border/60 rounded-lg bg-obsidian-surface hover:bg-slate-800 transition-colors duration-200 cursor-pointer w-44 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px]"
                >
                  <LinkIcon size={24} className="text-[#0a66c2]" />
                  <span className="font-sans text-xs text-slate-300">LinkedIn</span>
                </a>
                <button type="button"
                  onClick={openContact}
                  className="flex flex-col items-center justify-center gap-3 p-6 border border-obsidian-border/60 rounded-lg bg-obsidian-surface hover:bg-slate-800 transition-colors duration-200 cursor-pointer w-44 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px]"
                >
                  <Mail size={24} className="text-emerald-400" />
                  <span className="font-sans text-xs text-slate-300">Contact</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
