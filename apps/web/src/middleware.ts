import { ACCESS_TOKEN_COOKIE } from '@davas/shared';
import { NextResponse, type NextRequest } from 'next/server';
import { safeCoreReturnTo } from './lib/core-routes';
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const legacy = pathname.startsWith('/profile')
    ? '/settings'
    : pathname.startsWith('/community/authors')
      ? '/'
      : pathname === '/watchlist'
        ? '/me'
        : pathname.startsWith('/diary/')
          ? pathname.replace(/^\/diary/, '/records')
          : null;
  if (legacy) {
    // Old links keep their query: /diary/new?mediaId=… opens the composer on that title.
    const target = new URL(legacy, request.url);
    target.search = search;
    return NextResponse.redirect(target);
  }
  const publicInvite = pathname.startsWith('/friends/invite/');
  const protectedPath =
    pathname === '/' ||
    pathname === '/me' ||
    pathname === '/explore' ||
    pathname === '/search' ||
    pathname === '/settings' ||
    pathname === '/friends' ||
    pathname === '/spaces' ||
    pathname === '/spaces/wishes' ||
    pathname === '/spaces/memories' ||
    pathname === '/notifications' ||
    pathname.startsWith('/records/');
  if (protectedPath && !publicInvite && !request.cookies.get(ACCESS_TOKEN_COOKIE)?.value) {
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
    '/spaces',
    '/spaces/wishes',
    '/spaces/memories',
    '/notifications',
    '/login',
    '/signup',
    '/profile/:path*',
    '/community/authors/:path*',
    '/watchlist',
    '/explore',
    '/diary/:path*',
  ],
};
