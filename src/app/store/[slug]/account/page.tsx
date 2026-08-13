'use client'

import { useParams } from 'next/navigation'
import { Suspense, useState } from 'react'

interface OrderItem {
  name: string
  qty: number
  price_inr: number
  size?: string
}

interface Order {
  id: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  items: OrderItem[]
  total_inr: number
  payment_method: string
  tracking_number?: string
  tracking_url?: string
  shipped_at?: string
  created_at: string
  shipping_address?: { name?: string; line1?: string; line2?: string; city?: string; state?: string; pincode?: string }
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const STATUS_COLOR: Record<string, string> = {
  pending: '#F59E0B',
  confirmed: '#3B82F6',
  shipped: '#8B5CF6',
  delivered: '#10B981',
  cancelled: '#EF4444',
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Loading...</div>}>
      <AccountPageContent />
    </Suspense>
  )
}

function AccountPageContent() {
  const { slug } = useParams() as { slug: string }
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [brandName, setBrandName] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#F72585')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/store/${slug}/orders?email=${encodeURIComponent(email.trim())}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not look up orders')
      setOrders(data.orders ?? [])
      setBrandName(data.brand_name ?? '')
      setPrimaryColor(data.primary_color ?? '#F72585')
      setSubmitted(true)
    } catch (err) {
      setError((err as Error).message)
    }
    setLoading(false)
  }

  const accent = primaryColor

  if (!submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#fafafa' }}>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Track your order</h1>
          <p className="text-sm text-gray-500 mb-6">Enter the email address you used at checkout to see your orders.</p>
          <form onSubmit={handleLookup} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 text-gray-900"
              style={{ '--tw-ring-color': accent } as React.CSSProperties}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-opacity"
              style={{ background: accent, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Looking up…' : 'View my orders'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{brandName || 'Your orders'}</h1>
          <p className="text-sm text-gray-400 mt-0.5">Orders for {email}</p>
        </div>
        <button
          onClick={() => { setSubmitted(false); setOrders([]) }}
          className="text-xs text-gray-400 underline"
        >
          Use a different email
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🛍️</p>
          <p className="text-gray-500 text-sm">No orders found for this email address.</p>
          <p className="text-gray-400 text-xs mt-1">Make sure you entered the same email you used at checkout.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const date = new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm text-gray-500">{date}</p>
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${STATUS_COLOR[order.status]}18`, color: STATUS_COLOR[order.status] }}
                  >
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {(order.items as OrderItem[]).map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-gray-800 font-medium">{item.name}</span>
                        {item.size && <span className="text-gray-400 ml-1.5 text-xs">({item.size})</span>}
                        {item.qty > 1 && <span className="text-gray-400 ml-1.5 text-xs">× {item.qty}</span>}
                      </div>
                      <span className="text-gray-700">₹{(item.price_inr * item.qty).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-sm font-semibold text-gray-900">₹{order.total_inr.toLocaleString('en-IN')}</span>
                </div>

                {order.tracking_number && (
                  <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: `${accent}0f`, color: accent }}>
                    <p className="font-medium mb-0.5">Tracking: {order.tracking_number}</p>
                    {order.tracking_url && (
                      <a href={order.tracking_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs underline">
                        Track shipment →
                      </a>
                    )}
                  </div>
                )}

                {order.shipping_address?.line1 && (
                  <div className="mt-3 text-xs text-gray-400">
                    Delivering to: {[order.shipping_address.name, order.shipping_address.line1, order.shipping_address.city, order.shipping_address.state, order.shipping_address.pincode].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
