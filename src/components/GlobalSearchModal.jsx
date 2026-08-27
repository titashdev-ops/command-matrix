import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Map, Database, Activity, Terminal, FileText, Code, Layout } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSystemCommand } from "../context/SystemCommandContext";
import { useSpatial, TABS } from "../SpatialContext";
import { useModal } from "../hooks/useModal";
import { CASE_STUDIES } from "../data/missions";
import { ADR_RECORDS } from "../data/adrs";
import { overlayFade, modalReveal } from "../lib/motion";

const cn = (...inputs) => twMerge(clsx(inputs));

const firstSentence = (text) => {
  const raw = (text || "").trim();
  if (!raw) return "";
  const cut = raw.split(". ")[0];
  return cut.endsWith(".") ? cut : `${cut}.`;
};

const SEARCH_DATA = [
  ...CASE_STUDIES.map(cs => ({
    id: cs.missionId,
    title: cs.projectName,
    lede: firstSentence(cs.executiveSummary),
    category: "Work",
    icon: Layout,
    path: "FLAGSHIP_MODAL",
    payload: cs
  })),
  ...ADR_RECORDS.map(adr => ({
    id: adr.id,
    title: adr.title,
    lede: adr.problem,
    category: "Records",
    icon: FileText,
    path: "ADR_MODAL",
    payload: adr
  })),
  { id: "nav-benchmarks", title: "Comparisons", lede: "Side by side. Simulations are labeled.", category: "Docs", icon: Activity, path: "TRUST_CENTER" },
  { id: "nav-discovery", title: "Write a note", lede: "A short intake that opens mail.", category: "Tools", icon: Terminal, path: "DISCOVERY_WIZARD" },
  { id: "nav-vector", title: "Work", lede: "Named systems on the home surface.", category: "Maps", icon: Map, path: "VECTOR" },
  { id: "nav-pointcloud", title: "Comparisons", lede: "The gallery of notes and records.", category: "Maps", icon: Activity, path: "POINT_CLOUD" },
  { id: "nav-airspace", title: "Engage", lede: "Resume and contact.", category: "Maps", icon: Database, path: "AIRSPACE" },
  { id: "nav-archexplorer", title: "Map", lede: "A spatial view of the systems.", category: "Tools", icon: Code, path: "ARCH_EXPLORER" },
];

const FEATURED = [
  ...SEARCH_DATA.filter(d => d.category === "Work").slice(0, 4),
  ...SEARCH_DATA.filter(d => d.category === "Records").slice(0, 2),
];

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const modalRef = useRef(null);
  const resultRefs = useRef([]);
  
  const { playClickSound, openEnterpriseExplorer, openAdrs, openFlagships, openContact } = useSystemCommand();
  const { setActiveTab } = useSpatial();
  
  useModal({ isOpen, onClose, ref: modalRef });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const filteredResults = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return SEARCH_DATA.filter(item => 
      (item.title || "").toLowerCase().includes(q) ||
      (item.lede || "").toLowerCase().includes(q) ||
      (item.category || "").toLowerCase().includes(q) ||
      (item.payload && JSON.stringify(item.payload).toLowerCase().includes(q))
    );
  }, [query]);

  const groupedResults = useMemo(() => {
    return filteredResults.reduce((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = [];
      acc[curr.category].push(curr);
      return acc;
    }, {});
  }, [filteredResults]);

  const flatResults = useMemo(() => {
    let arr = [];
    Object.values(groupedResults).forEach(group => arr.push(...group));
    return arr;
  }, [groupedResults]);

  const handleResultClick = (result) => {
    playClickSound();
    onClose();
    if (result.path === "ARCH_EXPLORER") {
      openEnterpriseExplorer();
    } else if (result.path === "ADR_MODAL") {
      openAdrs(result.id);
    } else if (result.path === "FLAGSHIP_MODAL") {
      openFlagships(result.payload);
    } else if (result.path === "TRUST_CENTER") {
      setActiveTab(TABS.TRUST_CENTER);
    } else if (result.path === "DISCOVERY_WIZARD") {
      openContact();
    } else if (TABS[result.path]) {
      setActiveTab(TABS[result.path]);
    }
  };

  const handleKeyDown = (e) => {
    const list = query ? flatResults : FEATURED;
    if (!list.length) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % list.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + list.length) % list.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleResultClick(list[selectedIndex]);
    }
  };

  useEffect(() => {
    if (resultRefs.current[selectedIndex]) {
      resultRefs.current[selectedIndex].scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      });
    }
  }, [selectedIndex]);

  const renderRow = (result, index) => {
    const Icon = result.icon;
    const isSelected = index === selectedIndex;
    return (
      <button type="button"
        key={result.id}
        ref={el => resultRefs.current[index] = el}
        onClick={() => handleResultClick(result)}
        onMouseEnter={() => setSelectedIndex(index)}
        className={cn(
          "flex w-full cursor-pointer items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors duration-200 focus-visible:outline-none",
          isSelected ? "bg-cyan-electric/10" : "hover:bg-cyan-electric/5"
        )}
      >
        <div className={cn("rounded-md p-2 mt-0.5", isSelected ? "bg-cyan-electric/20 text-cyan-electric" : "bg-obsidian-surface text-slate-400")}>
          <Icon size={16} />
        </div>
        <div className="min-w-0">
          <div className={cn("font-sans text-sm font-medium", isSelected ? "text-cyan-electric" : "text-slate-200")}>{result.title}</div>
          {result.lede && (
            <p className="mt-0.5 font-sans text-xs text-slate-500 leading-relaxed line-clamp-2">{result.lede}</p>
          )}
        </div>
      </button>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          {...overlayFade}
          className="pointer-events-auto fixed inset-0 z-[100] flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="global-search-title"
            initial={modalReveal.initial}
            animate={modalReveal.animate}
            exit={modalReveal.exit}
            transition={modalReveal.transition}
            onKeyDown={handleKeyDown}
            className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-obsidian-border bg-obsidian/80 backdrop-blur-2xl shadow-2xl"
          >
            <h2 id="global-search-title" className="sr-only">Archive</h2>
            <div className="flex items-center border-b border-obsidian-border/50 px-4 py-3">
              <Search size={20} className="text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Find a case…"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                className="w-full bg-transparent px-4 py-2 font-sans text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
              />
              <button type="button" aria-label="Close archive" onClick={() => { playClickSound(); onClose(); }} className="rounded-md p-2 relative after:absolute after:content-[''] after:-inset-3 min-h-[32px] min-w-[32px] flex items-center justify-center text-slate-400 hover:bg-obsidian-surface hover:text-slate-200 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 transition-colors duration-200">
                <X size={18} />
              </button>
            </div>
            {query && (
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {flatResults.length > 0 ? (
                  <div className="space-y-4 py-2">
                    {Object.entries(groupedResults).map(([category, items]) => (
                      <div key={category} className="space-y-1">
                        <div className="px-3 py-1 text-xs font-sans tracking-wide text-slate-500">{category}</div>
                        {items.map((result) => renderRow(result, flatResults.findIndex(r => r.id === result.id)))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
                    <Search size={32} className="text-slate-600" />
                    <p className="text-sm font-sans text-slate-400">
                      Nothing matches “<span className="text-slate-200">{query}</span>”
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {!query && (
              <div className="max-h-[60vh] overflow-y-auto p-4">
                <p className="kicker text-slate-500 px-1 pb-3">Open first</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {FEATURED.map((result, index) => {
                    const Icon = result.icon;
                    const isSelected = index === selectedIndex;
                    return (
                      <button type="button"
                        key={result.id}
                        ref={el => resultRefs.current[index] = el}
                        onClick={() => handleResultClick(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "relative overflow-hidden text-left rounded-xl border p-4 transition-colors duration-200 min-h-[96px]",
                          isSelected
                            ? "border-cyan-electric/40 bg-cyan-electric/10"
                            : "border-obsidian-border/70 bg-obsidian/50 hover:border-cyan-electric/25"
                        )}
                      >
                        <div className="dossier-sheen hidden md:block" aria-hidden="true" />
                        <div className="relative z-10 flex items-start gap-3">
                          <Icon size={16} className={isSelected ? "text-cyan-electric" : "text-slate-500"} />
                          <div className="min-w-0">
                            <div className="font-display text-sm font-bold tracking-[-0.02em] text-white">{result.title}</div>
                            {result.lede && (
                              <p className="mt-1 font-sans text-xs text-slate-500 leading-relaxed line-clamp-2">{result.lede}</p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
