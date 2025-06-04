import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FINTECH_STATUS_COLORS, FINTECH_STATUS_LABELS, PRODUCT_STATUS_COLORS, PRODUCT_STATUS_LABELS } from '@/lib/types'
import { formatDate } from '@/lib/utils'

async function getCompany(id: string) {
  const company = await prisma.fintechCompany.findUnique({
    where: { id: parseInt(id) },
    include: {
      products: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!company) {
    notFound()
  }

  return company
}

export default async function CompanyDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const company = await getCompany(params.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
          <p className="mt-2 text-gray-600">
            Company details and products
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/companies/${company.id}/edit`}>
            <Button variant="outline">Edit Company</Button>
          </Link>
          <Link href="/companies">
            <Button variant="ghost">Back to Companies</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Company Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <Badge className={FINTECH_STATUS_COLORS[company.status]}>
                    {FINTECH_STATUS_LABELS[company.status]}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="mt-1 text-gray-900">{company.address}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Contact Phone</label>
                <p className="mt-1 text-gray-900">{company.contactPersonPhoneNumber}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Contact Address</label>
                <p className="mt-1 text-gray-900">{company.contactAddress}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Created</label>
                <p className="mt-1 text-gray-900">{formatDate(company.createdAt)}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Last Updated</label>
                <p className="mt-1 text-gray-900">{formatDate(company.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Products ({company.products.length})</CardTitle>
                  <CardDescription>
                    Products offered by this company
                  </CardDescription>
                </div>
                <Link href={`/products/new?companyId=${company.id}`}>
                  <Button size="sm">Add Product</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {company.products.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No products yet</p>
                  <Link href={`/products/new?companyId=${company.id}`}>
                    <Button>Add First Product</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {company.products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{product.productName}</h3>
                        <Badge className={PRODUCT_STATUS_COLORS[product.status]}>
                          {PRODUCT_STATUS_LABELS[product.status]}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{product.productDescription}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Strengths:</span>
                          <p className="text-gray-600 mt-1">{product.strength}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Weaknesses:</span>
                          <p className="text-gray-600 mt-1">{product.weakness}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Link href={`/products/${product.id}`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                        <Link href={`/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
