'use client'

import { useState, type ReactNode } from 'react'
import { AugustCartProvider } from '@/lib/august/cart-context'
import { AugustModeProvider, useAugustMode } from '@/lib/august/mode-context'
import type { ThemeBrand } from '@/lib/august/types'
import { AugustHeader } from './AugustHeader'
import { AugustFooter } from './AugustFooter'
import { AugustCartDrawer } from './AugustCartDrawer'
import { AugustStylistDrawer } from './AugustStylistDrawer'

function ShellInner({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  const { mode } = useAugustMode()
  const [stylistOpen, setStylistOpen] = useState(false)

  return (
    <div className="august-root min-h-screen flex flex-col" data-mode={mode}>
      <AugustHeader brand={brand} onOpenStylist={() => setStylistOpen(true)} />
      <main className="flex-1">{children}</main>
      <AugustFooter brand={brand} />
      <AugustCartDrawer brand={brand} />
      <AugustStylistDrawer brand={brand} open={stylistOpen} onClose={() => setStylistOpen(false)} />

      {/* Floating stylist trigger — always reachable, primary mobile entry point */}
      <button
        onClick={() => setStylistOpen(true)}
        className="fixed bottom-5 right-5 sm:hidden z-40 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: 'var(--a-ink)', color: 'var(--a-bg)', width: 52, height: 52 }}
        aria-label={`Ask ${brand.name}`}
      >
        ✦
      </button>
    </div>
  )
}

export function AugustShell({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  return (
    <AugustModeProvider>
      <AugustCartProvider>
        <ShellInner brand={brand}>{children}</ShellInner>
      </AugustCartProvider>
    </AugustModeProvider>
  )
}
