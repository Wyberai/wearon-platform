'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ThemeProduct } from './types'

// Cart lines are denormalized (name/image/price snapshotted at add-time)
// rather than looked up from a shared catalog — this keeps the cart fully
// decoupled from where the product list lives, so the same provider works
// for any flagship theme's demo catalog or a real seller's own Supabase
// products without the shell needing to know which catalog is active.
export interface CartLine {
  productId: string
  slug: string
  name: string
  image: string
  price: number
  size: string
  color: string
  quantity: number
}

interface CartContextValue {
  lines: CartLine[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addLine: (product: ThemeProduct, size: string, color: string, quantity?: number) => void
  removeLine: (productId: string, size: string, color: string) => void
  setQuantity: (productId: string, size: string, color: string, quantity: number) => void
  adjustQuantity: (productId: string, size: string, color: string, delta: number) => void
  clear: () => void
  count: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

function sameLine(a: CartLine, productId: string, size: string, color: string) {
  return a.productId === productId && a.size === size && a.color === color
}

// storageKey must be unique per theme (e.g. 'august_cart_v2', 'ember_cart_v1')
// so two demo storefronts on the same origin don't share a cart.
export function FlagshipCartProvider({ children, storageKey }: { children: ReactNode; storageKey: string }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (raw) setLines(JSON.parse(raw))
    } catch { /* ignore corrupt local storage */ }
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!hydrated) return
    window.localStorage.setItem(storageKey, JSON.stringify(lines))
  }, [lines, hydrated, storageKey])

  const addLine = useCallback((product: ThemeProduct, size: string, color: string, quantity = 1) => {
    setLines(prev => {
      const existing = prev.find(l => sameLine(l, product.id, size, color))
      if (existing) {
        return prev.map(l => sameLine(l, product.id, size, color) ? { ...l, quantity: l.quantity + quantity } : l)
      }
      return [...prev, { productId: product.id, slug: product.slug, name: product.name, image: product.image, price: product.price, size, color, quantity }]
    })
    setIsOpen(true)
  }, [])

  const removeLine = useCallback((productId: string, size: string, color: string) => {
    setLines(prev => prev.filter(l => !sameLine(l, productId, size, color)))
  }, [])

  const setQuantity = useCallback((productId: string, size: string, color: string, quantity: number) => {
    setLines(prev => {
      if (quantity <= 0) return prev.filter(l => !sameLine(l, productId, size, color))
      return prev.map(l => sameLine(l, productId, size, color) ? { ...l, quantity } : l)
    })
  }, [])

  // Reads the current quantity from `prev` inside the updater, not from a
  // render-time closure — so two rapid stepper clicks (both dispatched before
  // a re-render commits) each apply against the latest value in sequence,
  // instead of both computing the same target from stale render-time state.
  const adjustQuantity = useCallback((productId: string, size: string, color: string, delta: number) => {
    setLines(prev => {
      const line = prev.find(l => sameLine(l, productId, size, color))
      if (!line) return prev
      const next = line.quantity + delta
      if (next <= 0) return prev.filter(l => !sameLine(l, productId, size, color))
      return prev.map(l => sameLine(l, productId, size, color) ? { ...l, quantity: next } : l)
    })
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines])
  const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.price * l.quantity, 0), [lines])

  const value: CartContextValue = {
    lines, isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
    addLine, removeLine, setQuantity, adjustQuantity, clear, count, subtotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useFlagshipCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useFlagshipCart must be used within FlagshipCartProvider')
  return ctx
}
