'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { FlagshipCartProvider } from '@/lib/flagship/cart-context'
import { flagshipCssVars } from '@/lib/flagship-generic/palette-css'
import type { FlagshipEntry } from '@/lib/flagship-generic/types'
import { GenericHeader } from './GenericHeader'
import { GenericFooter } from './GenericFooter'
import { GenericCartDrawer } from './GenericCartDrawer'
import { AiStylistMechanic } from './mechanics/AiStylistMechanic'
import { QuizMechanic } from './mechanics/QuizMechanic'
import { CountdownMechanic } from './mechanics/CountdownMechanic'
import { LoyaltyMechanic } from './mechanics/LoyaltyMechanic'

function MechanicMount({ entry, open, onClose }: { entry: FlagshipEntry; open: boolean; onClose: () => void }) {
  switch (entry.mechanic) {
    case 'stylist': return <AiStylistMechanic brand={entry.brand} products={entry.products} open={open} intro={entry.mechanicIntro} onClose={onClose} />
    case 'quiz': return <QuizMechanic products={entry.products} open={open} intro={entry.mechanicIntro} onClose={onClose} />
    case 'countdown': return <CountdownMechanic open={open} brandName={entry.brand.name} intro={entry.mechanicIntro} onClose={onClose} />
    case 'loyalty': return <LoyaltyMechanic open={open} brandName={entry.brand.name} intro={entry.mechanicIntro} onClose={onClose} storageKey={`fg_${entry.slug}_lifetime_v1`} />
  }
}

// GenericHome (rendered by src/app/store/[slug]/page.tsx, a sibling of this
// Shell under the same layout, not a child of it) needs to open the same
// mechanic modal from its hero/CTA buttons — bridged via a plain DOM event,
// same technique EmberShell/EmberHome use for OPEN_MOOD_MATCH_EVENT.
export const OPEN_GENERIC_MECHANIC_EVENT = 'flagship-generic:open-mechanic'

function ShellInner({ children, entry }: { children: ReactNode; entry: FlagshipEntry }) {
  const [mechanicOpen, setMechanicOpen] = useState(false)

  useEffect(() => {
    function handler() { setMechanicOpen(true) }
    window.addEventListener(OPEN_GENERIC_MECHANIC_EVENT, handler)
    return () => window.removeEventListener(OPEN_GENERIC_MECHANIC_EVENT, handler)
  }, [])

  return (
    <div style={flagshipCssVars(entry.palette, entry.font)} className="flex flex-col">
      <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${entry.font.replace(/ /g, '+')}:wght@400;600;800&display=swap`} />
      <GenericHeader brand={entry.brand} mechanicLabel={entry.mechanicLabel} onOpenMechanic={() => setMechanicOpen(true)} />
      <main className="flex-1">{children}</main>
      <GenericFooter brand={entry.brand} />
      <GenericCartDrawer brand={entry.brand} />
      <MechanicMount entry={entry} open={mechanicOpen} onClose={() => setMechanicOpen(false)} />
      <button
        onClick={() => setMechanicOpen(true)}
        className="fixed bottom-5 right-5 sm:hidden z-40 rounded-full flex items-center justify-center"
        style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)', width: 52, height: 52, boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
        aria-label={entry.mechanicLabel}
      >
        <span style={{ fontSize: 20 }}>✦</span>
      </button>
    </div>
  )
}

export function GenericFlagshipShell({ children, entry }: { children: ReactNode; entry: FlagshipEntry }) {
  const searchParams = useSearchParams()
  const previewView = searchParams.get('view')
  if (previewView === 'dashboard' || previewView === 'app') return <>{children}</>

  return (
    <FlagshipCartProvider storageKey={`fg_${entry.slug}_cart_v1`}>
      <ShellInner entry={entry}>{children}</ShellInner>
    </FlagshipCartProvider>
  )
}

// Exported for pages that only need the mechanic-open trigger without the
// full shell chrome (none currently, but mirrors the bespoke themes'
// pattern in case a route needs to open the mechanic on load).
export { GenericHeader, GenericFooter, GenericCartDrawer }
