'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ViewToggle, ViewMode } from '@/components/ui/ViewToggle'
import { CompaniesCards } from '@/components/cards/CompaniesCards'
import { CompaniesTable } from '@/components/tables/CompaniesTable'
import { FintechCompanyWithProducts } from '@/lib/types'

interface CompaniesPageProps {
  companies: FintechCompanyWithProducts[]
}

export function CompaniesPageClient({ companies }: CompaniesPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('card')

  console.log('CompaniesPageClient rendered, current view mode:', viewMode) // Debug log

  const handleViewChange = (newView: ViewMode) => {
    console.log('handleViewChange called with:', newView)
    setViewMode(newView)
  }

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

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {companies.length} {companies.length === 1 ? 'company' : 'companies'} found
        </div>
        <ViewToggle 
          currentView={viewMode} 
          onViewChange={(newView) => {
            console.log('Changing view to:', newView) // Debug log
            setViewMode(newView)
          }} 
        />
      </div>

      {viewMode === 'card' ? (
        <CompaniesCards companies={companies} />
      ) : (
        <CompaniesTable companies={companies} />
      )}
    </div>
  )
}
