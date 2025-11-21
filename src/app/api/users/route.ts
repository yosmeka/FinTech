import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser, hashPassword } from '@/lib/auth'
import { CreateUserData } from '@/lib/auth'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body: CreateUserData = await request.json()
    
    // Validate required fields
    if (!body.username || !body.name || !body.password) {
      return NextResponse.json(
        { error: 'Username, name, and password are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: body.username.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this username already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(body.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        username: body.username.toLowerCase(),
        name: body.name,
        password: hashedPassword,
        role: body.role || 'ADMIN',
        createdBy: currentUser.id,
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
