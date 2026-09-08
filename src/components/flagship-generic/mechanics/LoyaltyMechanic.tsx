'use client'

import { useEffect, useState } from 'react'
import { MechanicModal } from './MechanicModal'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

const TIERS = [
  { name: 'Member', floor: 0 },
  { name: 'Insider', floor: 5000 },
  { name: 'VIP', floor: 15000 },
] as const

export function LoyaltyMechanic({ open, brandName, intro, onClose, storageKey }: { open: boolean; brandName: string; intro: string; onClose: () => void; storageKey: string }) {
  const { subtotal } = useFlagshipCart()
  const [lifetime, setLifetime] = useState(0)

  // Lifetime spend is simulated from this browser's own past demo orders
  // (persisted locally, not a real ledger) plus the current cart, so the
  // tier/points shown are at least internally consistent across visits.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      setLifetime(raw ? Number(raw) : 0)
    } catch { /* ignore */ }
  }, [storageKey])

  const total = lifetime + subtotal
  const points = Math.round(total * 0.1)
  const tier = [...TIERS].reverse().find(t => total >= t.floor) ?? TIERS[0]
  const next = TIERS.find(t => t.floor > total)

  return (
    <MechanicModal open={open} title="Loyalty" onClose={onClose}>
      <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{intro}</p>
      <div className="rounded-xl p-5 mb-4 text-center" style={{ background: 'var(--fg-card)' }}>
        <p className="text-[11px] uppercase tracking-[0.15em] mb-1" style={{ color: 'var(--fg-ink-dim)' }}>{brandName} — Current Tier</p>
        <p className="text-2xl font-bold mb-1" style={{ color: 'var(--fg-accent)' }}>{tier.name}</p>
        <p className="text-sm" style={{ color: 'var(--fg-ink-muted)' }}>{points.toLocaleString()} points earned</p>
      </div>
      {next && (
        <div className="mb-2">
          <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--fg-line)' }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min(100, (total / next.floor) * 100)}%`, background: 'var(--fg-accent)' }} />
          </div>
          <p className="text-xs" style={{ color: 'var(--fg-ink-dim)' }}>${(next.floor - total).toLocaleString()} more to reach {next.name}</p>
        </div>
      )}
    </MechanicModal>
  )
}
