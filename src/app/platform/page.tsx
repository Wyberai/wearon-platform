'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PLANS } from '@/lib/constants'

interface Seller {
  id: string
  email: string
  plan: string
  subscription_status: string | null
  try_ons_used: number
  try_ons_limit: number
  created_at: string
  brand_name: string
  slug: string | null
  primary_color: string
  product_count: number
  orders_30d: number
  revenue_30d_inr: number
}

interface PlatformStats {
  total_sellers: number
  active_sellers: number
  paying_sellers: number
  mrr_inr: number
  total_products: number
  total_orders_30d: number
  total_revenue_30d: number
  by_plan: Record<string, number>
}

const PLAN_COLORS: Record<string, string> = {
  free: '#6B7280',
  starter: '#3B82F6',
  growth: '#F72585',
  pro: '#8B5CF6',
  enterprise: '#F59E0B',
}

const SUB_COLORS: Record<string, string> = {
  active: '#4ADE80',
  cancelled: '#EF4444',
  past_due: '#F59E0B',
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function fmtInr(n: number) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
  return `₹${n.toLocaleString('en-IN')}`
}

function daysAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
  if (d === 0) return 'today'
  if (d === 1) return '1d ago'
  return `${d}d ago`
}

export default function PlatformPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/platform/sellers')
      .then(r => r.json())
      .then(d => { setSellers(d.sellers ?? []); setStats(d.stats ?? null); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function updatePlan(sellerId: string, plan: string) {
    setUpdating(sellerId)
    const planLimits: Record<string, number> = {
      free: PLANS.free.try_ons,
      starter: PLANS.starter.try_ons,
      growth: PLANS.growth.try_ons,
      pro: PLANS.pro.try_ons,
      enterprise: PLANS.enterprise.try_ons,
    }
    await fetch(`/api/platform/sellers/${sellerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, try_ons_limit: planLimits[plan] ?? 20 }),
    })
    setSellers(prev => prev.map(s => s.id === sellerId ? { ...s, plan, try_ons_limit: planLimits[plan] ?? 20 } : s))
    setUpdating(null)
  }

  async function toggleSuspend(seller: Seller) {
    const is_suspended = seller.subscription_status !== 'suspended'
    setUpdating(seller.id)
    await fetch(`/api/platform/sellers/${seller.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription_status: is_suspended ? 'suspended' : 'active' }),
    })
    setSellers(prev => prev.map(s => s.id === seller.id ? { ...s, subscription_status: is_suspended ? 'suspended' : null } : s))
    setUpdating(null)
  }

  const filtered = sellers.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || s.brand_name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || (s.slug ?? '').toLowerCase().includes(q)
    const matchPlan = planFilter === 'all' || s.plan === planFilter
    return matchSearch && matchPlan
  })

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Stats row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Total sellers', value: stats.total_sellers, color: '#fff' },
            { label: 'Paying sellers', value: stats.paying_sellers, color: '#F72585' },
            { label: 'MRR', value: fmtInr(stats.mrr_inr), color: '#4ADE80' },
            { label: 'Products live', value: stats.total_products, color: '#fff' },
            { label: 'Orders (30d)', value: stats.total_orders_30d, color: '#fff' },
            { label: 'Revenue (30d)', value: fmtInr(stats.total_revenue_30d), color: '#4ADE80' },
            { label: 'Free sellers', value: stats.by_plan.free ?? 0, color: '#6B7280' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding: '16px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 5 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Plan distribution bar */}
      {stats && (
        <div style={{ marginBottom: 24, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {Object.entries(stats.by_plan).filter(([, count]) => count > 0).map(([plan, count]) => (
            <div key={plan} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: PLAN_COLORS[plan] ?? '#999', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{plan}</span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{count}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search brand, email, slug…"
          style={{ flex: 1, maxWidth: 340, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13, outline: 'none' }}
        />
        <select
          value={planFilter}
          onChange={e => setPlanFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13, cursor: 'pointer' }}
        >
          <option value="all">All plans</option>
          {['free', 'starter', 'growth', 'pro', 'enterprise'].map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>{filtered.length} seller{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Seller table */}
      <div style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 90px 70px 70px 100px 90px 140px', gap: 0, padding: '10px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['Brand / Email', 'Plan', 'Products', 'Orders', 'Revenue', 'Try-ons', 'Joined', 'Actions'].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {loading && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading…</div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            {sellers.length === 0 ? 'No sellers yet. Share the landing page!' : 'No sellers match this filter.'}
          </div>
        )}

        {filtered.map((seller, i) => {
          const isSuspended = seller.subscription_status === 'suspended'
          return (
            <div
              key={seller.id}
              style={{
                display: 'grid', gridTemplateColumns: '2.5fr 1fr 90px 70px 70px 100px 90px 140px',
                gap: 0, padding: '14px 20px',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                background: isSuspended ? 'rgba(239,68,68,0.03)' : 'transparent',
                opacity: isSuspended ? 0.7 : 1,
              }}
            >
              {/* Brand + email */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 10, background: seller.primary_color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: '#fff', flexShrink: 0,
                }}>
                  {initials(seller.brand_name)}
                </div>
                <div>
                  <Link href={`/platform/sellers/${seller.id}`} style={{ fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none', display: 'block' }}>
                    {seller.brand_name}
                  </Link>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>
                    {seller.slug ? (
                      <a href={`/store/${seller.slug}`} target="_blank" style={{ color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>/{seller.slug} ↗</a>
                    ) : seller.email}
                  </div>
                </div>
              </div>

              {/* Plan selector */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <select
                  value={seller.plan}
                  onChange={e => updatePlan(seller.id, e.target.value)}
                  disabled={updating === seller.id}
                  style={{
                    padding: '4px 8px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    background: `${PLAN_COLORS[seller.plan] ?? '#6B7280'}22`,
                    color: PLAN_COLORS[seller.plan] ?? '#6B7280',
                    border: `1px solid ${PLAN_COLORS[seller.plan] ?? '#6B7280'}44`,
                    outline: 'none',
                  }}
                >
                  {['free', 'starter', 'growth', 'pro', 'enterprise'].map(p => (
                    <option key={p} value={p} style={{ background: '#1a1a1d', color: '#fff' }}>{p}</option>
                  ))}
                </select>
                {seller.subscription_status && seller.subscription_status !== 'suspended' && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: SUB_COLORS[seller.subscription_status] ?? '#6B7280', display: 'inline-block', marginLeft: 6, flexShrink: 0 }} title={seller.subscription_status} />
                )}
              </div>

              {/* Products */}
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 600, color: seller.product_count > 0 ? '#fff' : 'rgba(255,255,255,0.25)' }}>
                {seller.product_count}
              </div>

              {/* Orders 30d */}
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 14, fontWeight: 600, color: seller.orders_30d > 0 ? '#4ADE80' : 'rgba(255,255,255,0.25)' }}>
                {seller.orders_30d}
              </div>

              {/* Revenue 30d */}
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 600, color: seller.revenue_30d_inr > 0 ? '#4ADE80' : 'rgba(255,255,255,0.2)' }}>
                {seller.revenue_30d_inr > 0 ? fmtInr(seller.revenue_30d_inr) : '—'}
              </div>

              {/* Try-ons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.08)', maxWidth: 60 }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    width: `${Math.min(100, Math.round((seller.try_ons_used / (seller.try_ons_limit || 1)) * 100))}%`,
                    background: seller.try_ons_used / (seller.try_ons_limit || 1) > 0.8 ? '#EF4444' : '#F72585',
                  }} />
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{seller.try_ons_used}/{seller.try_ons_limit}</span>
              </div>

              {/* Joined */}
              <div style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                {daysAgo(seller.created_at)}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Link
                  href={`/platform/sellers/${seller.id}`}
                  style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', padding: '4px 8px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
                >
                  Detail
                </Link>
                <button
                  onClick={() => toggleSuspend(seller)}
                  disabled={updating === seller.id}
                  style={{
                    fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: '4px 8px', borderRadius: 7,
                    border: `1px solid ${isSuspended ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`,
                    background: isSuspended ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)',
                    color: isSuspended ? '#4ADE80' : '#EF4444',
                  }}
                >
                  {isSuspended ? 'Restore' : 'Suspend'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
