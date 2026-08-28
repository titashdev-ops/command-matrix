import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Server, Layers, Cpu, Cloud, Activity, Code, Database, Shield, Zap, ChevronRight, CheckCircle2, GitBranch, ArrowRight } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSystemCommand } from "../context/SystemCommandContext";
import { useModal } from "../hooks/useModal";
import { useRef } from "react";

const cn = (...inputs) => twMerge(clsx(inputs));

const VIEWS = [
  { id: "overview", label: "System Overview", icon: Layers },
  { id: "frontend", label: "Frontend Layer", icon: Code },
  { id: "backend", label: "Backend Layer", icon: Server },
  { id: "ai", label: "AI Layer", icon: Cpu },
  { id: "infrastructure", label: "Infrastructure", icon: Cloud },
  { id: "flow", label: "System Flows", icon: Activity },
];

const NODE_DETAILS = {
  // Frontend
  react: { title: "React 18+", purpose: "View Layer", resp: "Component rendering, layout composition", decision: "Concurrent rendering features prevent UI blocking during heavy telemetry updates.", future: "Migrate static routes to React Server Components.", dependencies: ["typescript", "state"], artifact: { label: "Review React ADR", action: "openAdrs" } },
  typescript: { title: "TypeScript", purpose: "Type Safety", resp: "Static typing, schema validation", decision: "Eliminates entire classes of runtime errors across complex data pipelines.", future: "Stricter Zod inference.", dependencies: ["react", "logic"] },
  state: { title: "State Management", purpose: "Data Flow", resp: "Context APIs, localized stores", decision: "Zustand chosen over Redux for minimal boilerplate and React Three Fiber compatibility.", future: "WebWorkers for heavy state processing.", dependencies: ["react"] },
  threejs: { title: "Three.js / R3F", purpose: "Spatial Rendering", resp: "WebGL canvas, 3D asset orchestration", decision: "Declarative 3D graph allows syncing HTML overlay state with 3D nodes effortlessly.", future: "WebGPU migration for 10x vertex limits.", dependencies: ["react", "state"], artifact: { label: "View 3D Demo", action: "openFlagships" } },
  ui: { title: "UI Architecture", purpose: "Design System", resp: "Tailwind CSS, Framer Motion", decision: "Utility classes prevent CSS bloat; Framer Motion provides mathematically precise interpolations.", future: "CSS variable theming engine.", dependencies: ["react"] },
  
  // Backend
  api: { title: "API Layer", purpose: "Ingestion / Routing", resp: "REST endpoints, WebSocket management", decision: "API routes provide seamless serverless bridging for frontend requests.", future: "GraphQL for complex relational queries.", dependencies: ["auth", "logic", "serverless"] },
  auth: { title: "Authentication", purpose: "Identity", resp: "JWT validation, session management", decision: "Stateless tokens scale by adding instances. A pattern in the case studies — this site has no accounts.", future: "Biometric Passkeys support.", dependencies: ["api", "db"] },
  logic: { title: "Business Logic", purpose: "Orchestration", resp: "Data transformations, rule evaluation", decision: "Decoupled from transport layer to allow both HTTP and event-driven invocations.", future: "WASM modules for performance critical paths.", dependencies: ["api", "db", "cache"] },
  serverless: { title: "Serverless Functions", purpose: "Compute", resp: "On-demand execution", decision: "Functions scale when they need to. Cold starts still exist.", future: "Stateful edge computing patterns.", dependencies: ["api", "vercel"] },
  db: { title: "Database", purpose: "Persistence", resp: "ACID transactions, relational integrity", decision: "PostgreSQL chosen for strict schema guarantees and JSONB support.", future: "Read replicas in EU/AP regions.", dependencies: ["logic"], artifact: { label: "Review Database Schema ADR", action: "openAdrs" } },
  cache: { title: "Caching", purpose: "Performance", resp: "In-memory key-value store", decision: "Redis handles rate-limiting and ephemeral state, reducing DB load by 80%.", future: "Distributed edge caching.", dependencies: ["logic", "api"] },
  error: { title: "Error Handling", purpose: "Resilience", resp: "Circuit breakers, DLQs", decision: "Fail-open strategies on non-critical paths ensure graceful degradation.", future: "AI-driven automatic retries.", dependencies: ["api", "logic", "monitoring"] },
  
  // AI
  orchestration: { title: "Model Orchestration", purpose: "AI Routing", resp: "LLM selection, load balancing", decision: "Dynamic routing between models based on token constraints and latency.", future: "Local SLM fallback on edge devices.", dependencies: ["prompt", "fallback", "context"], artifact: { label: "View AI Benchmark", action: "openAdrs" } },
  prompt: { title: "Prompt Engineering", purpose: "Context Injection", resp: "System instructions, few-shot examples", decision: "Templates keep the model inside a shape. A teaching note, not a live agent.", future: "Dynamic prompt optimization.", dependencies: ["orchestration"] },
  fallback: { title: "Fallback Strategy", purpose: "Redundancy", resp: "Graceful degradation on timeout", decision: "Hard timeout at 8s returns pre-computed heuristic responses to preserve UX.", future: "Progressive streaming fallbacks.", dependencies: ["orchestration"] },
  context: { title: "Context Management", purpose: "Memory", resp: "Vector retrieval, RAG", decision: "Vector similarity search used to inject relevant historical SOPs into the prompt context window.", future: "Graph-based memory retrieval.", dependencies: ["orchestration", "db"] },
  lifecycle: { title: "AI Request Lifecycle", purpose: "Execution", resp: "Streaming, chunking", decision: "Server-Sent Events (SSE) provide immediate time-to-first-byte perception for the user.", future: "Bidirectional WebSockets for real-time agentic actions.", dependencies: ["orchestration", "api"] },
  validation: { title: "Response Validation", purpose: "Safety", resp: "Zod parsing, output sanitization", decision: "Bad JSON dies at the boundary. A defensive pattern, not a live renderer.", future: "Self-correcting validation loops.", dependencies: ["orchestration", "typescript"] },
  
  // Infrastructure
  deployment: { title: "Deployment", purpose: "Delivery", resp: "Immutable builds, blue/green", decision: "Atomic deployments prevent partial state mismatches during scaling events.", future: "Canary rollouts via traffic shaping.", dependencies: ["cicd", "vercel"] },
  cicd: { title: "CI/CD", purpose: "Automation", resp: "Testing, linting, building", decision: "Actions run lint and build on merge. This site is a static deploy, not a fleet.", future: "Automated chaos engineering tests.", dependencies: ["github", "deployment"] },
  github: { title: "GitHub", purpose: "Source Control", resp: "Version control, code review", decision: "Trunk-based development forces small, highly-reviewed iterative changes.", future: "AI-assisted PR structural reviews.", dependencies: ["cicd"], artifact: { label: "View Mission Repositories", action: "openFlagships" } },
  vercel: { title: "Vercel / Cloud", purpose: "Hosting", resp: "Edge network, serverless infrastructure", decision: "Zero-config infrastructure allows the engineering team to focus entirely on product features.", future: "Multi-cloud redundancy layer.", dependencies: ["serverless", "deployment"] },
  monitoring: { title: "Monitoring", purpose: "Observability", resp: "APM, uptime checks", decision: "Tracing is a pattern for the systems in these case studies. This portfolio has no live APM.", future: "Predictive anomaly detection.", dependencies: ["error", "logging"] },
  logging: { title: "Logging", purpose: "Audit", resp: "Structured JSON logs", decision: "Centralized logging prevents debugging blindness in distributed serverless systems.", future: "Cost-optimized intelligent log sampling.", dependencies: ["monitoring"] },
  security: { title: "Security", purpose: "Protection", resp: "WAF, DDoS mitigation", decision: "Edge firewall sits in front of the application to absorb volumetric attacks instantly.", future: "Zero-trust network architecture.", dependencies: ["vercel", "auth"] },
};

const ARCHITECTURE_DATA = {
  frontend: ["react", "typescript", "state", "threejs", "ui"],
  backend: ["api", "auth", "logic", "serverless", "db", "cache", "error"],
  ai: ["orchestration", "prompt", "fallback", "context", "lifecycle", "validation"],
  infrastructure: ["deployment", "cicd", "github", "vercel", "monitoring", "logging", "security"]
};

// Flow data
const SYSTEM_FLOW = [
  { id: "req", label: "User Request", icon: Zap },
  { id: "fe", label: "Frontend", icon: Code },
  { id: "api", label: "API Gateway", icon: Server },
  { id: "ai", label: "AI Layer", icon: Cpu },
  { id: "val", label: "Validation", icon: Shield },
  { id: "res", label: "Response", icon: CheckCircle2 },
];

export default function EnterpriseArchitectureExplorer() {
  const { 
    isEnterpriseExplorerOpen: isOpen, 
    closeEnterpriseExplorer: onClose,
    playClickSound,
    openAdrs,
    openFlagships
  } = useSystemCommand();
  const [activeView, setActiveView] = useState(VIEWS[0].id);
  const [selectedNode, setSelectedNode] = useState(null);
  const [flowStep, setFlowStep] = useState(0);
  const modalRef = useRef(null);

  useModal({ isOpen, onClose, ref: modalRef });

  if (!isOpen) return null;

  const handleNodeClick = (nodeId) => {
    playClickSound();
    setSelectedNode(NODE_DETAILS[nodeId]);
  };

  const renderLayerNodes = (layerId) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {ARCHITECTURE_DATA[layerId].map((nodeId) => {
        const node = NODE_DETAILS[nodeId];
        const isSelected = selectedNode?.title === node.title;
        return (
          <button type="button"
            key={nodeId}
            onClick={() => handleNodeClick(nodeId)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all duration-300",
              isSelected
                ? "border-cyan-electric/50 bg-cyan-electric/10 shadow-cyan-glow"
                : "border-obsidian-border bg-obsidian-surface/60 hover:bg-obsidian-surface hover:border-slate-500"
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span className={cn("font-sans text-sm font-bold", isSelected ? "text-cyan-electric" : "text-white")}>
                {node.title}
              </span>
              <Activity size={14} className={isSelected ? "text-cyan-electric" : "text-slate-600"} />
            </div>
            <span className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">
              {node.purpose}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-2 sm:p-4 md:p-8 backdrop-blur-md overflow-hidden"
        onClick={onClose}
        role="presentation"
      >
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="arch-title"
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 22,
            mass: 0.85,
            bounce: 0.22,
          }}
          className="relative flex h-full max-h-[96vh] sm:max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-obsidian-border bg-obsidian-surface/95 shadow-2xl overscroll-contain"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-obsidian-border/60 bg-obsidian/80 p-3 sm:p-4 md:px-6 backdrop-blur-md">
            <div>
              <h2 id="arch-title" className="font-mono text-xs sm:text-sm font-bold tracking-widest text-cyan-electric">ENTERPRISE ARCHITECTURE EXPLORER</h2>
              <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-500">System Design Briefing & Interactive Topology</div>
            </div>
            <button type="button"
              aria-label="Close Explorer"
              onClick={() => { playClickSound(); onClose(); }}
              className="flex relative after:absolute after:content-[''] after:-inset-3 min-h-[32px] min-w-[32px] sm:h-10 sm:w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-obsidian-border hover:text-slate-200 transition-colors duration-200 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex h-full min-h-0 flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="w-full shrink-0 flex flex-row overflow-x-auto md:flex-col md:overflow-y-auto border-b border-obsidian-border/60 bg-obsidian/50 p-2.5 sm:p-4 md:w-64 md:border-b-0 md:border-r md:p-6 gap-1.5 sm:gap-2 no-scrollbar scroll-smooth">
              <div className="mb-2 font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-500 hidden md:block">Architecture Views</div>
              {VIEWS.map((view) => {
                const Icon = view.icon;
                const isActive = activeView === view.id;
                return (
                  <button type="button"
                    key={view.id}
                    onClick={() => {
                      playClickSound();
                      setActiveView(view.id);
                      setSelectedNode(null);
                      setFlowStep(0);
                    }}
                    className={cn(
                      "flex items-center gap-2 sm:gap-3 rounded-lg border p-2 sm:p-3 text-left transition-all duration-300 shrink-0 whitespace-nowrap md:whitespace-normal",
                      isActive
                        ? "border-emerald-glow/50 bg-emerald-glow/10 text-emerald-glow"
                        : "border-transparent text-slate-400 hover:bg-obsidian-surface/60 hover:border-obsidian-border hover:text-slate-200"
                    )}
                  >
                    <Icon size={16} className={isActive ? "text-emerald-glow shrink-0" : "text-slate-500 shrink-0"} />
                    <span className="font-sans font-medium text-slate-400 uppercase tracking-wider">
                      {view.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col">
              
              {/* Dynamic View Content */}
              <div className="flex-1">
                {activeView === "overview" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                    <h2 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">System Overview</h2>
                    <p className="text-slate-400 mb-8 max-w-3xl">A high-level architectural diagram illustrating the component relationships and data flow within the enterprise environment. Select specific layers from the sidebar for granular engineering breakdowns.</p>
                    
                    <div className="flex-1 flex items-center justify-center p-8 border border-obsidian-border/60 rounded-xl bg-obsidian/30 relative overflow-hidden">
                      {/* Stylized overview map */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl relative z-10">
                         <div className="flex flex-col gap-4">
                           <div className="h-32 border border-cyan-electric/30 bg-cyan-electric/5 rounded-lg flex items-center justify-center flex-col gap-2 shadow-[0_0_15px_rgba(0,255,255,0.05)]">
                              <Code size={24} className="text-cyan-electric" />
                              <span className="font-sans text-xs font-bold text-cyan-electric">FRONTEND LAYER</span>
                           </div>
                         </div>
                         <div className="flex flex-col gap-4">
                           <div className="h-32 border border-emerald-glow/30 bg-emerald-glow/5 rounded-lg flex items-center justify-center flex-col gap-2 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                              <Server size={24} className="text-emerald-glow" />
                              <span className="font-sans text-xs font-bold text-emerald-glow">BACKEND / API LAYER</span>
                           </div>
                           <div className="h-32 border border-purple-400/30 bg-purple-400/5 rounded-lg flex items-center justify-center flex-col gap-2 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
                              <Cpu size={24} className="text-purple-400" />
                              <span className="font-sans text-xs font-bold text-purple-400">AI ORCHESTRATION</span>
                           </div>
                         </div>
                         <div className="flex flex-col gap-4">
                           <div className="h-68 border border-slate-500/30 bg-slate-500/5 rounded-lg flex items-center justify-center flex-col gap-2">
                              <Cloud size={24} className="text-slate-400" />
                              <span className="font-sans text-xs font-bold text-slate-400">INFRASTRUCTURE</span>
                           </div>
                         </div>
                      </div>
                      
                      {/* Connecting lines background */}
                      <div className="absolute inset-0 pointer-events-none opacity-20">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-700"/>
                          </pattern>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                )}

                {(["frontend", "backend", "ai", "infrastructure"].includes(activeView)) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full gap-8">
                    <div>
                      <h2 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 capitalize">{activeView} Layer</h2>
                      <p className="text-slate-400 font-sans text-xs">SELECT A NODE BELOW TO VIEW ENGINEERING DECISIONS</p>
                    </div>
                    
                    {renderLayerNodes(activeView)}

                    {/* Detail Panel */}
                    <AnimatePresence mode="wait">
                      {selectedNode ? (
                        <motion.div
                          key={selectedNode.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-auto  pt-6"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-obsidian/40 border border-obsidian-border rounded-xl p-6 relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-electric/5 rounded-full blur-3xl pointer-events-none" />
                            
                            <div className="md:col-span-1 space-y-4 relative z-10">
                              <div>
                                <h3 className="font-sans text-xl font-bold text-white">{selectedNode.title}</h3>
                                <div className="mt-1 font-sans font-medium text-slate-400 uppercase tracking-wider text-cyan-electric">{selectedNode.purpose}</div>
                              </div>
                              
                              {selectedNode.dependencies && (
                                <div>
                                  <h4 className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-500 mb-2">Connected Nodes</h4>
                                  <div className="flex flex-wrap gap-1.5">
                                    {selectedNode.dependencies.map(dep => (
                                      <span key={dep} className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-300 bg-obsidian-surface border border-obsidian-border px-2 py-0.5 rounded flex items-center gap-1">
                                        <GitBranch size={10} className="text-slate-500" /> {NODE_DETAILS[dep]?.title || dep}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {selectedNode.artifact && (
                                <button type="button"
                                  onClick={() => {
                                    playClickSound();
                                    const { action } = selectedNode.artifact;
                                    if (action === "openAdrs") openAdrs();
                                    if (action === "openFlagships") openFlagships();
                                    onClose(); 
                                  }}
                                  className="w-full mt-2 py-2 px-3 rounded border border-cyan-electric/50 bg-cyan-electric/10 hover:bg-cyan-electric/20 text-cyan-electric font-sans font-medium text-slate-400 uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                                >
                                  {selectedNode.artifact.label} <ArrowRight size={12} />
                                </button>
                              )}
                            </div>
                            
                            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                              <div>
                                <h4 className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-500 mb-1">Responsibilities</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">{selectedNode.resp}</p>
                              </div>
                              <div>
                                <h4 className="font-sans font-medium text-slate-400 uppercase tracking-wider text-emerald-glow mb-1">Design Decision</h4>
                                <p className="text-sm text-slate-300 leading-relaxed">{selectedNode.decision}</p>
                              </div>
                              <div className="sm:col-span-2  pt-4">
                                <h4 className="font-sans font-medium text-slate-400 uppercase tracking-wider text-purple-400 mb-1">Future Extensions</h4>
                                <p className="text-sm text-slate-400 italic">{selectedNode.future}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-auto  pt-6"
                        >
                          <div className="flex items-center justify-center h-32 border border-dashed border-obsidian-border rounded-xl bg-obsidian/20">
                            <span className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-600">Awaiting Node Selection...</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {activeView === "flow" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                    <h2 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">System Flows</h2>
                    <p className="text-slate-400 mb-8 max-w-3xl">Interactive visualization of a standard AI inference request propagating through the enterprise architecture.</p>
                    
                    <div className="flex-1 flex flex-col justify-center gap-12 p-8 border border-obsidian-border/60 rounded-xl bg-obsidian/30 relative">
                      {/* Progress Track */}
                      <div className="absolute top-1/2 left-16 right-16 h-0.5 bg-obsidian-border -translate-y-1/2 z-0 hidden md:block" />
                      
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 z-10 relative">
                        {SYSTEM_FLOW.map((step, idx) => {
                          const Icon = step.icon;
                          const isPast = flowStep > idx;
                          const isCurrent = flowStep === idx;
                          
                          return (
                            <div key={step.id} className="flex flex-col items-center gap-3 relative">
                              <motion.button
                                aria-label={`Step ${idx + 1}`}
                                onClick={() => { playClickSound(); setFlowStep(idx); }}
                                className={cn(
                                  "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500",
                                  isPast ? "bg-emerald-glow/20 border border-emerald-glow text-emerald-glow" :
                                  isCurrent ? "bg-cyan-electric/20 border-2 border-cyan-electric text-cyan-electric shadow-[0_0_20px_rgba(0,255,255,0.3)] scale-110" :
                                  "bg-obsidian border border-slate-700 text-slate-600"
                                )}
                              >
                                <Icon size={20} />
                              </motion.button>
                              <span className={cn(
                                "font-sans text-xs uppercase tracking-wider text-center absolute -bottom-8 w-24 left-1/2 -translate-x-1/2",
                                isCurrent ? "text-cyan-electric font-bold" : isPast ? "text-slate-300" : "text-slate-600"
                              )}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Controls */}
                      <div className="mt-16 flex justify-center gap-4 relative z-10">
                        <button type="button"
                          onClick={() => { playClickSound(); setFlowStep((prev) => (prev > 0 ? prev - 1 : prev)); }}
                          disabled={flowStep === 0}
                          className="px-6 py-2 rounded border border-obsidian-border font-mono text-xs text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                        >
                          PREVIOUS
                        </button>
                        <button type="button"
                          onClick={() => { 
                            playClickSound(); 
                            if (flowStep < SYSTEM_FLOW.length - 1) setFlowStep(prev => prev + 1);
                            else setFlowStep(0);
                          }}
                          className="px-6 py-2 rounded border border-cyan-electric/50 bg-cyan-electric/10 font-sans text-xs text-cyan-electric hover:bg-cyan-electric/20 transition-colors duration-200 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                        >
                          {flowStep === SYSTEM_FLOW.length - 1 ? "RESTART FLOW" : "NEXT STEP"} <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
