import crypto from 'node:crypto';

// Admin login. Set these in Vercel › Project › Settings › Environment Variables:
//   ADMIN_PASSWORD  the password typed into /admin
//   GITHUB_TOKEN    fine-grained token for the repository, Contents: Read and write
//   GITHUB_REPO     optional, defaults to iambegenjov/Portfolio-website
//   GITHUB_BRANCH   optional, defaults to main
// The token never reaches the browser: the admin calls GitHub through /api/admin/github.

export const COOKIE = 'admin_session';
const MAX_AGE = 60 * 60 * 12; // seconds a login lasts

export const REPO = process.env.GITHUB_REPO || 'iambegenjov/Portfolio-website';
export const BRANCH = process.env.GITHUB_BRANCH || 'main';
export const SITE_DIR = 'next/public/'; // the admin may only write here

function secret() {
  const { ADMIN_PASSWORD: p, GITHUB_TOKEN: t } = process.env;
  if (!p || !t) return null;
  // Changing the password or the token signs everyone out
  return crypto.createHash('sha256').update(`${p}\n${t}`).digest();
}

export function isConfigured() {
  return !!secret();
}

function sign(text) {
  return crypto.createHmac('sha256', secret()).update(text).digest('base64url');
}

function same(a, b) {
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

export function checkPassword(input) {
  const password = process.env.ADMIN_PASSWORD;
  return !!password && same(input || '', password);
}

export function newSession() {
  const expires = String(Date.now() + MAX_AGE * 1000);
  return `${expires}.${sign(expires)}`;
}

export function isLoggedIn(request) {
  if (!isConfigured()) return false;
  const value = request.cookies.get(COOKIE)?.value || '';
  const [expires, sig] = value.split('.');
  return !!expires && !!sig && Number(expires) > Date.now() && same(sig, sign(expires));
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: MAX_AGE,
};

export function github(path, init = {}) {
  return fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
}
