# Muhammet Begenjov — Portfolio (Next.js)

The portfolio rebuilt on Next.js (App Router).
The original static site in the folder above stays as it was.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

Node.js 20 or newer is needed. On this Mac it lives in `next/.node` (not installed system-wide):
`export PATH="$PWD/.node/bin:$PATH"` before the commands above.

## Deploy on Vercel

Import the GitHub repository in Vercel and set **Root Directory** to `next`.
Everything else is detected automatically (framework Next.js, `npm run build`).

## Where things are

```
app/layout.js            Fonts, nav, page wrapper, CTA + footer
app/page.js              Home: hero, services, works, events, about
app/work/[slug]/page.js  Project pages, one per folder in public/projects
app/globals.css          All styles (same class names and values as the old main.css)
components/              One file per section
lib/projects.js          Reads public/projects/index.json and each project.json at build time
lib/events.js            AGI Open 2025 photos for the Events strip
public/projects/<slug>/  project.json + photos (same format as the old site)
public/events/agi-2025/  Events photos
scripts/preview.mjs      Turns a static export into the claude.ai preview Artifact
```

Projects use the same `project.json` format as before (see the README in the folder above).
Add a folder to `public/projects/` and its slug to `public/projects/index.json`.
