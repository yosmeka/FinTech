import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { authenticateUserLocal, generateToken } from '@/lib/auth'
import { authentication } from '@/lib/ldap'

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }
      let ldapUsername: string
      if (username.includes('@')) {
        const usernamePart = username.split('@')[0]
        ldapUsername = `Zemenbank\\${usernamePart}`
      } else {
        ldapUsername = `Zemenbank\\${username}`
      }

    const authenticated = await authentication(ldapUsername, password)
    if(!authenticated)
    {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    const user= await authenticateUserLocal(username)
    if (!user) {
      return NextResponse.json(
        { error: 'User Not Registered in this system' },
        { status: 401 }
      )
    }
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    })

    const response = NextResponse.json({
  token, // <-- add this line
  user: {
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
  },
  message: 'Login successful',
})


    // Set cookie using response headers (more reliable)
    const isProduction = process.env.NODE_ENV === 'production'
    const cookieValue = `fintech-auth-token=${token}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${isProduction ? '; Secure; HttpOnly' : ''}`

    response.headers.set('Set-Cookie', cookieValue)

    console.log('Login successful, cookie set for user:', user.username)
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

