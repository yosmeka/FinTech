import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { UserForm } from '@/components/forms/UserForm'
import { EditPageHeader } from '@/components/EditPageHeader'

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <EditPageHeader 
        title="Edit User" 
        subtitle={`Update information for ${user.name}`} 
      />

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-8 sm:p-8">
          <UserForm user={userForForm} mode="edit" />
        </div>
      </div>
    </div>
  )
}