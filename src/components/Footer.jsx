/* --- FILE: src/components/Footer.jsx --- */
import React from "react";
import { motion } from "framer-motion";
import { Mail, Activity, Terminal, Briefcase } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSystemCommand } from "../context/SystemCommandContext";

const cn = (...inputs) => twMerge(clsx(inputs));

export default function Footer() {
  const { openContact, playClickSound, telemetryString, openStressTester, openAdrs } = useSystemCommand();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      className="pointer-events-auto relative z-50 mt-auto border-t border-cyan-500/30 bg-slate-950/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 md:flex-row md:px-12">
        
        {/* Telemetry Badge */}
        <div className="flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-xs font-semibold tracking-widest text-emerald-400">
            HUD ONLINE // {telemetryString}
          </span>
        </div>

        {/* Social Routing Nodes */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/titashdev-ops"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            onClick={() => playClickSound()}
            className="group rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-400 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
          >
            <Terminal size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/titashdeb"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            onClick={() => playClickSound()}
            className="group rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-400 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
          >
            <Briefcase size={20} />
          </a>
          <a
            href="mailto:titashdev@gmail.com"
            aria-label="Send Email"
            onClick={() => playClickSound()}
            className="group rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-slate-400 transition-all hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
    </motion.footer>
  );
}
