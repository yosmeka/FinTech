import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'secondary' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider border',
        {
          'bg-red-100 text-red-800 border-red-200': variant === 'default',
          'bg-green-100 text-green-800 border-green-200': variant === 'success',
          'bg-yellow-100 text-yellow-800 border-yellow-200': variant === 'warning',
          'bg-red-100 text-red-800 border-red-200': variant === 'danger',
          'bg-gray-100 text-gray-800 border-gray-200': variant === 'secondary',
          'border-2 border-red-600 text-red-600 bg-transparent': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}
