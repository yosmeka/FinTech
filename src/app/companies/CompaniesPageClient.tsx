'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ViewToggle, ViewMode } from '@/components/ui/ViewToggle'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterSort } from '@/components/ui/FilterSort'
import { CompaniesCards } from '@/components/cards/CompaniesCards'
import { CompaniesTable } from '@/components/tables/CompaniesTable'
import { FintechCompanyWithProducts, FintechStatus, FINTECH_STATUS_LABELS } from '@/lib/types'

interface CompaniesPageProps {
  companies: FintechCompanyWithProducts[]
}

export function CompaniesPageClient({ companies }: CompaniesPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt-desc')

  const handleViewChange = (newView: ViewMode) => {
    setViewMode(newView)
  }

  // Filter and sort companies
  const filteredAndSortedCompanies = useMemo(() => {
    let filtered = companies

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.contactPersonPhoneNumber.includes(searchQuery) ||
        company.contactAddress.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(company => company.status === statusFilter)
    }

    // Apply sorting
    const [sortField, sortDirection] = sortBy.split('-')

    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'products':
          aValue = a.products.length
          bValue = b.products.length
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
  }, [companies, searchQuery, statusFilter, sortBy])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="mt-2 text-gray-600">
            Manage your fintech companies
          </p>
        </div>
        <Link href="/companies/new">
          <Button>Add Company</Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <SearchBar
          placeholder="Search companies by name, address, phone, or contact..."
          onSearch={setSearchQuery}
        />

        <div className="flex flex-wrap gap-4 items-end">
          <FilterSort
            filters={[
              {
                label: "Status",
                value: statusFilter,
                options: Object.entries(FINTECH_STATUS_LABELS).map(([value, label]) => ({
                  value,
                  label
                })),
                onChange: setStatusFilter
              }
            ]}
            sortOptions={[
              { value: 'name-asc', label: 'Name (A-Z)' },
              { value: 'name-desc', label: 'Name (Z-A)' },
              { value: 'status-asc', label: 'Status (A-Z)' },
              { value: 'status-desc', label: 'Status (Z-A)' },
              { value: 'products-desc', label: 'Most Products' },
              { value: 'products-asc', label: 'Least Products' },
              { value: 'createdAt-desc', label: 'Newest First' },
              { value: 'createdAt-asc', label: 'Oldest First' },
            ]}
            sortValue={sortBy}
            onSortChange={setSortBy}
          />

          <ViewToggle
            currentView={viewMode}
            onViewChange={handleViewChange}
          />
        </div>
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {filteredAndSortedCompanies.length} of {companies.length} {companies.length === 1 ? 'company' : 'companies'}
          {searchQuery && ` matching "${searchQuery}"`}
          {statusFilter && ` with status "${FINTECH_STATUS_LABELS[statusFilter as FintechStatus]}"`}
        </div>
      </div>

      {/* Companies Display */}
      {filteredAndSortedCompanies.length > 0 ? (
        viewMode === 'card' ? (
          <CompaniesCards companies={filteredAndSortedCompanies} />
        ) : (
          <CompaniesTable companies={filteredAndSortedCompanies} />
        )
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || statusFilter
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Get started by creating your first company."
            }
          </p>
          {!searchQuery && !statusFilter && (
            <Link href="/companies/new">
              <Button>Add Company</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
