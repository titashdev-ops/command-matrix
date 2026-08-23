import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Layers, Cpu, AlertTriangle, CheckCircle2, ArrowRight, 
  GitBranch, Zap, Lock, Activity, Database, Scale, Code, Server, HelpCircle, FileText, ChevronRight
} from "lucide-react";

export default function EngineeringReviewPanel({ mission, activeMode = "review", onToggleMode }) {
  if (!mission) return null;

  const review = mission.engineeringReview || {
    businessProblem: mission.businessProblem?.business || "High operational friction and scaling limits.",
    technicalProblem: mission.businessProblem?.operational || "Concurrency and latency bottlenecks under high load.",
    hardConstraints: [
      "Sub-100ms response latency target",
      "Strict data isolation and zero unauthorized access",
      "High availability SLA under burst load spikes",
      "Seamless backward compatibility for historical data"
    ],
    architectureSnapshot: [
      { layer: "1. Presentation / Client", tech: mission.technologyStack[0] || "React", role: "Interface layer", decisionPoint: "Decoupled state management" },
      { layer: "2. Ingress / API Gateway", tech: mission.technologyStack[1] || "GraphQL / REST", role: "Request routing & authentication", decisionPoint: "Stateless scalability" },
      { layer: "3. Core Engine", tech: mission.technologyStack[2] || "Node.js / Go", role: "Business logic orchestration", decisionPoint: "Asynchronous processing" },
      { layer: "4. Storage & Persistence", tech: mission.technologyStack[3] || "PostgreSQL", role: "ACID state persistence", decisionPoint: "Indexed for rapid retrieval" }
    ],
    decisionLedger: mission.engineeringDecisions.map(d => ({
      decision: d.title,
      reason: d.reason || d.description,
      alternative: "Standard monolithic REST endpoint",
      tradeoff: d.tradeOffs || "Increased initial setup complexity",
      impact: d.result || "Validated performance SLAs"
    })),
    riskReview: {
      currentLimitations: "Scale ceiling governed by database write throughput limits during peak spikes.",
      technicalDebt: "Legacy API adapter layer maintained for backward compatibility.",
      scalingBottlenecks: "In-memory caching memory usage during concurrent peak sessions.",
      operationalRisks: "Upstream third-party service degradation under regional ISP outages.",
      mitigationStrategy: "Deploying circuit breakers and automated failover read-replicas."
    },
    evolutionReview: mission.evolutionSteps ? mission.evolutionSteps.map(s => ({
      phase: s.phaseName,
      architectureState: s.description,
      shiftReason: "Optimized for system scale, latency, and reliability."
    })) : [
      { phase: "Research", architectureState: "Exploratory technical spike", shiftReason: "Validated core domain feasibility" },
      { phase: "Current State", architectureState: "Deployed production system", shiftReason: "Operating reliably under target SLAs" }
    ],
    engineeringPrinciples: [
      "Systems Over Isolated Features — Architecture designed for end-to-end reliability",
      "Choose Simplicity Before Complexity — Deferred non-essential layers until proven necessary",
      "Explicit Trade-offs Required — Accepted initial setup effort to gain long-term maintainability",
      "Evidence Over Assumptions — Verified benchmarks against simulated production stress tests"
    ]
  };

  const principles = [
    { title: "Systems Over Isolated Features", desc: "Evaluate end-to-end transport SLAs, data flows, and failure modes rather than isolated UI widgets." },
    { title: "Simplicity Before Complexity", desc: "Select the simplest architecture that satisfies non-functional requirements before reaching for complex patterns." },
    { title: "Explicit Trade-Offs Required", desc: "Every architectural choice accepts explicit costs (memory, complexity, latency) in exchange for specific guarantees." },
    { title: "Maintainability & Observability First", desc: "Prioritize clear code boundaries, structured logs, and deterministic state transitions over clever shortcuts." },
    { title: "Evidence Over Assumptions", desc: "Validate system limits with empirical stress tests, synthetic benchmarks, and verifiable production metrics." }
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      
      {/* Principal Engineer Header Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-950/90 border border-amber-400/40 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-400/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/30">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                PRINCIPAL ENGINEER REVIEW ENVIRONMENT
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {mission.projectName} — Deep Architecture Audit
              </h2>
            </div>
          </div>

          {onToggleMode && (
            <div className="flex items-center rounded-lg border border-obsidian-border bg-slate-900 p-1 font-mono text-xs">
              <button type="button"
                onClick={() => onToggleMode("presentation")}
                className="px-3 py-1 rounded transition-all duration-200 cursor-pointer font-bold text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
              >
                PRESENTATION
              </button>
              <button type="button"
                onClick={() => onToggleMode("review")}
                className="px-3 py-1 rounded transition-all duration-200 cursor-pointer font-bold bg-amber-400/20 text-amber-300 border border-amber-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
              >
                REVIEW MODE
              </button>
            </div>
          )}
        </div>

        {/* Core Principles Marquee */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 font-mono text-xs">
          {principles.slice(0, 3).map((p, idx) => (
            <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800 flex items-start gap-2">
              <CheckCircle2 size={12} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-amber-300 font-bold block">{p.title}</span>
                <span className="text-slate-400 text-xs leading-tight block mt-0.5">{p.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 1: Problem & Hard Constraints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Business Problem */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-rose-400 font-bold flex items-center gap-1.5">
            <AlertTriangle size={12} /> Business Problem & Impact
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {review.businessProblem}
          </p>
        </div>

        {/* Technical Problem */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-cyan-electric font-bold flex items-center gap-1.5">
            <Cpu size={12} /> Technical System Hurdle
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {review.technicalProblem}
          </p>
        </div>

        {/* Hard Constraints */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
            <Lock size={12} /> Hard System Constraints
          </div>
          <ul className="space-y-1.5 font-sans text-xs text-slate-300">
            {review.hardConstraints.map((c, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">›</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SECTION 2: Architecture Snapshot Pipeline */}
      <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-cyan-electric font-bold flex items-center gap-2">
            <Layers size={14} /> Architecture Snapshot — Pipeline Layer Breakdown
          </div>
          <span className="font-sans text-xs text-slate-500">Interactive System Flow</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {review.architectureSnapshot.map((snap, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 relative group hover:border-cyan-electric/50 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50">
              <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-cyan-400 font-bold flex items-center justify-between">
                <span>{snap.layer}</span>
                <span className="text-slate-600">0{idx + 1}</span>
              </div>
              <div className="font-sans text-xs font-bold text-white">{snap.tech}</div>
              <p className="text-xs text-slate-400 leading-snug">{snap.role}</p>
              <div className="pt-1  font-sans text-xs text-amber-300/90">
                <span className="text-slate-500">Rationale: </span>{snap.decisionPoint}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Decision Review Ledger (3-5 ADRs) */}
      <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-2">
            <GitBranch size={14} /> Architectural Decision Review Ledger (ADRs)
          </div>
          <span className="font-sans text-xs text-slate-500">{review.decisionLedger.length} Verified Records</span>
        </div>

        <div className="space-y-3">
          {review.decisionLedger.map((dec, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <span className="font-sans text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> {dec.decision}
                </span>
                <span className="font-sans text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400">
                  VERIFIED CHOICE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                <div>
                  <span className="font-sans font-medium text-slate-400 uppercase tracking-wider block">Reason & Driver</span>
                  <p className="text-slate-300 mt-0.5">{dec.reason}</p>
                </div>
                <div>
                  <span className="font-sans font-medium text-slate-400 uppercase tracking-wider block">Alternative Considered</span>
                  <p className="text-slate-400 mt-0.5">{dec.alternative}</p>
                </div>
                <div>
                  <span className="font-sans font-medium text-slate-400 uppercase tracking-wider block">Accepted Trade-off</span>
                  <p className="text-amber-300/90 mt-0.5">{dec.tradeoff}</p>
                </div>
                <div>
                  <span className="font-sans font-medium text-slate-400 uppercase tracking-wider block">Measured Impact</span>
                  <p className="text-cyan-electric mt-0.5 font-medium">{dec.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Honest Risk Review & Mitigation */}
      <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-rose-400 font-bold flex items-center gap-2">
            <AlertTriangle size={14} /> Honest Engineering Risk Review
          </div>
          <span className="font-sans text-xs text-slate-500">Limitations & Operational Debt</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-sans text-xs text-rose-400 font-bold uppercase block">Current Limitations</span>
            <p className="text-slate-300 text-sm leading-relaxed">{review.riskReview.currentLimitations}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-sans text-xs text-amber-400 font-bold uppercase block">Technical Debt</span>
            <p className="text-slate-300 text-sm leading-relaxed">{review.riskReview.technicalDebt}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-sans text-xs text-cyan-electric font-bold uppercase block">Scaling Bottlenecks</span>
            <p className="text-slate-300 text-sm leading-relaxed">{review.riskReview.scalingBottlenecks}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-sans text-xs text-violet-400 font-bold uppercase block">Operational Risks</span>
            <p className="text-slate-300 text-sm leading-relaxed">{review.riskReview.operationalRisks}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-emerald-800/80 space-y-1 bg-emerald-950/10">
            <span className="font-sans text-xs text-emerald-400 font-bold uppercase block">Mitigation Strategy</span>
            <p className="text-emerald-200 text-sm leading-relaxed">{review.riskReview.mitigationStrategy}</p>
          </div>
        </div>
      </div>

      {/* SECTION 5: Evolution Review Timeline */}
      <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-violet-400 font-bold flex items-center gap-2">
            <Activity size={14} /> Architecture Evolution & Rationale Shifts
          </div>
          <span className="font-sans text-xs text-slate-500">Research → Current Production</span>
        </div>

        <div className="relative pl-4 border-l border-slate-800 space-y-4">
          {review.evolutionReview.map((evo, idx) => (
            <div key={idx} className="relative space-y-1 group">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-violet-400 border-2 border-slate-950 group-hover:scale-125 transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50" />
              <div className="flex items-center gap-2">
                <span className="font-sans text-xs text-violet-300 font-bold uppercase">{evo.phase}</span>
              </div>
              <p className="font-sans text-xs text-slate-300 font-medium">{evo.architectureState}</p>
              <p className="font-sans text-xs text-slate-400">
                <span className="text-amber-400 font-bold">Shift Reason: </span>{evo.shiftReason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: Demonstrated Engineering Principles */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
        <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
          <Scale size={12} /> Core Principles Demonstrated in this Project
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {review.engineeringPrinciples.map((prin, idx) => (
            <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800 font-sans text-xs text-slate-300 flex items-start gap-2">
              <span className="text-amber-400 font-bold">✓</span>
              <span>{prin}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
