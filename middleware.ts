import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add routes that require authentication
const protectedRoutes = ['/dashboard', '/patients', '/appointments', '/staff']

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login', '/forgot-password', '/reset-password']

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAuthRoute = authRoutes.some(route => path.startsWith(route))

  // Check for authentication token
  const authToken = request.cookies.get('auth-token')
  const userData = request.cookies.get('user-data')

  // Check if user is authenticated (has both token and user data)
  const isAuthenticated = authToken && userData

  // If trying to access protected routes without authentication
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If trying to access auth routes while already authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Special handling for login verification
  if (path === '/login/verify') {
    // Allow access to verification page even without auth token
    // The verification page will handle its own logic
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 