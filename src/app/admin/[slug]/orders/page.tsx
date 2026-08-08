'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

interface Order {
  id: string
  status: OrderStatus
  items: Array<{ name: string; qty: number; price: number }>
  total_inr: number
  payment_method: string
  whatsapp_confirmed: boolean
  buyer_phone?: string
  buyer_name?: string
  size_selected?: string
  created_at: string
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  shipped:   'bg-blue-100 text-blue-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

const ALL_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export default function OrdersPage() {
  const { slug } = useParams() as { slug: string }
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  async function loadOrders() {
    const res = await fetch(`/api/admin/orders?slug=${slug}`)
    const data = await res.json()
    setOrders(data.orders ?? [])
    setLoading(false)
  }

  useEffect(() => { loadOrders() }, [slug])

  async function updateStatus(orderId: string, status: OrderStatus) {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  }

  function exportCsv() {
    const rows = [
      ['ID', 'Date', 'Status', 'Items', 'Total (₹)', 'Payment', 'Buyer Phone'],
      ...visible.map(o => [
        o.id.slice(0, 8),
        new Date(o.created_at).toLocaleDateString('en-IN'),
        o.status,
        o.items.length,
        o.total_inr,
        o.payment_method,
        o.buyer_phone ?? '',
      ])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = `orders-${slug}.csv`
    a.click()
  }

  const visible = orders.filter(o => filter === 'all' || o.status === filter)
  const pending = orders.filter(o => o.status === 'pending').length
  const confirmed = orders.filter(o => o.status === 'confirmed').length
  const revenue = orders.filter(o => ['confirmed','shipped','delivered'].includes(o.status))
    .reduce((sum, o) => sum + (o.total_inr ?? 0), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track your customer orders</p>
        </div>
        <button onClick={exportCsv}
          className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pending', value: pending, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Confirmed', value: confirmed, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Revenue', value: `₹${revenue.toLocaleString('en-IN')}`, color: 'text-pink-600', bg: 'bg-pink-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-5`}>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {(['all', ...ALL_STATUSES] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
            {s !== 'all' && (
              <span className="ml-1.5 opacity-60">
                {orders.filter(o => o.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders table */}
      {loading ? (
        <div className="text-gray-400 text-sm">Loading orders...</div>
      ) : visible.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <div className="text-5xl mb-4">📦</div>
          <p className="text-lg font-medium text-gray-700">No orders{filter !== 'all' ? ` with status "${filter}"` : ' yet'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Order</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visible.map(order => {
                const date = new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                const isExpanded = expandedId === order.id
                return (
                  <>
                    <tr key={order.id}
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-5 py-4">
                        <div className="font-mono text-xs text-gray-400">{order.id.slice(0, 8)}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-900">
                        ₹{(order.total_inr ?? 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          onClick={e => e.stopPropagation()}
                          onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[order.status]}`}
                        >
                          {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-4 text-gray-400">{date}</td>
                      <td className="px-5 py-4">
                        {order.buyer_phone && (
                          <a
                            href={`https://wa.me/${order.buyer_phone.replace(/\D/g, '')}?text=Hi! Your order from our store is ready.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded hover:bg-green-100 transition-colors"
                          >
                            WhatsApp
                          </a>
                        )}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${order.id}-detail`}>
                        <td colSpan={5} className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-gray-700 mb-2">Items</p>
                              {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-gray-600">
                                  <span>{item.name} × {item.qty}</span>
                                  <span>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                                </div>
                              ))}
                            </div>
                            <div className="text-gray-600 space-y-1">
                              {order.buyer_name && <p><span className="font-medium">Name:</span> {order.buyer_name}</p>}
                              {order.buyer_phone && <p><span className="font-medium">Phone:</span> {order.buyer_phone}</p>}
                              {order.size_selected && <p><span className="font-medium">Size:</span> {order.size_selected}</p>}
                              <p><span className="font-medium">Payment:</span> {order.payment_method}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
