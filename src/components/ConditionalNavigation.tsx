'use client'

import { usePathname } from 'next/navigation'
import { Navigation } from './Navigation'

// Routes where navigation should NOT be shown
const noNavigationRoutes = [
  '/',
  '/login',
]

export function ConditionalNavigation() {
  const pathname = usePathname()
  
  // Check if current route should show navigation
  const shouldShowNavigation = !noNavigationRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  if (!shouldShowNavigation) {
    return null
  }

  return <Navigation />
}
