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

const cn = (...inputs) => twMerge(clsx(inputs));

const SEARCH_DATA = [
  ...CASE_STUDIES.map(cs => ({
    id: cs.missionId,
    title: cs.projectName,
    category: "Work",
    icon: Layout,
    path: "FLAGSHIP_MODAL",
    payload: cs
  })),
  ...ADR_RECORDS.map(adr => ({
    id: adr.id,
    title: adr.title,
    category: "Records",
    icon: FileText,
    path: "ADR_MODAL",
    payload: adr
  })),
  { id: "nav-benchmarks", title: "Evidence", category: "Docs", icon: Activity, path: "TRUST_CENTER" },
  { id: "nav-discovery", title: "Start a brief", category: "Tools", icon: Terminal, path: "DISCOVERY_WIZARD" },
  { id: "nav-vector", title: "Work", category: "Maps", icon: Map, path: "VECTOR" },
  { id: "nav-pointcloud", title: "Evidence", category: "Maps", icon: Activity, path: "POINT_CLOUD" },
  { id: "nav-airspace", title: "Engage", category: "Maps", icon: Database, path: "AIRSPACE" },
  { id: "nav-archexplorer", title: "Architecture", category: "Tools", icon: Code, path: "ARCH_EXPLORER" },
  { id: "nav-docs", title: "Docs", category: "Docs", icon: FileText, path: "TRUST_CENTER" },
  { id: "nav-concepts", title: "Concepts", category: "Docs", icon: Database, path: "ARCH_EXPLORER" },
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

  const handleKeyDown = (e) => {
    if (!flatResults.length) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleResultClick(flatResults[selectedIndex]);
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

  const handleFilterClick = (filter) => {
    playClickSound();
    setQuery(filter);
  };

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="pointer-events-auto fixed inset-0 z-[100] flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="global-search-title"
            initial={{ opacity: 0, scale: 0.94, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -15 }}
            transition={{ type: "spring", stiffness: 340, damping: 22, mass: 0.8 }}
            onKeyDown={handleKeyDown}
            className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-obsidian-border bg-obsidian/80 backdrop-blur-2xl shadow-2xl"
          >
            <h2 id="global-search-title" className="sr-only">Global Search</h2>
            <div className="flex items-center border-b border-obsidian-border/50 px-4 py-3">
              <Search size={20} className="text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search systems, logs, incidents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent px-4 py-2 font-sans text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
              />
              <button type="button" aria-label="Close Search" onClick={() => { playClickSound(); onClose(); }} className="rounded-md p-2 relative after:absolute after:content-[''] after:-inset-3 min-h-[32px] min-w-[32px] flex items-center justify-center text-slate-400 hover:bg-obsidian-surface hover:text-slate-200 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 transition-colors duration-200">
                <X size={18} />
              </button>
            </div>
            {query && (
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {flatResults.length > 0 ? (
                  <div className="space-y-4 py-2">
                    {Object.entries(groupedResults).map(([category, items]) => (
                      <div key={category} className="space-y-1">
                        <div className="px-4 py-1 text-xs font-sans font-medium text-slate-500 uppercase tracking-wider">{category}</div>
                        {items.map((result) => {
                          const Icon = result.icon;
                          const index = flatResults.findIndex(r => r.id === result.id);
                          const isSelected = index === selectedIndex;
                          return (
                            <button type="button"
                              key={result.id}
                              ref={el => resultRefs.current[index] = el}
                              onClick={() => handleResultClick(result)}
                              onMouseEnter={() => setSelectedIndex(index)}
                              className={cn(
                                "flex w-full cursor-pointer items-center justify-between rounded-md px-4 py-3 text-left transition-colors duration-200 focus-visible:outline-none",
                                isSelected ? "bg-cyan-electric/10 text-cyan-electric" : "hover:bg-cyan-electric/5 text-slate-300"
                              )}
                            >
                              <div className="flex items-center gap-4">
                                <div className={cn("rounded-md p-2", isSelected ? "bg-cyan-electric/20 text-cyan-electric" : "bg-obsidian-surface text-slate-400")}>
                                  <Icon size={16} />
                                </div>
                                <div>
                                  <div className={cn("font-sans text-sm font-medium", isSelected ? "text-cyan-electric" : "text-slate-200")}>{result.title}</div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
                    <Search size={32} className="text-slate-600" />
                    <p className="text-sm font-sans text-slate-400">
                      No results found for "<span className="text-slate-200">{query}</span>"
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {!query && (
              <div className="p-4 bg-obsidian-surface/30">
                <div className="text-xs font-sans font-medium text-slate-500 uppercase tracking-wider">
                  Quick filters
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Work", "Records", "Maps", "Docs"].map(filter => (
                    <button type="button" 
                      key={filter} 
                      onClick={() => handleFilterClick(filter)}
                      className="rounded border border-obsidian-border bg-obsidian-surface/50 px-3 py-1.5 font-sans text-xs font-medium text-slate-300 hover:bg-obsidian-border hover:text-slate-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
