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
    <div className="inline-flex rounded-lg border border-gray-300 bg-white shadow-sm">
      <button
        type="button"
        onClick={handleCardClick}
        className={cn(
          'inline-flex items-center justify-center rounded-l-lg font-semibold transition-all duration-200 h-10 px-4 text-sm border-r border-gray-300',
          currentView === 'card'
            ? 'bg-red-600 text-white shadow-sm'
            : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-red-600'
        )}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Cards
      </button>
      <button
        type="button"
        onClick={handleTableClick}
        className={cn(
          'inline-flex items-center justify-center rounded-r-lg font-semibold transition-all duration-200 h-10 px-4 text-sm',
          currentView === 'table'
            ? 'bg-red-600 text-white shadow-sm'
            : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-red-600'
        )}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M3 18h18M3 6h18" />
        </svg>
        Table
      </button>
    </div>
  )
}
