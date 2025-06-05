import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyTokenEdge } from './lib/auth'

// Define protected routes
const protectedRoutes = [
  '/',
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
  
  // Check if the route is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Get the auth token from cookies
  const token = request.cookies.get('fintech-auth-token')?.value

  console.log('Middleware - Path:', pathname)
  console.log('Middleware - Token exists:', !!token)
  console.log('Middleware - Token value:', token ? token.substring(0, 20) + '...' : 'none')

  if (!token) {
    console.log('Middleware - No token, redirecting to login')
    // Redirect to login if no token
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Verify the token using edge-compatible method
  const payload = verifyTokenEdge(token)
  console.log('Middleware - Token payload:', payload ? 'valid' : 'invalid')

  if (!payload) {
    console.log('Middleware - Invalid token, redirecting to login')
    // Redirect to login if token is invalid
    const loginUrl = new URL('/login', request.url)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('fintech-auth-token')
    return response
  }

  console.log('Middleware - Authentication successful for user:', payload.email)

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
