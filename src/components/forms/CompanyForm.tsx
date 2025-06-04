'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
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
        ? '/api/companies' 
        : `/api/companies/${company!.id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save company')
      }

      router.push('/companies')
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Add New Company' : 'Edit Company'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as FintechStatus)}
            options={statusOptions}
            error={errors.status}
            required
          />

          {errors.submit && (
            <div className="text-red-600 text-sm">{errors.submit}</div>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Company' : 'Update Company'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
