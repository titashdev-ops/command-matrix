import React, { createContext, useContext, useState, useEffect } from "react";

export const TABS = {
  VECTOR: "vector",
  POINT_CLOUD: "point-cloud",
  AIRSPACE: "airspace",
  TRUST_CENTER: "trust-center",
};

const TAB_HASH = {
  [TABS.VECTOR]: "studies",
  [TABS.POINT_CLOUD]: "compare",
  [TABS.AIRSPACE]: "brief",
  [TABS.TRUST_CENTER]: "records",
};

function tabFromLocation() {
  if (typeof window === "undefined") return TABS.VECTOR;
  const hash = window.location.hash.replace(/^#/, "");
  const match = Object.entries(TAB_HASH).find(([, value]) => value === hash);
  return match ? match[0] : TABS.VECTOR;
}

const SpatialContext = createContext(null);

export function SpatialProvider({ children }) {
  const [activeTab, setActiveTabState] = useState(tabFromLocation);
  const [targetLock, setTargetLock] = useState(null);
  const [selectedMissionId, setSelectedMissionId] = useState(null);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    if (typeof window === "undefined") return;
    const hash = TAB_HASH[tab] || "studies";
    const next = `${window.location.pathname}${window.location.search}#${hash}`;
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== next) {
      window.history.replaceState(null, "", next);
    }
  };

  useEffect(() => {
    const sync = () => setActiveTabState(tabFromLocation());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <SpatialContext.Provider
      value={{ activeTab, setActiveTab, targetLock, setTargetLock, selectedMissionId, setSelectedMissionId }}
    >
      {children}
    </SpatialContext.Provider>
  );
}

export const useSpatial = () => useContext(SpatialContext);
