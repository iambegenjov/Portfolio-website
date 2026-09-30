# Handoff: Muhammet Begenjov portfolio website

Read this first. It gives a new Claude session everything needed to continue.

> **Update 2026-09-30: the site was split into folders.** Styles are now in `assets/css/main.css`, behaviour in `assets/js/main.js`, and each project lives in `projects/<slug>/` (`project.json` + photos) instead of being embedded in index.html. See README.md for the structure. Sections below that mention base64, inline styles or `<template class="pj-gallery-data">` describe the old single-file version; the CSS class names, values and behaviour are unchanged.

## What this is
A single-file portfolio website (`index.html`) for Muhammet Begenjov, plus a private
admin tool (`admin.html`). Design goal set by the owner: **match COLLINS (wearecollins.com)
in style/layout/motion**, with the footer modelled on **Fiasco (fiasco.design)**.
Reference screenshots are in `reference/`.

## Files
- `index.html` - the site. Self-contained: CSS, JS, logo SVG, font and images all inline.
- `admin.html` - project admin panel (localStorage, exports card HTML).
- `assets/logo.svg` - owner's logo. `assets/FacultyGlyphic-Regular.ttf` - headline font.
- `assets/originals/` - full-size project photos. `assets/web/` - the 700px compressed versions embedded in index.html.
- `reference/` - COLLINS and Fiasco screenshots the owner supplied as the design targets.

## Do not print index.html to the terminal
It contains ~330 KB of base64 (font + 3 images). Never `cat` it or grep lines that match
inside the base64 blocks; use `grep -n "pattern" | cut -c1-200` or view line ranges.

## Structure of index.html (top to bottom)
1. `nav` (sticky): 6px black top bar + logo SVG (`.logo-mark`, height 28px) + hamburger. Hides on scroll down, returns on scroll up.
2. `.hero`: centered headline "Design that earns its place." (clamp 26px-60px), 3 featured-project line + capability chips.
3. `.services`: eyebrow, heading, pill CTA, 4 rows (`.row`).
4. `.studies#work` ("Works"): eyebrow, heading, "Explore" pill, horizontal `.cards` row.
5. `.about`: dark statement section.
6. `.cta-panel`: yellow (#f5ec3d) "Let's move forward with your next project" + "Drop me a line" pill + back-to-top button.
7. `footer`: dark panel with link columns, copyright and a giant logo wordmark.

Sections 1-5 sit inside `<main class="page">`; 6-7 are revealed beneath it (see "Footer reveal" below).

## Design tokens (`:root`)
--bg #f5f3ee, --ink #15100c, --muted #75695c, --line rgba(21,16,12,.14),
--dark-bg #130d0a, --dark-ink #f4efe6, --dark-muted #9a8f80.
Fonts: headlines `Faculty Glyphic` (embedded base64 @font-face, owner's file), body/UI `Inter` (Google Fonts link).

## Behaviours (all vanilla JS at the bottom of index.html)
- **Light-to-dark page flip**: IntersectionObserver on `.services`; when Services has fully scrolled above the viewport (`boundingClientRect.bottom <= 0`) `body.is-dark` is added. Sections use `body.is-dark .x {...}` overrides with .5s transitions. Default (static) state of Works/About is LIGHT - owner asked for this explicitly. Nav background/logo/hamburger also follow `is-dark`.
- **Nav hide/show**: rAF-throttled scroll listener toggles `nav.nav-hidden` (translateY(-100%)).
- **Services hover**: one shared `.row-pill` inside `.rows` (positioned by a small script on row mouseenter) slides between rows (top/height .45s) instead of each row fading its own pill; it fades in on first row and out when leaving `.rows`. Styling: (radius 20px, soft shadow `0 30px 60px -20px rgba(21,16,12,.22)`), text inverts, title shifts right 26px, arrow (`.arrow`, absolutely positioned at far right of the row) fades in. Adjacent divider lines hide (`.row:hover` and `.row:has(+ .row:hover)` set border-color transparent). Pill starts at scale(1.02) and settles to 1 (owner wanted shrink-in, not grow-in).
- **Footer reveal** (matches Fiasco, reference/fiasco-footer-*.jpg): hero through About are wrapped in `<main class="page">` (z-index 3, rounded bottom corners 32px, soft shadow, back-to-top button at its bottom-left). `.cta-panel` is `position:sticky; bottom:0; z-index:2` with `margin-top:-32px`, so it waits at the viewport bottom under the page and is uncovered as the page scrolls up; it has rounded bottom corners, min-height 52vh, heading max-width 12em (owner shortened both). `footer` is normal flow (z-index 1, `margin-top:-32px` to fill behind the yellow corners) with a 4-column grid (3 link columns + copyright) and the giant wordmark at the bottom. Nav z-index 50 stays on top.

## Exact values the owner chose (keep unless asked)
- Logo height 28px (19px under 700px wide).
- Hero h1 `clamp(26px,4vw,60px)`.
- Service row: padding `24px 28px 24px 0`, title 26px, hover shift 26px, no negative margins (dividers must all be equal length).
- Work cards: `flex:0 0 340px; height:520px; border-radius:16px; gap:18px`, image on a `.card-img` layer (`--img` custom property); on hover its bottom edge lifts 80px via clip-path to reveal `.card-info` (project name + industry, bottom-aligned with the card edge), and the photo (`.card-img::before`) drifts up 22px inside the mask, and a diagonal arrow (`.card-arrow`, fixed at -45deg, no rotation animation) fades in at the bottom right sliding 10px diagonally up; on mouse-out the text fades in .1s, then the photo drops back (.4s, .05s delay); always lifted on touch screens (hover:none), horizontal scroll, mobile 78vw x 420px. Cards are `.c1/.c2/.c3` with base64 JPEG backgrounds (Yupek Yoly, Ugur, Al Basma, in that order).
- Cards on the Works section show photos only. Project names/categories (Yupek Yoly: education centre, Chinese-language studies in Turkmenistan, 2026; Ugur: logistics, "Delivering Promise", 2026; Al Basma: Lexus retail / auto gallery, 2025) now show on hover as name + industry (Education, Logistics, Automotive Retail).

## Project pages
Every card links to `#/work/<slug>`. Home sections sit in `.view-home`; a router script at the bottom of index.html hides them and renders `<article class="project">`, modelled on fiasco.design/work/boundless:
- `.pj-hero`: full-width photo (75vh, sticky, nav transparent over it via `body.pj-over-hero`). Uses `--hero` from classes `.h1/.h2/.h3` (1600x1000 crops in assets/web/*-hero.jpg), else the card photo. Hidden once the panel covers it so the panel corners show the yellow layer.
- `.pj-panel`: light panel, radius 40px top / 32px bottom, margin-top -80px, slides over the hero. Grid 15.2fr 45.3fr 9.2fr 15fr 15.2fr: left = project title as the headline (no separate italic name, owner removed it), then the summary/first description paragraph + Read more; right = category pills + services list.
- `.pj-gallery`: image rows under the text, same side margins (15.2%) as the text. Row types `.pj-row--single` (16:10) and `.pj-row--split` (two 4:5). Rows come from `<template class="pj-gallery-data" data-for="<slug>">` inside `.cards`; admin.html exports these with each card (layout chosen per row). Current rows use the hero crop, card photo and `.d1/.d2/.d3` detail crops (assets/web/*-detail.jpg) as placeholders.
- Then "Next project". Name/industry/photo come from the card; year, category, services, headline and text come from `PROJECTS` in the script (placeholder copy, needs confirming). `body.on-project` keeps the page light and the body background dark (for the yellow panel corners). Routing also runs on link clicks (pushState) so it works in embedded previews.

## Works cards row
`.cards` is full-bleed (runs to the screen edges, first card aligned with the content) and scrolls sideways only (`overflow-y:hidden`), with extra padding above and below so hover content is not clipped.

## Admin panel workflow (`admin.html`)
Styled like the site (top bar, logo, Faculty Glyphic, pills, dark export panel). "Add project" steps: 01 Images (card image 2:3, cover image landscape for the project page hero), 02 Details (title = page headline, category, description = body text; first paragraph visible, rest behind Read more), 03 Project page images (rows: single landscape or two images, reorderable). Images are compressed in the browser (card 1200px, others 1600px) and stored in localStorage; backup download/import as JSON. Export = for each project an `<a class="card" href="#/work/<slug>" style="--img:...">` plus a `<template class="pj-gallery-data" data-for="<slug>">` holding `.pj-cover-data` (--hero), `.pj-desc-data` and `.pj-row` elements; paste both into `.cards`. The router reads these; a description from the admin overrides the built-in PROJECTS text. The three existing projects are built into admin.html (SITE_PROJECTS, added on first load) with images referenced as `site:c1`/`site:h1`/`site:d1` etc.: shown as solid colours in the admin and exported as classes, so the photos already embedded in index.html keep being used until replaced. An export represents ALL projects: paste it to replace the whole contents of `.cards`.

## Platform constraints learned (claude.ai Artifacts)
- The site was published as an Artifact (private link owned by the original account). Another account cannot edit that artifact; it must publish its own copy from `index.html`.
- Published pages: no external images/scripts except cdnjs, jsdelivr, tailwind cdn, jquery, Google Fonts. Everything else must be inlined (that is why font/images/logo are base64).
- The Artifact `db`/`assets` capabilities make a page organization-internal (not publicly shareable), so they were deliberately NOT used on the portfolio. A live CMS was therefore not possible; the admin panel exports HTML instead.
- Publishing: write file to `/mnt/user-data/outputs/`, call the Artifact tool (`publish`); pass `url` of the earlier publish to update rather than create a new artifact.
- The owner sometimes sends edit requests as artifact comments ("Artifact comment sent to Claude"). No comment-reply tool was available, so replies were given in the chat.

## Placeholders / open items
- Hero headline, services copy (Brand Identity, Retail & Environments, Systems & Wayfinding, Digital Design), about blurb and CTA text are placeholder copy written by Claude - confirm with owner.
- All links are `#` (Contact, Résumé, Instagram, LinkedIn, "Drop me a line"). Need real URLs / mailto.
- Hamburger menu button does nothing yet (no menu overlay built).
- No project detail pages exist; cards are not clickable.
- The yellow CTA colour (#f5ec3d) is an approximation of Fiasco's yellow; owner has not confirmed it.
- Footer wordmark reuses the owner's logo SVG scaled up, standing in for Fiasco's giant wordmark.
- Mobile behaviour of the sticky stack (100vh panels) has not been tested on real devices.

## Owner working style
Gives short, precise pixel-level instructions ("26px", "16px rounded", "make logo 28px"), often as
artifact comments anchored to an element. Wants results identical to the reference sites, not
loose interpretations. Prefers proceeding with sensible defaults over lots of questions.
Uses the Claude desktop app; this chat cannot write to their local disk, so deliverables are
handed over as downloadable files/zips.

## Starter prompt for the new account
"I'm continuing a portfolio website project. Read HANDOFF.md in the attached folder, then open
index.html (do not print the base64 sections). Confirm you understand the structure and open
items, then wait for my next change."

## Project page details the owner set (2026-09-30)
- No menu (burger) button anywhere.
- Title (`.pj-headline`) and the "Next project" title share one size: clamp(28px,3.4vw,44px). 60px gap under the title. The title sits on its own grid row, so the right column starts level with the description.
- Description: first 3 paragraphs visible; "Read more" (plain gray text, same size as the description, no arrow) only if there are more.
- Right column: labelled outlined pills, "Industry" (project.json `category`) and "Discipline" (`tags`), in the body font. The Services list was removed (`services` stays in project.json but is not shown).
- "Next project": 24px gap under the label; its arrow is hidden and slides in only on hover.
