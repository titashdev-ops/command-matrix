import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Mail, Terminal, ChevronRight, Check, Building2, ShieldCheck, 
  Zap, Sparkles, MessageSquare, ExternalLink, Copy, Cpu, Activity,
  Users, ArrowRight, CheckCircle2, AlertTriangle, Layers, Lock, Download,
  FileText, HelpCircle, ArrowLeft, RefreshCw, Compass, Shield
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSystemCommand } from "../context/SystemCommandContext";
import { useModal } from "../hooks/useModal";

const cn = (...inputs) => twMerge(clsx(inputs));

export const SERVICES_LIST = [
  {
    id: "arch-review-diligence",
    title: "Architecture Review & Due Diligence",
    tagline: "Rigorous technical audit of codebase health, scaling limits, and bottlenecks.",
    outcomes: ["Sub-100ms P99 latency target", "Scaling ceiling analysis", "Security & HIPAA readiness"],
    deliverable: "Executive Technical Audit Report + Code-level Remediation Map",
    timeframe: "1-2 Weeks"
  },
  {
    id: "systems-design-prototyping",
    title: "Systems Design & Prototyping",
    tagline: "Architect and validate distributed event streams and high-frequency byte proxies.",
    outcomes: ["Zero premature infrastructure lock-in", "Sub-2ms ingestion jitter", "100% immutable append-only logs"],
    deliverable: "Production-ready Infrastructure Blueprint + Interactive Prototype",
    timeframe: "2-3 Weeks"
  },
  {
    id: "ai-sprint",
    title: "AI Strategy & Integration",
    tagline: "Evaluate on-device vs cloud LLMs, vector-graph hybrid DBs, and schema validation.",
    outcomes: ["Zero LLM hallucination guarantees", "Air-gapped private search option", "99.8% structural extraction accuracy"],
    deliverable: "Working AI Pipeline Prototype + Benchmarking Analysis",
    timeframe: "1 Week"
  },
  {
    id: "workflow-assessment",
    title: "Operational Workflow Optimization",
    tagline: "Optimize multi-system integrations across enterprise and custom APIs.",
    outcomes: ["99.99% service availability SLA", "Sub-24h incident resolution times", "Automated ticket routing"],
    deliverable: "Enterprise Data Routing Topology + Incident Automation Pipeline",
    timeframe: "1-2 Weeks"
  }
];

export const TECHNICAL_PROBLEMS = [
  {
    id: "concurrency",
    title: "High-Concurrency Telemetry Streaming",
    desc: "Ingesting 50k+ events/sec over cellular links with low jitter and zero packet loss.",
    domain: "Distributed Systems",
    typicalRisks: ["Head-of-line TCP blocking", "DOM frame stutter", "Write lock contention"],
    suggestedService: "systems-design-prototyping"
  },
  {
    id: "compliance",
    title: "Security & Immutable Audit Trails",
    desc: "Zero-tamper audit trails, field encryption, and compliance readiness.",
    domain: "Healthcare & Fintech",
    typicalRisks: ["PHI data exposure", "Data loss during partition", "Weak auth posture"],
    suggestedService: "arch-review-diligence"
  },
  {
    id: "ai-rag",
    title: "AI Knowledge Engines & Deterministic Output",
    desc: "Extracting structured knowledge from raw documents without hallucination.",
    domain: "AI/ML Integrations",
    typicalRisks: ["LLM schema drift", "Missing relational hierarchy", "Cloud API privacy leaks"],
    suggestedService: "ai-sprint"
  },
  {
    id: "scale",
    title: "System Feasibility & Scale Limits",
    desc: "Validating market feasibility and codebase health before investing capital.",
    domain: "Stealth & Scaling Startups",
    typicalRisks: ["Premature cloud lock-in", "Hidden technical debt", "Unvalidated API limits"],
    suggestedService: "arch-review-diligence"
  }
];

export default function EngineeringDiscoveryWizard({ preselectedServiceId, preselectedProblemId }) {
  const { isContactOpen, closeContact, dispatchPayload, playClickSound } = useSystemCommand();
  const [step, setStep] = useState(() => {
    if (typeof window === "undefined") return 1;
    const saved = sessionStorage.getItem("wizard_step");
    return saved ? parseInt(saved, 10) : 1;
  }); // 1: Problem Selection | 2: Context & Contact | 3: Summary
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [wizardState, setWizardState] = useState(() => {
    if (typeof window === "undefined") {
      return {
        problemId: preselectedProblemId || TECHNICAL_PROBLEMS[0].id,
        serviceId: preselectedServiceId || TECHNICAL_PROBLEMS[0].suggestedService,
        currentArch: "",
        targetScale: "",
        primaryConstraint: "",
        integrations: "",
        name: "",
        email: "",
      };
    }
    const saved = sessionStorage.getItem("wizard_state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Override with preselected if provided, else use saved
        return {
          ...parsed,
          problemId: preselectedProblemId || parsed.problemId,
          serviceId: preselectedServiceId || parsed.serviceId
        };
      } catch (e) {
        // ignore JSON parse error
      }
    }
    return {
      problemId: preselectedProblemId || TECHNICAL_PROBLEMS[0].id,
      serviceId: preselectedServiceId || TECHNICAL_PROBLEMS[0].suggestedService,
      currentArch: "",
      targetScale: "",
      primaryConstraint: "",
      integrations: "",
      name: "",
      email: ""
    };
  });

  const modalRef = useRef(null);
  useModal({ isOpen: isContactOpen, onClose: closeContact, ref: modalRef });

  useEffect(() => {
    sessionStorage.setItem("wizard_step", step.toString());
  }, [step]);

  useEffect(() => {
    sessionStorage.setItem("wizard_state", JSON.stringify(wizardState));
  }, [wizardState]);

  useEffect(() => {
    if (preselectedServiceId) {
      const match = SERVICES_LIST.find(s => s.id === preselectedServiceId);
      if (match) setWizardState(prev => ({ ...prev, serviceId: match.id }));
    }
  }, [preselectedServiceId]);

  useEffect(() => {
    if (preselectedProblemId) {
      const match = TECHNICAL_PROBLEMS.find(p => p.id === preselectedProblemId);
      if (match) setWizardState(prev => ({ ...prev, problemId: match.id, serviceId: match.suggestedService }));
    }
  }, [preselectedProblemId]);

  const [errorMsg, setErrorMsg] = useState("");

  if (!isContactOpen) return null;

  const currentProblem = TECHNICAL_PROBLEMS.find(p => p.id === wizardState.problemId) || TECHNICAL_PROBLEMS[0];
  const currentService = SERVICES_LIST.find(s => s.id === wizardState.serviceId) || SERVICES_LIST[0];

  const sanitizeInput = (input, maxLength = 200) => {
    if (typeof input !== "string") return "";
    return input.replace(/<[^>]*>?/gm, "").replace(/javascript:/gi, "").slice(0, maxLength);
  };

  const validateEmail = (emailStr) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(emailStr.trim());
  };

  const handleNext = () => {
    setErrorMsg("");
    if (step === 2) {
      if (!wizardState.name.trim()) {
        setErrorMsg("Please provide your name to continue.");
        return;
      }
      if (!validateEmail(wizardState.email)) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
    }
    playClickSound();
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    playClickSound();
    setStep(prev => Math.max(prev - 1, 1));
  };

  const generateSummaryText = () => {
    return `=== ENGINEERING DISCOVERY BRIEF ===
Target problem: ${currentProblem.title}
Domain: ${currentProblem.domain}
Requested service: ${currentService.title} (${currentService.timeframe})

CONTEXT
- Current architecture: ${wizardState.currentArch || "n/a"}
- Target scale: ${wizardState.targetScale || "n/a"}
- Primary constraint: ${wizardState.primaryConstraint || "n/a"}
- Integrations: ${wizardState.integrations || "n/a"}

RISKS
- ${currentProblem.typicalRisks.join("\n- ")}

PROPOSED OUTCOMES
- ${currentService.outcomes.join("\n- ")}

Deliverable: ${currentService.deliverable}
Contact: ${wizardState.name || "n/a"} <${wizardState.email || "n/a"}>
=========================================`;
  };

  const handleCopySummary = () => {
    playClickSound();
    navigator.clipboard.writeText(generateSummaryText());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const lastSubmit = sessionStorage.getItem("last_brief_submit");
    const now = Date.now();
    if (lastSubmit && now - parseInt(lastSubmit, 10) < 15000) {
      alert("Submission received. Please wait a few moments before submitting another brief.");
      return;
    }
    sessionStorage.setItem("last_brief_submit", now.toString());

    const sanitizedData = {
      name: sanitizeInput(wizardState.name, 100),
      email: sanitizeInput(wizardState.email, 150),
      currentArch: sanitizeInput(wizardState.currentArch, 150),
      targetScale: sanitizeInput(wizardState.targetScale, 150),
      primaryConstraint: sanitizeInput(wizardState.primaryConstraint, 200),
      integrations: sanitizeInput(wizardState.integrations, 150),
    };

    dispatchPayload({
      name: sanitizedData.name,
      contact: sanitizedData.email,
      email: sanitizedData.email,
      inquiryType: `${currentService.title} / ${currentProblem.title}`,
      service: currentService.title,
      problem: currentProblem.title,
      summary: generateSummaryText(),
      data: sanitizedData,
    });
    sessionStorage.removeItem("wizard_state");
    sessionStorage.removeItem("wizard_step");
    setWizardState({
      problemId: preselectedProblemId || TECHNICAL_PROBLEMS[0].id,
      serviceId: preselectedServiceId || TECHNICAL_PROBLEMS[0].suggestedService,
      name: "",
      email: "",
      org: "",
      primaryConstraint: "",
      notes: ""
    });
    setStep(1);
    closeContact();
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto"
        onClick={closeContact}
        role="presentation" // outer div
      >
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="wizard-title"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-xl border border-cyan-electric/50 bg-slate-950/95 shadow-cyan-glow backdrop-blur-2xl custom-scrollbar flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-obsidian-border bg-slate-900/90 px-5 py-4 rounded-t-xl sticky top-0 z-20 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-electric/10 text-cyan-electric border border-cyan-electric/30">
                <Compass size={18} />
              </div>
              <div>
                <div id="wizard-title" className="font-mono text-xs sm:text-sm font-bold tracking-wider text-white flex items-center gap-2">
                  ENGINEERING DISCOVERY WIZARD
                  <span className="text-xs px-2 py-0.5 rounded border border-amber-400/40 bg-amber-400/10 text-amber-300 font-normal hidden sm:inline-block">
                    Guided Intake
                  </span>
                </div>
                <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">
                  Step {step} of 3: {step === 1 ? "Problem & Domain" : step === 2 ? "Context & Contact" : "Opportunity Summary"}
                </div>
              </div>
            </div>

            <button type="button" aria-label="Close" 
              onClick={closeContact}
              className="rounded-lg p-2 relative after:absolute after:content-[''] after:-inset-3 min-h-[32px] min-w-[32px] sm:min-h-[auto] sm:min-w-[auto] flex items-center justify-center text-slate-400 transition-colors duration-200 hover:bg-obsidian-border hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
            >
              <X size={18} />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-slate-900 h-1 relative shrink-0">
            <div 
              className="bg-gradient-to-r from-cyan-electric via-emerald-glow to-amber-400 h-1 transition-all duration-200" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Wizard Content */}
          <div className="p-5 sm:p-6 flex-1 space-y-6">

            {/* STEP 1: Select Problem */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                    <AlertTriangle size={16} className="text-amber-400" /> What technical problem are you looking to solve?
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-sans">
                    Select the statement that best aligns with your team's current engineering objectives.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {TECHNICAL_PROBLEMS.map((prob) => {
                    const isSelected = wizardState.problemId === prob.id;
                    return (
                      <button
                        key={prob.id}
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setWizardState(prev => ({ 
                            ...prev, 
                            problemId: prob.id, 
                            serviceId: prob.suggestedService 
                          }));
                        }}
                        className={cn(
                          "p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5",
                          isSelected 
                            ? "border-cyan-electric bg-cyan-electric/10 shadow-cyan-glow" 
                            : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-xs font-bold text-white flex items-center gap-2">
                            {isSelected ? <CheckCircle2 size={14} className="text-cyan-electric" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                            {prob.title}
                          </span>
                          <span className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                            {prob.domain}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-sans pl-5">{prob.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Architectural Context */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                    <Building2 size={16} className="text-amber-400" /> Architectural Context
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-sans">
                    Define the system boundaries, scale requirements, and constraints.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="currentArch" className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">Current Architecture State</label>
                    <input
                      id="currentArch"
                      type="text"
                      maxLength={150}
                      value={wizardState.currentArch}
                      onChange={(e) => setWizardState(prev => ({ ...prev, currentArch: sanitizeInput(e.target.value, 150) }))}
                      className="w-full rounded-md border border-slate-800 bg-slate-900 p-2.5 font-sans text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-electric focus:outline-none"
                      placeholder="e.g. Monolith, Event-Driven Microservices"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="targetScale" className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">Target Scale / Throughput</label>
                    <input
                      id="targetScale"
                      type="text"
                      maxLength={150}
                      value={wizardState.targetScale}
                      onChange={(e) => setWizardState(prev => ({ ...prev, targetScale: sanitizeInput(e.target.value, 150) }))}
                      className="w-full rounded-md border border-slate-800 bg-slate-900 p-2.5 font-sans text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-electric focus:outline-none"
                      placeholder="e.g. 50k RPS, 100M rows/day"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="primaryConstraint" className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">
                    Primary Operational Constraint
                  </label>
                  <input
                    id="primaryConstraint"
                    type="text"
                    maxLength={200}
                    value={wizardState.primaryConstraint}
                    onChange={(e) => setWizardState(prev => ({ ...prev, primaryConstraint: sanitizeInput(e.target.value, 200) }))}
                    className="w-full rounded-md border border-slate-800 bg-slate-900 p-2.5 font-sans text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-electric focus:outline-none"
                    placeholder="e.g. Sub-50ms P99 Latency, Strict HIPAA Isolation"
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="integrations" className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">Core Integrations / Dependencies</label>
                  <input
                    id="integrations"
                    type="text"
                    maxLength={150}
                    value={wizardState.integrations}
                    onChange={(e) => setWizardState(prev => ({ ...prev, integrations: sanitizeInput(e.target.value, 150) }))}
                    className="w-full rounded-md border border-slate-800 bg-slate-900 p-2.5 font-sans text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-electric focus:outline-none"
                    placeholder="e.g. Kafka, Postgres, legacy mainframe"
                  />
                </div>

                <div className="pt-2  grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="wizName" className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">Lead Engineer Name *</label>
                    <input
                      id="wizName"
                      required aria-required="true"
                      type="text"
                      maxLength={100}
                      value={wizardState.name}
                      onChange={(e) => setWizardState(prev => ({ ...prev, name: sanitizeInput(e.target.value, 100) }))}
                      className="w-full rounded-md border border-slate-800 bg-slate-900 p-2.5 font-sans text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-electric focus:outline-none"
                      placeholder="e.g. Alex Rivera"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="wizEmail" className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-400">Direct Email *</label>
                    <input
                      id="wizEmail"
                      required aria-required="true"
                      type="email"
                      maxLength={150}
                      value={wizardState.email}
                      onChange={(e) => setWizardState(prev => ({ ...prev, email: sanitizeInput(e.target.value, 150) }))}
                      className="w-full rounded-md border border-slate-800 bg-slate-900 p-2.5 font-sans text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-electric focus:outline-none"
                      placeholder="alex@company.com"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-sans flex items-center gap-2" role="alert">
                    <AlertTriangle size={14} />
                    {errorMsg}
                  </div>
                )}
              </motion.div>
            )}
            {/* STEP 3: Engineering Opportunity Summary */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-400/40 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-400/20 pb-3">
                    <div className="flex items-center gap-2">
                      <FileText size={18} className="text-amber-400" />
                      <div>
                        <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-amber-400 font-bold">
                          GENERATED ASSESSMENT SUMMARY
                        </div>
                        <h4 className="text-sm font-bold text-white font-sans">
                          {currentProblem.title}
                        </h4>
                      </div>
                    </div>
                    <span className="font-sans text-xs px-2.5 py-1 rounded bg-amber-400/10 text-amber-300 border border-amber-400/30 font-bold">
                      {currentService.timeframe} ENGAGEMENT
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-sans text-slate-300">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <span className="font-sans text-xs text-cyan-electric font-bold uppercase block">
                        1. Problem Understanding
                      </span>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        {currentProblem.desc}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <span className="font-sans text-xs text-rose-400 font-bold uppercase block">
                        2. Identified System Risks
                      </span>
                      <ul className="space-y-1 text-slate-300 text-sm list-disc pl-3">
                        {currentProblem.typicalRisks.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <span className="font-sans text-xs text-emerald-400 font-bold uppercase block">
                        3. Core Engineering Opportunities
                      </span>
                      <ul className="space-y-1 text-slate-300 text-sm list-disc pl-3">
                        {currentService.outcomes.map((o, i) => (
                          <li key={i}>{o}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <span className="font-sans text-xs text-violet-400 font-bold uppercase block">
                        4. AI & Architectural Opportunities
                      </span>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        Deploy deterministic schema-constrained parsing, automated observability, and zero-hallucination agentic safeguards.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-400/10 border border-amber-400/30 font-sans space-y-1">
                    <span className="font-sans text-xs text-amber-300 font-bold uppercase block flex items-center gap-1">
                      <CheckCircle2 size={12} /> 5. Suggested Next Step & Deliverable
                    </span>
                    <p className="text-slate-300 text-xs">
                      <strong>Recommended Offering:</strong> {currentService.title}.<br />
                      <strong>Primary Deliverable:</strong> {currentService.deliverable}.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

          </div>

          {/* Footer Controls */}
          <div className="p-4 sm:p-5 border-t border-obsidian-border bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 rounded-b-xl shrink-0">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 font-sans text-xs font-bold hover:bg-slate-700 transition-colors duration-200 flex items-center gap-1.5 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
              >
                <ArrowLeft size={14} /> Back
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-lg border border-cyan-electric/50 bg-cyan-electric/20 text-cyan-electric font-sans text-xs font-bold hover:bg-cyan-electric/30 transition-all duration-200 flex items-center gap-2 shadow-cyan-glow min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
                >
                  Continue to {step === 1 ? "Context" : "Summary"} <ChevronRight size={16} />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 font-sans text-xs font-bold hover:bg-slate-700 transition-colors duration-200 flex items-center gap-1.5 min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
                  >
                    {copiedSummary ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {copiedSummary ? "Copied Brief!" : "Copy Summary"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-5 py-2.5 rounded-lg border border-amber-400/60 bg-amber-400/20 text-amber-300 font-sans text-xs font-bold hover:bg-amber-400/30 transition-all duration-200 flex items-center gap-2 shadow-lg min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
                  >
                    <Mail size={15} /> SUBMIT DISCOVERY BRIEF
                  </button>
                </div>
              )}
            </div>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
