import Link from 'next/link'
import React, { Suspense } from 'react'
import { ProductForm } from '@/components/forms/ProductForm'

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="detail-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-6">
              {/* Form Icon */}
              <div className="detail-hero-avatar bg-blue-100 text-blue-600 flex-shrink-0">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>

              {/* Form Info */}
              <div>
                <h1 className="detail-hero-title">Add New Product</h1>
                <p className="detail-hero-subtitle">
                  Create a new fintech product with detailed specifications and analysis
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="card-status-badge info">
                    New Product
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    Required fields marked with *
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link href="/products" className="card-action-btn secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-professional">
          <div className="card-header-professional">
            <h2 className="card-title-professional">Product Information</h2>
            <p className="card-subtitle-professional">
              Enter the complete details for the new fintech product including strengths and weaknesses analysis
            </p>
          </div>

          <div className="card-content-professional">
            <Suspense fallback={<div className="text-center py-8">Loading form...</div>}>
              <ProductForm mode="create" />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
