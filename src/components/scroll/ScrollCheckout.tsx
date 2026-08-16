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
  return `ORD-${s}`
}

// Same bag → shipping → payment → confirmed step flow as every other
// flagship theme's checkout (see BloomCheckout). The one deliberate
// difference: the demo (non-live-seller) payment step replaces the Western
// card-number fields with a UPI-style flow, matching the Indian-context
// pivot — a single UPI ID input and a "Pay via UPI" button. The live-seller
// COD copy is untouched, it already fits this market.
export function ScrollCheckout({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const isLiveSeller = !!brand.sellerId
  const { lines, subtotal, clear } = useFlagshipCart()
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
        <p className="scroll-display text-2xl font-extrabold mb-3">Your bag is empty</p>
        <Link href={`/store/${slug}/shop`} className="text-sm font-semibold scroll-gradient-text">Continue browsing</Link>
      </div>
    )
  }

  if (step === 'confirmed') {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <p className="text-3xl mb-4 scroll-gradient-text">✓</p>
        <h1 className="scroll-display text-3xl font-extrabold mb-2.5">Order placed</h1>
        <p className="text-sm mb-1" style={{ color: 'var(--sc-ink-muted)' }}>Order {orderNumber}</p>
        <p className="text-sm max-w-sm mx-auto mt-4 leading-relaxed" style={{ color: 'var(--sc-ink-muted)' }}>
          {isLiveSeller
            ? `${brand.name} will confirm your order shortly. Paying cash on delivery.`
            : 'This is a concept storefront — no real payment was processed and no email will follow. In a live store, a confirmation would arrive at the address you entered.'}
        </p>
        <Link href={`/store/${slug}`} className="inline-block mt-8 px-7 py-3.5 rounded-full text-sm font-bold scroll-gradient" style={{ color: 'var(--sc-accent-ink)' }}>
          Back to {brand.name}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 pt-8 pb-20 grid grid-cols-1 md:grid-cols-[1fr_340px] gap-10">
      <div>
        <div className="flex items-center gap-2.5 mb-7 text-[11px] font-semibold tracking-wide uppercase" style={{ color: 'var(--sc-ink-dim)' }}>
          <span style={step !== 'bag' ? { color: 'var(--sc-ink)' } : {}}>Bag</span>
          <span>—</span>
          <span style={step === 'shipping' || step === 'payment' ? { color: 'var(--sc-ink)' } : {}}>Shipping</span>
          <span>—</span>
          <span style={step === 'payment' ? { color: 'var(--sc-ink)' } : {}}>Payment</span>
        </div>

        {step === 'bag' && (
          <div>
            <h1 className="scroll-display text-2xl font-extrabold mb-5">Review your bag</h1>
            <div className="flex flex-col gap-4 mb-7">
              {lines.map(line => (
                <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-3.5 pb-4 border-b" style={{ borderColor: 'var(--sc-line)' }}>
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'var(--sc-card)' }}>
                    <img
                      src={line.image}
                      alt={line.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.currentTarget.style.display = 'none' }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{line.name}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--sc-ink-muted)' }}>{line.color}{line.size ? ` · ${line.size}` : ''} · Qty {line.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">₹{(line.price * line.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setStep('shipping')} className="w-full py-3.5 rounded-full text-sm font-bold scroll-gradient" style={{ color: 'var(--sc-accent-ink)' }}>
              Continue to Shipping
            </button>
          </div>
        )}

        {step === 'shipping' && (
          <form onSubmit={handleShippingSubmit}>
            <h1 className="scroll-display text-2xl font-extrabold mb-5">Shipping details</h1>
            <div className="flex flex-col gap-3.5">
              <input required placeholder="Full name" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })}
                className="border rounded-xl px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--sc-line)' }} />
              <input required type="email" placeholder="Email" value={shipping.email} onChange={e => setShipping({ ...shipping, email: e.target.value })}
                className="border rounded-xl px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--sc-line)' }} />
              <input required placeholder="Address" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })}
                className="border rounded-xl px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--sc-line)' }} />
              <div className="grid grid-cols-2 gap-3.5">
                <input required placeholder="City" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })}
                  className="border rounded-xl px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--sc-line)' }} />
                <input required placeholder="PIN code" value={shipping.postcode} onChange={e => setShipping({ ...shipping, postcode: e.target.value })}
                  className="border rounded-xl px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--sc-line)' }} />
              </div>
              <input required placeholder="Country" value={shipping.country} onChange={e => setShipping({ ...shipping, country: e.target.value })}
                className="border rounded-xl px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--sc-line)' }} />
            </div>
            <button type="submit" className="w-full py-3.5 rounded-full text-sm font-bold mt-6 scroll-gradient" style={{ color: 'var(--sc-accent-ink)' }}>
              Continue to Payment
            </button>
          </form>
        )}

        {step === 'payment' && (
          <form onSubmit={handlePlaceOrder}>
            <h1 className="scroll-display text-2xl font-extrabold mb-2">Payment</h1>
            <p className="text-xs mb-6" style={{ color: 'var(--sc-ink-dim)' }}>
              {isLiveSeller ? 'Cash on delivery — pay when your order arrives.' : 'Concept storefront — this form does not process a real payment.'}
            </p>
            {!isLiveSeller && (
              <div className="flex flex-col gap-3.5 mb-2">
                <input
                  required
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="border rounded-xl px-4 py-3 text-sm bg-transparent outline-none"
                  style={{ borderColor: 'var(--sc-line)' }}
                />
                <p className="text-[11px] -mt-1" style={{ color: 'var(--sc-ink-dim)' }}>Enter any UPI ID — this demo never sends a real payment request.</p>
              </div>
            )}
            {error && <p className="text-xs mb-4" style={{ color: '#D6304B' }}>{error}</p>}
            <button type="submit" disabled={placing} className="w-full py-3.5 rounded-full text-sm font-bold mt-4 disabled:opacity-60 scroll-gradient" style={{ color: 'var(--sc-accent-ink)' }}>
              {placing ? 'Placing order…' : isLiveSeller ? `Place Order · ₹${total.toLocaleString('en-IN')}` : `Pay via UPI · ₹${total.toLocaleString('en-IN')}`}
            </button>
          </form>
        )}
      </div>

      <aside className="rounded-2xl border p-5 h-fit" style={{ borderColor: 'var(--sc-line)' }}>
        <p className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--sc-ink-dim)' }}>Order Summary</p>
        <div className="flex flex-col gap-2 text-sm mb-3.5">
          <div className="flex justify-between"><span style={{ color: 'var(--sc-ink-muted)' }}>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span style={{ color: 'var(--sc-ink-muted)' }}>Shipping</span><span>Free</span></div>
        </div>
        <div className="flex justify-between text-base font-semibold pt-3.5 border-t" style={{ borderColor: 'var(--sc-line)' }}>
          <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
        </div>
      </aside>
    </div>
  )
}
