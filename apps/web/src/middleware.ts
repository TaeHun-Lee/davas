import { type NextRequest, NextResponse } from 'next/server';
import { safeCoreReturnTo } from './lib/core-routes';

const ACCESS_TOKEN_COOKIE = 'davas_access_token';

function legacyDestination(pathname: string) {
  if (pathname.startsWith('/profile')) return '/settings';
  if (pathname.startsWith('/community/authors')) return '/';
  if (pathname === '/watchlist') return '/me';
  if (pathname === '/explore') return '/records/new';
  if (pathname.startsWith('/diary/')) return pathname.replace(/^\/diary/, '/records');
  return null;
}

function isProtectedCorePath(pathname: string) {
  return (
    pathname === '/' ||
    pathname === '/me' ||
    pathname === '/search' ||
    pathname === '/settings' ||
    pathname === '/friends' ||
    pathname.startsWith('/records/')
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const legacy = legacyDestination(pathname);
  if (legacy) return NextResponse.redirect(new URL(legacy, request.url));

  const publicInvite = pathname.startsWith('/friends/invite/');
  if (
    isProtectedCorePath(pathname) &&
    !publicInvite &&
    !request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  ) {
    const login = new URL('/login', request.url);
    login.searchParams.set('returnTo', safeCoreReturnTo(`${pathname}${search}`, '/'));
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/me',
    '/search',
    '/settings',
    '/friends/:path*',
    '/records/:path*',
    '/login',
    '/signup',
    '/profile/:path*',
    '/community/authors/:path*',
    '/watchlist',
    '/explore',
    '/diary/:path*',
  ],
};
