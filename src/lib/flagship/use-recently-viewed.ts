'use client'

import { useEffect, useState } from 'react'
import type { ThemeProduct } from './types'

const MAX_TRACKED = 12

// Real, honest adaptive signal: tracks categories the visitor has actually
// opened this session (or a past one, via localStorage) and uses it to
// reorder a homepage's "Curated for you" rail — no fabricated ML claim,
// just a session-history heuristic that's genuinely computed client-side.
// storageKey must be unique per theme so demos don't cross-contaminate.
export function recordProductView(storageKey: string, productId: string) {
  try {
    const raw = window.localStorage.getItem(storageKey)
    const ids: string[] = raw ? JSON.parse(raw) : []
    const next = [productId, ...ids.filter(id => id !== productId)].slice(0, MAX_TRACKED)
    window.localStorage.setItem(storageKey, JSON.stringify(next))
  } catch { /* ignore */ }
}

function readViewedIds(storageKey: string): string[] {
  try {
    const raw = window.localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useCuratedForYou(storageKey: string, products: ThemeProduct[], count = 4): { products: ThemeProduct[]; personalized: boolean } {
  const fallback = products.filter(p => p.tags.includes('bestseller')).slice(0, count)
  const [state, setState] = useState<{ products: ThemeProduct[]; personalized: boolean }>({ products: fallback, personalized: false })

  useEffect(() => {
    const viewedIds = readViewedIds(storageKey)
    if (viewedIds.length === 0) return

    const viewedCategories = viewedIds
      .map(id => products.find(p => p.id === id)?.category)
      .filter((c): c is string => !!c)

    const categoryScore = new Map<string, number>()
    viewedCategories.forEach((c, i) => categoryScore.set(c, (categoryScore.get(c) ?? 0) + (viewedCategories.length - i)))

    const ranked = [...products]
      .filter(p => !viewedIds.includes(p.id))
      .sort((a, b) => (categoryScore.get(b.category) ?? 0) - (categoryScore.get(a.category) ?? 0))

    if (ranked.length > 0 && categoryScore.size > 0) {
      setState({ products: ranked.slice(0, count), personalized: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, products, count])

  return state
}
