'use client'

import { useState } from 'react'
import { BrandLogo } from '@/components/BrandLogo'

const INK = '#111010'
const ACCENT = '#A6134A'
const GOLD = '#B8842E'

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

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: INK, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
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

        {status === 'done' ? (
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
        )}

        <p style={{ fontSize: 12, color: `${INK}44`, marginTop: 28 }}>
          No spam, ever. Just one email when we open the doors.
        </p>
      </div>
    </div>
  )
}
