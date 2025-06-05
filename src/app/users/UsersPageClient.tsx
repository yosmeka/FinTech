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
    <div key={user.id} className="card-professional">
      {/* Card Header */}
      <div className="card-header-professional">
        <div className="card-avatar user">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="card-status-container">
          <div>
            <h3 className="card-title-professional">{user.name}</h3>
            <p className="card-subtitle-professional">{user.email}</p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="card-status-badge info">
              {user.role}
            </span>
            <span className={`card-status-badge ${user.isActive ? 'success' : 'error'}`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="card-content-professional">
        {/* Information Grid */}
        <div className="card-info-grid">
          <div className="card-info-item">
            <svg className="card-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <div className="card-info-content">
              <div className="card-info-label">User ID</div>
              <div className="card-info-value">{user.id}</div>
            </div>
          </div>

          <div className="card-info-item">
            <svg className="card-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 6v6m-4-6h8m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            <div className="card-info-content">
              <div className="card-info-label">Created</div>
              <div className="card-info-value">{new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          {user.creator && (
            <div className="card-info-item">
              <svg className="card-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div className="card-info-content">
                <div className="card-info-label">Created by</div>
                <div className="card-info-value">{user.creator.name}</div>
              </div>
            </div>
          )}

          <div className="card-info-item">
            <svg className="card-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="card-info-content">
              <div className="card-info-label">Last updated</div>
              <div className="card-info-value">{new Date(user.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="card-actions">
        <Link href={`/users/${user.id}`} className="card-action-btn primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View Details
        </Link>
        <Link href={`/users/${user.id}/edit`} className="card-action-btn secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </Link>
      </div>
    </div>
  )

  const renderUserTable = () => (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Created</TableHead>
            <TableHead className="hidden md:table-cell">Created By</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <Link
                      href={`/users/${user.id}`}
                      className="font-semibold text-black hover:text-red-600 transition-colors"
                    >
                      {user.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {user.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="table-badge info">
                  {user.role}
                </span>
              </TableCell>
              <TableCell>
                <span className={`table-badge ${user.isActive ? 'success' : 'error'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="text-sm">
                  <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                  <p className="text-gray-500 text-xs mt-1">Created</p>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="text-sm">
                  <p className="text-gray-900">{user.creator?.name || '-'}</p>
                  <p className="text-gray-500 text-xs mt-1">Creator</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="table-actions">
                  <Link href={`/users/${user.id}`} className="table-action-btn primary">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </Link>
                  <Link href={`/users/${user.id}/edit`} className="table-action-btn secondary">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
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
          <div className="cards-grid">
            {filteredAndSortedUsers.map(renderUserCard)}
          </div>
        ) : (
          renderUserTable()
        )
      ) : (
        <div className="card-professional">
          <div className="card-content-professional text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-black mb-3">No users found</h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              {searchQuery || statusFilter
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Get started by creating your first admin user to manage the system."
              }
            </p>
            {!searchQuery && !statusFilter && (
              <Link href="/users/new" className="card-action-btn primary inline-flex">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Admin User
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
