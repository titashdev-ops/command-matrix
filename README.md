# command-matrix

Frontend portfolio of architecture case studies and modeled systems by [Titash Deb](https://github.com/titashdev-ops).

Live site: [command-matrix-nine.vercel.app](https://command-matrix-nine.vercel.app)

![Command Matrix share card](public/og.jpg)

## What this is

A browsable portfolio of architecture case studies, decision records, and modeled systems. The home page features selected studies. The library holds the rest. The visual system is a spatial HUD. The data is static files in `src/data/`.

## What this is not

- Not a live operations platform
- Not a UAV fleet controller, SAP system, or ServiceNow integration
- Not a production telemetry pipeline
- No auth, database, or CMS
- Canvas motion is client-side atmosphere, not live telemetry

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

## Build

```bash
npm run build
npm run typecheck
```

Deployed as a Vercel project from this repository.

## Contact

The discovery wizard opens a `mailto:` brief to `titashdev@gmail.com`. Closing the form clears it. There is no form backend, and the brief is not saved in the browser.

## Layout

```text
src/           HUD UI, routes, and case-study data
public/        Favicon and share card
scripts/       Host-preview adapters (PWA/OG injection)
server/        TanStack Start / Nitro build adapter
```

The product is a static SPA. `scripts/` and `server/` exist so the same repo can build on the hosted preview and on Vercel. They are not an application backend. There is no runtime API.

## License

MIT. See [LICENSE](LICENSE).
