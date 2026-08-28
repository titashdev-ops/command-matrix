export const ADR_RECORDS = [
  {
    "id": "adr-001",
    "relatedComponents": "Edge Functions, EventStore",
    "relatedArchitecture": "Global Incident Pipeline",
    "relatedDocumentation": "Pending Documentation",
    "relatedBenchmarks": "Pending Validation",
    "date": "2023-11-04",
    "title": "Serverless for burst traffic",
    "problem": "Storms of requests. You either over-provision or drop them.",
    "context": "Incident load is spiky. Always-on VMs sit idle, then get late when the storm actually arrives.",
    "rejectedAlternatives": [
      {
        "name": "Kubernetes",
        "description": "Scales, but you pay for the control plane and the ops."
      },
      {
        "name": "Auto-scaling VMs",
        "description": "Takes minutes. The storm is already over — or already dropped."
      }
    ],
    "decision": "Serverless functions",
    "tradeoffs": "Scales in, scales out. Cold starts still need a cache in front of anything latency-sensitive.",
    "consequences": "Less ops on burst traffic. A documented choice, not a capacity certificate.",
    "currentStatus": "Documented"
  },
  {
    "id": "adr-002",
    "relatedComponents": "Canvas, WebGL Context, React Reconciler",
    "relatedArchitecture": "Spatial Telemetry Matrix",
    "relatedDocumentation": "R3F Documentation",
    "relatedBenchmarks": "60FPS Render Benchmark",
    "date": "2023-11-12",
    "title": "React with TypeScript",
    "problem": "A WebGL scene and a DOM UI have to share a brain without lying to each other.",
    "context": "The HUD mixes canvas and chrome. Untyped glue is where the two worlds fall apart.",
    "rejectedAlternatives": [
      {
        "name": "Vanilla JS",
        "description": "Light, but no shared model for nested UI state."
      },
      {
        "name": "React without types",
        "description": "Fine until a refactor. Then you find it at runtime."
      }
    ],
    "decision": "React + TypeScript",
    "tradeoffs": "Fewer surprise crashes. Slower compiles. Types have to be kept honest at the edges.",
    "consequences": "Safer refactors of the HUD. High-frequency ticks still stay off the React tree.",
    "currentStatus": "Documented"
  },
  {
    "id": "adr-003",
    "relatedComponents": "LLM Orchestrator, Zod Schemas",
    "relatedArchitecture": "Hybrid Vector-Graph Engine",
    "relatedDocumentation": "Pending Documentation",
    "relatedBenchmarks": "Vector DB Retrieval Latency",
    "date": "2023-12-05",
    "title": "Validate LLM JSON",
    "problem": "Models return whatever they want. The view cannot.",
    "context": "If a malformed payload reaches React, the screen dies. Guessing the shape is not a plan.",
    "rejectedAlternatives": [
      {
        "name": "Regex parsers",
        "description": "Brittle. Breaks on the next surprise field."
      },
      {
        "name": "Try/catch fallback",
        "description": "Stops a crash. Does not guarantee the shape."
      }
    ],
    "decision": "Zod at the boundary",
    "tradeoffs": "Types and schemas have to stay in sync. A little runtime cost.",
    "consequences": "Bad JSON never hits the view. A defensive pattern, not a stability percentage.",
    "currentStatus": "Documented"
  },
  {
    "id": "adr-004",
    "relatedComponents": "WebGL Rendering Context, OrbitControls",
    "relatedArchitecture": "UAV Telemetry Ingestion",
    "relatedDocumentation": "Pending Documentation",
    "relatedBenchmarks": "gRPC Telemetry Ingestion Profile",
    "date": "2024-01-18",
    "title": "React Three Fiber",
    "problem": "Thousands of points. Two state systems. Easy to leak memory.",
    "context": "Imperative Three.js next to React is a second app you have to keep in sync.",
    "rejectedAlternatives": [
      {
        "name": "Bare Three.js",
        "description": "Full control. You own disposal and the React handshake."
      },
      {
        "name": "CSS 3D",
        "description": "Fine for a few cards. Not for a field of nodes."
      }
    ],
    "decision": "React Three Fiber",
    "tradeoffs": "A scene that reads like React. You still have to memoize when the node count climbs.",
    "consequences": "The field is a component tree. Desktop only — phones skip WebGL.",
    "currentStatus": "Documented"
  },
  {
    "id": "adr-005",
    "relatedComponents": "SystemCommandContext, SpatialContext",
    "relatedArchitecture": "Application Shell",
    "relatedDocumentation": "Pending Documentation",
    "relatedBenchmarks": "Pending Validation",
    "date": "2024-02-22",
    "title": "Context for the shell",
    "problem": "Modals and tabs live everywhere. They should not rerender the world.",
    "context": "The shell needs a few shared flags. Telemetry ticks are a different problem.",
    "rejectedAlternatives": [
      {
        "name": "Redux",
        "description": "Predictable. Too much ceremony for a handful of flags."
      },
      {
        "name": "Zustand",
        "description": "Light, but extra for low-frequency UI state."
      }
    ],
    "decision": "React context for the shell, local state for the rest",
    "tradeoffs": "No extra store. Split the context or the tree pays.",
    "consequences": "Enough for modals and tabs. High-frequency ticks stay in refs. A shell for this portfolio, not a live bus.",
    "currentStatus": "Simulation"
  }
];
