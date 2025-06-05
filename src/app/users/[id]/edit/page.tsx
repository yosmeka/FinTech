import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserForm } from '@/components/forms/UserForm'

async function getUser(id: number) {
  return await prisma.user.findUnique({
    where: { id },
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
  })
}

export default async function EditUserPage({
  params,
}: {
  params: { id: string }
}) {
  const id = parseInt(params.id)
  const user = await getUser(id)

  if (!user) {
    notFound()
  }

  return <UserForm user={user} mode="edit" />
}
