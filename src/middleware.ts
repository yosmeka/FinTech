import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge } from './lib/auth'

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

  // Special handling for homepage (/) - redirect authenticated users to dashboard
  if (pathname === '/') {
    const token = request.cookies.get('fintech-auth-token')?.value
    if (token) {
      const payload = verifyTokenEdge(token)
      if (payload) {
        if (isDevelopment) {
          console.log('🔄 Middleware - Authenticated user on login page, redirecting to dashboard')
        }
        const dashboardUrl = new URL('/dashboard', request.url)
        return NextResponse.redirect(dashboardUrl)
      }
    }
    // If not authenticated, allow access to login page (homepage)
    if (isDevelopment) {
      console.log('✅ Middleware - Unauthenticated user on login page, allowing access')
    }
    return NextResponse.next()
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

  // Verify the token using edge-compatible method
  const payload = verifyTokenEdge(token)

  if (isDevelopment) {
    console.log('🔐 Middleware - Token verification result:', payload ? 'VALID' : 'INVALID')
    if (payload) {
      console.log('👤 Middleware - User:', payload.email, 'Role:', payload.role)
    }
  }

  if (!payload) {
    if (isDevelopment) {
      console.log('❌ Middleware - Invalid/expired token, redirecting to login')
    }
    // Redirect to login if token is invalid
    const loginUrl = new URL('/login', request.url)
    const response = NextResponse.redirect(loginUrl)
    // Clear the invalid token
    response.cookies.set('fintech-auth-token', '', {
      expires: new Date(0),
      path: '/',
    })
    return response
  }

  if (isDevelopment) {
    console.log('✅ Middleware - Authentication successful, proceeding')
  }

  // Add user info to headers for API routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-user-id', payload.userId.toString())
  requestHeaders.set('x-user-email', payload.email)
  requestHeaders.set('x-user-role', payload.role)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
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
