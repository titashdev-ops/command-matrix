import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crosshair,
  Activity,
  MapPin,
  Compass,
  Layers,
  Navigation,
  Menu,
  X,
  FileText,
} from "lucide-react";
import { useSpatial, TABS } from "../SpatialContext";
import { useSystemCommand } from "../context/SystemCommandContext";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

const TAB_META = {
  [TABS.VECTOR]: { label: "Work", icon: Compass, color: "text-cyan-electric", border: "border-cyan-electric/30", bg: "bg-cyan-electric/5" },
  [TABS.POINT_CLOUD]: { label: "Evidence", icon: Layers, color: "text-emerald-glow", border: "border-emerald-glow/30", bg: "bg-emerald-glow/5" },
  [TABS.AIRSPACE]: { label: "Engage", icon: Navigation, color: "text-amber-400", border: "border-amber-400/30", bg: "bg-amber-400/5" },
  [TABS.TRUST_CENTER]: { label: "ADRs", icon: FileText, color: "text-emerald-400", border: "border-emerald-400/30", bg: "bg-emerald-400/5" },
};

export default function Navbar({ onOpenSearch }) {
  const { activeTab, setActiveTab } = useSpatial();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const { openContact, playClickSound, openResume } = useSystemCommand();

  const handleTabSwitch = (tabKey) => {
    playClickSound();
    setActiveTab(tabKey);
  };

  const handleSearchClick = () => {
    playClickSound();
    onOpenSearch();
  };

  React.useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setIsDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDrawerOpen]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed left-0 right-0 top-0 z-50 border-b border-cyan-electric/15 bg-obsidian/70 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,240,255,0.12)]"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:px-12">
          
          
          {/* Mobile Hamburger */}
          <button type="button"
            aria-label="Open Menu"
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => { playClickSound(); setIsDrawerOpen(true); }}
            className="md:hidden pointer-events-auto flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg border border-obsidian-border bg-obsidian-surface/60 text-slate-400 transition-colors duration-200 hover:text-slate-200 mr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
          >
            <Menu size={20} />
          </button>
          {/* Brand */}
          <div className="pointer-events-auto flex items-center gap-3">
            <div className="relative flex h-11 w-11 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-cyan-electric/30 bg-cyan-electric/10 shadow-[0_0_18px_rgba(0,240,255,0.25)]">
              <span className="absolute inset-0 rounded-lg bg-cyan-electric/20 blur-md animate-[hud-breathe_4s_ease-in-out_infinite]" />
              <Crosshair size={16} className="relative text-cyan-electric" />
            </div>
            <div className="min-w-0">
              <div className="font-mono text-xs font-bold tracking-widest text-white">
                COMMAND MATRIX
              </div>
              <div className="font-mono text-[10px] tracking-wider text-slate-500 sm:text-xs">
                Titash Dev · Architect
              </div>
            </div>
          </div>

          {/* Center: Global Mode Tabs */}
          <div className="pointer-events-auto hidden items-center gap-1 rounded-xl border border-cyan-electric/15 bg-obsidian-surface/50 p-1 md:flex shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            {Object.values(TABS).map((tabKey) => {
              const meta = TAB_META[tabKey];
              const Icon = meta.icon;
              const isActive = activeTab === tabKey;

              return (
                <button type="button"
                  key={tabKey}
                  onClick={() => handleTabSwitch(tabKey)}
                  className={cn(
                    "relative z-10 inline-flex min-h-[48px] min-w-[48px] items-center gap-2 rounded-lg px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wider transition-colors duration-300",
                    isActive
                      ? cn(meta.color)
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className={cn("absolute inset-0 rounded-lg border", meta.border, meta.bg)}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon size={14} className="relative" />
                  <span className="relative">{meta.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right: System Status Badges & CTA */}
          <div className="pointer-events-auto flex items-center gap-3">
            <button type="button"
              aria-label="Global Search (Ctrl or Cmd K)"
              onClick={handleSearchClick}
              className="flex h-11 w-11 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-obsidian-border bg-obsidian-surface/60 text-slate-400 transition-colors duration-200 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>

            {/* Portfolio status — not live ops */}
            <div className="hidden items-center gap-2 rounded-full border border-cyan-electric/20 bg-cyan-electric/5 px-3 py-1.5 lg:flex pointer-events-none">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-electric/50 animate-[hud-breathe_3.5s_ease-in-out_infinite]" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-electric" />
              </span>
              <span className="font-mono text-xs tracking-wider text-cyan-electric/90">
                PORTFOLIO
              </span>
            </div>

            {/* Location */}
            <div className="hidden items-center gap-1.5 rounded-full border border-obsidian-border bg-obsidian-surface/60 px-3 py-1.5 xl:flex pointer-events-none">
              <MapPin size={12} className="text-slate-400" />
              <span className="font-mono text-xs tracking-wider text-slate-400">
                BLR [IN]
              </span>
            </div>

            
            {/* Standard View / Resume */}
            <button type="button"
              onClick={openResume}
              aria-label="Open resume"
              className="group relative hidden sm:flex min-h-[48px] items-center gap-2 overflow-hidden rounded-full border border-slate-700/50 bg-slate-800/30 px-4 py-1.5 sm:min-h-[auto] font-mono text-xs font-bold tracking-widest text-slate-300 transition-all hover:bg-slate-700 hover:text-white duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
            >
              <FileText size={14} />
              RESUME
            </button>
            {/* Connect CTA */}
            <button type="button"
              onClick={openContact}
              className="group relative flex min-h-[48px] items-center gap-2 overflow-hidden rounded-full border border-cyan-electric/60 bg-cyan-electric/15 px-4 py-1.5 sm:min-h-[auto] font-mono text-xs font-bold tracking-widest text-cyan-electric transition-all hover:bg-cyan-electric/25 hover:shadow-cyan-glow hover:scale-105 active:scale-95 duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
            >
              <Activity size={14} />
              CONTACT
            </button>
          </div>
        </div>
      </motion.nav>

      
      
      {/* Mobile Slide-Over Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsDrawerOpen(false)}
              className="pointer-events-auto fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="pointer-events-auto fixed bottom-0 left-0 top-0 z-[101] flex w-[80%] max-w-sm flex-col border-r border-obsidian-border/80 bg-obsidian shadow-2xl md:hidden"
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
            >
              <div className="flex items-center justify-between border-b border-obsidian-border/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-electric/20 bg-cyan-electric/5">
                    <Crosshair size={16} className="text-cyan-electric" />
                  </div>
                  <div>
                    <div className="font-mono text-xs font-bold tracking-widest text-white">
                      TITASH DEV
                    </div>
                  </div>
                </div>
                <button type="button"
                  aria-label="Close Menu"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-lg text-slate-400 hover:bg-obsidian-surface/60 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-2 font-sans font-medium text-slate-400 uppercase tracking-wider text-slate-500">
                  Navigation
                </div>
                <div className="flex flex-col gap-2">
                  {Object.values(TABS).map((tabKey) => {
                    const meta = TAB_META[tabKey];
                    const Icon = meta.icon;
                    const isActive = activeTab === tabKey;
                    return (
                      <button type="button"
                        key={tabKey}
                        onClick={() => {
                          handleTabSwitch(tabKey);
                          setIsDrawerOpen(false);
                        }}
                        className={cn(
                          "inline-flex min-h-[48px] items-center gap-3 rounded-lg px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wider transition-all duration-300",
                          isActive
                            ? cn("border", meta.border, meta.bg, meta.color)
                            : "border border-transparent text-slate-500 hover:bg-obsidian-surface/40 hover:text-slate-300"
                        )}
                      >
                        <Icon size={16} />
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-obsidian-border/60 p-4 flex flex-col gap-3">
                <button type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    openResume();
                  }}
                  aria-label="Open resume"
                  className="group relative flex min-h-[48px] w-full items-center justify-center gap-2 overflow-hidden rounded-lg border border-slate-700/50 bg-slate-800/30 px-4 py-2 font-mono text-xs font-bold tracking-widest text-slate-300 transition-all duration-200 hover:bg-slate-700 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                >
                  <FileText size={16} />
                  RESUME
                </button>
                <button type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    openContact();
                  }}
                  className="group relative flex min-h-[48px] w-full items-center justify-center gap-2 overflow-hidden rounded-lg border border-cyan-electric/50 bg-cyan-electric/10 px-4 py-2 font-mono text-xs font-bold tracking-widest text-cyan-electric transition-all duration-200 hover:bg-cyan-electric/20 hover:shadow-cyan-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                >
                  <Activity size={16} />
                  CONTACT
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
