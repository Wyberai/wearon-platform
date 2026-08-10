'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { FONTS } from '@/lib/constants'
import { THEMES, getTheme } from '@/lib/themes'

export default function CustomizePage() {
  const { slug } = useParams() as { slug: string }
  const [config, setConfig] = useState({
    brand_name: '',
    tagline: '',
    primary_color: '#E91E63',
    secondary_color: '#FCE4EC',
    accent_color: '#880E4F',
    background_color: '#FFFFFF',
    font_family: 'poppins',
    theme_id: 'editorial',
    whatsapp_number: '',
    instagram_handle: '',
    payment_method: 'whatsapp_order',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/config?slug=${slug}`)
      .then(r => r.json())
      .then(data => { if (data.config) setConfig({ ...config, ...data.config }); setLoading(false) })
  }, [slug])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, ...config }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function applyTheme(themeId: string) {
    const t = getTheme(themeId)
    setConfig({
      ...config,
      theme_id: themeId,
      primary_color: t.palette.accent,
      secondary_color: t.palette.card,
      accent_color: t.palette.accent,
      background_color: t.palette.bg,
      font_family: t.font,
    })
  }

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Customize Your Store</h1>
      <p className="text-gray-500 text-sm mb-8">Changes appear on your store within seconds.</p>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Theme picker */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Store Theme</h2>
          <p className="text-xs text-gray-500 mb-4">Picking a theme sets colors and font below — tweak them after if you want.</p>
          <div className="grid grid-cols-5 gap-3">
            {THEMES.map(t => {
              const active = t.id === config.theme_id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyTheme(t.id)}
                  title={t.blurb}
                  className="text-left"
                >
                  <div
                    className="aspect-[4/5] rounded-lg overflow-hidden relative"
                    style={{ outline: active ? '2px solid #A6134A' : '1px solid #e5e7eb', outlineOffset: 2 }}
                  >
                    <img src={t.previewImage} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <p className={`text-xs mt-1.5 ${active ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{t.name}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Brand basics */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Brand Identity</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input type="text" value={config.brand_name} onChange={e => setConfig({ ...config, brand_name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input type="text" value={config.tagline} onChange={e => setConfig({ ...config, tagline: e.target.value })}
              placeholder="e.g. Handpicked kurtas for every occasion"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Font Style</label>
            <select value={config.font_family} onChange={e => setConfig({ ...config, font_family: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
              {Object.entries(FONTS).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Brand Colors</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'primary_color', label: 'Primary Color' },
              { key: 'secondary_color', label: 'Secondary Color' },
              { key: 'accent_color', label: 'Accent Color' },
              { key: 'background_color', label: 'Background Color' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={(config as Record<string, string>)[key]}
                    onChange={e => setConfig({ ...config, [key]: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                  <span className="text-sm text-gray-500 font-mono">{(config as Record<string, string>)[key]}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Live preview */}
          <div className="rounded-lg overflow-hidden border border-gray-200 mt-4">
            <div style={{ backgroundColor: config.primary_color }} className="px-4 py-3">
              <span className="text-white font-bold text-sm">{config.brand_name || 'Your Store'}</span>
            </div>
            <div style={{ backgroundColor: config.background_color }} className="px-4 py-3 flex gap-2">
              <div style={{ backgroundColor: config.secondary_color, color: config.primary_color }} className="rounded-lg px-3 py-1.5 text-xs font-medium">
                Category
              </div>
              <button style={{ backgroundColor: config.primary_color }} className="rounded-lg px-3 py-1.5 text-xs text-white font-medium">
                Try On
              </button>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Contact & Social</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
            <input type="tel" value={config.whatsapp_number} onChange={e => setConfig({ ...config, whatsapp_number: e.target.value })}
              placeholder="+91 98765 43210"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram Handle</label>
            <input type="text" value={config.instagram_handle} onChange={e => setConfig({ ...config, instagram_handle: e.target.value })}
              placeholder="@yourbrand"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Order Method</label>
            <select value={config.payment_method} onChange={e => setConfig({ ...config, payment_method: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
              <option value="whatsapp_order">WhatsApp Order (recommended)</option>
              <option value="razorpay">Razorpay (your own account)</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50">
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
