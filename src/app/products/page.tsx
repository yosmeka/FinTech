import { prisma } from '@/lib/prisma'
import { ProductsPageClient } from './ProductsPageClient'

async function getProducts() {
  return await prisma.product.findMany({
    include: {
      fintechCompany: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function ProductsPage() {
  const products = await getProducts()

  // Convert dates to strings for the client component
  const productsForClient = products.map(product => ({
    ...product,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    fintechCompany: {
      ...product.fintechCompany,
      createdAt: product.fintechCompany.createdAt.toISOString(),
      updatedAt: product.fintechCompany.updatedAt.toISOString(),
    },
  }))

  return <ProductsPageClient products={productsForClient} />
}
