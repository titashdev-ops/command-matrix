import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Briefcase, FileText, Activity, Server, Layout, 
  Workflow, CheckCircle2, ChevronRight, Zap, Target,
  Link as LinkIcon, ShieldCheck, ArrowLeft, ArrowUpRight,
  Database, Code, Terminal, Boxes, PlayCircle, Eye, Cpu, Clock, AlertTriangle, Network
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSystemCommand } from "../context/SystemCommandContext";
import { useModal } from "../hooks/useModal";
import { useRef } from "react";
import { CASE_STUDIES } from "../data/missions";
import EngineeringReviewPanel from "./EngineeringReviewPanel";
import InvestigationFlow from "./InvestigationFlow";
import BriefCover, { briefFromMission } from "./BriefCover";
import { modalReveal, overlayFade } from "../lib/motion";

const cn = (...inputs) => twMerge(clsx(inputs));

const PROJECT_ACCENTS = {
  "ops-dronly": {
    text: "text-cyan-electric",
    border: "border-cyan-electric",
    bg: "bg-cyan-electric/10",
    shadow: "shadow-[0_0_15px_rgba(6,182,212,0.15)]",
    glow: "shadow-[0_0_10px_rgba(6,182,212,0.8)]",
    from: "from-cyan-electric/50",
    fill: "fill-cyan-electric/20",
    activeText: "text-cyan-electric",
    hoverBorder: "hover:border-cyan-electric/30",
    hoverText: "hover:text-cyan-electric",
    focusRing: "focus:ring-cyan-electric",
    boxShadow: "shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]",
    bgMuted: "bg-cyan-electric/5"
  },
  "prodent-os": {
    text: "text-violet-400",
    border: "border-violet-400",
    bg: "bg-violet-400/10",
    shadow: "shadow-[0_0_15px_rgba(167,139,250,0.15)]",
    glow: "shadow-[0_0_10px_rgba(167,139,250,0.8)]",
    from: "from-violet-400/50",
    fill: "fill-violet-400/20",
    activeText: "text-violet-400",
    hoverBorder: "hover:border-violet-400/30",
    hoverText: "hover:text-violet-400",
    focusRing: "focus:ring-violet-400",
    boxShadow: "shadow-[inset_0_0_20px_rgba(167,139,250,0.05)]",
    bgMuted: "bg-violet-400/5"
  },
  "sports-physio": {
    text: "text-amber-400",
    border: "border-amber-400",
    bg: "bg-amber-400/10",
    shadow: "shadow-[0_0_15px_rgba(251,191,36,0.15)]",
    glow: "shadow-[0_0_10px_rgba(251,191,36,0.8)]",
    from: "from-amber-400/50",
    fill: "fill-amber-400/20",
    activeText: "text-amber-400",
    hoverBorder: "hover:border-amber-400/30",
    hoverText: "hover:text-amber-400",
    focusRing: "focus:ring-amber-400",
    boxShadow: "shadow-[inset_0_0_20px_rgba(251,191,36,0.05)]",
    bgMuted: "bg-amber-400/5"
  },
  "career-os": {
    text: "text-emerald-400",
    border: "border-emerald-400",
    bg: "bg-emerald-400/10",
    shadow: "shadow-[0_0_15px_rgba(52,211,153,0.15)]",
    glow: "shadow-[0_0_10px_rgba(52,211,153,0.8)]",
    from: "from-emerald-400/50",
    fill: "fill-emerald-400/20",
    activeText: "text-emerald-400",
    hoverBorder: "hover:border-emerald-400/30",
    hoverText: "hover:text-emerald-400",
    focusRing: "focus:ring-emerald-400",
    boxShadow: "shadow-[inset_0_0_20px_rgba(52,211,153,0.05)]",
    bgMuted: "bg-emerald-400/5"
  },
  "personal-os": {
    text: "text-rose-400",
    border: "border-rose-400",
    bg: "bg-rose-400/10",
    shadow: "shadow-[0_0_15px_rgba(251,113,133,0.15)]",
    glow: "shadow-[0_0_10px_rgba(251,113,133,0.8)]",
    from: "from-rose-400/50",
    fill: "fill-rose-400/20",
    activeText: "text-rose-400",
    hoverBorder: "hover:border-rose-400/30",
    hoverText: "hover:text-rose-400",
    focusRing: "focus:ring-rose-400",
    boxShadow: "shadow-[inset_0_0_20px_rgba(251,113,133,0.05)]",
    bgMuted: "bg-rose-400/5"
  },
  "client-discovery": {
    text: "text-blue-400",
    border: "border-blue-400",
    bg: "bg-blue-400/10",
    shadow: "shadow-[0_0_15px_rgba(96,165,250,0.15)]",
    glow: "shadow-[0_0_10px_rgba(96,165,250,0.8)]",
    from: "from-blue-400/50",
    fill: "fill-blue-400/20",
    activeText: "text-blue-400",
    hoverBorder: "hover:border-blue-400/30",
    hoverText: "hover:text-blue-400",
    focusRing: "focus:ring-blue-400",
    boxShadow: "shadow-[inset_0_0_20px_rgba(96,165,250,0.05)]",
    bgMuted: "bg-blue-400/5"
  },
  "future-entrepreneurship": {
    text: "text-orange-400",
    border: "border-orange-400",
    bg: "bg-orange-400/10",
    shadow: "shadow-[0_0_15px_rgba(251,146,60,0.15)]",
    glow: "shadow-[0_0_10px_rgba(251,146,60,0.8)]",
    from: "from-orange-400/50",
    fill: "fill-orange-400/20",
    activeText: "text-orange-400",
    hoverBorder: "hover:border-orange-400/30",
    hoverText: "hover:text-orange-400",
    focusRing: "focus:ring-orange-400",
    boxShadow: "shadow-[inset_0_0_20px_rgba(251,146,60,0.05)]",
    bgMuted: "bg-orange-400/5"
  },
  "future-research": {
    text: "text-fuchsia-400",
    border: "border-fuchsia-400",
    bg: "bg-fuchsia-400/10",
    shadow: "shadow-[0_0_15px_rgba(232,121,249,0.15)]",
    glow: "shadow-[0_0_10px_rgba(232,121,249,0.8)]",
    from: "from-fuchsia-400/50",
    fill: "fill-fuchsia-400/20",
    activeText: "text-fuchsia-400",
    hoverBorder: "hover:border-fuchsia-400/30",
    hoverText: "hover:text-fuchsia-400",
    focusRing: "focus:ring-fuchsia-400",
    boxShadow: "shadow-[inset_0_0_20px_rgba(232,121,249,0.05)]",
    bgMuted: "bg-fuchsia-400/5"
  }
};

function DossierCover({ project, accent }) {
  const brief = briefFromMission(project);
  return (
    <BriefCover
      {...brief}
      layoutId={`case-title-${project.missionId}`}
      className="mb-10"
      tone="gallery"
    />
  );
}

function DossierView({ activeProject, onClose, onBack, onSelectRelated }) {
  const { playClickSound, openAdrs } = useSystemCommand();
  const [viewMode, setViewMode] = useState("investigation"); // 'investigation' | 'review'

  const accent = PROJECT_ACCENTS[activeProject.missionId] || PROJECT_ACCENTS["ops-dronly"];

  const handleLinkClick = (url) => {
    playClickSound();
    if (url === "#") return;
    window.open(url, "_blank");
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-obsidian relative h-full">
      {/* Dossier Header Bar */}
      <div className="shrink-0 p-3 sm:p-4 md:p-6 border-b border-obsidian-border/60 bg-obsidian/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-2">
        <button type="button" 
          onClick={() => { playClickSound(); onBack(); }}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors duration-200 group font-sans text-sm tracking-wide min-h-[40px] px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
        >
          <div className="p-1.5 rounded bg-obsidian-surface border border-obsidian-border group-hover:border-slate-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50">
            <ArrowLeft size={14} />
          </div>
          <span className="hidden sm:inline">All case studies</span>
          <span className="sm:hidden">Return</span>
        </button>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center rounded-lg border border-obsidian-border bg-slate-950 p-1 font-mono text-xs shrink-0">
            <button type="button"
              onClick={() => { playClickSound(); setViewMode("investigation"); }}
              className={cn(
                "px-2.5 py-1 rounded transition-all cursor-pointer font-bold flex items-center gap-1",
                viewMode === "investigation" ? "bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40" : "text-slate-400 hover:text-white"
              )}
            >
              Brief
            </button>
            <button type="button"
              onClick={() => { playClickSound(); setViewMode("review"); }}
              className={cn(
                "px-2.5 py-1 rounded transition-all cursor-pointer font-bold flex items-center gap-1",
                viewMode === "review" ? "bg-amber-400/20 text-amber-300 border border-amber-400/50" : "text-slate-400 hover:text-white"
              )}
            >
              Review
            </button>
          </div>
          <span className={cn("font-sans text-xs sm:text-xs uppercase tracking-widest px-2 py-1 rounded border whitespace-nowrap hidden md:inline-block", accent.text, accent.bg, accent.border)}>
            {activeProject.implementationStatus}
          </span>
          <button type="button" 
            onClick={() => { playClickSound(); onClose(); }}
            aria-label="Close Dossier"
            className="p-1.5 relative after:absolute after:content-[''] after:-inset-3 min-h-[32px] min-w-[32px] sm:min-h-[40px] sm:min-w-[40px] flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain p-4 sm:p-6 md:p-10 lg:p-12 relative">
        <div className="max-w-5xl mx-auto space-y-10 sm:space-y-16 pb-16">
          {viewMode === "investigation" && (
            <DossierCover project={activeProject} accent={accent} />
          )}
          {viewMode === "review" ? (
            <EngineeringReviewPanel mission={activeProject} />
          ) : (
            <InvestigationFlow mission={activeProject} />
          )}
        </div>
      </div>
    </div>
  );
}

function IndexView({ onSelectProject, onClose }) {
  const { playClickSound } = useSystemCommand();
  const [activeTab, setActiveTab] = React.useState("Fleet");

  const familyOrder = ["Fleet", "Motion", "Clinic", "Graph", "Next"];
  
  const familyGroups = CASE_STUDIES.reduce((acc, proj) => {
    const family = proj.family || "OTHER";
    if (!acc[family]) acc[family] = [];
    acc[family].push(proj);
    return acc;
  }, {});

  const currentProjects = familyGroups[activeTab] || [];
  const heroProject = currentProjects[0];
  const subProjects = currentProjects.slice(1);
  const heroAccent = heroProject ? (PROJECT_ACCENTS[heroProject.missionId] || PROJECT_ACCENTS["ops-dronly"]) : null;

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full bg-obsidian p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Header */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h2 id="case-studies-title" className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-[-0.04em] mb-1 sm:mb-2">
            Gallery
          </h2>
          <div className="font-sans text-sm text-slate-500">
            Named systems. Simulations are labeled.
          </div>
        </div>
        <button type="button" 
          onClick={() => { playClickSound(); onClose(); }}
          aria-label="Close archive"
          className="self-end sm:self-center relative after:absolute after:content-[''] after:-inset-3 min-h-[32px] min-w-[32px] sm:min-h-[auto] sm:min-w-[auto] p-2 rounded-lg border border-obsidian-border bg-obsidian-surface text-slate-400 hover:text-slate-200 hover:border-slate-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
        >
          <X size={20} />
        </button>
      </div>

      {/* Tabs - Scrollable on mobile */}
      <div className="shrink-0 flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 border-b border-obsidian-border/50 pb-3 sm:pb-4 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap">
        {familyOrder.map(family => {
          const projects = familyGroups[family] || [];
          if (projects.length === 0) return null;
          const isActive = activeTab === family;
          const count = projects.length;
          return (
            <button type="button"
              key={family}
              onClick={() => { playClickSound(); setActiveTab(family); }}
              className={cn(
                "font-sans text-sm sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap",
                isActive 
                  ? "bg-obsidian-surface border-slate-500 text-white" 
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-obsidian-surface/50"
              )}
            >
              <Workflow size={14} className={isActive ? "text-cyan-electric shrink-0" : "shrink-0"} />
              {family}
              <span className={cn(
                "px-1.5 py-0.5 rounded text-xs",
                isActive ? "bg-obsidian border border-obsidian-border" : "bg-transparent"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain pr-1 sm:pr-4">
        <div className="max-w-6xl mx-auto">
          {heroProject && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Hero Project */}
                <div className={cn("lg:col-span-2 flex flex-col items-start text-left p-6 sm:p-10 rounded-2xl border border-obsidian-border bg-obsidian-surface/60 transition-all group hover:shadow-lg relative overflow-hidden min-h-[260px]", heroAccent.hoverBorder, heroAccent.boxShadow)}>
                  <div className="dossier-sheen hidden md:block" aria-hidden="true" />
                  <div className={`absolute top-0 right-0 h-56 w-56 bg-gradient-to-bl ${heroAccent.from} to-transparent opacity-20 pointer-events-none blur-2xl group-hover:opacity-35 transition-opacity`} />
                  <button type="button"
                    className="absolute inset-0 w-full h-full text-left z-10 min-h-[44px] sm:min-h-[auto]"
                    onClick={() => { playClickSound(); onSelectProject(heroProject); }}
                  />
                  <div className="flex items-center justify-between w-full mb-3 sm:mb-4 relative pointer-events-none z-20">
                    <span className={cn("font-sans text-xs uppercase tracking-widest px-2 py-0.5 rounded border", heroAccent.text, heroAccent.bg, heroAccent.border)}>
                      {heroProject.missionId.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-sans text-xs text-slate-500 hidden sm:inline-block">{heroProject.implementationStatus}</span>
                      <ArrowUpRight size={16} className="text-slate-600 group-hover:text-slate-200 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50" />
                    </div>
                  </div>
                  <div className="relative pointer-events-none w-full z-20">
                    <h4 className={cn("font-display text-2xl sm:text-4xl font-extrabold tracking-[-0.04em] mb-3 sm:mb-4 transition-colors", heroAccent.hoverText, "text-white")}>
                      {heroProject.projectName}
                    </h4>
                    <p className="lede max-w-2xl mb-4 sm:mb-6">
                      {heroProject.executiveSummary?.split(". ").slice(0, 1).join(". ")}.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="kicker text-slate-500">Status</span>
                        <span className="font-sans text-xs text-slate-300">{heroProject.implementationStatus}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="kicker text-slate-500">Theme</span>
                        <span className="font-sans text-xs text-slate-300">{heroProject.family}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Subordinate Projects */}
                {subProjects.length > 0 ? (
                  <div className="lg:col-span-1 flex flex-col justify-start">
                    <h4 className="kicker text-slate-500 mb-2">Also here</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3">
                      {subProjects.map(proj => {
                        const accent = PROJECT_ACCENTS[proj.missionId] || PROJECT_ACCENTS["ops-dronly"];
                        return (
                          <button type="button"
                            key={proj.missionId}
                            onClick={() => { playClickSound(); onSelectProject(proj); }}
                            className={cn("flex flex-col text-left p-3.5 sm:p-4 rounded-lg border border-obsidian-border bg-obsidian-surface hover:bg-obsidian-surface/80 transition-all group relative z-10", accent.hoverBorder)}
                          >
                            <div className="flex items-center justify-between w-full mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className={cn("w-1.5 h-1.5 rounded-full shrink-0 transition-transform group-hover:scale-150", accent.bg.replace('/10', ''), accent.glow)} />
                                <span className={cn("font-sans text-xs font-semibold transition-colors", accent.hoverText, "text-slate-300")}>{proj.projectName}</span>
                              </div>
                              <ArrowUpRight size={12} className="text-slate-600 group-hover:text-slate-200 transition-colors duration-200 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50" />
                            </div>
                            <p className="font-sans text-xs text-slate-400 line-clamp-1 ml-3.5 mb-2">
                              {proj.missionObjective}
                            </p>
                            <div className="ml-3.5 flex flex-wrap gap-1 items-center">
                              <span className="font-sans text-[10px] px-1.5 py-0.5 rounded bg-obsidian border border-obsidian-border text-slate-300">
                                {proj.family}
                              </span>
                              <span className="font-sans text-[10px] px-1.5 py-0.5 rounded bg-obsidian border border-obsidian-border text-cyan-electric">
                                {proj.implementationStatus}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="hidden lg:flex flex-col justify-center items-center lg:col-span-1 rounded-xl border border-dashed border-obsidian-border/50 bg-obsidian-surface/30 p-6 text-center">
                     <ShieldCheck size={20} className="text-slate-600 mb-3" />
                     <span className="font-sans font-medium text-slate-400 uppercase tracking-wider">No related<br/>case studies</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FlagshipProjectsModal() {
  const { isFlagshipsOpen: isOpen, closeFlagships: onClose, activeFlagshipMission: initialMission } = useSystemCommand();
  const [activeProject, setActiveProject] = useState(initialMission || null);
  const [viewMode, setViewMode] = useState(initialMission ? "dossier" : "index");
  const modalRef = useRef(null);

  React.useEffect(() => {
    if (initialMission) {
      setActiveProject(initialMission);
      setViewMode("dossier");
    }
  }, [initialMission]);

  React.useEffect(() => {
    if (!isOpen) {
      // Reset state when closed
      setTimeout(() => {
        setViewMode("index");
        setActiveProject(null);
      }, 300);
      return;
    }
  }, [isOpen]);

  const handleModalClose = React.useCallback(() => {
    if (viewMode === "dossier") {
      setViewMode("index");
    } else {
      onClose();
    }
  }, [viewMode, onClose]);

  useModal({ isOpen, onClose: handleModalClose, ref: modalRef });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        {...overlayFade}
        className="pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-2 sm:p-4 md:p-8 backdrop-blur-xl overflow-hidden"
        style={{ perspective: 1400 }}
        onClick={handleModalClose}
        role="presentation"
      >
        <motion.div
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-studies-title"
          initial={modalReveal.initial}
          animate={modalReveal.animate}
          exit={modalReveal.exit}
          transition={modalReveal.transition}
          className="relative flex h-full max-h-[96vh] sm:max-h-[92vh] w-full max-w-[1400px] flex-col overflow-hidden rounded-xl border border-cyan-electric/25 bg-obsidian shadow-[0_0_80px_rgba(0,240,255,0.12)] overscroll-contain"
        >
          {/* Corner Brackets */}
          <div className="pointer-events-none absolute left-0 top-0 h-10 w-10 sm:h-16 sm:w-16 border-l-2 border-t-2 border-cyan-electric/30 rounded-tl-xl z-50" />
          <div className="pointer-events-none absolute right-0 top-0 h-10 w-10 sm:h-16 sm:w-16 border-r-2 border-t-2 border-cyan-electric/30 rounded-tr-xl z-50" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-10 w-10 sm:h-16 sm:w-16 border-b-2 border-l-2 border-cyan-electric/30 rounded-bl-xl z-50" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-10 w-10 sm:h-16 sm:w-16 border-b-2 border-r-2 border-cyan-electric/30 rounded-br-xl z-50" />

          {/* Main Content Area */}
          <AnimatePresence mode="wait">
            {viewMode === "index" ? (
              <motion.div
                key="index"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="w-full flex-1 flex flex-col min-h-0"
              >
                <IndexView 
                  onClose={onClose} 
                  onSelectProject={(proj) => {
                    setActiveProject(proj);
                    setViewMode("dossier");
                  }} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="dossier"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full flex-1 flex flex-col min-h-0"
              >
                {activeProject && (
                  <DossierView 
                    activeProject={activeProject} 
                    onClose={onClose}
                    onBack={() => setViewMode("index")}
                    onSelectRelated={(proj) => setActiveProject(proj)}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
