import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // If request comes from omnipost-admin.vercel.app and user is at root '/', rewrite directly to /admin
  if (host.includes('omnipost-admin.vercel.app') && pathname === '/') {
    return NextResponse.rewrite(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'],
};
