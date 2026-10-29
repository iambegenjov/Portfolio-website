// URLs for pages and files. The normal build (Vercel) uses plain root paths.
// The claude.ai preview is not served from the site root, so there every URL is relative:
// on the server it is marked __ROOT__ (scripts/preview.mjs rewrites it per page),
// in the browser it is worked out from the current page.
export const PREVIEW = !!process.env.NEXT_PUBLIC_PREVIEW;

function root() {
  if (!PREVIEW) return '';
  if (typeof window === 'undefined') return '__ROOT__';
  return /\/work\/[\w-]+\/(index\.html)?$/.test(window.location.pathname) ? '../..' : '.';
}

export function asset(path) {
  return root() + path;
}

export function pageHref(path) {
  if (!PREVIEW) return path;
  const [p, hash] = path.split('#');
  const file = p === '/' ? '/' : p + '/index.html';
  return root() + file + (hash ? '#' + hash : '');
}
