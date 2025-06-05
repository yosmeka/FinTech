import Link from 'next/link'
import { FintechCompanyWithProducts, FINTECH_STATUS_LABELS } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface CompaniesCardsProps {
  companies: FintechCompanyWithProducts[]
}

export function CompaniesCards({ companies }: CompaniesCardsProps) {
  if (companies.length === 0) {
    return (
      <div className="card-professional">
        <div className="card-content-professional text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-black mb-3">
            No companies yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Get started by adding your first fintech company to begin managing your portfolio.
          </p>
          <Link href="/companies/new" className="card-action-btn primary inline-flex">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Company
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cards-grid">
      {companies.map((company) => (
        <div key={company.id} className="card-professional">
          {/* Card Header */}
          <div className="card-header-professional">
            <div className="card-avatar company">
              {company.name.charAt(0).toUpperCase()}
            </div>

            <div className="card-status-container">
              <div>
                <h3 className="card-title-professional">{company.name}</h3>
                <p className="card-subtitle-professional">
                  Company ID: {company.id}
                </p>
              </div>
              <span className={`card-status-badge ${
                company.status === 'ACTIVE' ? 'success' :
                company.status === 'INACTIVE' ? 'error' :
                company.status === 'PENDING' ? 'warning' : 'info'
              }`}>
                {FINTECH_STATUS_LABELS[company.status]}
              </span>
            </div>
          </div>

          {/* Card Content */}
          <div className="card-content-professional">
            {/* Metrics */}
            <div className="card-metrics">
              <div className="card-metric">
                <div className="card-metric-value">{company.products.length}</div>
                <div className="card-metric-label">Products</div>
              </div>
              <div className="card-metric">
                <div className="card-metric-value">
                  {company.products.filter(p => p.status === 'DONE').length}
                </div>
                <div className="card-metric-label">Completed</div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="card-info-grid">
              <div className="card-info-item">
                <svg className="card-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="card-info-content">
                  <div className="card-info-label">Address</div>
                  <div className="card-info-value line-clamp-2">{company.address}</div>
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
                  <div className="card-info-value line-clamp-2">{company.contactAddress}</div>
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
            </div>
          </div>

          {/* Card Actions */}
          <div className="card-actions">
            <Link href={`/companies/${company.id}`} className="card-action-btn primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Details
            </Link>
            <Link href={`/companies/${company.id}/edit`} className="card-action-btn secondary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
