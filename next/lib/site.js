import fs from 'node:fs';
import path from 'node:path';

// Contact links and CTA text, edited in the admin panel (public/site.json)
const DEFAULTS = {
  email: '',
  resume: '',
  instagram: '',
  linkedin: '',
  ctaHeading: "Let's move forward with your next project",
  ctaButton: 'Drop me a line ↘',
};

export function getSite() {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'site.json'), 'utf8'));
    const site = { ...DEFAULTS };
    for (const k of Object.keys(DEFAULTS)) if (typeof data[k] === 'string' && data[k].trim()) site[k] = data[k].trim();
    return site;
  } catch {
    return DEFAULTS;
  }
}
