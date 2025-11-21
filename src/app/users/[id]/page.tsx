import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

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
      companiesCreated: {
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      },
      productsCreated: {
        select: {
          id: true,
          productName: true,
          status: true,
          createdAt: true,
          fintechCompany: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
      },
      createdUsers: {
        select: {
          id: true,
          name: true,
          username: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })
}

export default async function UserDetailPage({
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <p className="mt-2 text-gray-600">{user.username}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/users/${user.id}/edit`}>
            <Button variant="outline">Edit User</Button>
          </Link>
          <Link href="/users">
            <Button variant="outline">Back to Users</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="font-medium text-gray-700">Role:</span>
                <Badge variant="secondary" className="ml-2">{user.role}</Badge>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <Badge
                  variant={user.isActive ? "default" : "danger"}
                  className="ml-2"
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <span className="font-medium text-gray-700">Created:</span>
                <p className="text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              {user.creator && (
                <div>
                  <span className="font-medium text-gray-700">Created by:</span>
                  <p className="text-gray-600">{user.creator.name}</p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Last updated:</span>
                <p className="text-gray-600">{new Date(user.updatedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Users Created */}
          {user.createdUsers.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Users Created</CardTitle>
                <CardDescription>
                  Admin users created by {user.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.createdUsers.map((createdUser) => (
                    <div key={createdUser.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{createdUser.name}</p>
                        <p className="text-sm text-gray-600">{createdUser.username}</p>
                      </div>
                      <Badge variant={createdUser.isActive ? "default" : "danger"}>
                        {createdUser.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Activity */}
        <div className="lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Companies Created */}
            <Card>
              <CardHeader>
                <CardTitle>Companies Created</CardTitle>
                <CardDescription>
                  Recent companies created by {user.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.companiesCreated.length > 0 ? (
                  <div className="space-y-3">
                    {user.companiesCreated.map((company) => (
                      <div key={company.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                        <Link href={`/companies/${company.id}`} className="hover:text-blue-600">
                          <p className="font-medium">{company.name}</p>
                        </Link>
                        <div className="flex justify-between items-center mt-1">
                          <Badge variant="outline">{company.status}</Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(company.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No companies created yet</p>
                )}
              </CardContent>
            </Card>

            {/* Products Created */}
            <Card>
              <CardHeader>
                <CardTitle>Products Created</CardTitle>
                <CardDescription>
                  Recent products created by {user.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.productsCreated.length > 0 ? (
                  <div className="space-y-3">
                    {user.productsCreated.map((product) => (
                      <div key={product.id} className="border-b border-gray-200 pb-2 last:border-b-0">
                        <Link href={`/products/${product.id}`} className="hover:text-blue-600">
                          <p className="font-medium">{product.productName}</p>
                        </Link>
                        <p className="text-sm text-gray-600">{product.fintechCompany.name}</p>
                        <div className="flex justify-between items-center mt-1">
                          <Badge variant="outline">{product.status}</Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No products created yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
