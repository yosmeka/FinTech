'use client'

import { Button } from './Button'
import { cn } from '@/lib/utils'

export type ViewMode = 'card' | 'table'

interface ViewToggleProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  const handleCardClick = () => {
    console.log('Card button clicked')
    onViewChange('card')
  }

  const handleTableClick = () => {
    console.log('Table button clicked')
    onViewChange('table')
  }

  return (
    <div className="flex items-center border border-gray-300 rounded-md p-1 bg-white">
      <button
        type="button"
        onClick={handleCardClick}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors h-8 px-3 text-xs',
          currentView === 'card'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        )}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Cards
      </button>
      <button
        type="button"
        onClick={handleTableClick}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors h-8 px-3 text-xs ml-1',
          currentView === 'table'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        )}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Table
      </button>
    </div>
  )
}
