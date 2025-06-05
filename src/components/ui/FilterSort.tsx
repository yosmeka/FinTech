'use client'

import { Select } from './Select'

export interface FilterOption {
  value: string
  label: string
}

export interface SortOption {
  value: string
  label: string
}

interface FilterSortProps {
  filters?: {
    label: string
    value: string
    options: FilterOption[]
    onChange: (value: string) => void
  }[]
  sortOptions?: SortOption[]
  sortValue?: string
  onSortChange?: (value: string) => void
  className?: string
}

export function FilterSort({ 
  filters = [], 
  sortOptions = [], 
  sortValue = '', 
  onSortChange,
  className = ""
}: FilterSortProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {/* Filters */}
      {filters.map((filter, index) => (
        <div key={index} className="min-w-[200px]">
          <Select
            label={filter.label}
            value={filter.value}
            onChange={filter.onChange}
            showDefaultOption={false}
            options={[
              { value: '', label: `All ${filter.label}` },
              ...filter.options
            ]}
          />
        </div>
      ))}
      
      {/* Sort */}
      {sortOptions.length > 0 && onSortChange && (
        <div className="min-w-[200px]">
          <Select
            label="Sort by"
            value={sortValue}
            onChange={onSortChange}
            showDefaultOption={false}
            options={sortOptions}
          />
        </div>
      )}
    </div>
  )
}
