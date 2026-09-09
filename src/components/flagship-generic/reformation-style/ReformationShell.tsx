'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { FlagshipCartProvider } from '@/lib/flagship/cart-context'
import { flagshipCssVars } from '@/lib/flagship-generic/palette-css'
import type { FlagshipEntry } from '@/lib/flagship-generic/types'
import { ReformationHeader } from './ReformationHeader'
import { GenericFooter, GenericCartDrawer } from '@/components/flagship-generic/GenericShell'
import { AiStylistMechanic } from '@/components/flagship-generic/mechanics/AiStylistMechanic'
import { QuizMechanic } from '@/components/flagship-generic/mechanics/QuizMechanic'
import { CountdownMechanic } from '@/components/flagship-generic/mechanics/CountdownMechanic'
import { LoyaltyMechanic } from '@/components/flagship-generic/mechanics/LoyaltyMechanic'

function MechanicMount({ entry, open, onClose }: { entry: FlagshipEntry; open: boolean; onClose: () => void }) {
  switch (entry.mechanic) {
    case 'stylist': return <AiStylistMechanic brand={entry.brand} products={entry.products} open={open} intro={entry.mechanicIntro} onClose={onClose} />
    case 'quiz': return <QuizMechanic products={entry.products} open={open} intro={entry.mechanicIntro} onClose={onClose} />
    case 'countdown': return <CountdownMechanic open={open} brandName={entry.brand.name} intro={entry.mechanicIntro} onClose={onClose} />
    case 'loyalty': return <LoyaltyMechanic open={open} brandName={entry.brand.name} intro={entry.mechanicIntro} onClose={onClose} storageKey={`fg_${entry.slug}_lifetime_v1`} />
  }
}

export const OPEN_REFORMATION_MECHANIC_EVENT = 'flagship-reformation:open-mechanic'

function ShellInner({ children, entry }: { children: ReactNode; entry: FlagshipEntry }) {
  const [mechanicOpen, setMechanicOpen] = useState(false)

  useEffect(() => {
    function handler() { setMechanicOpen(true) }
    window.addEventListener(OPEN_REFORMATION_MECHANIC_EVENT, handler)
    return () => window.removeEventListener(OPEN_REFORMATION_MECHANIC_EVENT, handler)
  }, [])

  return (
    <div style={flagshipCssVars(entry.palette, entry.font)} className="flex flex-col">
      <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${entry.font.replace(/ /g, '+')}:wght@400;500;600;800&display=swap`} />
      <ReformationHeader brand={entry.brand} categories={entry.brand.categories} mechanicLabel={entry.mechanicLabel} onOpenMechanic={() => setMechanicOpen(true)} />
      <main className="flex-1">{children}</main>
      <GenericFooter brand={entry.brand} />
      <GenericCartDrawer brand={entry.brand} />
      <MechanicMount entry={entry} open={mechanicOpen} onClose={() => setMechanicOpen(false)} />
    </div>
  )
}

export function ReformationShell({ children, entry }: { children: ReactNode; entry: FlagshipEntry }) {
  const searchParams = useSearchParams()
  const previewView = searchParams.get('view')
  if (previewView === 'dashboard' || previewView === 'app') return <>{children}</>

  return (
    <FlagshipCartProvider storageKey={`fg_${entry.slug}_cart_v1`}>
      <ShellInner entry={entry}>{children}</ShellInner>
    </FlagshipCartProvider>
  )
}
