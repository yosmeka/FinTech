import { prisma } from '@/lib/prisma'
import { UsersPageClient } from './UsersPageClient'

async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export default async function UsersPage() {
  const users = await getUsers()
  return <UsersPageClient users={users} />
}
