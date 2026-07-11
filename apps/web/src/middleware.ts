import { NextResponse, type NextRequest } from 'next/server';

const ACCESS_TOKEN_COOKIE = 'davas_access_token';
const protectedRoutes = ['/', '/explore', '/community', '/feed', '/diary', '/profile', '/watchlist', '/friends'];
const guestOnlyRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccessToken = Boolean(request.cookies.get(ACCESS_TOKEN_COOKIE)?.value);
  const isProtectedRoute = pathname === '/' || protectedRoutes.some((route) => route !== '/' && pathname.startsWith(route));

  if (isProtectedRoute && !hasAccessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (guestOnlyRoutes.includes(pathname) && hasAccessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/explore/:path*', '/community/:path*', '/feed/:path*', '/diary/:path*', '/profile/:path*', '/watchlist/:path*', '/friends/:path*', '/login', '/signup'],
};
