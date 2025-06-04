import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { FintechCompanyWithProducts, FINTECH_STATUS_COLORS, FINTECH_STATUS_LABELS } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface CompaniesCardsProps {
  companies: FintechCompanyWithProducts[]
}

export function CompaniesCards({ companies }: CompaniesCardsProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <Card key={company.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{company.name}</CardTitle>
                <CardDescription className="mt-1">
                  {company.products.length} product{company.products.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
              <Badge className={FINTECH_STATUS_COLORS[company.status]}>
                {FINTECH_STATUS_LABELS[company.status]}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Address:</span> {company.address}</p>
              <p><span className="font-medium">Contact:</span> {company.contactPersonPhoneNumber}</p>
              <p><span className="font-medium">Created:</span> {formatDate(company.createdAt)}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <Link href={`/companies/${company.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </Link>
              <Link href={`/companies/${company.id}/edit`}>
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
