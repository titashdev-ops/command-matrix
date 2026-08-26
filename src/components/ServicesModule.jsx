import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, ShieldCheck, Cpu, ArrowRight, CheckCircle2, Clock, FileText, 
  Layers, Lock, Activity, Sparkles, HelpCircle, Compass, Scale, Check
} from "lucide-react";
import { SERVICES_LIST } from "./EngineeringDiscoveryWizard";
import { useSystemCommand } from "../context/SystemCommandContext";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

export default function ServicesModule({ onSelectService }) {
  const { openContact, playClickSound } = useSystemCommand();

  const handleServiceClick = (serviceId) => {
    playClickSound();
    if (onSelectService) {
      onSelectService(serviceId);
    } else {
      openContact();
    }
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans my-8">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-xl bg-slate-950/90 border border-cyan-electric/40 shadow-xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-electric/20 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-electric/10 text-cyan-electric border border-cyan-electric/30">
              <Zap size={20} />
            </div>
            <div>
              <div className="font-sans font-medium text-slate-400 uppercase tracking-wider text-cyan-electric font-bold">
                Scope
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Architecture reviews and systems delivery
              </h2>
            </div>
          </div>

          <span className="font-sans text-xs px-3 py-1 rounded-full border border-slate-600/40 bg-slate-800/40 text-slate-300 font-bold">
            Architecture reviews
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-4xl">
          Architecture reviews, risk before capital, and systems work with explicit non-functional constraints. Start a brief from any card.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SERVICES_LIST.map((serv, idx) => (
          <div 
            key={serv.id}
            className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-cyan-electric/50 transition-all duration-200 flex flex-col justify-between space-y-4 group relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
          >
            {/* Background accent glow on hover */}
            <div className="absolute -right-12 -top-12 w-28 h-28 bg-cyan-electric/5 rounded-full blur-2xl group-hover:bg-cyan-electric/15 transition-all duration-200 pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50" />

            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-500 font-bold">
                  0{idx + 1} // OFFERING
                </span>
                <span className="font-sans text-xs px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 font-bold flex items-center gap-1">
                  <Clock size={11} /> {serv.timeframe}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-sans group-hover:text-cyan-electric transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50">
                {serv.title}
              </h3>

              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {serv.tagline}
              </p>

              {/* Measured Outcomes */}
              <div className="pt-2 space-y-1.5 font-sans">
                <span className="font-sans font-medium text-slate-400 uppercase tracking-wider text-emerald-400 font-bold block flex items-center gap-1">
                  <CheckCircle2 size={12} /> Measured Technical Outcomes:
                </span>
                <ul className="space-y-1 text-xs text-slate-300 font-sans text-sm">
                  {serv.outcomes.map((out, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-cyan-electric font-bold">›</span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Primary Deliverable */}
              <div className="pt-2  space-y-1">
                <span className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-500 block">
                  Primary Deliverable
                </span>
                <p className="text-xs text-slate-300 font-sans font-medium">
                  {serv.deliverable}
                </p>
              </div>
            </div>

            {/* Direct CTA Button */}
            <div className="pt-3 ">
              <button
                type="button"
                onClick={() => handleServiceClick(serv.id)}
                className="w-full py-2.5 px-3 rounded-lg border border-cyan-electric/40 bg-cyan-electric/10 hover:bg-cyan-electric/20 text-cyan-electric font-sans text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-cyan-glow cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
              >
                <span>Request {serv.title}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
