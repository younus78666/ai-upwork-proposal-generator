'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface NavLinkCompatProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  to?: string
  className?: string
  activeClassName?: string
  pendingClassName?: string
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, href, to, children, ...props }, ref) => {
    const pathname = usePathname()
    const destination = href ?? to ?? ''
    const isActive = pathname === destination || pathname.startsWith(destination + '/')

    return (
      <Link
        ref={ref}
        href={destination}
        className={cn(className, isActive && activeClassName)}
        {...props}
      >
        {children}
      </Link>
    )
  }
)

NavLink.displayName = 'NavLink'

export { NavLink }
