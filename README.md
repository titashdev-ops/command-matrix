# TITASH DEV — Command Matrix

A spatial HUD portfolio. Interactive architecture case studies, modeled telemetry, and engineering decision records.

This is a **frontend-only** site. There is no live UAV fleet, no SAP/ServiceNow ingest, and no Node/WebSocket server. Moving numbers in the HUD are a client-side demo loop.

## Stack

- React 19 + Vite / TanStack Start
- Tailwind CSS v4
- Framer Motion
- Three.js / React Three Fiber
- Static data in `src/data/`

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Deploy the Vercel output from `npm run build`. Attach `dronly.in` in the Vercel project, then point the domain’s DNS at Vercel.

## Contact

The discovery wizard opens a `mailto:` brief to `titashdev@gmail.com`. No form backend.

## Profiles

- GitHub: [titashdev-ops](https://github.com/titashdev-ops)
- LinkedIn: [titashdeb](https://www.linkedin.com/in/titashdeb)

## Status labels

| Label | Meaning |
|---|---|
| Simulation | Interactive model / teaching artifact |
| Prototype | Partial implementation |
| Documented | Architecture narrative, not a live SLA |
| Concept / Research | Forward-looking, not shipped |

## Not in this repo

- Express + Socket.IO telemetry server
- Gemini API
- Auth, database, CMS
