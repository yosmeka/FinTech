import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { authenticateUser, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await authenticateUser(email, password)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      message: 'Login successful',
    })

    // Set cookie using response headers (more reliable)
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieValue = `fintech-auth-token=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${isProduction ? '; Secure; HttpOnly' : ''}`

    response.headers.set('Set-Cookie', cookieValue)

    console.log('Login successful, cookie set for user:', user.email)
    console.log('Cookie value:', cookieValue)

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
