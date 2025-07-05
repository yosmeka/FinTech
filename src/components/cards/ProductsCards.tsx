import Link from 'next/link'
import { ProductWithCompanyClient, PRODUCT_STATUS_LABELS } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface ProductsCardsProps {
  products: ProductWithCompanyClient[]
}

export function ProductsCards({ products }: ProductsCardsProps) {
  if (products.length === 0) {
    return (
      <div className="card-professional">
        <div className="card-content-professional text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-black mb-3">
            No products yet
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            Get started by adding your first fintech product to begin building your portfolio.
          </p>
          <Link href="/products/new" className="card-action-btn primary inline-flex">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Product
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cards-grid">
      {products.map((product) => (
        <div key={product.id} className="card-professional">
          {/* Card Header */}
          <div className="card-header-professional">
            <div className="card-avatar product">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>

            <div className="card-status-container">
              <div>
                <h3 className="card-title-professional">{product.productName}</h3>
                <p className="card-subtitle-professional">
                  <Link
                    href={`/companies/${product.fintechCompany.id}`}
                    className="hover:text-red-600 transition-colors"
                  >
                    {product.fintechCompany.name}
                  </Link>
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

          {/* Card Content */}
          <div className="card-content-professional">
            {/* Description */}
            <div className="mb-6">
              <div className="card-info-label mb-2">Product Description</div>
              <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
                {product.productDescription}
              </p>
            </div>

            {/* Strengths & Weaknesses - Mobile Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4 mb-6">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <div className="card-info-content">
                  <div className="card-info-label">Product ID</div>
                  <div className="card-info-value">{product.id}</div>
                </div>
              </div>

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

          {/* Card Actions - Mobile Responsive */}
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
  )
}
