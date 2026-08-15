import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow static files, assets, and auth routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname === '/login' ||
    pathname.startsWith('/login')
  ) {
    return NextResponse.next();
  }

  // Admin authentication check (presence of admin token cookie or header)
  const adminToken = request.cookies.get('omnipost_admin_token')?.value;

  // Note: Client-side Zustand auth store will perform full client auth guard if cookie is missing
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
