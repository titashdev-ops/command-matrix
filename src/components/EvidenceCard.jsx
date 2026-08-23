import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Clock, Archive, FlaskConical, FileJson, FileText, Download, Code, GitCommit, ChevronDown, ChevronUp, Activity, Terminal } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSystemCommand } from "../context/SystemCommandContext";
import { useSpatial, TABS } from "../SpatialContext";
import { ADR_RECORDS } from "../data/adrs";

const cn = (...inputs) => twMerge(clsx(inputs));

const STATUS_CONFIG = {
  Verified: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  Pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  Archived: { icon: Archive, color: "text-slate-400", bg: "bg-slate-400/10", border: "border-slate-400/20" },
  Experimental: { icon: FlaskConical, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
  Simulation: { icon: FlaskConical, color: "text-cyan-electric", bg: "bg-cyan-electric/10", border: "border-cyan-electric/20" },
  Prototype: { icon: FlaskConical, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  Documented: { icon: FileText, color: "text-slate-300", bg: "bg-slate-400/10", border: "border-slate-400/20" },
};

const SOURCE_ICONS = {
  GitHub: Code,
  Benchmark: Activity,
  ADR: FileText,
  "Technical Report": FileText,
  Research: FlaskConical,
  Documentation: FileText,
  "Production Logs": Terminal,
};

export default function EvidenceCard({
  title,
  status = "Pending",
  source = "Documentation",
  methodology = {},
  results = {},
  benchmarkDetails = null,
  downloads = []
}) {
  const [expanded, setExpanded] = useState(false);
  const StatusIcon = STATUS_CONFIG[status]?.icon || Clock;
  const SourceIcon = SOURCE_ICONS[source] || FileText;
  
  const { openAdrs, playClickSound } = useSystemCommand();
  const { setActiveTab } = useSpatial();

  const handleAdrClick = (e, adrId) => {
    e.stopPropagation();
    playClickSound();
    
    // Attempt to map string name to ADR ID if it's not a direct ID
    let targetId = adrId;
    if (adrId.includes('ADR-004')) targetId = 'adr-004';
    if (adrId.includes('ADR-003')) targetId = 'adr-003';
    
    openAdrs(targetId);
  };
  
  const handleArchClick = (e) => {
    e.stopPropagation();
    playClickSound();
    setActiveTab(TABS.VECTOR);
  };

  return (
    <div className={cn("border bg-obsidian/80 backdrop-blur-md rounded-lg overflow-hidden transition-colors duration-300", 
      expanded ? "border-obsidian-border" : "border-obsidian-border/50 hover:border-obsidian-border")}>
      
      {/* Header (Always visible) */}
      <div 
        className="p-4 cursor-pointer flex items-center justify-between group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
        onClick={() => {
          playClickSound();
          setExpanded(!expanded);
        }}
      >
        <div className="flex items-center gap-3">
          <div className={cn("p-1.5 rounded-md border", STATUS_CONFIG[status]?.bg, STATUS_CONFIG[status]?.color, STATUS_CONFIG[status]?.border)}>
            <StatusIcon size={16} />
          </div>
          <div>
            <h4 className="font-mono text-sm text-slate-300 tracking-wide">{title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-xs uppercase font-sans tracking-widest", STATUS_CONFIG[status]?.color)}>
                {status}
              </span>
              <span className="text-slate-600 text-xs">•</span>
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400 flex items-center gap-1">
                <SourceIcon size={10} />
                {source}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-slate-500 group-hover:text-slate-300 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-obsidian-border/40"
          >
            <div className="p-4 space-y-6">
              
              {/* Methodology section */}
              {Object.keys(methodology).length > 0 && !benchmarkDetails && (
                <div>
                  <h5 className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-500 mb-2 border-b border-obsidian-border/40 pb-1">Methodology</h5>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                    {Object.entries(methodology).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-slate-500 font-sans text-xs uppercase">{key}</span>
                        <span className="text-slate-300 font-sans mt-0.5">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results section */}
              {Object.keys(results).length > 0 && !benchmarkDetails && (
                <div>
                  <h5 className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-500 mb-2 border-b border-obsidian-border/40 pb-1">Measured Results</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(results).map(([key, value]) => (
                      <div key={key} className="bg-obsidian-surface/50 p-2 rounded border border-obsidian-border/50">
                        <span className="block text-slate-500 font-sans text-xs uppercase">{key}</span>
                        <span className="block text-emerald-400 font-sans text-xs mt-1">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Benchmark Intelligence */}
              {benchmarkDetails && (
                <div className="space-y-4">
                  <h5 className="font-sans font-medium text-slate-400 uppercase tracking-wider text-cyan-electric mb-2 border-b border-obsidian-border/40 pb-1">Benchmark Intelligence</h5>
                  
                  <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="space-y-1">
                      <span className="text-slate-400 font-sans text-xs uppercase font-bold">What was measured?</span>
                      <p className="text-slate-300 leading-relaxed">{benchmarkDetails.what}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-slate-400 font-sans text-xs uppercase font-bold">Why was it measured?</span>
                      <p className="text-slate-300 leading-relaxed">{benchmarkDetails.why}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs font-sans">
                    <span className="text-slate-400 font-sans text-xs uppercase font-bold">How was it measured?</span>
                    <p className="text-slate-300 leading-relaxed bg-obsidian-surface/30 p-3 rounded border border-obsidian-border/50">{benchmarkDetails.how}</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="space-y-1">
                      <span className="text-amber-500/80 font-sans text-xs uppercase font-bold">Assumptions</span>
                      <p className="text-slate-300 leading-relaxed">{benchmarkDetails.assumptions}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-rose-400/80 font-sans text-xs uppercase font-bold">Limitations</span>
                      <p className="text-slate-300 leading-relaxed">{benchmarkDetails.limitations}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs font-sans border border-emerald-glow/30 bg-emerald-glow/5 p-3 rounded-lg mt-2">
                    <span className="text-emerald-glow font-sans text-xs uppercase font-bold">Conclusion</span>
                    <p className="text-slate-300 font-medium leading-relaxed mt-1">{benchmarkDetails.conclusion}</p>
                  </div>
                  
                  {/* Cross-linking Knowledge Graph */}
                  <div className="pt-2 ">
                     <span className="text-slate-400 font-sans text-xs uppercase font-bold mb-2 block flex items-center gap-2"><Activity size={12}/> Contextual Engineering Trace</span>
                     <div className="flex flex-wrap gap-2 text-xs font-sans">
                        {benchmarkDetails.relatedArch ? (
                          <button type="button" onClick={handleArchClick} className="px-2 py-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-electric/50 text-slate-300 transition-colors duration-200 flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]">
                            Related Architecture: {benchmarkDetails.relatedArch}
                          </button>
                        ) : (
                          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-500">Related Architecture: Pending</span>
                        )}
                        
                        {benchmarkDetails.relatedAdr ? (
                          <button type="button" onClick={(e) => handleAdrClick(e, benchmarkDetails.relatedAdr)} className="px-2 py-1 rounded bg-slate-900 border border-slate-700 hover:border-emerald-400/50 text-slate-300 transition-colors duration-200 flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50">
                            Related ADR: {benchmarkDetails.relatedAdr}
                          </button>
                        ) : (
                          <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-500">Related ADR: Pending</span>
                        )}
                        
                        <span className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">Origin Mission: {benchmarkDetails.relatedMission || "Pending"}</span>
                     </div>
                  </div>
                </div>
              )}

              {/* Downloads section */}
              {downloads.length > 0 && (
                <div>
                  <h5 className="font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-500 mb-2 border-b border-obsidian-border/40 pb-1">Artifacts</h5>
                  <div className="flex flex-wrap gap-2">
                    {downloads.map((dl, idx) => (
                      <button
                        type="button"
                        key={idx}
                        disabled
                        title="Artifact is not published with this portfolio"
                        className="flex items-center gap-1.5 text-xs font-mono tracking-wider text-slate-500 bg-obsidian-surface/50 px-2.5 py-1.5 rounded border border-obsidian-border/50 min-h-[44px] sm:min-h-[auto] cursor-not-allowed opacity-70"
                      >
                        {dl.type === 'json' ? <FileJson size={12} /> : dl.type === 'commit' ? <GitCommit size={12} /> : <Download size={12} />}
                        {dl.label} · unpublished
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
