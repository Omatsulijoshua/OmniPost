import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase();
  const forwardedHost = (request.headers.get('x-forwarded-host') || '').toLowerCase();
  const hostname = request.nextUrl.hostname.toLowerCase();
  const pathname = request.nextUrl.pathname;

  const isAdminHost =
    host.includes('admin-gamma-ten-89') ||
    forwardedHost.includes('admin-gamma-ten-89') ||
    hostname.includes('admin-gamma-ten-89');

  // If request comes from admin domain and is at root '/', redirect directly to /admin
  if (isAdminHost && pathname === '/') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
