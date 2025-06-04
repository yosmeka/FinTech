import { CompanyForm } from '@/components/forms/CompanyForm'

export default function NewCompanyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Company</h1>
        <p className="mt-2 text-gray-600">
          Create a new fintech company profile
        </p>
      </div>

      <CompanyForm mode="create" />
    </div>
  )
}
