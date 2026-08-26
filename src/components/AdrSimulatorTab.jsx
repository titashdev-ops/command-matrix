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
  { id: "STRICT_COMPLIANCE", label: "Audit trail", icon: Lock },
  { id: "LOW_LATENCY_SLA", label: "Low latency", icon: Zap },
  { id: "BUDGET_CAP", label: "Budget", icon: DollarSign },
  { id: "ZERO_DOWNTIME", label: "Always on", icon: Shield }
];

const SIM_SCENARIOS = [
  {
    id: "UAV_TELEMETRY",
    title: "Fleet telemetry",
    goal: "A fleet operator needs a live-feeling viewport. This is a model of that choice — not a live fleet.",
    adrId: "ADR-001",
    context: "High-frequency positions and a spatial viewport. The tension is wire cost vs. a frame that stays smooth.",
    nodes: [
      {
        stepTitle: "Ingress",
        question: "How do positions and video get to the operator?",
        options: [
          { 
            id: "webrtc_mqtt", 
            label: "WebRTC + MQTT", 
            latency: 18, 
            cost: 650, 
            score: 98, 
            violates: [],
            note: "Light on the wire. Bidirectional. The usual pick when the operator has to feel present." 
          },
          { 
            id: "hls_http", 
            label: "HLS + polling", 
            latency: 3200, 
            cost: 200, 
            score: 32, 
            violates: ["LOW_LATENCY_SLA"],
            note: "Fine for playback. Too slow if the operator is still in the loop." 
          },
          { 
            id: "grpc_web", 
            label: "gRPC-Web", 
            latency: 65, 
            cost: 450, 
            score: 82, 
            violates: [],
            note: "Typed and solid. A bit heavier than a data channel for video-sync." 
          }
        ]
      },
      {
        stepTitle: "Viewport",
        question: "How should the map update without fighting React?",
        options: [
          { 
            id: "transient_refs", 
            label: "Zustand + WebGL", 
            latency: 2, 
            cost: 150, 
            score: 96, 
            violates: [],
            note: "Skip React on the tick. The canvas owns the frame." 
          },
          { 
            id: "react_state", 
            label: "React state", 
            latency: 45, 
            cost: 50, 
            score: 40, 
            violates: ["LOW_LATENCY_SLA"],
            note: "The tree re-renders on every tick. Frames drop." 
          }
        ]
      },
      {
        stepTitle: "Storage",
        question: "Where do the points live if you want to replay them?",
        options: [
          { 
            id: "timescale_redis", 
            label: "Timescale + Redis", 
            latency: 8, 
            cost: 800, 
            score: 95, 
            violates: [],
            note: "Hot cache plus compressed history. Modeled, not a measured SLA." 
          },
          { 
            id: "standard_postgres", 
            label: "Plain Postgres", 
            latency: 180, 
            cost: 120, 
            score: 50, 
            violates: ["LOW_LATENCY_SLA"],
            note: "Writes pile up. Fine for a demo table, not a storm of points." 
          }
        ]
      }
    ]
  },
  {
    id: "HEALTHCARE_EMR",
    title: "Clinical records",
    goal: "Many rooms, one patient story. A model of how the record is written — not a live EMR.",
    adrId: "ADR-002",
    context: "Clinical data wants an audit trail, clear roles, and no silent overwrites when two people edit at once.",
    nodes: [
      {
        stepTitle: "How the record is written",
        question: "What keeps history honest when two people edit the same patient?",
        options: [
          { 
            id: "cqrs_kafka", 
            label: "Event sourcing", 
            latency: 24, 
            cost: 1200, 
            score: 96, 
            violates: [],
            note: "Every change is an event. The read model is a projection. Audit is the log itself." 
          },
          { 
            id: "monolith_crud", 
            label: "Direct CRUD", 
            latency: 85, 
            cost: 300, 
            score: 55, 
            violates: ["STRICT_COMPLIANCE"],
            note: "Two writes can overwrite each other. The log is whoever saved last." 
          }
        ]
      },
      {
        stepTitle: "How services meet",
        question: "How do records, billing, and imaging talk without a mess of clients?",
        options: [
          { 
            id: "graphql_federation", 
            label: "GraphQL federation", 
            latency: 15, 
            cost: 500, 
            score: 94, 
            violates: [],
            note: "One schema at the edge. Clients stay simple." 
          },
          { 
            id: "rest_mesh", 
            label: "REST mesh", 
            latency: 110, 
            cost: 200, 
            score: 60, 
            violates: [],
            note: "Each client stitches REST. Waterfalls and split state." 
          }
        ]
      },
      {
        stepTitle: "Who can see what",
        question: "How do you keep roles and fields from leaking?",
        options: [
          { 
            id: "jwt_pki_rbac", 
            label: "Short JWTs", 
            latency: 5, 
            cost: 400, 
            score: 98, 
            violates: [],
            note: "Short tokens, field encryption. Modeled isolation — not a certified clinic." 
          },
          { 
            id: "session_cookies", 
            label: "Session cookies", 
            latency: 25, 
            cost: 100, 
            score: 65, 
            violates: ["STRICT_COMPLIANCE"],
            note: "Sessions work until you spread the API across the edge." 
          }
        ]
      }
    ]
  },
  {
    id: "VECTOR_GRAPH_AI",
    title: "Knowledge graph",
    goal: "Find a thing, then walk its neighbors. A model of retrieval — not a live RAG service.",
    adrId: "ADR-003",
    context: "Vectors find similar notes. A graph holds how they relate. The trade-off is speed versus how far you walk.",
    nodes: [
      {
        stepTitle: "How knowledge is stored",
        question: "Vectors, a graph, or both?",
        options: [
          { 
            id: "pinecone_neo4j", 
            label: "Pinecone + Neo4j", 
            latency: 35, 
            cost: 1400, 
            score: 95, 
            violates: [],
            note: "Neighbors from the vector store, context from a few graph hops." 
          },
          { 
            id: "pgvector_only", 
            label: "pgvector", 
            latency: 120, 
            cost: 350, 
            score: 72, 
            violates: ["LOW_LATENCY_SLA"],
            note: "One database, cheaper. Slows down as the index grows." 
          }
        ]
      },
      {
        stepTitle: "How far you walk",
        question: "What stops a graph query from wandering?",
        options: [
          { 
            id: "bloom_subgraph", 
            label: "Bloom + cache", 
            latency: 8, 
            cost: 300, 
            score: 97, 
            violates: [],
            note: "Skip hops you already know are empty. Modeled pruning." 
          },
          { 
            id: "uncached_traversal", 
            label: "Raw Cypher", 
            latency: 310, 
            cost: 100, 
            score: 45, 
            violates: ["LOW_LATENCY_SLA"],
            note: "Every walk hits the graph cold. Fine until many people ask at once." 
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
          constraintViolations.push(`${node.stepTitle}: ${opt.label} conflicts with ${c.replace("_", " ")}`);
        }
      });

      if (activeConstraints.includes("BUDGET_CAP") && totalCost > 1500) {
        if (!constraintViolations.includes("Over the modeled budget")) {
          constraintViolations.push("Over the modeled budget");
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
      `* **Status:** ${isCompliant ? "Documented" : "Conflicts with a constraint"}`,
      `* **Date:** ${new Date().toISOString().substring(0, 10)}`,
      `* **Latency (estimate):** ${totalLatency} ms`,
      `* **Cost (estimate):** $${totalCost.toLocaleString()}/mo`,
      ``,
      `## Context`,
      `${activeScenario.context}`,
      `**Goal:** ${activeScenario.goal}`,
      ``,
      `## Constraints`,
      activeConstraints.length > 0 
        ? activeConstraints.map(c => `- [x] ${c.replace("_", " ")}`).join('\n')
        : `- None`,
      ``,
      `## Choices`,
      ``,
      `| Step | Choice | Latency | Cost | Why |`,
      `|---|---|---|---|---|`,
      ...activeScenario.nodes.map((node, stepIndex) => {
        const selectedOptId = currentSelections[stepIndex];
        const opt = node.options.find(o => o.id === selectedOptId);
        return `| **${node.stepTitle}** | ${opt?.label || 'None'} | ${opt?.latency || 0} ms | $${opt?.cost || 0}/mo | ${opt?.note || '—'} |`;
      }),
      ``,
      `## Outcome`,
      isCompliant
        ? `* Fits the constraints you turned on. Estimates — not a live SLA.`
        : `* Conflicts:\n` + constraintViolations.map(v => `  - ${v}`).join('\n'),
      ``,
      `## What you give up`,
      `* Latency in this model: ${totalLatency}ms.`,
      `* Cost in this model: $${totalCost.toLocaleString()}/mo.`,
      ``,
      `---`,
      `*Thought exercise from this portfolio. Not production telemetry.*`
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
      <div className="flex flex-col gap-4 border-b border-obsidian-border/60 pb-5">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <p className="kicker text-cyan-electric/80 mb-2">A path, not a lab</p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-white">
              {activeScenario.title}
            </h2>
            <p className="lede mt-2 max-w-xl">{activeScenario.goal}</p>
          </div>
          <div className="flex items-center gap-2 font-sans text-xs text-slate-500">
            <span>Latency <strong className="text-cyan-electric">{totalLatency}ms</strong></span>
            <span className="text-slate-700">·</span>
            <span>Cost <strong className="text-emerald-glow">${totalCost}/mo</strong></span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {SIM_SCENARIOS.map(scen => (
            <button type="button"
              key={scen.id}
              onClick={() => setActiveScenarioId(scen.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg font-sans text-xs font-medium tracking-wide transition-all shrink-0 min-h-[36px]",
                scen.id === activeScenarioId
                  ? "border border-cyan-electric/50 bg-cyan-electric/10 text-cyan-electric"
                  : "border border-obsidian-border bg-obsidian-surface/60 text-slate-400 hover:text-white"
              )}
            >
              {scen.title}
            </button>
          ))}
          <div className="flex items-center gap-1 rounded-lg border border-obsidian-border bg-obsidian-surface/80 p-1 ml-auto">
            <button type="button"
              onClick={() => setViewFormat("DECISION_TREE")}
              className={cn(
                "px-3 py-1 rounded font-sans text-xs font-medium transition-all",
                viewFormat === "DECISION_TREE"
                  ? "bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40"
                  : "text-slate-400 hover:text-white"
              )}
            >
              Choices
            </button>
            <button type="button"
              onClick={() => setViewFormat("MADR_DOCUMENT")}
              className={cn(
                "px-3 py-1 rounded font-sans text-xs font-medium transition-all flex items-center gap-1",
                viewFormat === "MADR_DOCUMENT"
                  ? "bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40"
                  : "text-slate-400 hover:text-white"
              )}
            >
              <FileText size={12} /> Record
            </button>
          </div>
          <button type="button"
            onClick={handleResetScenario}
            title="Reset choices"
            className="p-2 rounded-lg border border-obsidian-border bg-obsidian-surface/60 text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors duration-200 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
            aria-label="Reset choices"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Operational Constraint Toggles */}
      <div className="p-4 rounded-xl border border-obsidian-border bg-obsidian-surface/40 space-y-2">
        <div className="font-sans text-sm text-slate-400 flex items-center gap-1.5">
          <Lock size={13} className="text-amber-400" /> Constraints
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
            <span className="text-cyan-electric font-bold">{activeScenario.title}</span>
            <div className="flex items-center gap-2">
              <button type="button"
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-3 py-1 rounded border border-cyan-electric/40 bg-cyan-electric/10 text-cyan-electric hover:bg-cyan-electric/20 transition-all duration-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button type="button"
                onClick={handleDownloadReport}
                className="flex items-center gap-1.5 px-3 py-1 rounded border border-emerald-glow/40 bg-emerald-glow/10 text-emerald-glow hover:bg-emerald-glow/20 transition-all duration-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
              >
                <Download size={12} /> Download
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
                            <AlertTriangle size={12} /> Conflicts
                          </div>
                        )}

                        <div className="flex items-center justify-between font-mono text-xs text-slate-400 mt-2.5 pt-2 ">
                          <span>Latency: <strong className={opt.latency < 50 ? "text-emerald-glow" : "text-amber-400"}>{opt.latency}ms</strong></span>
                          <span>Cost: <strong className="text-emerald-glow">${opt.cost}/mo</strong></span>
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
              "font-sans text-xs font-semibold tracking-wide flex items-center justify-center md:justify-start gap-2",
              isCompliant ? "text-emerald-glow" : "text-rose-400"
            )}>
              <ShieldCheck size={16} /> {isCompliant ? "Fits the constraints" : "Conflicts"}
              {!isCompliant && <span className="text-xs font-normal text-rose-400">({constraintViolations.length})</span>}
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 font-sans text-xs text-slate-300 pt-1">
              <span>Latency <strong className="text-cyan-electric text-sm">{totalLatency} ms</strong></span>
              <span>Cost <strong className="text-emerald-glow text-sm">${totalCost.toLocaleString()}/mo</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button"
              onClick={handleCopyReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cyan-electric/50 bg-cyan-electric/10 font-sans text-xs font-bold text-cyan-electric hover:bg-cyan-electric/20 transition-all duration-200 shrink-0 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy record"}
            </button>
            <button type="button"
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-emerald-glow/50 bg-emerald-glow/10 font-sans text-xs font-bold text-emerald-glow hover:bg-emerald-glow/20 transition-all duration-200 shrink-0 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
            >
              <Download size={16} /> Download
            </button>
          </div>
        </div>

        {/* Engineering Takeaways & Decision Synthesis */}
        <div className="p-5 rounded-xl border border-obsidian-border bg-obsidian-surface/60 space-y-4">
          <div className="flex items-center justify-between border-b border-obsidian-border/60 pb-3">
            <div className="font-sans text-xs font-semibold text-cyan-electric flex items-center gap-2">
              <FileText size={16} /> What this path costs
            </div>
            <span className="text-xs px-2 py-0.5 rounded border border-cyan-electric/40 bg-cyan-electric/10 font-sans text-cyan-electric">
              Estimates
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-surface/40 space-y-1">
              <span className="font-sans text-xs uppercase text-cyan-electric font-bold block">Path</span>
              <p className="text-slate-300 font-sans text-sm leading-tight">
                {activeScenario.nodes.map((n, idx) => {
                  const sel = n.options.find(o => o.id === currentSelections[idx]);
                  return sel ? sel.label : 'None';
                }).join(" → ")}
              </p>
            </div>

            <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-surface/40 space-y-1">
              <span className="font-sans text-xs uppercase text-emerald-glow font-bold block">Trade-off</span>
              <p className="text-slate-300">
                {isCompliant
                  ? `Fits the constraints. Latency ${totalLatency}ms, cost $${totalCost.toLocaleString()}/mo.`
                  : `Conflicts: ${constraintViolations[0] || "Review the choices"}`}
              </p>
            </div>

            <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-surface/40 space-y-1">
              <span className="font-sans text-xs uppercase text-amber-400 font-bold block">Why it's here</span>
              <p className="text-slate-300">
                To show how I pick a path when latency, cost, and audit pull in different directions.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-obsidian-border bg-obsidian-surface/40 space-y-1">
              <span className="font-sans text-xs uppercase text-purple-400 font-bold block">Related work</span>
              <p className="text-slate-300">
                Same questions as <strong>ops.dronly.in</strong>, <strong>Healthcare</strong>, <strong>Prodent OS</strong>, and <strong>Career OS</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
