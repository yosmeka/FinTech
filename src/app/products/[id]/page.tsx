import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PRODUCT_STATUS_COLORS, PRODUCT_STATUS_LABELS, FINTECH_STATUS_COLORS, FINTECH_STATUS_LABELS } from '@/lib/types'
import { formatDate } from '@/lib/utils'

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      fintechCompany: true,
    },
  })

  if (!product) {
    notFound()
  }

  return product
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.productName}</h1>
          <p className="mt-2 text-gray-600">
            Product details and information
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/products/${product.id}/edit`}>
            <Button variant="outline">Edit Product</Button>
          </Link>
          <Link href="/products">
            <Button variant="ghost">Back to Products</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle>Product Information</CardTitle>
                <Badge className={PRODUCT_STATUS_COLORS[product.status]}>
                  {PRODUCT_STATUS_LABELS[product.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="mt-2 text-gray-900 leading-relaxed">{product.productDescription}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Strengths</label>
                  <div className="mt-2 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-gray-900 leading-relaxed">{product.strength}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Weaknesses</label>
                  <div className="mt-2 p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-gray-900 leading-relaxed">{product.weakness}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Created</label>
                  <p className="mt-1 text-gray-900">{formatDate(product.createdAt)}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="mt-1 text-gray-900">{formatDate(product.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Details about the company that owns this product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Company Name</label>
                <p className="mt-1 text-gray-900 font-medium">{product.fintechCompany.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <Badge className={FINTECH_STATUS_COLORS[product.fintechCompany.status]}>
                    {FINTECH_STATUS_LABELS[product.fintechCompany.status]}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Address</label>
                <p className="mt-1 text-gray-900">{product.fintechCompany.address}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Contact Phone</label>
                <p className="mt-1 text-gray-900">{product.fintechCompany.contactPersonPhoneNumber}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Contact Address</label>
                <p className="mt-1 text-gray-900">{product.fintechCompany.contactAddress}</p>
              </div>
              
              <div className="pt-4">
                <Link href={`/companies/${product.fintechCompany.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    View Company Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
