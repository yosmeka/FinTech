import Link from 'next/link'
import { UserForm } from '@/components/forms/UserForm'

export default function NewUserPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="detail-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-6">
              {/* Form Icon */}
              <div className="detail-hero-avatar bg-purple-100 text-purple-600 flex-shrink-0">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>

              {/* Form Info */}
              <div>
                <h1 className="detail-hero-title">Add New Admin User</h1>
                <p className="detail-hero-subtitle">
                  Create a new admin user account with system access permissions
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <span className="card-status-badge info">
                    New Admin User
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    Required fields marked with *
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Link href="/users" className="card-action-btn secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Users
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card-professional">
          <div className="card-header-professional">
            <h2 className="card-title-professional">User Account Information</h2>
            <p className="card-subtitle-professional">
              Enter the complete details for the new admin user account including credentials and permissions
            </p>
          </div>

          <div className="card-content-professional">
            <UserForm mode="create" />
          </div>
        </div>
      </div>
    </div>
  )
}
