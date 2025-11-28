import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/forms/ProductForm'
import { EditPageHeader } from '@/components/EditPageHeader'

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
      <EditPageHeader 
        title="Edit Product" 
        subtitle={`Update information for ${product.productName}`} 
      />

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-8 sm:p-8">
          <ProductForm product={product} mode="edit" />
        </div>
      </div>
    </div>
  )
}