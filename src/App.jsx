import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SpatialProvider, useSpatial, TABS } from "./SpatialContext";
import { SystemCommandProvider } from "./context/SystemCommandContext";
import SpatialTelemetryModule from "./SpatialTelemetryModule";
import AiArchitectureModule from "./AiArchitectureModule";
import SaasOperationsModule from "./components/SaasOperationsModule";
import TrustCenter from "./components/TrustCenter";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import BootSequence from "./components/BootSequence";
import CursorFollower from "./components/CursorFollower";

const SpatialCanvasBackground = React.lazy(() => import("./SpatialCanvasBackground"));
import ContactModal from "./components/ContactModal";
import GlobalSearchModal from "./components/GlobalSearchModal";
import DiagnosticsOverlay from "./components/DiagnosticsOverlay";
import EnterpriseArchitectureExplorer from "./components/EnterpriseArchitectureExplorer";
import EngineeringDecisionsModal from "./components/EngineeringDecisionsModal";
import TelemetryStressTesterModal from "./components/TelemetryStressTesterModal";
import ResumeModal from "./components/ResumeModal";
import FlagshipProjectsModal from "./components/FlagshipProjectsModal";


/* ─────────────────────────────────────────────────────────────
   App.jsx — Master Orchestrator
   Architecture: Fixed R3F canvas (z-0) + Scrolling HTML overlay (z-10)
   Event Policy: Overlay root is pointer-events-none.
                 Interactive elements carry pointer-events-auto.
   ───────────────────────────────────────────────────────────── */

function OverlayRouter({ onOpenSearch }) {
  const { activeTab } = useSpatial();

  React.useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [activeTab]);

  return (
    <div className="relative z-10 flex min-h-[100dvh] w-full flex-col overflow-x-hidden">
      <a
        href="#hud-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-obsidian-surface focus:px-3 focus:py-2 focus:text-cyan-electric focus:outline-none focus:ring-2 focus:ring-cyan-electric"
      >
        Skip to command surface
      </a>
      <Navbar onOpenSearch={onOpenSearch} />

      <main id="hud-main" className="pointer-events-none flex-1 mx-auto w-full max-w-7xl px-4 pb-24 lg:pb-24 pt-32 md:px-6 lg:px-12 lg:pb-24 lg:pt-28">
        <AnimatePresence mode="wait">
          {activeTab === TABS.VECTOR && (
            <motion.div
              key="vector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <SpatialTelemetryModule />
            </motion.div>
          )}

          {activeTab === TABS.POINT_CLOUD && (
            <motion.div
              key="point-cloud"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <AiArchitectureModule />
            </motion.div>
          )}

          {activeTab === TABS.AIRSPACE && (
            <motion.div
              key="airspace"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <SaasOperationsModule />
            </motion.div>
          )}
          {activeTab === TABS.TRUST_CENTER && (
            <motion.div
              key="trust-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <TrustCenter />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
}

export default function App() {

  const [isBooting, setIsBooting] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    try {
      return sessionStorage.getItem("hud_booted") !== "1";
    } catch {
      return true;
    }
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const handleOpenSearch = () => setIsSearchOpen(true);
  const handleCloseSearch = () => setIsSearchOpen(false);

  const finishBoot = React.useCallback(() => {
    try {
      sessionStorage.setItem("hud_booted", "1");
    } catch {}
    setIsBooting(false);
  }, []);

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <SystemCommandProvider>
      <SpatialProvider>
        <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-obsidian">
          <div className="fixed inset-0 z-0 pointer-events-none md:pointer-events-auto" aria-hidden="true">
            <React.Suspense fallback={null}>
              <SpatialCanvasBackground />
            </React.Suspense>
          </div>

          <OverlayRouter onOpenSearch={handleOpenSearch} />
          {isBooting && <BootSequence onComplete={finishBoot} />}
          <CursorFollower />

          <ContactModal />
          <GlobalSearchModal isOpen={isSearchOpen} onClose={handleCloseSearch} />
          <DiagnosticsOverlay />
          <EnterpriseArchitectureExplorer />
          <EngineeringDecisionsModal />
          <TelemetryStressTesterModal />
          <ResumeModal />
          <FlagshipProjectsModal />
        </div>
      </SpatialProvider>
    </SystemCommandProvider>
  );
}
