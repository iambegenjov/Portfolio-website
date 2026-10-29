import { NextResponse } from 'next/server';
import { BRANCH, COOKIE, checkPassword, cookieOptions, isConfigured, isLoggedIn, newSession } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// GET: is the admin set up, and is this browser logged in?
export function GET(request) {
  return NextResponse.json({ configured: isConfigured(), loggedIn: isLoggedIn(request), branch: BRANCH });
}

// POST {password}: log in
export async function POST(request) {
  if (!isConfigured()) return NextResponse.json({ error: 'The admin password is not set up yet.' }, { status: 503 });
  const { password } = await request.json().catch(() => ({}));
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 800)); // slows down guessing
    return NextResponse.json({ error: 'That password is not right.' }, { status: 401 });
  }
  const res = NextResponse.json({ loggedIn: true, branch: BRANCH });
  res.cookies.set(COOKIE, newSession(), cookieOptions);
  return res;
}

// DELETE: log out
export function DELETE() {
  const res = NextResponse.json({ loggedIn: false });
  res.cookies.set(COOKIE, '', { ...cookieOptions, maxAge: 0 });
  return res;
}
