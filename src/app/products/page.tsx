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
  return <ProductsPageClient products={products} />
}
