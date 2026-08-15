'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { FONTS } from '@/lib/constants'
import { THEMES, getTheme, FLAGSHIP_DEMO_SLUG } from '@/lib/themes'
import type { BrandVoice } from '@/lib/types'

const TONE_OPTIONS: { value: BrandVoice['tone']; label: string; desc: string }[] = [
  { value: 'playful',       label: 'Playful',       desc: 'Fun, energetic, uses humour' },
  { value: 'sophisticated', label: 'Sophisticated',  desc: 'Elegant, refined, confident' },
  { value: 'bold',          label: 'Bold',           desc: 'Direct, strong, action-driven' },
  { value: 'minimal',       label: 'Minimal',        desc: 'Clean, restrained, lets product shine' },
  { value: 'warm',          label: 'Warm',           desc: 'Personal, caring, like a friend' },
]

const AESTHETIC_OPTIONS = [
  'Coastal', 'Quiet Luxury', 'Y2K', 'Dark Luxury', 'Artisanal',
  'Streetwear', 'Cottagecore', 'Preppy', 'Boho', 'Editorial',
]

const OCCASION_OPTIONS = [
  'Beach', 'Wedding Guest', 'Office', 'Date Night', 'Travel',
  'Winter', 'Festival', 'Brunch', 'Gym', 'Casual',
]

const DEFAULT_BRAND_VOICE: BrandVoice = {
  tone: 'warm',
  aesthetic: [],
  buyer_philosophy: '',
  occasion_tags: [],
}

// Flagship (bespoke, AI-native) themes surfaced first — they're a
// fundamentally different offering from the cosmetic-only presets, not just
// another grid item among twelve.
const SORTED_THEMES = [...THEMES].sort((a, b) => {
  const aFlagship = FLAGSHIP_DEMO_SLUG[a.id] ? 0 : 1
  const bFlagship = FLAGSHIP_DEMO_SLUG[b.id] ? 0 : 1
  return aFlagship - bFlagship
})

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
  const [brandVoice, setBrandVoice] = useState<BrandVoice>(DEFAULT_BRAND_VOICE)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/config?slug=${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.config) {
          setConfig({ ...config, ...data.config })
          if (data.config.brand_voice) setBrandVoice(data.config.brand_voice)
        }
        setLoading(false)
      })
  }, [slug])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, ...config, brand_voice: brandVoice }),
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
          <p className="text-xs text-gray-500 mb-4">
            Flagship themes (marked <span className="font-semibold text-gray-700">LIVE</span>) replace your whole store with a bespoke design and AI feature — the rest just set colors and font below, which you can tweak after.
          </p>
          <div className="grid grid-cols-5 gap-3">
            {SORTED_THEMES.map(t => {
              const active = t.id === config.theme_id
              const demoSlug = FLAGSHIP_DEMO_SLUG[t.id]
              return (
                <div key={t.id} className="text-left group">
                  <button
                    type="button"
                    onClick={() => applyTheme(t.id)}
                    title={t.blurb}
                    className="w-full text-left"
                  >
                    <div
                      className="aspect-[4/5] rounded-lg overflow-hidden relative"
                      style={{ outline: active ? '2px solid #A6134A' : '1px solid #e5e7eb', outlineOffset: 2 }}
                    >
                      <img src={t.previewImage} alt={t.name} className="w-full h-full object-cover" />
                      {demoSlug && (
                        <span className="absolute top-1.5 left-1.5 bg-gray-900 text-white text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded">
                          LIVE
                        </span>
                      )}
                      {/* Color swatch strip */}
                      <div className="absolute bottom-0 left-0 right-0 flex h-4">
                        <div className="flex-1" style={{ background: t.palette.bg }} />
                        <div className="flex-1" style={{ background: t.palette.accent }} />
                        <div className="flex-1" style={{ background: t.palette.ink }} />
                      </div>
                    </div>
                    <p className={`text-xs mt-1.5 ${active ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>{t.name}</p>
                  </button>
                  <a
                    href={demoSlug ? `/store/${demoSlug}` : `/store/demo?theme=${t.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-pink-500 hover:underline"
                  >Preview →</a>
                </div>
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
              placeholder="e.g. Curated fashion for the modern woman"
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

        {/* Brand Voice */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
          <div>
            <h2 className="font-semibold text-gray-900">Brand Voice</h2>
            <p className="text-xs text-gray-500 mt-0.5">Every AI output — captions, replies, product copy — will sound like your brand.</p>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TONE_OPTIONS.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setBrandVoice(v => ({ ...v, tone: t.value }))}
                  className={`text-left p-3 rounded-lg border-2 transition-all ${brandVoice.tone === t.value ? 'border-pink-500 bg-pink-50' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <p className={`text-sm font-semibold ${brandVoice.tone === t.value ? 'text-pink-700' : 'text-gray-800'}`}>{t.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Aesthetic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aesthetic <span className="text-gray-400 font-normal">(pick up to 3)</span></label>
            <div className="flex flex-wrap gap-2">
              {AESTHETIC_OPTIONS.map(a => {
                const active = brandVoice.aesthetic.includes(a)
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setBrandVoice(v => ({
                      ...v,
                      aesthetic: active
                        ? v.aesthetic.filter(x => x !== a)
                        : v.aesthetic.length < 3 ? [...v.aesthetic, a] : v.aesthetic,
                    }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? 'bg-pink-600 border-pink-600 text-white' : 'border-gray-200 text-gray-600 hover:border-pink-400'}`}
                  >
                    {a}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Buyer philosophy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">We curate for…</label>
            <input
              type="text"
              value={brandVoice.buyer_philosophy}
              onChange={e => setBrandVoice(v => ({ ...v, buyer_philosophy: e.target.value }))}
              placeholder="e.g. the modern professional who wants effortless style"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Occasions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Occasions <span className="text-gray-400 font-normal">(select all that apply)</span></label>
            <div className="flex flex-wrap gap-2">
              {OCCASION_OPTIONS.map(o => {
                const active = brandVoice.occasion_tags.includes(o)
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setBrandVoice(v => ({
                      ...v,
                      occasion_tags: active
                        ? v.occasion_tags.filter(x => x !== o)
                        : [...v.occasion_tags, o],
                    }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${active ? 'bg-gray-900 border-gray-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                  >
                    {o}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Preview */}
          {(brandVoice.tone || brandVoice.aesthetic.length > 0) && (
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 italic border border-gray-100">
              <span className="font-semibold not-italic text-gray-700 block mb-0.5">AI will sound like:</span>
              {brandVoice.tone === 'playful' && '"Love that pick! The Satin Slip Maxi is giving serious date-night energy 💫 Grab it in champagne before it sells out!"'}
              {brandVoice.tone === 'sophisticated' && '"An excellent choice. The Satin Slip Maxi Dress pairs beautifully with minimal accessories for an evening event."'}
              {brandVoice.tone === 'bold' && '"This one sells out fast. Order in your size now — the Satin Slip Maxi is a staple."'}
              {brandVoice.tone === 'minimal' && '"The slip maxi. $89. It works."'}
              {brandVoice.tone === 'warm' && '"Oh this one is so good! The Satin Slip Maxi is honestly one of my favourite pieces — it works for so many occasions."'}
            </div>
          )}
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
