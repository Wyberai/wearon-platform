'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { FlagshipCartProvider } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'
import { BloomHeader } from './BloomHeader'
import { BloomFooter } from './BloomFooter'
import { BloomCartDrawer } from './BloomCartDrawer'

function ShellInner({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  return (
    <div className="bloom-root min-h-screen flex flex-col">
      <BloomHeader brand={brand} />
      <main className="flex-1">{children}</main>
      <BloomFooter brand={brand} />
      <BloomCartDrawer brand={brand} />

      {/* Mobile entry point — the header's nav link is desktop-only */}
      <Link
        href={`/store/${brand.slug}/quiz`}
        className="fixed bottom-5 right-5 sm:hidden z-40 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'var(--bl-accent)', color: 'var(--bl-accent-ink)', width: 52, height: 52 }}
        aria-label="Take the Style Quiz"
      >
        <span style={{ fontSize: 20 }}>✦</span>
      </Link>
    </div>
  )
}

export function BloomShell({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  return (
    <>
      {/* Scoped to this theme only — not loaded globally */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Karla:wght@400;500;600;700&display=swap" />
      <FlagshipCartProvider storageKey="bloom_cart_v1">
        <ShellInner brand={brand}>{children}</ShellInner>
      </FlagshipCartProvider>
    </>
  )
}
