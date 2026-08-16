'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { getOrCreateDeviceToken } from '@/lib/device-token'
import type { ThemeBrand } from '@/lib/flagship/types'
import { MelaImg } from './MelaShell'

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

export function MelaCheckout({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const isLiveSeller = !!brand.sellerId
  const { lines, subtotal, clear } = useFlagshipCart()
  // Cart hydrates from localStorage a tick after mount — start on 'bag' and
  // let the empty-state check below (re-evaluated every render) handle a
  // genuinely empty cart (same fix as every other flagship theme's checkout).
  const [step, setStep] = useState<Step>('bag')
  const [shipping, setShipping] = useState<ShippingInfo>({ name: '', email: '', address: '', city: '', postcode: '', country: '' })
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
        <p className="mela-display text-3xl font-extrabold mb-4">Your bag is empty</p>
        <Link href={`/store/${slug}/shop`} className="text-sm font-semibold underline underline-offset-4" style={{ color: 'var(--me-pink)' }}>Continue browsing</Link>
      </div>
    )
  }

  if (step === 'confirmed') {
    return (
      <div className="max-w-lg mx-auto px-6 py-28 text-center">
        <p style={{ color: 'var(--me-marigold)' }} className="text-4xl mb-5">✦</p>
        <h1 className="mela-display text-4xl font-extrabold mb-3">Order placed</h1>
        <p className="text-sm mb-1 font-semibold" style={{ color: 'var(--me-ink-muted)' }}>Order {orderNumber}</p>
        <p className="text-sm max-w-sm mx-auto mt-4 leading-relaxed font-medium" style={{ color: 'var(--me-ink-muted)' }}>
          {isLiveSeller
            ? `${brand.name} will confirm your order shortly. Paying cash on delivery.`
            : 'This is a concept storefront — no real payment was processed and no email will follow. In a live store, a confirmation would arrive at the address you entered.'}
        </p>
        <Link href={`/store/${slug}`} className="inline-block mt-8 px-7 py-3.5 rounded-full text-sm tracking-wide font-extrabold" style={{ background: 'var(--me-pink)', color: '#fff' }}>
          Back to {brand.name}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-10 pt-8 pb-24 grid grid-cols-1 md:grid-cols-[1fr_380px] gap-12">
      <div>
        <div className="flex items-center gap-3 mb-8 text-xs tracking-[0.15em] uppercase font-bold" style={{ color: 'var(--me-ink-dim)' }}>
          <span style={step !== 'bag' ? { color: 'var(--me-pink)' } : {}}>Bag</span>
          <span>—</span>
          <span style={step === 'shipping' || step === 'payment' ? { color: 'var(--me-pink)' } : {}}>Shipping</span>
          <span>—</span>
          <span style={step === 'payment' ? { color: 'var(--me-pink)' } : {}}>Payment</span>
        </div>

        {step === 'bag' && (
          <div>
            <h1 className="mela-display text-3xl font-extrabold mb-6">Review your bag</h1>
            <div className="flex flex-col gap-5 mb-8">
              {lines.map(line => (
                <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4 pb-5 border-b" style={{ borderColor: 'var(--me-line)' }}>
                  <MelaImg src={line.image} alt={line.name} className="w-20 h-24 rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{line.name}</p>
                    <p className="text-xs mt-1 font-medium" style={{ color: 'var(--me-ink-muted)' }}>{line.color}{line.size ? ` · ${line.size}` : ''} · Qty {line.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">&#8377;{(line.price * line.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setStep('shipping')} className="w-full py-4 rounded-full text-sm tracking-wide font-extrabold" style={{ background: 'var(--me-pink)', color: '#fff' }}>
              Continue to Shipping
            </button>
          </div>
        )}

        {step === 'shipping' && (
          <form onSubmit={handleShippingSubmit}>
            <h1 className="mela-display text-3xl font-extrabold mb-6">Shipping details</h1>
            <div className="flex flex-col gap-4">
              <input required placeholder="Full name" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })}
                className="border-2 rounded-lg px-4 py-3 text-sm bg-transparent outline-none font-medium" style={{ borderColor: 'var(--me-line)' }} />
              <input required type="email" placeholder="Email" value={shipping.email} onChange={e => setShipping({ ...shipping, email: e.target.value })}
                className="border-2 rounded-lg px-4 py-3 text-sm bg-transparent outline-none font-medium" style={{ borderColor: 'var(--me-line)' }} />
              <input required placeholder="Address" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })}
                className="border-2 rounded-lg px-4 py-3 text-sm bg-transparent outline-none font-medium" style={{ borderColor: 'var(--me-line)' }} />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="City" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })}
                  className="border-2 rounded-lg px-4 py-3 text-sm bg-transparent outline-none font-medium" style={{ borderColor: 'var(--me-line)' }} />
                <input required placeholder="Pincode" value={shipping.postcode} onChange={e => setShipping({ ...shipping, postcode: e.target.value })}
                  className="border-2 rounded-lg px-4 py-3 text-sm bg-transparent outline-none font-medium" style={{ borderColor: 'var(--me-line)' }} />
              </div>
              <input required placeholder="Country" value={shipping.country} onChange={e => setShipping({ ...shipping, country: e.target.value })}
                className="border-2 rounded-lg px-4 py-3 text-sm bg-transparent outline-none font-medium" style={{ borderColor: 'var(--me-line)' }} />
            </div>
            <button type="submit" className="w-full py-4 rounded-full text-sm tracking-wide font-extrabold mt-6" style={{ background: 'var(--me-pink)', color: '#fff' }}>
              Continue to Payment
            </button>
          </form>
        )}

        {step === 'payment' && (
          <form onSubmit={handlePlaceOrder}>
            <h1 className="mela-display text-3xl font-extrabold mb-2">Payment</h1>
            <p className="text-xs mb-6 font-medium" style={{ color: 'var(--me-ink-dim)' }}>
              {isLiveSeller ? 'Cash on delivery — pay when your order arrives.' : 'Concept storefront — this form does not process a real payment.'}
            </p>
            {!isLiveSeller && (
              <div className="flex flex-col gap-3 mb-2">
                <label className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--me-ink-dim)' }}>UPI ID</label>
                <input
                  required
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="border-2 rounded-lg px-4 py-3 text-sm bg-transparent outline-none font-medium"
                  style={{ borderColor: 'var(--me-line)' }}
                />
              </div>
            )}
            {error && <p className="text-xs mb-4 font-semibold" style={{ color: '#C0392B' }}>{error}</p>}
            <button type="submit" disabled={placing} className="w-full py-4 rounded-full text-sm tracking-wide font-extrabold mt-4 disabled:opacity-60" style={{ background: 'var(--me-pink)', color: '#fff' }}>
              {placing ? 'Placing order…' : isLiveSeller ? `Place Order · ₹${total.toLocaleString('en-IN')}` : `Pay via UPI · ₹${total.toLocaleString('en-IN')}`}
            </button>
          </form>
        )}
      </div>

      <aside className="rounded-xl border-2 p-6 h-fit" style={{ borderColor: 'var(--me-line)' }}>
        <p className="text-sm tracking-wide uppercase mb-5 font-bold" style={{ color: 'var(--me-ink-dim)' }}>Order Summary</p>
        <div className="flex flex-col gap-2 text-sm mb-4 font-medium">
          <div className="flex justify-between"><span style={{ color: 'var(--me-ink-muted)' }}>Subtotal</span><span>&#8377;{subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span style={{ color: 'var(--me-ink-muted)' }}>Shipping</span><span>Free</span></div>
        </div>
        <div className="flex justify-between text-base pt-4 border-t font-extrabold" style={{ borderColor: 'var(--me-line)' }}>
          <span>Total</span><span>&#8377;{total.toLocaleString('en-IN')}</span>
        </div>
      </aside>
    </div>
  )
}
