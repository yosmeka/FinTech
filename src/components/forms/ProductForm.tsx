'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
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
        const response = await fetch('/api/companies')
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
        ? '/api/products' 
        : `/api/products/${product!.id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save product')
      }

      router.push('/products')
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Add New Product' : 'Edit Product'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Product Name"
            value={formData.productName}
            onChange={(e) => handleChange('productName', e.target.value)}
            error={errors.productName}
            placeholder="Enter product name"
            required
          />

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Product Description
            </label>
            <textarea
              value={formData.productDescription}
              onChange={(e) => handleChange('productDescription', e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter product description"
              rows={4}
              required
            />
            {errors.productDescription && (
              <p className="text-sm text-red-600">{errors.productDescription}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Strengths
            </label>
            <textarea
              value={formData.strength}
              onChange={(e) => handleChange('strength', e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter product strengths"
              rows={3}
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
              className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Enter product weaknesses"
              rows={3}
              required
            />
            {errors.weakness && (
              <p className="text-sm text-red-600">{errors.weakness}</p>
            )}
          </div>

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value as ProductStatus)}
            options={statusOptions}
            error={errors.status}
            required
          />

          <Select
            label="Company"
            value={formData.fintechCompanyId.toString()}
            onChange={(e) => handleChange('fintechCompanyId', parseInt(e.target.value))}
            options={companyOptions}
            error={errors.fintechCompanyId}
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
              {loading ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Update Product'}
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
