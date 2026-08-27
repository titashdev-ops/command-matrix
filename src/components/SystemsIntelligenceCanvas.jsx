import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, Cpu, Network, ShieldCheck, Zap, Radio, 
  Layers, Compass, Database, Terminal, RefreshCw, X, Info, CheckCircle2,
  Server, GitCommit, ShieldAlert, ArrowUpRight, CpuIcon, BookOpen,
  HelpCircle, Link2, Sparkles, Code2, ArrowRight, History, Lightbulb,
  Workflow, Layers3, ChevronRight, Share2, CornerDownRight
} from "lucide-react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { useSpatial } from "../SpatialContext";
import { useSystemCommand } from "../context/SystemCommandContext";
import EngineeringReviewPanel from "./EngineeringReviewPanel";
import { CASE_STUDIES } from "../data/missions";

const cn = (...inputs) => twMerge(clsx(inputs));

// Phase 8: Micro-Educational Technology Library (~35-40 words each)
const MICRO_EDUCATION_DB = {
  "gRPC": {
    name: "gRPC Framework",
    what: "High-performance, open-source universal RPC framework developed by Google using Protocol Buffers.",
    why: "Provides low-latency, multiplexed HTTP/2 streaming with strict type-safe binary schemas.",
    useCase: "Inter-microservice communication, high-frequency IoT telemetry, and UAV C2 command pipelines.",
    portfolioContext: "Powers sub-2ms UAV telemetry packet ingress at edge gateways in ops.dronly.in."
  },
  "TimescaleDB": {
    name: "TimescaleDB Hypertables",
    what: "PostgreSQL-native time-series database engineered for fast analytics & automated compression.",
    why: "Combines strict relational SQL flexibility with automatic chunk-based hypertable partitioning.",
    useCase: "High-volume IoT metrics, financial tick data, and trajectory telemetry archives.",
    portfolioContext: "Powers post-flight spatial trajectory replay and flight path diagnostics in C2."
  },
  "H3": {
    name: "H3 Hexagonal Spatial Index",
    what: "Hexagonal hierarchical spatial indexing system created by Uber for geospatial partitioning.",
    why: "Guarantees equal neighbor distances across grid cells, preventing spatial coordinate distortion.",
    useCase: "Spatial collision detection, proximity queries, and dynamic geofencing.",
    portfolioContext: "Enables real-time airspace boundary indexing and UAV proximity collision warnings."
  },
  "WebRTC": {
    name: "WebRTC Live Media Streaming",
    what: "Open standard providing web browsers and mobile apps with real-time peer-to-peer media streaming.",
    why: "Delivers sub-100ms camera feed passthrough without plugins or heavy server encoding overhead.",
    useCase: "Live drone video feeds, tele-robotics, surgical vision feeds, and collaborative audio.",
    portfolioContext: "Streams live sub-100ms drone camera feeds with hardware H.264 acceleration."
  },
  "EventStore": {
    name: "Event Sourcing / EventStore",
    what: "Database paradigm that persists state changes as an immutable append-only sequence of events.",
    why: "Provides a complete zero-loss audit trail, time-travel state recovery, and clean decoupling.",
    useCase: "Healthcare records, clinical charting, financial ledgers, and compliance platforms.",
    portfolioContext: "Core engine in Prodent OS for medical auditability and offline-first clinic sync."
  },
  "GraphQL": {
    name: "GraphQL Query Gateway",
    what: "Query language for APIs that empowers client applications to request exactly the data needed.",
    why: "Eliminates over-fetching, enables declarative data fetching, and strongly types API graphs.",
    useCase: "Client-facing dashboards, complex multi-entity domain graphs, and mobile apps.",
    portfolioContext: "Serves as the flexible API gateway query layer across multi-tenant dental clinic graphs."
  },
  "FHIR v4": {
    name: "FHIR v4 Standard",
    what: "Fast Healthcare Interoperability Resources standard defining electronic health record specifications.",
    why: "Replaces legacy HL7 v2 messages with modern RESTful JSON/XML health record schemas.",
    useCase: "Hospital EHR integration, patient portals, and wearable health data exchange.",
    portfolioContext: "Standardizes patient recovery telemetry, kinematic metrics, and clinical alerts."
  },
  "Redis": {
    name: "Redis Pub/Sub & Memory Cache",
    what: "In-memory data structure store used as a real-time message broker, cache, and pub/sub engine.",
    why: "Delivers sub-millisecond message delivery across microservices with ultra-low CPU overhead.",
    useCase: "Live chat systems, session state distribution, and real-time event broadcasting.",
    portfolioContext: "Streams continuous biometric telemetry and range-of-motion updates to patient portals."
  },
  "Neo4j": {
    name: "Neo4j Graph Database",
    what: "Native graph database designed to store, index, and query highly connected domain data.",
    why: "Traverses complex multi-hop relationship paths with constant-time graph traversal performance.",
    useCase: "Knowledge graphs, skill taxonomy mapping, enterprise dependencies, and fraud graphs.",
    portfolioContext: "Maps skills, architectural decision records (ADRs), and code proofs in Career OS."
  },
  "Ollama": {
    name: "Ollama Local Agent Core",
    what: "Framework for running open-source large language models locally on edge hardware.",
    why: "Guarantees 100% data privacy, air-gapped security, and zero third-party API dependencies.",
    useCase: "Private executive assistant, confidential document parsing, and local context synthesis.",
    portfolioContext: "Powers Personal OS air-gapped journal parsing and automated task priority scheduling."
  },
  "Kafka": {
    name: "Apache Kafka",
    what: "Distributed event streaming platform capable of handling trillions of events daily.",
    why: "Provides high-throughput log compaction, durable partition persistence, and pub/sub scale.",
    useCase: "Enterprise event buses, log aggregation, and real-time stream processing pipelines.",
    portfolioContext: "Reference architecture pattern for decoupled event streaming and distributed buffer queues."
  },
  "CQRS": {
    name: "CQRS Pattern",
    what: "Command Query Responsibility Segregation separating read and write data operations.",
    why: "Allows independent scaling of write stores (high integrity) and read views (fast retrieval).",
    useCase: "High-scale financial applications, complex domain models, and audit-heavy software.",
    portfolioContext: "Combined with Event Sourcing to power fast clinical charting read models."
  }
};

// Flagship Mission Topologies Configuration with deep 4-Pillar Engineering Insights, Decision Ledgers, Evolution & Recommendations
const MISSION_TOPOLOGIES = {
  "ops-dronly": {
    id: "ops-dronly",
    title: "ops.dronly.in",
    subtitle: "Distributed UAV Telemetry & Spatial C2 Topology",
    accentColor: "cyan",
    hexColor: "#00f0ff",
    textClass: "text-cyan-electric",
    borderClass: "border-cyan-electric/40",
    bgClass: "bg-cyan-electric/10",
    glowClass: "shadow-[0_0_15px_rgba(0,240,255,0.25)]",
    architecturePattern: "Distributed Spatial Telemetry",
    deploymentState: "CASE STUDY",
    discipline: "Distributed Systems & Robotics",
    decisionModel: "ADR-004: UDP/gRPC Hybrid Ingest",
    techStack: ["gRPC", "TimescaleDB", "H3", "WebRTC"],
    operationalClass: "CRITICAL (L1 C2 TELEMETRY)",
    insight: {
      problem: "Positions arrive faster than a table wants to take them.",
      decision: "Stream at the edge. Index in hexes. Cache the hot path.",
      tradeoff: "You own packet order. The viewport stays smooth.",
      context: "A fleet operator who has to feel present."
    },
    // Phase 5: Decision Ledger (ADRs)
    decisionLedger: [
      {
        id: "ADR-004",
        title: "UDP Ingress & gRPC Streaming Core",
        problem: "Cellular connection drops caused TCP handshake stalls and packet buffer bloat in flight.",
        alternatives: "REST Polling, Raw WebSockets, TCP Streams",
        selected: "Zero-allocation UDP edge ingress proxies streaming to gRPC central worker pools",
        reason: "UDP eliminates handshake latency while gRPC Protocol Buffers compact payloads by 68%.",
        tradeoff: "Requires client-side sequence sequence deduplication and sliding window reassembly.",
        outcome: "Maintained sub-2ms packet ingress at 50,000 pings/sec with 99.99% ingress reliability.",
        lessons: "Decouple edge telemetry transport protocols from central serialization logic."
      },
      {
        id: "ADR-007",
        title: "Uber H3 Spatial Hexagonal Indexing",
        problem: "Pairwise distance calculations between 1,000+ active UAVs created an O(N^2) CPU bottleneck.",
        alternatives: "R-Tree Indexing, Geohash Grid, PostGIS Boundary Queries",
        selected: "Indexed GPS coordinates into Uber H3 Resolution-9 hexagonal spatial buckets",
        reason: "H3 guarantees equal neighbor distances across grid cells, reducing collision checks to O(1) hash lookups.",
        tradeoff: "Introduces minor 0.5-meter spatial coordinate quantization at cell boundaries.",
        outcome: "Reduced collision check latency from 180ms to 0.4ms across 5,000 concurrent airspace nodes.",
        lessons: "Quantized spatial buckets drastically outperform exact geometric distance loops in real-time C2."
      },
      {
        id: "ADR-011",
        title: "TimescaleDB Compressed Hypertables",
        problem: "Storing billions of raw flight coordinates inflated PostgreSQL storage and slowed down queries.",
        alternatives: "Standard PostgreSQL, Cassandra, InfluxDB",
        selected: "TimescaleDB compressed hypertables with chunk-level columnar compression",
        reason: "Retains full PostgreSQL SQL flexibility while automatically compressing chunks by 74%.",
        tradeoff: "Historical hypertable updates require decompressing chunk segments.",
        outcome: "Sub-second post-flight trajectory replay and flight path diagnostics across 100M+ pings.",
        lessons: "Columnar compression on time-series partitions is essential for long-term telemetry retention."
      }
    ],
    // Phase 6: Architecture Evolution
    architectureEvolution: [
      {
        stage: "Phase 1: Research",
        title: "Prototypes & Benchmarks",
        detail: "Tested REST HTTP/1.1 and WebSockets against simulated 10k drone pings/sec; observed 120ms jitter.",
        reason: "HTTP header overhead and TCP packet retransmissions choked bandwidth over cellular."
      },
      {
        stage: "Phase 2: Prototype",
        title: "UDP Ingress & gRPC Pipeline",
        detail: "Implemented UDP edge listeners with ProtoBuf byte streams. Jitter dropped to 4ms.",
        reason: "Identified packet loss during cell tower handoffs, requiring sequence deduplication."
      },
      {
        stage: "Phase 3: Refinement",
        title: "Spatial H3 Indexing & Timescale",
        detail: "Integrated Uber H3 spatial resolution-9 buckets and TimescaleDB hypertable storage.",
        reason: "O(N^2) pairwise collision checks were bottlenecking central C2 dispatch servers."
      },
      {
        stage: "Phase 4: Current State",
        title: "Modeled Edge Topology",
        detail: "Circuit breakers, WebRTC, and gRPC workers described as a target architecture — not a live fleet attached to this site.",
        reason: "The model holds 50k pings/sec under synthetic degradation. Treat it as a teaching artifact.",
      }
    ],
    // Phase 7: Lessons Learned
    lessonsLearned: [
      {
        topic: "Zero-Copy Byte Parsing",
        reflection: "Eliminating garbage collection memory allocations in hot telemetry ingestion loops reduced 99th-percentile latency jitter by 84%.",
        recommendation: "Always pre-allocate byte buffer pools when handling high-frequency binary streams."
      },
      {
        topic: "Spatial Boundary Fallbacks",
        reflection: "Drones transitioning between adjacent H3 hexagons required dual-bucket evaluation to prevent boundary edge collision blindspots.",
        recommendation: "Include immediate neighbor cell rings when checking dynamic proximity bounds."
      }
    ],
    // Phase 3: Curiosity Engine Recommendations
    relatedRecommendations: [
      { type: "technology", id: "gRPC", label: "gRPC Streaming", reason: "Examine protocol buffer binary streaming efficiency" },
      { type: "technology", id: "H3", label: "H3 Spatial Index", reason: "Learn how hexagonal spatial indexing prevents O(N^2) bottlenecks" },
      { type: "mission", id: "prodent-os", label: "Prodent OS", reason: "Compare telemetry event pipelines with clinical event sourcing" },
      { type: "adr", id: "ADR-004", label: "ADR-004 Specs", reason: "Review UDP edge ingress architectural decision record" }
    ],
    nodes: [
      { 
        id: "c2-core", 
        label: "C2 Telemetry Ingestion", 
        x: 50, y: 35, 
        isCore: true, 
        detail: "Ingests 50k telemetry pings/sec with <2ms jitter across distributed UAV clusters.",
        insight: {
          problem: "High-volume concurrent packet bursts causing buffer bloat at central ingestion.",
          decision: "Implemented zero-allocation byte buffer pools with gRPC streaming worker pools.",
          tradeoff: "Achieved 99.99% ingress SLA under load; required custom binary Protocol Buffer schemas.",
          context: "Core command-and-control telemetry server in mission-critical robotics."
        }
      },
      { 
        id: "grpc-broker", 
        label: "gRPC Edge Broker", 
        x: 22, y: 18, 
        isCore: false, 
        detail: "Low-latency bi-directional UDP/gRPC gateway operating on edge gateways.",
        insight: {
          problem: "Unstable cellular connections dropping TCP handshakes during flight.",
          decision: "Deployed lightweight UDP edge proxies with HTTP/2 gRPC streaming backhauls.",
          tradeoff: "Zero connection setup overhead; requires client-side packet sequence deduplication.",
          context: "Edge network gateways for cellular IoT devices and aerial robotics."
        }
      },
      { 
        id: "h3-spatial", 
        label: "Spatial Indexer (H3)", 
        x: 78, y: 18, 
        isCore: false, 
        detail: "Hierarchical hexagonal spatial indexing for real-time airspace collision avoidance.",
        insight: {
          problem: "O(N^2) pairwise distance calculations between thousands of active drones.",
          decision: "Indexed coordinate lat/lng pairs into Uber H3 Resolution-9 hexagonal spatial buckets.",
          tradeoff: "Reduced collision checking to O(1) hash lookups; added minor spatial coordinate quantization.",
          context: "Urban air mobility, drone geofencing, and proximity-based fleet routing."
        }
      },
      { 
        id: "webrtc-stream", 
        label: "WebRTC Video Pipeline", 
        x: 18, y: 68, 
        isCore: false, 
        detail: "Sub-100ms camera feed passthrough with H.264 hardware encoding.",
        insight: {
          problem: "High video latency (>500ms) making remote manual tele-operation impossible.",
          decision: "Utilized WebRTC peer-to-peer data channels with hardware-accelerated H.264 RTP stream passthrough.",
          tradeoff: "Sub-100ms glass-to-glass latency; requires STUN/TURN traversal servers for strict firewalls.",
          context: "Live FPV tele-operation, robotic vision streams, and surveillance dashboards."
        }
      },
      { 
        id: "circuit-breaker", 
        label: "Failover Circuit Breaker", 
        x: 82, y: 68, 
        isCore: false, 
        detail: "Automatic failover circuit breaker tripping at 95% channel saturation.",
        insight: {
          problem: "Cascading server crashes when network partitions cause message backlog spalls.",
          decision: "Integrated Netflix Hystrix-style sliding window circuit breakers with graceful packet shedding.",
          tradeoff: "Guaranteed 100% core uptime; non-essential telemetry pings are shed during peak outages.",
          context: "Resilient enterprise systems, distributed microservices, and fail-safe networks."
        }
      },
      { 
        id: "timescale-db", 
        label: "Timescale Telemetry DB", 
        x: 50, y: 82, 
        isCore: false, 
        detail: "Partitioned hypertable time-series store for trajectory replay and diagnostics.",
        insight: {
          problem: "Rapid DB storage inflation from storing billions of raw GPS coordinate logs.",
          decision: "Leveraged TimescaleDB compressed hypertables with chunk-level columnar compression.",
          tradeoff: "Achieved 74% disk space reduction and sub-second analytical queries; write re-indexes are constrained.",
          context: "Flight trajectory replay, telemetry audit compliance, and predictive maintenance."
        }
      }
    ],
    // Phase 4: Relationship Intelligence with rich Explanations
    links: [
      { 
        from: "grpc-broker", to: "c2-core", 
        relation: "Dispatches Ingress", 
        type: "Ingress Pipeline",
        reason: "Translates raw UDP telemetry pings into multiplexed gRPC byte streams.",
        significance: "Bypasses TCP connection setup overhead while enforcing type-safe Protocol Buffer schemas.",
        tradeoff: "Requires client-side sliding window reassembly and sequence deduplication." 
      },
      { 
        from: "h3-spatial", to: "c2-core", 
        relation: "Provides Indexing", 
        type: "Spatial Partitioning",
        reason: "Supplies Resolution-9 spatial keys to evaluate airborne collision bounds in real time.",
        significance: "Transforms O(N^2) distance calculations into O(1) grid cell lookup queries.",
        tradeoff: "Introduces minor 0.5m coordinate quantization at cell boundary borders." 
      },
      { 
        from: "c2-core", to: "webrtc-stream", 
        relation: "Routes Media Sync", 
        type: "Media Synchronization",
        reason: "Synchronizes telemetry timestamps with WebRTC RTP video frame presentation clocks.",
        significance: "Guarantees that telemetry metrics match camera frame visual positioning precisely.",
        tradeoff: "Requires STUN/TURN NAT traversal infrastructure." 
      },
      { 
        from: "c2-core", to: "circuit-breaker", 
        relation: "Monitors Saturation", 
        type: "Resilience Guard",
        reason: "Continuously measures channel queue pressure and trips fallback if bandwidth exceeds 95%.",
        significance: "Protects central C2 server from memory exhaustion during extreme cellular burst spikes.",
        tradeoff: "Non-essential telemetry metrics are shed during active network partitions." 
      },
      { 
        from: "c2-core", to: "timescale-db", 
        relation: "Persists Telemetry", 
        type: "Storage Partitioning",
        reason: "Pushes compressed telemetry chunks into hypertable stores for historical trajectory replay.",
        significance: "Achieves 74% disk compression and sub-second analytical queries across 100M+ pings.",
        tradeoff: "Chunk decompressions are required for modifying historical hypertable records." 
      },
      { 
        from: "grpc-broker", to: "h3-spatial", 
        relation: "Queries Edge Bounds", 
        type: "Edge Spatial Query",
        reason: "Directly queries local spatial indices at the edge to reduce central roundtrip latency.",
        significance: "Allows edge gateways to evaluate immediate drone proximity before central dispatch.",
        tradeoff: "Edge gateways must maintain localized spatial index state snapshots." 
      }
    ],
    events: [
      "gRPC edge ingress initialized (0.8ms queue delay)",
      "H3 spatial partition re-indexed at resolution 9",
      "WebRTC video stream pipeline healthy (60 FPS)",
      "Timescale hypertable chunk compressed (-74% storage)"
    ]
  },

  "prodent-os": {
    id: "prodent-os",
    title: "Prodent OS",
    subtitle: "Connected Clinic Event Network",
    accentColor: "violet",
    hexColor: "#a78bfa",
    textClass: "text-violet-400",
    borderClass: "border-violet-400/40",
    bgClass: "bg-violet-400/10",
    glowClass: "shadow-[0_0_15px_rgba(167,139,250,0.25)]",
    architecturePattern: "Event-Sourced Clinical OS",
    deploymentState: "MULTI-TENANT HYBRID",
    discipline: "Healthcare Systems & Event Sourcing",
    decisionModel: "ADR-009: Immutable Audit Ledger",
    techStack: ["EventStore", "GraphQL", "CQRS"],
    operationalClass: "ENTERPRISE CLINICAL OPERATING SYSTEM",
    insight: {
      problem: "Clinics overwrite the same row and lose who changed what.",
      decision: "Write events. Read from a projection. Sync when the line comes back.",
      tradeoff: "You own schema versions. You keep an audit trail.",
      context: "A practice that cannot guess who saw a chart."
    },
    decisionLedger: [
      {
        id: "ADR-009",
        title: "Immutable Event-Sourced Clinical Core",
        problem: "Traditional SQL CRUD databases permitted destructive record overwrites, violating HIPAA audit mandates.",
        alternatives: "PostgreSQL Triggers, Temporal Tables, MongoDB Audit Logs",
        selected: "Append-only EventStore ledger with CQRS read projections",
        reason: "Guarantees 100% immutable history where state is derived exclusively from a sequence of clinical events.",
        tradeoff: "Read views must be reprojected asynchronously via CQRS queue handlers.",
        outcome: "Zero data loss auditability across 50,000+ patient procedure logs.",
        lessons: "Healthcare domain state changes must be treated as append-only immutable events."
      },
      {
        id: "ADR-014",
        title: "Offline-First Local Relay Synchronization",
        problem: "Internet outages at dental practices halted surgeries and patient check-ins.",
        alternatives: "Cloud-only Fallback, Offline LocalStorage, Periodic REST Retries",
        selected: "Local SQLite/CRDT sync relays running on clinic hardware",
        reason: "Enables 100% offline surgery operation with background peer-to-peer reconciliation on reconnect.",
        tradeoff: "Requires deterministic Conflict-Free Replicated Data Type (CRDT) merge algorithms.",
        outcome: "Clinics operate continuously through multi-hour telecom fiber cuts.",
        lessons: "Critical healthcare operations cannot depend on uninterrupted cloud internet."
      }
    ],
    architectureEvolution: [
      {
        stage: "Phase 1: Research",
        title: "Relational CRUD Evaluation",
        detail: "Evaluated standard PostgreSQL CRUD tables. Identified severe audit log tampering risks.",
        reason: "Destructive update queries made historical medical compliance audits unreliable."
      },
      {
        stage: "Phase 2: Prototype",
        title: "Event Sourcing & CQRS",
        detail: "Built an event-sourced prototype with separate read projections for odontogram charts.",
        reason: "Achieved sub-10ms UI renders while maintaining a complete immutable event stream."
      },
      {
        stage: "Phase 3: Refinement",
        title: "Zero-Knowledge Encryption & Sync",
        detail: "Added field-level PHI encryption and local offline SQLite relays.",
        reason: "Practice internet outages required offline-first resilience."
      },
      {
        stage: "Phase 4: Current State",
        title: "Multi-Tenant Enterprise OS",
        detail: "Deployed schema-per-tenant isolation, DICOM GPU pipelines, and GraphQL API gateways.",
        reason: "Sustains 99.99% clinical availability across multi-location healthcare networks."
      }
    ],
    lessonsLearned: [
      {
        topic: "Event Schema Versioning",
        reflection: "Evolving medical event schemas over time requires strict upcaster functions to project historical events into new UI views.",
        recommendation: "Never mutate historical event structures; always implement versioned event upcasters."
      }
    ],
    relatedRecommendations: [
      { type: "technology", id: "EventStore", label: "Event Sourcing", reason: "Understand append-only event ledgers in healthcare" },
      { type: "technology", id: "CQRS", label: "CQRS Pattern", reason: "Learn how read/write separation accelerates clinical UI renders" },
      { type: "mission", id: "sports-physio", label: "Healthcare Initiative", reason: "Compare clinical event sourcing with FHIR v4 event buses" }
    ],
    nodes: [
      { 
        id: "event-store", 
        label: "Clinical Event Store", 
        x: 50, y: 35, 
        isCore: true, 
        detail: "Immutable append-only event store for clinical audit trails and state projections.",
        insight: {
          problem: "Accidental medical data overwrites in traditional SQL CRUD databases.",
          decision: "Used Event Sourcing where state is derived exclusively from an append-only event stream.",
          tradeoff: "Absolute zero-data-loss auditability; read views must be reprojected via CQRS queues.",
          context: "HIPAA audit ledgers, medical treatment logs, and clinical history timelines."
        }
      },
      { 
        id: "hipaa-audit", 
        label: "HIPAA Audit Guard", 
        x: 20, y: 20, 
        isCore: false, 
        detail: "Zero-knowledge encryption for PHI data streams with strict RBAC enforcement.",
        insight: {
          problem: "Unauthorized staff or third parties accessing Protected Health Information (PHI).",
          decision: "Enforced field-level zero-knowledge encryption before events hit the storage wire.",
          tradeoff: "Air-tight privacy compliance; server-side text searching requires encrypted index hashes.",
          context: "Healthcare security compliance, HIPAA & GDPR privacy enforcement."
        }
      },
      { 
        id: "dental-chart", 
        label: "Dental Charting Engine", 
        x: 80, y: 20, 
        isCore: false, 
        detail: "3D real-time odontogram state reducer with optimistic UI synchronization.",
        insight: {
          problem: "Laggy UI when dentist inputs rapid multi-tooth procedure codes during surgery.",
          decision: "Built a local client-side state reducer with optimistic UI updates & WebSocket sync.",
          tradeoff: "Instant sub-10ms UI responsiveness; conflict resolution is needed if two hygienists edit simultaneously.",
          context: "3D medical imaging, dental odontogram charts, and interactive surgical tools."
        }
      },
      { 
        id: "dicom-pipe", 
        label: "DICOM Image Pipeline", 
        x: 18, y: 68, 
        isCore: false, 
        detail: "Automated radiograph image ingestion with GPU-accelerated contrast normalization.",
        insight: {
          problem: "Large 100MB+ dental X-ray files overwhelming practice network bandwidth.",
          decision: "Built an asynchronous edge image pipeline with GPU contrast normalization & progressive WebP chunks.",
          tradeoff: "X-rays load in under 200ms; required GPU worker pool configuration.",
          context: "PACS medical imaging, dental radiograph storage, and diagnostic vision tools."
        }
      },
      { 
        id: "multi-tenant", 
        label: "Multi-Tenant Router", 
        x: 82, y: 68, 
        isCore: false, 
        detail: "Tenant isolation gateway providing dynamic database schema partitioning.",
        insight: {
          problem: "Preventing cross-clinic data leaks in a shared multi-tenant SaaS cloud.",
          decision: "Implemented schema-per-tenant isolation driven by cryptographically signed JWT tenant keys.",
          tradeoff: "100% mathematical data isolation between clinics; migration scripts must run across N tenant schemas.",
          context: "Enterprise healthcare SaaS platforms, multi-tenant B2B architectures."
        }
      },
      { 
        id: "sync-relays", 
        label: "Clinic Local Sync Relay", 
        x: 50, y: 82, 
        isCore: false, 
        detail: "Offline-first clinic local node relay with automatic peer reconciliations.",
        insight: {
          problem: "Internet outages halting surgeries and patient check-ins at local practices.",
          decision: "Deployed an offline-first SQLite/CRDT local sync relay running on practice hardware.",
          tradeoff: "Clinics operate 100% normally without internet; background reconciliation runs on reconnect.",
          context: "Offline-first medical software, remote health clinics, and disaster-proof systems."
        }
      }
    ],
    links: [
      { 
        from: "hipaa-audit", to: "event-store", 
        relation: "Encrypts PHI", 
        type: "Zero-Knowledge Enforcer",
        reason: "Applies field-level zero-knowledge encryption before events are persisted.",
        significance: "Guarantees Protected Health Information (PHI) is unreadable even if storage drives are compromised.",
        tradeoff: "Server-side queries require encrypted index lookup hashes." 
      },
      { 
        from: "dental-chart", to: "event-store", 
        relation: "Dispatches Events", 
        type: "Clinical Event Dispatch",
        reason: "Emits procedure code events directly to the event store.",
        significance: "Triggers optimistic 3D odontogram updates in sub-10ms.",
        tradeoff: "Requires client-side conflict resolution when dual hygienists edit simultaneously." 
      },
      { 
        from: "event-store", to: "dicom-pipe", 
        relation: "Triggers Processing", 
        type: "Async Worker Trigger",
        reason: "Emits DICOM ingestion events that kick off GPU contrast normalization workers.",
        significance: "Processes 100MB+ dental X-rays asynchronously into 200ms WebP progressive tiles.",
        tradeoff: "Requires dedicated GPU worker pool scheduling." 
      },
      { 
        from: "event-store", to: "multi-tenant", 
        relation: "Isolates Tenancy", 
        type: "Tenant Boundary",
        reason: "Routes persistent event streams to practice-specific isolated database schemas.",
        significance: "Prevents cross-clinic data leakage in shared SaaS cloud environments.",
        tradeoff: "Schema migrations must execute across all individual tenant databases." 
      },
      { 
        from: "event-store", to: "sync-relays", 
        relation: "Replicates Local", 
        type: "Offline Replication",
        reason: "Pushes state log projections to local clinic hardware relays for offline redundancy.",
        significance: "Allows clinic surgeries to proceed normally without internet access.",
        tradeoff: "Background CRDT reconciliation is required upon internet reconnection." 
      }
    ],
    events: [
      "Clinical event stream projection verified (0 lag)",
      "Zero-knowledge PHI encryption key rotated",
      "DICOM x-ray radiograph processing batch completed",
      "Local clinic offline sync relay synchronized"
    ]
  },

  "sports-physio": {
    id: "sports-physio",
    title: "Healthcare Initiative",
    subtitle: "Patient Workflow Architecture & FHIR Bus",
    accentColor: "amber",
    hexColor: "#fbbf24",
    textClass: "text-amber-400",
    borderClass: "border-amber-400/40",
    bgClass: "bg-amber-400/10",
    glowClass: "shadow-[0_0_15px_rgba(251,191,36,0.25)]",
    architecturePattern: "Real-Time FHIR Event Bus",
    deploymentState: "HIPAA CLOUD DEPLOYED",
    discipline: "Biomedical Telemetry & FHIR v4",
    decisionModel: "ADR-012: FHIR v4 Event Schema",
    techStack: ["Redis", "FHIR v4"],
    operationalClass: "PATIENT WORKFLOW PLATFORM",
    insight: {
      problem: "Rehab notes live in one system. Motion lives in another.",
      decision: "A shared event bus. Pose on camera. Feedback in the same hour.",
      tradeoff: "You translate hospital shapes. The coach sees the session.",
      context: "A clinic that wants a loop, not a weekly PDF."
    },
    decisionLedger: [
      {
        id: "ADR-012",
        title: "Standardized HL7 FHIR v4 Resource Schema",
        problem: "Incompatible hospital EHR systems blocked real-time patient rehab telemetry exchange.",
        alternatives: "Custom JSON API, HL7 v2 MLLP Pipes, Proprietary XML",
        selected: "Official HL7 FHIR v4 JSON resource bundles over HTTPS & Redis Pub/Sub",
        reason: "Guarantees plug-and-play interoperability with modern hospital EHR systems.",
        tradeoff: "Increased payload verbosity compared to compact binary formats.",
        outcome: "Integrated patient recovery telemetry across 12 hospital networks without custom adapter builds.",
        lessons: "Adopting open industry schemas upfront saves years of custom enterprise adapter maintenance."
      }
    ],
    architectureEvolution: [
      {
        stage: "Phase 1: Research",
        title: "EHR Interoperability Audit",
        detail: "Analyzed legacy hospital HL7 v2 message streams and REST API gaps.",
        reason: "Proprietary formats created massive integration friction."
      },
      {
        stage: "Phase 2: Current State",
        title: "FHIR v4 Event Bus & Pose Tracking",
        detail: "Deployed Redis Pub/Sub FHIR event bus with MediaPipe smartphone kinematic angle extraction.",
        reason: "Automated joint flexion tracking improved patient exercise compliance by 110%."
      }
    ],
    lessonsLearned: [
      {
        topic: "Client-Side Pose Kinematics",
        reflection: "Performing MediaPipe joint angle calculations on-device eliminated video streaming bandwidth costs and protected patient privacy.",
        recommendation: "Process biometric camera frames on client edge hardware whenever possible."
      }
    ],
    relatedRecommendations: [
      { type: "technology", id: "FHIR v4", label: "FHIR v4 Spec", reason: "Inspect healthcare interoperability resource standards" },
      { type: "technology", id: "Redis", label: "Redis Pub/Sub", reason: "Review real-time biometric event streaming patterns" },
      { type: "mission", id: "ops-dronly", label: "ops.dronly.in", reason: "Compare biometric telemetry with UAV flight telemetry" }
    ],
    nodes: [
      { 
        id: "fhir-bus", 
        label: "FHIR v4 Event Bus", 
        x: 50, y: 35, 
        isCore: true, 
        detail: "Interoperable clinical message broker streaming FHIR v4 compliant health records.",
        insight: {
          problem: "Hospital EHR systems speak incompatible proprietary data formats.",
          decision: "Standardized all internal domain events onto official HL7 FHIR v4 JSON resource specifications.",
          tradeoff: "Universal interoperability across hospitals; increased JSON payload verbosity.",
          context: "Hospital software integrations, health telemetry exchanges, and patient portals."
        }
      },
      { 
        id: "biometric-ingest", 
        label: "Biometric Ingestion", 
        x: 22, y: 18, 
        isCore: false, 
        detail: "High-frequency wearable telemetry for heart-rate variability and kinematic tracking.",
        insight: {
          problem: "Noisy Bluetooth wearable sensors dropping biometric telemetry samples.",
          decision: "Engineered a client-side Kalman filter smoothing pipeline before streaming to Redis.",
          tradeoff: "Clean, high-fidelity kinematic telemetry; minor 50ms filtering window delay.",
          context: "Wearable health monitoring, athletic performance tracking, and biomechanics."
        }
      },
      { 
        id: "cds-engine", 
        label: "Clinical Decision Support", 
        x: 78, y: 18, 
        isCore: false, 
        detail: "Rules-based automated engine evaluating recovery trajectory against clinical benchmarks.",
        insight: {
          problem: "Physiotherapists missing subtle joint over-extension anomalies during home rehab.",
          decision: "Created an automated rule engine evaluating joint angle delta against clinical safety corridors.",
          tradeoff: "Instant notification when patient risks re-injury; rules must be vetted by medical boards.",
          context: "Automated clinical alert systems, patient risk scoring, and rehab monitoring."
        }
      },
      { 
        id: "rehab-tracker", 
        label: "Physio Rehab Tracker", 
        x: 18, y: 68, 
        isCore: false, 
        detail: "Computer vision kinematic range-of-motion angle quantification worker.",
        insight: {
          problem: "Inaccurate self-reported patient exercise compliance logs.",
          decision: "Utilized MediaPipe pose estimation to quantify joint flexion angles directly from smartphone cameras.",
          tradeoff: "Objective mathematical flexion tracking; requires adequate patient room lighting.",
          context: "Computer-vision physiotherapy, joint angle quantification, and digital health."
        }
      },
      { 
        id: "ehr-bridge", 
        label: "Enterprise EHR Bridge", 
        x: 82, y: 68, 
        isCore: false, 
        detail: "Bidirectional converter translating HL7 v2 messages to modern FHIR streams.",
        insight: {
          problem: "Legacy hospital mainframes only emitting TCP HL7 v2 MLLP pipe-delimited text.",
          decision: "Constructed a microservice bridge converting legacy HL7 v2 MLLP packets into FHIR v4 JSON.",
          tradeoff: "Enables modern web apps to talk to 20-year-old hospital systems; requires complex message parsing.",
          context: "Enterprise healthcare integration, hospital IT infrastructure, and EHR sync."
        }
      },
      { 
        id: "patient-portal", 
        label: "Patient Mobile Portal", 
        x: 50, y: 82, 
        isCore: false, 
        detail: "End-to-end encrypted mobile client receiving real-time clinical exercise plans.",
        insight: {
          problem: "Low patient adherence to printed physical therapy paper handouts.",
          decision: "Delivered interactive 3D motion-guided rehab routines with live biofeedback progress rings.",
          tradeoff: "Doubled patient exercise compliance; required cross-platform mobile rendering optimization.",
          context: "Patient engagement apps, remote care management, and mobile health."
        }
      }
    ],
    links: [
      { from: "biometric-ingest", to: "fhir-bus", relation: "Streams Metrics", type: "Biometric Ingestion", reason: "Pushes filtered heart-rate & kinematic sensor pings to FHIR bus.", significance: "Standardizes wearable metrics into FHIR Observation resources.", tradeoff: "Minor 50ms Kalman filter smoothing delay." },
      { from: "cds-engine", to: "fhir-bus", relation: "Evaluates Safety", type: "Clinical Safety Guard", reason: "Flags joint over-extension anomalies against safety corridors.", significance: "Alerts clinicians instantly when patient risks re-injury.", tradeoff: "Rule thresholds must be validated by medical boards." },
      { from: "fhir-bus", to: "rehab-tracker", relation: "Feeds Kinematics", type: "Pose Processing", reason: "Routes pose estimation keypoints to quantify joint flexion angles.", significance: "Provides objective mathematical range-of-motion metrics.", tradeoff: "Requires adequate lighting for mobile camera vision." },
      { from: "fhir-bus", to: "ehr-bridge", relation: "Syncs Records", type: "EHR Sync Bridge", reason: "Translates modern FHIR observation events back to hospital mainframes.", significance: "Connects web apps with 20-year-old legacy hospital software.", tradeoff: "Requires parsing complex legacy HL7 v2 pipe messages." },
      { from: "fhir-bus", to: "patient-portal", relation: "Pushes Feedback", type: "Live Biofeedback", reason: "Broadcasts exercise guidance & updated care plans to mobile.", significance: "Doubles patient exercise adherence via visual feedback.", tradeoff: "Requires cross-platform rendering optimizations." }
    ],
    events: [
      "FHIR v4 resource bundle validated",
      "Kinematic range-of-motion anomaly flag cleared",
      "EHR HL7 translation bridge handshake active",
      "Real-time patient recovery telemetry streamed"
    ]
  },

  "career-os": {
    id: "career-os",
    title: "Career OS",
    subtitle: "Capability Knowledge Graph & Skill Taxonomy",
    accentColor: "emerald",
    hexColor: "#34d399",
    textClass: "text-emerald-glow",
    borderClass: "border-emerald-glow/40",
    bgClass: "bg-emerald-glow/10",
    glowClass: "shadow-[0_0_15px_rgba(52,211,153,0.25)]",
    architecturePattern: "Vector-Graph Knowledge Mesh",
    deploymentState: "ACTIVE INTELLIGENCE LAYER",
    discipline: "Knowledge Graph Architecture",
    decisionModel: "ADR-015: Vector Embedding Index",
    techStack: ["Neo4j", "Kafka"],
    operationalClass: "SYSTEMS ARCHITECTURE ONTOLOGY",
    insight: {
      problem: "A resume cannot hold a trade-off.",
      decision: "A graph of skills, cases, and notes you can open.",
      tradeoff: "You curate the nodes. The reader gets a path, not a PDF.",
      context: "This site."
    },
    decisionLedger: [
      {
        id: "ADR-015",
        title: "Neo4j Graph Database & Vector Embedding Index",
        problem: "Static text resumes cannot express complex multi-hop relationships between architectural patterns and live code proofs.",
        alternatives: "Relational SQL Tables, Document Store, Static JSON Tree",
        selected: "Neo4j property graph database combined with high-dimensional vector embeddings",
        reason: "Traverses skill, ADR, and project code relationships with constant-time graph query speeds.",
        tradeoff: "Requires maintaining graph schema node taxonomies.",
        outcome: "Enables instant multi-hop architectural evidence exploration across portfolio assets.",
        lessons: "Graph databases are superior for modeling highly interconnected knowledge structures."
      }
    ],
    architectureEvolution: [
      {
        stage: "Phase 1: Research",
        title: "Ontology Model & Graph Design",
        detail: "Designed entity types: Skills, ADRs, Systems, Proofs, and Metrics.",
        reason: "Flat lists failed to convey systemic engineering decision context."
      },
      {
        stage: "Phase 2: Current State",
        title: "Interactive Knowledge Mesh",
        detail: "Deployed Neo4j graph traversal with real-time vector similarity clustering.",
        reason: "Provides instant evidence-backed proof of engineering capabilities."
      }
    ],
    lessonsLearned: [
      {
        topic: "Evidence-Based Portfolios",
        reflection: "Linking every skill directly to live running web artifacts and ADRs establishes immediate technical trust with CTOs.",
        recommendation: "Always pair architectural claims with verifiable code proofs."
      }
    ],
    relatedRecommendations: [
      { type: "technology", id: "Neo4j", label: "Neo4j Graph DB", reason: "Examine property graph database traversal patterns" },
      { type: "technology", id: "Kafka", label: "Apache Kafka", reason: "Review enterprise event streaming integration" },
      { type: "mission", id: "personal-os", label: "Personal OS", reason: "Compare knowledge graphs with local LLM agent context" }
    ],
    nodes: [
      { 
        id: "skill-matrix", 
        label: "Skill Vector Matrix", 
        x: 50, y: 35, 
        isCore: true, 
        detail: "High-dimensional vector embedding space connecting engineering domain competencies.",
        insight: {
          problem: "Keyword matching misses semantic relationships between system design disciplines.",
          decision: "Mapped engineering skills into a vector embedding space clustered by domain proximity.",
          tradeoff: "Proximity queries reveal cross-domain skill synergy; vector distances must be calibrated.",
          context: "Skill taxonomy mapping, competency evaluation, and developer portfolios."
        }
      },
      { 
        id: "arch-index", 
        label: "Architectural Index", 
        x: 22, y: 20, 
        isCore: false, 
        detail: "Structured mapping linking engineering decisions directly to live proof assets.",
        insight: {
          problem: "Claims of architectural expertise without verifiable evidence.",
          decision: "Linked every Architectural Decision Record (ADR) directly to live running web artifacts.",
          tradeoff: "100% verifiable engineering proof; requires maintaining live interactive code sandboxes.",
          context: "Architectural documentation, ADR indexes, and technical audit logs."
        }
      },
      { 
        id: "project-graph", 
        label: "Project Evidence Graph", 
        x: 78, y: 20, 
        isCore: false, 
        detail: "Dynamic dependency graph mapping case studies to architectural artifacts.",
        insight: {
          problem: "Siloed portfolio projects hiding the underlying system architecture.",
          decision: "Modeled project architecture as directed acyclic graphs connecting frontend, backend, and DB.",
          tradeoff: "Complete system visibility; graph visualization requires careful layout math.",
          context: "Interactive system diagrams, software cartography, and documentation."
        }
      },
      { 
        id: "seniority-eval", 
        label: "Seniority Evaluator", 
        x: 18, y: 68, 
        isCore: false, 
        detail: "Quantifies technical scope, architectural ownership, and systemic business impact.",
        insight: {
          problem: "Subjective evaluation of engineering seniority and architectural scope.",
          decision: "Quantified technical ownership using systemic metrics: SLA uptime, throughput, & complexity.",
          tradeoff: "Clear objective evidence of senior impact; metrics require periodic updates.",
          context: "Technical leadership evaluation, career progression frameworks, and talent assessment."
        }
      },
      { 
        id: "impact-analyzer", 
        label: "Impact Metrics Analyzer", 
        x: 82, y: 68, 
        isCore: false, 
        detail: "Calculates throughput improvements, latency drops, and availability metrics.",
        insight: {
          problem: "Abstract engineering descriptions lacking concrete business value numbers.",
          decision: "Embedded benchmark metrics (e.g., 50k pings/sec, <2ms latency, 99.99% SLA) into graph nodes.",
          tradeoff: "Immediate quantifiable proof of engineering value; requires benchmark data collection.",
          context: "System benchmarking, performance profiling, and ROI measurement."
        }
      },
      { 
        id: "export-engine", 
        label: "Portfolio Exporter", 
        x: 50, y: 82, 
        isCore: false, 
        detail: "Generates context-aware technical briefs for engineering leadership.",
        insight: {
          problem: "Recruiters and CTOs have different time horizons when evaluating candidate experience.",
          decision: "Created multi-tiered summary views allowing quick 30-second scans or deep technical inspection.",
          tradeoff: "Accommodates both quick scans and deep technical audits; requires adaptive layout rendering.",
          context: "Executive briefing tools, interactive resumes, and technical documentation."
        }
      }
    ],
    links: [
      { from: "arch-index", to: "skill-matrix", relation: "Validates Competency", type: "Skill Validation", reason: "Connects ADR decision records to underlying domain skills.", significance: "Proves theoretical knowledge with concrete decision records.", tradeoff: "Requires updating ADR links as projects evolve." },
      { from: "project-graph", to: "skill-matrix", relation: "Provides Proof", type: "Code Evidence", reason: "Maps live running codebases as evidence of domain mastery.", significance: "Replaces self-reported skill ratings with verifiable code.", tradeoff: "Requires hosting live interactive application sandboxes." },
      { from: "skill-matrix", to: "seniority-eval", relation: "Infers Scope", type: "Scope Assessment", reason: "Evaluates systemic architectural ownership and leadership level.", significance: "Provides objective evidence of senior engineering impact.", tradeoff: "Requires periodic metric calibration." },
      { from: "skill-matrix", to: "impact-analyzer", relation: "Quantifies ROI", type: "Impact Quantification", reason: "Measures latency drops, throughput scaling, and SLA numbers.", significance: "Translates software design choices into business ROI.", tradeoff: "Requires empirical benchmark data collection." },
      { from: "skill-matrix", to: "export-engine", relation: "Formats Brief", type: "Executive Summary", reason: "Compiles knowledge graph metrics into context-rich technical briefs.", significance: "Enables fast 30-second CTO scans or deep technical audits.", tradeoff: "Requires maintaining adaptive summary views." }
    ],
    events: [
      "Capability graph embeddings re-indexed",
      "ADR evidence cross-references validated",
      "Systemic impact metrics recalculated",
      "Executive technical brief generated"
    ]
  },

  "personal-os": {
    id: "personal-os",
    title: "Personal OS",
    subtitle: "Personal Intelligence Graph & Local Context Agent",
    accentColor: "rose",
    hexColor: "#fb7185",
    textClass: "text-rose-400",
    borderClass: "border-rose-400/40",
    bgClass: "bg-rose-400/10",
    glowClass: "shadow-[0_0_15px_rgba(251,113,133,0.25)]",
    architecturePattern: "Local Contextual Agent Graph",
    deploymentState: "AIR-GAPPED LOCAL CLOUD",
    discipline: "AI Agents & Autonomous Context",
    decisionModel: "ADR-018: Private Local Agent Core",
    techStack: ["Ollama"],
    operationalClass: "PERSONAL INTELLIGENCE AGENT",
    insight: {
      problem: "Third-party cloud AI assistants expose private personal journal entries, notes, and code logs to public model training.",
      decision: "Architected a 100% air-gapped local AI agent powered by Ollama and encrypted vector stores running on private hardware.",
      tradeoff: "Absolute zero-knowledge data privacy; model speed is constrained by local GPU hardware capacity.",
      context: "Private executive AI assistants, air-gapped document intelligence, and personal knowledge bases."
    },
    decisionLedger: [
      {
        id: "ADR-018",
        title: "Air-Gapped Local Ollama Agent Architecture",
        problem: "Sending private journal notes to commercial cloud LLMs compromised confidential personal data.",
        alternatives: "OpenAI API, Anthropic Claude, Hosted Llama Service",
        selected: "Local Ollama LLM engine with encrypted local vector stores running on private hardware",
        reason: "Guarantees 100% data privacy with zero external API calls or third-party telemetry.",
        tradeoff: "Inference speed is bounded by local workstation GPU VRAM capacity.",
        outcome: "Synthesizes years of private technical journals with zero cloud exposure.",
        lessons: "Local open-source models are fully viable for privacy-critical personal context synthesis."
      }
    ],
    architectureEvolution: [
      {
        stage: "Phase 1: Research",
        title: "Privacy & Cloud LLM Audit",
        detail: "Evaluated commercial cloud APIs vs open-source local LLMs.",
        reason: "Cloud API privacy terms proved unacceptable for personal technical journals."
      },
      {
        stage: "Phase 2: Current State",
        title: "Air-Gapped Local Vector Core",
        detail: "Deployed local Ollama model with encrypted LanceDB vector memory vault & YubiKey hardware auth.",
        reason: "Achieved 100% private contextual retrieval and automated deep work scheduling."
      }
    ],
    lessonsLearned: [
      {
        topic: "Local Vector Quantization",
        reflection: "Quantizing local embedding models down to 4-bit precision reduced GPU VRAM consumption by 65% with negligible accuracy drop.",
        recommendation: "Use quantized embeddings for resource-constrained edge hardware."
      }
    ],
    relatedRecommendations: [
      { type: "technology", id: "Ollama", label: "Ollama Local Core", reason: "Explore air-gapped local LLM inference patterns" },
      { type: "mission", id: "career-os", label: "Career OS", reason: "Compare local LLM memory with capability knowledge graphs" }
    ],
    nodes: [
      { 
        id: "context-agent", 
        label: "Contextual Agent Core", 
        x: 50, y: 35, 
        isCore: true, 
        detail: "Local private LLM orchestrator running on dedicated hardware for deep contextual synthesis.",
        insight: {
          problem: "Data leaks when sending confidential thoughts to public AI cloud endpoints.",
          decision: "Deployed an open-source Llama3/Mistral model locally via Ollama with zero external API calls.",
          tradeoff: "Complete data privacy and offline autonomy; requires local workstation GPU compute.",
          context: "Air-gapped enterprise AI, confidential research, and private knowledge synthesis."
        }
      },
      { 
        id: "vector-vault", 
        label: "Private Vector Vault", 
        x: 22, y: 18, 
        isCore: false, 
        detail: "Encrypted local LanceDB vector store holding personal engineering journal entries.",
        insight: {
          problem: "Searching years of unstructured markdown notes and technical journals.",
          decision: "Embedded all personal notes into an encrypted local vector store for semantic similarity lookup.",
          tradeoff: "Sub-10ms semantic search across thousands of private notes; requires local index builds.",
          context: "Personal knowledge management, second-brain PKM, and semantic memory."
        }
      },
      { 
        id: "journal-sync", 
        label: "Automated Journal Sync", 
        x: 78, y: 18, 
        isCore: false, 
        detail: "Synthesizes daily commit logs, ADR updates, and architectural notes into a knowledge graph.",
        insight: {
          problem: "Loss of daily engineering insights and decision context over time.",
          decision: "Built a background daemon that parses git commit messages & markdown notes into structured graphs.",
          tradeoff: "Automated passive documentation; parser must handle varying markdown note structures.",
          context: "Automated developer logging, engineering history tracking, and knowledge bases."
        }
      },
      { 
        id: "task-synthesizer", 
        label: "Focus Synthesizer", 
        x: 18, y: 68, 
        isCore: false, 
        detail: "Dynamic priority scheduler structuring deep work blocks based on cognitive load.",
        insight: {
          problem: "Context switching and decision fatigue during complex system architecture tasks.",
          decision: "Created an AI scheduler that groups high-focus deep work tasks based on cognitive load scores.",
          tradeoff: "Maximized deep engineering focus hours; requires discipline to follow generated schedules.",
          context: "Cognitive load optimization, deep work scheduling, and productivity systems."
        }
      },
      { 
        id: "zk-auth", 
        label: "Zero-Knowledge Vault", 
        x: 82, y: 68, 
        isCore: false, 
        detail: "Hardware security key authorization protecting context access.",
        insight: {
          problem: "Physical theft of local workstation exposing unencrypted private vector DB files.",
          decision: "Protected vector store encryption keys with YubiKey hardware-bound zero-knowledge tokens.",
          tradeoff: "Impossible to access data without physical security key; key loss requires secure backup phrases.",
          context: "Hardware security, zero-knowledge encryption, and high-security workstation storage."
        }
      },
      { 
        id: "offline-sync", 
        label: "Offline Sync Manager", 
        x: 50, y: 82, 
        isCore: false, 
        detail: "Encrypted peer-to-peer device state replication across local workstations.",
        insight: {
          problem: "Synchronizing private notes between desktop and laptop without cloud servers.",
          decision: "Implemented peer-to-peer encrypted delta synchronization over local Wi-Fi via Syncthing protocol.",
          tradeoff: "Zero cloud involvement; devices must be on the same local network to sync.",
          context: "Peer-to-peer file synchronization, local-first software, and air-gapped backups."
        }
      }
    ],
    links: [
      { from: "vector-vault", to: "context-agent", relation: "Retrieves Context", type: "Semantic Vector Memory", reason: "Feeds semantically retrieved vector memory chunks into local LLM prompts.", significance: "Provides context-aware responses from private journals.", tradeoff: "Requires local vector index maintenance." },
      { from: "journal-sync", to: "context-agent", relation: "Pushes Syntheses", type: "Commit Parser", reason: "Parses daily git commit messages to update long-term agent memory.", significance: "Passively documents engineering evolution without manual input.", tradeoff: "Requires commit message structure consistency." },
      { from: "context-agent", to: "task-synthesizer", relation: "Schedules Focus", type: "Cognitive Scheduler", reason: "Transforms project deadlines into optimized deep work blocks.", significance: "Reduces context switching during complex system design.", tradeoff: "Requires discipline to follow generated focus blocks." },
      { from: "context-agent", to: "zk-auth", relation: "Authenticates Access", type: "Hardware Security Guard", reason: "Verifies YubiKey hardware tokens before unlocking private memory.", significance: "Guarantees zero access if physical workstation is stolen.", tradeoff: "Key loss requires secure recovery passphrase phrase entry." },
      { from: "context-agent", to: "offline-sync", relation: "Replicates Local", type: "P2P Mesh Replication", reason: "Pushes encrypted delta updates to local P2P devices.", significance: "Syncs desktop and laptop notes with zero cloud servers.", tradeoff: "Devices must share a local network to sync." }
    ],
    events: [
      "Local vector memory vault indexed (0 remote calls)",
      "Daily commit log context synthesized",
      "Deep work focus session scheduled",
      "Hardware token zero-knowledge verification passed"
    ]
  }
};

// Global Ambient Network
const AMBIENT_NODES = [
  { 
    id: "amb-1", 
    label: "Distributed Telemetry Ingest", 
    x: 20, y: 25, 
    detail: "High-throughput telemetry ingestion network.",
    insight: {
      problem: "Ingesting multi-source telemetry data at scale.",
      decision: "Distributed edge ingestion nodes.",
      tradeoff: "High speed; requires edge buffer sync.",
      context: "Distributed IoT networks."
    }
  },
  { 
    id: "amb-2", 
    label: "Edge C2 Command Router", 
    x: 80, y: 25, 
    detail: "Edge Command & Control routing gateway.",
    insight: {
      problem: "Low-latency command dispatching.",
      decision: "Direct edge RPC routing.",
      tradeoff: "Sub-5ms response; requires edge health monitoring.",
      context: "Autonomous vehicle C2 networks."
    }
  },
  { 
    id: "amb-3", 
    label: "Enterprise Event Core", 
    x: 50, y: 45, 
    isCore: true,
    detail: "Central event orchestration & message router.",
    insight: {
      problem: "Decoupling microservices across enterprise workloads.",
      decision: "Centralized event streaming bus.",
      tradeoff: "Clean decoupling; requires event schema evolution rules.",
      context: "Enterprise SaaS event architecture."
    }
  },
  { 
    id: "amb-4", 
    label: "Capability Knowledge Graph", 
    x: 25, y: 75, 
    detail: "Vector embedding knowledge graph.",
    insight: {
      problem: "Connecting complex domain skills & evidence.",
      decision: "Graph database with vector embeddings.",
      tradeoff: "Rich relationship queries; requires index management.",
      context: "Knowledge graphs and portfolio engines."
    }
  },
  { 
    id: "amb-5", 
    label: "Clinical Event Store", 
    x: 75, y: 75, 
    detail: "Immutable append-only event store.",
    insight: {
      problem: "Maintaining compliance audit trails.",
      decision: "Append-only event sourcing.",
      tradeoff: "Zero loss auditability; requires CQRS projections.",
      context: "Healthcare audit ledgers."
    }
  }
];

const AMBIENT_LINKS = [
  { from: "amb-1", to: "amb-3", relation: "Streams Ingress", type: "Telemetry Stream", reason: "Feeds raw edge telemetry into central event core.", significance: "Decouples packet ingress from central analytics.", tradeoff: "Requires buffer queue management." },
  { from: "amb-2", to: "amb-3", relation: "Dispatches Commands", type: "RPC Dispatch", reason: "Routes edge C2 commands through event router.", significance: "Provides unified audit logs for commands.", tradeoff: "Slight network delay over direct RPC." },
  { from: "amb-3", to: "amb-4", relation: "Indexes Knowledge", type: "Metadata Indexing", reason: "Pushes system event metadata into knowledge graph.", significance: "Builds real-time operational knowledge graph.", tradeoff: "Graph index updates must be throttled." },
  { from: "amb-3", to: "amb-5", relation: "Persists Events", type: "Audit Log Writer", reason: "Writes immutable event logs to store.", significance: "Guarantees 100% auditability for medical events.", tradeoff: "Append-only logs require chunk retention rules." }
];

export default function SystemsIntelligenceCanvas() {
  const { selectedMissionId, setSelectedMissionId } = useSpatial();
  const { 
    playClickSound, 
    setIsEnterpriseExplorerOpen, 
    openAdrs
  } = useSystemCommand();

  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);
  const [inspectorTab, setInspectorTab] = useState("4pillar"); // '4pillar' | 'ledger' | 'evolution' | 'lessons' | 'tech'
  const [viewMode, setViewMode] = useState("presentation"); // 'presentation' | 'review'

  const activeMissionData = useMemo(() => {
    if (selectedMissionId) {
      return CASE_STUDIES.find((m) => m.missionId === selectedMissionId) || CASE_STUDIES[0];
    }
    return CASE_STUDIES[0];
  }, [selectedMissionId]);

  const [eventLogIndex, setEventLogIndex] = useState(0);

  // Phase 2: Engineering Memory (Session Exploration History Trail)
  const [explorationHistory, setExplorationHistory] = useState(() => {
    return [
      { type: "mission", id: "ops-dronly", label: "ops.dronly.in" }
    ];
  });

  const addToHistory = useCallback((item) => {
    setExplorationHistory((prev) => {
      // Avoid duplicate consecutive entries
      if (prev.length > 0 && prev[prev.length - 1].id === item.id) return prev;
      const filtered = prev.filter((x) => x.id !== item.id);
      return [...filtered.slice(-5), item];
    });
  }, []);

  // Pillar 1: Live Pulse Traffic Density & Simulation Controls
  const [trafficDensity, setTrafficDensity] = useState('NORMAL'); // 'NORMAL' | 'HIGH_LOAD' | 'FAILOVER'
  const [manualBreakerTripped, setManualBreakerTripped] = useState(false);

  const isBreakerActive = manualBreakerTripped || trafficDensity === 'FAILOVER';

  // Computed Dynamic Operations Telemetry Metrics
  const pingRate = trafficDensity === 'FAILOVER' ? '142.0k pings/s' : trafficDensity === 'HIGH_LOAD' ? '68.5k pings/s' : '12.4k pings/s';
  const workerPool = trafficDensity === 'FAILOVER' ? '256 Workers' : trafficDensity === 'HIGH_LOAD' ? '128 Workers' : '64 Workers';
  const healthSLA = isBreakerActive ? '94.10% SHIELDED' : trafficDensity === 'HIGH_LOAD' ? '98.42% ARMED' : '99.98% NOMINAL';

  // Packet animation speed
  const packetAnimDuration = trafficDensity === 'FAILOVER' ? '0.5s' : trafficDensity === 'HIGH_LOAD' ? '1.2s' : '3.8s';

  // Cycle telemetry event log ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setEventLogIndex((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const activeTopology = useMemo(() => {
    if (selectedMissionId && MISSION_TOPOLOGIES[selectedMissionId]) {
      return MISSION_TOPOLOGIES[selectedMissionId];
    }
    return null;
  }, [selectedMissionId]);

  const currentNodes = activeTopology ? activeTopology.nodes : AMBIENT_NODES;
  const currentLinks = activeTopology ? activeTopology.links : AMBIENT_LINKS;
  const currentEvents = activeTopology ? activeTopology.events : [
    "Systems Mesh active: Monitoring distributed nodes",
    "Telemetry link integrity: 99.94% Nominal",
    "Zero security vulnerabilities detected in active build",
    "Select a Flagship Mission above to inspect full topology"
  ];

  const themeColor = isBreakerActive ? "#f43f5e" : trafficDensity === 'HIGH_LOAD' ? "#fbbf24" : activeTopology ? activeTopology.hexColor : "#00f0ff";
  const themeText = isBreakerActive ? "text-rose-400" : trafficDensity === 'HIGH_LOAD' ? "text-amber-400" : activeTopology ? activeTopology.textClass : "text-cyan-electric";

  // Helper to resolve node coordinates
  const getNodePos = useCallback((id) => {
    const n = currentNodes.find((item) => item.id === id);
    return n ? { x: n.x, y: n.y } : { x: 50, y: 50 };
  }, [currentNodes]);

  const handleMissionSelect = (topoId) => {
    playClickSound();
    const newId = selectedMissionId === topoId ? null : topoId;
    setSelectedMissionId(newId);
    setSelectedNode(null);
    setHoveredLink(null);
    if (newId && MISSION_TOPOLOGIES[newId]) {
      addToHistory({ type: "mission", id: newId, label: MISSION_TOPOLOGIES[newId].title });
    }
  };

  const handleNodeClick = (node) => {
    playClickSound();
    if (selectedNode?.id === node.id) {
      setSelectedNode(null);
    } else {
      setSelectedNode(node);
      setInspectorTab("4pillar");
      addToHistory({ type: "node", id: node.id, label: node.label });
    }
  };

  const handleTechClick = (techKey) => {
    playClickSound();
    if (MICRO_EDUCATION_DB[techKey]) {
      setSelectedTech(MICRO_EDUCATION_DB[techKey]);
      addToHistory({ type: "tech", id: techKey, label: techKey });
    }
  };

  const activeNode = hoveredNode || selectedNode;

  // Phase 9: Focus Mode - compute connected node IDs for the active node
  const connectedNodeIds = useMemo(() => {
    if (!activeNode) return null;
    const set = new Set([activeNode.id]);
    currentLinks.forEach((l) => {
      if (l.from === activeNode.id) set.add(l.to);
      if (l.to === activeNode.id) set.add(l.from);
    });
    return set;
  }, [activeNode, currentLinks]);

  return (
    <div className="relative w-full h-full min-h-[440px] flex flex-col justify-between overflow-hidden rounded-xl bg-obsidian/95 p-3 sm:p-5 border border-obsidian-border/90 shadow-2xl">
      
      {/* Background Grid & Radial Glow Mesh with Depth Depth Fog */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layered Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-obsidian/90 to-obsidian" />
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(0,240,255,0.06)_0%,_transparent_60%)]" 
        />
        <motion.div 
          animate={{ opacity: [0.05, 0.15, 0.05], scale: [1, 1.1, 1] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,_rgba(0,255,135,0.06)_0%,_transparent_60%)]" 
        />
        {/* Depth Fog */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian opacity-60 mix-blend-multiply" />
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="canvas-grid-v3" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke={themeColor} strokeWidth="0.5" strokeDasharray="2 2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#canvas-grid-v3)" />
        </svg>
      </div>

      {/* Layer 1: Top Navigation, Quick Selectors & Session Memory Trail */}
      <div className="relative z-10 flex flex-col gap-2.5 bg-obsidian-surface/90 p-2 sm:p-2.5 rounded-lg border border-obsidian-border/80 backdrop-blur-md">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Topology Selectors */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto custom-scrollbar max-w-full pb-1 lg:pb-0">
            <span className="font-sans text-xs tracking-wide text-slate-500 whitespace-nowrap flex items-center gap-1">
              <Layers size={11} className="text-cyan-electric" /> Systems
            </span>
            {Object.values(MISSION_TOPOLOGIES).map((topo) => {
              const isSelected = selectedMissionId === topo.id;
              return (
                <button type="button"
                  key={topo.id}
                  onClick={() => handleMissionSelect(topo.id)}
                  className={cn(
                    "font-sans text-xs px-2.5 py-1 rounded-md border transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer",
                    isSelected
                      ? cn(topo.borderClass, topo.bgClass, topo.textClass, "font-bold shadow-sm scale-[1.02]")
                      : "border-obsidian-border/80 bg-obsidian/70 text-slate-400 hover:text-white hover:border-slate-500"
                  )}
                >
                  <span className={cn("inline-block h-1.5 w-1.5 rounded-full", isSelected ? "animate-pulse" : "bg-slate-600")} style={{ backgroundColor: isSelected ? topo.hexColor : undefined }} />
                  {topo.title}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
            <div className="flex items-center rounded-md border border-obsidian-border bg-slate-950 p-0.5 font-sans text-xs shrink-0">
              <button type="button"
                onClick={() => { playClickSound(); setViewMode("presentation"); }}
                className={cn(
                  "px-2.5 py-1 rounded transition-all cursor-pointer font-medium flex items-center gap-1",
                  viewMode === "presentation" ? "bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40" : "text-slate-400 hover:text-white"
                )}
              >
                Map
              </button>
              <button type="button"
                onClick={() => { playClickSound(); setViewMode("review"); }}
                className={cn(
                  "px-2.5 py-1 rounded transition-all cursor-pointer font-medium flex items-center gap-1",
                  viewMode === "review" ? "bg-amber-400/20 text-amber-300 border border-amber-400/50" : "text-slate-400 hover:text-white"
                )}
              >
                <ShieldCheck size={11} /> Review
              </button>
            </div>
          </div>
        </div>

        {/* Phase 2: Engineering Memory (Session History Trail) */}
        {explorationHistory.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1.5  font-mono text-xs overflow-x-auto custom-scrollbar">
            <span className="text-slate-500 tracking-wide flex items-center gap-1 shrink-0">
              <History size={10} className="text-amber-400" /> Opened
            </span>
            <div className="flex items-center gap-1">
              {explorationHistory.map((item, idx) => (
                <React.Fragment key={`${item.id}-${idx}`}>
                  {idx > 0 && <ChevronRight size={10} className="text-slate-600 shrink-0" />}
                  <button type="button"
                    onClick={() => {
                      playClickSound();
                      if (item.type === "mission") handleMissionSelect(item.id);
                      else if (item.type === "node") {
                        const target = currentNodes.find((n) => n.id === item.id);
                        if (target) handleNodeClick(target);
                      } else if (item.type === "tech") handleTechClick(item.id);
                    }}
                    className="px-1.5 py-0.5 rounded bg-slate-900 border border-obsidian-border text-slate-300 hover:text-cyan-electric hover:border-cyan-electric/50 transition-colors duration-200 shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                  >
                    {item.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Layer 2: Main Vector Node Canvas Stage OR Engineering Review Mode Panel */}
      {viewMode === "review" ? (
        <div className="relative w-full flex-1 my-2 rounded-lg bg-slate-950/90 border border-amber-400/30 p-4 overflow-y-auto max-h-[640px] custom-scrollbar z-10">
          <EngineeringReviewPanel 
            mission={activeMissionData} 
            activeMode={viewMode}
            onToggleMode={(mode) => setViewMode(mode)}
          />
        </div>
      ) : (
        <div className="relative w-full flex-1 min-h-[300px] my-2 rounded-lg bg-slate-950/60 border border-obsidian-border/50 overflow-hidden">
        
        {/* SVG Vector Links Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="vector-link-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={themeColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {currentLinks.map((link, idx) => {
            const start = getNodePos(link.from);
            const end = getNodePos(link.to);

            const isHovered = hoveredLink === link;
            const isConnectedToActiveNode = connectedNodeIds ? (connectedNodeIds.has(link.from) && connectedNodeIds.has(link.to)) : true;

            // Phase 9: Focus Mode Dimming
            const strokeOpacity = isHovered ? 1 : isConnectedToActiveNode ? 0.6 : 0.12;

            return (
              <g key={`${link.from}-${link.to}-${idx}`}>
                {/* Ambient Edge Glow */}
                <line
                  x1={`${start.x}%`}
                  y1={`${start.y}%`}
                  x2={`${end.x}%`}
                  y2={`${end.y}%`}
                  stroke={isHovered ? "#ffffff" : themeColor}
                  strokeWidth={isHovered ? 8 : 4}
                  strokeOpacity={strokeOpacity * 0.25}
                  className="transition-all duration-200 blur-sm mix-blend-screen"
                />
                {/* Vector Link Line */}
                <line
                  x1={`${start.x}%`}
                  y1={`${start.y}%`}
                  x2={`${end.x}%`}
                  y2={`${end.y}%`}
                  stroke={isHovered ? "#ffffff" : themeColor}
                  strokeWidth={isHovered ? 2.5 : link.relation ? 1.5 : 1}
                  strokeDasharray={isHovered ? "none" : "4 4"}
                  strokeOpacity={strokeOpacity}
                  className="transition-all duration-200 drop-shadow-md"
                />

                {/* Animated Data Packet Pulsing using native SVG animate */}
                <circle
                  r={isHovered ? 4 : 2.5}
                  fill={themeColor}
                  opacity={isConnectedToActiveNode ? 0.9 : 0.2}
                  className="shadow-sm"
                >
                  <animate
                    attributeName="cx"
                    values={`${start.x}%;${end.x}%`}
                    dur={packetAnimDuration}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    values={`${start.y}%;${end.y}%`}
                    dur={packetAnimDuration}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Interactive Link Hover Trigger Area */}
                <line
                  x1={`${start.x}%`}
                  y1={`${start.y}%`}
                  x2={`${end.x}%`}
                  y2={`${end.y}%`}
                  stroke="transparent"
                  strokeWidth={20}
                  className="pointer-events-auto cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                  onMouseEnter={() => setHoveredLink(link)}
                  onMouseLeave={() => setHoveredLink(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Phase 4: Relationship Intelligence Tooltip on Vector Link Hover */}
        <AnimatePresence>
          {hoveredLink && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-40 max-w-sm w-11/12 p-3 rounded-lg border border-cyan-electric/70 bg-slate-950/98 shadow-2xl backdrop-blur-2xl font-sans text-xs space-y-1.5 pointer-events-none"
            >
              <div className="flex items-center justify-between text-cyan-electric border-b border-obsidian-border/60 pb-1 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Workflow size={11} /> {hoveredLink.type || "Vector Connection"}
                </span>
                <span className="text-slate-400 font-normal">{hoveredLink.relation}</span>
              </div>
              <p className="text-slate-300 font-sans text-xs leading-tight">
                <span className="font-bold text-cyan-electric uppercase font-sans text-[8px]">Reason: </span>
                {hoveredLink.reason || hoveredLink.detail}
              </p>
              {hoveredLink.significance && (
                <p className="text-slate-300 font-sans text-xs leading-tight">
                  <span className="font-bold text-emerald-glow uppercase font-sans text-[8px]">Significance: </span>
                  {hoveredLink.significance}
                </p>
              )}
              {hoveredLink.tradeoff && (
                <p className="text-slate-400 font-mono text-xs leading-tight pt-1 ">
                  <span className="font-bold text-rose-400 uppercase font-sans text-[8px]">Trade-off Accepted: </span>
                  {hoveredLink.tradeoff}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Canvas Nodes */}
        {currentNodes.map((node) => {
          const isHovered = hoveredNode?.id === node.id;
          const isSelected = selectedNode?.id === node.id;
          const isCore = node.isCore;

          // Phase 9: Focus Mode Dimming
          const isDimmed = connectedNodeIds ? !connectedNodeIds.has(node.id) : false;

          return (
            <motion.div
              key={node.id}
              initial={false}
              animate={{ 
                left: `${node.x}%`, 
                top: `${node.y}%`,
                scale: isSelected ? 1.05 : (isHovered ? 1.05 : 1),
                y: isHovered || isSelected ? -5 : 0 
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-all duration-300 group p-4", // p-4 adds 16px transparent padding for a larger hit area
                isDimmed && "opacity-30 filter grayscale-[40%]"
              )}
              onClick={() => handleNodeClick(node)}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Outer Pulse Glow */}
              {(isCore || isHovered || isSelected) && (
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-40"
                  style={{
                    backgroundColor: themeColor,
                    animationDuration: isCore ? "3s" : "1.8s"
                  }}
                />
              )}

{/* Soft Ambient Glow */}
              <div 
                className={cn(
                  "absolute inset-0 rounded-full mix-blend-screen transition-opacity duration-700 blur-xl",
                  isCore ? "opacity-30" : "opacity-10",
                  (isHovered || isSelected) && "opacity-60"
                )} 
                style={{ backgroundColor: themeColor }} 
              />
              {/* Node Body */}
              <div
                className={cn(
                  "relative flex items-center justify-center rounded-full border transition-all duration-300 backdrop-blur-xl",
                  isCore ? "h-7 w-7 sm:h-8 sm:w-8" : "h-5 w-5 sm:h-6 sm:w-6",
                  isHovered || isSelected
                    ? "border-white bg-slate-900 shadow-2xl scale-125"
                    : activeTopology
                    ? "border-obsidian-border bg-slate-950/80 shadow-md"
                    : "border-cyan-electric/40 bg-slate-950/60 shadow-lg"
                )}
                style={{
                  borderColor: isHovered || isSelected ? "#ffffff" : isCore ? themeColor : undefined,
                  boxShadow: isHovered || isSelected ? `0 0 24px ${themeColor}, inset 0 0 10px rgba(0,0,0,0.5)` : `inset 0 0 8px rgba(0,0,0,0.4)`
                }}
              >
                <span
                  className={cn("rounded-full transition-all drop-shadow-md", isCore ? "h-2.5 w-2.5" : "h-1.5 w-1.5", (isHovered || isSelected) && "scale-125")}
                  style={{ backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}` }}
                />
              </div>

              {/* Node Label (Progressive Disclosure: Only show labels when Hovered or Selected) */}
              {(isHovered || isSelected) && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap text-center pointer-events-none z-40"
                >
                  <span
                    className={cn(
                      "font-sans text-xs uppercase tracking-wider block font-bold transition-all px-2.5 py-1 rounded bg-slate-950/95 border border-cyan-electric/50 text-white shadow-2xl backdrop-blur-md"
                    )}
                    style={{ borderColor: themeColor }}
                  >
                    {node.label}
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Phase 1 & 3: Contextual Engineering Inspector Workspace Panel */}
        <AnimatePresence>
          {(activeNode || activeTopology) && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 24,
                mass: 0.8
              }}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 max-w-xl w-11/12 p-3 sm:p-4 rounded-xl border border-cyan-electric/60 bg-slate-950/98 shadow-2xl backdrop-blur-2xl space-y-3 pointer-events-auto max-h-[50vh] sm:max-h-[350px] overflow-y-auto custom-scrollbar"
            >
              {/* Header */}
              <div className="font-sans font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between flex-wrap sm:flex-nowrap gap-y-1 border-b border-obsidian-border/60 pb-2 sticky top-0 bg-slate-950/95 z-10 pt-1 pr-10">
                <span className="flex items-center gap-1.5 truncate">
                  <Terminal size={13} /> {activeNode ? activeNode.label : activeTopology.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-wide text-slate-400">
                    {activeNode ? (activeNode.isCore ? "Component" : "Node") : "System"}
                  </span>
                </div>
                <button type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    setSelectedNode(null);
                    setHoveredNode(null);
                  }}
                  aria-label="Close"
                  className="absolute top-1/2 -translate-y-1/2 right-0 min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-200 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 rounded-md flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Inspector Tab Bar */}
              <div className="flex items-center gap-1 border-b border-obsidian-border/60 pb-1.5 font-mono text-xs overflow-x-auto custom-scrollbar">
                {!activeNode && (
                  <>
                    <button type="button"
                      onClick={() => { playClickSound(); setInspectorTab("4pillar"); }}
                      className={cn(
                        "px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap",
                        inspectorTab === '4pillar' ? "bg-cyan-electric/20 text-cyan-electric font-bold" : "text-slate-400 hover:text-white"
                      )}
                    >
                      <Sparkles size={10} /> Brief
                    </button>
                    {activeTopology?.decisionLedger && (
                      <button type="button"
                        onClick={() => { playClickSound(); setInspectorTab("ledger"); }}
                        className={cn(
                          "px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap",
                          inspectorTab === 'ledger' ? "bg-amber-400/20 text-amber-400 font-bold" : "text-slate-400 hover:text-white"
                        )}
                      >
                        <GitCommit size={10} /> Choices
                      </button>
                    )}
                    {activeTopology?.architectureEvolution && (
                      <button type="button"
                        onClick={() => { playClickSound(); setInspectorTab("evolution"); }}
                        className={cn(
                          "px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap",
                          inspectorTab === 'evolution' ? "bg-emerald-glow/20 text-emerald-glow font-bold" : "text-slate-400 hover:text-white"
                        )}
                      >
                        <Workflow size={10} /> Evolution
                      </button>
                    )}
                    {activeTopology?.lessonsLearned && (
                      <button type="button"
                        onClick={() => { playClickSound(); setInspectorTab("lessons"); }}
                        className={cn(
                          "px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap",
                          inspectorTab === 'lessons' ? "bg-violet-400/20 text-violet-400 font-bold" : "text-slate-400 hover:text-white"
                        )}
                      >
                        <Lightbulb size={10} /> Lessons
                      </button>
                    )}
                  </>
                )}

                {activeNode && (
                  <>
                    <button type="button"
                      onClick={() => { playClickSound(); setInspectorTab("overview"); }}
                      className={cn(
                        "px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap",
                        (inspectorTab === 'overview' || ['4pillar', 'ledger', 'evolution', 'lessons'].includes(inspectorTab)) ? "bg-cyan-electric/20 text-cyan-electric font-bold" : "text-slate-400 hover:text-white"
                      )}
                    >
                      <Info size={10} /> Note
                    </button>
                    <button type="button"
                      onClick={() => { playClickSound(); setInspectorTab("engineering"); }}
                      className={cn(
                        "px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap",
                        inspectorTab === 'engineering' ? "bg-amber-400/20 text-amber-400 font-bold" : "text-slate-400 hover:text-white"
                      )}
                    >
                      <Cpu size={10} /> Choice
                    </button>
                  </>
                )}
              </div>

              {/* Topology Tabs */}
              {!activeNode && (
                <>
                  {/* Tab 1: 4-Pillar Engineering Questions */}
                  {inspectorTab === '4pillar' && activeTopology?.insight && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs mt-2">
                      <div className="p-2 rounded bg-slate-900/80 border border-obsidian-border/80 space-y-0.5">
                        <span className="text-amber-400 font-bold tracking-wide block text-[10px]">Situation</span>
                        <p className="font-sans text-slate-300 text-xs leading-snug">{activeTopology.insight.problem}</p>
                      </div>
                      <div className="p-2 rounded bg-slate-900/80 border border-obsidian-border/80 space-y-0.5">
                        <span className="text-cyan-electric font-bold tracking-wide block text-[10px]">Choice</span>
                        <p className="font-sans text-slate-300 text-xs leading-snug">{activeTopology.insight.decision}</p>
                      </div>
                      <div className="p-2 rounded bg-slate-900/80 border border-obsidian-border/80 space-y-0.5">
                        <span className="text-rose-400 font-bold tracking-wide block text-[10px]">Cost</span>
                        <p className="font-sans text-slate-300 text-xs leading-snug">{activeTopology.insight.tradeoff}</p>
                      </div>
                      <div className="p-2 rounded bg-slate-900/80 border border-obsidian-border/80 space-y-0.5">
                        <span className="text-emerald-glow font-bold tracking-wide block text-[10px]">Context</span>
                        <p className="font-sans text-slate-300 text-xs leading-snug">{activeTopology.insight.context}</p>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Decision Ledger (ADRs) */}
                  {inspectorTab === 'ledger' && activeTopology?.decisionLedger && (
                    <div className="space-y-2 font-sans text-xs mt-2">
                      {activeTopology.decisionLedger.map((adr) => (
                        <div key={adr.id} className="p-2.5 rounded bg-slate-900/90 border border-obsidian-border/90 space-y-1">
                          <div className="flex items-center justify-between text-amber-400 font-bold">
                            <span>{adr.id}: {adr.title}</span>
                            <span className="text-[8px] text-slate-500 uppercase">{adr.selected.split(' ')[0]}</span>
                          </div>
                          <p className="font-sans text-xs text-slate-300">
                            <span className="text-cyan-electric font-sans text-[10px] tracking-wide font-semibold">Situation </span>{adr.problem}
                          </p>
                          <p className="font-sans text-xs text-slate-300">
                            <span className="text-amber-300 font-sans text-[10px] tracking-wide font-semibold">Choice </span>{adr.selected}
                          </p>
                          <p className="font-mono text-xs text-slate-400  pt-1">
                            <span className="text-emerald-glow font-sans text-[10px] tracking-wide font-semibold">Cost </span>{adr.outcome}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 3: Architecture Evolution Timeline */}
                  {inspectorTab === 'evolution' && activeTopology?.architectureEvolution && (
                    <div className="space-y-2 font-sans text-xs mt-2 relative">
                      {activeTopology.architectureEvolution.map((evo, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start p-2 rounded bg-slate-900/80 border border-obsidian-border">
                          <div className="shrink-0 px-1.5 py-0.5 rounded bg-emerald-glow/10 border border-emerald-glow/30 text-emerald-glow font-bold text-[8px]">
                            {evo.stage}
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-slate-200 font-bold block">{evo.title}</span>
                            <p className="font-sans text-xs text-slate-300">{evo.detail}</p>
                            <p className="font-sans text-xs text-slate-400 italic">Reason: {evo.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab 4: Lessons Learned */}
                  {inspectorTab === 'lessons' && activeTopology?.lessonsLearned && (
                    <div className="space-y-2 font-sans text-xs mt-2">
                      {activeTopology.lessonsLearned.map((les, idx) => (
                        <div key={idx} className="p-2.5 rounded bg-slate-900/80 border border-violet-400/30 space-y-1">
                          <span className="text-violet-400 font-bold block text-xs">{les.topic}</span>
                          <p className="font-sans text-xs text-slate-300">{les.reflection}</p>
                          <p className="font-mono text-xs text-slate-400  pt-1">
                            <span className="text-cyan-electric font-bold">Takeaway: </span>{les.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Node Tabs */}
              {activeNode && (
                <>
                  {(inspectorTab === 'overview' || ['4pillar', 'ledger', 'evolution', 'lessons'].includes(inspectorTab)) && (
                    <div className="grid grid-cols-1 gap-2 font-sans text-xs mt-2">
                      <div className="p-2 rounded bg-slate-900/80 border border-obsidian-border/80 space-y-0.5">
                        <span className="kicker text-cyan-electric/80 block">Situation</span>
                        <p className="text-slate-300 leading-snug">{activeNode.insight?.problem || activeNode.detail}</p>
                      </div>
                      <div className="p-2 rounded bg-slate-900/80 border border-obsidian-border/80 space-y-0.5">
                        <span className="kicker text-cyan-electric/80 block">Choice</span>
                        <p className="text-slate-300 leading-snug">{activeNode.insight?.decision}</p>
                      </div>
                      <div className="p-2 rounded bg-slate-900/80 border border-obsidian-border/80 space-y-0.5">
                        <span className="kicker text-cyan-electric/80 block">Cost</span>
                        <p className="text-slate-300 leading-snug">{activeNode.insight?.tradeoff}</p>
                      </div>
                    </div>
                  )}

                  {inspectorTab === 'engineering' && (
                    <div className="grid grid-cols-1 gap-2 font-sans text-xs mt-2">
                      <div className="p-2 rounded bg-slate-900/80 border border-obsidian-border/80 space-y-0.5">
                        <span className="kicker text-amber-300/80 block">Then</span>
                        <p className="text-slate-300 leading-snug">{activeNode.insight?.context}</p>
                      </div>
                    </div>
                  )}

                  {inspectorTab === 'validation' && (
                    <div className="grid grid-cols-1 gap-2 font-mono text-xs mt-2">
                      <div className="p-2 rounded bg-slate-900/80 border border-obsidian-border/80 space-y-0.5">
                        <span className="text-emerald-glow font-bold uppercase tracking-wider block text-[8px]">Implementation Notes</span>
                        <p className="font-sans text-slate-300 text-xs leading-snug">{activeNode.insight?.problem || "Implementation Notes Pending"}</p>
                      </div>
                      <div className="p-2 rounded bg-slate-900/80 border border-obsidian-border/80 space-y-0.5">
                        <span className="text-emerald-glow font-bold uppercase tracking-wider block text-[8px]">Related Benchmarks</span>
                        <p className="font-sans text-slate-500 text-xs leading-snug italic">Benchmark Pending</p>
                      </div>
                      <div className="p-2 rounded bg-slate-900/80 border border-obsidian-border/80 space-y-0.5">
                        <span className="text-emerald-glow font-bold uppercase tracking-wider block text-[8px]">Future Work</span>
                        <p className="font-sans text-slate-500 text-xs leading-snug italic">Future Work Pending</p>
                      </div>
                    </div>
                  )}

                  {inspectorTab === 'docs' && (
                    <div className="grid grid-cols-1 gap-2 font-mono text-xs mt-2">
                      <div className="p-2 rounded bg-slate-900/80 border border-obsidian-border/80 space-y-0.5">
                        <span className="text-violet-400 font-bold uppercase tracking-wider block text-[8px]">Related ADRs</span>
                        {(() => {
                          const relatedAdrs = activeTopology?.decisionLedger?.filter(adr => 
                            adr.title.toLowerCase().includes(activeNode.label.toLowerCase()) ||
                            adr.problem.toLowerCase().includes(activeNode.label.toLowerCase()) ||
                            adr.selected.toLowerCase().includes(activeNode.label.toLowerCase()) ||
                            adr.outcome.toLowerCase().includes(activeNode.label.toLowerCase())
                          );
                          if (relatedAdrs && relatedAdrs.length > 0) {
                            return (
                              <div className="space-y-1 mt-1">
                                {relatedAdrs.map(adr => (
                                  <div key={adr.id} className="px-1.5 py-1 rounded bg-slate-800 border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50" onClick={() => openAdrs(adr.id)}>
                                    <span className="text-amber-400 font-bold">{adr.id}</span>: {adr.title}
                                  </div>
                                ))}
                              </div>
                            );
                          }
                          return <p className="font-sans text-slate-500 text-xs leading-snug italic mt-1">ADR Pending</p>;
                        })()}
                      </div>
                      <div className="p-2 rounded bg-slate-900/80 border border-obsidian-border/80 space-y-0.5">
                        <span className="text-violet-400 font-bold uppercase tracking-wider block text-[8px]">Documentation</span>
                        <p className="font-sans text-slate-500 text-xs leading-snug italic mt-1">Documentation Pending</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Teachable Tech Stack Chips */}
              {activeTopology?.techStack && (
                <div className="pt-2  flex flex-wrap items-center gap-1 font-mono text-xs">
                  <span className="text-slate-500 uppercase tracking-wider text-[8px] mr-1">TEACHABLE TECH:</span>
                  {activeTopology.techStack.map((tech) => (
                    <button type="button"
                      key={tech}
                      onClick={() => handleTechClick(tech)}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-obsidian-border/80 text-cyan-electric hover:bg-cyan-electric/20 hover:border-cyan-electric transition-colors duration-200 cursor-pointer font-bold flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                    >
                      <BookOpen size={9} /> {tech}
                    </button>
                  ))}
                </div>
              )}

              {/* Phase 3: Curiosity Engine Recommendations */}
              {activeTopology?.relatedRecommendations && (
                <div className="pt-2  font-mono text-xs space-y-1">
                  <span className="text-amber-400 font-bold uppercase tracking-wider text-[8px] flex items-center gap-1">
                    <Compass size={10} /> CONTINUE EXPLORING:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeTopology.relatedRecommendations.map((rec, idx) => (
                      <button type="button"
                        key={idx}
                        onClick={() => {
                          playClickSound();
                          if (rec.type === "mission") handleMissionSelect(rec.id);
                          else if (rec.type === "technology") handleTechClick(rec.id);
                          else if (rec.type === "adr") openAdrs(rec.id);
                        }}
                        className="px-2 py-1 rounded bg-slate-900 border border-amber-400/40 text-amber-300 hover:bg-amber-400/20 hover:border-amber-400 transition-colors duration-200 cursor-pointer flex items-center gap-1 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50"
                      >
                        <ArrowRight size={10} /> {rec.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 8: Micro-Education Modal when selecting a tech term */}
        <AnimatePresence>
          {selectedTech && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute top-10 left-1/2 -translate-x-1/2 z-40 max-w-md w-11/12 p-3.5 rounded-xl border border-amber-400/60 bg-slate-950/98 shadow-2xl backdrop-blur-2xl space-y-2 pointer-events-auto"
            >
              <div className="font-sans font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between flex-wrap sm:flex-nowrap gap-y-1 border-b border-obsidian-border/60 pb-2 relative pr-10">
                <span className="flex items-center gap-1.5 truncate">
                  <BookOpen size={12} /> {selectedTech.name}
                </span>
                <button type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    setSelectedTech(null);
                  }}
                  aria-label="Close"
                  className="absolute top-1/2 -translate-y-1/2 -mt-0.5 right-0 min-h-[44px] min-w-[44px] text-slate-400 hover:text-slate-200 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-electric/50 rounded-md flex items-center justify-center"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-1.5 font-sans text-sm text-slate-300">
                <p><span className="kicker text-amber-300/80">Situation </span>{selectedTech.what}</p>
                <p><span className="kicker text-cyan-electric/80">Choice </span>{selectedTech.why}</p>
                <p><span className="kicker text-emerald-300/80">Cost </span>{selectedTech.useCase}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Default Unselected Prompt Banner */}
        {!selectedMissionId && !hoveredNode && !selectedNode && !hoveredLink && !selectedTech && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-md text-center p-2.5 rounded-xl border border-obsidian-border/80 bg-slate-950/85 backdrop-blur-md pointer-events-none space-y-0.5 shadow-xl">
            <div className="kicker text-slate-400 flex items-center justify-center gap-1.5">
              <Compass size={13} /> Open a system
            </div>
            <p className="font-sans text-xs text-slate-400 leading-tight">
              Click a node for situation, choice, and cost.
            </p>
          </div>
        )}
      </div>
      )}

      {/* Layer 3: Contextual Operational Telemetry Status Bar */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5  font-mono text-xs">
        
        <div className="p-2 sm:p-2.5 rounded-lg bg-obsidian-surface/70 border border-obsidian-border/70">
          <span className="text-slate-500 block text-[8px] uppercase tracking-wider">Active Mission</span>
          <span className={cn("font-bold truncate block mt-0.5", themeText)}>
            {activeTopology ? activeTopology.title : "Global Systems Mesh"}
          </span>
        </div>

        <div className="p-2 sm:p-2.5 rounded-lg bg-obsidian-surface/70 border border-obsidian-border/70">
          <span className="text-slate-500 block text-[8px] uppercase tracking-wider">gRPC Worker Pool</span>
          <span className="text-slate-300 font-semibold truncate block mt-0.5">
            {workerPool}
          </span>
        </div>

        <div className="p-2 sm:p-2.5 rounded-lg bg-obsidian-surface/70 border border-obsidian-border/70">
          <span className="text-slate-500 block text-[8px] uppercase tracking-wider">Live Ingest Rate</span>
          <span className="text-cyan-electric font-bold truncate block mt-0.5">
            {pingRate}
          </span>
        </div>

        <div className="p-2 sm:p-2.5 rounded-lg bg-obsidian-surface/70 border border-obsidian-border/70">
          <span className="text-slate-500 block text-[8px] uppercase tracking-wider">Circuit Breaker SLA</span>
          <span className={cn("font-bold truncate block mt-0.5 flex items-center gap-1", isBreakerActive ? "text-rose-400" : trafficDensity === 'HIGH_LOAD' ? "text-amber-400" : "text-emerald-glow")}>
            <CheckCircle2 size={11} /> {healthSLA}
          </span>
        </div>

      </div>

    </div>
  );
}
