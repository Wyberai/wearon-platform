'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ThemeProduct } from '@/lib/flagship/types'
import type { KirayaProduct } from '@/lib/kiraya/catalog'

// KIRAYA's signature mechanic. Instead of a simple "Add to Bag", the renter
// first picks their EVENT DATE. From that one input we derive:
//   1. the rental WINDOW (delivery = event − 2 days, return = event + 2 days)
//   2. a simulated availability check against a small deterministic
//      fake-booked-dates array per product (wedding-season blackout days —
//      see KIRAYA_PRODUCTS.fakeBookedDates in lib/kiraya/catalog.ts)
//   3. once the window is free, the retail-value-vs-rental-price savings
//      framing plus a short AI-generated pickup/return reminder — reusing
//      the exact streamed-fetch pattern already used by
//      src/app/api/style-ai/route.ts's other flagship-theme callers
//      (see EmberMoodMatch.tsx), with a static fallback if the call fails.
//
// This file also exports the pure date/availability helpers and the
// rentalFieldsOf() reader, so KirayaPDP / KirayaShopGrid / KirayaCheckout /
// KirayaShell can all work off the same logic without duplicating it.

export interface RentalSelection {
  eventDate: string
  deliveryDate: string
  returnDate: string
}

/** Reads the rental-specific fields off a product, defaulting gracefully
 *  when a real seller's plain ThemeProduct (no rental extras) flows through
 *  the same generic components. */
export function rentalFieldsOf(product: ThemeProduct): { rentalPrice: number; retailValue: number; fakeBookedDates: string[] } {
  const p = product as Partial<KirayaProduct>
  return {
    rentalPrice: p.rentalPrice ?? product.price,
    retailValue: p.retailValue ?? product.originalPrice ?? Math.round(product.price * 6),
    fakeBookedDates: p.fakeBookedDates ?? [],
  }
}

export function lineKey(productId: string, size: string, color: string): string {
  return `${productId}::${size}::${color}`
}

function parseISO(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`)
}

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function addDays(iso: string, days: number): string {
  const d = parseISO(iso)
  d.setUTCDate(d.getUTCDate() + days)
  return toISO(d)
}

export function computeRentalWindow(eventDate: string): { deliveryDate: string; returnDate: string } {
  return { deliveryDate: addDays(eventDate, -2), returnDate: addDays(eventDate, 2) }
}

function enumerateDates(startIso: string, endIso: string): string[] {
  const dates: string[] = []
  let cur = parseISO(startIso)
  const end = parseISO(endIso)
  while (cur.getTime() <= end.getTime()) {
    dates.push(toISO(cur))
    cur = new Date(cur.getTime() + 24 * 60 * 60 * 1000)
  }
  return dates
}

export function checkAvailability(window: { deliveryDate: string; returnDate: string }, bookedDates: string[]): { available: boolean; conflicts: string[] } {
  const booked = new Set(bookedDates)
  const conflicts = enumerateDates(window.deliveryDate, window.returnDate).filter(d => booked.has(d))
  return { available: conflicts.length === 0, conflicts }
}

function formatDate(iso: string): string {
  return parseISO(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

const INR = (n: number) => `₹${n.toLocaleString('en-IN')}`

export function KirayaRentForDate({
  product,
  onConfirm,
  confirmLabel = 'Confirm dates & add to bag',
}: {
  product: ThemeProduct
  onConfirm: (selection: RentalSelection) => void
  confirmLabel?: string
}) {
  const { rentalPrice, retailValue, fakeBookedDates } = rentalFieldsOf(product)
  const savings = Math.max(0, retailValue - rentalPrice)
  const savingsPct = retailValue > 0 ? Math.round((savings / retailValue) * 100) : 0

  const today = useMemo(() => toISO(new Date()), [])
  const [eventDate, setEventDate] = useState('')
  const [aiMessage, setAiMessage] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const window_ = eventDate ? computeRentalWindow(eventDate) : null
  const availability = window_ ? checkAvailability(window_, fakeBookedDates) : null

  useEffect(() => {
    setConfirmed(false)
    setAiMessage('')
    if (!eventDate || !window_ || !availability?.available) return

    let cancelled = false
    setAiLoading(true)

    async function fetchReminder() {
      try {
        const res = await fetch('/api/style-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `Write a warm, concise 2-sentence reminder (no bullet points, no headings) for a customer who just booked "${product.name}" on rent for an event on ${formatDate(eventDate)}. Tell them it will be delivered by ${formatDate(window_!.deliveryDate)} and must be picked up for return by ${formatDate(window_!.returnDate)}. Friendly, reassuring tone.`,
            brand_name: 'KIRAYA',
          }),
        })
        if (!res.body) throw new Error('No stream')
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let text = ''
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          text += decoder.decode(value)
          if (!cancelled) setAiMessage(text)
        }
        if (!cancelled && !text.trim()) throw new Error('Empty response')
      } catch {
        if (!cancelled) {
          setAiMessage(
            `Your ${product.name.replace(/^The\s+/, '')} will be delivered by ${formatDate(window_!.deliveryDate)} — please keep it ready for pickup on ${formatDate(window_!.returnDate)}. Enjoy your event!`
          )
        }
      } finally {
        if (!cancelled) setAiLoading(false)
      }
    }

    fetchReminder()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventDate])

  function handleConfirm() {
    if (!window_ || !availability?.available) return
    setConfirmed(true)
    onConfirm({ eventDate, deliveryDate: window_.deliveryDate, returnDate: window_.returnDate })
  }

  return (
    <div className="rounded-xl border p-5" style={{ borderColor: 'var(--ki-line)', background: 'var(--ki-card)' }}>
      <p className="text-xs tracking-[0.15em] uppercase mb-1" style={{ color: 'var(--ki-accent)' }}>Rent for the Date</p>
      <p className="text-sm mb-4" style={{ color: 'var(--ki-ink-muted)' }}>Pick your event date — we&apos;ll work out delivery and return automatically.</p>

      <label className="block text-xs uppercase tracking-wide mb-2" style={{ color: 'var(--ki-ink-dim)' }} htmlFor={`event-date-${product.id}`}>
        Event date
      </label>
      <input
        id={`event-date-${product.id}`}
        type="date"
        min={today}
        value={eventDate}
        onChange={e => setEventDate(e.target.value)}
        className="w-full border rounded-lg px-4 py-3 text-sm bg-transparent outline-none mb-4"
        style={{ borderColor: 'var(--ki-line)', color: 'var(--ki-ink)', colorScheme: 'dark' }}
      />

      {window_ && availability && !availability.available && (
        <div className="rounded-lg px-4 py-3 mb-4 text-sm" style={{ background: 'rgba(200,80,80,0.12)', border: '1px solid rgba(200,80,80,0.35)', color: '#E8A5A0' }}>
          <p className="font-medium mb-1">This piece is already booked over that window.</p>
          <p style={{ color: 'var(--ki-ink-muted)' }}>
            It&apos;s reserved for {availability.conflicts.map(formatDate).join(', ')} — please try a different event date.
          </p>
        </div>
      )}

      {window_ && availability?.available && (
        <div className="mb-4">
          <div className="grid grid-cols-3 gap-2 text-center mb-5">
            <div className="rounded-lg py-3 px-2" style={{ background: 'var(--ki-bg)', border: '1px solid var(--ki-line)' }}>
              <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: 'var(--ki-ink-dim)' }}>Delivered by</p>
              <p className="text-sm font-medium">{formatDate(window_.deliveryDate)}</p>
            </div>
            <div className="rounded-lg py-3 px-2" style={{ background: 'var(--ki-accent)', color: 'var(--ki-accent-ink)' }}>
              <p className="text-[10px] uppercase tracking-wide mb-1 opacity-80">Your event</p>
              <p className="text-sm font-semibold">{formatDate(eventDate)}</p>
            </div>
            <div className="rounded-lg py-3 px-2" style={{ background: 'var(--ki-bg)', border: '1px solid var(--ki-line)' }}>
              <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: 'var(--ki-ink-dim)' }}>Return by</p>
              <p className="text-sm font-medium">{formatDate(window_.returnDate)}</p>
            </div>
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm" style={{ color: 'var(--ki-ink-muted)' }}>Retail value</span>
            <span className="text-sm line-through" style={{ color: 'var(--ki-ink-dim)' }}>{INR(retailValue)}</span>
          </div>
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-sm" style={{ color: 'var(--ki-ink-muted)' }}>Rental price, this event</span>
            <span className="text-lg font-semibold" style={{ color: 'var(--ki-accent)' }}>{INR(rentalPrice)}</span>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--ki-accent)' }}>
            You save {INR(savings)} ({savingsPct}%) by renting instead of buying.
          </p>

          <div className="rounded-lg px-4 py-3 mb-4 text-sm leading-relaxed min-h-[52px]" style={{ background: 'var(--ki-bg)', border: '1px solid var(--ki-line)', color: 'var(--ki-ink-muted)' }}>
            {aiMessage || (aiLoading ? 'Preparing your pickup & return reminder…' : '')}
          </div>

          <button
            onClick={handleConfirm}
            disabled={confirmed}
            className="w-full py-3.5 rounded-full text-sm tracking-wide font-medium transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: 'var(--ki-accent)', color: 'var(--ki-accent-ink)' }}
          >
            {confirmed ? 'Added to bag ✓' : confirmLabel}
          </button>
        </div>
      )}
    </div>
  )
}
