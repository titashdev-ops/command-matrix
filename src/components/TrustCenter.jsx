import React, { useState } from "react";
import { FileText, Activity, Database, Briefcase, Mail, Link as LinkIcon, Network, ArrowRight } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { ADR_RECORDS } from "../data/adrs";
import EvidenceCard from "./EvidenceCard";
import { useSystemCommand } from "../context/SystemCommandContext";

const cn = (...inputs) => twMerge(clsx(inputs));

const TRUST_SECTIONS = [
  { id: "benchmarks", label: "Comparisons", icon: Activity, lede: "Side by side." },
  { id: "adrs", label: "Records", icon: FileText, lede: "Choices written down." },
  { id: "reports", label: "Notes", icon: Database, lede: "Short, labeled notes." },
  { id: "diagrams", label: "Diagrams", icon: Network, lede: "The map behind the rooms." },
  { id: "resume", label: "Resume", icon: Briefcase, lede: "Open the file." },
];

const SECTION_COPY = {
  benchmarks: {
    title: "Comparisons",
    lede: "Short comparisons. No fake fields. No hidden claims.",
    accent: "cyan-electric",
  },
  adrs: {
    title: "Records",
    lede: "Decisions, alternatives, and the cost of each choice.",
    accent: "amber-400",
  },
  reports: {
    title: "Notes",
    lede: "A smaller set of modeled notes. Enough to read, not enough to inflate.",
    accent: "emerald-400",
  },
  diagrams: {
    title: "Diagrams",
    lede: "A spatial view of the systems and the notes behind them.",
    accent: "violet-400",
  },
  resume: {
    title: "Resume",
    lede: "Open the file, the profile, or the brief.",
    accent: "rose-400",
  },
};

function SectionButton({ section, isActive, onClick }) {
  const Icon = section.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all font-sans text-sm tracking-wide",
        isActive
          ? "border-emerald-400/30 bg-emerald-400/10 text-white shadow-[0_0_25px_rgba(52,211,153,0.08)]"
          : "border-transparent text-slate-400 hover:border-obsidian-border hover:bg-slate-900/70 hover:text-slate-200"
      )}
    >
      <span className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
        isActive ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400" : "border-obsidian-border bg-obsidian-surface text-slate-500 group-hover:text-slate-300"
      )}>
        <Icon size={14} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block font-medium", isActive ? "text-white" : "text-slate-300")}>{section.label}</span>
        <span className="block text-xs text-slate-500">{section.lede}</span>
      </span>
    </button>
  );
}

function SectionShell({ title, lede, accent, children }) {
  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-obsidian-border/70 bg-slate-950/60 p-4 sm:p-5">
        <div className={cn("absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_26%)] opacity-90", accent === "amber-400" && "bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.08),transparent_26%)]", accent === "violet-400" && "bg-[radial-gradient(circle_at_top_left,rgba(167,139,250,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.08),transparent_26%)]", accent === "rose-400" && "bg-[radial-gradient(circle_at_top_left,rgba(251,113,133,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(251,113,133,0.08),transparent_26%)]", accent === "cyan-electric" && "bg-[radial-gradient(circle_at_top_left,rgba(0,240,255,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(0,240,255,0.08),transparent_26%)]")} />
        <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1.5">
            <p className={cn("kicker", accent === "amber-400" && "text-amber-400/80", accent === "violet-400" && "text-violet-400/80", accent === "rose-400" && "text-rose-400/80", accent === "cyan-electric" && "text-cyan-electric/80", accent === "emerald-400" && "text-emerald-400/80")}>Archive</p>
            <h3 className="font-display text-2xl font-extrabold tracking-[-0.04em] text-white sm:text-3xl">{title}</h3>
            <p className="max-w-2xl font-sans text-sm text-slate-400">{lede}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-obsidian-border bg-slate-950/70 px-2.5 py-1 uppercase tracking-[0.2em]">Labeled</span>
            <ArrowRight size={14} className={cn(accent === "amber-400" && "text-amber-400", accent === "violet-400" && "text-violet-400", accent === "rose-400" && "text-rose-400", accent === "cyan-electric" && "text-cyan-electric", accent === "emerald-400" && "text-emerald-400")} />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function TrustCenter() {
  const [activeSection, setActiveSection] = useState("benchmarks");
  const { openAdrs, openEnterpriseExplorer, openContact, openResume } = useSystemCommand();
  const copy = SECTION_COPY[activeSection];

  return (
    <div className="flex h-[75vh] min-h-[500px] flex-col overflow-hidden rounded-xl border border-obsidian-border/60 bg-obsidian-surface shadow-2xl">
      <div className="relative overflow-hidden border-b border-obsidian-border/60 bg-obsidian/85 p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(0,240,255,0.08),transparent_24%)]" />
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="kicker text-emerald-400/80">Evidence</p>
            <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl">Comparisons, records, notes.</h2>
            <p className="max-w-2xl font-sans text-sm text-slate-400">
              Side by side, with the labels left on. This is the room for proof.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "Modeled", value: "Yes" },
              { label: "Verified", value: "No" },
              { label: "Runtime API", value: "None" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-obsidian-border/70 bg-slate-950/65 px-3 py-2 text-left">
                <div className="font-sans text-[10px] uppercase tracking-[0.22em] text-slate-500">{item.label}</div>
                <div className="mt-1 font-display text-sm font-bold tracking-[-0.02em] text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <div className="w-full shrink-0 border-b border-obsidian-border/60 bg-obsidian/45 p-3 md:w-72 md:border-b-0 md:border-r md:p-4">
          <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
            {TRUST_SECTIONS.map((section) => {
              const isActive = activeSection === section.id;
              return (
                <SectionButton
                  key={section.id}
                  section={section}
                  isActive={isActive}
                  onClick={() => setActiveSection(section.id)}
                />
              );
            })}
          </div>
        </div>

        <div className="relative flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.08),transparent_35%)] p-4 sm:p-6">
          <div className="relative z-10 space-y-5">
            {activeSection === "benchmarks" && (
              <SectionShell title={copy.title} lede={copy.lede} accent={copy.accent}>
                <div className="grid gap-4 lg:grid-cols-2">
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
              </SectionShell>
            )}

            {activeSection === "adrs" && (
              <SectionShell title={copy.title} lede={copy.lede} accent={copy.accent}>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-obsidian-border/70 bg-slate-950/60 p-4">
                  <div>
                    <p className="font-display text-base font-bold text-white tracking-[-0.02em]">Open the record ledger</p>
                    <p className="mt-1 max-w-xl font-sans text-sm text-slate-400">Each card shows the choice, the constraint, and the cost of that path.</p>
                  </div>
                  <button
                    type="button"
                    onClick={openAdrs}
                    className="rounded-lg border border-obsidian-border bg-obsidian-surface px-3 py-2 text-xs font-sans text-cyan-electric transition-colors duration-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                  >
                    Open records
                  </button>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
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
              </SectionShell>
            )}

            {activeSection === "reports" && (
              <SectionShell title={copy.title} lede={copy.lede} accent={copy.accent}>
                <div className="grid gap-4 lg:grid-cols-2">
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
                  <div className="rounded-2xl border border-obsidian-border/70 bg-slate-950/60 p-5">
                    <p className="kicker text-emerald-400/80">Notes</p>
                    <h3 className="mt-2 font-display text-xl font-bold tracking-[-0.03em] text-white">Short notes only</h3>
                    <p className="mt-2 font-sans text-sm text-slate-400">
                      The public surface stays small. Deeper model detail lives in the archive, not in the room.
                    </p>
                  </div>
                </div>
              </SectionShell>
            )}

            {activeSection === "diagrams" && (
              <SectionShell title={copy.title} lede={copy.lede} accent={copy.accent}>
                <button
                  type="button"
                  onClick={openEnterpriseExplorer}
                  className="relative w-full overflow-hidden rounded-2xl border border-obsidian-border/70 bg-slate-950/60 p-6 text-left transition-colors duration-200 hover:border-cyan-electric/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,240,255,0.12),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.08),transparent_30%)]" />
                  <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <Network size={24} className="text-cyan-electric mb-3" />
                      <p className="font-display text-2xl font-bold tracking-[-0.03em] text-white">Open the system map</p>
                      <p className="mt-1 max-w-2xl font-sans text-sm text-slate-400">A spatial view of the case-study systems. Click a node for a short note.</p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-electric/20 bg-cyan-electric/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-electric">
                      Explore
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </button>
              </SectionShell>
            )}

            {activeSection === "resume" && (
              <SectionShell title={copy.title} lede={copy.lede} accent={copy.accent}>
                <div className="grid gap-4 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={openResume}
                    className="group flex flex-col items-start justify-between gap-8 rounded-2xl border border-obsidian-border/70 bg-slate-950/60 p-5 text-left transition-colors duration-200 hover:border-cyan-electric/30 hover:bg-cyan-electric/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                  >
                    <FileText size={24} className="text-cyan-electric" />
                    <div>
                      <span className="font-display text-lg font-bold tracking-[-0.03em] text-white">Resume</span>
                      <span className="mt-1 block text-xs text-slate-500">Open the file.</span>
                    </div>
                  </button>
                  <a
                    href="https://linkedin.com/in/titashneogi"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col items-start justify-between gap-8 rounded-2xl border border-obsidian-border/70 bg-slate-950/60 p-5 text-left transition-colors duration-200 hover:border-cyan-electric/30 hover:bg-cyan-electric/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                  >
                    <LinkIcon size={24} className="text-[#0a66c2]" />
                    <div>
                      <span className="font-display text-lg font-bold tracking-[-0.03em] text-white">LinkedIn</span>
                      <span className="mt-1 block text-xs text-slate-500">Open the profile.</span>
                    </div>
                  </a>
                  <button
                    type="button"
                    onClick={openContact}
                    className="group flex flex-col items-start justify-between gap-8 rounded-2xl border border-obsidian-border/70 bg-slate-950/60 p-5 text-left transition-colors duration-200 hover:border-emerald-400/30 hover:bg-emerald-400/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                  >
                    <Mail size={24} className="text-emerald-400" />
                    <div>
                      <span className="font-display text-lg font-bold tracking-[-0.03em] text-white">Contact</span>
                      <span className="mt-1 block text-xs text-slate-500">Open the brief.</span>
                    </div>
                  </button>
                </div>
              </SectionShell>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
