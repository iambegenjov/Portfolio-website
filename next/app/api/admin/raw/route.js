import { NextResponse } from 'next/server';
import { SITE_DIR, github, isLoggedIn } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// An image from the repository (at a given commit), so the admin can show photos that are not deployed yet
export async function GET(request) {
  if (!isLoggedIn(request)) return new NextResponse(null, { status: 401 });
  const url = new URL(request.url);
  const path = url.searchParams.get('path') || '';
  const ref = url.searchParams.get('ref') || '';
  if (!path || path.includes('..') || !/^[0-9a-f]{40}$/.test(ref)) return new NextResponse(null, { status: 400 });
  const res = await github(`/contents/${SITE_DIR}${path.split('/').map(encodeURIComponent).join('/')}?ref=${ref}`, {
    headers: { Accept: 'application/vnd.github.raw' },
  });
  if (!res.ok) return new NextResponse(null, { status: res.status });
  return new NextResponse(res.body, {
    headers: { 'Content-Type': res.headers.get('Content-Type') || 'application/octet-stream', 'Cache-Control': 'private, max-age=3600' },
  });
}
