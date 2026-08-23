import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GitCommit, ArrowRight, CheckCircle2, AlertTriangle, Cpu, RefreshCw, Copy, Check, 
  ShieldCheck, Zap, Download, FileText, Sliders, Lock, Shield, DollarSign
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

const ENTERPRISE_CONSTRAINTS = [
  { id: "STRICT_COMPLIANCE", label: "HIPAA / SOC2 Audit Trail", icon: Lock },
  { id: "LOW_LATENCY_SLA", label: "Sub-50ms P99 SLA", icon: Zap },
  { id: "BUDGET_CAP", label: "Cloud Cost Cap ($1,500/mo)", icon: DollarSign },
  { id: "ZERO_DOWNTIME", label: "Multi-Region Active-Active", icon: Shield }
];

const SIM_SCENARIOS = [
  {
    id: "UAV_TELEMETRY",
    title: "Scenario A: UAV Kinematic Telemetry & C2 Matrix",
    goal: "Ingest 500+ live drone flight streams, 60 FPS spatial telemetry, sub-50ms glass-to-glass control loops.",
    adrId: "ADR-001",
    context: "High-frequency UAV kinematic telemetry requires minimal wire protocol overhead, non-blocking browser rendering, and time-series persistence capable of handling 50,000 writes/sec without write lock contention.",
    nodes: [
      {
        stepTitle: "1. Ingestion Protocol Architecture",
        question: "Which transport protocol pipeline satisfies sub-50ms glass-to-glass video & spatial control?",
        options: [
          { 
            id: "webrtc_mqtt", 
            label: "WebRTC DataChannel + EMQX MQTT over WebSockets", 
            latency: 18, 
            cost: 650, 
            score: 98, 
            violates: [],
            note: "Optimal ultra-low latency & bi-directional telemetry control with zero wire serialization bloat." 
          },
          { 
            id: "hls_http", 
            label: "HLS Video Chunking + REST Polling", 
            latency: 3200, 
            cost: 200, 
            score: 32, 
            violates: ["LOW_LATENCY_SLA"],
            note: "Unacceptable latency for live drone command and control. Unusable for real-time evasive maneuvers." 
          },
          { 
            id: "grpc_web", 
            label: "gRPC-Web Streaming over HTTP/2", 
            latency: 65, 
            cost: 450, 
            score: 82, 
            violates: [],
            note: "Strongly typed protobuf protocol, but slightly higher overhead than WebRTC DataChannels for video-sync." 
          }
        ]
      },
      {
        stepTitle: "2. Client-Side Rendering Engine",
        question: "How should 60 FPS spatial updates update the browser viewport without DOM thrashing?",
        options: [
          { 
            id: "transient_refs", 
            label: "Zustand Transient Subscriptions + Instanced WebGL Mesh Buffers", 
            latency: 2, 
            cost: 150, 
            score: 96, 
            violates: [],
            note: "Completely bypasses React reconciliation loops during 60 Hz tick updates. Sub-frame rendering latency." 
          },
          { 
            id: "react_state", 
            label: "Standard React useState / Context Dispatch", 
            latency: 45, 
            cost: 50, 
            score: 40, 
            violates: ["LOW_LATENCY_SLA"],
            note: "Triggers frequent full tree re-renders at 60 FPS, causing frame drops and input lag." 
          }
        ]
      },
      {
        stepTitle: "3. Hot Time-Series Storage",
        question: "Where should high-frequency spatial points be persisted for immediate playback & audit?",
        options: [
          { 
            id: "timescale_redis", 
            label: "TimescaleDB Hypertables + Redis TimeSeries Hot-Tier Cache", 
            latency: 8, 
            cost: 800, 
            score: 95, 
            violates: [],
            note: "Sub-millisecond query performance with 90% columnar compression ratios." 
          },
          { 
            id: "standard_postgres", 
            label: "Unindexed Relational PostgreSQL Table", 
            latency: 180, 
            cost: 120, 
            score: 50, 
            violates: ["LOW_LATENCY_SLA"],
            note: "Table locks under high concurrent insert volume (50k/s) stall write threads." 
          }
        ]
      }
    ]
  },
  {
    id: "HEALTHCARE_EMR",
    title: "Scenario B: Enterprise Clinical Healthcare EMR OS",
    goal: "Multi-practice patient dental records, HIPAA audit compliance, field-level encryption, and zero race conditions.",
    adrId: "ADR-002",
    context: "Clinical healthcare EMR systems must satisfy immutable HIPAA audit requirements, granular role-based access control (RBAC), and multi-tenant patient data segregation across clinical imaging and billing microservices.",
    nodes: [
      {
        stepTitle: "1. Data Mutation & Audit Pattern",
        question: "Which architecture pattern guarantees immutable patient history auditing with zero race conditions?",
        options: [
          { 
            id: "cqrs_kafka", 
            label: "CQRS + Kafka Event Sourcing + Read-Side Projections", 
            latency: 24, 
            cost: 1200, 
            score: 96, 
            violates: [],
            note: "Complete immutable audit trail of every patient change with decoupled read-side GraphQL projections." 
          },
          { 
            id: "monolith_crud", 
            label: "Direct Monolithic Relational CRUD Mutations", 
            latency: 85, 
            cost: 300, 
            score: 55, 
            violates: ["STRICT_COMPLIANCE"],
            note: "Risk of silent overwrites during concurrent multi-provider patient updates. Defeats zero-trust audit compliance." 
          }
        ]
      },
      {
        stepTitle: "2. Service Federation Layer",
        question: "How to unify decoupled patient, billing, and clinical imaging services safely?",
        options: [
          { 
            id: "graphql_federation", 
            label: "GraphQL Subgraph Federation (Router Gateway)", 
            latency: 15, 
            cost: 500, 
            score: 94, 
            violates: [],
            note: "Single strongly-typed schema gateway for heterogeneous client web and mobile apps." 
          },
          { 
            id: "rest_mesh", 
            label: "Uncoordinated REST Microservices Mesh", 
            latency: 110, 
            cost: 200, 
            score: 60, 
            violates: [],
            note: "Causes N+1 query waterfall overhead and fragmented client-side state handling." 
          }
        ]
      },
      {
        stepTitle: "3. Cryptographic Security & RBAC",
        question: "Which authentication architecture enforces strict HIPAA role-based data isolation?",
        options: [
          { 
            id: "jwt_pki_rbac", 
            label: "Short-Lived Ephemeral JWTs + PKI Tokens + Field-Level AES-GCM", 
            latency: 5, 
            cost: 400, 
            score: 98, 
            violates: [],
            note: "Zero-trust compliance with cryptographic field-level audit log hashes and immediate token revocation." 
          },
          { 
            id: "session_cookies", 
            label: "Standard Server-Side Stateful Session Cookies", 
            latency: 25, 
            cost: 100, 
            score: 65, 
            violates: ["STRICT_COMPLIANCE"],
            note: "Harder to scale securely across edge-cached GraphQL API endpoints." 
          }
        ]
      }
    ]
  },
  {
    id: "VECTOR_GRAPH_AI",
    title: "Scenario C: Hybrid RAG & Knowledge Graph AI Engine",
    goal: "Sub-100ms vector similarity search combined with multi-hop graph entity traversal for enterprise AI reasoning.",
    adrId: "ADR-003",
    context: "RAG knowledge systems must bridge vector embeddings with structural graph relationships without incurring high vector search latency or unbounded graph traversal memory overhead.",
    nodes: [
      {
        stepTitle: "1. Knowledge Representation Engine",
        question: "Which storage topology unifies semantic vector embeddings with deep entity graph relations?",
        options: [
          { 
            id: "pinecone_neo4j", 
            label: "Pinecone HNSW Vector DB + Neo4j Subgraph Cache", 
            latency: 35, 
            cost: 1400, 
            score: 95, 
            violates: [],
            note: "Fast parallel retrieval: Cosine nearest-neighbor vectors paired with 3-hop graph relationship context." 
          },
          { 
            id: "pgvector_only", 
            label: "Single PostgreSQL Instance with pgvector Extension", 
            latency: 120, 
            cost: 350, 
            score: 72, 
            violates: ["LOW_LATENCY_SLA"],
            note: "Economical, but vector index query time scales poorly beyond 10M embeddings under high traffic." 
          }
        ]
      },
      {
        stepTitle: "2. Caching & Subgraph Pruning",
        question: "How to prevent multi-hop graph queries from causing latency spikes during peak load?",
        options: [
          { 
            id: "bloom_subgraph", 
            label: "Bloom Filter Subgraph Caching + Vector Nearest-Neighbor Fallback", 
            latency: 8, 
            cost: 300, 
            score: 97, 
            violates: [],
            note: "Filters out 92% of redundant graph traversals before reaching the database." 
          },
          { 
            id: "uncached_traversal", 
            label: "Uncached Dynamic Cypher Graph Queries", 
            latency: 310, 
            cost: 100, 
            score: 45, 
            violates: ["LOW_LATENCY_SLA"],
            note: "Dynamic multi-hop traversals exhaust database CPU cores under concurrent query loads." 
          }
        ]
      }
    ]
  }
];

export default function AdrSimulatorTab() {
  const [activeScenarioId, setActiveScenarioId] = useState("UAV_TELEMETRY");
  const [activeConstraints, setActiveConstraints] = useState(["STRICT_COMPLIANCE", "LOW_LATENCY_SLA"]);
  
  const [selections, setSelections] = useState({
    UAV_TELEMETRY: { 0: "webrtc_mqtt", 1: "transient_refs", 2: "timescale_redis" },
    HEALTHCARE_EMR: { 0: "cqrs_kafka", 1: "graphql_federation", 2: "jwt_pki_rbac" },
    VECTOR_GRAPH_AI: { 0: "pinecone_neo4j", 1: "bloom_subgraph" }
  });
  
  const [copied, setCopied] = useState(false);
  const [viewFormat, setViewFormat] = useState("DECISION_TREE"); // "DECISION_TREE" | "MADR_DOCUMENT"

  const activeScenario = SIM_SCENARIOS.find(s => s.id === activeScenarioId) || SIM_SCENARIOS[0];
  const currentSelections = selections[activeScenarioId] || {};

  const toggleConstraint = (id) => {
    setActiveConstraints(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSelectOption = (stepIndex, optionId) => {
    setSelections(prev => ({
      ...prev,
      [activeScenarioId]: {
        ...prev[activeScenarioId],
        [stepIndex]: optionId
      }
    }));
  };

  const handleResetScenario = () => {
    const defaultOpt = activeScenario.nodes.reduce((acc, node, idx) => {
      acc[idx] = node.options[0]?.id;
      return acc;
    }, {});
    setSelections(prev => ({
      ...prev,
      [activeScenarioId]: defaultOpt
    }));
  };

  // Calculate composite evaluation metrics
  let totalLatency = 0;
  let totalCost = 0;
  let totalScore = 0;
  let selectedCount = 0;
  let constraintViolations = [];

  activeScenario.nodes.forEach((node, stepIndex) => {
    const selectedOptId = currentSelections[stepIndex];
    const opt = node.options.find(o => o.id === selectedOptId);
    if (opt) {
      totalLatency += opt.latency;
      totalCost += opt.cost;
      totalScore += opt.score;
      selectedCount++;

      // Check active constraints
      activeConstraints.forEach(c => {
        if (opt.violates.includes(c)) {
          constraintViolations.push(`${node.stepTitle}: ${opt.label} violates ${c.replace("_", " ")}`);
        }
      });

      if (activeConstraints.includes("BUDGET_CAP") && totalCost > 1500) {
        if (!constraintViolations.includes("Cloud Cost exceeds $1,500/mo cap")) {
          constraintViolations.push("Cloud Cost exceeds $1,500/mo cap");
        }
      }
    }
  });

  const avgScore = selectedCount > 0 ? Math.round(totalScore / selectedCount) : 0;
  const isCompliant = constraintViolations.length === 0;

  // Generate MADR (Markdown Architecture Decision Record)
  const generateMadrMarkdown = () => {
    return [
      `# ${activeScenario.adrId}: ${activeScenario.title}`,
      ``,
      `* **Status:** ${isCompliant ? "ACCEPTED // COMPLIANT" : "REJECTED // CONSTRAINT VIOLATIONS DETECTED"}`,
      `* **Date:** ${new Date().toISOString().substring(0, 10)}`,
      `* **Composite Score:** ${avgScore}/100`,
      `* **Pipeline Latency:** ${totalLatency} ms`,
      `* **Est. Monthly Cost:** $${totalCost.toLocaleString()}/mo`,
      ``,
      `## Context & Problem Statement`,
      `${activeScenario.context}`,
      `**Operational Goal:** ${activeScenario.goal}`,
      ``,
      `## Active Operational Constraints`,
      activeConstraints.length > 0 
        ? activeConstraints.map(c => `- [x] ${c.replace("_", " ")}`).join('\n')
        : `- None specified`,
      ``,
      `## Architectural Decision Matrix`,
      ``,
      `| Decision Vector | Chosen Architecture Option | Latency | Est. Cost | Rationale |`,
      `|---|---|---|---|---|`,
      ...activeScenario.nodes.map((node, stepIndex) => {
        const selectedOptId = currentSelections[stepIndex];
        const opt = node.options.find(o => o.id === selectedOptId);
        return `| **${node.stepTitle}** | ${opt?.label || 'None'} | ${opt?.latency || 0} ms | $${opt?.cost || 0}/mo | ${opt?.note || 'N/A'} |`;
      }),
      ``,
      `## Compliance & Risk Analysis`,
      isCompliant
        ? `* **Compliance:** PASSED. All architectural choices satisfy active operational constraints.`
        : `* **Violations Detected:**\n` + constraintViolations.map(v => `  - WARNING: ${v}`).join('\n'),
      ``,
      `## Consequences & Mitigations`,
      `* **Positive Impact:** Sub-system latency bounded at ${totalLatency}ms with modular component separation.`,
      `* **Structural Failure Mode:** High concurrency spike mitigation handled via circuit breaker load shedding.`,
      ``,
      `---`,
      `*Generated by Titash Dev System Command Engineering Decision Matrix (Portfolio Decision-Support Tool)*`
    ].join('\n');
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateMadrMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    const text = generateMadrMarkdown();
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeScenario.adrId.toLowerCase()}-architecture-record.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-obsidian-border/60 pb-4">
        <div>
          <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-cyan-electric flex items-center gap-2">
            <GitCommit size={16} /> Architectural Tradeoff Decision-Support Tool & MADR Generator
          </div>
          <div className="font-sans text-xs text-slate-400">
            Compare architectural branches under SLA, cost, and compliance constraints to evaluate trade-offs and export MADR records.
          </div>
        </div>

        {/* Simulation Boundaries & Trust Panel */}
        <div className="w-full lg:w-auto p-3.5 rounded-lg border border-cyan-electric/30 bg-cyan-electric/5 space-y-1.5 shrink-0">
          <div className="flex items-center justify-between gap-3 font-sans font-medium text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><GitCommit size={13} /> Decision Boundaries</span>
            <span className="text-xs px-1.5 py-0.5 rounded border border-cyan-electric/40 bg-cyan-electric/10">Decision-Support</span>
          </div>
          <p className="font-sans text-sm text-slate-300 leading-snug">
            Evaluates trade-off branches against SLA, cost caps, and compliance mandates.
          </p>
          <div className="flex items-center gap-3 font-sans text-xs text-slate-400 pt-0.5">
            <div><strong className="text-emerald-glow">Demonstrates:</strong> Trade-off reasoning & MADRs</div>
            <div><strong className="text-purple-300">Scope:</strong> Educational Evidence</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Format Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-obsidian-border bg-obsidian-surface/80 p-1">
            <button type="button"
              onClick={() => setViewFormat("DECISION_TREE")}
              className={cn(
                "px-3 py-1 rounded font-sans text-xs font-bold transition-all",
                viewFormat === "DECISION_TREE"
                  ? "bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40"
                  : "text-slate-400 hover:text-white"
              )}
            >
              DECISION TREE
            </button>
            <button type="button"
              onClick={() => setViewFormat("MADR_DOCUMENT")}
              className={cn(
                "px-3 py-1 rounded font-sans text-xs font-bold transition-all flex items-center gap-1",
                viewFormat === "MADR_DOCUMENT"
                  ? "bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <FileText size={12} /> MADR DOCUMENT
            </button>
          </div>

          {/* Scenario Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {SIM_SCENARIOS.map(scen => (
              <button type="button"
                key={scen.id}
                onClick={() => setActiveScenarioId(scen.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-sans text-xs font-bold transition-all shrink-0 min-h-[36px]",
                  scen.id === activeScenarioId
                    ? "border border-cyan-electric/50 bg-cyan-electric/10 text-cyan-electric"
                    : "border border-obsidian-border bg-obsidian-surface/60 text-slate-400 hover:text-white"
                )}
              >
                {scen.adrId}
              </button>
            ))}

            <button type="button"
              onClick={handleResetScenario}
              title="Reset scenario selections"
              className="p-2 rounded-lg border border-obsidian-border bg-obsidian-surface/60 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors duration-200 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
              aria-label="Reset scenario selections"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Goal Banner */}
      <div className="p-4 rounded-xl border border-cyan-electric/30 bg-cyan-electric/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="font-sans text-xs font-bold uppercase text-cyan-electric flex items-center gap-2">
            <Zap size={16} /> {activeScenario.title}
          </div>
          <div className="font-sans text-xs text-slate-300 mt-1">{activeScenario.goal}</div>
        </div>

        <div className="flex items-center gap-2 font-mono text-sm text-slate-400 border-t md:border-t-0 border-obsidian-border/60 pt-2 md:pt-0">
          <span>Est. Latency: <strong className="text-cyan-electric">{totalLatency}ms</strong></span>
          <span className="text-slate-600">|</span>
          <span>Est. Cost: <strong className="text-emerald-glow">${totalCost}/mo</strong></span>
        </div>
      </div>

      {/* Operational Constraint Toggles */}
      <div className="p-4 rounded-xl border border-obsidian-border bg-obsidian-surface/40 space-y-2">
        <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Lock size={13} className="text-amber-400" /> Active Enterprise Constraints & SLA Rules
        </div>
        <div className="flex flex-wrap gap-2">
          {ENTERPRISE_CONSTRAINTS.map(c => {
            const Icon = c.icon;
            const isActive = activeConstraints.includes(c.id);
            return (
              <button type="button"
                key={c.id}
                onClick={() => toggleConstraint(c.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs font-bold transition-all border",
                  isActive
                    ? "border-amber-400/60 bg-amber-400/10 text-amber-400 shadow-amber-glow"
                    : "border-obsidian-border bg-obsidian-surface/60 text-slate-400 hover:text-white"
                )}
              >
                <Icon size={12} /> {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {viewFormat === "MADR_DOCUMENT" ? (
        /* --- MADR DOCUMENT PREVIEW --- */
        <div className="p-6 rounded-xl border border-obsidian-border bg-slate-950 font-mono text-xs text-slate-300 space-y-4 custom-scrollbar overflow-x-auto">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-cyan-electric font-bold">{activeScenario.adrId}: ARCHITECTURAL DECISION RECORD</span>
            <div className="flex items-center gap-2">
              <button type="button"
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-3 py-1 rounded border border-cyan-electric/40 bg-cyan-electric/10 text-cyan-electric hover:bg-cyan-electric/20 transition-all duration-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "COPIED" : "COPY MARKDOWN"}
              </button>
              <button type="button"
                onClick={handleDownloadReport}
                className="flex items-center gap-1.5 px-3 py-1 rounded border border-emerald-glow/40 bg-emerald-glow/10 text-emerald-glow hover:bg-emerald-glow/20 transition-all duration-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
              >
                <Download size={12} /> DOWNLOAD .MD
              </button>
            </div>
          </div>

          <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed">
            {generateMadrMarkdown()}
          </pre>
        </div>
      ) : (
        /* --- DECISION TREE BUILDER --- */
        <div className="space-y-5">
          {activeScenario.nodes.map((node, stepIndex) => {
            const selectedOptId = currentSelections[stepIndex];

            return (
              <div key={stepIndex} className="p-4 sm:p-5 rounded-xl border border-obsidian-border bg-obsidian-surface/40 space-y-3">
                <div className="font-sans text-xs font-bold text-white flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-electric/20 text-cyan-electric text-xs">
                    {stepIndex + 1}
                  </span>
                  {node.stepTitle}
                </div>
                <p className="font-sans text-xs text-slate-300">{node.question}</p>

                {/* Option Cards */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {node.options.map((opt) => {
                    const isSelected = selectedOptId === opt.id;
                    const hasViolation = activeConstraints.some(c => opt.violates.includes(c));

                    return (
                      <button type="button"
                        key={opt.id}
                        onClick={() => handleSelectOption(stepIndex, opt.id)}
                        className={cn(
                          "flex flex-col text-left p-3.5 rounded-lg border transition-all duration-200 relative",
                          isSelected
                            ? hasViolation
                              ? "border-rose-500 bg-rose-500/10 shadow-rose-glow"
                              : "border-cyan-electric bg-cyan-electric/10 shadow-cyan-glow"
                            : "border-obsidian-border bg-obsidian-surface/60 hover:border-slate-500 hover:bg-obsidian-surface"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn("font-sans text-xs font-bold", isSelected ? (hasViolation ? "text-rose-400" : "text-cyan-electric") : "text-white")}>
                            {opt.label}
                          </span>
                          {isSelected && <CheckCircle2 size={14} className={hasViolation ? "text-rose-400" : "text-cyan-electric"} />}
                        </div>

                        {hasViolation && (
                          <div className="flex items-center gap-1 font-sans text-xs text-rose-400 mt-1 font-bold">
                            <AlertTriangle size={12} /> Constraint Violation
                          </div>
                        )}

                        <div className="flex items-center justify-between font-mono text-xs text-slate-400 mt-2.5 pt-2 ">
                          <span>Latency: <strong className={opt.latency < 50 ? "text-emerald-glow" : "text-amber-400"}>{opt.latency}ms</strong></span>
                          <span>Cost: <strong className="text-emerald-glow">${opt.cost}/mo</strong></span>
                          <span>Score: <strong className="text-cyan-electric">{opt.score}/100</strong></span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                          {opt.note}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Composite Evaluation Scorecard & Action Footer */}
      <div className="space-y-4">
        <div className={cn(
          "p-5 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4",
          isCompliant
            ? "border-emerald-glow/40 bg-emerald-glow/5"
            : "border-rose-500/40 bg-rose-500/5"
        )}>
          <div className="space-y-1 text-center md:text-left">
            <div className={cn(
              "font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center md:justify-start gap-2",
              isCompliant ? "text-emerald-glow" : "text-rose-400"
            )}>
              <ShieldCheck size={16} /> Composite Decision Evaluation Scorecard
              {!isCompliant && <span className="text-xs font-normal text-rose-400">({constraintViolations.length} Violations)</span>}
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 font-sans text-xs text-slate-300 pt-1">
              <span>Overall Score: <strong className="text-emerald-glow text-sm">{avgScore} / 100</strong></span>
              <span>Total Latency: <strong className="text-cyan-electric text-sm">{totalLatency} ms</strong></span>
              <span>Total Monthly Cost: <strong className="text-emerald-glow text-sm">${totalCost.toLocaleString()}/mo</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button"
              onClick={handleCopyReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cyan-electric/50 bg-cyan-electric/10 font-sans text-xs font-bold text-cyan-electric hover:bg-cyan-electric/20 transition-all duration-200 shrink-0 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "MARKDOWN COPIED!" : "COPY MADR"}
            </button>
            <button type="button"
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-glow/50 bg-emerald-glow/10 font-sans text-xs font-bold text-emerald-glow hover:bg-emerald-glow/20 transition-all duration-200 shrink-0 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
            >
              <Download size={16} /> EXPORT .MD
            </button>
          </div>
        </div>

        {/* Engineering Takeaways & Decision Synthesis */}
        <div className="p-5 rounded-xl border border-obsidian-border bg-obsidian-surface/60 space-y-4">
          <div className="flex items-center justify-between border-b border-obsidian-border/60 pb-3">
            <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-cyan-electric flex items-center gap-2">
              <FileText size={16} /> Engineering Takeaways & Trade-Off Analysis
            </div>
            <span className="text-xs px-2 py-0.5 rounded border border-cyan-electric/40 bg-cyan-electric/10 font-sans text-cyan-electric">
              Decision-Support Tool
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-surface/40 space-y-1">
              <span className="font-sans text-xs uppercase text-cyan-electric font-bold block">Selected Architecture Path</span>
              <p className="text-slate-300 font-sans text-sm leading-tight">
                {activeScenario.nodes.map((n, idx) => {
                  const sel = n.options.find(o => o.id === currentSelections[idx]);
                  return sel ? sel.label : 'None';
                }).join(" → ")}
              </p>
            </div>

            <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-surface/40 space-y-1">
              <span className="font-sans text-xs uppercase text-emerald-glow font-bold block">Trade-Offs Accepted / Rejected</span>
              <p className="text-slate-300">
                {isCompliant
                  ? `Accepted higher operational complexity to guarantee sub-${totalLatency}ms latency within $${totalCost.toLocaleString()}/mo.`
                  : `Rejected path violates active constraints: ${constraintViolations[0] || "Review selections"}`}
              </p>
            </div>

            <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-surface/40 space-y-1">
              <span className="font-sans text-xs uppercase text-amber-400 font-bold block">Engineering Skill Demonstrated</span>
              <p className="text-slate-300">
                Systematic trade-off evaluation under conflicting cost caps, SLA targets, and HIPAA/GDPR compliance mandates.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-surface/40 space-y-1">
              <span className="font-sans text-xs uppercase text-purple-400 font-bold block">Flagship Project Links</span>
              <p className="text-slate-300">
                Applied across <strong>ops.dronly.in</strong>, <strong>Healthcare Systems Initiative</strong>, <strong>Prodent OS</strong>, <strong>Career OS</strong>, and <strong>Personal OS</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
