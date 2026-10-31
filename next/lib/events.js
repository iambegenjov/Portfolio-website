import fs from 'node:fs';
import path from 'node:path';
import { asset } from './paths';

// Every event lives in public/events/<slug>/ (event.json + photos).
// public/events/index.json lists the slugs in the order they appear on the home page.
const DIR = path.join(process.cwd(), 'public', 'events');

export function getEvents() {
  let index;
  try {
    index = JSON.parse(fs.readFileSync(path.join(DIR, 'index.json'), 'utf8'));
  } catch {
    return [];
  }
  return (index.events || [])
    .map((slug) => {
      try {
        const e = JSON.parse(fs.readFileSync(path.join(DIR, slug, 'event.json'), 'utf8'));
        return {
          slug,
          title: e.title || '',
          story: e.story || '',
          // Optional event logo above the title: an SVG takes the text colour (light/dark flip), other images keep theirs
          logo: e.logo ? { src: asset(`/events/${slug}/${encodeURI(e.logo)}`), ratio: Number(e.logoRatio) || 2, mono: /\.svg$/i.test(e.logo) } : null,
          photos: (e.photos || [])
            .filter((p) => p.file)
            .map((p) => ({ src: asset(`/events/${slug}/${encodeURI(p.file)}`), ratio: Number(p.ratio) || 1.333, alt: p.alt || '' })),
        };
      } catch (err) {
        console.warn('Skipping event', slug, err.message);
        return null;
      }
    })
    .filter((e) => e && e.photos.length);
}
