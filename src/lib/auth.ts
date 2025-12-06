import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { prisma } from './prisma'
import { authenticateLDAP, syncLDAPUserToDatabase } from './ldap'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
const COOKIE_NAME = 'fintech-auth-token'

export interface AuthUser {
  id: number
  username: string
  name: string
  role: 'ADMIN'
  isActive: boolean
}

export interface TokenPayload {
  userId: number
  username: string
  role: 'ADMIN'
}

export interface CreateUserData {
  username: string
  name: string
  password: string
  role?: 'ADMIN'
}

export interface UpdateUserData {
  id: number
  username?: string
  name?: string
  password?: string
  role?: 'ADMIN'
  isActive?: boolean
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Verify JWT token (Node.js runtime)
export function verifyToken(token: string): TokenPayload | null {
  try {
    console.log('Verifying token with secret length:', JWT_SECRET.length)
    console.log('Token to verify:', token.substring(0, 50) + '...')
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload
    console.log('Token verification successful:', payload)
    return payload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

// Edge-compatible JWT verification for middleware
export function verifyTokenEdge(token: string): TokenPayload | null {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development'

    if (!token || typeof token !== 'string') {
      if (isDevelopment) console.log('🔐 Edge verification - Invalid token format')
      return null
    }

    // Simple JWT parsing without crypto verification for Edge runtime
    const parts = token.split('.')
    if (parts.length !== 3) {
      if (isDevelopment) console.log('🔐 Edge verification - Invalid JWT structure')
      return null
    }

    // Decode payload (base64url)
    let payload: any
    try {
      const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
      const paddedPayload = base64Payload + '='.repeat((4 - base64Payload.length % 4) % 4)
      payload = JSON.parse(Buffer.from(paddedPayload, 'base64').toString())
    } catch (decodeError) {
      if (isDevelopment) console.log('🔐 Edge verification - Failed to decode payload:', decodeError)
      return null
    }

    // Validate required fields
    if (!payload.userId || !payload.username || !payload.role) {
      if (isDevelopment) console.log('🔐 Edge verification - Missing required payload fields')
      return null
    }

    // Check expiration
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000)
      if (now >= payload.exp) {
        if (isDevelopment) console.log('🔐 Edge verification - Token expired')
        return null
      }
    } else {
      if (isDevelopment) console.log('🔐 Edge verification - No expiration field found')
      return null
    }

    // Check issued at time (not too old)
    if (payload.iat) {
      const now = Math.floor(Date.now() / 1000)
      const maxAge = 7 * 24 * 60 * 60 // 7 days in seconds
      if (now - payload.iat > maxAge) {
        if (isDevelopment) console.log('🔐 Edge verification - Token too old')
        return null
      }
    }

    if (isDevelopment) {
      console.log('🔐 Edge verification - Token valid for user:', payload.username)
    }

    return {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    } as TokenPayload
  } catch (error) {
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (isDevelopment) {
      console.error('🔐 Edge verification - Unexpected error:', error)
    }
    return null
  }
}

// Get current user from cookies
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) {
      return null
    }

    const payload = verifyToken(token)
    if (!payload) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        isActive: true,
      },
    })

    if (!user || !user.isActive) {
      return null
    }

    return user as AuthUser
  } catch {
    return null
  }
}

// Set auth cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  })
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

// Authenticate user - supports both local and LDAP authentication
export async function authenticateUser(username: string, password: string): Promise<AuthUser | null> {
  try {
    const authMode = (process.env.AUTH_MODE || 'local').toLowerCase()
    
    if (authMode === 'ldap') {
      return await authenticateUserLDAP(username, password)
    } else {
      return await authenticateUserLocal(username, password)
    }
  } catch (e) {
    console.error('Error in authenticateUser:', e)
    return null
  }
}

// Local authentication with password hash
async function authenticateUserLocal(username: string, password: string): Promise<AuthUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    })
    console.log('Local auth - User found:', user?.username)

    if (!user || !user.isActive) {
      console.log('Local auth - User not found or inactive')
      return null
    }

    const isValidPassword = await verifyPassword(password, user.password)
    console.log('Local auth - Password valid:', isValidPassword)
    if (!isValidPassword) {
      return null
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role as 'ADMIN',
      isActive: user.isActive,
    }
  } catch (e) {
    console.error('Error in local authentication:', e)
    return null
  }
}

// LDAP authentication
async function authenticateUserLDAP(username: string, password: string): Promise<AuthUser | null> {
  try {
    console.log('LDAP auth - Attempting authentication for:', username)
    
    // Authenticate against LDAP
    const ldapResult = await authenticateLDAP(username, password)
    
    if (!ldapResult.success || !ldapResult.user) {
      console.log('LDAP auth - Authentication failed:', ldapResult.message)
      return null
    }

    console.log('LDAP auth - Authentication successful for:', ldapResult.user.username)

    // Sync user to database
    const user = await syncLDAPUserToDatabase(ldapResult.user, prisma)

    if (!user || !user.isActive) {
      console.log('LDAP auth - User not active in database')
      return null
    }

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role as 'ADMIN',
      isActive: user.isActive,
    }
  } catch (e) {
    console.error('Error in LDAP authentication:', e)
    return null
  }
}

// Create initial admin user if none exists
export async function createInitialAdmin() {
  try {
    const existingAdmin = await prisma.user.findFirst()
    
    if (!existingAdmin) {
      const hashedPassword = await hashPassword('admin123')
      
      await prisma.user.create({
        data: {
          username: 'admin',
          name: 'System Administrator',
          password: hashedPassword,
          role: 'ADMIN',
          isActive: true,
        },
      })
      
      console.log('Initial admin user created: admin / admin123')
    }
  } catch (error) {
    console.error('Error creating initial admin:', error)
  }
}
