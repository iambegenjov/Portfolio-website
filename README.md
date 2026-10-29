# Muhammet Begenjov — Portfolio

The website is a Next.js app in [`next/`](next/README.md). See that README for running, the folder layout and deploying.

```
next/        The website (Next.js). Projects live in next/public/projects/<slug>/
docs/        Handoff notes, design reference screenshots, full-size source photos (not used by the site)
```

## Admin panel

Open `/admin` on the live site and log in with the admin password to add, edit, reorder or remove projects and events, and to change the contact links. Each save is a commit to GitHub; Vercel updates the site about a minute later.

It needs two settings in Vercel › Project › Settings › Environment Variables (then redeploy):
- `ADMIN_PASSWORD`: the password for `/admin`.
- `GITHUB_TOKEN`: a fine-grained token (github.com › Settings › Developer settings › Fine-grained tokens) for this repository only, with Repository permissions › Contents: Read and write. It stays on the server and never reaches the browser.

## Add or change a project by hand

1. Create `next/public/projects/<slug>/` (lowercase, dashes, e.g. `new-project`).
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

3. Add the slug to `next/public/projects/index.json` where it should appear in Works.

Image sizes: card 2:3 (at least 700×1050), cover and single rows 16:10 (at least 1600×1000), split rows 4:5.

## Deploy

Vercel: import the repository and set **Root Directory** to `next`.
