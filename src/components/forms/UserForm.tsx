'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface User {
  id: number
  email: string
  name: string
  role: 'ADMIN'
  isActive: boolean
  createdAt: string
  updatedAt: string
  creator?: {
    id: number
    name: string
    email: string
  }
}

interface UserFormProps {
  user?: User
  mode: 'create' | 'edit'
}

export function UserForm({ user, mode }: UserFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    password: '',
    confirmPassword: '',
    role: user?.role || 'ADMIN' as const,
    isActive: user?.isActive ?? true,
  })

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Password is required'
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors below')
      return
    }

    setLoading(true)
    const saveToast = toast.loading(mode === 'create' ? 'Creating user...' : 'Updating user...')
    
    try {
      const url = mode === 'create' 
        ? '/api/users' 
        : `/api/users/${user!.id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      const submitData: any = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
        isActive: formData.isActive,
      }

      // Only include password if it's provided
      if (formData.password) {
        submitData.password = formData.password
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save user')
      }

      const result = await response.json()
      
      toast.success(mode === 'create' ? 'User created successfully!' : 'User updated successfully!', { id: saveToast })
      
      // Redirect to users list
      router.push('/users')
      router.refresh()
    } catch (error) {
      console.error('Error saving user:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save user', { id: saveToast })
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to save user. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {mode === 'create' ? 'Create New Admin User' : 'Edit Admin User'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
              placeholder="Enter full name"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={errors.email}
              placeholder="admin@fintech.com"
              required
            />

            <Input
              label={mode === 'create' ? 'Password' : 'New Password (leave blank to keep current)'}
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={errors.password}
              placeholder={mode === 'create' ? 'Enter password' : 'Enter new password'}
              required={mode === 'create'}
            />

            {formData.password && (
              <Input
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                placeholder="Confirm password"
                required
              />
            )}

            <Select
              label="Role"
              value={formData.role}
              onChange={(value) => handleChange('role', value)}
              options={[
                { value: 'ADMIN', label: 'Admin' },
              ]}
              required
            />

            {mode === 'edit' && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active User
                </label>
              </div>
            )}

            {errors.submit && (
              <div className="text-red-600 text-sm">
                {errors.submit}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Saving...' : mode === 'create' ? 'Create User' : 'Update User'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/users')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
