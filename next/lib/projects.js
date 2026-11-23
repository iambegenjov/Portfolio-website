import fs from 'node:fs';
import path from 'node:path';
import { asset } from './paths';

// Every project lives in public/projects/<slug>/ (project.json + photos).
// public/projects/index.json lists the slugs in the order they appear in Works.
const DIR = path.join(process.cwd(), 'public', 'projects');

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function getProjects() {
  const index = readJSON(path.join(DIR, 'index.json'));
  return (index.projects || [])
    .map((slug) => {
      try {
        return { ...readJSON(path.join(DIR, slug, 'project.json')), slug };
      } catch (err) {
        console.warn('Skipping project', slug, err.message);
        return null;
      }
    })
    .filter(Boolean);
}

// Width ÷ height of a project photo, read from the file header (JPEG, PNG, GIF, WebP); null if unknown.
// Lets the page reserve each photo's height before it loads, so nothing jumps.
export function imageRatio(p, file) {
  try {
    const b = fs.readFileSync(path.join(DIR, p.slug, file));
    let w, h;
    if (b[0] === 0x89 && b[1] === 0x50) [w, h] = [b.readUInt32BE(16), b.readUInt32BE(20)]; // PNG
    else if (b.toString('ascii', 0, 3) === 'GIF') [w, h] = [b.readUInt16LE(6), b.readUInt16LE(8)];
    else if (b.toString('ascii', 8, 12) === 'WEBP') {
      const kind = b.toString('ascii', 12, 16);
      if (kind === 'VP8X') [w, h] = [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
      else if (kind === 'VP8L') { const n = b.readUInt32LE(21); [w, h] = [1 + (n & 0x3fff), 1 + ((n >> 14) & 0x3fff)]; }
      else [w, h] = [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    } else if (b[0] === 0xff && b[1] === 0xd8) {
      // JPEG: walk the segments to the frame header (SOF0–SOF15, not DHT/JPG/DAC)
      let i = 2;
      while (i < b.length) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1];
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) { [h, w] = [b.readUInt16BE(i + 5), b.readUInt16BE(i + 7)]; break; }
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
    return w && h ? Math.round((w / h) * 1000) / 1000 : null;
  } catch {
    return null;
  }
}

// Image paths in project.json are relative to the project's folder
export function projectImage(p, file) {
  return file ? asset(`/projects/${p.slug}/${encodeURI(file)}`) : '';
}

export function paragraphs(text) {
  return String(text || '')
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}
