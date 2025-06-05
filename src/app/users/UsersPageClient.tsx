'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ViewToggle, ViewMode } from '@/components/ui/ViewToggle'
import { SearchBar } from '@/components/ui/SearchBar'
import { FilterSort } from '@/components/ui/FilterSort'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table'

interface User {
  id: number
  email: string
  name: string
  role: 'ADMIN'
  isActive: boolean
  createdAt: string
  updatedAt: string
  creator?: {
    id: number
    name: string
    email: string
  }
}

interface UsersPageProps {
  users: User[]
}

export function UsersPageClient({ users }: UsersPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt-desc')

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.creator?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(user => 
        statusFilter === 'active' ? user.isActive : !user.isActive
      )
    }

    // Apply sorting
    const [sortField, sortDirection] = sortBy.split('-')
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'email':
          aValue = a.email.toLowerCase()
          bValue = b.email.toLowerCase()
          break
        case 'status':
          aValue = a.isActive ? 'active' : 'inactive'
          bValue = b.isActive ? 'active' : 'inactive'
          break
        case 'createdAt':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [users, searchQuery, statusFilter, sortBy])

  const renderUserCard = (user: User) => (
    <Card key={user.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant="secondary">{user.role}</Badge>
            <Badge 
              variant={user.isActive ? "default" : "destructive"}
            >
              {user.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-gray-600">
          <div>
            <span className="font-medium">Created:</span>{' '}
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
          {user.creator && (
            <div>
              <span className="font-medium">Created by:</span>{' '}
              {user.creator.name}
            </div>
          )}
          <div>
            <span className="font-medium">Last updated:</span>{' '}
            {new Date(user.updatedAt).toLocaleDateString()}
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Link href={`/users/${user.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          <Link href={`/users/${user.id}/edit`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Edit
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  const renderUserTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredAndSortedUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant="secondary">{user.role}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={user.isActive ? "default" : "destructive"}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
            <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>{user.creator?.name || '-'}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Link href={`/users/${user.id}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
                <Link href={`/users/${user.id}/edit`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Users</h1>
          <p className="mt-2 text-gray-600">
            Manage admin users who can access the fintech management system
          </p>
        </div>
        <Link href="/users/new">
          <Button>Add New Admin User</Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <SearchBar
          placeholder="Search users by name, email, or creator..."
          onSearch={setSearchQuery}
        />
        
        <div className="flex flex-wrap gap-4 items-end">
          <FilterSort
            filters={[
              {
                label: "Status",
                value: statusFilter,
                options: [
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' }
                ],
                onChange: setStatusFilter
              }
            ]}
            sortOptions={[
              { value: 'name-asc', label: 'Name (A-Z)' },
              { value: 'name-desc', label: 'Name (Z-A)' },
              { value: 'email-asc', label: 'Email (A-Z)' },
              { value: 'email-desc', label: 'Email (Z-A)' },
              { value: 'status-asc', label: 'Status (Active First)' },
              { value: 'status-desc', label: 'Status (Inactive First)' },
              { value: 'createdAt-desc', label: 'Newest First' },
              { value: 'createdAt-asc', label: 'Oldest First' },
            ]}
            sortValue={sortBy}
            onSortChange={setSortBy}
          />
          
          <ViewToggle
            currentView={viewMode}
            onViewChange={setViewMode}
          />
        </div>
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {filteredAndSortedUsers.length} of {users.length} {users.length === 1 ? 'user' : 'users'} 
          {searchQuery && ` matching "${searchQuery}"`}
          {statusFilter && ` with status "${statusFilter}"`}
        </div>
      </div>

      {/* Users Display */}
      {filteredAndSortedUsers.length > 0 ? (
        viewMode === 'card' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedUsers.map(renderUserCard)}
          </div>
        ) : (
          renderUserTable()
        )
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || statusFilter
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Get started by creating your first admin user."
            }
          </p>
          {!searchQuery && !statusFilter && (
            <Link href="/users/new">
              <Button>Add New Admin User</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
