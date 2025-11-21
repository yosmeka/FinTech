import { NextRequest, NextResponse } from 'next/server'

// Define public routes
const publicRoutes = [
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/setup',
]

// Simple JWT verification for Edge runtime
function verifyTokenEdge(token: string): any {
  try {
    if (!token || typeof token !== 'string') {
      return null
    }

    // Simple JWT parsing without crypto verification for Edge runtime
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    // Decode payload (base64url)
    let payload: any
    try {
      const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
      const paddedPayload = base64Payload + '='.repeat((4 - base64Payload.length % 4) % 4)
      payload = JSON.parse(Buffer.from(paddedPayload, 'base64').toString())
    } catch (decodeError) {
      return null
    }

    // Validate required fields
    if (!payload.userId || !payload.username || !payload.role) {
      return null
    }

    // Check expiration
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000)
      if (now >= payload.exp) {
        return null
      }
    }

    return payload
  } catch (error) {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isApiRoute = pathname.startsWith('/api')
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  const isDev = process.env.NODE_ENV === 'development'

  // Debug logging for development
  if (isDev) {
    console.log('🔒 Middleware - Processing:', pathname)
  }

  // Skip public routes
  if (isPublicRoute) {
    if (isDev) {
      console.log('✅ Middleware - Public route, allowing access')
    }
    return NextResponse.next()
  }

  // Get token from cookie
  const token = request.cookies.get('fintech-auth-token')?.value

  if (isDev) {
    console.log('🍪 Middleware - Token exists:', !!token)
    console.log('🔑 Middleware - Token preview:', token ? token.substring(0, 30) + '...' : 'none')
  }

  // Handle root path - redirect to dashboard if authenticated
  if (pathname === '/') {
    if (token) {
      const payload = verifyTokenEdge(token)
      if (payload) {
        if (isDev) {
          console.log('🔄 Middleware - Root path, token verified:', payload)
          console.log('🔄 Middleware - Root path, redirecting to dashboard')
        }
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else {
        if (isDev) {
          console.log('❌ Middleware - Invalid token on root path')
        }
      }
    }
    if (isDev) {
      console.log('🔄 Middleware - Root path, redirecting to login')
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 🔒 If it's an API route and no token, return JSON 401
  if (isApiRoute) {
    if (!token) {
      if (isDev) {
        console.log('❌ Middleware - API route without token')
      }
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: No token provided' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const payload = verifyTokenEdge(token)
    if (payload) {
      if (isDev) {
        console.log('✅ Middleware - API route with valid token:', payload)
      }
      return NextResponse.next()
    } else {
      if (isDev) {
        console.log('❌ Middleware - API route with invalid token')
      }
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized: Invalid token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  // 🔁 For page routes, redirect to /login if token is missing or invalid
  if (!token) {
    if (isDev) {
      console.log('❌ Middleware - Page route without token, redirecting to login')
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const payload = verifyTokenEdge(token)
  if (payload) {
    if (isDev) {
      console.log('✅ Middleware - Page route with valid token, allowing access:', payload)
    }
    return NextResponse.next()
  } else {
    if (isDev) {
      console.log('❌ Middleware - Page route with invalid token, redirecting to login')
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
