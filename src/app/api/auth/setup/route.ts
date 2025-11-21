import { NextResponse } from 'next/server'
import { createInitialAdmin } from '@/lib/auth'

export async function POST() {
  try {
    await createInitialAdmin()
    
    return NextResponse.json({
      message: 'Initial admin user setup completed',
      credentials: {
        username: 'admin',
        password: 'admin123'
      }
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup initial admin' },
      { status: 500 }
    )
  }
}
