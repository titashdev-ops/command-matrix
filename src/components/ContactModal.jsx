import React from "react";
import EngineeringDiscoveryWizard from "./EngineeringDiscoveryWizard";
import { useSystemCommand } from "../context/SystemCommandContext";

export default function ContactModal(props) {
  const { isContactOpen, briefServiceId } = useSystemCommand();
  if (!isContactOpen) return null;
  return <EngineeringDiscoveryWizard key={briefServiceId || "open"} {...props} />;
}

