import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Remove all data for a clean seed (optional, comment out if not desired)
  await prisma.product.deleteMany({})
  await prisma.fintechCompany.deleteMany({})
  await prisma.user.deleteMany({})

  // Create multiple admin users
  const adminUsersData = [
    { email: 'admin1@fintech.com', name: 'Admin One' },
    { email: 'admin2@fintech.com', name: 'Admin Two' },
    { email: 'admin3@fintech.com', name: 'Admin Three' },
    { email: 'admin4@fintech.com', name: 'Admin Four' },
    { email: 'admin5@fintech.com', name: 'Admin Five' },
  ]

  const password = await bcrypt.hash('admin123', 12)
  const admins = []
  for (const userData of adminUsersData) {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password,
        role: 'ADMIN',
        isActive: true,
      },
    })
    admins.push(user)
    console.log(`✅ Created admin user: ${user.email}`)
  }

  // For each admin, create a company and a product (created by different admins)
  for (let i = 0; i < admins.length; i++) {
    const admin = admins[i]
    // Pick a different admin as updater/creator for product
    const otherAdmin = admins[(i + 1) % admins.length]

    const company = await prisma.fintechCompany.create({
      data: {
        name: `Fintech Company ${i + 1}`,
        address: `${100 + i} Finance Ave, City ${i + 1}`,
        contactPersonPhoneNumber: `+1-555-01${i + 10}`,
        contactAddress: `contact${i + 1}@fintech.com`,
        status: i % 2 === 0 ? 'NEW' : 'ENGAGED',
        createdById: admin.id,
        updatedById: admin.id,
      },
    })
    console.log(`✅ Created company: ${company.name}`)

    // Create 2 products for each company, each by a different admin
    for (let j = 0; j < 2; j++) {
      const product = await prisma.product.create({
        data: {
          productName: `Product ${j + 1} of ${company.name}`,
          productDescription: `Description for product ${j + 1} of ${company.name}`,
          strength: `Strength ${j + 1}`,
          weakness: `Weakness ${j + 1}`,
          status: j % 2 === 0 ? 'INPROGRESS' : 'DONE',
          fintechCompanyId: company.id,
          createdById: otherAdmin.id,
          updatedById: admin.id,
        },
      })
      console.log(`✅ Created product: ${product.productName}`)
    }
  }
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
