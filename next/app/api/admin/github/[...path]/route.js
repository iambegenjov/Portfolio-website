import { NextResponse } from 'next/server';
import { BRANCH, SITE_DIR, github, isLoggedIn } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// The admin's GitHub calls, sent on with the server's token. Only what the admin needs is allowed:
// reading the site's data, and making one commit on the site branch that changes files under next/public/.
function allowed(method, path, body) {
  if (method === 'GET') {
    return path.startsWith(`contents/${SITE_DIR}`) || path === `git/ref/heads/${BRANCH}` || /^git\/commits\/[0-9a-f]{40}$/.test(path);
  }
  if (method === 'POST') {
    if (path === 'git/blobs' || path === 'git/commits') return true;
    if (path === 'git/trees') return Array.isArray(body?.tree) && body.tree.every((t) => typeof t.path === 'string' && t.path.startsWith(SITE_DIR) && !t.path.includes('..'));
  }
  if (method === 'PATCH') return path === `git/refs/heads/${BRANCH}` && body && !body.force;
  return false;
}

async function proxy(request, { params }) {
  if (!isLoggedIn(request)) return NextResponse.json({ message: 'Please log in again.' }, { status: 401 });
  const path = (await params).path.join('/');
  const method = request.method;
  const body = method === 'GET' ? undefined : await request.json().catch(() => null);
  if (!allowed(method, path, body)) return NextResponse.json({ message: 'This action is not allowed from the admin.' }, { status: 403 });
  const query = new URL(request.url).search;
  const res = await github(`/${path}${query}`, { method, body: body ? JSON.stringify(body) : undefined });
  // A 401 from GitHub means the server's token is wrong, not that the admin is logged out
  if (res.status === 401) return NextResponse.json({ message: 'GitHub refused the GITHUB_TOKEN set on Vercel. Check it is valid.' }, { status: 502 });
  return new NextResponse(res.status === 204 ? null : await res.text(), {
    status: res.status,
    headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/json' },
  });
}

export { proxy as GET, proxy as POST, proxy as PATCH };
