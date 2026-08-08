'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLink {
  href: string
  label: string
  icon: string
}

interface AdminNavProps {
  links: NavLink[]
  primaryColor?: string
}

export function AdminNav({ links, primaryColor = '#ec4899' }: AdminNavProps) {
  const pathname = usePathname()

  return (
    <nav className="flex-1 p-4 space-y-1">
      {links.map(({ href, label, icon }) => {
        const isActive = pathname === href || (href !== `/admin/${href.split('/')[2]}` && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
            style={isActive
              ? { backgroundColor: `${primaryColor}15`, color: primaryColor, fontWeight: 600 }
              : { color: '#4b5563' }
            }
          >
            <span>{icon}</span>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
