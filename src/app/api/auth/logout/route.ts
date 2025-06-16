import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development'

    if (isDevelopment) {
      console.log('🚪 Logout - Processing logout request')
    }

    // Clear cookie using multiple methods for reliability
    const response = NextResponse.json({
      message: 'Logout successful',
    })

    // Method 1: Using response headers (most reliable)
    response.headers.set('Set-Cookie',
      'fintech-auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'
    )

    // Method 2: Using cookies API
    try {
      const cookieStore = await cookies()
      cookieStore.delete('fintech-auth-token')
    } catch (cookieError) {
      if (isDevelopment) {
        console.log('🚪 Logout - Cookie API deletion failed:', cookieError)
      }
    }

    if (isDevelopment) {
      console.log('🚪 Logout - Successfully cleared authentication')
    }

    return response
  } catch (error) {
    console.error('🚪 Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
