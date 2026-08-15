import Link from 'next/link'
import type { Metadata } from 'next'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { AUGUST_CAMPAIGN } from '@/lib/august/catalog'

export const metadata: Metadata = {
  title: 'Flagship Themes — WearOn',
  description: 'Twelve flagship storefront themes, one for every month. Preview them live, then build your store on the one that\'s you.',
}

const INK = '#171512'
const BG = '#FAF7F3'
const ACCENT = '#A6134A'

interface MonthTheme {
  month: string
  id: string
  name: string
  blurb: string
  image: string
  storeSlug?: string
  live: boolean
}

const MONTHS: MonthTheme[] = [
  { month: 'January', id: 'january', name: 'Quiet Intelligence', blurb: 'Editorial calm, an AI stylist, quiet-luxury essentials — our most advanced storefront yet.', image: AUGUST_CAMPAIGN.hero, storeSlug: 'august', live: true },
  { month: 'February', id: 'february', name: 'Coming soon', blurb: 'A new flagship theme, built next.', image: '', live: false },
  { month: 'March', id: 'march', name: 'Coming soon', blurb: 'A new flagship theme, built next.', image: '', live: false },
  { month: 'April', id: 'april', name: 'Coming soon', blurb: 'A new flagship theme, built next.', image: '', live: false },
  { month: 'May', id: 'may', name: 'Coming soon', blurb: 'A new flagship theme, built next.', image: '', live: false },
  { month: 'June', id: 'june', name: 'Coming soon', blurb: 'A new flagship theme, built next.', image: '', live: false },
  { month: 'July', id: 'july', name: 'Coming soon', blurb: 'A new flagship theme, built next.', image: '', live: false },
  { month: 'August', id: 'august-theme', name: 'Coming soon', blurb: 'A new flagship theme, built next.', image: '', live: false },
  { month: 'September', id: 'september', name: 'Coming soon', blurb: 'A new flagship theme, built next.', image: '', live: false },
  { month: 'October', id: 'october', name: 'Coming soon', blurb: 'A new flagship theme, built next.', image: '', live: false },
  { month: 'November', id: 'november', name: 'Coming soon', blurb: 'A new flagship theme, built next.', image: '', live: false },
  { month: 'December', id: 'december', name: 'Coming soon', blurb: 'A new flagship theme, built next.', image: '', live: false },
]

export default function ThemesPage() {
  return (
    <>
      <style>{`
        .th-hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .th-hover-lift:hover { transform: translateY(-4px); box-shadow: 0 24px 48px -20px rgba(23,21,18,0.22); }
        .th-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 900px) { .th-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .th-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{ background: BG, color: INK, minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
        <MarketingNav />

        <section style={{ maxWidth: 1240, margin: '0 auto', padding: '160px 24px 60px' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${ACCENT}`, marginBottom: 16 }}>
            Flagship Themes
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 60px)', lineHeight: 1.02, letterSpacing: '-0.02em', maxWidth: 720, marginBottom: 20 }}>
            One flagship theme a month. Pick the one that&apos;s you.
          </h1>
          <p style={{ fontSize: 16, color: `${INK}99`, maxWidth: 560, lineHeight: 1.6 }}>
            Every store on WearOn starts from a theme — a complete, considered design system, not a template you fight with. We&apos;re building twelve flagship themes, one per month, each with its own aesthetic and its own AI-native features. Preview them live before you pick.
          </p>
        </section>

        <section style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px 100px' }}>
          <div className="th-grid">
            {MONTHS.map(m => (
              <div
                key={m.id}
                className={m.live ? 'th-hover-lift' : ''}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: '#fff',
                  border: `1px solid ${INK}12`,
                  opacity: m.live ? 1 : 0.55,
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '4/3', background: `${INK}0a` }}>
                  {m.image && <img src={m.image} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  <span
                    style={{
                      position: 'absolute', top: 12, left: 12, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
                      padding: '4px 10px', borderRadius: 999,
                      background: m.live ? INK : 'rgba(23,21,18,0.5)', color: '#fff',
                    }}
                  >
                    {m.live ? 'Live now' : 'Coming soon'}
                  </span>
                </div>
                <div style={{ padding: '18px 20px 22px' }}>
                  <p style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: `${INK}66`, marginBottom: 6 }}>{m.month}</p>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>{m.name}</h3>
                  <p style={{ fontSize: 13.5, color: `${INK}99`, lineHeight: 1.5, marginBottom: m.live ? 16 : 0, minHeight: 40 }}>{m.blurb}</p>
                  {m.live && m.storeSlug && (
                    <Link
                      href={`/store/${m.storeSlug}`}
                      target="_blank"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600,
                        color: ACCENT, textDecoration: 'none',
                      }}
                    >
                      Preview the live store →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ maxWidth: 1240, margin: '0 auto', padding: '0 24px 140px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: 16 }}>
            Ready to build on January?
          </h2>
          <p style={{ fontSize: 15, color: `${INK}99`, marginBottom: 28 }}>Set up your store in 10 minutes — pick this theme at signup.</p>
          <Link
            href="/auth/signup"
            className="th-hover-lift"
            style={{
              display: 'inline-block', background: INK, color: '#fff', padding: '14px 32px', borderRadius: 999,
              fontSize: 15, fontWeight: 600, textDecoration: 'none',
            }}
          >
            Get started free
          </Link>
        </section>
      </div>
    </>
  )
}
