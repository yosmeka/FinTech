import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FINTECH_STATUS_COLORS, FINTECH_STATUS_LABELS } from '@/lib/types'
import { formatDate } from '@/lib/utils'

async function getCompanies() {
  return await prisma.fintechCompany.findMany({
    include: {
      products: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function CompaniesPage() {
  const companies = await getCompanies()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="mt-2 text-gray-600">
            Manage your fintech companies
          </p>
        </div>
        <Link href="/companies/new">
          <Button>Add Company</Button>
        </Link>
      </div>

      {companies.length === 0 ? (
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
      ) : (
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
      )}
    </div>
  )
}
