'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const INK = '#171512'

// The old nav was position:absolute inside the hero only — scroll past it
// and there's no way back to the top or to "Get started" at all. This stays
// fixed and crossfades from transparent-on-hero to a solid bar once scrolled.
export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(250,247,243,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? `1px solid ${INK}14` : '1px solid transparent',
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-marketing)', fontSize: 22, fontWeight: 500, letterSpacing: '-0.3px', color: scrolled ? INK : '#fff', textDecoration: 'none', transition: 'color 0.25s ease' }}>
          Instastarz
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <Link href="/themes" className="wo-hover-fade" style={{ fontSize: 14, color: scrolled ? `${INK}cc` : 'rgba(255,255,255,0.85)', textDecoration: 'none', transition: 'color 0.25s ease' }}>
            Themes
          </Link>
          <Link href="/auth/login" className="wo-hover-fade" style={{ fontSize: 14, color: scrolled ? `${INK}cc` : 'rgba(255,255,255,0.85)', textDecoration: 'none', transition: 'color 0.25s ease' }}>
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="wo-hover-lift"
            style={{
              background: scrolled ? INK : '#fff',
              color: scrolled ? '#fff' : INK,
              padding: '9px 20px', borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: 'none',
              transition: 'background 0.25s ease, color 0.25s ease',
            }}
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  )
}
