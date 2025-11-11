import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC = ['/login','/api/login','/api/logout','/api/public-env','/api/healthz','/api/print-proxy','/favicon.svg'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/_next') || pathname === '/favicon.ico' || pathname === '/favicon.svg') return NextResponse.next();
  if (PUBLIC.some(p => pathname.startsWith(p))) return NextResponse.next();
  const has = req.cookies.get('st_session')?.value;
  if (!has) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next).*)'] };
