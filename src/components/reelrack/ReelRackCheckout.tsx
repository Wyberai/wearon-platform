'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFlagshipCart } from '@/lib/flagship/cart-context'
import { getOrCreateDeviceToken } from '@/lib/device-token'
import { formatINR } from '@/lib/reelrack/catalog'
import { ReelRackImg } from './ReelRackShell'
import type { ThemeBrand } from '@/lib/flagship/types'

type Step = 'bag' | 'shipping' | 'payment' | 'confirmed'

interface ShippingInfo { name: string; email: string; address: string; city: string; postcode: string; country: string }

function generateOrderNumber() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `ORD-${s}`
}

function isPlausibleUpiId(v: string) {
  return /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(v.trim())
}

export function ReelRackCheckout({ brand }: { brand: ThemeBrand }) {
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

  function handleShippingSubmit(e: React.FormEvent) { e.preventDefault(); setStep('payment') }

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
        if (!res.ok) { setError(data.error ?? 'Could not place order. Please try again.'); setPlacing(false); return }
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

    if (!isPlausibleUpiId(upiId)) { setError('Enter a valid UPI ID, like yourname@upi.'); return }
    setOrderNumber(generateOrderNumber())
    setStep('confirmed')
    clear()
  }

  if (lines.length === 0 && step !== 'confirmed') {
    return (
      <div className="max-w-lg mx-auto px-6 py-32 text-center">
        <p className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--rr-display)' }}>Your bag is empty</p>
        <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4" style={{ color: 'var(--rr-accent)' }}>Continue browsing</Link>
      </div>
    )
  }

  if (step === 'confirmed') {
    return (
      <div className="max-w-lg mx-auto px-6 py-28 text-center">
        <p style={{ color: 'var(--rr-gold)' }} className="text-3xl mb-5">✓</p>
        <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'var(--rr-display)' }}>Order placed</h1>
        <p className="text-sm mb-1" style={{ color: 'var(--rr-ink-muted)' }}>Order {orderNumber}</p>
        <p className="text-sm max-w-sm mx-auto mt-4 leading-relaxed" style={{ color: 'var(--rr-ink-muted)' }}>
          {isLiveSeller ? `${brand.name} will confirm your order shortly. Paying cash on delivery.` : 'This is a concept storefront — no real UPI payment was processed and no email will follow.'}
        </p>
        <Link href={`/store/${slug}`} className="inline-block mt-8 px-7 py-3.5 rounded-full text-sm font-semibold" style={{ background: 'var(--rr-accent)', color: 'var(--rr-accent-ink)' }}>
          Back to {brand.name}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 md:px-10 pt-8 pb-24 grid grid-cols-1 md:grid-cols-[1fr_380px] gap-12">
      <div>
        <div className="flex items-center gap-3 mb-8 text-xs uppercase font-medium" style={{ color: 'var(--rr-ink-dim)' }}>
          <span style={step !== 'bag' ? { color: 'var(--rr-ink)' } : {}}>Bag</span><span>—</span>
          <span style={step === 'shipping' || step === 'payment' ? { color: 'var(--rr-ink)' } : {}}>Shipping</span><span>—</span>
          <span style={step === 'payment' ? { color: 'var(--rr-ink)' } : {}}>Payment</span>
        </div>

        {step === 'bag' && (
          <div>
            <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--rr-display)' }}>Review your bag</h1>
            <div className="flex flex-col gap-5 mb-8">
              {lines.map(line => (
                <div key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4 pb-5 border-b" style={{ borderColor: 'var(--rr-line)' }}>
                  <ReelRackImg src={line.image} alt={line.name} wrapperClassName="w-20 h-24 rounded-lg overflow-hidden" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{line.name}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--rr-ink-muted)' }}>{line.color}{line.size ? ` · ${line.size}` : ''} · Qty {line.quantity}</p>
                  </div>
                  <p className="text-sm">{formatINR(line.price * line.quantity)}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setStep('shipping')} className="w-full py-4 rounded-full text-sm font-semibold" style={{ background: 'var(--rr-accent)', color: 'var(--rr-accent-ink)' }}>Continue to Shipping</button>
          </div>
        )}

        {step === 'shipping' && (
          <form onSubmit={handleShippingSubmit}>
            <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--rr-display)' }}>Shipping details</h1>
            <div className="flex flex-col gap-4">
              <input required placeholder="Full name" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })} className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--rr-line)' }} />
              <input required type="email" placeholder="Email" value={shipping.email} onChange={e => setShipping({ ...shipping, email: e.target.value })} className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--rr-line)' }} />
              <input required placeholder="Address" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--rr-line)' }} />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="City" value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--rr-line)' }} />
                <input required placeholder="Pincode" value={shipping.postcode} onChange={e => setShipping({ ...shipping, postcode: e.target.value })} className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--rr-line)' }} />
              </div>
              <input required placeholder="Country" value={shipping.country} onChange={e => setShipping({ ...shipping, country: e.target.value })} className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--rr-line)' }} />
            </div>
            <button type="submit" className="w-full py-4 rounded-full text-sm font-semibold mt-6" style={{ background: 'var(--rr-accent)', color: 'var(--rr-accent-ink)' }}>Continue to Payment</button>
          </form>
        )}

        {step === 'payment' && (
          <form onSubmit={handlePlaceOrder}>
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--rr-display)' }}>Payment</h1>
            <p className="text-xs mb-6" style={{ color: 'var(--rr-ink-dim)' }}>
              {isLiveSeller ? 'Cash on delivery — pay when your order arrives.' : 'Concept storefront — this form does not process a real UPI payment.'}
            </p>
            {!isLiveSeller && (
              <div className="flex flex-col gap-2 mb-2">
                <label className="text-xs uppercase font-medium" style={{ color: 'var(--rr-ink-dim)' }}>UPI ID</label>
                <input required placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} className="border rounded-lg px-4 py-3 text-sm bg-transparent outline-none" style={{ borderColor: 'var(--rr-line)' }} />
              </div>
            )}
            {error && <p className="text-xs mb-4 mt-3" style={{ color: 'var(--rr-sale)' }}>{error}</p>}
            <button type="submit" disabled={placing} className="w-full py-4 rounded-full text-sm font-semibold mt-4 disabled:opacity-60" style={{ background: 'var(--rr-accent)', color: 'var(--rr-accent-ink)' }}>
              {placing ? 'Placing order…' : isLiveSeller ? `Place Order · ${formatINR(total)}` : `Pay via UPI · ${formatINR(total)}`}
            </button>
          </form>
        )}
      </div>

      <aside className="rounded-xl border p-6 h-fit" style={{ borderColor: 'var(--rr-line)' }}>
        <p className="text-sm uppercase font-medium mb-5" style={{ color: 'var(--rr-ink-dim)' }}>Order Summary</p>
        <div className="flex flex-col gap-2 text-sm mb-4">
          <div className="flex justify-between"><span style={{ color: 'var(--rr-ink-muted)' }}>Subtotal</span><span>{formatINR(subtotal)}</span></div>
          <div className="flex justify-between"><span style={{ color: 'var(--rr-ink-muted)' }}>Shipping</span><span>Free</span></div>
        </div>
        <div className="flex justify-between text-base font-semibold pt-4 border-t" style={{ borderColor: 'var(--rr-line)' }}>
          <span>Total</span><span>{formatINR(total)}</span>
        </div>
      </aside>
    </div>
  )
}
