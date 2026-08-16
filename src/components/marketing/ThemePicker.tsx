'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { StorePreviewCapture } from './StorePreviewCapture'
import { StickyCaptureBar } from './StickyCaptureBar'

export interface ThemeTile {
  name: string
  sub: string
  img: string
  slug: string
}

// Drives the homepage's "pick a look, drop your email, see your store" flow.
// Selecting a tile doesn't navigate away anymore — it arms the capture box
// below with that theme, matching the founder's Shopify-inspired ask
// (theme first, then a single email field, then an instant live preview).
export function ThemePicker({ tiles }: { tiles: ThemeTile[] }) {
  const [selectedSlug, setSelectedSlug] = useState(tiles[0].slug)
  const selected = tiles.find(t => t.slug === selectedSlug) ?? tiles[0]

  // Shopify keeps its email field visible the entire scroll — once the
  // inline capture box below has scrolled UP out of view (not before we've
  // even reached it), a persistent bottom bar takes over so the same
  // conversion action stays reachable through every section after it.
  const [scrolledPast, setScrolledPast] = useState(false)
  const inlineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function checkPosition() {
      const el = inlineRef.current
      if (!el) return
      setScrolledPast(el.getBoundingClientRect().bottom < 0)
    }
    checkPosition()
    window.addEventListener('scroll', checkPosition, { passive: true })
    window.addEventListener('resize', checkPosition)
    return () => {
      window.removeEventListener('scroll', checkPosition)
      window.removeEventListener('resize', checkPosition)
    }
  }, [])

  return (
    <>
      <div className="wo-tile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
        {tiles.map(t => {
          const active = t.slug === selectedSlug
          return (
            <div
              key={t.slug}
              className="wo-tile"
              onClick={() => setSelectedSlug(t.slug)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedSlug(t.slug) }}
              style={{
                position: 'relative', cursor: 'pointer', aspectRatio: '3/4', overflow: 'hidden',
                outline: active ? '3px solid #A6134A' : 'none', outlineOffset: -3,
              }}
            >
              <img src={t.img} alt={t.name} className="wo-tile-img" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.75) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 22px 24px' }}>
                <p style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{t.sub}</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{t.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: active ? '#F9A8D4' : '#fff', fontWeight: 700 }}>
                    {active ? 'SELECTED ✓' : 'TAP TO PICK'}
                  </span>
                  <Link
                    href={`/store/${t.slug}`}
                    target="_blank"
                    onClick={e => e.stopPropagation()}
                    style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', textDecoration: 'underline', flexShrink: 0 }}
                  >
                    Live demo →
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div ref={inlineRef} style={{ marginTop: 40, padding: '0 24px' }}>
        <StorePreviewCapture theme={selected} />
      </div>
      {scrolledPast && <StickyCaptureBar theme={selected} />}
    </>
  )
}
