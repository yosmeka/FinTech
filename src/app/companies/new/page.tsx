import Link from 'next/link'
import { CompanyForm } from '@/components/forms/CompanyForm'

export default function NewCompanyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="detail-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-6">
              {/* Form Icon */}
              <div className="detail-hero-avatar bg-red-100 text-red-600 flex-shrink-0">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>

              {/* Form Info */}
              <div>
                <h1 className="detail-hero-title">Add New Company</h1>
                <p className="detail-hero-subtitle">
                  Create a new fintech company profile with complete business information
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="card-status-badge info">
                    New Company
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    Required fields marked with *
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
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

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-professional">
          <div className="card-header-professional">
            <h2 className="card-title-professional">Company Information</h2>
            <p className="card-subtitle-professional">
              Enter the complete details for the new fintech company
            </p>
          </div>

          <div className="card-content-professional">
            <CompanyForm mode="create" />
          </div>
        </div>
      </div>
    </div>
  )
}
