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
  return <CompaniesPageClient companies={companies} />
}
