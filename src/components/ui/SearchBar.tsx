'use client'

import { useState, useEffect } from 'react'
import { Input } from './Input'

interface SearchBarProps {
  placeholder?: string
  query?: string
  onQueryChange?: (query: string) => void
  onSearch?: (query: string) => void
  debounceMs?: number
  className?: string
}

export function SearchBar({
  placeholder = "Search...",
  query: externalQuery,
  onQueryChange,
  onSearch,
  debounceMs = 300,
  className = ""
}: SearchBarProps) {
  const [internalQuery, setInternalQuery] = useState('')

  // Use external query if provided, otherwise use internal state
  const query = externalQuery !== undefined ? externalQuery : internalQuery
  const setQuery = onQueryChange || setInternalQuery

  useEffect(() => {
    if (onSearch) {
      const timer = setTimeout(() => {
        onSearch(query)
      }, debounceMs)

      return () => clearTimeout(timer)
    }
  }, [query, onSearch, debounceMs])

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-12 pr-12 h-12 rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute inset-y-0 right-0 pr-4 flex items-center group"
        >
          <svg
            className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
