'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { getOrCreateDeviceToken } from '@/lib/device-token'
import type { ThemeBrand } from '@/lib/flagship/types'

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
  return `GA-${s}`
}

export function GalliCheckout({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const isLiveSeller = !!brand.sellerId
  const { lines, subtotal, clear } = useFlagshipCart()
  // Cart hydrates from localStorage a tick after mount — start on 'bag' and
  // let the empty-state check below (re-evaluated every render) handle a
  // genuinely empty cart (see January's identical fix, reused across every
  // flagship theme's checkout).
  const [step, setStep] = useState<Step>('bag')
  const [shipping, setShipping] = useState<ShippingInfo>({ name: '', email: '', address: '', city: '', postcode: '', country: 'India' })
  const [upiId, setUpiId] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')

  const total = subtotal

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
        <p className="galli-display text-3xl mb-4">Bag&apos;s Empty</p>
        <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4" style={{ color: 'var(--g-accent)' }}>Go find the drop</Link>
      </div>
    )
  }

  if (step === 'confirmed') {
    return (
      <div className="max-w-lg mx-auto px-6 py-28 text-center">
        <p style={{ color: 'var(--g-accent)' }} className="text-3xl mb-5">⚡</p>
        <h1 className="galli-display text-4xl mb-3">Order Locked In</h1>
        <p className="text-sm mb-1" style={{ color: 'var(--g-ink-muted)' }}>Order {orderNumber}</p>
        <p className="text-sm max-w-sm mx-auto mt-4 leading-relaxed" style={{ color: 'var(--g-ink-muted)' }}>
          {isLiveSeller
            ? `${brand.name} will confirm your order shortly. Paying cash on delivery.`
            : 'This is a concept storefront — no real payment was processed and no email will follow. In a live store, a confirmation would land in your inbox.'}
        </p>
        <Link href={`/store/${slug}`} className="inline-block mt-8 px-7 py-3.5 rounded-full text-sm tracking-wide uppercase font-semibold" style={{ background: 'var(--g-accent)', color: 'var(--g-accent-ink)' }}>
          Back to {brand.name}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 pt-10 pb-24 grid grid-cols-1 md:grid-cols-[1fr_380px] gap-12">
      <div>
        <div className="flex items-center gap-3 mb-8 text-xs tracking-[0.15em] uppercase" style={{ color: 'var(--g-ink-dim)' }}>
          <span style={step !== 'bag' ? { color: 'var(--g-ink)' } : {}}>Bag</span>
          <span>—</span>
          <span style={step === 'shipping' || step === 'payment' ? { color: 'var(--g-ink)' } : {}}>Shipping</span>
          <span>—</span>
          <span style={step === 'payment' ? { color: 'var(--g-ink)' } : {}}>Payment</span>
        </div>

        {step === 'bag' && (
          <div>
            <h1 className="galli-display text-3xl mb-6">Review Your Bag</h1>
            <div className="flex flex-col gap-5 mb-8">
              {lines.map(line => (
                <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4 pb-5 border-b" style={{ borderColor: 'var(--g-line)' }}>
                  <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--g-card)' }}>
                    <img
                      src={line.image}
                      alt={line.name}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{line.name}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--g-ink-muted)' }}>{line.color}{line.size ? ` · ${line.size}` : ''} · Qty {line.quantity}</p>
                  </div>
                  <p className="text-sm">₹{(line.price * line.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setStep('shipping')} className="w-full py-4 rounded-full text-sm tracking-wide uppercase font-semibold" style={{ background: 'var(--g-accent)', color: 'var(--g-accent-ink)' }}>
              Continue to Shipping
            </button>
          </div>
        )}

        {step === 'shipping' && (
          <form onSubmit={handleShippingSubmit}>
            <h1 className="galli-display text-3xl mb-6">Shipping Details</h1>
            <div className="flex flex-col gap-4">
              <input required placeholder="Full name" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })}
                className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--g-line)' }} />
              <input required type="email" placeholder="Email" value={shipping.email} onChange={e => setShipping({ ...shipping, email: e.target.value })}
                className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--g-line)' }} />
              <input required placeholder="Address" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })}
                className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--g-line)' }} />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="City" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })}
                  className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--g-line)' }} />
                <input required placeholder="Pincode" value={shipping.postcode} onChange={e => setShipping({ ...shipping, postcode: e.target.value })}
                  className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--g-line)' }} />
              </div>
              <input required placeholder="Country" value={shipping.country} onChange={e => setShipping({ ...shipping, country: e.target.value })}
                className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--g-line)' }} />
            </div>
            <button type="submit" className="w-full py-4 rounded-full text-sm tracking-wide uppercase font-semibold mt-6" style={{ background: 'var(--g-accent)', color: 'var(--g-accent-ink)' }}>
              Continue to Payment
            </button>
          </form>
        )}

        {step === 'payment' && (
          <form onSubmit={handlePlaceOrder}>
            <h1 className="galli-display text-3xl mb-2">Payment</h1>
            <p className="text-xs mb-6" style={{ color: 'var(--g-ink-dim)' }}>
              {isLiveSeller ? 'Cash on delivery — pay when your order arrives.' : 'Concept storefront — this form does not process a real payment.'}
            </p>
            {!isLiveSeller && (
              <div className="flex flex-col gap-3 mb-2">
                <label className="text-xs tracking-wide uppercase" style={{ color: 'var(--g-ink-dim)' }}>Enter UPI ID</label>
                <input
                  required
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none"
                  style={{ borderColor: 'var(--g-line)' }}
                />
              </div>
            )}
            {error && <p className="text-xs mb-4" style={{ color: 'var(--g-accent2)' }}>{error}</p>}
            <button
              type="submit"
              disabled={placing}
              className="w-full py-4 rounded-full text-sm tracking-wide uppercase font-semibold mt-4 disabled:opacity-60"
              style={{ background: 'var(--g-accent)', color: 'var(--g-accent-ink)' }}
            >
              {placing ? 'Placing order…' : isLiveSeller ? `Place Order · ₹${total.toLocaleString('en-IN')}` : `Pay via UPI · ₹${total.toLocaleString('en-IN')}`}
            </button>
          </form>
        )}
      </div>

      <aside className="rounded-lg border p-6 h-fit" style={{ borderColor: 'var(--g-line)' }}>
        <p className="text-sm tracking-wide uppercase mb-5" style={{ color: 'var(--g-ink-dim)' }}>Order Summary</p>
        <div className="flex flex-col gap-2 text-sm mb-4">
          <div className="flex justify-between"><span style={{ color: 'var(--g-ink-muted)' }}>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span style={{ color: 'var(--g-ink-muted)' }}>Shipping</span><span>Free</span></div>
        </div>
        <div className="flex justify-between text-base pt-4 border-t" style={{ borderColor: 'var(--g-line)' }}>
          <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
        </div>
      </aside>
    </div>
  )
}
