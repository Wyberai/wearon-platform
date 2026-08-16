'use client'

import type { Theme } from '@/lib/themes'
import { HEADING_TYPE } from '@/lib/themes'
import { FONTS } from '@/lib/constants'

// Marketing-preview-only mockup of the seller admin dashboard — reachable
// from the "Dashboard" tab while previewing a theme. Numbers are static
// illustrative data (never real), but the palette/font/heading-style come
// from the same Theme tokens that drive the real storefront, so each of the
// 12 flagship themes gets its own look here without a bespoke layout each.
export function ThemedDashboardMock({ theme, brandName }: { theme: Theme; brandName: string }) {
  const { bg, ink, accent, card } = theme.palette
  const font = FONTS[theme.font as keyof typeof FONTS]?.css ?? 'sans-serif'
  const heading = HEADING_TYPE[theme.headingStyle]

  const kpis = [
    { label: 'Store visits (30d)', value: '4,821' },
    { label: 'Products', value: '48' },
    { label: 'Orders (30d)', value: '312' },
    { label: 'Revenue (30d)', value: '₹6,84,000' },
  ]
  const bars = [40, 55, 48, 62, 58, 70, 65, 80, 74, 88, 82, 95, 90, 100]
  const inbox = [
    { channel: 'WhatsApp', from: 'Priya S.', text: 'Is this available in size M?' },
    { channel: 'Instagram', from: '@ananya.k', text: 'Love this! Can I get it in blue?' },
    { channel: 'Messenger', from: 'Rohit M.', text: 'When will my order ship?' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: bg, color: ink, fontFamily: font }}>
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '32px 24px 64px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: `${ink}66`, marginBottom: 6 }}>Mockup data — for preview only</p>
        <h1 style={{
          fontFamily: font, fontWeight: heading.weight, textTransform: heading.case as React.CSSProperties['textTransform'],
          letterSpacing: heading.tracking, fontSize: 'clamp(22px, 3vw, 30px)', margin: '0 0 28px',
        }}>
          {brandName} — Dashboard
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 28 }}>
          {kpis.map(k => (
            <div key={k.label} style={{ background: card, borderRadius: 16, padding: '18px 20px' }}>
              <p style={{ fontSize: 12, color: `${ink}77`, margin: '0 0 8px' }}>{k.label}</p>
              <p style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{k.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: card, borderRadius: 16, padding: '20px 22px', marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 16px' }}>Sales, last 14 days</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 90 }}>
            {bars.map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: accent, borderRadius: '4px 4px 0 0', opacity: 0.85 }} />
            ))}
          </div>
        </div>

        <div style={{ background: card, borderRadius: 16, padding: '20px 22px' }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 14px' }}>Inbox — AI auto-replies live</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {inbox.map(m => (
              <div key={m.from} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingBottom: 10, borderBottom: `1px solid ${ink}12` }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: accent, flexShrink: 0, width: 76 }}>{m.channel}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 2px' }}>{m.from}</p>
                  <p style={{ fontSize: 13, color: `${ink}88`, margin: 0 }}>{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
