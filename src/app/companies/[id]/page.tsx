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
  params: { id: string }
}) {
  const company = await getCompany(params.id)

  return <CompanyDetailClient company={company} />
}
