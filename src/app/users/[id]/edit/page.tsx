import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserForm } from '@/components/forms/UserForm'

async function getUser(id: number) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      creator: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
  })
}

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idParam } = await params
  const id = parseInt(idParam)
  const user = await getUser(id)

  if (!user) {
    notFound()
  }

  // Convert dates to strings and handle null creator for the form component
  const userForForm = {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    creator: user.creator || undefined,
  }

  return <UserForm user={userForForm} mode="edit" />
}
