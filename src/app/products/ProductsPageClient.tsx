'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ViewToggle, ViewMode } from '@/components/ui/ViewToggle'
import { ProductsCards } from '@/components/cards/ProductsCards'
import { ProductsTable } from '@/components/tables/ProductsTable'
import { Product, FintechCompany } from '@/lib/types'

interface ProductWithCompany extends Product {
  fintechCompany: FintechCompany
}

interface ProductsPageProps {
  products: ProductWithCompany[]
}

export function ProductsPageClient({ products }: ProductsPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('card')

  console.log('Current view mode:', viewMode) // Debug log

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">
            Manage fintech products
          </p>
        </div>
        <Link href="/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
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
        <ProductsCards products={products} />
      ) : (
        <ProductsTable products={products} />
      )}
    </div>
  )
}
