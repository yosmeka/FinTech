import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/forms/ProductForm'

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      fintechCompany: true,
    },
  })

  if (!product) {
    notFound()
  }

  return product
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-2 text-gray-600">
          Update {product.productName} information
        </p>
      </div>

      <ProductForm product={product} mode="edit" />
    </div>
  )
}
