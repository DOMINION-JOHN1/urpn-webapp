import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'urpn_session';

/**
 * Preserve the page a worker was trying to reach before creating an account
 * or signing in.
 * The cookie is only checked for presence here; the portal layout still
 * verifies its signature and expiry server-side.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === '/portal/login') return NextResponse.next();
  if (!pathname.startsWith('/portal')) return NextResponse.next();
  if (request.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const isWorkforceCoursePath = pathname.startsWith('/portal/courses/workforce-training');
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = isWorkforceCoursePath ? '/workforce/register' : '/portal/login';
  loginUrl.search = '';
  loginUrl.searchParams.set('next', `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/portal', '/portal/:path*'],
};
