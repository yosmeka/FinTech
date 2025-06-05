import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { FINTECH_STATUS_LABELS, PRODUCT_STATUS_LABELS } from '@/lib/types'
import { formatDate } from '@/lib/utils'

async function getDashboardData() {
  const [companies, products, users] = await Promise.all([
    prisma.fintechCompany.findMany({
      include: {
        products: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
    }),
    prisma.product.findMany({
      include: {
        fintechCompany: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
    }),
    prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    }),
  ])

  const stats = {
    totalCompanies: await prisma.fintechCompany.count(),
    totalProducts: await prisma.product.count(),
    totalUsers: await prisma.user.count(),
    engagedCompanies: await prisma.fintechCompany.count({
      where: { status: 'ENGAGED' },
    }),
    newCompanies: await prisma.fintechCompany.count({
      where: { status: 'NEW' },
    }),
    retiredCompanies: await prisma.fintechCompany.count({
      where: { status: 'RETIRED' },
    }),
    completedProducts: await prisma.product.count({
      where: { status: 'DONE' },
    }),
    inProgressProducts: await prisma.product.count({
      where: { status: 'INPROGRESS' },
    }),
    newProducts: await prisma.product.count({
      where: { status: 'NEW' },
    }),
  }

  return { companies, products, users, stats }
}

export default async function Dashboard() {
  const { companies, products, users, stats } = await getDashboardData()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="detail-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-black mb-4">Fintech Dashboard</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive overview of your fintech companies, products, and system analytics
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Cards */}
        <div className="dashboard-stats-grid">
          {/* Total Companies Card */}
          <div className="card-professional">
            <div className="card-header-professional">
              <div className="card-avatar company">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="card-title-professional">Total Companies</h3>
                <p className="card-subtitle-professional">Complete company portfolio breakdown</p>
              </div>
            </div>
            <div className="card-content-professional">
              {/* Main Total Metric */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-black mb-2">{stats.totalCompanies}</div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Total Companies</div>
              </div>

              {/* Status Breakdown */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-green-800">{stats.engagedCompanies}</div>
                  <div className="text-xs text-green-700 font-semibold uppercase tracking-wider">Engaged</div>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-blue-800">{stats.newCompanies}</div>
                  <div className="text-xs text-blue-700 font-semibold uppercase tracking-wider">New</div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-gray-800">{stats.retiredCompanies}</div>
                  <div className="text-xs text-gray-700 font-semibold uppercase tracking-wider">Retired</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span>Company Status Distribution</span>
                  <span>{stats.totalCompanies} Total</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="h-full flex">
                    <div
                      className="bg-green-500"
                      style={{ width: `${stats.totalCompanies > 0 ? (stats.engagedCompanies / stats.totalCompanies) * 100 : 0}%` }}
                    ></div>
                    <div
                      className="bg-blue-500"
                      style={{ width: `${stats.totalCompanies > 0 ? (stats.newCompanies / stats.totalCompanies) * 100 : 0}%` }}
                    ></div>
                    <div
                      className="bg-gray-500"
                      style={{ width: `${stats.totalCompanies > 0 ? (stats.retiredCompanies / stats.totalCompanies) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <Link href="/companies" className="card-action-btn primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Companies
              </Link>
              <Link href="/companies/new" className="card-action-btn secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New
              </Link>
            </div>
          </div>

          {/* Total Products Card */}
          <div className="card-professional">
            <div className="card-header-professional">
              <div className="card-avatar product">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="card-title-professional">Total Products</h3>
                <p className="card-subtitle-professional">Complete product portfolio breakdown</p>
              </div>
            </div>
            <div className="card-content-professional">
              {/* Main Total Metric */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-black mb-2">{stats.totalProducts}</div>
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Total Products</div>
              </div>

              {/* Status Breakdown */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-green-800">{stats.completedProducts}</div>
                  <div className="text-xs text-green-700 font-semibold uppercase tracking-wider">Done</div>
                </div>

                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-yellow-800">{stats.inProgressProducts}</div>
                  <div className="text-xs text-yellow-700 font-semibold uppercase tracking-wider">In Progress</div>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-blue-800">{stats.newProducts}</div>
                  <div className="text-xs text-blue-700 font-semibold uppercase tracking-wider">New</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span>Product Status Distribution</span>
                  <span>{stats.totalProducts} Total</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div className="h-full flex">
                    <div
                      className="bg-green-500"
                      style={{ width: `${stats.totalProducts > 0 ? (stats.completedProducts / stats.totalProducts) * 100 : 0}%` }}
                    ></div>
                    <div
                      className="bg-yellow-500"
                      style={{ width: `${stats.totalProducts > 0 ? (stats.inProgressProducts / stats.totalProducts) * 100 : 0}%` }}
                    ></div>
                    <div
                      className="bg-blue-500"
                      style={{ width: `${stats.totalProducts > 0 ? (stats.newProducts / stats.totalProducts) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <Link href="/products" className="card-action-btn primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Products
              </Link>
              <Link href="/products/new" className="card-action-btn secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New
              </Link>
            </div>
          </div>

          {/* Total Users Card */}
          <div className="card-professional">
            <div className="card-header-professional">
              <div className="card-avatar user">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h3 className="card-title-professional">System Users</h3>
                <p className="card-subtitle-professional">Admin users & managers</p>
              </div>
            </div>
            <div className="card-content-professional">
              <div className="card-metrics">
                <div className="card-metric">
                  <div className="card-metric-value">{stats.totalUsers}</div>
                  <div className="card-metric-label">Total Users</div>
                </div>
                <div className="card-metric">
                  <div className="card-metric-value">{users.filter(u => u.isActive).length}</div>
                  <div className="card-metric-label">Active</div>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <Link href="/users" className="card-action-btn primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Users
              </Link>
              <Link href="/users/new" className="card-action-btn secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Companies */}
          <div className="card-professional">
            <div className="card-header-professional">
              <div className="flex items-center justify-between w-full">
                <div>
                  <h2 className="card-title-professional">Recent Companies</h2>
                  <p className="card-subtitle-professional">Latest fintech companies added to the system</p>
                </div>
                <Link href="/companies" className="card-action-btn secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  View All
                </Link>
              </div>
            </div>
            <div className="card-content-professional">
              {companies.length === 0 ? (
                <div className="dashboard-empty-state">
                  <div className="dashboard-empty-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">No companies found</p>
                  <Link href="/companies/new" className="card-action-btn primary inline-flex">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add First Company
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {companies.map((company) => (
                    <div key={company.id} className="dashboard-activity-item">
                      <div className="flex items-center space-x-3">
                        <div className="dashboard-activity-avatar bg-red-100 text-red-600">
                          {company.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="dashboard-activity-content">
                          <Link
                            href={`/companies/${company.id}`}
                            className="dashboard-activity-title"
                          >
                            {company.name}
                          </Link>
                          <p className="dashboard-activity-subtitle">
                            {company.products.length} product{company.products.length !== 1 ? 's' : ''} • {formatDate(company.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span className={`table-badge ${
                        company.status === 'ENGAGED' ? 'success' :
                        company.status === 'RETIRED' ? 'error' :
                        company.status === 'NEW' ? 'info' : 'info'
                      }`}>
                        {FINTECH_STATUS_LABELS[company.status]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Products */}
          <div className="card-professional">
            <div className="card-header-professional">
              <div className="flex items-center justify-between w-full">
                <div>
                  <h2 className="card-title-professional">Recent Products</h2>
                  <p className="card-subtitle-professional">Latest products added to the system</p>
                </div>
                <Link href="/products" className="card-action-btn secondary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  View All
                </Link>
              </div>
            </div>
            <div className="card-content-professional">
              {products.length === 0 ? (
                <div className="dashboard-empty-state">
                  <div className="dashboard-empty-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">No products found</p>
                  <Link href="/products/new" className="card-action-btn primary inline-flex">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add First Product
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="dashboard-activity-item">
                      <div className="flex items-center space-x-3">
                        <div className="dashboard-activity-avatar bg-blue-100 text-blue-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                        <div className="dashboard-activity-content">
                          <Link
                            href={`/products/${product.id}`}
                            className="dashboard-activity-title"
                          >
                            {product.productName}
                          </Link>
                          <p className="dashboard-activity-subtitle">
                            <Link
                              href={`/companies/${product.fintechCompany.id}`}
                              className="hover:text-red-600 transition-colors"
                            >
                              {product.fintechCompany.name}
                            </Link>
                            {' • '}{formatDate(product.createdAt)}
                          </p>
                        </div>
                      </div>
                      <span className={`table-badge ${
                        product.status === 'DONE' ? 'success' :
                        product.status === 'INPROGRESS' ? 'warning' : 'info'
                      }`}>
                        {PRODUCT_STATUS_LABELS[product.status]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
