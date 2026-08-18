'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { getOrCreateDeviceToken } from '@/lib/device-token'
import type { ThemeBrand } from '@/lib/flagship/types'
import { lineKey } from './KirayaRentForDate'
import { useKirayaRentals } from './KirayaShell'

type Step = 'bag' | 'shipping' | 'payment' | 'confirmed'

interface ShippingInfo {
  name: string
  email: string
  address: string
  city: string
  postcode: string
  country: string
}

function generateOrderNumber() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `RNT-${s}`
}

function formatShort(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
}

export function KirayaCheckout({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const isLiveSeller = !!brand.sellerId
  const { lines, subtotal, clear } = useFlagshipCart()
  const { rentals } = useKirayaRentals()
  // Cart hydrates from localStorage a tick after mount — start on 'bag' and
  // let the empty-state check below (re-evaluated every render) handle a
  // genuinely empty cart (same fix as the other flagship themes).
  const [step, setStep] = useState<Step>('bag')
  const [shipping, setShipping] = useState<ShippingInfo>({ name: '', email: '', address: '', city: '', postcode: '', country: '' })
  const [upiId, setUpiId] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  const total = subtotal

  // Latest return-by date across the bag — the date the whole order needs
  // to be handed back, used in the order summary and confirmation copy.
  const latestReturn = lines.reduce<string | null>((latest, line) => {
    const rental = rentals[lineKey(line.productId, line.size, line.color)]
    if (!rental) return latest
    return !latest || rental.returnDate > latest ? rental.returnDate : latest
  }, null)
  const earliestDelivery = lines.reduce<string | null>((earliest, line) => {
    const rental = rentals[lineKey(line.productId, line.size, line.color)]
    if (!rental) return earliest
    return !earliest || rental.deliveryDate < earliest ? rental.deliveryDate : earliest
  }, null)

  function handleShippingSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStep('payment')
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (isLiveSeller) {
      setPlacing(true)
      try {
        const res = await fetch('/api/store/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            seller_id: brand.sellerId,
            items: lines.map(l => ({ product_id: l.productId, quantity: l.quantity, size: l.size })),
            payment_method: 'cod',
            device_token: getOrCreateDeviceToken(),
            buyer_name: shipping.name,
            buyer_email: shipping.email,
            shipping_address: { name: shipping.name, line1: shipping.address, city: shipping.city, pincode: shipping.postcode, country: shipping.country },
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error ?? 'Could not place order. Please try again.')
          setPlacing(false)
          return
        }
        setOrderNumber(data.order_id ?? generateOrderNumber())
        setStep('confirmed')
        clear()
      } catch {
        setError('Could not reach the store. Please try again.')
      } finally {
        setPlacing(false)
      }
      return
    }

    setOrderNumber(generateOrderNumber())
    setStep('confirmed')
    clear()
  }

  if (lines.length === 0 && step !== 'confirmed') {
    return (
      <div className="max-w-lg mx-auto px-6 py-32 text-center">
        <p className="kiraya-display italic text-3xl mb-4">Your bag is empty</p>
        <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4" style={{ color: 'var(--ki-accent)' }}>Continue browsing</Link>
      </div>
    )
  }

  if (step === 'confirmed') {
    return (
      <div className="max-w-lg mx-auto px-6 py-28 text-center">
        <p style={{ color: 'var(--ki-accent)' }} className="text-3xl mb-5">✦</p>
        <h1 className="kiraya-display italic text-4xl mb-3">Rental confirmed</h1>
        <p className="text-sm mb-1" style={{ color: 'var(--ki-ink-muted)' }}>Order {orderNumber}</p>
        {earliestDelivery && latestReturn && (
          <p className="text-sm mt-3 font-medium" style={{ color: 'var(--ki-accent)' }}>
            Delivery by {formatShort(earliestDelivery)} · Return pickup by {formatShort(latestReturn)}
          </p>
        )}
        <p className="text-sm max-w-sm mx-auto mt-4 leading-relaxed" style={{ color: 'var(--ki-ink-muted)' }}>
          {isLiveSeller
            ? `${brand.name} will confirm your rental shortly. Paying cash on delivery.`
            : 'This is a concept storefront — no real payment was processed and no email will follow. In a live rental store, a confirmation with your delivery and return-pickup window would arrive at the address you entered.'}
        </p>
        <Link href={`/store/${slug}`} className="inline-block mt-8 px-7 py-3.5 rounded-full text-sm tracking-wide font-medium" style={{ background: 'var(--ki-accent)', color: 'var(--ki-accent-ink)' }}>
          Back to {brand.name}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 pt-10 pb-24 grid grid-cols-1 md:grid-cols-[1fr_380px] gap-12">
      <div>
        <div className="flex items-center gap-3 mb-8 text-xs tracking-[0.15em] uppercase" style={{ color: 'var(--ki-ink-dim)' }}>
          <span style={step !== 'bag' ? { color: 'var(--ki-ink)' } : {}}>Bag</span>
          <span>—</span>
          <span style={step === 'shipping' || step === 'payment' ? { color: 'var(--ki-ink)' } : {}}>Shipping</span>
          <span>—</span>
          <span style={step === 'payment' ? { color: 'var(--ki-ink)' } : {}}>Payment</span>
        </div>

        {step === 'bag' && (
          <div>
            <h1 className="kiraya-display italic text-3xl mb-6">Review your rentals</h1>
            <div className="flex flex-col gap-5 mb-8">
              {lines.map(line => {
                const rental = rentals[lineKey(line.productId, line.size, line.color)]
                return (
                  <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4 pb-5 border-b" style={{ borderColor: 'var(--ki-line)' }}>
                    <div className="w-20 h-24 rounded-lg flex-shrink-0 overflow-hidden" style={{ background: 'var(--ki-plum)' }}>
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${line.image})` }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{line.name}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--ki-ink-muted)' }}>{line.color}{line.size ? ` · ${line.size}` : ''} · Qty {line.quantity}</p>
                      {rental && (
                        <p className="text-xs mt-1" style={{ color: 'var(--ki-accent)' }}>
                          Event {formatShort(rental.eventDate)} · Delivered {formatShort(rental.deliveryDate)} · Return by {formatShort(rental.returnDate)}
                        </p>
                      )}
                    </div>
                    <p className="text-sm">₹{(line.price * line.quantity).toLocaleString('en-IN')}</p>
                  </div>
                )
              })}
            </div>
            <button onClick={() => setStep('shipping')} className="w-full py-4 rounded-full text-sm tracking-wide font-medium" style={{ background: 'var(--ki-accent)', color: 'var(--ki-accent-ink)' }}>
              Continue to Shipping
            </button>
          </div>
        )}

        {step === 'shipping' && (
          <form onSubmit={handleShippingSubmit}>
            <h1 className="kiraya-display italic text-3xl mb-6">Delivery details</h1>
            <p className="text-xs mb-5" style={{ color: 'var(--ki-ink-dim)' }}>Where should we deliver your rental before the event, and pick it back up after?</p>
            <div className="flex flex-col gap-4">
              <input required placeholder="Full name" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })}
                className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--ki-line)' }} />
              <input required type="email" placeholder="Email" value={shipping.email} onChange={e => setShipping({ ...shipping, email: e.target.value })}
                className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--ki-line)' }} />
              <input required placeholder="Address" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })}
                className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--ki-line)' }} />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="City" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })}
                  className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--ki-line)' }} />
                <input required placeholder="Postcode" value={shipping.postcode} onChange={e => setShipping({ ...shipping, postcode: e.target.value })}
                  className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--ki-line)' }} />
              </div>
              <input required placeholder="Country" value={shipping.country} onChange={e => setShipping({ ...shipping, country: e.target.value })}
                className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--ki-line)' }} />
            </div>
            <button type="submit" className="w-full py-4 rounded-full text-sm tracking-wide font-medium mt-6" style={{ background: 'var(--ki-accent)', color: 'var(--ki-accent-ink)' }}>
              Continue to Payment
            </button>
          </form>
        )}

        {step === 'payment' && (
          <form onSubmit={handlePlaceOrder}>
            <h1 className="kiraya-display italic text-3xl mb-2">Payment</h1>
            <p className="text-xs mb-6" style={{ color: 'var(--ki-ink-dim)' }}>
              {isLiveSeller ? 'Cash on delivery — pay when your rental arrives.' : 'Concept storefront — this form does not process a real payment.'}
            </p>
            {!isLiveSeller && (
              <div className="flex flex-col gap-4 mb-2">
                <label className="text-xs uppercase tracking-wide" style={{ color: 'var(--ki-ink-dim)' }}>Enter UPI ID</label>
                <input
                  required
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none"
                  style={{ borderColor: 'var(--ki-line)' }}
                />
              </div>
            )}
            {error && <p className="text-xs mb-4" style={{ color: '#E8A5A0' }}>{error}</p>}
            <button type="submit" disabled={placing} className="w-full py-4 rounded-full text-sm tracking-wide font-medium mt-4 disabled:opacity-60" style={{ background: 'var(--ki-accent)', color: 'var(--ki-accent-ink)' }}>
              {placing ? 'Placing order…' : isLiveSeller ? `Place Order · ₹${total.toLocaleString('en-IN')}` : `Pay via UPI · ₹${total.toLocaleString('en-IN')}`}
            </button>
          </form>
        )}
      </div>

      <aside className="rounded-xl border p-6 h-fit" style={{ borderColor: 'var(--ki-line)' }}>
        <p className="text-sm tracking-wide uppercase mb-5" style={{ color: 'var(--ki-ink-dim)' }}>Order Summary</p>
        <div className="flex flex-col gap-2 text-sm mb-4">
          <div className="flex justify-between"><span style={{ color: 'var(--ki-ink-muted)' }}>Rental Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span style={{ color: 'var(--ki-ink-muted)' }}>Delivery &amp; Return Pickup</span><span>Free</span></div>
        </div>
        {earliestDelivery && latestReturn && (
          <div className="text-xs mb-4 pb-4 border-b" style={{ color: 'var(--ki-accent)', borderColor: 'var(--ki-line)' }}>
            Delivered by {formatShort(earliestDelivery)} · Return pickup by {formatShort(latestReturn)}
          </div>
        )}
        <div className="flex justify-between text-base pt-4 border-t" style={{ borderColor: 'var(--ki-line)' }}>
          <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
        </div>
      </aside>
    </div>
  )
}
