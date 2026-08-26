# command-matrix

Frontend portfolio of systems architecture case studies by [Titash Dev](https://github.com/titashdev-ops).

Live site: [command-matrix-nine.vercel.app](https://command-matrix-nine.vercel.app)

![Command Matrix share card](public/og.jpg)

## What this is

A browsable set of architecture case studies, decision records, and interactive models. The visual system is a spatial HUD. The data is static files in `src/data/`.

## What this is not

- Not a live operations platform
- Not a UAV fleet controller, SAP system, or ServiceNow integration
- Not a production telemetry pipeline
- No auth, database, or CMS
- Moving numbers in the UI are a **client-side demo loop**, not production data

Status: **prototype / simulation**.

## Stack

- React 19
- Vite / TanStack Start
- Tailwind CSS v4
- Framer Motion
- Three.js / React Three Fiber

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default is port 8080).

## Build

```bash
npm run build
npm run typecheck
```

Deployed as a Vercel project from this repository.

## Contact

The discovery wizard opens a `mailto:` brief to `titashdev@gmail.com`. There is no form backend.

## Layout

```text
src/           HUD UI, routes, and case-study data
public/        Favicon and share card
scripts/       Vite host adapters (PWA/OG injection for the hosted preview)
server/        TanStack Start / Nitro middleware used at build time
```

## License

MIT. See [LICENSE](LICENSE).
