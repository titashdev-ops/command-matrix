import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, GitCommit, FileText, Activity, Database, BookOpen, AlertTriangle, Briefcase, Mail, Link as LinkIcon, Network } from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { ADR_RECORDS } from "../data/adrs";
import { CASE_STUDIES } from "../data/missions";
import EvidenceCard from "./EvidenceCard";
import { useSystemCommand } from "../context/SystemCommandContext";

const cn = (...inputs) => twMerge(clsx(inputs));

const TRUST_SECTIONS = [
  { id: "adrs", label: "Records", icon: FileText },
  { id: "benchmarks", label: "Comparisons", icon: Activity },
  { id: "reports", label: "Notes", icon: Database },
  { id: "diagrams", label: "Diagrams", icon: Network },
  { id: "resume", label: "Resume", icon: Briefcase },
];

export default function TrustCenter() {
  const [activeSection, setActiveSection] = useState("adrs");
  const { openAdrs, openFlagships, openContact, openResume } = useSystemCommand();

  return (
    <div className="flex flex-col h-[75vh] min-h-[500px] border border-obsidian-border/60 rounded-xl overflow-hidden bg-obsidian-surface shadow-2xl">
      {/* Header */}
      <div className="flex flex-col border-b border-obsidian-border/60 p-6 bg-obsidian/80">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="text-emerald-400" size={24} />
          <h2 className="text-xl font-display font-bold text-slate-100 tracking-[-0.03em]">Evidence</h2>
        </div>
        <p className="font-sans text-sm text-slate-400">
          Named comparisons and notes. Simulations are labeled.
        </p>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Sidebar */}
        <div className="w-full shrink-0 border-b border-obsidian-border/60 bg-obsidian/40 overflow-x-auto overflow-y-hidden p-3 flex flex-row gap-2 md:w-64 md:flex-col md:overflow-y-auto md:overflow-x-hidden md:border-b-0 md:border-r md:p-4">
          {TRUST_SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            const Icon = section.icon;
            return (
              <button type="button"
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors font-sans text-sm tracking-wide",
                  isActive 
                    ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
                )}
              >
                <Icon size={14} />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-obsidian/20 relative">
          
          {activeSection === "adrs" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6 border-b border-obsidian-border/40 pb-4">
                <h3 className="font-sans text-sm tracking-wide text-slate-400">Records</h3>
                <button type="button" onClick={openAdrs} className="px-3 py-1 bg-obsidian-surface hover:bg-slate-800 border border-obsidian-border text-xs font-sans text-cyan-electric rounded transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]">
                  Open records
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EvidenceCard
                  title="WebRTC Video Transport vs HLS"
                  status="Simulation"
                  source="Benchmark"
                  benchmarkDetails={{
                    what: "End-to-end video latency from drone camera to web client via edge transport.",
                    why: "To validate if WebRTC can sustain sub-500ms latency required for safe remote operation over LTE.",
                    how: "Modeled WebRTC vs HLS buffering using published protocol characteristics and synthetic network profiles. No live drone feed is attached to this site.",
                    assumptions: "Minimum 5Mbps upload bandwidth on the drone side.",
                    limitations: "Does not account for physical camera encode latency (approx. 50ms).",
                    conclusion: "Modeled comparison: WebRTC stays in the sub-second range while HLS buffering does not. This is a portfolio simulation, not a field-verified production benchmark.",
                    relatedArch: "UAV Telemetry Ingestion",
                    relatedAdr: "adr-001",
                    relatedMission: "ops.dronly.in"
                  }}
                  downloads={[
                    { type: 'json', label: "webrtc-stats-dump.json" }
                  ]}
                />
                <EvidenceCard
                  title="Vector DB Retrieval Latency"
                  status="Simulation"
                  source="Benchmark"
                  benchmarkDetails={{
                    what: "P50 and P99 latency of querying the vector database from a serverless edge function.",
                    why: "To ensure that RAG context injection does not push the LLM time-to-first-byte (TTFB) over the 1-second threshold.",
                    how: "Modeled 10,000 queries against a hypothetical 10k-document vector store from an edge runtime. No live cluster is attached to this site.",
                    assumptions: "Database indexes fit entirely in RAM. Query embeddings are pre-computed (not part of measured latency).",
                    limitations: "Testing was isolated to us-east-1; global latencies will vary.",
                    conclusion: "In this model, retrieval overhead stays small versus generation time. Treat numbers as teaching artifacts, not audited SLAs.",
                    relatedArch: "Hybrid Vector-Graph Engine",
                    relatedAdr: "adr-003",
                    relatedMission: "Personal OS"
                  }}
                />
                <EvidenceCard
                  title="gRPC Telemetry Ingestion Profile"
                  status="Simulation"
                  source="Benchmark"
                  benchmarkDetails={{
                    what: "Latency and throughput of the gRPC ingress layer handling streaming coordinates.",
                    why: "To guarantee sub-10ms delivery of coordinates from the Edge to the Vector DB under high load.",
                    how: "Synthetic k6-style load model for 5,000 concurrent clients at 30Hz. No UAV fleet is connected to this portfolio.",
                    assumptions: "Clients have stable LTE connections; database connection pool is pre-warmed.",
                    limitations: "Test bypasses the WAF layer, potentially underestimating true end-to-end latency by 2-5ms.",
                    conclusion: "The model shifts the bottleneck to storage IOPS under burst. Not a measured production ingest profile.",
                    relatedArch: "Spatial Telemetry Matrix",
                    relatedAdr: "adr-004",
                    relatedMission: "ops.dronly.in"
                  }}
                  downloads={[
                    { type: 'json', label: "grpc-load-test-k6.json" }
                  ]}
                />
</div>
            </div>
          )}

          {activeSection === "reports" && (
            <div className="space-y-4">
              <div className="mb-6 border-b border-obsidian-border/40 pb-4">
                <h3 className="font-sans text-sm tracking-wide text-slate-400">Notes</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <EvidenceCard
                  title="HIPAA & SOC2 Compliance Architecture"
                  status="Simulation"
                  source="Technical Report"
                  methodology={{
                    Domain: "Healthcare EMR",
                    Auditor: "Internal Security Audit",
                    Date: "Q3 2023",
                  }}
                  results={{
                    "Data at Rest": "AES-256 GCM",
                    "Data in Transit": "TLS 1.3",
                    "Access Control": "RBAC & OIDC",
                  }}
                  downloads={[
                    { type: 'file', label: "compliance_audit.pdf" }
                  ]}
                />
              </div>
            </div>
          )}

          {activeSection === "diagrams" && (
            <div className="space-y-4">
              <div className="mb-6 border-b border-obsidian-border/40 pb-4">
                <h3 className="font-sans text-sm tracking-wide text-slate-400">Diagrams</h3>
              </div>
              <div className="p-12 text-center border border-dashed border-obsidian-border/60 rounded-lg">
                <Network size={32} className="mx-auto text-slate-600 mb-3" />
                <p className="font-sans text-xs text-slate-400">Select "ENTERPRISE ARCHITECTURE EXPLORER" from the global command menu to view interactive node-based architecture topologies.</p>
              </div>
            </div>
          )}

          {activeSection === "resume" && (
            <div className="space-y-4">
              <div className="mb-6 border-b border-obsidian-border/40 pb-4">
                <h3 className="font-sans text-sm tracking-wide text-slate-400">Resume</h3>
              </div>
              
              <div className="flex gap-4">
                <button type="button" 
                  onClick={openResume}
                  className="flex flex-col items-center justify-center gap-3 p-6 border border-obsidian-border/60 rounded-lg bg-obsidian-surface hover:bg-slate-800 transition-colors duration-200 cursor-pointer w-48 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
                >
                  <FileText size={24} className="text-cyan-electric" />
                  <span className="font-sans text-xs text-slate-300 uppercase">View Resume</span>
                </button>
                
                <a 
                  href="https://linkedin.com/in/titashneogi" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center gap-3 p-6 border border-obsidian-border/60 rounded-lg bg-obsidian-surface hover:bg-slate-800 transition-colors duration-200 cursor-pointer w-48 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
                >
                  <LinkIcon size={24} className="text-[#0a66c2]" />
                  <span className="font-sans text-xs text-slate-300 uppercase">LinkedIn Profile</span>
                </a>

                <button type="button" 
                  onClick={openContact}
                  className="flex flex-col items-center justify-center gap-3 p-6 border border-obsidian-border/60 rounded-lg bg-obsidian-surface hover:bg-slate-800 transition-colors duration-200 cursor-pointer w-48 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 min-h-[44px] sm:min-h-[auto]"
                >
                  <Mail size={24} className="text-emerald-400" />
                  <span className="font-sans text-xs text-slate-300 uppercase">Contact / Email</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
