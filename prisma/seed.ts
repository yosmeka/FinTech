import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed (minimal)...')

  // Clean existing data for a fresh minimal seed
  await prisma.product.deleteMany({})
  await prisma.fintechCompany.deleteMany({}) 
  await prisma.user.deleteMany({})

  const passwordHash = await bcrypt.hash('admin123', 12)

  // Create a single admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@fintech.com',
      name: 'Admin',
      password: passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
  })
  console.log(`✅ Created admin user: ${admin.email}`)

  // Create a single company
  const company = await prisma.fintechCompany.create({
    data: {
      name: 'Acme Fintech',
      address: '123 Finance Ave, Metropolis',
      contactPersonPhoneNumber: '+1-555-0100',
      contactAddress: 'contact@acmefintech.com',
      status: 'NEW',
      createdById: admin.id,
      updatedById: admin.id,
    },
  })
  console.log(`✅ Created company: ${company.name}`)

  // Create a single product under the company
  const product = await prisma.product.create({
    data: {
      productName: 'Acme Pay',
      productDescription: 'Simple payments product',
      strength: 'Reliable and fast',
      weakness: 'Limited international support',
      status: 'INPROGRESS',
      fintechCompanyId: company.id,
      createdById: admin.id,
      updatedById: admin.id,
    },
  })
  console.log(`✅ Created product: ${product.productName}`)

  console.log('🎉 Minimal database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
