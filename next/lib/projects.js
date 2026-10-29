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
