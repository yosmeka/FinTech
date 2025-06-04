import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Product, FintechCompany, PRODUCT_STATUS_COLORS, PRODUCT_STATUS_LABELS } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface ProductWithCompany extends Product {
  fintechCompany: FintechCompany
}

interface ProductsCardsProps {
  products: ProductWithCompany[]
}

export function ProductsCards({ products }: ProductsCardsProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products yet
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by adding your first product.
          </p>
          <Link href="/products/new">
            <Button>Add Product</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{product.productName}</CardTitle>
                <CardDescription className="mt-1">
                  {product.fintechCompany.name}
                </CardDescription>
              </div>
              <Badge className={PRODUCT_STATUS_COLORS[product.status]}>
                {PRODUCT_STATUS_LABELS[product.status]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {product.productDescription}
            </p>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Strengths:</span>
                <p className="text-gray-600 line-clamp-2">{product.strength}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Weaknesses:</span>
                <p className="text-gray-600 line-clamp-2">{product.weakness}</p>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              Created: {formatDate(product.createdAt)}
            </p>
            
            <div className="flex gap-2 mt-4">
              <Link href={`/products/${product.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </Link>
              <Link href={`/products/${product.id}/edit`}>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
