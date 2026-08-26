import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, Code2, Mail, CheckCircle2, Globe } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSystemCommand } from "../context/SystemCommandContext";
import { useModal } from "../hooks/useModal";
import { overlayFade, modalReveal } from "../lib/motion";

const cn = (...inputs) => twMerge(clsx(inputs));

export default function ResumeModal() {
  const { isResumeOpen, closeResume, playClickSound, openContact } = useSystemCommand();
  const modalRef = useRef(null);

  useModal({ isOpen: isResumeOpen, onClose: closeResume, ref: modalRef });

  if (!isResumeOpen) return null;

  return (
    <AnimatePresence>
        <motion.div
          {...overlayFade}
          className="pointer-events-auto fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-2 sm:p-4 md:p-6 backdrop-blur-sm overflow-hidden"
          onClick={closeResume}
          role="presentation"
        >
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-title"
          onClick={(e) => e.stopPropagation()}
          initial={modalReveal.initial}
          animate={modalReveal.animate}
          exit={modalReveal.exit}
          transition={modalReveal.transition}
          className="relative flex h-full max-h-[96vh] sm:max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl overscroll-contain"
        >
          {/* Clean Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4">
            <h2 id="resume-title" className="font-sans text-xl font-bold text-white tracking-tight">
              Standard View <span className="text-slate-500 font-normal ml-2">| Professional Profile</span>
            </h2>
            <button type="button"
              onClick={() => { playClickSound(); closeResume(); }}
              aria-label="Close Standard View"
              className="flex relative after:absolute after:content-[''] after:-inset-3 min-h-[32px] min-w-[32px] sm:h-10 sm:w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors duration-200 focus:ring-2 focus:ring-cyan-electric focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-slate-900">
            <div className="mx-auto max-w-3xl space-y-12">
              
              {/* Header Section */}
              <header className="space-y-4">
                <div>
                  <h1 className="text-4xl font-extrabold text-slate-200 tracking-tight">Titash Dev</h1>
                  <p className="text-lg text-cyan-400 font-medium mt-1">Systems Architect</p>
                </div>
                <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
                  Specializing in architecture for autonomous operations, clinical platforms, and high-performance React/WebGL interfaces. This portfolio documents that work as case studies and models.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-2">
                  <a href="https://github.com/titashdev-ops" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors duration-200 focus:ring-2 focus:ring-cyan-electric p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]">
                    <Globe size={16} /> GitHub
                  </a>
                  <a href="https://www.linkedin.com/in/titashdeb" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors duration-200 focus:ring-2 focus:ring-cyan-electric p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]">
                    <Globe size={16} /> LinkedIn
                  </a>
                  <button type="button" 
                    onClick={() => { closeResume(); openContact(); }}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors duration-200 focus:ring-2 focus:ring-cyan-electric p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                  >
                    <Mail size={16} /> Contact
                  </button>
                </div>
              </header>

              {/* Core Skills */}
              <section aria-labelledby="skills-heading">
                <h3 id="skills-heading" className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-2 mb-4 flex items-center gap-2">
                  <Code2 size={16} /> Core Competencies
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 mb-2">Frontend & UI</h4>
                    <ul className="text-sm text-slate-400 space-y-1">
                      <li>React 18 / Next.js</li>
                      <li>TypeScript</li>
                      <li>Three.js / WebGL</li>
                      <li>Tailwind CSS</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 mb-2">Backend & Edge</h4>
                    <ul className="text-sm text-slate-400 space-y-1">
                      <li>Node.js / Express</li>
                      <li>Serverless Functions</li>
                      <li>PostgreSQL / Redis</li>
                      <li>GraphQL / REST</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 mb-2">Architecture & AI</h4>
                    <ul className="text-sm text-slate-400 space-y-1">
                      <li>System Design</li>
                      <li>Event-Driven Microservices</li>
                      <li>LLM Orchestration (LangChain)</li>
                      <li>Vector Embeddings</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Experience */}
              <section aria-labelledby="experience-heading">
                <h3 id="experience-heading" className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-2 mb-6 flex items-center gap-2">
                  <Briefcase size={16} /> Professional Experience
                </h3>
                
                <div className="space-y-8">
                  <article>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                      <h4 className="text-lg font-bold text-white">Principal Engineer <span className="text-slate-500 font-normal">| Stealth Enterprise AI Startup</span></h4>
                      <span className="text-sm font-medium text-cyan-400">2023 - Present</span>
                    </div>
                    <ul className="list-disc list-inside text-sm text-slate-300 space-y-2 leading-relaxed ml-2">
                      <li>Architected an autonomous L1/L2 triage proxy load-tested for high-volume Webhook ingestion from ServiceNow and Salesforce platforms.</li>
                      <li>Streamlined incident triage workflows and reduced MTTR for deterministic resolution paths using Zod schema constraints.</li>
                      <li>Designed a fallback edge architecture using Vercel edge functions to maintain high availability during peak incident traffic spikes.</li>
                    </ul>
                  </article>
                  
                  <article>
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                      <h4 className="text-lg font-bold text-white">Staff Software Engineer <span className="text-slate-500 font-normal">| Global Infrastructure Corp</span></h4>
                      <span className="text-sm font-medium text-cyan-400">2020 - 2023</span>
                    </div>
                    <ul className="list-disc list-inside text-sm text-slate-300 space-y-2 leading-relaxed ml-2">
                      <li>Led the frontend rebuild of the core telemetry dashboard, shifting from legacy imperative D3 to declarative React Three Fiber (WebGL).</li>
                      <li>Optimized WebGL render loops to support high-density geographic node updates at a stable 60fps via Zustand transient state subscriptions.</li>
                      <li>Mentored a team of 8 mid-level engineers, establishing strict ADR (Architecture Decision Record) processes and Zod-based contract testing.</li>
                    </ul>
                  </article>
                </div>
              </section>

              {/* Highlight Projects Reference */}
              <section aria-labelledby="projects-heading" className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                <h3 id="projects-heading" className="text-sm font-bold text-white mb-2">Flagship Implementations</h3>
                <p className="text-sm text-slate-400 mb-4">Detailed case studies and technical evidence available in the main portfolio interface.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-300"><strong>Autonomous Operations Proxy:</strong> Edge-based AI orchestrator for ITSM platforms. <em className="text-slate-500 text-xs">(Implemented)</em></div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Code2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-sm text-slate-300"><strong>Spatial Intelligence Engine:</strong> High-performance WebGL telemetry dashboard. <em className="text-slate-500 text-xs">(Prototype)</em></div>
                  </div>
                </div>
              </section>
            </div>
          </div>
          
          <div className="shrink-0 border-t border-slate-800 bg-slate-900 p-4 sm:px-6 flex justify-end">
             <button type="button"
              onClick={() => { playClickSound(); closeResume(); openContact(); }}
              aria-label="Request a resume by email"
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-cyan-electric focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
             >
               <Mail size={16} /> Request resume by email
             </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
