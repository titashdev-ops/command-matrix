import React, { useState } from "react";
import { AnimatePresence, motion, MotionConfig, LayoutGroup } from "framer-motion";
import { SpatialProvider, useSpatial, TABS } from "./SpatialContext";
import { SystemCommandProvider } from "./context/SystemCommandContext";
import SpatialTelemetryModule from "./SpatialTelemetryModule";
import AiArchitectureModule from "./AiArchitectureModule";
import SaasOperationsModule from "./components/SaasOperationsModule";
import TrustCenter from "./components/TrustCenter";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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

const TAB_TRANSITION = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.85,
};

function SpatialAtmosphere() {
  const [allowCanvas, setAllowCanvas] = React.useState(false);

  React.useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAllowCanvas(wide && fine && !reduce);
  }, []);

  if (!allowCanvas) {
    return (
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-obsidian to-obsidian"
        aria-hidden="true"
      />
    );
  }

  return (
    <React.Suspense fallback={null}>
      <SpatialCanvasBackground />
    </React.Suspense>
  );
}

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
        Skip to work
      </a>
      <Navbar onOpenSearch={onOpenSearch} />

      <main id="hud-main" className="pointer-events-none flex-1 mx-auto w-full max-w-7xl px-4 pb-24 pt-28 md:px-6 lg:px-12 lg:pt-28">
        <AnimatePresence mode="wait">
          {activeTab === TABS.VECTOR && (
            <motion.div
              key="vector"
              initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, scale: 0.99, filter: "blur(8px)" }}
              transition={TAB_TRANSITION}
            >
              <SpatialTelemetryModule />
            </motion.div>
          )}

          {activeTab === TABS.POINT_CLOUD && (
            <motion.div
              key="point-cloud"
              initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, scale: 0.99, filter: "blur(8px)" }}
              transition={TAB_TRANSITION}
            >
              <AiArchitectureModule />
            </motion.div>
          )}

          {activeTab === TABS.AIRSPACE && (
            <motion.div
              key="airspace"
              initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, scale: 0.99, filter: "blur(8px)" }}
              transition={TAB_TRANSITION}
            >
              <SaasOperationsModule />
            </motion.div>
          )}
          {activeTab === TABS.TRUST_CENTER && (
            <motion.div
              key="trust-center"
              initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, scale: 0.99, filter: "blur(8px)" }}
              transition={TAB_TRANSITION}
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const handleOpenSearch = () => setIsSearchOpen(true);
  const handleCloseSearch = () => setIsSearchOpen(false);

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
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
      <SystemCommandProvider>
        <SpatialProvider>
          <div className="relative min-h-[100dvh] w-full overflow-x-hidden bg-obsidian">
            <div className="fixed inset-0 z-0 pointer-events-none md:pointer-events-auto" aria-hidden="true">
              <SpatialAtmosphere />
              <div className="hud-grid" />
            </div>
            <div className="hud-vignette" aria-hidden="true" />
            <div className="hud-scanlines hidden md:block" aria-hidden="true" />
            <div className="hud-grain hidden md:block" aria-hidden="true" />
            <span className="hud-corner hud-tl hidden md:block" aria-hidden="true" />
            <span className="hud-corner hud-tr hidden md:block" aria-hidden="true" />
            <span className="hud-corner hud-bl hidden md:block" aria-hidden="true" />
            <span className="hud-corner hud-br hidden md:block" aria-hidden="true" />

            <OverlayRouter onOpenSearch={handleOpenSearch} />
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
      </LayoutGroup>
    </MotionConfig>
  );
}
