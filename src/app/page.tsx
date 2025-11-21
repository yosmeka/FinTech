'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const loadingToast = toast.loading('Signing in...')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Login failed', { id: loadingToast })
        setErrors({ submit: data.error || 'Login failed' })
        return
      }

      toast.success('Login successful! Redirecting...', { id: loadingToast })

      // Multiple redirect approaches for reliability
      setTimeout(() => {
        // Method 1: Router push
        router.push('/dashboard')
        router.refresh()

        // Method 2: Force page reload as fallback
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      }, 1500)

    } catch (error) {
      console.error('Login error:', error)
      toast.error('Network error. Please try again.', { id: loadingToast })
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left side content - hidden on mobile */}
      <div className="hidden md:flex md:flex-1 p-8 flex-col items-start justify-center h-full md:ml-8 lg:ml-16 relative z-10">
        <div className="max-w-lg">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 p-2">
            <Image
              src="/zemen-logo.png"
              alt="Zemen Bank Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-black mb-4">
            Fintech Management
          </h1>
          <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-6">
            Professional Dashboard System
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Streamline your fintech operations with our comprehensive management platform.
            Track companies, manage products, and oversee user accounts with enterprise-grade security.
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span className="text-gray-700 font-medium">Secure Authentication</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span className="text-gray-700 font-medium">Real-time Analytics</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
              <span className="text-gray-700 font-medium">Comprehensive Reporting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Login form */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 mx-4 md:mx-0 md:mr-8 lg:mr-16 md:self-center md:flex-none">
        {/* Logo and Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 p-2 border border-red-100">
            <Image
              src="/zemen-logo.png"
              alt="Zemen Bank Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <h3 className="text-2xl font-bold text-black mb-2">Welcome Back</h3>
          <p className="text-center text-sm font-medium text-gray-600">
            Sign in to your admin account
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-semibold text-gray-700">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                autoComplete="username"
                placeholder="admin"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
                required
              />
            </div>
            {errors.username && (
              <p className="text-sm text-red-600 font-medium">{errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-gray-900 placeholder-gray-500"
                required
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 font-medium">{errors.password}</p>
            )}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600 font-medium">{errors.submit}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Secure admin access • Zemen Bank Fintech Platform
          </p>
        </div>
      </div>
    </div>
  )
}
