import React from "react";
import { motion } from "framer-motion";
import { useSystemCommand } from "../context/SystemCommandContext";
import ServicesModule from "./ServicesModule";
import {
  Compass,
  Zap,
  Mail,
  Download,
  ArrowRight,
  GitBranch,
  Globe,
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

export default function SaasOperationsModule() {
  const { openContact, openResume, playClickSound } = useSystemCommand();

  return (
    <section className="pointer-events-none relative isolate w-full py-12 sm:py-20">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12 lg:px-16 space-y-12">
        
        {/* Calm Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl space-y-3"
        >
          <h1 className="font-sans text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-200">
            Engagement &{" "}
            <span className="bg-gradient-to-br from-amber-400 via-yellow-300 to-cyan-electric bg-clip-text text-transparent">
              Systems Advisory
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            Structured engineering discovery, actionable architecture audits, and high-impact advisory designed for scale-stage platforms.
          </p>
        </motion.div>

        {/* Core Services Module */}
        <div className="pointer-events-auto space-y-3">
          <div className="flex items-center justify-between border-b border-obsidian-border/60 pb-2">
            <span className="font-sans font-medium text-slate-400 uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Zap size={14} /> SERVICE OFFERINGS & ENGAGEMENT MODELS
            </span>
            <span className="font-sans font-medium text-slate-400 uppercase tracking-wider">
              Fixed-Scope Deliverables
            </span>
          </div>

          <ServicesModule onSelectService={() => openContact()} />
        </div>

        {/* Direct Engineering Contact & Resume Download Section */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 sm:p-8 rounded-2xl bg-slate-950/90 border border-amber-400/30 shadow-xl pointer-events-auto space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-amber-400/15 pb-6">
            <div className="space-y-1 max-w-2xl">
              <span className="font-sans font-medium text-slate-400 uppercase tracking-wider text-amber-400 font-bold">
                DIRECT ENGAGEMENT
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">
                Schedule a Technical Audit or Discovery Session
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                Launch the guided Engineering Discovery Wizard to detail your technical constraints, or open the on-page resume view.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  openContact();
                }}
                className="px-6 py-3 rounded-xl border border-amber-400/80 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-sans text-xs font-bold transition-all duration-200 shadow-lg hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap min-h-[44px] flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
              >
                <Compass size={15} />
                <span>LAUNCH DISCOVERY WIZARD</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  openResume();
                }}
                className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-sans text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[44px] flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
              >
                <Download size={14} className="text-cyan-electric" />
                <span>OPEN RESUME VIEW</span>
              </button>
            </div>
          </div>

          {/* External Profile Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="https://github.com/titashdev-ops"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900 text-slate-300 font-sans text-xs font-bold transition-all duration-200 flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
            >
              <div className="flex items-center gap-2.5">
                <GitBranch size={16} className="text-slate-400 group-hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50" />
                <span>GitHub Verification</span>
              </div>
              <ArrowRight size={14} className="text-slate-500 group-hover:text-amber-400 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50" />
            </a>

            <a
              href="https://www.linkedin.com/in/titashdeb"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900 text-slate-300 font-sans text-xs font-bold transition-all duration-200 flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
            >
              <div className="flex items-center gap-2.5">
                <Globe size={16} className="text-slate-400 group-hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50" />
                <span>LinkedIn Profile</span>
              </div>
              <ArrowRight size={14} className="text-slate-500 group-hover:text-amber-400 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50" />
            </a>

            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 font-sans text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-amber-400" />
                <span>Response Time</span>
              </div>
              <span className="text-emerald-glow text-xs font-bold uppercase">Sub-24h Direct</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

