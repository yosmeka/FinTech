'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { withBase } from '@/lib/path'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { FintechStatus, FINTECH_STATUS_LABELS, type FintechCompany } from '@/lib/types'

interface CompanyFormProps {
  company?: FintechCompany
  mode: 'create' | 'edit'
}

export function CompanyForm({ company, mode }: CompanyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: company?.name || '',
    address: company?.address || '',
    contactPersonPhoneNumber: company?.contactPersonPhoneNumber || '',
    contactAddress: company?.contactAddress || '',
    status: company?.status || 'NEW' as FintechStatus,
  })

  const statusOptions = Object.entries(FINTECH_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }))

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    if (!formData.contactPersonPhoneNumber.trim()) {
      newErrors.contactPersonPhoneNumber = 'Contact phone number is required'
    }
    if (!formData.contactAddress.trim()) {
      newErrors.contactAddress = 'Contact address is required'
    }
    if (!formData.status) {
      newErrors.status = 'Status is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const url = mode === 'create'
        ? withBase('/api/companies')
        : withBase(`/api/companies/${company!.id}`)

      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save company')
      }

      const result = await response.json()

      // Smart redirect based on mode
      if (mode === 'create') {
        // After creating, go to the new company's detail page
        router.push(`/companies/${result.id}`)
      } else {
        // After editing, go to the company's detail page
        router.push(`/companies/${company!.id}`)
      }
      router.refresh()
    } catch (error) {
      console.error('Error saving company:', error)
      setErrors({ submit: 'Failed to save company. Please try again.' })
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Company Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          placeholder="Enter company name"
          required
        />

        <Input
          label="Address"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          error={errors.address}
          placeholder="Enter company address"
          required
        />

        <Input
          label="Contact Person Phone Number"
          value={formData.contactPersonPhoneNumber}
          onChange={(e) => handleChange('contactPersonPhoneNumber', e.target.value)}
          error={errors.contactPersonPhoneNumber}
          placeholder="Enter contact phone number"
          type="tel"
          required
        />

        <Input
          label="Contact Address"
          value={formData.contactAddress}
          onChange={(e) => handleChange('contactAddress', e.target.value)}
          error={errors.contactAddress}
          placeholder="Enter contact address"
          required
        />

        <div className="md:col-span-2">
          <Select
            label="Status"
            value={formData.status}
            onChange={(value) => handleChange('status', value as FintechStatus)}
            options={statusOptions}
            error={errors.status}
            required
          />
        </div>
      </div>

      {errors.submit && (
        <div className="text-red-600 text-sm p-3 bg-red-50 rounded-lg">{errors.submit}</div>
      )}

      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="flex items-center gap-2 flex-1"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {mode === 'create' ? 'Create Company' : 'Update Company'}
            </>
          )}
        </Button>
        <Button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          variant="secondary"
          className="flex items-center gap-2 flex-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </Button>
      </div>
    </form>
  )
}