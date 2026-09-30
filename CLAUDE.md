# CLAUDE.md

Portfolio website for Muhammet Begenjov. Static site for GitHub Pages, no build step.
**Read `docs/HANDOFF.md` first** for the design brief, exact values the owner chose and open items.
`README.md` has the folder structure and the project data format.

## Layout
- `index.html`: markup only (home sections + an empty `<article class="project">` filled for project pages).
- `assets/css/main.css`, `assets/js/main.js`: all styles and behaviour. The project loader at the end of main.js reads `projects/index.json` and each `projects/<slug>/project.json`, builds the Works cards and renders project pages at `#/work/<slug>`.
- `projects/<slug>/`: one folder per project with `project.json` and its photos. Image paths in project.json are relative to that folder.
- `admin/index.html`: live admin. It connects to the GitHub repository with a fine-grained token (Contents: read and write, stored only in the browser), reads `projects/` through the GitHub API and publishes each save as one commit (Git Data API: blobs, tree, commit, ref). New images get unique names (`card-<id>.jpg`); images no longer used by a project are deleted in the same commit. Without a connection it shows `../projects` read-only.
- `docs/`: handoff notes, design reference screenshots (`docs/reference/`), full-size source photos (`docs/source-photos/`, not used by the site).

## Run it
Projects are loaded with fetch(), so open the site through a server, not `file://`:
double-click `preview.command`, or `ruby -run -e httpd . -p 8000` from Terminal. Servers started by the Claude app cannot read the Desktop folder (macOS privacy), so in Claude sessions copy the folder to the scratchpad and serve it from there.

## Working rules
- **Preview first:** the owner reviews every change on the claude.ai preview Artifact before it touches the local files. Build changes on a copy, publish the preview, and apply locally only after they say "approve".
- Keep the owner's exact pixel values listed in docs/HANDOFF.md unless asked to change them.
- Photos: card 2:3 (at least 700×1050), cover and single rows 16:10 (1600×1000), split rows 4:5. Compress to JPEG around quality 70.
- Owner gives short, precise instructions and wants results identical to the references. Proceed with sensible defaults rather than asking many questions.
