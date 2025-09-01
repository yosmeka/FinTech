import Link from 'next/link'
import Image from 'next/image'
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
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 p-3 border border-red-100">
              <Image
                src="/zemen-logo.png"
                alt="Zemen Bank Logo"
                width={56}
                height={56}
                className="object-contain"
              />
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Companies */}
          <div className="card-professional">
            <div className="card-content-professional">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Companies</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalCompanies}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">{stats.engagedCompanies} Engaged</span>
                <span className="text-gray-500 mx-2">•</span>
                <span className="text-blue-600 font-medium">{stats.newCompanies} New</span>
              </div>
            </div>
          </div>

          {/* Total Products */}
          <div className="card-professional">
            <div className="card-content-professional">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">{stats.completedProducts} Done</span>
                <span className="text-gray-500 mx-2">•</span>
                <span className="text-yellow-600 font-medium">{stats.inProgressProducts} In Progress</span>
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="card-professional">
            <div className="card-content-professional">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">All Active</span>
              </div>
            </div>
          </div>

          {/* System Health */}
          {/* <div className="card-professional">
            <div className="card-content-professional">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <p className="text-3xl font-bold text-green-600">98%</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">All Systems Operational</span>
              </div>
            </div>
          </div> */}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/companies/new" className="card-professional hover:shadow-lg transition-shadow">
            <div className="card-content-professional text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Company</h3>
              <p className="text-sm text-gray-600">Register a new fintech company in the system</p>
            </div>
          </Link>

          <Link href="/products/new" className="card-professional hover:shadow-lg transition-shadow">
            <div className="card-content-professional text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Product</h3>
              <p className="text-sm text-gray-600">Create a new product for existing companies</p>
            </div>
          </Link>

          <Link href="/users/new" className="card-professional hover:shadow-lg transition-shadow">
            <div className="card-content-professional text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New User</h3>
              <p className="text-sm text-gray-600">Create a new admin user account</p>
            </div>
          </Link>
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
