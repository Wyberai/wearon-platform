'use client'

import Link from 'next/link'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useLocale } from '@/lib/i18n/use-locale'
import { BrandLogo } from '@/components/BrandLogo'

const INK = '#171512'

// Sticky, not fixed — it occupies its normal space in flow (pushing the
// announcement bar + hero down naturally) and only sticks once scrolled
// past. A fixed nav here previously floated on top of the announcement
// bar above it, overlapping both into an unreadable mess on mobile.
export function MarketingNav() {
  const locale = useLocale()

  return (
    <nav
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(250,247,243,0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${INK}14`,
      }}
    >
      <div style={{ maxWidth: 1240, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-marketing)', fontSize: 20, fontWeight: 500, letterSpacing: '-0.3px', color: INK, textDecoration: 'none' }}>
          <BrandLogo size={20} ink={INK} animated />
          Instastarz
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <Link href="/themes" className="wo-hover-fade" style={{ fontSize: 14, color: `${INK}cc`, textDecoration: 'none' }}>
            Themes
          </Link>
          <Link href="/auth/login" className="wo-hover-fade" style={{ fontSize: 14, color: `${INK}cc`, textDecoration: 'none' }}>
            Login
          </Link>
          <LanguageSwitcher current={locale} />
          <Link
            href="/auth/signup"
            className="wo-hover-lift"
            style={{ background: INK, color: '#fff', padding: '9px 20px', borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  )
}
