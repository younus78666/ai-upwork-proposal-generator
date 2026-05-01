'use client'
import { usePathname } from 'next/navigation'
import { SiteHeader } from './SiteHeader'

export function SiteHeaderWrapper() {
  const pathname = usePathname()
  if (pathname.startsWith('/dashboard')) return null
  return <SiteHeader />
}
