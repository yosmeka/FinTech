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
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${className}`}>
      {/* Filters */}
      {filters.map((filter, index) => (
        <div key={index} className="w-full">
          <Select
            label={filter.label}
            value={filter.value}
            onChange={filter.onChange}
            showDefaultOption={false}
            options={[
              { value: '', label: `All ${filter.label}` },
              ...filter.options
            ]}
            className="w-full"
          />
        </div>
      ))}

      {/* Sort */}
      {sortOptions.length > 0 && onSortChange && (
        <div className="w-full">
          <Select
            label="Sort by"
            value={sortValue}
            onChange={onSortChange}
            showDefaultOption={false}
            options={sortOptions}
            className="w-full"
          />
        </div>
      )}
    </div>
  )
}
