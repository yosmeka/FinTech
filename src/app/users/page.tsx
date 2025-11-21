import { prisma } from '@/lib/prisma'
import { UsersPageClient } from './UsersPageClient'

async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      createdBy: true,
      creator: {
        select: {
          id: true,
          name: true,
          username: true,
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

  // Convert dates to strings and handle null creators for the client component
  const usersForClient = users.map(user => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    creator: user.creator || undefined,
  }))

  return <UsersPageClient users={usersForClient} />
}
