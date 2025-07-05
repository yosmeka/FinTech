import { prisma } from '@/lib/prisma'
import { CompaniesPageClient } from './CompaniesPageClient'

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

  // Convert dates to strings for the client component
  const companiesForClient = companies.map(company => ({
    ...company,
    createdAt: company.createdAt.toISOString(),
    updatedAt: company.updatedAt.toISOString(),
    products: company.products.map(product => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    })),
  }))

  return <CompaniesPageClient companies={companiesForClient} />
}
