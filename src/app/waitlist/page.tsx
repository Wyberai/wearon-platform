'use client'

import { useState } from 'react'
import { BrandLogo } from '@/components/BrandLogo'

const INK = '#111010'
const ACCENT = '#A6134A'
const GOLD = '#B8842E'

const FEATURES = [
  { label: 'YOUR STORE', title: 'From an Instagram or YouTube page to a real ecommerce website.', body: 'Keep posting the same way — we turn your existing content into a real storefront with a catalog, checkout, and your own domain. No rebuild, no redesign.' },
  { label: 'DASHBOARD', title: 'One dashboard for orders, inbox, and growth.', body: 'Orders, customer DMs, AI visibility, and analytics — all in one place, built for how you already run your page.' },
  { label: 'MOBILE APP', title: 'Your store, as your own branded app.', body: 'A real iOS and Android app with your name and your look — so your best buyers can shop you without opening Instagram at all.' },
  { label: 'AUTOMATION', title: 'DM to payment, without you lifting a finger.', body: '"I want this" in a DM becomes a size question, a payment link, and an order — automatically, day or night.' },
  { label: 'AI BUYER', title: '"What should I wear to a wedding?" — real products, real answers.', body: 'Buyers describe what they need in plain language and get matched products from your catalog — no filters, no scrolling.' },
  { label: 'TRY-ON', title: 'Buyers see themselves wearing it — before they buy.', body: 'One photo and buyers get a realistic preview of themselves in your outfit, right on the product page.' },
  { label: 'AI STUDIO', title: 'A model wears your clothes — no photoshoot.', body: 'Upload a flat-lay photo of any garment and get a photorealistic model wearing it, or a short reel-ready video — post straight to Instagram.' },
]

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [handle, setHandle] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError(null)
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, instagram_handle: handle, source: 'waitlist_page' }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong')
      setStatus('error')
      return
    }
    setStatus('done')
  }

  const form = status === 'done' ? (
    <div style={{ background: '#f8f8f6', borderRadius: 16, padding: '28px 24px' }}>
      <p style={{ fontSize: 16, fontWeight: 600 }}>You're on the list 🎉</p>
      <p style={{ fontSize: 14, color: `${INK}88`, marginTop: 6 }}>Check your inbox — we'll be in touch soon.</p>
    </div>
  ) : (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        style={{ padding: '14px 18px', borderRadius: 999, border: `1px solid ${INK}22`, fontSize: 15, outline: 'none' }}
      />
      <input
        type="text"
        value={handle}
        onChange={e => setHandle(e.target.value)}
        placeholder="Your Instagram handle (optional)"
        style={{ padding: '14px 18px', borderRadius: 999, border: `1px solid ${INK}22`, fontSize: 15, outline: 'none' }}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{ background: INK, color: '#fff', padding: '15px 28px', borderRadius: 999, fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', opacity: status === 'loading' ? 0.6 : 1 }}
      >
        {status === 'loading' ? 'Joining...' : 'Join the waitlist →'}
      </button>
      {error && <p style={{ color: '#dc2626', fontSize: 13 }}>{error}</p>}
    </form>
  )

  return (
    <div style={{ background: '#fff', color: INK }}>
      <style>{`
        .wl-feat-card { flex: 1 1 260px; max-width: 300px; }
        @media (max-width: 640px) { .wl-feat-card { flex-basis: 100% !important; max-width: 100% !important; } }
      `}</style>
      {/* HERO / CAPTURE */}
      <div style={{ position: 'relative', minHeight: '92vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 320, background: `linear-gradient(160deg, ${ACCENT}0d, ${GOLD}12)`, zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 40 }}>
            <BrandLogo size={24} />
            <span style={{ fontFamily: 'var(--font-marketing)', fontSize: 20, fontWeight: 500, letterSpacing: '-0.3px' }}>Instastarz</span>
          </div>

          <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: `${INK}66`, marginBottom: 16 }}>
            Opening August 21
          </p>
          <h1 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 400, lineHeight: 1.08, letterSpacing: '-1.5px', marginBottom: 20 }}>
            Be first in line to turn your Instagram page into a real online store.
          </h1>
          <p style={{ fontSize: 16, color: `${INK}99`, lineHeight: 1.6, marginBottom: 36 }}>
            A real storefront, real checkout, your own domain — join the waitlist and we'll email you the moment Instastarz opens.
          </p>

          {form}

          <p style={{ fontSize: 12, color: `${INK}44`, marginTop: 28 }}>
            No spam, ever. Just one email when we open the doors.
          </p>
        </div>
      </div>

      {/* FEATURES — everything shipping for the Aug 21 launch */}
      <div style={{ borderTop: `1px solid ${INK}0E`, padding: '80px 24px 96px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${INK}44`, marginBottom: 14, textAlign: 'center' }}>
            Everything launching August 21
          </p>
          <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 400, letterSpacing: '-1px', textAlign: 'center', marginBottom: 56, color: INK }}>
            Built for agents. Owned by you.
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px 48px' }}>
            {FEATURES.map((f, i) => {
              const swatch = i % 2 === 0 ? ACCENT : GOLD
              return (
                <div key={f.label} className="wl-feat-card" style={{ borderTop: `2.5px solid ${swatch}`, paddingTop: 24 }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: swatch, marginBottom: 14, fontWeight: 700 }}>{f.label}</p>
                  <h3 style={{ fontFamily: 'var(--font-marketing)', fontSize: 19, fontWeight: 500, letterSpacing: '-0.2px', lineHeight: 1.25, marginBottom: 10, color: INK }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: `${INK}77`, lineHeight: 1.75 }}>{f.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CLOSING CTA */}
      <div style={{ padding: '80px 24px 96px', background: INK }}>
        <div style={{ maxWidth: 420, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 400, letterSpacing: '-1px', lineHeight: 1.1, color: '#fff', marginBottom: 28 }}>
            Don't miss August 21.
          </h2>
          {status === 'done' ? (
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>You're on the list — see you at launch 🎉</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ padding: '14px 18px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 15, outline: 'none' }}
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{ background: '#fff', color: INK, padding: '15px 28px', borderRadius: 999, fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', opacity: status === 'loading' ? 0.6 : 1 }}
              >
                {status === 'loading' ? 'Joining...' : 'Join the waitlist →'}
              </button>
              {error && <p style={{ color: '#fca5a5', fontSize: 13 }}>{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
