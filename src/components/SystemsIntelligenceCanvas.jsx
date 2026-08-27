import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Cpu, Network, ShieldCheck, Zap, Radio, 
  Layers, Compass, Database, Terminal, RefreshCw, X, Info, CheckCircle2,
  Server, GitCommit, ShieldAlert, ArrowUpRight, CpuIcon, BookOpen,
  HelpCircle, Link2, Sparkles, Code2, ArrowRight, History, Lightbulb,
  Workflow, Layers3, ChevronRight, Share2, CornerDownRight
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSpatial } from "../SpatialContext";
import { useSystemCommand } from "../context/SystemCommandContext";
import EngineeringReviewPanel from "./EngineeringReviewPanel";
import { CASE_STUDIES } from "../data/missions";
import { MICRO_EDUCATION_DB, MISSION_TOPOLOGIES, AMBIENT_NODES, AMBIENT_LINKS } from "../data/canvas-atlas";
import { mapReveal } from "../lib/motion";

const cn = (...inputs) => twMerge(clsx(inputs));
export default function SystemsIntelligenceCanvas() {
  const { selectedMissionId, setSelectedMissionId } = useSpatial();
  const { 
    playClickSound, 
    setIsEnterpriseExplorerOpen, 
    openAdrs
  } = useSystemCommand();

  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);
  const [viewMode, setViewMode] = useState("presentation");

  const activeMissionData = useMemo(() => {
    if (selectedMissionId) {
      return CASE_STUDIES.find((m) => m.missionId === selectedMissionId) || CASE_STUDIES[0];
    }
    return CASE_STUDIES[0];
  }, [selectedMissionId]);

  const [eventLogIndex, setEventLogIndex] = useState(0);

  // Phase 2: Engineering Memory (Session Exploration History Trail)
  const [explorationHistory, setExplorationHistory] = useState(() => {
    return [
      { type: "mission", id: "ops-dronly", label: "ops.dronly.in" }
    ];
  });

  const addToHistory = useCallback((item) => {
    setExplorationHistory((prev) => {
      // Avoid duplicate consecutive entries
      if (prev.length > 0 && prev[prev.length - 1].id === item.id) return prev;
      const filtered = prev.filter((x) => x.id !== item.id);
      return [...filtered.slice(-5), item];
    });
  }, []);

  // Pillar 1: Live Pulse Traffic Density & Simulation Controls
  const [trafficDensity, setTrafficDensity] = useState('NORMAL'); // 'NORMAL' | 'HIGH_LOAD' | 'FAILOVER'
  const [manualBreakerTripped, setManualBreakerTripped] = useState(false);

  const isBreakerActive = manualBreakerTripped || trafficDensity === 'FAILOVER';

  // Computed Dynamic Operations Telemetry Metrics
  const pingRate = trafficDensity === 'FAILOVER' ? '142.0k pings/s' : trafficDensity === 'HIGH_LOAD' ? '68.5k pings/s' : '12.4k pings/s';
  const workerPool = trafficDensity === 'FAILOVER' ? '256 Workers' : trafficDensity === 'HIGH_LOAD' ? '128 Workers' : '64 Workers';
  const healthSLA = isBreakerActive ? '94.10% SHIELDED' : trafficDensity === 'HIGH_LOAD' ? '98.42% ARMED' : '99.98% NOMINAL';

  // Packet animation speed
  const packetAnimDuration = trafficDensity === 'FAILOVER' ? '0.5s' : trafficDensity === 'HIGH_LOAD' ? '1.2s' : '3.8s';

  // Cycle telemetry event log ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setEventLogIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeTopology = useMemo(() => {
    if (selectedMissionId && MISSION_TOPOLOGIES[selectedMissionId]) {
      return MISSION_TOPOLOGIES[selectedMissionId];
    }
    return null;
  }, [selectedMissionId]);

  const currentNodes = activeTopology ? activeTopology.nodes : AMBIENT_NODES;
  const currentLinks = activeTopology ? activeTopology.links : AMBIENT_LINKS;
  const currentEvents = activeTopology ? activeTopology.events : [
    "Systems Mesh active: Monitoring distributed nodes",
    "Telemetry link integrity: 99.94% Nominal",
    "Zero security vulnerabilities detected in active build",
    "Select a Flagship Mission above to inspect full topology"
  ];

  const themeColor = isBreakerActive ? "#f43f5e" : trafficDensity === 'HIGH_LOAD' ? "#fbbf24" : activeTopology ? activeTopology.hexColor : "#00f0ff";
  const themeText = isBreakerActive ? "text-rose-400" : trafficDensity === 'HIGH_LOAD' ? "text-amber-400" : activeTopology ? activeTopology.textClass : "text-cyan-electric";

  // Helper to resolve node coordinates
  const getNodePos = useCallback((id) => {
    const n = currentNodes.find((item) => item.id === id);
    return n ? { x: n.x, y: n.y } : { x: 50, y: 50 };
  }, [currentNodes]);

  const handleMissionSelect = (topoId) => {
    playClickSound();
    const newId = selectedMissionId === topoId ? null : topoId;
    setSelectedMissionId(newId);
    setSelectedNode(null);
    setHoveredLink(null);
    if (newId && MISSION_TOPOLOGIES[newId]) {
      addToHistory({ type: "mission", id: newId, label: MISSION_TOPOLOGIES[newId].title });
    }
  };

  const handleNodeClick = (node) => {
    playClickSound();
    if (selectedNode?.id === node.id) {
      setSelectedNode(null);
    } else {
      setSelectedNode(node);
      setInspectorTab("4pillar");
      addToHistory({ type: "node", id: node.id, label: node.label });
    }
  };

  const handleTechClick = (techKey) => {
    playClickSound();
    if (MICRO_EDUCATION_DB[techKey]) {
      setSelectedTech(MICRO_EDUCATION_DB[techKey]);
      addToHistory({ type: "tech", id: techKey, label: techKey });
    }
  };

  const activeNode = selectedNode;

  // Phase 9: Focus Mode - compute connected node IDs for the active node
  const connectedNodeIds = useMemo(() => {
    if (!activeNode) return null;
    const set = new Set([activeNode.id]);
    currentLinks.forEach((l) => {
      if (l.from === activeNode.id) set.add(l.to);
      if (l.to === activeNode.id) set.add(l.from);
    });
    return set;
  }, [activeNode, currentLinks]);

  return (
    <div className="relative w-full h-full min-h-[440px] flex flex-col justify-between overflow-hidden rounded-xl bg-obsidian/95 p-3 sm:p-5 border border-obsidian-border/90 shadow-2xl">
      
      {/* Background Grid & Radial Glow Mesh with Depth Depth Fog */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layered Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-obsidian/90 to-obsidian" />
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(0,240,255,0.06)_0%,_transparent_60%)]" 
        />
        <motion.div 
          animate={{ opacity: [0.05, 0.15, 0.05], scale: [1, 1.1, 1] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,_rgba(0,255,135,0.06)_0%,_transparent_60%)]" 
        />
        {/* Depth Fog */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian opacity-60 mix-blend-multiply" />
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="canvas-grid-v3" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke={themeColor} strokeWidth="0.5" strokeDasharray="2 2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#canvas-grid-v3)" />
        </svg>
      </div>

      {/* Layer 1: Top Navigation, Quick Selectors & Session Memory Trail */}
      <div className="relative z-10 flex flex-col gap-2.5 bg-obsidian-surface/90 p-2 sm:p-2.5 rounded-lg border border-obsidian-border/80 backdrop-blur-md">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Topology Selectors */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto custom-scrollbar max-w-full pb-1 lg:pb-0">
            <span className="font-sans text-xs tracking-wide text-slate-500 whitespace-nowrap flex items-center gap-1">
              <Layers size={11} className="text-cyan-electric" /> Systems
            </span>
            {Object.values(MISSION_TOPOLOGIES).map((topo) => {
              const isSelected = selectedMissionId === topo.id;
              return (
                <button type="button"
                  key={topo.id}
                  onClick={() => handleMissionSelect(topo.id)}
                  className={cn(
                    "font-sans text-xs px-2.5 py-1 rounded-md border transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer",
                    isSelected
                      ? cn(topo.borderClass, topo.bgClass, topo.textClass, "font-bold shadow-sm scale-[1.02]")
                      : "border-obsidian-border/80 bg-obsidian/70 text-slate-400 hover:text-white hover:border-slate-500"
                  )}
                >
                  <span className={cn("inline-block h-1.5 w-1.5 rounded-full", isSelected ? "animate-pulse" : "bg-slate-600")} style={{ backgroundColor: isSelected ? topo.hexColor : undefined }} />
                  {topo.title}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
            <div className="flex items-center rounded-md border border-obsidian-border bg-slate-950 p-0.5 font-sans text-xs shrink-0">
              <button type="button"
                onClick={() => { playClickSound(); setViewMode("presentation"); }}
                className={cn(
                  "px-2.5 py-1 rounded transition-all cursor-pointer font-medium flex items-center gap-1",
                  viewMode === "presentation" ? "bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40" : "text-slate-400 hover:text-white"
                )}
              >
                Map
              </button>
              <button type="button"
                onClick={() => { playClickSound(); setViewMode("review"); }}
                className={cn(
                  "px-2.5 py-1 rounded transition-all cursor-pointer font-medium flex items-center gap-1",
                  viewMode === "review" ? "bg-amber-400/20 text-amber-300 border border-amber-400/50" : "text-slate-400 hover:text-white"
                )}
              >
                <ShieldCheck size={11} /> Review
              </button>
            </div>
          </div>
        </div>

        {/* Phase 2: Engineering Memory (Session History Trail) */}
        {explorationHistory.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1.5  font-mono text-xs overflow-x-auto custom-scrollbar">
            <span className="text-slate-500 tracking-wide flex items-center gap-1 shrink-0">
              <History size={10} className="text-amber-400" /> Opened
            </span>
            <div className="flex items-center gap-1">
              {explorationHistory.map((item, idx) => (
                <React.Fragment key={`${item.id}-${idx}`}>
                  {idx > 0 && <ChevronRight size={10} className="text-slate-600 shrink-0" />}
                  <button type="button"
                    onClick={() => {
                      playClickSound();
                      if (item.type === "mission") handleMissionSelect(item.id);
                      else if (item.type === "node") {
                        const target = currentNodes.find((n) => n.id === item.id);
                        if (target) handleNodeClick(target);
                      } else if (item.type === "tech") handleTechClick(item.id);
                    }}
                    className="px-1.5 py-0.5 rounded bg-slate-900 border border-obsidian-border text-slate-300 hover:text-cyan-electric hover:border-cyan-electric/50 transition-colors duration-200 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                  >
                    {item.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Layer 2: Main Vector Node Canvas Stage OR Engineering Review Mode Panel */}
      {viewMode === "review" ? (
        <div className="relative w-full flex-1 my-2 rounded-lg bg-slate-950/90 border border-amber-400/30 p-4 overflow-y-auto max-h-[640px] custom-scrollbar z-10">
          <EngineeringReviewPanel 
            mission={activeMissionData} 
            activeMode={viewMode}
            onToggleMode={(mode) => setViewMode(mode)}
          />
        </div>
      ) : (
        <div className="relative w-full flex-1 min-h-[300px] my-2 rounded-lg bg-slate-950/60 border border-obsidian-border/50 overflow-hidden">
        
        {/* SVG Vector Links Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="vector-link-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={themeColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {currentLinks.map((link, idx) => {
            const start = getNodePos(link.from);
            const end = getNodePos(link.to);

            const isHovered = hoveredLink === link;
            const isConnectedToActiveNode = connectedNodeIds ? (connectedNodeIds.has(link.from) && connectedNodeIds.has(link.to)) : true;

            // Phase 9: Focus Mode Dimming
            const strokeOpacity = isHovered ? 1 : isConnectedToActiveNode ? 0.6 : 0.12;

            return (
              <g key={`${link.from}-${link.to}-${idx}`}>
                {/* Ambient Edge Glow */}
                <line
                  x1={`${start.x}%`}
                  y1={`${start.y}%`}
                  x2={`${end.x}%`}
                  y2={`${end.y}%`}
                  stroke={isHovered ? "#ffffff" : themeColor}
                  strokeWidth={isHovered ? 8 : 4}
                  strokeOpacity={strokeOpacity * 0.25}
                  className="transition-all duration-200 blur-sm mix-blend-screen"
                />
                {/* Vector Link Line */}
                <line
                  x1={`${start.x}%`}
                  y1={`${start.y}%`}
                  x2={`${end.x}%`}
                  y2={`${end.y}%`}
                  stroke={isHovered ? "#ffffff" : themeColor}
                  strokeWidth={isHovered ? 2.5 : link.relation ? 1.5 : 1}
                  strokeDasharray={isHovered ? "none" : "4 4"}
                  strokeOpacity={strokeOpacity}
                  className="transition-all duration-200 drop-shadow-md"
                />

                {/* Animated Data Packet Pulsing using native SVG animate */}
                <circle
                  r={isHovered ? 4 : 2.5}
                  fill={themeColor}
                  opacity={isConnectedToActiveNode ? 0.9 : 0.2}
                  className="shadow-sm"
                >
                  <animate
                    attributeName="cx"
                    values={`${start.x}%;${end.x}%`}
                    dur={packetAnimDuration}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values={`${start.y}%;${end.y}%`}
                    dur={packetAnimDuration}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Interactive Link Hover Trigger Area */}
                <line
                  x1={`${start.x}%`}
                  y1={`${start.y}%`}
                  x2={`${end.x}%`}
                  y2={`${end.y}%`}
                  stroke="transparent"
                  strokeWidth={20}
                  className="pointer-events-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                  onMouseEnter={() => setHoveredLink(link)}
                  onMouseLeave={() => setHoveredLink(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Phase 4: Relationship Intelligence Tooltip on Vector Link Hover */}
        <AnimatePresence>
          {hoveredLink && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
            >
              <span className="kicker rounded-full border border-cyan-electric/30 bg-slate-950/90 px-3 py-1 text-cyan-electric">
                {hoveredLink.relation}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Canvas Nodes */}
        {currentNodes.map((node) => {
          const isHovered = hoveredNode?.id === node.id;
          const isSelected = selectedNode?.id === node.id;
          const isCore = node.isCore;

          // Phase 9: Focus Mode Dimming
          const isDimmed = connectedNodeIds ? !connectedNodeIds.has(node.id) : false;

          return (
            <motion.div
              key={node.id}
              initial={false}
              animate={{ 
                left: `${node.x}%`, 
                top: `${node.y}%`,
                scale: isSelected ? 1.05 : (isHovered ? 1.05 : 1),
                y: isHovered || isSelected ? -5 : 0 
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all duration-300 group p-4", // p-4 adds 16px transparent padding for a larger hit area
                isDimmed && "opacity-30 filter grayscale-[40%]"
              )}
              onClick={() => handleNodeClick(node)}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Outer Pulse Glow */}
              {(isCore || isHovered || isSelected) && (
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-40"
                  style={{
                    backgroundColor: themeColor,
                    animationDuration: isCore ? "3s" : "1.8s"
                  }}
                />
              )}

{/* Soft Ambient Glow */}
              <div 
                className={cn(
                  "absolute inset-0 rounded-full mix-blend-screen transition-opacity duration-700 blur-xl",
                  isCore ? "opacity-30" : "opacity-10",
                  (isHovered || isSelected) && "opacity-60"
                )} 
                style={{ backgroundColor: themeColor }} 
              />
              {/* Node Body */}
              <div
                className={cn(
                  "relative flex items-center justify-center rounded-full border transition-all duration-300 backdrop-blur-xl",
                  isCore ? "h-7 w-7 sm:h-8 sm:w-8" : "h-5 w-5 sm:h-6 sm:w-6",
                  isHovered || isSelected
                    ? "border-white bg-slate-900 shadow-2xl scale-125"
                    : activeTopology
                    ? "border-obsidian-border bg-slate-950/80 shadow-md"
                    : "border-cyan-electric/40 bg-slate-950/60 shadow-lg"
                )}
                style={{
                  borderColor: isHovered || isSelected ? "#ffffff" : isCore ? themeColor : undefined,
                  boxShadow: isHovered || isSelected ? `0 0 24px ${themeColor}, inset 0 0 10px rgba(0,0,0,0.5)` : `inset 0 0 8px rgba(0,0,0,0.4)`
                }}
              >
                <span
                  className={cn("rounded-full transition-all drop-shadow-md", isCore ? "h-2.5 w-2.5" : "h-1.5 w-1.5", (isHovered || isSelected) && "scale-125")}
                  style={{ backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}` }}
                />
              </div>

              {/* Node Label (Progressive Disclosure: Only show labels when Hovered or Selected) */}
              {(isHovered || isSelected) && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-center pointer-events-none z-40"
                >
                  <span
                    className={cn(
                      "font-sans text-xs uppercase tracking-wider block font-bold transition-all px-2.5 py-1 rounded bg-slate-950/95 border border-cyan-electric/50 text-white shadow-2xl backdrop-blur-md"
                    )}
                    style={{ borderColor: themeColor }}
                  >
                    {node.label}
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Phase 1 & 3: Contextual Engineering Inspector Workspace Panel */}
        <AnimatePresence>
          {(activeNode || activeTopology) && (
            <motion.div
              {...mapReveal}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 max-w-xl w-11/12 p-3 sm:p-4 rounded-xl border border-cyan-electric/60 bg-slate-950/98 shadow-2xl backdrop-blur-2xl space-y-3 pointer-events-auto max-h-[50vh] sm:max-h-[350px] overflow-y-auto custom-scrollbar"
            >
              <div className="relative pr-10">
                <div className="kicker text-cyan-electric/70 mb-1">Map</div>
                <h3 className="font-display text-xl font-extrabold tracking-[-0.03em] text-white truncate">
                  {activeNode ? activeNode.label : activeTopology.title}
                </h3>
                <button type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    setSelectedNode(null);
                    setHoveredNode(null);
                    setSelectedMissionId(null);
                  }}
                  aria-label="Close"
                  className="absolute top-0 right-0 min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-200 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 rounded-md flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              </div>

              {(() => {
                const note = activeNode?.insight || activeTopology?.insight || {};
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {note.problem && (
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-obsidian-border/80">
                        <span className="kicker text-cyan-electric/80 block mb-1">Situation</span>
                        <p className="font-sans text-xs text-slate-300 leading-snug">{note.problem}</p>
                      </div>
                    )}
                    {note.decision && (
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-obsidian-border/80">
                        <span className="kicker text-cyan-electric/80 block mb-1">Choice</span>
                        <p className="font-sans text-xs text-slate-300 leading-snug">{note.decision}</p>
                      </div>
                    )}
                    {note.tradeoff && (
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-obsidian-border/80">
                        <span className="kicker text-cyan-electric/80 block mb-1">Cost</span>
                        <p className="font-sans text-xs text-slate-300 leading-snug">{note.tradeoff}</p>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="flex flex-wrap items-center gap-2">
                <button type="button"
                  onClick={() => { playClickSound(); openAdrs(); }}
                  className="px-3 py-1.5 rounded-lg border border-emerald-glow/30 bg-emerald-glow/10 text-emerald-glow font-sans text-xs hover:bg-emerald-glow/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                >
                  Also chosen
                </button>
                {activeTopology?.techStack?.map((tech) => (
                  <button type="button"
                    key={tech}
                    onClick={() => handleTechClick(tech)}
                    className="px-2.5 py-1 rounded-lg border border-obsidian-border/80 bg-slate-900 text-cyan-electric font-sans text-xs hover:border-cyan-electric/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                  >
                    {tech}
                  </button>
                ))}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 8: Micro-Education Modal when selecting a tech term */}
        <AnimatePresence>
          {selectedTech && (
            <motion.div
              {...mapReveal}
              className="absolute top-10 left-1/2 -translate-x-1/2 z-40 max-w-md w-11/12 p-4 rounded-2xl border border-amber-400/40 bg-slate-950/98 shadow-[0_0_60px_rgba(251,191,36,0.12)] backdrop-blur-2xl space-y-3 pointer-events-auto"
            >
              <div className="relative font-display text-lg font-extrabold tracking-[-0.03em] text-white pr-10">
                <span>{selectedTech.name}</span>
                <button type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    setSelectedTech(null);
                  }}
                  aria-label="Close"
                  className="absolute top-1/2 -translate-y-1/2 -mt-0.5 right-0 min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-200 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 rounded-md flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-1.5 font-sans text-sm text-slate-300">
                <p><span className="kicker text-amber-300/80">Situation </span>{selectedTech.what}</p>
                <p><span className="kicker text-cyan-electric/80">Choice </span>{selectedTech.why}</p>
                <p><span className="kicker text-emerald-300/80">Cost </span>{selectedTech.useCase}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Default Unselected Prompt Banner */}
        {!selectedMissionId && !hoveredNode && !selectedNode && !hoveredLink && !selectedTech && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-md text-center p-2.5 rounded-xl border border-obsidian-border/80 bg-slate-950/85 backdrop-blur-md pointer-events-none space-y-0.5 shadow-xl">
            <div className="kicker text-slate-400 flex items-center justify-center gap-1.5">
              <Compass size={13} /> Open a system
            </div>
            <p className="font-sans text-xs text-slate-400 leading-tight">
              Click a node for situation, choice, and cost.
            </p>
          </div>
        )}
      </div>
      )}

      {/* Layer 3: Contextual Operational Telemetry Status Bar */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5  font-mono text-xs">
        
        <div className="p-2 sm:p-2.5 rounded-lg bg-obsidian-surface/70 border border-obsidian-border/70">
          <span className="text-slate-500 block text-[8px] uppercase tracking-wider">Active Mission</span>
          <span className={cn("font-bold truncate block mt-0.5", themeText)}>
            {activeTopology ? activeTopology.title : "Global Systems Mesh"}
          </span>
        </div>

        <div className="p-2 sm:p-2.5 rounded-lg bg-obsidian-surface/70 border border-obsidian-border/70">
          <span className="text-slate-500 block text-[8px] uppercase tracking-wider">gRPC Worker Pool</span>
          <span className="text-slate-300 font-semibold truncate block mt-0.5">
            {workerPool}
          </span>
        </div>

        <div className="p-2 sm:p-2.5 rounded-lg bg-obsidian-surface/70 border border-obsidian-border/70">
          <span className="text-slate-500 block text-[8px] uppercase tracking-wider">Live Ingest Rate</span>
          <span className="text-cyan-electric font-bold truncate block mt-0.5">
            {pingRate}
          </span>
        </div>

        <div className="p-2 sm:p-2.5 rounded-lg bg-obsidian-surface/70 border border-obsidian-border/70">
          <span className="text-slate-500 block text-[8px] uppercase tracking-wider">Circuit Breaker SLA</span>
          <span className={cn("font-bold truncate block mt-0.5 flex items-center gap-1", isBreakerActive ? "text-rose-400" : trafficDensity === 'HIGH_LOAD' ? "text-amber-400" : "text-emerald-glow")}>
            <CheckCircle2 size={11} /> {healthSLA}
          </span>
        </div>

      </div>

    </div>
  );
}
