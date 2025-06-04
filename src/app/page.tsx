import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FINTECH_STATUS_COLORS, PRODUCT_STATUS_COLORS, FINTECH_STATUS_LABELS, PRODUCT_STATUS_LABELS } from '@/lib/types'

async function getDashboardData() {
  const [companies, products] = await Promise.all([
    prisma.fintechCompany.findMany({
      include: {
        products: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    }),
    prisma.product.findMany({
      include: {
        fintechCompany: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    }),
  ])

  const stats = {
    totalCompanies: await prisma.fintechCompany.count(),
    totalProducts: await prisma.product.count(),
    newCompanies: await prisma.fintechCompany.count({
      where: { status: 'NEW' },
    }),
    engagedCompanies: await prisma.fintechCompany.count({
      where: { status: 'ENGAGED' },
    }),
  }

  return { companies, products, stats }
}

export default async function Dashboard() {
  const { companies, products, stats } = await getDashboardData()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of your fintech companies and products
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              New Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newCompanies}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Engaged Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.engagedCompanies}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Companies */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Companies</CardTitle>
              <Link href="/companies">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription>
              Latest fintech companies added to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companies.map((company) => (
                <div key={company.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{company.name}</p>
                    <p className="text-sm text-gray-600">{company.products.length} products</p>
                  </div>
                  <Badge className={FINTECH_STATUS_COLORS[company.status]}>
                    {FINTECH_STATUS_LABELS[company.status]}
                  </Badge>
                </div>
              ))}
              {companies.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No companies found. <Link href="/companies/new" className="text-blue-600 hover:underline">Add your first company</Link>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Products</CardTitle>
              <Link href="/products">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <CardDescription>
              Latest products added to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{product.productName}</p>
                    <p className="text-sm text-gray-600">{product.fintechCompany.name}</p>
                  </div>
                  <Badge className={PRODUCT_STATUS_COLORS[product.status]}>
                    {PRODUCT_STATUS_LABELS[product.status]}
                  </Badge>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No products found. <Link href="/products/new" className="text-blue-600 hover:underline">Add your first product</Link>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
