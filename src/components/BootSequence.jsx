import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BootSequence({ onComplete }) {
  const [logs, setLogs] = useState([]);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const bootLogs = [
      "INIT COMMAND SURFACE...",
      "MOUNTING HUD OVERLAY...",
      "LOADING CASE STUDIES...",
      "ARMING INTERACTIVE MODULES...",
      "DEMO TELEMETRY LOOP STANDBY...",
      "SYSTEMS NOMINAL.",
      "READY.",
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsDone(true);
          setTimeout(onComplete, 180);
        }, 220);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="boot-sequence"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-obsidian text-cyan-electric pointer-events-auto"
          onClick={() => {
            setIsDone(true);
            setTimeout(onComplete, 200);
          }}
        >
          <div className="w-full max-w-2xl px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-electric">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-electric opacity-20" />
                <div className="h-4 w-4 rounded-full bg-cyan-electric shadow-cyan-glow animate-pulse" />
              </div>
            </motion.div>
            <div className="font-sans text-sm sm:text-base space-y-2">
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-emerald-glow">{'>'}</span>
                  {log}
                </motion.div>
              ))}
              <div className="pt-4 font-mono text-[10px] tracking-widest text-slate-500">
                CLICK TO SKIP
              </div>
              <motion.div 
                animate={{ opacity: [1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 bg-cyan-electric mt-2"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
