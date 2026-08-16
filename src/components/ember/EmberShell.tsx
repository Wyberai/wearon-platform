'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { FlagshipCartProvider } from '@/lib/flagship/cart-context'
import type { ThemeBrand } from '@/lib/flagship/types'
import { EmberHeader } from './EmberHeader'
import { EmberFooter } from './EmberFooter'
import { EmberCartDrawer } from './EmberCartDrawer'
import { EmberMoodMatch } from './EmberMoodMatch'

// The homepage hero's mood chips need to open this same modal pre-selected —
// but Home and the modal are siblings under this shell, not parent/child, so
// a plain DOM CustomEvent bridges them without threading modal state through
// every route/page component in between.
export const OPEN_MOOD_MATCH_EVENT = 'ember:open-mood-match'

function ShellInner({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  const [moodOpen, setMoodOpen] = useState(false)
  const [pendingMoodKey, setPendingMoodKey] = useState<string | null>(null)

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<{ moodKey?: string }>).detail
      setPendingMoodKey(detail?.moodKey ?? null)
      setMoodOpen(true)
    }
    window.addEventListener(OPEN_MOOD_MATCH_EVENT, handler)
    return () => window.removeEventListener(OPEN_MOOD_MATCH_EVENT, handler)
  }, [])

  return (
    <div className="ember-root min-h-screen flex flex-col">
      <EmberHeader brand={brand} onOpenMoodMatch={() => { setPendingMoodKey(null); setMoodOpen(true) }} />
      <main className="flex-1">{children}</main>
      <EmberFooter brand={brand} />
      <EmberCartDrawer brand={brand} />
      <EmberMoodMatch brand={brand} open={moodOpen} initialMoodKey={pendingMoodKey} onClose={() => setMoodOpen(false)} />

      <button
        onClick={() => setMoodOpen(true)}
        className="fixed bottom-5 right-5 sm:hidden z-40 rounded-full flex items-center justify-center ember-glow"
        style={{ background: 'var(--e-accent)', color: 'var(--e-accent-ink)', width: 52, height: 52 }}
        aria-label="Mood Match"
      >
        <span style={{ fontSize: 20 }}>✦</span>
      </button>
    </div>
  )
}

export function EmberShell({ children, brand }: { children: ReactNode; brand: ThemeBrand }) {
  // Dashboard/Mobile-app preview tabs (PreviewBanner, ?view=) need the raw
  // storefront content only — skip this theme's own nav/footer chrome.
  const searchParams = useSearchParams()
  const previewView = searchParams.get('view')
  const previewName = searchParams.get('preview_name')
  const effectiveBrand = previewName ? { ...brand, name: previewName } : brand
  if (previewView === 'dashboard' || previewView === 'app') return <>{children}</>

  return (
    <>
      {/* Scoped to this theme only — not loaded globally, unlike the root
          layout's Fraunces/Inter, since Ember is the only theme using it. */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;800&display=swap" />
      <FlagshipCartProvider storageKey="ember_cart_v1">
        <ShellInner brand={effectiveBrand}>{children}</ShellInner>
      </FlagshipCartProvider>
    </>
  )
}
