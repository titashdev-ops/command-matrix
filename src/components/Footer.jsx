import React from "react";
import { motion } from "framer-motion";
import { Mail, Terminal, Briefcase, FileText } from "lucide-react";
import { useSystemCommand } from "../context/SystemCommandContext";

export default function Footer() {
  const { playClickSound, openResume, openContact } = useSystemCommand();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-auto relative z-50 mt-auto border-t border-cyan-electric/20 bg-slate-950/80 backdrop-blur-2xl shadow-[0_-1px_24px_rgba(0,240,255,0.08)]"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between md:px-12">
        <div className="space-y-1 text-center md:text-left">
          <div className="font-mono text-xs font-semibold tracking-[0.2em] text-slate-200">
            COMMAND MATRIX
          </div>
          <p className="font-sans text-sm text-slate-400">
            Titash Dev · Systems Architect. For case studies or architecture reviews.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <a
            href="https://github.com/titashdev-ops"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playClickSound()}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-electric/40 hover:text-cyan-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
          >
            <Terminal size={14} />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/titashdeb"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playClickSound()}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-electric/40 hover:text-cyan-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
          >
            <Briefcase size={14} />
            LinkedIn
          </a>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              openResume();
            }}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-electric/40 hover:text-cyan-electric focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
          >
            <FileText size={14} />
            Resume
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              openContact();
            }}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-cyan-electric/40 bg-cyan-electric/10 px-3 py-2 text-xs font-medium text-cyan-electric transition-colors hover:bg-cyan-electric/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
          >
            <Mail size={14} />
            Contact
          </button>
        </div>
      </div>
    </motion.footer>
  );
}
