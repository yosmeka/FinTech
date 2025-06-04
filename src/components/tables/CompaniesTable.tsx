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
    <Card>
      <CardContent className="p-0">
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/companies/${company.id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {company.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className={FINTECH_STATUS_COLORS[company.status]}>
                      {FINTECH_STATUS_LABELS[company.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs">
                    <div className="truncate" title={company.address}>
                      {company.address}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{company.contactPersonPhoneNumber}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {company.products.length} product{company.products.length !== 1 ? 's' : ''}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-gray-600">
                    {formatDate(company.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/companies/${company.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/companies/${company.id}/edit`}>
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
