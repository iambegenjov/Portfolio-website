# Muhammet Begenjov — Portfolio

Static website, ready for GitHub Pages. No build step.

## Folder structure

```
index.html                 Home page + project pages (project pages open at #/work/<slug>)
assets/
  css/main.css             All site styles
  js/main.js               Site behaviour and the project loader
  fonts/                   Faculty Glyphic (headline font)
  img/logo.svg             Logo (also the browser tab icon)
projects/
  index.json               Which projects appear in Works, in order
  <slug>/                  One folder per project, e.g. projects/ugur/
    project.json           Title, category, tags, services, description, image rows
    card.jpg               Works card photo (portrait 2:3)
    cover.jpg              Top photo of the project page (landscape)
    ...                    Gallery photos used by the image rows
admin/index.html           Admin panel
docs/                      Handoff notes, design references, original full-size photos (not used by the site)
preview.command            Double-click to preview locally
```

## Admin panel (live)

Open `/admin/` on the live site. The first time, connect it to GitHub with a fine-grained access token (github.com › Settings › Developer settings › Fine-grained tokens: only this repository, Repository permissions › Contents: Read and write). The token is stored only in that browser.
Then add, edit, reorder or remove projects; each save is published as a commit and the site updates about a minute later.

## Add or change a project by hand

1. Create `projects/<slug>/` (lowercase, dashes, e.g. `new-project`).
2. Add `project.json` and the photos next to it:

```json
{
  "title": "New Project",
  "category": "Hospitality",
  "year": "2026",
  "tags": ["Brand & Identity"],
  "services": ["Brand Strategy", "Visual Identity"],
  "description": "First paragraph shows under the title.\n\nMore paragraphs open with Read more.",
  "card": "card.jpg",
  "cover": "cover.jpg",
  "gallery": [
    { "type": "single", "images": ["gallery-01.jpg"] },
    { "type": "split",  "images": ["gallery-02.jpg", "gallery-03.jpg"] }
  ]
}
```

3. Add the slug to `projects/index.json` where it should appear in Works.

Image sizes: card 2:3 (at least 700×1050), cover and single rows 16:10 (at least 1600×1000), split rows 4:5.

## Preview locally

Double-click `preview.command` (or run `ruby -run -e httpd . -p 8000` in this folder) and open http://localhost:8000.
Opening `index.html` directly shows the page without projects, because browsers block loading project files from disk.
