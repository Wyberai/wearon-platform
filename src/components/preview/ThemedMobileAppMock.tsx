'use client'

import type { Theme } from '@/lib/themes'
import { HEADING_TYPE } from '@/lib/themes'
import { FONTS } from '@/lib/constants'
import type { ThemeProduct } from '@/lib/flagship/types'

// Marketing-preview-only mockup of the seller's mobile app — a phone-frame
// graphic showing a themed mini storefront using that theme's own real
// catalog images, so it feels like an actual screenshot rather than a
// generic placeholder. Reachable from the "Mobile app" preview tab.
export function ThemedMobileAppMock({ theme, brandName, products }: { theme: Theme; brandName: string; products: ThemeProduct[] }) {
  const { bg, ink, accent, card } = theme.palette
  const font = FONTS[theme.font as keyof typeof FONTS]?.css ?? 'sans-serif'
  const heading = HEADING_TYPE[theme.headingStyle]
  const items = products.slice(0, 6)

  return (
    <div style={{ minHeight: '100vh', background: '#e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{
        width: 300, height: 620, borderRadius: 40, background: '#111', padding: 12,
        boxShadow: '0 30px 60px -20px rgba(0,0,0,0.4)', flexShrink: 0,
      }}>
        <div style={{ width: '100%', height: '100%', borderRadius: 30, background: bg, overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: font, color: ink }}>
          {/* Status bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px 4px', fontSize: 11, fontWeight: 600 }}>
            <span>9:41</span>
            <span>&#9679;&#9679;&#9679; Wi-Fi 100%</span>
          </div>

          {/* App header */}
          <div style={{ padding: '10px 18px 14px', borderBottom: `1px solid ${ink}12`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{
              fontFamily: font, fontWeight: heading.weight, textTransform: heading.case as React.CSSProperties['textTransform'],
              letterSpacing: heading.tracking, fontSize: 15, margin: 0,
            }}>{brandName}</p>
            <div style={{ display: 'flex', gap: 10, fontSize: 14 }}>
              <span>&#128269;</span>
              <span>&#128092;</span>
            </div>
          </div>

          {/* Product grid */}
          <div style={{ flex: 1, overflow: 'hidden', padding: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, alignContent: 'start' }}>
            {items.map(p => (
              <div key={p.id} style={{ background: card, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ aspectRatio: '1', background: '#ddd', position: 'relative' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ padding: '7px 9px' }}>
                  <p style={{ fontSize: 10.5, fontWeight: 600, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                  <p style={{ fontSize: 10.5, fontWeight: 700, color: accent, margin: 0 }}>₹{p.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom nav */}
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 0 14px', borderTop: `1px solid ${ink}12` }}>
            {['Home', 'Shop', 'Bag', 'You'].map((label, i) => (
              <span key={label} style={{ fontSize: 9.5, fontWeight: 600, color: i === 0 ? accent : `${ink}55` }}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
