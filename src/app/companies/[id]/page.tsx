import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CompanyDetailClient } from './CompanyDetailClient'

async function getCompany(id: string) {
  const company = await prisma.fintechCompany.findUnique({
    where: { id: parseInt(id) },
    include: {
      products: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!company) {
    notFound()
  }

  return company
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const company = await getCompany(id)

  // Convert dates to strings for the client component
  const companyForClient = {
    ...company,
    createdAt: company.createdAt.toISOString(),
    updatedAt: company.updatedAt.toISOString(),
    products: company.products.map(product => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    })),
  }

  return <CompanyDetailClient company={companyForClient} />
}
