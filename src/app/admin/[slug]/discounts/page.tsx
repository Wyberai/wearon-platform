'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface DiscountCode {
  id: string
  code: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
  min_order_inr: number | null
  max_uses: number | null
  uses_count: number
  expires_at: string | null
  is_active: boolean
  created_at: string
}

const AI_SUGGESTIONS = [
  { label: 'Welcome 10%', desc: 'First-order discount', code: 'WELCOME10', type: 'percent' as const, value: 10, min: null, uses: null },
  { label: 'Flash 20%', desc: '24-hour flash sale', code: 'FLASH20', type: 'percent' as const, value: 20, min: 999, uses: 100 },
  { label: 'Win-back ₹200', desc: 'Re-engage lapsed buyers', code: 'COMEBACK200', type: 'fixed' as const, value: 200, min: 1500, uses: null },
  { label: 'Referral 15%', desc: 'Friend referral reward', code: 'REFER15', type: 'percent' as const, value: 15, min: null, uses: null },
]

export default function DiscountsPage() {
  const { slug } = useParams() as { slug: string }
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    code: '', discount_type: 'percent' as 'percent' | 'fixed', discount_value: '',
    min_order_inr: '', max_uses: '', expires_at: '',
  })

  useEffect(() => {
    fetch(`/api/admin/discounts?slug=${slug}`)
      .then(r => r.json())
      .then(d => { setCodes(d.codes ?? []); setLoading(false) })
  }, [slug])

  function applySuggestion(s: typeof AI_SUGGESTIONS[0]) {
    setForm({
      code: s.code,
      discount_type: s.type,
      discount_value: String(s.value),
      min_order_inr: s.min ? String(s.min) : '',
      max_uses: s.uses ? String(s.uses) : '',
      expires_at: '',
    })
    setShowForm(true)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/discounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, ...form, discount_value: Number(form.discount_value), min_order_inr: form.min_order_inr ? Number(form.min_order_inr) : null, max_uses: form.max_uses ? Number(form.max_uses) : null, expires_at: form.expires_at || null }),
    })
    const data = await res.json()
    if (data.code) {
      setCodes(prev => [data.code, ...prev])
      setForm({ code: '', discount_type: 'percent', discount_value: '', min_order_inr: '', max_uses: '', expires_at: '' })
      setShowForm(false)
    }
    setSaving(false)
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch('/api/admin/discounts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_active: !current }) })
    setCodes(prev => prev.map(c => c.id === id ? { ...c, is_active: !current } : c))
  }

  async function deleteCode(id: string) {
    await fetch(`/api/admin/discounts?id=${id}`, { method: 'DELETE' })
    setCodes(prev => prev.filter(c => c.id !== id))
  }

  if (loading) return <div className="text-gray-400 text-sm">Loading…</div>

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discount Codes</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage promo codes for your store.</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition-colors">
          {showForm ? 'Cancel' : '+ New Code'}
        </button>
      </div>

      {/* AI suggestions */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">✦ AI-suggested codes</p>
        <div className="grid grid-cols-2 gap-2">
          {AI_SUGGESTIONS.map(s => (
            <button key={s.code} onClick={() => applySuggestion(s)}
              className="text-left p-3 rounded-lg border border-gray-100 hover:border-pink-300 hover:bg-pink-50 transition-all">
              <p className="text-sm font-semibold text-gray-800">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
          <h2 className="font-semibold text-gray-900 mb-4">New Discount Code</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Code</label>
                <input type="text" required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  placeholder="SUMMER20"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                <select value={form.discount_type} onChange={e => setForm(f => ({ ...f, discount_type: e.target.value as 'percent' | 'fixed' }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                  <option value="percent">Percentage (%)</option>
                  <option value="fixed">Fixed amount (₹)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Value {form.discount_type === 'percent' ? '(%)' : '(₹)'}</label>
                <input type="number" required min="1" value={form.discount_value} onChange={e => setForm(f => ({ ...f, discount_value: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Min order (₹)</label>
                <input type="number" min="0" value={form.min_order_inr} onChange={e => setForm(f => ({ ...f, min_order_inr: e.target.value }))}
                  placeholder="Optional"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Max uses</label>
                <input type="number" min="1" value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                  placeholder="Unlimited"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Expires</label>
              <input type="date" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="bg-pink-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50">
                {saving ? 'Creating…' : 'Create Code'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Codes list */}
      {codes.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-3xl mb-2">🏷️</p>
          <p className="text-sm">No discount codes yet. Create one above or pick an AI suggestion.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
          {codes.map(c => {
            const expired = c.expires_at && new Date(c.expires_at) < new Date()
            const depleted = c.max_uses && c.uses_count >= c.max_uses
            const statusLabel = !c.is_active ? 'Inactive' : expired ? 'Expired' : depleted ? 'Depleted' : 'Active'
            const statusColor = statusLabel === 'Active' ? 'text-green-600 bg-green-50 border-green-100' : 'text-gray-400 bg-gray-50 border-gray-100'
            return (
              <div key={c.id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-gray-900 text-sm">{c.code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs border ${statusColor}`}>{statusLabel}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {c.discount_type === 'percent' ? `${c.discount_value}% off` : `₹${c.discount_value} off`}
                    {c.min_order_inr ? ` · min ₹${c.min_order_inr}` : ''}
                    {c.max_uses ? ` · ${c.uses_count}/${c.max_uses} used` : ` · ${c.uses_count} used`}
                    {c.expires_at ? ` · expires ${new Date(c.expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigator.clipboard.writeText(c.code)}
                    className="text-xs px-2 py-1 border border-gray-200 rounded text-gray-500 hover:border-gray-400">Copy</button>
                  <button onClick={() => toggleActive(c.id, c.is_active)}
                    className="text-xs px-2 py-1 border border-gray-200 rounded text-gray-500 hover:border-gray-400">
                    {c.is_active ? 'Disable' : 'Enable'}
                  </button>
                  <button onClick={() => deleteCode(c.id)}
                    className="text-xs px-2 py-1 border border-gray-200 rounded text-red-400 hover:border-red-300">Del</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
