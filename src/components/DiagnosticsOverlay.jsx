/* --- FILE: src/components/DiagnosticsOverlay.jsx --- */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSystemCommand } from "../context/SystemCommandContext";
import { X } from "lucide-react";
import { useModal } from "../hooks/useModal";
import { useRef } from "react";

export default function DiagnosticsOverlay() {
  const { isDiagnosticsOpen, toggleDiagnostics, liveTelemetryData, openStressTester, openAdrs } = useSystemCommand();
  const [fps, setFps] = useState(60);
  const [time, setTime] = useState("");
  const [memory, setMemory] = useState("42.8");
  const modalRef = useRef(null);

  useModal({ isOpen: isDiagnosticsOpen, onClose: toggleDiagnostics, ref: modalRef });

  useEffect(() => {
    if (!isDiagnosticsOpen) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId;

    const updateMetrics = () => {
      const now = performance.now();
      frameCount++;

      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
        
        // Simulate memory fluctuation
        const baseMemory = 42.0;
        setMemory((baseMemory + Math.random() * 2).toFixed(1));
      }

      // Update UTC time
      setTime(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
      animationFrameId = requestAnimationFrame(updateMetrics);
    };

    animationFrameId = requestAnimationFrame(updateMetrics);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDiagnosticsOpen]);

  return (
    <AnimatePresence>
      {isDiagnosticsOpen && (
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="diagnostics-title"
          drag
          dragConstraints={{ left: -400, right: 20, top: -50, bottom: 500 }}
          dragElastic={0.15}
          dragTransition={{ bounceStiffness: 320, bounceDamping: 20 }}
          whileDrag={{ scale: 1.02, cursor: "grabbing" }}
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{
            type: "spring",
            stiffness: 320,
            damping: 20,
            mass: 0.85,
            bounce: 0.22,
          }}
          className="pointer-events-auto fixed right-6 top-24 z-[200] w-80 rounded-lg border border-emerald-500/40 bg-slate-950/90 p-4 shadow-[0_0_15px_rgba(16,185,129,0.2)] backdrop-blur-md cursor-grab active:cursor-grabbing"
        >
          <div className="mb-4 flex items-center justify-between border-b border-emerald-500/30 pb-3">
            <span id="diagnostics-title" className="font-mono text-xs font-bold tracking-widest text-emerald-400 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              DEV DIAGNOSTICS
            </span>
            <button type="button" aria-label="Close Diagnostics" onClick={toggleDiagnostics} className="relative after:absolute after:content-[''] after:-inset-3 min-h-[32px] min-w-[32px] flex items-center justify-center text-emerald-400/70 hover:text-emerald-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50">
              <X size={14} />
            </button>
          </div>

          <div className="space-y-3 font-sans text-xs text-emerald-400/80">
            <div className="flex justify-between items-center border-b border-emerald-500/10 pb-2">
              <span className="text-emerald-400/50">SYSTEM CLOCK</span>
              <span>{time}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-emerald-500/10 pb-2">
              <span className="text-emerald-400/50">MEMORY HEAP</span>
              <span>~{memory} MB / 64 MB</span>
            </div>

            <div className="flex justify-between items-center border-b border-emerald-500/10 pb-2">
              <span className="text-emerald-400/50">WEBGL RENDER</span>
              <span>R3F Particles // {fps} FPS</span>
            </div>
            
            <div className="pt-2">
              <span className="text-emerald-400/50 block mb-2">ACTIVE DATA CHANNELS</span>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span>ServiceNow</span>
                  <span>{liveTelemetryData.serviceNowHealth.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Salesforce</span>
                  <span>{liveTelemetryData.salesforceHealth.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-amber-400">
                  <span>SAP</span>
                  <span className="animate-pulse text-red-400">DEGRADED ({liveTelemetryData.sapHealth.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
            <div className="pt-2 ">
              <span className="text-emerald-400/50 block mb-2">QUICK SIMULATOR LAUNCHERS</span>
              <div className="flex flex-col gap-1.5">
                <button type="button"
                  onClick={() => { toggleDiagnostics(); openStressTester(); }}
                  className="w-full py-1.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-400 font-sans text-xs font-bold text-left transition-colors duration-200 flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                >
                  <span>STRESS-TESTER</span>
                  <span className="text-xs opacity-70">SHIFT+S</span>
                </button>
                <button type="button"
                  onClick={() => { toggleDiagnostics(); openAdrs(); }}
                  className="w-full py-1.5 px-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded text-cyan-400 font-sans text-xs font-bold text-left transition-colors duration-200 flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                >
                  <span>ADR SIMULATOR</span>
                  <span className="text-xs opacity-70">ADR TREE</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4  pt-3 text-center font-sans text-xs text-emerald-400/40">
            [ESC / SHIFT+D TO DISMISS]
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
