# CLAUDE.md

Portfolio website for Muhammet Begenjov, built with Next.js (App Router) in `next/`.
**Read `docs/HANDOFF.md` first** for the design brief, exact values the owner chose and open items
(it was written for the earlier static site; class names, values and behaviour carried over unchanged).
`README.md` has the project data format; `next/README.md` has the app layout.

## Layout
- `next/app/`: `layout.js` (fonts, nav, page wrapper, CTA + footer), `page.js` (home), `work/[slug]/page.js` (project pages), `globals.css` (all styles).
- `next/components/`: one file per section (Hero, Services, Works, Events, About, Footer, ProjectView...).
- `next/lib/projects.js` reads `next/public/projects/index.json` and each `project.json` at build time. `next/lib/events.js` lists the AGI 2025 photos.
- `next/public/projects/<slug>/`: `project.json` + photos. Image paths in project.json are relative to that folder.
- `docs/`: handoff notes, design references (`docs/reference/`), full-size source photos (`docs/source-photos/`, incl. the original AGI 2025 HEIC files), not used by the site.
- `next/public/events/index.json` + `events/<slug>/event.json` (title, story, photos [{file, ratio, alt}]) feed the Events sections; `next/public/site.json` holds `links` [{label, url}] (footer, editable list in the admin; url may be a web address, email, phone, or `/files/<name>` for a file uploaded in the admin, stored in `next/public/files/`, max 3 MB because uploads pass through the Vercel function) plus `email`, `ctaHeading`, `ctaButton` for the yellow panel (`lib/site.js`).
- `next/public/admin/index.html`: admin panel at `/admin` (Projects, Events, Contact tabs), behind a password. It publishes each save as one commit under `next/public/` through `next/app/api/admin/*` (`npm run preview` sets app/api aside, since a static export cannot include it); the server holds the GitHub token (`lib/admin-auth.js`, Vercel env vars ADMIN_PASSWORD and GITHUB_TOKEN, optional GITHUB_REPO / GITHUB_BRANCH). Vercel rebuilds after each commit.
- The old static site (index.html, assets/, projects/, old admin/, preview.command) was removed on 2026-10-29; it is in git history.

## Run it
Node.js is not installed system-wide; a local copy is in `next/.node` (gitignored).
```
cd next && export PATH="$PWD/.node/bin:$PATH"
npm run dev       # http://localhost:3000
npm run build
npm run preview   # static copy for the claude.ai preview Artifact (next/preview/)
```
Preview Artifact: https://claude.ai/artifact/XXzeDzYSs8sWkVzNgJT62c. `scripts/preview.mjs` renames `_next` to `nx` (the Artifact host reserves `_` names) and makes every path relative. Publish `next/preview/index.html` with the files listed in `next/preview-files.json`.
Vercel: project portfolio-website, live at https://begenjov.vercel.app, deploys automatically from GitHub main (Root Directory `next`). Vercel CLI is in `next/.node` and logged in.

## Working rules
- **Preview first:** the owner reviews every change on the claude.ai preview Artifact before it is treated as final.
- Keep the owner's exact pixel values listed in docs/HANDOFF.md unless asked to change them.
- Project pages have no cover photo at the top (owner removed it); they open on the title panel.
- No added animation libraries or effects: the owner removed the Three.js hero, Lenis smooth scrolling and GSAP reveals. Keep only the original interactions (dark flip, services pill, card hover, nav hide, AGI 2025 strip).
- Photos: card 2:3 (at least 700×1050), cover and single rows 16:10 (1600×1000), split rows 4:5. Compress to JPEG around quality 70.
- Owner gives short, precise instructions and wants results identical to the references. Proceed with sensible defaults rather than asking many questions.
