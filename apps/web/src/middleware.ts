import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase();
  const forwardedHost = (request.headers.get('x-forwarded-host') || '').toLowerCase();
  const hostname = request.nextUrl.hostname.toLowerCase();
  const pathname = request.nextUrl.pathname;

  const isAdminHost =
    host.includes('omnipost-admin') ||
    forwardedHost.includes('omnipost-admin') ||
    hostname.includes('omnipost-admin');

  // If request comes from omnipost-admin.vercel.app and is at root '/', redirect directly to /admin login page
  if (isAdminHost && pathname === '/') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
