import React, { createContext, useContext, useState, useEffect } from "react";

export const TABS = {
  VECTOR: "vector",
  POINT_CLOUD: "point-cloud",
  AIRSPACE: "airspace",
  TRUST_CENTER: "trust-center",
};

const SpatialContext = createContext(null);

export function SpatialProvider({ children }) {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("cmd_activeTab") || TABS.VECTOR;
      } catch (e) {
        return TABS.VECTOR;
      }
    }
    return TABS.VECTOR;
  });

  useEffect(() => {
    try {
      localStorage.setItem("cmd_activeTab", activeTab);
    } catch (e) {}
  }, [activeTab]);
  const [targetLock, setTargetLock] = useState(null);
  const [selectedMissionId, setSelectedMissionId] = useState(null);

  return (
    <SpatialContext.Provider
      value={{ activeTab, setActiveTab, targetLock, setTargetLock, selectedMissionId, setSelectedMissionId }}
    >
      {children}
    </SpatialContext.Provider>
  );
}

export const useSpatial = () => useContext(SpatialContext);
