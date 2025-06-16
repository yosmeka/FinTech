'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ViewToggle, ViewMode } from '@/components/ui/ViewToggle'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterSort } from '@/components/ui/FilterSort'
import { ProductsCards } from '@/components/cards/ProductsCards'
import { ProductsTable } from '@/components/tables/ProductsTable'
import { Product, FintechCompany, ProductStatus, PRODUCT_STATUS_LABELS } from '@/lib/types'

interface ProductWithCompany extends Product {
  fintechCompany: FintechCompany
}

interface ProductsPageProps {
  products: ProductWithCompany[]
}

export function ProductsPageClient({ products }: ProductsPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt-desc')

  // Get unique companies for filter
  const companies = useMemo(() => {
    const uniqueCompanies = Array.from(
      new Set(products.map(p => p.fintechCompany.id))
    ).map(id => products.find(p => p.fintechCompany.id === id)!.fintechCompany)

    return uniqueCompanies.sort((a, b) => a.name.localeCompare(b.name))
  }, [products])

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.productDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.strength.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.weakness.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.fintechCompany.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(product => product.status === statusFilter)
    }

    // Apply company filter
    if (companyFilter) {
      filtered = filtered.filter(product => product.fintechCompany.id.toString() === companyFilter)
    }

    // Apply sorting
    const [sortField, sortDirection] = sortBy.split('-')
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case 'name':
          aValue = a.productName.toLowerCase()
          bValue = b.productName.toLowerCase()
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'company':
          aValue = a.fintechCompany.name.toLowerCase()
          bValue = b.fintechCompany.name.toLowerCase()
          break
        case 'createdAt':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [products, searchQuery, statusFilter, companyFilter, sortBy])

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600">
            Manage fintech products
          </p>
        </div>
        <Link href="/products/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">Add Product</Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <SearchBar
          placeholder="Search products by name, description, strength, weakness, or company..."
          onSearch={setSearchQuery}
        />

        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
          <div className="flex-1">
            <FilterSort
              filters={[
                {
                  label: "Status",
                  value: statusFilter,
                  options: Object.entries(PRODUCT_STATUS_LABELS).map(([value, label]) => ({
                    value,
                    label
                  })),
                  onChange: setStatusFilter
                },
                {
                  label: "Company",
                  value: companyFilter,
                  options: companies.map(company => ({
                    value: company.id.toString(),
                    label: company.name
                  })),
                  onChange: setCompanyFilter
                }
              ]}
              sortOptions={[
                { value: 'name-asc', label: 'Name (A-Z)' },
                { value: 'name-desc', label: 'Name (Z-A)' },
                { value: 'status-asc', label: 'Status (A-Z)' },
                { value: 'status-desc', label: 'Status (Z-A)' },
                { value: 'company-asc', label: 'Company (A-Z)' },
                { value: 'company-desc', label: 'Company (Z-A)' },
                { value: 'createdAt-desc', label: 'Newest First' },
                { value: 'createdAt-asc', label: 'Oldest First' },
              ]}
              sortValue={sortBy}
              onSortChange={setSortBy}
              className="w-full"
            />
          </div>

          <ViewToggle
            currentView={viewMode}
            onViewChange={setViewMode}
          />
        </div>
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-xs sm:text-sm text-gray-600 px-1">
          {filteredAndSortedProducts.length} of {products.length} {products.length === 1 ? 'product' : 'products'}
          {searchQuery && (
            <span className="block sm:inline">
              {' '}matching "{searchQuery.length > 25 ? searchQuery.substring(0, 25) + '...' : searchQuery}"
            </span>
          )}
          {statusFilter && (
            <span className="block sm:inline">
              {' '}with status "{PRODUCT_STATUS_LABELS[statusFilter as ProductStatus]}"
            </span>
          )}
          {companyFilter && (
            <span className="block sm:inline">
              {' '}from "{companies.find(c => c.id.toString() === companyFilter)?.name}"
            </span>
          )}
        </div>
      </div>

      {/* Products Display */}
      {filteredAndSortedProducts.length > 0 ? (
        viewMode === 'card' ? (
          <ProductsCards products={filteredAndSortedProducts} />
        ) : (
          <ProductsTable products={filteredAndSortedProducts} />
        )
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || statusFilter || companyFilter
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Get started by creating your first product."
            }
          </p>
          {!searchQuery && !statusFilter && !companyFilter && (
            <Link href="/products/new">
              <Button>Add Product</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
