'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PLAN_AI_CREDIT_LIMITS, PLAN_AI_REPLY_LIMITS, PLANS } from '@/lib/constants'

interface FunnelData {
  funnel: { previews_30d: number; signups_total: number; paying_total: number; revenue_30d_inr: number }
  themePopularity: { id: string; name: string; previews_30d: number; adoptions_total: number }[]
  outbound: { total: number; with_contact: number; by_status: Record<string, number>; by_language: Record<string, number> }
}

interface Seller {
  id: string
  email: string
  plan: string
  subscription_status: string | null
  ai_credits: number
  ai_replies_used: number
  ai_reply_limit: number
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
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null)

  useEffect(() => {
    fetch('/api/platform/sellers')
      .then(r => r.json())
      .then(d => { setSellers(d.sellers ?? []); setStats(d.stats ?? null); setLoading(false) })
      .catch(() => setLoading(false))
    fetch('/api/platform/funnel')
      .then(r => r.json())
      .then(d => setFunnelData(d))
      .catch(() => {})
  }, [])

  async function updatePlan(sellerId: string, plan: string) {
    setUpdating(sellerId)
    const aiReplyLimit = PLAN_AI_REPLY_LIMITS[plan as keyof typeof PLAN_AI_REPLY_LIMITS] ?? 20
    const aiCredits = PLAN_AI_CREDIT_LIMITS[plan as keyof typeof PLAN_AI_CREDIT_LIMITS] ?? 0
    await fetch(`/api/platform/sellers/${sellerId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, ai_credits: aiCredits, ai_reply_limit: aiReplyLimit }),
    })
    setSellers(prev => prev.map(s => s.id === sellerId ? { ...s, plan, ai_credits: aiCredits, ai_reply_limit: aiReplyLimit } : s))
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
      {/* FUNNEL — real numbers only: leads (preview requests), tenant_config
          (actual signups), profiles.plan (paying), orders (revenue). No
          fabricated conversion-rate claims — see the homepage rebuild
          decision earlier this session for why that matters here too. */}
      {funnelData && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>
            Funnel
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {[
              { label: 'Previews (30d)', value: funnelData.funnel.previews_30d },
              { label: 'Signups (total)', value: funnelData.funnel.signups_total },
              { label: 'Paying (total)', value: funnelData.funnel.paying_total },
              { label: 'Revenue (30d)', value: fmtInr(funnelData.funnel.revenue_30d_inr) },
            ].map((step, i, arr) => (
              <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ padding: '14px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', minWidth: 130 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{step.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{step.label}</div>
                </div>
                {i < arr.length - 1 && <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 18 }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* THEME POPULARITY + OUTBOUND CRM SNAPSHOT — side by side */}
      {funnelData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 16, marginBottom: 32 }}>
          <div style={{ padding: '18px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>
              Theme popularity — previews (30d) vs actual signups
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {funnelData.themePopularity.slice(0, 6).map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', width: 90, flexShrink: 0 }}>{t.name}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{t.previews_30d} previews</span>
                  <span style={{ fontSize: 11, color: '#4ADE80' }}>{t.adoptions_total} live stores</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '18px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Outbound CRM
              </div>
              <Link href="/platform/outbound" style={{ fontSize: 11, color: '#F72585', textDecoration: 'none', fontWeight: 700 }}>Open →</Link>
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>{funnelData.outbound.total}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>prospects</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#4ADE80' }}>{funnelData.outbound.with_contact}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>with contact</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#3B82F6' }}>{funnelData.outbound.by_status.sent ?? 0}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>sent</div>
              </div>
            </div>
          </div>
        </div>
      )}

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

              {/* AI credits remaining (try-on + AI photoshoot pool) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 11, color: seller.ai_credits <= 15 ? '#EF4444' : 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{seller.ai_credits} credits</span>
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
