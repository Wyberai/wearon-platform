'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PLAN_AI_REPLY_LIMITS, PLANS } from '@/lib/constants'

const PLAN_COLORS: Record<string, string> = {
  free: '#6B7280', starter: '#3B82F6', growth: '#F72585', pro: '#8B5CF6', enterprise: '#F59E0B',
}

function fmtInr(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface Profile {
  id: string
  email: string
  plan: string
  subscription_status: string | null
  ai_credits: number
  ai_replies_used: number
  ai_reply_limit: number
  created_at: string
  dodo_customer_id?: string
  referred_by?: string
}

interface Config {
  brand_name: string
  slug: string
  primary_color: string
  whatsapp_number: string | null
  instagram_handle: string | null
  payment_method: string
  categories: string[]
  try_on_enabled: boolean
  reviews_enabled: boolean
  wishlist_enabled: boolean
}

interface Order {
  id: string
  status: string
  total_inr: number
  payment_method: string
  created_at: string
  items: { name: string; quantity: number; price_inr: number }[]
}

interface ApkBuild {
  id: string
  status: string
  triggered_at: string
  completed_at: string | null
  apk_url: string | null
}

interface WhatsAppConnection {
  waba_id: string
  phone_number_id: string
  display_number: string | null
}

const STATUS_COLOR: Record<string, string> = {
  pending: '#F59E0B', confirmed: '#3B82F6', shipped: '#8B5CF6', delivered: '#4ADE80', cancelled: '#EF4444',
}

export default function SellerDetailPage() {
  const { id } = useParams() as { id: string }
  const [profile, setProfile] = useState<Profile | null>(null)
  const [config, setConfig] = useState<Config | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [builds, setBuilds] = useState<ApkBuild[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editPlan, setEditPlan] = useState('')
  const [editLimit, setEditLimit] = useState(20)
  const [editAiReplyLimit, setEditAiReplyLimit] = useState(50)
  const [saved, setSaved] = useState(false)
  const [whatsapp, setWhatsapp] = useState<WhatsAppConnection | null>(null)
  const [waForm, setWaForm] = useState({ waba_id: '', phone_number_id: '', display_number: '' })
  const [waSaving, setWaSaving] = useState(false)

  function load() {
    fetch(`/api/platform/sellers/${id}`)
      .then(r => r.json())
      .then(d => {
        setProfile(d.profile)
        setConfig(d.config)
        setOrders(d.recent_orders ?? [])
        setBuilds(d.apk_builds ?? [])
        setWhatsapp(d.whatsapp_connection ?? null)
        setEditPlan(d.profile?.plan ?? 'free')
        setEditLimit(d.profile?.ai_credits ?? 0)
        setEditAiReplyLimit(d.profile?.ai_reply_limit ?? 50)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(load, [id])

  async function assignWhatsapp() {
    if (!waForm.waba_id || !waForm.phone_number_id) return
    setWaSaving(true)
    const res = await fetch(`/api/platform/sellers/${id}/whatsapp`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(waForm),
    })
    setWaSaving(false)
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error ?? 'Failed to assign WhatsApp number')
      return
    }
    setWaForm({ waba_id: '', phone_number_id: '', display_number: '' })
    load()
  }

  async function unassignWhatsapp() {
    if (!confirm('Unassign this WhatsApp number from the seller?')) return
    const res = await fetch(`/api/platform/sellers/${id}/whatsapp`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error ?? 'Failed to unassign WhatsApp number')
      return
    }
    load()
  }

  async function save() {
    setSaving(true)
    await fetch(`/api/platform/sellers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: editPlan, ai_credits: editLimit, ai_reply_limit: editAiReplyLimit }),
    })
    setProfile(prev => prev ? { ...prev, plan: editPlan, ai_credits: editLimit, ai_reply_limit: editAiReplyLimit } : prev)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>Loading…</div>
  }

  if (!profile) {
    return <div style={{ padding: 40, textAlign: 'center', color: '#EF4444' }}>Seller not found.</div>
  }

  const appUrl = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1100, margin: '0 auto' }}>
      <Link href="/platform" style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 5, marginBottom: 24 }}>
        ← All sellers
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Identity card */}
        <div style={{ padding: '24px 28px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: config?.primary_color ?? '#F72585', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
              {(config?.brand_name ?? profile.email).split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px' }}>{config?.brand_name ?? '—'}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{profile.email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Slug', value: config?.slug ? <a href={`${appUrl}/store/${config.slug}`} target="_blank" style={{ color: '#F472B6', textDecoration: 'none' }}>/{config.slug} ↗</a> : '—' },
              { label: 'WhatsApp', value: config?.whatsapp_number ?? '—' },
              { label: 'Instagram', value: config?.instagram_handle ? `@${config.instagram_handle}` : '—' },
              { label: 'Payment', value: config?.payment_method ?? '—' },
              { label: 'Joined', value: fmtDate(profile.created_at) },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                <span style={{ color: '#fff', textAlign: 'right' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan management card */}
        <div style={{ padding: '24px 28px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>Plan management</div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>Plan tier</label>
            <select
              value={editPlan}
              onChange={e => {
                const p = e.target.value
                setEditPlan(p)
                setEditLimit(PLANS[p as keyof typeof PLANS]?.ai_credits ?? 0)
                setEditAiReplyLimit(PLAN_AI_REPLY_LIMITS[p as keyof typeof PLAN_AI_REPLY_LIMITS] ?? 50)
              }}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', outline: 'none' }}
            >
              {['free', 'starter', 'growth', 'pro', 'enterprise'].map(p => (
                <option key={p} value={p} style={{ background: '#1a1a1d' }}>{p} — ₹{PLANS[p as keyof typeof PLANS]?.price_inr ?? 0}/mo</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>AI credits (try-on + AI photoshoot pool)</label>
            <input
              type="number"
              value={editLimit}
              onChange={e => setEditLimit(Number(e.target.value))}
              min={0}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6 }}>AI reply limit / month (WhatsApp + Instagram + Messenger)</label>
            <input
              type="number"
              value={editAiReplyLimit}
              onChange={e => setEditAiReplyLimit(Number(e.target.value))}
              min={0}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button
            onClick={save}
            disabled={saving}
            style={{ width: '100%', padding: '12px', borderRadius: 10, background: saved ? '#4ADE80' : '#F72585', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
          </button>

          <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>Current usage</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>AI credits remaining (try-on + AI photoshoot)</span>
              <span style={{ fontWeight: 700, color: profile.ai_credits <= 15 ? '#EF4444' : '#fff' }}>
                {profile.ai_credits}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>AI replies used</span>
              <span style={{ fontWeight: 700, color: (profile.ai_replies_used / (profile.ai_reply_limit || 1)) > 0.8 ? '#EF4444' : '#fff' }}>
                {profile.ai_replies_used} / {profile.ai_reply_limit}
              </span>
            </div>
            <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.08)' }}>
              <div style={{ height: '100%', borderRadius: 99, width: `${Math.min(100, Math.round((profile.ai_replies_used / (profile.ai_reply_limit || 1)) * 100))}%`, background: '#0084FF' }} />
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <a
              href={`/admin/${config?.slug}`}
              target="_blank"
              style={{ flex: 1, textAlign: 'center', padding: '9px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
            >
              View as seller ↗
            </a>
            <a
              href={`/store/${config?.slug}`}
              target="_blank"
              style={{ flex: 1, textAlign: 'center', padding: '9px', borderRadius: 10, background: 'rgba(247,37,133,0.1)', border: '1px solid rgba(247,37,133,0.25)', color: '#F472B6', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
            >
              View store ↗
            </a>
          </div>
        </div>
      </div>

      {/* Feature flags */}
      {config && (
        <div style={{ padding: '20px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 20, display: 'flex', gap: 24 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', alignSelf: 'center', flexShrink: 0 }}>Feature flags</span>
          {[
            { key: 'try_on_enabled', label: 'Try-on', value: config.try_on_enabled },
            { key: 'reviews_enabled', label: 'Reviews', value: config.reviews_enabled },
            { key: 'wishlist_enabled', label: 'Wishlist', value: config.wishlist_enabled },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: value ? '#4ADE80' : '#EF4444' }} />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{label}</span>
            </div>
          ))}
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginLeft: 'auto', alignSelf: 'center' }}>Seller controls these in Settings</span>
        </div>
      )}

      {/* WhatsApp number assignment */}
      <div style={{ padding: '20px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>WhatsApp automation</div>
        {whatsapp ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', flexShrink: 0 }} />
            <div style={{ fontSize: 13, color: '#fff' }}>{whatsapp.display_number ?? whatsapp.phone_number_id}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>WABA {whatsapp.waba_id}</div>
            <button onClick={unassignWhatsapp} style={{ marginLeft: 'auto', fontSize: 12, color: '#EF4444', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
              Unassign
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <input placeholder="WABA ID" value={waForm.waba_id} onChange={e => setWaForm({ ...waForm, waba_id: e.target.value })}
              style={{ flex: 1, padding: '9px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13, outline: 'none' }} />
            <input placeholder="Phone number ID" value={waForm.phone_number_id} onChange={e => setWaForm({ ...waForm, phone_number_id: e.target.value })}
              style={{ flex: 1, padding: '9px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13, outline: 'none' }} />
            <input placeholder="Display number (optional)" value={waForm.display_number} onChange={e => setWaForm({ ...waForm, display_number: e.target.value })}
              style={{ flex: 1, padding: '9px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13, outline: 'none' }} />
            <button onClick={assignWhatsapp} disabled={waSaving} style={{ padding: '9px 16px', borderRadius: 10, background: '#F72585', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {waSaving ? 'Assigning…' : 'Assign'}
            </button>
          </div>
        )}
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 10 }}>
          Both IDs come from the platform's shared WhatsApp Business Account in Meta Business Manager, after adding this seller's number to it.
        </div>
      </div>

      {/* Recent orders */}
      <div style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', marginBottom: 20 }}>
        <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>Recent orders</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Last 20</span>
        </div>
        {orders.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>No orders yet</div>
        ) : orders.map((order, i) => (
          <div key={order.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px', borderBottom: i < orders.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLOR[order.status] ?? '#6B7280', flexShrink: 0 }} />
            <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, minWidth: 100 }}>{fmtInr(order.total_inr)}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', flex: 1 }}>
              {order.items?.map(it => `${it.name} ×${it.quantity}`).join(', ')}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{fmtDate(order.created_at)}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: STATUS_COLOR[order.status] ?? '#6B7280', textTransform: 'capitalize' }}>{order.status}</div>
          </div>
        ))}
      </div>

      {/* APK builds */}
      {builds.length > 0 && (
        <div style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>APK builds</span>
          </div>
          {builds.map((build, i) => (
            <div key={build.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px', borderBottom: i < builds.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <div style={{ fontSize: 12, color: build.status === 'complete' ? '#4ADE80' : build.status === 'failed' ? '#EF4444' : '#F59E0B', fontWeight: 700, textTransform: 'capitalize', minWidth: 80 }}>{build.status}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Triggered {fmtDate(build.triggered_at)}</div>
              {build.apk_url && (
                <a href={build.apk_url} target="_blank" style={{ fontSize: 12, color: '#F472B6', textDecoration: 'none', marginLeft: 'auto' }}>Download APK ↗</a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
