import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { buildSafeMailtoPayload } from "../utils/safety";

const SystemCommandContext = createContext(null);

export function SystemCommandProvider({ children }) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isEnterpriseExplorerOpen, setIsEnterpriseExplorerOpen] = useState(false);
  const [isAdrsOpen, setIsAdrsOpen] = useState(false);
  const [targetAdrId, setTargetAdrId] = useState(null);
  const [isFlagshipsOpen, setIsFlagshipsOpen] = useState(false);
  const [activeFlagshipMission, setActiveFlagshipMission] = useState(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [briefServiceId, setBriefServiceId] = useState(null);

  const [audioPulse, setAudioPulse] = useState(false);
  const triggerAudioPulse = useCallback(() => {
    setAudioPulse(true);
    setTimeout(() => setAudioPulse(false), 150);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === "e") {
        setIsEnterpriseExplorerOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const value = {
    isContactOpen,
    setIsContactOpen,
    openContact: (serviceId = null) => {
      triggerAudioPulse();
      setBriefServiceId(typeof serviceId === "string" ? serviceId : null);
      setIsContactOpen(true);
    },
    closeContact: () => {
      triggerAudioPulse();
      setIsContactOpen(false);
      setBriefServiceId(null);
    },
    briefServiceId,
    isEnterpriseExplorerOpen,
    setIsEnterpriseExplorerOpen,
    openEnterpriseExplorer: () => {
      triggerAudioPulse();
      setIsEnterpriseExplorerOpen(true);
    },
    closeEnterpriseExplorer: () => {
      triggerAudioPulse();
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
      setActiveFlagshipMission(mission);
      setIsFlagshipsOpen(true);
    },
    closeFlagships: () => {
      triggerAudioPulse();
      setIsFlagshipsOpen(false);
      setTimeout(() => setActiveFlagshipMission(null), 300);
    },
    openResume: () => {
      triggerAudioPulse();
      setIsResumeOpen(true);
    },
    closeResume: () => {
      triggerAudioPulse();
      setIsResumeOpen(false);
    },
    openAdrs: (id = null) => {
      setTargetAdrId(id);
      triggerAudioPulse();
      setIsAdrsOpen(true);
    },
    closeAdrs: () => {
      triggerAudioPulse();
      setIsAdrsOpen(false);
    },
    audioPulse,
    playClickSound: () => {
      triggerAudioPulse();
    },
    dispatchPayload: (formData = {}) => {
      triggerAudioPulse();
      const nested = formData.data && typeof formData.data === "object" ? formData.data : {};
      const name = formData.name || nested.name || "Unknown";
      const contact = formData.contact || formData.email || nested.email || "";
      const inquiryType = formData.inquiryType || formData.service || formData.problem || formData.type || "Engineering Discovery";
      const message = formData.message || formData.summary || nested.notes || "";
      const href = buildSafeMailtoPayload({ name, contact, inquiryType, message });
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
