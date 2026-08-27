import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Map, Database, Activity, Terminal, FileText, Code, Layout, ArrowRight } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSystemCommand } from "../context/SystemCommandContext";
import { useSpatial, TABS } from "../SpatialContext";
import { useModal } from "../hooks/useModal";
import { CASE_STUDIES } from "../data/missions";
import { ADR_RECORDS } from "../data/adrs";
import { overlayFade, modalReveal, galleryReveal } from "../lib/motion";

const cn = (...inputs) => twMerge(clsx(inputs));

const firstSentence = (text) => {
  const raw = (text || "").trim();
  if (!raw) return "";
  const cut = raw.split(". ")[0];
  return cut.endsWith(".") ? cut : `${cut}.`;
};

const SEARCH_DATA = [
  ...CASE_STUDIES.map((cs) => ({
    id: cs.missionId,
    title: cs.projectName,
    lede: firstSentence(cs.executiveSummary),
    category: "Work",
    icon: Layout,
    path: "FLAGSHIP_MODAL",
    payload: cs,
  })),
  ...ADR_RECORDS.map((adr) => ({
    id: adr.id,
    title: adr.title,
    lede: adr.problem,
    category: "Records",
    icon: FileText,
    path: "ADR_MODAL",
    payload: adr,
  })),
  { id: "nav-benchmarks", title: "Comparisons", lede: "Side by side. Simulations are labeled.", category: "Docs", icon: Activity, path: "TRUST_CENTER" },
  { id: "nav-discovery", title: "Write a note", lede: "A short intake that opens mail.", category: "Tools", icon: Terminal, path: "DISCOVERY_WIZARD" },
  { id: "nav-vector", title: "Work", lede: "Named systems on the home surface.", category: "Maps", icon: Map, path: "VECTOR" },
  { id: "nav-pointcloud", title: "Comparisons", lede: "The gallery of notes and records.", category: "Maps", icon: Activity, path: "POINT_CLOUD" },
  { id: "nav-airspace", title: "Engage", lede: "Resume and contact.", category: "Maps", icon: Database, path: "AIRSPACE" },
  { id: "nav-archexplorer", title: "Map", lede: "A spatial view of the systems.", category: "Tools", icon: Code, path: "ARCH_EXPLORER" },
];

const FEATURED = [
  ...SEARCH_DATA.filter((d) => d.category === "Work").slice(0, 4),
  ...SEARCH_DATA.filter((d) => d.category === "Records").slice(0, 2),
];

const ARCHIVE_RAIL = ["Work", "Records", "Maps", "Docs"];

function FeaturedTile({ result, isSelected, onClick, onHover, wide = false, resultRef }) {
  const Icon = result.icon;
  return (
    <button
      type="button"
      ref={resultRef}
      onClick={onClick}
      onMouseEnter={onHover}
      className={cn(
        "group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-none",
        wide ? "min-h-[132px]" : "min-h-[104px]",
        isSelected
          ? "border-cyan-electric/45 bg-cyan-electric/10 shadow-[0_0_30px_rgba(0,240,255,0.08)]"
          : "border-obsidian-border/70 bg-obsidian/55 hover:border-cyan-electric/25 hover:bg-cyan-electric/5"
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,240,255,0.08),transparent_35%,rgba(168,85,247,0.04))] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="dossier-sheen hidden md:block" aria-hidden="true" />
      <div className="relative z-10 flex items-start gap-3">
        <div className={cn(
          "rounded-lg border p-2 transition-colors duration-200",
          isSelected ? "border-cyan-electric/40 bg-cyan-electric/15 text-cyan-electric" : "border-obsidian-border bg-slate-950 text-slate-400"
        )}>
          <Icon size={16} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-obsidian-border/70 bg-slate-950 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-slate-500">
              {result.category}
            </span>
            {wide && <ArrowRight size={11} className="text-cyan-electric/60" />}
          </div>
          <div className={cn("mt-2 font-display font-bold tracking-[-0.03em] text-white", wide ? "text-base sm:text-lg" : "text-sm")}>
            {result.title}
          </div>
          {result.lede && (
            <p className={cn("mt-1 font-sans text-xs text-slate-500 leading-relaxed line-clamp-2", wide && "max-w-lg")}>{result.lede}</p>
          )}
        </div>
      </div>
    </button>
  );
}

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
    return SEARCH_DATA.filter(
      (item) =>
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
    const arr = [];
    Object.values(groupedResults).forEach((group) => arr.push(...group));
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

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % list.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + list.length) % list.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleResultClick(list[selectedIndex]);
    }
  };

  useEffect(() => {
    if (resultRefs.current[selectedIndex]) {
      resultRefs.current[selectedIndex].scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  const renderRow = (result, index) => {
    const Icon = result.icon;
    const isSelected = index === selectedIndex;
    return (
      <button
        type="button"
        key={result.id}
        ref={(el) => (resultRefs.current[index] = el)}
        onClick={() => handleResultClick(result)}
        onMouseEnter={() => setSelectedIndex(index)}
        className={cn(
          "flex w-full cursor-pointer items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-200 focus-visible:outline-none",
          isSelected ? "bg-cyan-electric/10" : "hover:bg-cyan-electric/5"
        )}
      >
        <div className={cn("rounded-md p-2 mt-0.5", isSelected ? "bg-cyan-electric/20 text-cyan-electric" : "bg-obsidian-surface text-slate-400")}>
          <Icon size={16} />
        </div>
        <div className="min-w-0">
          <div className={cn("font-sans text-sm font-medium", isSelected ? "text-cyan-electric" : "text-slate-200")}>{result.title}</div>
          {result.lede && <p className="mt-0.5 font-sans text-xs text-slate-500 leading-relaxed line-clamp-2">{result.lede}</p>}
        </div>
      </button>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          {...overlayFade}
          className="pointer-events-auto fixed inset-0 z-[100] flex items-start justify-center bg-black/65 px-3 pt-20 backdrop-blur-sm sm:px-4 sm:pt-24"
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
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-obsidian-border bg-obsidian/84 shadow-2xl backdrop-blur-2xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,240,255,0.12),transparent_35%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_30%)]" />
            <div className="relative z-10 border-b border-obsidian-border/60 px-4 py-4 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-1.5">
                  <p className="kicker text-cyan-electric/70">Archive</p>
                  <h2 id="global-search-title" className="font-display text-2xl font-extrabold tracking-[-0.04em] text-white sm:text-3xl">
                    Find a case, record, or map
                  </h2>
                  <p className="max-w-2xl font-sans text-sm text-slate-400">
                    Search opens as cards. Labels stay short. Results stay honest.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ARCHIVE_RAIL.map((label) => (
                    <span key={label} className="rounded-full border border-obsidian-border bg-slate-950/70 px-2.5 py-1 font-sans text-[10px] uppercase tracking-[0.22em] text-slate-400">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-obsidian-border/70 bg-slate-950/65 px-4 py-3">
                <Search size={18} className="text-slate-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Find a case…"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="w-full bg-transparent font-sans text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  aria-label="Close archive"
                  onClick={() => {
                    playClickSound();
                    onClose();
                  }}
                  className="relative flex min-h-[32px] min-w-[32px] items-center justify-center rounded-md p-2 text-slate-400 transition-colors duration-200 after:absolute after:-inset-3 after:content-[''] hover:bg-obsidian-surface hover:text-slate-200 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {query ? (
              <div className="max-h-[60vh] overflow-y-auto p-3 sm:p-4">
                {flatResults.length > 0 ? (
                  <div className="space-y-5 py-1">
                    {Object.entries(groupedResults).map(([category, items]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center gap-2 px-1 text-xs font-sans tracking-[0.18em] text-slate-500 uppercase">
                          <span className="h-px w-8 bg-slate-700" />
                          {category}
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {items.map((result) => renderRow(result, flatResults.findIndex((r) => r.id === result.id)))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-3 py-12 text-center">
                    <Search size={32} className="text-slate-600" />
                    <p className="font-sans text-sm text-slate-400">
                      Nothing matches “<span className="text-slate-200">{query}</span>”
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto p-3 sm:p-4">
                <div className="rounded-2xl border border-cyan-electric/15 bg-slate-950/55 p-4 sm:p-5">
                  <p className="kicker text-cyan-electric/70">Open first</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {FEATURED.slice(0, 1).map((result, index) => (
                      <FeaturedTile
                        key={result.id}
                        result={result}
                        isSelected={index === selectedIndex}
                        onClick={() => handleResultClick(result)}
                        onHover={() => setSelectedIndex(index)}
                        wide
                        resultRef={(el) => (resultRefs.current[index] = el)}
                      />
                    ))}
                    <div className="grid gap-2">
                      {FEATURED.slice(1, 3).map((result, index) => {
                        const nextIndex = index + 1;
                        return (
                          <FeaturedTile
                            key={result.id}
                            result={result}
                            isSelected={nextIndex === selectedIndex}
                            onClick={() => handleResultClick(result)}
                            onHover={() => setSelectedIndex(nextIndex)}
                            resultRef={(el) => (resultRefs.current[nextIndex] = el)}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {FEATURED.slice(3).map((result, index) => {
                    const nextIndex = index + 3;
                    return (
                      <FeaturedTile
                        key={result.id}
                        result={result}
                        isSelected={nextIndex === selectedIndex}
                        onClick={() => handleResultClick(result)}
                        onHover={() => setSelectedIndex(nextIndex)}
                        resultRef={(el) => (resultRefs.current[nextIndex] = el)}
                      />
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
