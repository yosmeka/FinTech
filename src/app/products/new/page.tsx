import { ProductForm } from '@/components/forms/ProductForm'

export default function NewProductPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-2 text-gray-600">
          Create a new product for a fintech company
        </p>
      </div>

      <ProductForm mode="create" />
    </div>
  )
}
