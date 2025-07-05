import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CompanyForm } from '@/components/forms/CompanyForm'

async function getCompany(id: string) {
  const company = await prisma.fintechCompany.findUnique({
    where: { id: parseInt(id) },
  })

  if (!company) {
    notFound()
  }

  return company
}

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const company = await getCompany(id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Company</h1>
        <p className="mt-2 text-gray-600">
          Update {company.name} information
        </p>
      </div>

      <CompanyForm company={company} mode="edit" />
    </div>
  )
}
