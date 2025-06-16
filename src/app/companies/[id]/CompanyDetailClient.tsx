'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ViewToggle, ViewMode } from '@/components/ui/ViewToggle'
import { SearchBar } from '@/components/ui/SearchBar'
import { Select } from '@/components/ui/Select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { FintechCompanyWithProducts, FINTECH_STATUS_LABELS, PRODUCT_STATUS_LABELS, ProductStatus } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface CompanyDetailClientProps {
  company: FintechCompanyWithProducts
}

export function CompanyDetailClient({ company }: CompanyDetailClientProps) {
  const [productsViewMode, setProductsViewMode] = useState<ViewMode>('card')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'ALL'>('ALL')
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'created'>('created')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = company.products

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.productDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.strength.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.weakness.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(product => product.status === statusFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | Date
      let bValue: string | Date

      switch (sortBy) {
        case 'name':
          aValue = a.productName.toLowerCase()
          bValue = b.productName.toLowerCase()
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'created':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        default:
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [company.products, searchQuery, statusFilter, sortBy, sortOrder])

  // Filter options
  const statusOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: 'NEW', label: 'New' },
    { value: 'INPROGRESS', label: 'In Progress' },
    { value: 'DONE', label: 'Done' },
  ]

  const sortOptions = [
    { value: 'created', label: 'Date Created' },
    { value: 'name', label: 'Product Name' },
    { value: 'status', label: 'Status' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="detail-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-6">
              {/* Company Avatar */}
              <div className="detail-hero-avatar flex-shrink-0">
                {company.name.charAt(0).toUpperCase()}
              </div>

              {/* Company Info */}
              <div>
                <h1 className="detail-hero-title">{company.name}</h1>
                <p className="detail-hero-subtitle">
                  Fintech Company • ID: {company.id}
                </p>
                <div className="flex items-center gap-4">
                  <span className={`card-status-badge ${
                    company.status === 'ACTIVE' ? 'success' :
                    company.status === 'INACTIVE' ? 'error' :
                    company.status === 'PENDING' ? 'warning' : 'info'
                  }`}>
                    {FINTECH_STATUS_LABELS[company.status]}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {company.products.length} product{company.products.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link href={`/companies/${company.id}/edit`} className="card-action-btn secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Company
              </Link>
              <Link href="/companies" className="card-action-btn secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Companies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Company Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Details Card */}
            <div className="card-professional">
              <div className="card-header-professional">
                <h2 className="card-title-professional">Company Information</h2>
                <p className="card-subtitle-professional">Detailed company information and contact details</p>
              </div>

              <div className="card-content-professional">
                <div className="card-info-grid">
                  <div className="card-info-item">
                    <svg className="card-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="card-info-content">
                      <div className="card-info-label">Business Address</div>
                      <div className="card-info-value">{company.address}</div>
                    </div>
                  </div>

                  <div className="card-info-item">
                    <svg className="card-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div className="card-info-content">
                      <div className="card-info-label">Contact Phone</div>
                      <div className="card-info-value">{company.contactPersonPhoneNumber}</div>
                    </div>
                  </div>

                  <div className="card-info-item">
                    <svg className="card-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6h8m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                    <div className="card-info-content">
                      <div className="card-info-label">Contact Address</div>
                      <div className="card-info-value">{company.contactAddress}</div>
                    </div>
                  </div>

                  <div className="card-info-item">
                    <svg className="card-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6h8m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                    <div className="card-info-content">
                      <div className="card-info-label">Created</div>
                      <div className="card-info-value">{formatDate(company.createdAt)}</div>
                    </div>
                  </div>

                  <div className="card-info-item">
                    <svg className="card-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="card-info-content">
                      <div className="card-info-label">Last Updated</div>
                      <div className="card-info-value">{formatDate(company.updatedAt)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Metrics Card */}
            <div className="card-professional">
              <div className="card-header-professional">
                <h2 className="card-title-professional">Company Metrics</h2>
                <p className="card-subtitle-professional">Product portfolio overview</p>
              </div>

              <div className="card-content-professional">
                <div className="card-metrics">
                  <div className="card-metric">
                    <div className="card-metric-value">{company.products.length}</div>
                    <div className="card-metric-label">Total Products</div>
                  </div>
                  <div className="card-metric">
                    <div className="card-metric-value">
                      {company.products.filter(p => p.status === 'DONE').length}
                    </div>
                    <div className="card-metric-label">Completed</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-lg font-bold text-yellow-800">
                      {company.products.filter(p => p.status === 'INPROGRESS').length}
                    </div>
                    <div className="text-xs text-yellow-700 font-semibold uppercase tracking-wider">
                      In Progress
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-lg font-bold text-blue-800">
                      {company.products.filter(p => p.status === 'NEW').length}
                    </div>
                    <div className="text-xs text-blue-700 font-semibold uppercase tracking-wider">
                      New
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="card-professional">
              <div className="card-header-professional">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="card-title-professional">
                        Products ({filteredAndSortedProducts.length}{company.products.length !== filteredAndSortedProducts.length && ` of ${company.products.length}`})
                      </h2>
                      <p className="card-subtitle-professional">
                        Products and services offered by this company
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      {company.products.length > 0 && (
                        <ViewToggle
                          currentView={productsViewMode}
                          onViewChange={setProductsViewMode}
                        />
                      )}
                      <Link href={`/products/new?companyId=${company.id}`} className="card-action-btn primary w-full sm:w-auto justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Product
                      </Link>
                    </div>
                  </div>

                  {/* Search and Filter Controls */}
                  {company.products.length > 0 && (
                    <div className="space-y-4">
                      {/* Search Bar - Full Width */}
                      <div className="w-full">
                        <SearchBar
                          query={searchQuery}
                          onQueryChange={setSearchQuery}
                          placeholder="Search products by name, description, strengths, or weaknesses..."
                          className="w-full"
                        />
                      </div>

                      {/* Filter Controls - Responsive Layout */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Select
                          value={statusFilter}
                          onChange={(value) => setStatusFilter(value as ProductStatus | 'ALL')}
                          options={statusOptions}
                          className="w-full sm:w-40"
                        />
                        <Select
                          value={sortBy}
                          onChange={(value) => setSortBy(value as 'name' | 'status' | 'created')}
                          options={sortOptions}
                          className="w-full sm:w-40"
                        />
                        <button
                          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                          className="w-full sm:w-auto card-action-btn secondary px-3 flex items-center justify-center gap-2"
                          title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                        >
                          <svg className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                          </svg>
                          <span className="sm:hidden">
                            Sort {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                          </span>
                        </button>
                      </div>

                      {/* Active Filters Summary - Mobile Responsive */}
                      {(searchQuery || statusFilter !== 'ALL') && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start sm:items-center gap-2 text-sm">
                            <svg className="w-4 h-4 text-blue-600 mt-0.5 sm:mt-0 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <span className="text-blue-800 font-medium">Active filters:</span>
                              <div className="flex flex-wrap gap-1">
                                {searchQuery && (
                                  <span className="px-2 py-1 bg-blue-100 rounded text-xs">
                                    Search: "{searchQuery.length > 20 ? searchQuery.substring(0, 20) + '...' : searchQuery}"
                                  </span>
                                )}
                                {statusFilter !== 'ALL' && (
                                  <span className="px-2 py-1 bg-blue-100 rounded text-xs">
                                    Status: {statusOptions.find(opt => opt.value === statusFilter)?.label}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSearchQuery('')
                              setStatusFilter('ALL')
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium self-start sm:self-auto"
                          >
                            Clear all
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="card-content-professional">
              {company.products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3">No products yet</h3>
                  <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                    Get started by adding the first product for {company.name}.
                  </p>
                  <Link href={`/products/new?companyId=${company.id}`} className="card-action-btn primary inline-flex">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add First Product
                  </Link>
                </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-black mb-3">No products found</h3>
                    <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                      {searchQuery || statusFilter !== 'ALL'
                        ? "Try adjusting your search or filters to find what you're looking for."
                        : `No products match your current criteria.`
                      }
                    </p>
                    {(searchQuery || statusFilter !== 'ALL') && (
                      <button
                        onClick={() => {
                          setSearchQuery('')
                          setStatusFilter('ALL')
                        }}
                        className="card-action-btn secondary inline-flex"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Clear Filters
                      </button>
                    )}
                  </div>
                ) : productsViewMode === 'card' ? (
                  // Professional Card View - Mobile Responsive
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
                    {filteredAndSortedProducts.map((product) => (
                    <div key={product.id} className="card-professional">
                      {/* Product Card Header */}
                      <div className="card-header-professional">
                        <div className="card-avatar product">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>

                        <div className="card-status-container">
                          <div>
                            <h3 className="card-title-professional">
                              <Link
                                href={`/products/${product.id}`}
                                className="hover:text-red-600 transition-colors"
                              >
                                {product.productName}
                              </Link>
                            </h3>
                            <p className="card-subtitle-professional">
                              Product ID: {product.id}
                            </p>
                          </div>
                          <span className={`card-status-badge ${
                            product.status === 'DONE' ? 'success' :
                            product.status === 'INPROGRESS' ? 'warning' : 'info'
                          }`}>
                            {PRODUCT_STATUS_LABELS[product.status]}
                          </span>
                        </div>
                      </div>

                      {/* Product Card Content */}
                      <div className="card-content-professional">
                        {/* Description */}
                        <div className="mb-6">
                          <div className="card-info-label mb-2">Product Description</div>
                          <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                            {product.productDescription}
                          </p>
                        </div>

                        {/* Strengths & Weaknesses - Mobile Responsive */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 mb-6">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs font-bold text-green-800 uppercase tracking-wider">Strengths</span>
                            </div>
                            <p className="text-sm text-green-700 line-clamp-3 leading-relaxed">{product.strength}</p>
                          </div>

                          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs font-bold text-red-800 uppercase tracking-wider">Weaknesses</span>
                            </div>
                            <p className="text-sm text-red-700 line-clamp-3 leading-relaxed">{product.weakness}</p>
                          </div>
                        </div>

                        {/* Information Grid */}
                        <div className="card-info-grid">
                          <div className="card-info-item">
                            <svg className="card-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6h8m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v2" />
                            </svg>
                            <div className="card-info-content">
                              <div className="card-info-label">Created</div>
                              <div className="card-info-value">{formatDate(product.createdAt)}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Product Card Actions - Mobile Responsive */}
                      <div className="card-actions flex-col sm:flex-row gap-2 sm:gap-3">
                        <Link href={`/products/${product.id}`} className="card-action-btn primary w-full sm:w-auto justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </Link>
                        <Link href={`/products/${product.id}/edit`} className="card-action-btn secondary w-full sm:w-auto justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Link>
                      </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Professional Table View - Mobile Responsive
                  <div className="table-container overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">Product Name</TableHead>
                          <TableHead className="min-w-[100px]">Status</TableHead>
                          <TableHead className="hidden lg:table-cell min-w-[200px]">Description</TableHead>
                          <TableHead className="hidden xl:table-cell min-w-[150px]">Strengths</TableHead>
                          <TableHead className="hidden xl:table-cell min-w-[150px]">Weaknesses</TableHead>
                          <TableHead className="hidden sm:table-cell min-w-[120px]">Created</TableHead>
                          <TableHead className="min-w-[120px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAndSortedProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                              </div>
                              <div>
                                <Link
                                  href={`/products/${product.id}`}
                                  className="font-semibold text-black hover:text-red-600 transition-colors"
                                >
                                  {product.productName}
                                </Link>
                                <p className="text-sm text-gray-500 mt-1">
                                  ID: {product.id}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`table-badge ${
                              product.status === 'DONE' ? 'success' :
                              product.status === 'INPROGRESS' ? 'warning' : 'info'
                            }`}>
                              {PRODUCT_STATUS_LABELS[product.status]}
                            </span>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="max-w-xs">
                              <p className="text-sm text-gray-900 line-clamp-2" title={product.productDescription}>
                                {product.productDescription}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <div className="max-w-xs">
                              <p className="text-sm text-green-700 line-clamp-2" title={product.strength}>
                                {product.strength}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            <div className="max-w-xs">
                              <p className="text-sm text-red-700 line-clamp-2" title={product.weakness}>
                                {product.weakness}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="text-sm">
                              <p className="text-gray-900">{formatDate(product.createdAt)}</p>
                              <p className="text-gray-500 text-xs mt-1">Created</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="table-actions flex flex-col sm:flex-row gap-1 sm:gap-2">
                              <Link href={`/products/${product.id}`} className="table-action-btn primary text-xs px-2 py-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span className="hidden sm:inline">View</span>
                              </Link>
                              <Link href={`/products/${product.id}/edit`} className="table-action-btn secondary text-xs px-2 py-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span className="hidden sm:inline">Edit</span>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
