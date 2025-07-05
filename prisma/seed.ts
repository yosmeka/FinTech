import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { email: 'admin@fintech.com' }
  })

  if (existingAdmin) {
    console.log('✅ Admin user already exists, skipping seed')
    return
  }

  // Create initial admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@fintech.com',
      name: 'System Administrator',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log('✅ Created admin user:', admin.email)

  // Create sample fintech company
  const company = await prisma.fintechCompany.create({
    data: {
      name: 'Sample Fintech Company',
      address: '123 Finance Street, Tech City',
      contactPersonPhoneNumber: '+1-555-0123',
      contactAddress: 'contact@samplefintech.com',
      status: 'NEW',
      createdById: admin.id,
      updatedById: admin.id,
    },
  })

  console.log('✅ Created sample company:', company.name)

  // Create sample product
  const product = await prisma.product.create({
    data: {
      productName: 'Digital Payment Solution',
      productDescription: 'A comprehensive digital payment platform for businesses',
      strength: 'Fast transactions, secure, user-friendly interface',
      weakness: 'Limited international coverage',
      status: 'INPROGRESS',
      fintechCompanyId: company.id,
      createdById: admin.id,
      updatedById: admin.id,
    },
  })

  console.log('✅ Created sample product:', product.productName)
  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
