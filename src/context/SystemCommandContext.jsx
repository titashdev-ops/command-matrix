import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import { buildSafeMailtoPayload, safeAudioContextTrigger, playTactileClickSound, playTactileAudio } from "../utils/safety";

const SystemCommandContext = createContext(null);

export function SystemCommandProvider({ children }) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isEnterpriseExplorerOpen, setIsEnterpriseExplorerOpen] = useState(false);
  const [isAdrsOpen, setIsAdrsOpen] = useState(false);
  const [targetAdrId, setTargetAdrId] = useState(null);
  const [isFlagshipsOpen, setIsFlagshipsOpen] = useState(false);
  const [activeFlagshipMission, setActiveFlagshipMission] = useState(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [activeIncidentFilter, setActiveIncidentFilter] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("cmd_activeFilter") || "ALL";
      } catch (e) {
        return "ALL";
      }
    }
    return "ALL";
  });

  useEffect(() => {
    try {
      localStorage.setItem("cmd_activeFilter", activeIncidentFilter);
    } catch (e) {}
  }, [activeIncidentFilter]);
  const [activeSpatialCoordinates, setActiveSpatialCoordinates] = useState({ lat: 12.9716, lng: 77.5946, alt: 400 });

  const [isAudioArmed, setIsAudioArmed] = useState(false);
  const [telemetryString, setTelemetryString] = useState("12°58'N 77°35'E // DEMO HUD // CLIENT LOOP");
  const [audioPulse, setAudioPulse] = useState(false);
  const triggerAudioPulse = useCallback(() => {
    setAudioPulse(true);
    setTimeout(() => setAudioPulse(false), 150);
  }, []);
  const audioInitialized = useRef(false);
  const audioCtxRef = useRef(null);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!audioInitialized.current) {
        audioInitialized.current = true;
        safeAudioContextTrigger(audioCtxRef);
        playTactileAudio(1200, "sine", 0.05);
        setIsAudioArmed(true);
        window.removeEventListener("click", handleFirstInteraction);
        window.removeEventListener("keydown", handleFirstInteraction);
      }
    };
    window.addEventListener("click", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);
    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    };
  }, []);

  const [liveTelemetryData, setLiveTelemetryData] = useState({
    tick: 0,
    mode: "CLIENT_DEMO",
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === "e") {
        playTactileClickSound();
        setIsEnterpriseExplorerOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Client-side demo heartbeat. No server. Numbers are synthetic HUD motion.
  useEffect(() => {
    const id = window.setInterval(() => {
      setLiveTelemetryData((prev) => ({
        ...prev,
        tick: prev.tick + 1,
        mode: "CLIENT_DEMO",
      }));

      setActiveSpatialCoordinates((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
        alt: Math.max(0, Math.min(1000, prev.alt + (Math.random() - 0.5) * 5)),
      }));

      const newAlt = Math.floor(400 + (Math.random() - 0.5) * 15);
      setTelemetryString(`12°58'N 77°35'E // ${newAlt} FT AGL // DEMO LOOP`);
    }, 1500);
    return () => window.clearInterval(id);
  }, []);

  const playHoverBlip = useCallback(() => {
    try {
      const ctx = audioCtxRef.current;
      if (!ctx || ctx.state !== "running") return;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {}
  }, []);

  useEffect(() => {
    const handleMouseOver = (e) => {
      if (
        e.target.tagName &&
        (e.target.tagName.toLowerCase() === "button" ||
          e.target.tagName.toLowerCase() === "a" ||
          e.target.closest("button") ||
          e.target.closest("a"))
      ) {
        playHoverBlip();
      }
    };
    window.addEventListener("mouseover", handleMouseOver);
    return () => window.removeEventListener("mouseover", handleMouseOver);
  }, [playHoverBlip]);

  const triggerP1Alert = useCallback(() => {
    try {
      const ctx = safeAudioContextTrigger(audioCtxRef);
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.warn("Audio alert blocked by browser.", e);
    }
  }, []);

  const value = {
    isContactOpen,
    setIsContactOpen,
    openContact: () => {
      triggerAudioPulse();
      playTactileClickSound();
      setIsContactOpen(true);
    },
    closeContact: () => {
      triggerAudioPulse();
      playTactileClickSound();
      setIsContactOpen(false);
    },
    isEnterpriseExplorerOpen,
    setIsEnterpriseExplorerOpen,
    openEnterpriseExplorer: () => {
      triggerAudioPulse();
      playTactileClickSound();
      setIsEnterpriseExplorerOpen(true);
    },
    closeEnterpriseExplorer: () => {
      triggerAudioPulse();
      playTactileClickSound();
      setIsEnterpriseExplorerOpen(false);
    },
    isAdrsOpen,
    setIsAdrsOpen,
    targetAdrId,
    setTargetAdrId,
    isFlagshipsOpen,
    setIsFlagshipsOpen,
    activeFlagshipMission,
    setActiveFlagshipMission,
    isResumeOpen,
    setIsResumeOpen,
    openFlagships: (mission = null) => {
      triggerAudioPulse();
      playTactileClickSound();
      setActiveFlagshipMission(mission);
      setIsFlagshipsOpen(true);
    },
    closeFlagships: () => {
      triggerAudioPulse();
      playTactileClickSound();
      setIsFlagshipsOpen(false);
      setTimeout(() => setActiveFlagshipMission(null), 300);
    },
    openResume: () => {
      triggerAudioPulse();
      playTactileClickSound();
      setIsResumeOpen(true);
    },
    closeResume: () => {
      triggerAudioPulse();
      playTactileClickSound();
      setIsResumeOpen(false);
    },
    openAdrs: (id = null) => {
      setTargetAdrId(id);
      triggerAudioPulse();
      playTactileClickSound();
      setIsAdrsOpen(true);
    },
    closeAdrs: () => {
      triggerAudioPulse();
      playTactileClickSound();
      setIsAdrsOpen(false);
    },
    activeFilter: activeIncidentFilter,
    setActiveFilter: (filter) => {
      triggerAudioPulse();
      playTactileClickSound();
      setActiveIncidentFilter(filter);
    },
    activeSpatialCoordinates,
    setActiveSpatialCoordinates,
    liveTelemetryData,
    isAudioArmed,
    audioPulse,
    telemetryString,
    triggerP1Alert,
    playClickSound: () => {
      triggerAudioPulse();
      playTactileClickSound();
    },
    dispatchPayload: (formData = {}) => {
      triggerAudioPulse();
      playTactileClickSound();
      const nested = formData.data && typeof formData.data === "object" ? formData.data : {};
      const name = formData.name || nested.name || "Unknown";
      const contact = formData.contact || formData.email || nested.email || "";
      const inquiryType = formData.inquiryType || formData.service || formData.problem || formData.type || "Engineering Discovery";
      const message = formData.message || formData.summary || nested.notes || "";
      const href = buildSafeMailtoPayload({ name, contact, inquiryType, message });
      if (typeof window !== "undefined") {
        window.__lastMailtoPayload = href;
      }
      window.location.href = href;
    },
  };

  return <SystemCommandContext.Provider value={value}>{children}</SystemCommandContext.Provider>;
}

export function useSystemCommand() {
  const context = useContext(SystemCommandContext);
  if (!context) {
    throw new Error("useSystemCommand must be used within a SystemCommandProvider");
  }
  return context;
}
