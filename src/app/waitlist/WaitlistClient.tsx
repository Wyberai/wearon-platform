'use client'

import { useState } from 'react'
import { BrandLogo } from '@/components/BrandLogo'
import type { Locale } from '@/lib/i18n/config'
import { WAITLIST_DICT } from '@/lib/i18n/dict/waitlist'
import { HOME_DICT } from '@/lib/i18n/dict/home'

const INK = '#111010'
const ACCENT = '#A6134A'
const GOLD = '#B8842E'

// Same launch-video creative used in the Meta ad campaigns, one cut per
// language, hosted in the marketing-assets bucket (separate from
// wearon-assets, which is image-only and 10MB-capped — these are ~34MB).
const LAUNCH_VIDEO_URLS: Record<Locale, string> = {
  en: 'https://dhecdsoppqwpehrmklxf.supabase.co/storage/v1/object/public/marketing-assets/launch-videos/en-1080p.mp4',
  hi: 'https://dhecdsoppqwpehrmklxf.supabase.co/storage/v1/object/public/marketing-assets/launch-videos/hi-1080p.mp4',
  kn: 'https://dhecdsoppqwpehrmklxf.supabase.co/storage/v1/object/public/marketing-assets/launch-videos/kn-1080p.mp4',
  te: 'https://dhecdsoppqwpehrmklxf.supabase.co/storage/v1/object/public/marketing-assets/launch-videos/te-1080p.mp4',
  mr: 'https://dhecdsoppqwpehrmklxf.supabase.co/storage/v1/object/public/marketing-assets/launch-videos/mr-1080p.mp4',
  ta: 'https://dhecdsoppqwpehrmklxf.supabase.co/storage/v1/object/public/marketing-assets/launch-videos/ta-1080p.mp4',
}

// Locale comes in as a server-resolved prop (from the ?lang= URL param or
// the cookie) rather than being read client-side — reading document.cookie
// in a useState initializer caused a hydration mismatch, since the server
// render has no cookie to check yet but the client immediately does.
export function WaitlistClient({ locale }: { locale: Locale }) {
  const t = WAITLIST_DICT[locale]
  const home = HOME_DICT[locale]
  const FEATURES = home.features
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError(null)
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'waitlist_page', locale }),
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
      <p style={{ fontSize: 16, fontWeight: 600 }}>{t.successTitle}</p>
      <p style={{ fontSize: 14, color: `${INK}88`, marginTop: 6 }}>{t.successBody}</p>
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
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{ background: INK, color: '#fff', padding: '15px 28px', borderRadius: 999, fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', opacity: status === 'loading' ? 0.6 : 1 }}
      >
        {status === 'loading' ? t.joiningButton : t.joinButton}
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
            <BrandLogo size={24} animated />
            <span style={{ fontFamily: 'var(--font-marketing)', fontSize: 20, fontWeight: 500, letterSpacing: '-0.3px' }}>Instastarz</span>
          </div>

          <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: `${INK}66`, marginBottom: 16 }}>
            {t.launchBadge}
          </p>
          <h1 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 400, lineHeight: 1.08, letterSpacing: '-1.5px', marginBottom: 20 }}>
            {t.heroHeadline}
          </h1>
          <p style={{ fontSize: 16, color: `${INK}99`, lineHeight: 1.6, marginBottom: 36 }}>
            {t.heroSubcopy}
          </p>

          {form}

          <p style={{ fontSize: 12, color: `${INK}44`, marginTop: 28 }}>
            {t.noSpamNote}
          </p>
        </div>
      </div>

      {/* LAUNCH VIDEO — same creative running in the ad campaigns, in this visitor's language */}
      <div style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <video
            key={locale}
            controls
            playsInline
            preload="metadata"
            style={{ width: '100%', borderRadius: 20, display: 'block', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
          >
            <source src={LAUNCH_VIDEO_URLS[locale]} type="video/mp4" />
          </video>
        </div>
      </div>

      {/* FEATURES — everything shipping for the Aug 21 launch */}
      <div style={{ borderTop: `1px solid ${INK}0E`, padding: '80px 24px 96px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${INK}44`, marginBottom: 14, textAlign: 'center' }}>
            {t.featuresEyebrow}
          </p>
          <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 400, letterSpacing: '-1px', textAlign: 'center', marginBottom: 56, color: INK }}>
            {t.featuresHeadline}
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
            {t.closingHeadline}
          </h2>
          {status === 'done' ? (
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>{t.closingDoneMessage}</p>
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
                {status === 'loading' ? t.joiningButton : t.joinButton}
              </button>
              {error && <p style={{ color: '#fca5a5', fontSize: 13 }}>{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
