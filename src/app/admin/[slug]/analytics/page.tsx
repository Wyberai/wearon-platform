'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface AnalyticsRow {
  date: string
  store_visits: number
  try_ons: number
  whatsapp_clicks: number
  orders_placed: number
  revenue_inr: number
}

interface Totals {
  store_visits: number
  try_ons: number
  whatsapp_clicks: number
  orders_placed: number
  revenue_inr: number
}

interface RecentOrder {
  id: string
  status: string
  total_inr: number
  created_at: string
}

interface AnalyticsData {
  rows: AnalyticsRow[]
  totals: Totals
  conversionRate: number
  recentOrders: RecentOrder[]
  days: number
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AnalyticsPage() {
  const { slug } = useParams() as { slug: string }
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(true)
  const [chartMetric, setChartMetric] = useState<keyof AnalyticsRow>('store_visits')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/admin/analytics?days=${days}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [days])

  const rows = data?.rows ?? []
  const totals = data?.totals ?? { store_visits: 0, try_ons: 0, whatsapp_clicks: 0, orders_placed: 0, revenue_inr: 0 }

  const metricMax = rows.reduce((m, r) => Math.max(m, (r[chartMetric] as number) ?? 0), 1)

  const METRICS: { key: keyof AnalyticsRow; label: string; color: string }[] = [
    { key: 'store_visits', label: 'Visits', color: '#3b82f6' },
    { key: 'try_ons', label: 'Try-ons', color: '#ec4899' },
    { key: 'whatsapp_clicks', label: 'WhatsApp', color: '#22c55e' },
    { key: 'orders_placed', label: 'Orders', color: '#f59e0b' },
  ]

  const selectedMetric = METRICS.find(m => m.key === chartMetric) ?? METRICS[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href={`/admin/${slug}`} className="text-sm text-gray-500 hover:text-gray-700">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Analytics</h1>
          </div>
          <select
            value={days}
            onChange={e => setDays(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400 text-sm animate-pulse">Loading analytics...</div>
          </div>
        ) : (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Store Visits', value: totals.store_visits.toLocaleString('en-IN'), icon: '👁️' },
                { label: 'Try-ons', value: totals.try_ons.toLocaleString('en-IN'), icon: '👗' },
                { label: 'WhatsApp Clicks', value: totals.whatsapp_clicks.toLocaleString('en-IN'), icon: '💬' },
                { label: 'Revenue', value: `₹${totals.revenue_inr.toLocaleString('en-IN')}`, icon: '💰' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Conversion + Orders summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="text-sm font-semibold text-gray-700 mb-1">Try-on → WhatsApp Conversion</div>
                <div className="text-4xl font-bold text-pink-600">{data?.conversionRate ?? 0}%</div>
                <div className="text-xs text-gray-400 mt-1">of try-ons led to a WhatsApp enquiry</div>
                <div className="mt-3 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-pink-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(data?.conversionRate ?? 0, 100)}%` }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="text-sm font-semibold text-gray-700 mb-3">Recent Orders</div>
                {(data?.recentOrders ?? []).length === 0 ? (
                  <div className="text-sm text-gray-400">No orders yet</div>
                ) : (
                  <div className="space-y-2">
                    {(data?.recentOrders ?? []).map(order => (
                      <div key={order.id} className="flex items-center justify-between text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] ?? ''}`}>
                          {order.status}
                        </span>
                        <span className="text-gray-700 font-medium">₹{order.total_inr?.toLocaleString('en-IN')}</span>
                        <span className="text-gray-400 text-xs">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-gray-700">Daily Trend</div>
                <div className="flex gap-2">
                  {METRICS.map(m => (
                    <button
                      key={m.key}
                      onClick={() => setChartMetric(m.key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        chartMetric === m.key
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      style={chartMetric === m.key ? { backgroundColor: m.color } : {}}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {rows.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-12">
                  No data for this period yet
                </div>
              ) : (
                <div className="flex items-end gap-1 h-40 overflow-x-auto">
                  {rows.map(row => {
                    const val = (row[chartMetric] as number) ?? 0
                    const pct = metricMax > 0 ? (val / metricMax) * 100 : 0
                    const label = new Date(row.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                    return (
                      <div key={row.date} className="flex flex-col items-center gap-1 flex-1 min-w-[28px]" title={`${label}: ${val}`}>
                        <div className="text-xs text-gray-500 font-medium">{val > 0 ? val : ''}</div>
                        <div
                          className="w-full rounded-t-sm transition-all"
                          style={{
                            height: `${Math.max(pct, 2)}%`,
                            backgroundColor: selectedMetric.color,
                            opacity: 0.85,
                            minHeight: '4px',
                          }}
                        />
                        <div className="text-[10px] text-gray-400 truncate w-full text-center">
                          {label.split(' ')[0]}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
