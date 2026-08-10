'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface PreviewData {
  plan: string
  products_count: number
  orders_count: number
  revenue_30d_inr: number
  cost_30d_inr: number
  margin_30d_inr: number
  margin_pct: number
  store_visits: number
  try_ons: number
  analytics_chart: { date: string; store_visits: number; orders_placed: number }[]
  product_margins: { name: string; price_inr: number; cost_price_inr: number; margin_pct: number }[]
  inbox: { channel: string; name: string; preview: string | null; unread: number }[]
}

const CHANNEL_ICON: Record<string, string> = { instagram: '📷', messenger: '💬', whatsapp: '📱' }

export default function DashboardPreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <DashboardPreviewContent />
    </Suspense>
  )
}

function DashboardPreviewContent() {
  const params = useSearchParams()
  const brandName = params.get('name')?.trim() || 'Your Boutique'
  const [data, setData] = useState<PreviewData | null>(null)

  useEffect(() => {
    fetch('/api/preview/dashboard').then(r => r.json()).then(setData).catch(() => {})
  }, [])

  const metricMax = Math.max(1, ...(data?.analytics_chart.map(d => d.store_visits) ?? [1]))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner making clear this is a preview */}
      <div className="bg-gray-900 text-white text-center text-sm py-2 px-4">
        ✨ This is a live preview of what <strong>{brandName}</strong>&apos;s dashboard would look like on WearOn — real data, real automation.
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{brandName}</h1>
            <p className="text-gray-500 text-sm mt-1">Dashboard preview</p>
          </div>
          <Link href="/auth/signup" className="bg-pink-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-pink-700">
            Make this real — Create my store →
          </Link>
        </div>

        {!data ? (
          <div className="text-center text-gray-400 py-20">Loading your preview...</div>
        ) : (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Store Visits', value: data.store_visits.toLocaleString('en-IN'), icon: '👁️' },
                { label: 'Products', value: data.products_count, icon: '👗' },
                { label: 'Orders (30d)', value: data.orders_count, icon: '📦' },
                { label: 'Revenue (30d)', value: `₹${data.revenue_30d_inr.toLocaleString('en-IN')}`, icon: '💰' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Margin */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="text-sm font-semibold text-gray-700 mb-3">Margins — know your real profit, not just revenue</div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500">Revenue</div>
                  <div className="text-lg font-bold text-gray-900">₹{data.revenue_30d_inr.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Cost (COGS)</div>
                  <div className="text-lg font-bold text-gray-900">₹{data.cost_30d_inr.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Gross margin</div>
                  <div className="text-lg font-bold text-emerald-600">₹{data.margin_30d_inr.toLocaleString('en-IN')} · {data.margin_pct}%</div>
                </div>
              </div>
              <div className="text-xs font-medium text-gray-500 mb-2">By product</div>
              <div className="space-y-1.5">
                {data.product_margins.slice(0, 6).map(p => (
                  <div key={p.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 truncate flex-1">{p.name}</span>
                    <span className="text-gray-900 font-medium">₹{p.price_inr.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded ml-2 w-12 text-center">{p.margin_pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic chart */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="text-sm font-semibold text-gray-700 mb-4">Store visits — last 14 days</div>
              <div className="flex items-end gap-1 h-32">
                {data.analytics_chart.map(row => (
                  <div key={row.date} className="flex-1 min-w-[12px] bg-pink-400 rounded-t-sm" style={{ height: `${Math.max(4, (row.store_visits / metricMax) * 100)}%` }} title={`${row.date}: ${row.store_visits} visits`} />
                ))}
              </div>
            </div>

            {/* Inbox preview */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="text-sm font-semibold text-gray-700 mb-3">Inbox — WhatsApp, Instagram &amp; Facebook, one screen, AI replying automatically</div>
              <div className="space-y-2">
                {data.inbox.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm border-b border-gray-50 pb-2 last:border-0">
                    <span>{CHANNEL_ICON[c.channel] ?? '💬'}</span>
                    <span className="font-medium text-gray-800 w-28 truncate">{c.name}</span>
                    <span className="text-gray-500 flex-1 truncate">{c.preview}</span>
                    {c.unread > 0 && <span className="bg-pink-600 text-white text-xs rounded-full px-2 py-0.5">{c.unread}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center py-8">
              <Link href="/auth/signup" className="inline-block bg-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-pink-700">
                This could be {brandName}&apos;s real dashboard — Get started free →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
