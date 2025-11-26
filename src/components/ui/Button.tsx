import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none shadow-sm hover:shadow-md hover:-translate-y-0.5',
          {
            'bg-red-600 text-white hover:bg-red-700': variant === 'primary',
            'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-red-600 hover:text-red-600': variant === 'secondary',
            'border-2 border-red-600 bg-transparent text-red-600 hover:bg-red-600 hover:text-white': variant === 'outline',
            'text-gray-600 hover:bg-gray-100 hover:text-red-600': variant === 'ghost',
            'bg-rose-600 text-white hover:bg-rose-700': variant === 'danger',
          },
          {
            'h-8 px-4 text-xs': size === 'sm',
            'h-10 px-6 py-2 text-sm': size === 'md',
            'h-12 px-8 text-base': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
