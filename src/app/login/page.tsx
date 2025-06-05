'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    email: '',
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
        router.push('/')
        router.refresh()

        // Method 2: Force page reload as fallback
        setTimeout(() => {
          window.location.href = '/'
        }, 2000)
      }, 1500)
      
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Network error. Please try again.', { id: loadingToast })
      setErrors({ submit: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <h1 className="text-3xl font-bold text-black">Fintech Manager</h1>
          <p className="mt-2 text-gray-600 font-medium">Sign in to your admin account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                placeholder="admin@fintech.com"
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />

              {errors.submit && (
                <div className="text-red-600 text-sm text-center">
                  {errors.submit}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="text-sm bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="font-semibold text-black mb-2">Default Admin Credentials:</p>
                <p className="text-gray-700"><span className="font-medium">Email:</span> admin@fintech.com</p>
                <p className="text-gray-700"><span className="font-medium">Password:</span> admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
