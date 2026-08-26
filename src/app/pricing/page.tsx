import Link from 'next/link'
import type { Metadata } from 'next'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { BrandLogo } from '@/components/BrandLogo'

export const metadata: Metadata = {
  title: 'Pricing — Instastarz',
  description: 'Start free, grow into a full store, app, and AI photoshoot studio. No hidden fees, cancel anytime.',
}

const INK = '#171512'
const ACCENT = '#A6134A'
const GOLD = '#B8842E'
const BG = '#FAF7F3'

const PLANS = [
  {
    key: 'free',
    name: 'Free',
    price: 0,
    tagline: 'Try before you sell',
    cta: 'Start free',
    ctaHref: '/auth/signup',
    highlight: false,
    features: [
      '10 products',
      'Branded storefront (instastarz.in/store/you)',
      'WhatsApp order button',
      'Cash on Delivery',
      '20 AI replies / month',
      'Discount codes',
      'Product reviews & wishlist',
    ],
    missing: ['Custom domain', 'Analytics', 'Native Android app', 'Virtual try-on', 'AI photoshoot'],
  },
  {
    key: 'starter',
    name: 'Store',
    price: 3000,
    tagline: 'Your real online store',
    cta: 'Start selling',
    ctaHref: '/auth/signup?plan=starter',
    highlight: false,
    features: [
      '100 products',
      'Branded storefront',
      'Custom domain (instastarz.in or your own)',
      'WhatsApp + Razorpay checkout',
      'Margin tracking & analytics',
      '500 AI replies / month',
      'Discount codes, reviews, wishlist',
    ],
    missing: ['Native Android app', 'Virtual try-on', 'AI photoshoot'],
  },
  {
    key: 'growth',
    name: 'Store + App',
    price: 9999,
    tagline: 'A real brand, on the Play Store',
    cta: 'Get the app',
    ctaHref: '/auth/signup?plan=growth',
    highlight: true,
    badge: 'Most popular',
    features: [
      '500 products',
      'Everything in Store',
      'Native Android seller app (manage from your phone)',
      'Branded Android buyer app (your name, your logo)',
      'Play Store listing',
      '2,500 AI replies / month',
    ],
    missing: ['Virtual try-on', 'AI photoshoot'],
  },
  {
    key: 'pro',
    name: 'Store + App + AI',
    price: 19999,
    tagline: 'A photoshoot in every upload',
    cta: 'Go all-in',
    ctaHref: '/auth/signup?plan=pro',
    highlight: false,
    features: [
      'Unlimited products',
      'Everything in Store + App',
      '150 AI credits / month — virtual try-on + AI model photoshoot',
      '8,000 AI replies / month',
    ],
    missing: [],
  },
]

const FEATURE_TABLE = [
  {
    section: 'Storefront',
    rows: [
      { label: 'Products', free: '10', starter: '100', growth: '500', pro: 'Unlimited' },
      { label: 'Branded store URL', free: true, starter: true, growth: true, pro: true },
      { label: 'Custom domain', free: false, starter: true, growth: true, pro: true },
      { label: 'WhatsApp orders', free: true, starter: true, growth: true, pro: true },
      { label: 'Razorpay checkout', free: false, starter: true, growth: true, pro: true },
      { label: 'Discount codes', free: true, starter: true, growth: true, pro: true },
      { label: 'Reviews & wishlist', free: true, starter: true, growth: true, pro: true },
    ],
  },
  {
    section: 'Analytics',
    rows: [
      { label: 'Store visit & try-on data', free: false, starter: true, growth: true, pro: true },
      { label: 'Margin tracking per product', free: false, starter: true, growth: true, pro: true },
      { label: 'Order revenue dashboard', free: false, starter: true, growth: true, pro: true },
    ],
  },
  {
    section: 'AI replies (WhatsApp + Instagram + Facebook)',
    rows: [
      { label: 'AI replies / month', free: '20', starter: '500', growth: '2,500', pro: '8,000' },
      { label: 'Auto-reply to DMs', free: true, starter: true, growth: true, pro: true },
      { label: 'Suggest draft in inbox', free: true, starter: true, growth: true, pro: true },
    ],
  },
  {
    section: 'Mobile apps',
    rows: [
      { label: 'Seller app (manage from phone)', free: false, starter: false, growth: true, pro: true },
      { label: 'Branded buyer Android app', free: false, starter: false, growth: true, pro: true },
      { label: 'Play Store listing', free: false, starter: false, growth: true, pro: true },
    ],
  },
  {
    section: 'AI Studio',
    rows: [
      { label: 'AI credits / month (try-on + photoshoot)', free: '—', starter: '—', growth: '—', pro: '150' },
      { label: 'Virtual try-on for buyers', free: false, starter: false, growth: false, pro: true },
      { label: 'AI cloth-to-model photoshoot', free: false, starter: false, growth: false, pro: true },
    ],
  },
]

const FAQS = [
  {
    q: 'Do I need a registered business to start?',
    a: 'No. You can sign up and take WhatsApp orders and Cash on Delivery without any registration. To accept online card payments through Razorpay, you\'ll need a registered entity — a sole proprietorship works and takes a few days to set up.',
  },
  {
    q: 'What does an "AI reply" mean?',
    a: 'When a buyer DMs you on Instagram, WhatsApp, or Facebook Messenger, Instastarz reads their message and either auto-replies with a product recommendation, order status, or policy answer — or drafts a reply for you to approve with one tap. Each message handled counts as one AI reply.',
  },
  {
    q: 'What are AI credits used for?',
    a: 'AI credits cover two expensive features: buyer virtual try-on (placing your buyer\'s photo inside a product image) and AI photoshoot (generating a real model photo from a flat-lay garment upload). Each image try-on costs 3 credits; a video try-on costs 10. AI text replies use a separate quota and never touch this pool.',
  },
  {
    q: 'Can I switch plans later?',
    a: 'Yes, upgrade anytime — your new plan takes effect immediately. Downgrading moves you to the next billing cycle.',
  },
  {
    q: 'Annual vs monthly — is there a discount?',
    a: 'Annual plans get two months free — effectively a ~16% discount. Choose annual at checkout to activate it.',
  },
  {
    q: 'What happens if I run out of AI credits?',
    a: 'Try-on and photoshoot features stop working for your buyers until your credits reset at the top of the month, or until you upgrade. WhatsApp, Instagram, and Messenger AI replies have their own separate quota — running out of AI credits does not affect them.',
  },
  {
    q: 'I\'m an enterprise / want a custom plan.',
    a: 'Message us on WhatsApp and we\'ll scope it out — unlimited credits, your own Play Store account, dedicated support, and white-glove onboarding are all on the table.',
  },
]

function Check() {
  return <span style={{ color: '#22c55e', fontSize: 16, fontWeight: 700 }}>✓</span>
}
function Cross() {
  return <span style={{ color: `${INK}30`, fontSize: 14 }}>—</span>
}

function CellValue({ v }: { v: boolean | string }) {
  if (v === true) return <Check />
  if (v === false) return <Cross />
  return <span style={{ fontSize: 13, color: INK, fontWeight: 500 }}>{v}</span>
}

export default function PricingPage() {
  return (
    <>
      <style>{`
        .pr-card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
        .pr-card:hover { transform: translateY(-3px); box-shadow: 0 28px 48px -20px rgba(23,21,18,0.18); }
        .pr-faq summary::-webkit-details-marker { display: none; }
        .pr-faq summary { cursor: pointer; list-style: none; }
        @media (max-width: 900px) { .pr-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 540px) { .pr-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 820px) { .pr-table-wrap { overflow-x: auto; } .pr-table { min-width: 640px; } }
        @media (max-width: 640px) { .pr-ent-row { flex-direction: column !important; gap: 24px !important; align-items: flex-start !important; } }
      `}</style>

      <div style={{ background: BG, color: INK, minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
        <MarketingNav />

        {/* Hero */}
        <section style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 56px', textAlign: 'center' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: ACCENT, marginBottom: 18, fontWeight: 700 }}>
            Pricing
          </p>
          <h1 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 400, letterSpacing: '-2px', lineHeight: 1.02, color: INK, marginBottom: 20 }}>
            Start free.<br />Grow when you're ready.
          </h1>
          <p style={{ fontSize: 17, color: `${INK}88`, lineHeight: 1.65, maxWidth: 520, margin: '0 auto 12px' }}>
            No credit card to start. No platform commission on your sales. Cancel any plan anytime.
          </p>
          <p style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>
            Annual plans save 2 months (16% off)
          </p>
        </section>

        {/* Plan cards */}
        <section style={{ maxWidth: 1180, margin: '0 auto', padding: '0 20px 72px' }}>
          <div className="pr-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {PLANS.map(plan => (
              <div
                key={plan.key}
                className="pr-card"
                style={{
                  background: '#fff',
                  borderRadius: 20,
                  padding: '28px 24px 26px',
                  border: plan.highlight ? `2px solid ${ACCENT}` : `1px solid ${INK}12`,
                  boxShadow: plan.highlight
                    ? `0 24px 40px -16px ${ACCENT}30`
                    : '0 8px 24px -16px rgba(23,21,18,0.10)',
                  position: 'relative',
                }}
              >
                {plan.badge && (
                  <div style={{
                    position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)',
                    background: ACCENT, color: '#fff', fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '5px 14px', borderRadius: 999, whiteSpace: 'nowrap',
                  }}>
                    {plan.badge}
                  </div>
                )}

                <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: plan.highlight ? ACCENT : `${INK}66`, fontWeight: 700, marginBottom: 8 }}>
                  {plan.name}
                </p>

                <div style={{ marginBottom: 4 }}>
                  {plan.price === 0 ? (
                    <span style={{ fontFamily: 'var(--font-marketing)', fontSize: 40, fontWeight: 400, letterSpacing: '-1px', color: INK }}>
                      Free
                    </span>
                  ) : (
                    <>
                      <span style={{ fontFamily: 'var(--font-marketing)', fontSize: 36, fontWeight: 400, letterSpacing: '-1px', color: INK }}>
                        ₹{plan.price.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize: 13, color: `${INK}66`, marginLeft: 4 }}>/mo</span>
                    </>
                  )}
                </div>

                <p style={{ fontSize: 13, color: `${INK}77`, marginBottom: 22, lineHeight: 1.4 }}>
                  {plan.tagline}
                </p>

                <Link
                  href={plan.ctaHref}
                  style={{
                    display: 'block', textAlign: 'center',
                    background: plan.highlight ? ACCENT : INK,
                    color: '#fff', padding: '12px 0', borderRadius: 999,
                    fontSize: 13, fontWeight: 700, textDecoration: 'none',
                    letterSpacing: '0.02em', marginBottom: 24,
                  }}
                >
                  {plan.cta} →
                </Link>

                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: `${INK}cc`, lineHeight: 1.45 }}>
                      <span style={{ color: '#22c55e', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                      {f}
                    </li>
                  ))}
                  {plan.missing.map(f => (
                    <li key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: `${INK}35`, lineHeight: 1.45 }}>
                      <span style={{ flexShrink: 0, marginTop: 1 }}>—</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Enterprise band */}
          <div style={{
            marginTop: 16, background: INK, borderRadius: 20, padding: '28px 36px',
          }}>
            <div className="pr-ent-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: `rgba(255,255,255,0.5)`, fontWeight: 700, marginBottom: 8 }}>
                  Enterprise
                </p>
                <h3 style={{ fontFamily: 'var(--font-marketing)', fontSize: 24, fontWeight: 400, color: '#fff', letterSpacing: '-0.5px', marginBottom: 8 }}>
                  Unlimited everything
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: 560 }}>
                  Unlimited products, AI credits, and AI replies · Own Play Store account · White-glove onboarding · Dedicated support line · Custom domain · Volume pricing
                </p>
              </div>
              <a
                href="https://wa.me/917892603192?text=Hi%21+I%27d+like+to+discuss+the+Enterprise+plan+for+Instastarz."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#fff', color: INK, padding: '14px 28px', borderRadius: 999,
                  fontSize: 13, fontWeight: 700, textDecoration: 'none', flexShrink: 0,
                  letterSpacing: '0.02em',
                }}
              >
                Talk to us →
              </a>
            </div>
          </div>
        </section>

        {/* Feature comparison table */}
        <section style={{ maxWidth: 1080, margin: '0 auto', padding: '0 20px 96px' }}>
          <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 400, letterSpacing: '-1px', color: INK, textAlign: 'center', marginBottom: 48 }}>
            Full feature comparison
          </h2>

          <div className="pr-table-wrap">
            <table className="pr-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={{ width: '36%', textAlign: 'left', padding: '0 0 20px', fontSize: 12, color: `${INK}55`, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Feature
                  </th>
                  {['Free', 'Store', 'Store + App', 'Store + App + AI'].map((h, i) => (
                    <th key={h} style={{ textAlign: 'center', padding: '0 8px 20px', fontSize: 12, color: i === 2 ? ACCENT : `${INK}88`, fontWeight: i === 2 ? 700 : 600, letterSpacing: '0.03em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURE_TABLE.map(section => (
                  <>
                    <tr key={section.section}>
                      <td colSpan={5} style={{ padding: '22px 0 8px', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: ACCENT, fontWeight: 700 }}>
                        {section.section}
                      </td>
                    </tr>
                    {section.rows.map((row, ri) => (
                      <tr key={row.label} style={{ borderTop: `1px solid ${INK}0C` }}>
                        <td style={{ padding: '13px 0', color: `${INK}cc` }}>{row.label}</td>
                        <td style={{ textAlign: 'center', padding: '13px 8px' }}><CellValue v={row.free} /></td>
                        <td style={{ textAlign: 'center', padding: '13px 8px' }}><CellValue v={row.starter} /></td>
                        <td style={{ textAlign: 'center', padding: '13px 8px', background: ri % 2 === 0 ? `${ACCENT}06` : 'transparent' }}><CellValue v={row.growth} /></td>
                        <td style={{ textAlign: 'center', padding: '13px 8px' }}><CellValue v={row.pro} /></td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section style={{ maxWidth: 720, margin: '0 auto', padding: '0 24px 96px' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${INK}55`, marginBottom: 16, textAlign: 'center' }}>
            Common questions
          </p>
          <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 400, letterSpacing: '-1px', color: INK, textAlign: 'center', marginBottom: 48 }}>
            Before you sign up
          </h2>

          <div>
            {FAQS.map(faq => (
              <details key={faq.q} className="pr-faq" style={{ borderTop: `1px solid ${INK}14`, padding: '20px 0' }}>
                <summary style={{ fontSize: 16, fontWeight: 600, color: INK, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  {faq.q}
                  <span style={{ fontSize: 20, color: `${INK}44`, flexShrink: 0, fontWeight: 300 }}>+</span>
                </summary>
                <p style={{ fontSize: 14, color: `${INK}88`, lineHeight: 1.75, marginTop: 14, marginBottom: 0 }}>
                  {faq.a}
                </p>
              </details>
            ))}
            <div style={{ borderTop: `1px solid ${INK}14` }} />
          </div>
        </section>

        {/* Closing CTA */}
        <section style={{ background: INK, padding: '72px 24px' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 400, letterSpacing: '-1.5px', color: '#fff', marginBottom: 16 }}>
              Your store, live in minutes.
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 32 }}>
              Free to start. No credit card. No commission on your orders.
            </p>
            <Link
              href="/auth/signup"
              style={{
                display: 'inline-block', background: '#fff', color: INK,
                padding: '14px 32px', borderRadius: 999,
                fontSize: 13, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', textDecoration: 'none',
              }}
            >
              Create your free store
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: `1px solid ${INK}10`, padding: '24px', background: BG }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-marketing)', fontWeight: 400, fontSize: 17, letterSpacing: '-0.3px', color: INK }}>
              <BrandLogo size={16} ink={INK} animated />
              Instastarz
            </span>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link href="/themes" style={{ fontSize: 12, color: `${INK}66`, textDecoration: 'none' }}>Themes</Link>
              <Link href="/auth/login" style={{ fontSize: 12, color: `${INK}66`, textDecoration: 'none' }}>Login</Link>
              <Link href="/privacy" style={{ fontSize: 12, color: `${INK}66`, textDecoration: 'none' }}>Privacy</Link>
              <Link href="/terms" style={{ fontSize: 12, color: `${INK}66`, textDecoration: 'none' }}>Terms</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
