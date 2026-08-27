// Atlas data for the systems map. Surfaced as nodes, edges, and short notes.
// Phase 8: Micro-Educational Technology Library (~35-40 words each)
export const MICRO_EDUCATION_DB = {
  "gRPC": {
    name: "gRPC",
    what: "Typed streams over HTTP/2.",
    why: "Small packets. Many at once.",
    useCase: "You reassemble. You do not handshake.",
  },
  "TimescaleDB": {
    name: "TimescaleDB",
    what: "Postgres that partitions time.",
    why: "Replay without a warehouse.",
    useCase: "Writes wait on the index.",
  },
  "H3": {
    name: "H3",
    what: "Hex cells instead of a radius search.",
    why: "Neighbors are even. Lookup is a hash.",
    useCase: "The grid is a little coarse.",
  },
  "WebRTC": {
    name: "WebRTC",
    what: "A camera that does not wait for a file.",
    why: "The operator has to feel present.",
    useCase: "You need a path through NAT.",
  },
  "EventStore": {
    name: "Event store",
    what: "Append. Never overwrite.",
    why: "Who changed the chart.",
    useCase: "You version the schema.",
  },
  "GraphQL": {
    name: "GraphQL",
    what: "Ask for the graph you need.",
    why: "The clinic is many shapes, one query.",
    useCase: "The schema is a contract.",
  },
  "FHIR v4": {
    name: "FHIR",
    what: "A hospital's idea of a record.",
    why: "So a wearable can talk to a chart.",
    useCase: "You translate. You do not invent.",
  },
  "Redis": {
    name: "Redis",
    what: "Memory that broadcasts.",
    why: "The portal wants this second, not this minute.",
    useCase: "If it restarts, the moment is gone.",
  },
  "Neo4j": {
    name: "Neo4j",
    what: "A graph you can walk.",
    why: "Skills sit next to work, not in a table.",
    useCase: "You pay for the hops.",
  },
  "Ollama": {
    name: "Ollama",
    what: "A model that stays on the machine.",
    why: "The journal never leaves the desk.",
    useCase: "The hardware is the ceiling.",
  },
  "Kafka": {
    name: "Kafka",
    what: "A log everyone can subscribe to.",
    why: "Clinics should not share a write lock.",
    useCase: "You own ordering.",
  },
  "CQRS": {
    name: "CQRS",
    what: "Write one way. Read another.",
    why: "The chart and the search are not the same job.",
    useCase: "The read view lags.",
  }
};

// Flagship Mission Topologies Configuration with deep 4-Pillar Engineering Insights, Decision Ledgers, Evolution & Recommendations
export const MISSION_TOPOLOGIES = {
  "ops-dronly": {
    id: "ops-dronly",
    title: "ops.dronly.in",
    subtitle: "Fleet telemetry",
    accentColor: "cyan",
    hexColor: "#00f0ff",
    textClass: "text-cyan-electric",
    borderClass: "border-cyan-electric/40",
    bgClass: "bg-cyan-electric/10",
    glowClass: "shadow-[0_0_15px_rgba(0,240,255,0.25)]",
    techStack: ["gRPC", "TimescaleDB", "H3", "WebRTC"],
    insight: {
      problem: "Positions arrive faster than a table wants to take them.",
      decision: "Stream at the edge. Index in hexes. Cache the hot path.",
      tradeoff: "You own packet order. The viewport stays smooth.",
      context: "A fleet operator who has to feel present."
    },
    nodes: [
      { 
        id: "c2-core", 
        label: "Ingest", 
        x: 50, y: 35, 
        isCore: true, 
        detail: "Ingests 50k telemetry pings/sec with <2ms jitter across distributed UAV clusters.",
        insight: {
          problem: "Positions arrive faster than a table wants.",
          decision: "Stream them. Cache the hot path.",
          tradeoff: "You own packet order.",
          context: "Core command-and-control telemetry server in mission-critical robotics."
        }
      },
      { 
        id: "grpc-broker", 
        label: "Edge", 
        x: 22, y: 18, 
        isCore: false, 
        detail: "Low-latency bi-directional UDP/gRPC gateway operating on edge gateways.",
        insight: {
          problem: "The cell drops mid-flight.",
          decision: "UDP at the edge. gRPC on the way back.",
          tradeoff: "You reassemble. You do not handshake.",
          context: "Edge network gateways for cellular IoT devices and aerial robotics."
        }
      },
      { 
        id: "h3-spatial", 
        label: "Hexes", 
        x: 78, y: 18, 
        isCore: false, 
        detail: "Hierarchical hexagonal spatial indexing for real-time airspace collision avoidance.",
        insight: {
          problem: "Pairwise distance does not scale.",
          decision: "Hex buckets. Look up the neighbors.",
          tradeoff: "The grid is a little coarse.",
          context: "Urban air mobility, drone geofencing, and proximity-based fleet routing."
        }
      },
      { 
        id: "webrtc-stream", 
        label: "Viewport", 
        x: 18, y: 68, 
        isCore: false, 
        detail: "Sub-100ms camera feed passthrough with H.264 hardware encoding.",
        insight: {
          problem: "HLS is too late if someone is still flying.",
          decision: "WebRTC for the loop.",
          tradeoff: "You need a path through NAT.",
          context: "Live FPV tele-operation, robotic vision streams, and surveillance dashboards."
        }
      },
      { 
        id: "circuit-breaker", 
        label: "Shed", 
        x: 82, y: 68, 
        isCore: false, 
        detail: "Automatic failover circuit breaker tripping at 95% channel saturation.",
        insight: {
          problem: "A backlog can take the core with it.",
          decision: "Shed the extra pings. Keep the loop.",
          tradeoff: "Some ticks never land.",
          context: "Resilient enterprise systems, distributed microservices, and fail-safe networks."
        }
      },
      { 
        id: "timescale-db", 
        label: "Replay", 
        x: 50, y: 82, 
        isCore: false, 
        detail: "Partitioned hypertable time-series store for trajectory replay and diagnostics.",
        insight: {
          problem: "Raw GPS fills a disk.",
          decision: "Compress the chunks. Replay the path.",
          tradeoff: "Writes wait on the index.",
          context: "Flight trajectory replay, telemetry audit compliance, and predictive maintenance."
        }
      }
    ],
    links: [
      { from: "grpc-broker", to: "c2-core", relation: "Ingress" },
      { from: "h3-spatial", to: "c2-core", relation: "Index" },
      { from: "c2-core", to: "webrtc-stream", relation: "Sync" },
      { from: "c2-core", to: "circuit-breaker", relation: "Shed" },
      { from: "c2-core", to: "timescale-db", relation: "Store" },
      { from: "grpc-broker", to: "h3-spatial", relation: "Bounds" }
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
    subtitle: "Clinic events",
    accentColor: "violet",
    hexColor: "#a78bfa",
    textClass: "text-violet-400",
    borderClass: "border-violet-400/40",
    bgClass: "bg-violet-400/10",
    glowClass: "shadow-[0_0_15px_rgba(167,139,250,0.25)]",
    techStack: ["EventStore", "GraphQL", "CQRS"],
    insight: {
      problem: "Clinics overwrite the same row and lose who changed what.",
      decision: "Write events. Read from a projection. Sync when the line comes back.",
      tradeoff: "You own schema versions. You keep an audit trail.",
      context: "A practice that cannot guess who saw a chart."
    },
    nodes: [
      { 
        id: "event-store", 
        label: "Events", 
        x: 50, y: 35, 
        isCore: true, 
        detail: "Immutable append-only event store for clinical audit trails and state projections.",
        insight: {
          problem: "A row overwrite loses who changed what.",
          decision: "Write events. Read a projection.",
          tradeoff: "You version the schema.",
          context: "HIPAA audit ledgers, medical treatment logs, and clinical history timelines."
        }
      },
      { 
        id: "hipaa-audit", 
        label: "Lock", 
        x: 20, y: 20, 
        isCore: false, 
        detail: "Zero-knowledge encryption for PHI data streams with strict RBAC enforcement.",
        insight: {
          problem: "A shared clinic cannot leak a chart.",
          decision: "Encrypt the field before it hits the wire.",
          tradeoff: "Search needs a hash, not the text.",
          context: "Healthcare security compliance, HIPAA & GDPR privacy enforcement."
        }
      },
      { 
        id: "dental-chart", 
        label: "Chart", 
        x: 80, y: 20, 
        isCore: false, 
        detail: "3D real-time odontogram state reducer with optimistic UI synchronization.",
        insight: {
          problem: "The chart cannot wait on the server.",
          decision: "Reduce locally. Sync when you can.",
          tradeoff: "Two hygienists can collide.",
          context: "3D medical imaging, dental odontogram charts, and interactive surgical tools."
        }
      },
      { 
        id: "dicom-pipe", 
        label: "X-ray", 
        x: 18, y: 68, 
        isCore: false, 
        detail: "Automated radiograph image ingestion with GPU-accelerated contrast normalization.",
        insight: {
          problem: "An X-ray is too big for the waiting room.",
          decision: "Chunk it. Normalize at the edge.",
          tradeoff: "You need a GPU worker.",
          context: "PACS medical imaging, dental radiograph storage, and diagnostic vision tools."
        }
      },
      { 
        id: "multi-tenant", 
        label: "Tenants", 
        x: 82, y: 68, 
        isCore: false, 
        detail: "Tenant isolation gateway providing dynamic database schema partitioning.",
        insight: {
          problem: "Two clinics cannot share a row.",
          decision: "A key per practice. A schema per key.",
          tradeoff: "Migrations run N times.",
          context: "Enterprise healthcare SaaS platforms, multi-tenant B2B architectures."
        }
      },
      { 
        id: "sync-relays", 
        label: "Offline", 
        x: 50, y: 82, 
        isCore: false, 
        detail: "Offline-first clinic local node relay with automatic peer reconciliations.",
        insight: {
          problem: "The line goes down mid-appointment.",
          decision: "A local copy. Reconcile later.",
          tradeoff: "Conflicts wait for reconnect.",
          context: "Offline-first medical software, remote health clinics, and disaster-proof systems."
        }
      }
    ],
    links: [
      { from: "hipaa-audit", to: "event-store", relation: "Lock" },
      { from: "dental-chart", to: "event-store", relation: "Log" },
      { from: "event-store", to: "dicom-pipe", relation: "Work" },
      { from: "event-store", to: "multi-tenant", relation: "Isolate" },
      { from: "event-store", to: "sync-relays", relation: "Pair" }
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
    title: "Motion",
    subtitle: "Rehab loop",
    accentColor: "amber",
    hexColor: "#fbbf24",
    textClass: "text-amber-400",
    borderClass: "border-amber-400/40",
    bgClass: "bg-amber-400/10",
    glowClass: "shadow-[0_0_15px_rgba(251,191,36,0.25)]",
    techStack: ["Redis", "FHIR v4"],
    insight: {
      problem: "Rehab notes live in one system. Motion lives in another.",
      decision: "A shared event bus. Pose on camera. Feedback in the same hour.",
      tradeoff: "You translate hospital shapes. The coach sees the session.",
      context: "A clinic that wants a loop, not a weekly PDF."
    },
    nodes: [
      { 
        id: "fhir-bus", 
        label: "Bus", 
        x: 50, y: 35, 
        isCore: true, 
        detail: "Interoperable clinical message broker streaming FHIR v4 compliant health records.",
        insight: {
          problem: "Hospitals do not speak the same shape.",
          decision: "One event shape for everyone.",
          tradeoff: "The payload gets fatter.",
          context: "Hospital software integrations, health telemetry exchanges, and patient portals."
        }
      },
      { 
        id: "biometric-ingest", 
        label: "Wearable", 
        x: 22, y: 18, 
        isCore: false, 
        detail: "High-frequency wearable telemetry for heart-rate variability and kinematic tracking.",
        insight: {
          problem: "A wristband drops samples.",
          decision: "Smooth on the phone. Then stream.",
          tradeoff: "You pay ~50ms.",
          context: "Wearable health monitoring, athletic performance tracking, and biomechanics."
        }
      },
      { 
        id: "cds-engine", 
        label: "Corridor", 
        x: 78, y: 18, 
        isCore: false, 
        detail: "Rules-based automated engine evaluating recovery trajectory against clinical benchmarks.",
        insight: {
          problem: "A coach cannot watch every joint.",
          decision: "A rule for the corridor. A ping if they leave it.",
          tradeoff: "A clinician has to own the rule.",
          context: "Automated clinical alert systems, patient risk scoring, and rehab monitoring."
        }
      },
      { 
        id: "rehab-tracker", 
        label: "Pose", 
        x: 18, y: 68, 
        isCore: false, 
        detail: "Computer vision kinematic range-of-motion angle quantification worker.",
        insight: {
          problem: "Self-report lies.",
          decision: "Pose on the camera. Count the angle.",
          tradeoff: "The room has to be lit.",
          context: "Computer-vision physiotherapy, joint angle quantification, and digital health."
        }
      },
      { 
        id: "ehr-bridge", 
        label: "Translate", 
        x: 82, y: 68, 
        isCore: false, 
        detail: "Bidirectional converter translating HL7 v2 messages to modern FHIR streams.",
        insight: {
          problem: "The hospital still speaks HL7 v2.",
          decision: "Translate into the event bus.",
          tradeoff: "The parser is the job.",
          context: "Enterprise healthcare integration, hospital IT infrastructure, and EHR sync."
        }
      },
      { 
        id: "patient-portal", 
        label: "Practice", 
        x: 50, y: 82, 
        isCore: false, 
        detail: "End-to-end encrypted mobile client receiving real-time clinical exercise plans.",
        insight: {
          problem: "Paper handouts do not get done.",
          decision: "Show the motion. Count the set.",
          tradeoff: "The phone has to keep up.",
          context: "Patient engagement apps, remote care management, and mobile health."
        }
      }
    ],
    links: [
      { from: "biometric-ingest", to: "fhir-bus", relation: "Stream" },
      { from: "cds-engine", to: "fhir-bus", relation: "Guard" },
      { from: "fhir-bus", to: "rehab-tracker", relation: "Pose" },
      { from: "fhir-bus", to: "ehr-bridge", relation: "Sync" },
      { from: "fhir-bus", to: "patient-portal", relation: "Loop" }
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
    subtitle: "Skills as a graph",
    accentColor: "emerald",
    hexColor: "#34d399",
    textClass: "text-emerald-glow",
    borderClass: "border-emerald-glow/40",
    bgClass: "bg-emerald-glow/10",
    glowClass: "shadow-[0_0_15px_rgba(52,211,153,0.25)]",
    techStack: ["Neo4j", "Kafka"],
    insight: {
      problem: "A resume cannot hold a trade-off.",
      decision: "A graph of skills, cases, and notes you can open.",
      tradeoff: "You curate the nodes. The reader gets a path, not a PDF.",
      context: "This site."
    },
    nodes: [
      { 
        id: "skill-matrix", 
        label: "Skills", 
        x: 50, y: 35, 
        isCore: true, 
        detail: "High-dimensional vector embedding space connecting engineering domain competencies.",
        insight: {
          problem: "Keywords miss the neighbor skill.",
          decision: "Put skills near each other in a space.",
          tradeoff: "You have to tune the distances.",
          context: "Skill taxonomy mapping, competency evaluation, and developer portfolios."
        }
      },
      { 
        id: "arch-index", 
        label: "Notes", 
        x: 22, y: 20, 
        isCore: false, 
        detail: "Structured mapping linking engineering decisions directly to live proof assets.",
        insight: {
          problem: "A claim without a note is a claim.",
          decision: "Link the choice to the case.",
          tradeoff: "You keep the links honest.",
          context: "Architectural documentation, ADR indexes, and technical audit logs."
        }
      },
      { 
        id: "project-graph", 
        label: "Cases", 
        x: 78, y: 20, 
        isCore: false, 
        detail: "Dynamic dependency graph mapping case studies to architectural artifacts.",
        insight: {
          problem: "A case study hides the joints.",
          decision: "Draw the graph. Open a node.",
          tradeoff: "Layout is work.",
          context: "Interactive system diagrams, software cartography, and documentation."
        }
      },
      { 
        id: "seniority-eval", 
        label: "Scope", 
        x: 18, y: 68, 
        isCore: false, 
        detail: "Quantifies technical scope, architectural ownership, and systemic business impact.",
        insight: {
          problem: "Seniority is usually a vibe.",
          decision: "Show the scope of the choice.",
          tradeoff: "The numbers here are teaching notes.",
          context: "Technical leadership evaluation, career progression frameworks, and talent assessment."
        }
      },
      { 
        id: "impact-analyzer", 
        label: "Model", 
        x: 82, y: 68, 
        isCore: false, 
        detail: "Calculates throughput improvements, latency drops, and availability metrics.",
        insight: {
          problem: "Abstract work hides the cost.",
          decision: "Show latency and dollars as a model.",
          tradeoff: "Not a measured SLA.",
          context: "System benchmarking, performance profiling, and ROI measurement."
        }
      },
      { 
        id: "export-engine", 
        label: "Cover", 
        x: 50, y: 82, 
        isCore: false, 
        detail: "Generates context-aware technical briefs for engineering leadership.",
        insight: {
          problem: "A recruiter and a CTO want different depths.",
          decision: "A cover first. The rest on open.",
          tradeoff: "Two layouts, one source.",
          context: "Executive briefing tools, interactive resumes, and technical documentation."
        }
      }
    ],
    links: [
      { from: "arch-index", to: "skill-matrix", relation: "Proof" },
      { from: "project-graph", to: "skill-matrix", relation: "Proof" },
      { from: "skill-matrix", to: "seniority-eval", relation: "Scope" },
      { from: "skill-matrix", to: "impact-analyzer", relation: "Worth" },
      { from: "skill-matrix", to: "export-engine", relation: "Cover" }
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
    subtitle: "Notes on this machine",
    accentColor: "rose",
    hexColor: "#fb7185",
    textClass: "text-rose-400",
    borderClass: "border-rose-400/40",
    bgClass: "bg-rose-400/10",
    glowClass: "shadow-[0_0_15px_rgba(251,113,133,0.25)]",
    techStack: ["Ollama"],
    insight: {
      problem: "Third-party cloud AI assistants expose private personal journal entries, notes, and code logs to public model training.",
      decision: "Architected a 100% air-gapped local AI agent powered by Ollama and encrypted vector stores running on private hardware.",
      tradeoff: "Absolute zero-knowledge data privacy; model speed is constrained by local GPU hardware capacity.",
      context: "Private executive AI assistants, air-gapped document intelligence, and personal knowledge bases."
    },
    nodes: [
      { 
        id: "context-agent", 
        label: "Local model", 
        x: 50, y: 35, 
        isCore: true, 
        detail: "Local private LLM orchestrator running on dedicated hardware for deep contextual synthesis.",
        insight: {
          problem: "A public model sees the journal.",
          decision: "Run it on this machine.",
          tradeoff: "You need a GPU here.",
          context: "Air-gapped enterprise AI, confidential research, and private knowledge synthesis."
        }
      },
      { 
        id: "vector-vault", 
        label: "Vault", 
        x: 22, y: 18, 
        isCore: false, 
        detail: "Encrypted local LanceDB vector store holding personal engineering journal entries.",
        insight: {
          problem: "Years of notes are not searchable.",
          decision: "Embed them locally.",
          tradeoff: "You rebuild the index.",
          context: "Personal knowledge management, second-brain PKM, and semantic memory."
        }
      },
      { 
        id: "journal-sync", 
        label: "Journal", 
        x: 78, y: 18, 
        isCore: false, 
        detail: "Synthesizes daily commit logs, ADR updates, and architectural notes into a knowledge graph.",
        insight: {
          problem: "The day's choice evaporates.",
          decision: "Parse commits and notes into a graph.",
          tradeoff: "Markdown is messy.",
          context: "Automated developer logging, engineering history tracking, and knowledge bases."
        }
      },
      { 
        id: "task-synthesizer", 
        label: "Focus", 
        x: 18, y: 68, 
        isCore: false, 
        detail: "Dynamic priority scheduler structuring deep work blocks based on cognitive load.",
        insight: {
          problem: "Context switch kills the afternoon.",
          decision: "Group the hard work.",
          tradeoff: "You still have to sit down.",
          context: "Cognitive load optimization, deep work scheduling, and productivity systems."
        }
      },
      { 
        id: "zk-auth", 
        label: "Key", 
        x: 82, y: 68, 
        isCore: false, 
        detail: "Hardware security key authorization protecting context access.",
        insight: {
          problem: "A stolen laptop is the vault.",
          decision: "A hardware key. No key, no notes.",
          tradeoff: "Lose the key, lose the path.",
          context: "Hardware security, zero-knowledge encryption, and high-security workstation storage."
        }
      },
      { 
        id: "offline-sync", 
        label: "Pair", 
        x: 50, y: 82, 
        isCore: false, 
        detail: "Encrypted peer-to-peer device state replication across local workstations.",
        insight: {
          problem: "Two machines. No cloud.",
          decision: "Encrypt the delta over the LAN.",
          tradeoff: "They have to be in the same room.",
          context: "Peer-to-peer file synchronization, local-first software, and air-gapped backups."
        }
      }
    ],
    links: [
      { from: "vector-vault", to: "context-agent", relation: "Memory" },
      { from: "journal-sync", to: "context-agent", relation: "Journal" },
      { from: "context-agent", to: "task-synthesizer", relation: "Focus" },
      { from: "context-agent", to: "zk-auth", relation: "Key" },
      { from: "context-agent", to: "offline-sync", relation: "Pair" }
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
export const AMBIENT_NODES = [
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

export const AMBIENT_LINKS = [
  { from: "amb-1", to: "amb-3", relation: "Ingress" },
  { from: "amb-2", to: "amb-3", relation: "Command" },
  { from: "amb-3", to: "amb-4", relation: "Index" },
  { from: "amb-3", to: "amb-5", relation: "Log" }
];

