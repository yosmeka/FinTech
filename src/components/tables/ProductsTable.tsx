import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { Product, FintechCompany, PRODUCT_STATUS_COLORS, PRODUCT_STATUS_LABELS } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface ProductWithCompany extends Product {
  fintechCompany: FintechCompany
}

interface ProductsTableProps {
  products: ProductWithCompany[]
}

export function ProductsTable({ products }: ProductsTableProps) {
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
    <Card>
      <CardContent className="p-0">
        <div className="table-container">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Description</TableHead>
                <TableHead className="hidden xl:table-cell">Strengths</TableHead>
                <TableHead className="hidden xl:table-cell">Weaknesses</TableHead>
                <TableHead className="hidden sm:table-cell">Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {product.productName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/companies/${product.fintechCompany.id}`}
                      className="text-gray-600 hover:text-gray-800 hover:underline"
                    >
                      {product.fintechCompany.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className={PRODUCT_STATUS_COLORS[product.status]}>
                      {PRODUCT_STATUS_LABELS[product.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell max-w-xs">
                    <div className="truncate" title={product.productDescription}>
                      {product.productDescription}
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell max-w-xs">
                    <div className="truncate" title={product.strength}>
                      {product.strength}
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell max-w-xs">
                    <div className="truncate" title={product.weakness}>
                      {product.weakness}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-600">
                    {formatDate(product.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/products/${product.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
