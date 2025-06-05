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
    <nav className="nav-modern bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <h1 className="text-xl font-bold text-black">
                  Fintech 
                </h1>
              </div>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'nav-link inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-all duration-200',
                    pathname === item.href
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-600 hover:border-red-600 hover:text-red-600'
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
                <div className="hidden md:block">
                  <span className="text-sm text-gray-700 font-medium">
                    Welcome, <span className="text-black font-semibold">{user.name}</span>
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={loading}
                  className="btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
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
