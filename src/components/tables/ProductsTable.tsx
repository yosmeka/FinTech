import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { ProductWithCompanyClient, PRODUCT_STATUS_LABELS } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface ProductsTableProps {
  products: ProductWithCompanyClient[]
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
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Description</TableHead>
            {/* <TableHead className="hidden xl:table-cell">Strengths</TableHead>
            <TableHead className="hidden xl:table-cell">Weaknesses</TableHead> */}
            <TableHead className="hidden sm:table-cell">Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div>
                    <Link
                      href={`/products/${product.id}`}
                      className="font-semibold text-black hover:text-red-600 transition-colors"
                    >
                      {product.productName}
                    </Link>
                    {/* <p className="text-sm text-gray-500 mt-1">
                      ID: {product.id}
                    </p> */}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Link
                  href={`/companies/${product.fintechCompany.id}`}
                  className="text-gray-700 hover:text-red-600 transition-colors font-medium"
                >
                  {product.fintechCompany.name}
                </Link>
              </TableCell>
              <TableCell>
                <span className={`table-badge ${
                  product.status === 'DONE' ? 'success' :
                  product.status === 'INPROGRESS' ? 'warning' :
                  product.status === 'PENDING' ? 'info' :
                  product.status === 'REJECTED' ? 'error' : 'info'
                }`}>
                  {PRODUCT_STATUS_LABELS[product.status]}
                </span>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="max-w-xs">
                  <p className="text-sm text-gray-900 line-clamp-2" title={product.productDescription}>
                    {product.productDescription}
                  </p>
                </div>
              </TableCell>
              {/* <TableCell className="hidden xl:table-cell">
                <div className="max-w-xs">
                  <p className="text-sm text-green-700 line-clamp-2" title={product.strength}>
                    {product.strength}
                  </p>
                </div>
              </TableCell> */}
              {/* <TableCell className="hidden xl:table-cell">
                <div className="max-w-xs">
                  <p className="text-sm text-red-700 line-clamp-2" title={product.weakness}>
                    {product.weakness}
                  </p>
                </div>
              </TableCell> */}
              <TableCell className="hidden sm:table-cell">
                <div className="text-sm">
                  <p className="text-gray-900">{formatDate(product.createdAt)}</p>
                  <p className="text-gray-500 text-xs mt-1">Created</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="table-actions">
                  <Link href={`/products/${product.id}`} className="table-action-btn primary">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </Link>
                  <Link href={`/products/${product.id}/edit`} className="table-action-btn secondary">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}