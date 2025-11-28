import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CompanyForm } from '@/components/forms/CompanyForm'
import { EditPageHeader } from '@/components/EditPageHeader'

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
      <EditPageHeader 
        title="Edit Company" 
        subtitle={`Update information for ${company.name}`} 
      />

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-8 sm:p-8">
          <CompanyForm company={company} mode="edit" />
        </div>
      </div>
    </div>
  )
}