import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuth = !!req.auth

  // Protected routes
  const protectedRoutes = ['/projects', '/memory', '/settings', '/admin']
  const isProtected = protectedRoutes.some(r => pathname.startsWith(r))

  // API routes are handled by individual route handlers
  if (pathname.startsWith('/api')) return NextResponse.next()

  // Workspace is accessible in demo mode
  if (pathname.startsWith('/workspace')) return NextResponse.next()

  if (isProtected && !isAuth) {
    return NextResponse.redirect(new URL(`/login?next=${pathname}`, req.url))
  }

  // Redirect logged-in users from auth pages
  if (isAuth && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/workspace', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
