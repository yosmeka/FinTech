'use client'

import { useState, useEffect } from 'react'
import { withBase } from '@/lib/path'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { ProductStatus, PRODUCT_STATUS_LABELS, type Product, type FintechCompany } from '@/lib/types'

interface ProductWithCompany extends Product {
  fintechCompany: FintechCompany
}

interface ProductFormProps {
  product?: ProductWithCompany
  mode: 'create' | 'edit'
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [companies, setCompanies] = useState<FintechCompany[]>([])

  const [formData, setFormData] = useState({
    productName: product?.productName || '',
    productDescription: product?.productDescription || '',
    strength: product?.strength || '',
    weakness: product?.weakness || '',
    remark: product?.remark || '',
    status: product?.status || 'NEW' as ProductStatus,
    fintechCompanyId: product?.fintechCompanyId || parseInt(searchParams.get('companyId') || '0') || 0,
  })

  const statusOptions = Object.entries(PRODUCT_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }))

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(withBase('/api/companies'), { credentials: 'include' })
        if (response.ok) {
          const data = await response.json()
          setCompanies(data)
        }
      } catch (error) {
        console.error('Error fetching companies:', error)
      }
    }

    fetchCompanies()
  }, [])

  const companyOptions = companies.map(company => ({
    value: company.id.toString(),
    label: company.name,
  }))

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required'
    }
    if (!formData.productDescription.trim()) {
      newErrors.productDescription = 'Product description is required'
    }
    if (!formData.strength.trim()) {
      newErrors.strength = 'Strengths are required'
    }
    if (!formData.weakness.trim()) {
      newErrors.weakness = 'Weaknesses are required'
    }
    if (!formData.status) {
      newErrors.status = 'Status is required'
    }
    if (!formData.fintechCompanyId) {
      newErrors.fintechCompanyId = 'Company is required'
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
        ? withBase('/api/products')
        : withBase(`/api/products/${product!.id}`)

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
        throw new Error('Failed to save product')
      }

      // Smart redirect based on context
      const companyId = searchParams.get('companyId')
      if (companyId && mode === 'create') {
        // If we came from a company detail page, redirect back to it
        router.push(`/companies/${companyId}`)
      } else if (mode === 'edit') {
        // If editing, go to the product detail page
        router.push(`/products/${product!.id}`)
      } else {
        // Default to products list
        router.push('/products')
      }
      router.refresh()
    } catch (error) {
      console.error('Error saving product:', error)
      setErrors({ submit: 'Failed to save product. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Product Name"
            value={formData.productName}
            onChange={(e) => handleChange('productName', e.target.value)}
            error={errors.productName}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="md:col-span-2">
          <Select
            label="Company"
            value={formData.fintechCompanyId.toString()}
            onChange={(value) => handleChange('fintechCompanyId', parseInt(value))}
            options={companyOptions}
            error={errors.fintechCompanyId}
            required
          />
        </div>

        <div className="md:col-span-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Product Description
            </label>
            <textarea
              value={formData.productDescription}
              onChange={(e) => handleChange('productDescription', e.target.value)}
              className="flex min-h-[120px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
              placeholder="Enter product description"
              required
            />
            {errors.productDescription && (
              <p className="text-sm text-red-600">{errors.productDescription}</p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Strengths
          </label>
          <textarea
            value={formData.strength}
            onChange={(e) => handleChange('strength', e.target.value)}
            className="flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
            placeholder="Enter product strengths"
            required
          />
          {errors.strength && (
            <p className="text-sm text-red-600">{errors.strength}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Weaknesses
          </label>
          <textarea
            value={formData.weakness}
            onChange={(e) => handleChange('weakness', e.target.value)}
            className="flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
            placeholder="Enter product weaknesses"
            required
          />
          {errors.weakness && (
            <p className="text-sm text-red-600">{errors.weakness}</p>
          )}
        </div>

        <Select
          label="Status"
          value={formData.status}
          onChange={(value) => handleChange('status', value as ProductStatus)}
          options={statusOptions}
          error={errors.status}
          required
        />

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Remark
          </label>
          <textarea
            value={formData.remark}
            onChange={(e) => handleChange('remark', e.target.value)}
            className="flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
            placeholder="Enter any additional remarks about status"
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
              {mode === 'create' ? 'Create Product' : 'Update Product'}
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