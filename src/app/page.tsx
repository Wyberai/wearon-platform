import Link from 'next/link'
import { PLANS } from '@/lib/constants'
import { StorePreviewCapture } from '@/components/marketing/StorePreviewCapture'

const STORAGE_BASE = 'https://zhrubbutcsvhcbuaalep.supabase.co/storage/v1/object/public/product-images'

const PAIN_POINTS = [
  {
    n: '01',
    label: '3+ hours a day, answering the same three questions',
    body: '"How much?" "Which sizes?" "Can you show it on someone?" You\'re doing this at midnight instead of sleeping. That\'s not hustle — that\'s a leak.',
  },
  {
    n: '02',
    label: 'Instagram gives you exactly one clickable link',
    body: 'A Reel does 40K views, comments flood in — and not one of them can tap to buy. Your bio has one link. You\'re not using it like a store, because it isn\'t one.',
  },
  {
    n: '03',
    label: 'You\'ve built a real boutique. It still looks like a hobby.',
    body: 'No catalogue, no prices, no proper checkout — just a feed and a follow button. WearOn gives buyers a store. Your name on it, not ours.',
  },
]

const STEPS = [
  { n: '01', title: 'Set up in 10 minutes', body: 'Logo, brand colors, your kurtis, sarees, lehengas, co-ords. Live under your name — not ours.' },
  { n: '02', title: 'One link in your bio', body: 'Drop it into your Instagram bio. Followers open it on mobile — no download, no app store.' },
  { n: '03', title: 'WhatsApp orders, no DMs', body: 'Every product has an order button. Size, color, price — pre-filled. Your phone buzzes with the order, not a question.' },
]

const FEATURES = [
  { title: 'Your branding. Not ours.', body: 'Your logo, your colors, your store name. Buyers see your boutique — white-label by default.' },
  { title: 'WhatsApp checkout, built in.', body: 'Every product has a pre-filled order button straight to your number. No payment gateway setup required.' },
  { title: 'A real catalogue.', body: 'Categories, sizes, colors, descriptions, photos. Buyers browse your full range — not just your last post.' },
  { title: 'Analytics that mean something.', body: 'Which products get views, which convert to orders, which drop off. Know what buyers actually want.' },
]

const AI_REELS = {
  title: 'AI Reels, not just product photos',
  body: 'No photoshoot, no model, no studio. Upload one flat-lay of your garment — we put an AI model in it and hand you a Reel-ready video.',
  price: '₹50',
  priceLabel: 'per video',
}

const PRODUCT_MOCKUP = [
  { img: `${STORAGE_BASE}/silk-banarasi-saree-demo3.jpg`, name: 'Silk Banarasi Saree', price: '₹4,999' },
  { img: `${STORAGE_BASE}/velvet-lehenga-choli-demo14.jpg`, name: 'Velvet Lehenga Choli', price: '₹6,499' },
  { img: `${STORAGE_BASE}/embroidered-anarkali-demo2.jpg`, name: 'Embroidered Anarkali', price: '₹2,199' },
  { img: `${STORAGE_BASE}/handloom-cotton-saree-demo11.jpg`, name: 'Handloom Cotton Saree', price: '₹2,199' },
]

const ACCENT = '#A6134A'
const INK = '#171512'

export default function Home() {
  const pricingPlans = (Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).filter(([k]) => k !== 'enterprise')

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .wo-grid-2 { grid-template-columns: 1fr !important; }
          .wo-steps { grid-template-columns: 1fr !important; }
          .wo-features { grid-template-columns: 1fr !important; }
          .wo-pricing { grid-template-columns: repeat(2, 1fr) !important; }
          .wo-hero-h1 { font-size: clamp(36px, 10vw, 56px) !important; }
        }
      `}</style>

      <div style={{ background: '#FAF7F3', color: INK, minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

        {/* ── NAV ─────────────────────────────────────── */}
        <nav style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '28px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, letterSpacing: '-0.3px', color: '#fff' }}>
              WearOn
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              <Link href="/auth/login" style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>Login</Link>
              <Link href="/auth/signup" style={{ background: '#fff', color: INK, padding: '9px 20px', borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                Get started
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ─────────────────────────────────────── */}
        <section style={{ position: 'relative', height: '92vh', minHeight: 620, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          <img
            src={`${STORAGE_BASE}/hero-banner.jpg`}
            alt=""
            aria-hidden
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,15,12,0.15) 0%, rgba(20,15,12,0.05) 40%, rgba(20,15,12,0.75) 100%)' }} />

          <div style={{ position: 'relative', zIndex: 5, maxWidth: 1240, margin: '0 auto', padding: '0 24px 72px', width: '100%' }}>
            <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.75)', marginBottom: 18 }}>
              for indian instagram fashion sellers
            </p>
            <h1 className="wo-hero-h1" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(44px, 7vw, 84px)', fontWeight: 500, lineHeight: 1.02, letterSpacing: '-1.5px', color: '#fff', maxWidth: 780, margin: 0 }}>
              Your boutique deserves <em style={{ fontStyle: 'italic' }}>its own</em> store.
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, maxWidth: 460, marginTop: 24, marginBottom: 36 }}>
              Buyers DM you asking price and size. Give them a real store instead — your logo, your colors, WhatsApp checkout on every product.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                href="/auth/signup"
                style={{ background: '#fff', color: INK, padding: '16px 30px', borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}
              >
                Launch my store, free →
              </Link>
              <Link
                href="/store/priyas-boutique"
                style={{ color: '#fff', padding: '16px 30px', borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.4)' }}
              >
                See a real store
              </Link>
            </div>
          </div>
        </section>

        {/* ── PAIN POINTS ──────────────────────────────── */}
        <section style={{ padding: '110px 24px 90px', maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.6vw, 40px)', fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 64 }}>
            You built a real boutique.<br />Instagram wasn&apos;t built for it.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {PAIN_POINTS.map(({ n, label, body }, i) => (
              <div key={n} style={{ display: 'flex', gap: 32, padding: '36px 0', borderTop: i === 0 ? `1px solid ${INK}22` : 'none', borderBottom: `1px solid ${INK}22` }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: ACCENT, flexShrink: 0, paddingTop: 4 }}>{n}</span>
                <div>
                  <p style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.2px', marginBottom: 10 }}>{label}</p>
                  <p style={{ fontSize: 16, color: `${INK}99`, lineHeight: 1.7, maxWidth: 640 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────── */}
        <section style={{ padding: '90px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>how it works</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.2vw, 36px)', fontWeight: 500, letterSpacing: '-0.4px', marginBottom: 56, maxWidth: 500 }}>
              Live in 10 minutes. Seriously.
            </h2>
            <div className="wo-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
              {STEPS.map(({ n, title, body }) => (
                <div key={n}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 500, color: `${INK}1a` }}>{n}</span>
                  <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.2px', margin: '12px 0 10px' }}>{title}</h3>
                  <p style={{ fontSize: 15, color: `${INK}99`, lineHeight: 1.7 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STORE SHOWCASE (real product, real data) ─── */}
        <section style={{ padding: '110px 24px', maxWidth: 1240, margin: '0 auto' }}>
          <div className="wo-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>your store, your brand</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.6vw, 42px)', fontWeight: 500, lineHeight: 1.12, letterSpacing: '-0.5px', marginBottom: 24 }}>
                Looks like a fashion app.<br />Costs like a free link.
              </h2>
              <p style={{ fontSize: 16, color: `${INK}99`, lineHeight: 1.75, marginBottom: 28, maxWidth: 460 }}>
                This is a real, live WearOn store — not a mockup. Every seller gets their own: logo, colors, full catalogue, and a checkout that goes straight to their WhatsApp.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                {[
                  'Your logo and brand colors, not WearOn\'s',
                  'Full catalogue — sizes, colors, descriptions',
                  'WhatsApp order button on every product',
                  'Works on any phone, nothing to install',
                ].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: ACCENT, flexShrink: 0 }}>—</span>
                    <span style={{ fontSize: 15, color: `${INK}cc` }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/store/priyas-boutique" style={{ display: 'inline-block', marginTop: 32, fontSize: 15, fontWeight: 600, color: INK, textDecoration: 'underline', textDecorationColor: ACCENT, textUnderlineOffset: 4 }}>
                Walk through this store →
              </Link>
            </div>

            {/* Phone mockup — real demo store data */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: 280, background: '#fff', borderRadius: 36, border: `10px solid ${INK}`,
                overflow: 'hidden', boxShadow: '0 40px 70px -20px rgba(23,21,18,0.35)',
              }}>
                <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${INK}14` }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: ACCENT, color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>P</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>Priya&apos;s Boutique</div>
                    <div style={{ fontSize: 10, color: `${INK}77` }}>Handpicked ethnic wear · Surat</div>
                  </div>
                </div>
                <div style={{ padding: '10px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {PRODUCT_MOCKUP.map(p => (
                    <div key={p.name} style={{ borderRadius: 10, overflow: 'hidden', background: '#f4f1ec' }}>
                      <img src={p.img} alt={p.name} style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', display: 'block' }} />
                      <div style={{ padding: '6px 7px 8px' }}>
                        <div style={{ fontSize: 9, color: `${INK}88`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                        <div style={{ fontSize: 11, fontWeight: 700 }}>{p.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '8px 12px 14px' }}>
                  <div style={{ background: '#25D366', borderRadius: 10, padding: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>Order on WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────── */}
        <section style={{ padding: '90px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>what you get</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.2vw, 36px)', fontWeight: 500, letterSpacing: '-0.4px', marginBottom: 56, maxWidth: 560 }}>
              Built for Instagram sellers. Not generic e-commerce.
            </h2>
            <div className="wo-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '48px 56px', marginBottom: 56 }}>
              {FEATURES.map(({ title, body }) => (
                <div key={title} style={{ borderTop: `1px solid ${INK}1a`, paddingTop: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.2px', marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: 15, color: `${INK}99`, lineHeight: 1.7, maxWidth: 420 }}>{body}</p>
                </div>
              ))}
            </div>

            {/* AI Reels — one distinct callout, real price */}
            <div style={{
              padding: '36px 40px', borderRadius: 4, background: '#FAF7F3',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 28, flexWrap: 'wrap',
            }}>
              <div style={{ maxWidth: 620 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.2px', marginBottom: 8 }}>{AI_REELS.title}</h3>
                <p style={{ fontSize: 15, color: `${INK}99`, lineHeight: 1.7 }}>{AI_REELS.body}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 500, color: ACCENT, lineHeight: 1 }}>{AI_REELS.price}</div>
                <div style={{ fontSize: 12, color: `${INK}77`, marginTop: 2 }}>{AI_REELS.priceLabel}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SEE YOUR OWN STORE ──────────────────────────────── */}
        <section style={{ padding: '110px 24px', background: INK }}>
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 18 }}>see it before you build it</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.6vw, 40px)', fontWeight: 500, letterSpacing: '-0.5px', color: '#fff', marginBottom: 20 }}>
              What would <em style={{ fontStyle: 'italic' }}>your</em> store look like?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 40 }}>
              Type your boutique name and email — see a live preview of your store and dashboard, with real analytics and an AI-automated inbox already running. No signup required to look.
            </p>
            <StorePreviewCapture />
          </div>
        </section>

        {/* ── POSITIONING ──────────────────────────────── */}
        <section style={{ padding: '110px 24px', background: '#fff' }}>
          <div className="wo-grid-2" style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>why sellers choose wearon</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.4vw, 38px)', fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 22 }}>
                One platform. Every boutique looks like its own.
              </h2>
              <p style={{ fontSize: 16, color: `${INK}99`, lineHeight: 1.75, marginBottom: 20, maxWidth: 460 }}>
                You focus on your boutique — the sourcing, the styling, the customers who trust you. We handle everything that makes it feel like a real app: hosting, uptime, updates, security. That&apos;s our job so it doesn&apos;t have to be yours.
              </p>
              <p style={{ fontSize: 15, color: `${INK}77`, lineHeight: 1.75, maxWidth: 460 }}>
                Buyers never see &quot;powered by WearOn.&quot; They see your boutique — your name on every page, every product, every WhatsApp message.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { label: 'Instagram DMs', desc: '3 hours a day answering the same questions', active: false },
                { label: 'Linktree / bio page', desc: 'A list of links. No catalogue, no ordering.', active: false },
                { label: 'Shopify / WooCommerce', desc: 'Built for Western brands. ₹20k setup. No WhatsApp.', active: false },
                { label: 'WearOn', desc: 'Branded boutique store. WhatsApp checkout. ₹0 to start.', active: true },
              ].map(({ label, desc, active }) => (
                <div key={label} style={{
                  padding: '18px 22px',
                  background: active ? INK : 'transparent',
                  borderBottom: active ? 'none' : `1px solid ${INK}14`,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: active ? '#fff' : INK, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, color: active ? 'rgba(255,255,255,0.65)' : `${INK}77` }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────── */}
        <section style={{ padding: '100px 24px', background: '#FAF7F3' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>plans</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.4vw, 38px)', fontWeight: 500, letterSpacing: '-0.5px', marginBottom: 10 }}>
                Start free. Upgrade when you&apos;re ready.
              </h2>
              <p style={{ fontSize: 15, color: `${INK}77` }}>Annual plans get 2 months free · Pay via UPI</p>
            </div>
            <div className="wo-pricing" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {pricingPlans.map(([key, plan]) => {
                const featured = key === 'growth'
                return (
                  <div
                    key={key}
                    style={{
                      padding: '28px 24px',
                      background: featured ? INK : '#fff',
                      color: featured ? '#fff' : INK,
                      position: 'relative',
                    }}
                  >
                    {featured && (
                      <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: '0.08em', marginBottom: 10 }}>
                        MOST POPULAR
                      </div>
                    )}
                    <div style={{ fontSize: 13, fontWeight: 600, color: featured ? 'rgba(255,255,255,0.6)' : `${INK}77`, marginBottom: 14 }}>{plan.name}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 500, letterSpacing: '-0.5px', marginBottom: 4 }}>
                      {plan.price_inr === 0 ? 'Free' : `₹${plan.price_inr.toLocaleString('en-IN')}`}
                      {plan.price_inr > 0 && <span style={{ fontSize: 14, fontWeight: 400, color: featured ? 'rgba(255,255,255,0.5)' : `${INK}66` }}>/mo</span>}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '22px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        `${plan.products === 9999 ? 'Unlimited' : plan.products} products`,
                        'Branded PWA store',
                        'WhatsApp ordering',
                        ...(key !== 'free' ? ['WhatsApp + Instagram + Facebook AI automation'] : ['Basic AI DM automation']),
                        ...(key === 'growth' || key === 'pro' ? ['Native Android app + Play Store listing'] : []),
                        ...(key === 'pro' ? ['Buyer virtual try-on', 'AI Reels — from ₹50/video'] : []),
                      ].map(f => (
                        <li key={f} style={{ fontSize: 13, color: featured ? 'rgba(255,255,255,0.8)' : `${INK}99`, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          <span style={{ color: featured ? ACCENT : ACCENT, flexShrink: 0 }}>—</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/auth/signup"
                      style={{
                        display: 'block', textAlign: 'center', textDecoration: 'none',
                        padding: '12px 0', fontSize: 14, fontWeight: 700,
                        background: featured ? '#fff' : INK,
                        color: featured ? INK : '#fff',
                      }}
                    >
                      {plan.label}
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────── */}
        <section style={{ padding: '130px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 5.5vw, 60px)', fontWeight: 500, letterSpacing: '-1px', lineHeight: 1.08, marginBottom: 22 }}>
              Stop answering DMs.<br /><em style={{ fontStyle: 'italic', color: ACCENT }}>Start getting orders.</em>
            </h2>
            <p style={{ fontSize: 16, color: `${INK}99`, marginBottom: 36, lineHeight: 1.7 }}>
              One link in your bio. WhatsApp orders flowing in. Your brand, not ours.
            </p>
            <Link
              href="/auth/signup"
              style={{ background: INK, color: '#fff', padding: '18px 40px', borderRadius: 999, fontSize: 16, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
            >
              Launch my store, free →
            </Link>
            <p style={{ marginTop: 20, fontSize: 13, color: `${INK}66` }}>
              Free plan · No credit card · Live in 10 minutes
            </p>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────── */}
        <footer style={{ borderTop: `1px solid ${INK}14`, padding: '28px 24px' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 16 }}>WearOn</span>
            <span style={{ fontSize: 13, color: `${INK}66` }}>Built for Indian Instagram boutiques · 2026</span>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link href="/auth/login" style={{ fontSize: 13, color: `${INK}77`, textDecoration: 'none' }}>Login</Link>
              <Link href="/store/priyas-boutique" style={{ fontSize: 13, color: `${INK}77`, textDecoration: 'none' }}>Live Demo</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
