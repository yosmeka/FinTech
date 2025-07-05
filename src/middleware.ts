import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/companies',
  '/products',
  '/users',
  '/api/companies',
  '/api/products',
  '/api/users',
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/setup',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Enhanced logging for development
  if (isDevelopment) {
    console.log('🔒 Middleware - Processing path:', pathname)
  }

  // Check if the route is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    if (isDevelopment) {
      console.log('✅ Middleware - Public route, allowing access')
    }
    return NextResponse.next()
  }

  // Special handling for homepage (/) - redirect to login
  if (pathname === '/') {
    const token = request.cookies.get('fintech-auth-token')?.value
    if (token && token.length > 10) {
      if (isDevelopment) {
        console.log('🔄 Middleware - Token found, redirecting to dashboard')
      }
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (isDevelopment) {
      console.log('🔄 Middleware - No token, redirecting to login')
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  )

  if (!isProtectedRoute) {
    if (isDevelopment) {
      console.log('⚪ Middleware - Non-protected route, allowing access')
    }
    return NextResponse.next()
  }

  // Get the auth token from cookies
  const token = request.cookies.get('fintech-auth-token')?.value

  if (isDevelopment) {
    console.log('🔍 Middleware - Protected route detected')
    console.log('🍪 Middleware - Token exists:', !!token)
    console.log('🔑 Middleware - Token preview:', token ? token.substring(0, 30) + '...' : 'none')
  }

  if (!token) {
    if (isDevelopment) {
      console.log('❌ Middleware - No token found, redirecting to login')
    }
    // Redirect to login if no token
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Simple token validation (full verification happens in API routes)
  if (token.length < 10) {
    if (isDevelopment) {
      console.log('❌ Middleware - Invalid token format, redirecting to login')
    }
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.set('fintech-auth-token', '', {
      expires: new Date(0),
      path: '/',
    })
    return response
  }

  if (isDevelopment) {
    console.log('✅ Middleware - Token found, allowing access')
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
