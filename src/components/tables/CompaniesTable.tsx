import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'
import { FintechCompanyWithProducts, FINTECH_STATUS_COLORS, FINTECH_STATUS_LABELS } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface CompaniesTableProps {
  companies: FintechCompanyWithProducts[]
}

export function CompaniesTable({ companies }: CompaniesTableProps) {
  if (companies.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No companies yet
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by adding your first fintech company.
          </p>
          <Link href="/companies/new">
            <Button>Add Company</Button>
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
            <TableHead>Company Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Address</TableHead>
            <TableHead className="hidden lg:table-cell">Contact Phone</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="hidden sm:table-cell">Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">
                      {company.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <Link
                      href={`/companies/${company.id}`}
                      className="font-semibold text-black hover:text-red-600 transition-colors"
                    >
                      {company.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      ID: {company.id}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className={`table-badge ${
                  company.status === 'ACTIVE' ? 'success' :
                  company.status === 'INACTIVE' ? 'error' :
                  company.status === 'PENDING' ? 'warning' : 'info'
                }`}>
                  {FINTECH_STATUS_LABELS[company.status]}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="max-w-xs">
                  <p className="text-sm text-gray-900 truncate" title={company.address}>
                    {company.address}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {company.contactAddress}
                  </p>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="text-sm">
                  <p className="text-gray-900 font-medium">{company.contactPersonPhoneNumber}</p>
                  <p className="text-gray-500 text-xs mt-1">Contact Phone</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-600">
                      {company.products.length}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    product{company.products.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="text-sm">
                  <p className="text-gray-900">{formatDate(company.createdAt)}</p>
                  <p className="text-gray-500 text-xs mt-1">Created</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="table-actions">
                  <Link href={`/companies/${company.id}`} className="table-action-btn primary">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </Link>
                  <Link href={`/companies/${company.id}/edit`} className="table-action-btn secondary">
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
