'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function DebugAuthPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const clearAllAuth = async () => {
    setLoading(true)
    const loadingToast = toast.loading('Clearing authentication data...')

    try {
      // Clear cookies via API
      await fetch('/api/auth/logout', {
        method: 'POST',
      })

      // Clear any localStorage data
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }

      // Clear cookies client-side as well
      document.cookie = 'fintech-auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'

      toast.success('Authentication data cleared!', { id: loadingToast })
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login')
        router.refresh()
      }, 1000)

    } catch (error) {
      console.error('Error clearing auth:', error)
      toast.error('Failed to clear authentication data', { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      
      if (response.ok) {
        toast.success(`Authenticated as: ${data.user.username}`)
      } else {
        toast.error('Not authenticated')
      }
    } catch (error) {
      toast.error('Error checking authentication')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Authentication Debug
        </h1>
        
        <div className="space-y-4">
          <button
            onClick={checkAuthStatus}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Check Auth Status
          </button>
          
          <button
            onClick={clearAllAuth}
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Clearing...' : 'Clear All Auth Data'}
          </button>
          
          <div className="text-sm text-gray-600 mt-4">
            <p><strong>Current cookies:</strong></p>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {typeof window !== 'undefined' ? document.cookie || 'No cookies' : 'Loading...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
