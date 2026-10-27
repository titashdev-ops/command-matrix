import React from "react";
import EngineeringDiscoveryWizard from "./EngineeringDiscoveryWizard";
import { useSystemCommand } from "../context/SystemCommandContext";

export default function ContactModal(props) {
  const { isContactOpen } = useSystemCommand();
  if (!isContactOpen) return null;
  return <EngineeringDiscoveryWizard {...props} />;
}
