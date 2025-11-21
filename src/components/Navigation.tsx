'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import Image from 'next/image'

import { Button } from './ui/Button'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Companies', href: '/companies' },
  { name: 'Products', href: '/products' },
  { name: 'Users', href: '/users' },
]

interface User {
  id: number
  username: string
  name: string
  role: string
}

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (mobileMenuOpen && !target.closest('nav')) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [mobileMenuOpen])

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
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Error signing out', { id: logoutToast })
    } finally {
      setLoading(false)
    }
  }

  return (
    <nav className="nav-modern bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-2">
                <Image
                  src="/zemen-logo.png"
                  alt="Zemen Bank Logo"
                  width={28}
                  height={28}
                  className="object-contain w-7 h-7 sm:w-8 sm:h-8"
                />
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-black">
                  Fintech
                </h1>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
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

          {/* Desktop User Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user && (
              <>
                <div className="hidden lg:block">
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          'md:hidden transition-all duration-300 ease-in-out',
          mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        )}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50 rounded-lg mt-2 border border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-red-100 text-red-600 border-l-4 border-red-600'
                    : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile User Info and Logout */}
            {user && (
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="px-3 py-2">
                  <div className="text-sm text-gray-700 font-medium mb-2">
                    Welcome, <span className="text-black font-semibold">{user.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    disabled={loading}
                    className="w-full btn-outline border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    {loading ? 'Signing out...' : 'Sign Out'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
