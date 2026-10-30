import fs from 'node:fs';
import path from 'node:path';

// Contact links and CTA text, edited in the admin panel (public/site.json)
const DEFAULT_LINKS = ['Contact', 'Résumé', 'Instagram', 'LinkedIn'].map((label) => ({ label, url: '' }));

// A link address may be a web address, an email address or a tel: number
function toHref(url) {
  const u = String(url || '').trim();
  if (!u) return null;
  if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u)) return `mailto:${u}`;
  if (/^\+?[\d\s()-]{6,}$/.test(u)) return `tel:${u.replace(/[^\d+]/g, '')}`;
  return `https://${u}`;
}

export function getSite() {
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'site.json'), 'utf8'));
  } catch {}
  const text = (v, fallback) => (typeof v === 'string' && v.trim() ? v.trim() : fallback);
  // Older files had fixed fields instead of a list
  const raw = Array.isArray(data.links)
    ? data.links
    : data.email || data.resume || data.instagram || data.linkedin
      ? [
          { label: 'Contact', url: data.email },
          { label: 'Résumé', url: data.resume },
          { label: 'Instagram', url: data.instagram },
          { label: 'LinkedIn', url: data.linkedin },
        ]
      : DEFAULT_LINKS;
  const links = raw
    .filter((l) => l && text(l.label, ''))
    .map((l) => {
      const href = toHref(l.url);
      return { label: l.label.trim(), href, external: !!href && /^https?:/i.test(href) };
    });
  return {
    email: text(data.email, ''),
    links,
    ctaHeading: text(data.ctaHeading, "Let's move forward with your next project"),
    ctaButton: text(data.ctaButton, 'Drop me a line ↘'),
  };
}
