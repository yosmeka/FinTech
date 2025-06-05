'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { Button } from './ui/Button'

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Companies', href: '/companies' },
  { name: 'Products', href: '/products' },
  { name: 'Users', href: '/users' },
]

interface User {
  id: number
  email: string
  name: string
  role: string
}

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    const logoutToast = toast.loading('Signing out...')

    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      toast.success('Signed out successfully', { id: logoutToast })
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Error signing out', { id: logoutToast })
    } finally {
      setLoading(false)
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Fintech Manager
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                    pathname === item.href
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm text-gray-700">
                  Welcome, {user.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  {loading ? 'Signing out...' : 'Sign Out'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
