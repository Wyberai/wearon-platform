import Link from 'next/link'
import { PLANS } from '@/lib/constants'
import { StorePreviewCapture } from '@/components/marketing/StorePreviewCapture'
import { MarketingNav } from '@/components/marketing/MarketingNav'

const STORAGE_BASE = 'https://zhrubbutcsvhcbuaalep.supabase.co/storage/v1/object/public/product-images'

const PAIN_POINTS = [
  {
    n: '01',
    label: '3+ hours a day, answering the same three questions',
    body: '"How much?" "Which sizes?" "Can you show it on someone?" You\'re doing this at midnight instead of sleeping. That\'s not hustle â€” that\'s a leak.',
  },
  {
    n: '02',
    label: 'Instagram gives you exactly one clickable link',
    body: 'A Reel does 40K views, comments flood in â€” and not one of them can tap to buy. Your bio has one link. You\'re not using it like a store, because it isn\'t one.',
  },
  {
    n: '03',
    label: 'You\'ve built a real boutique. It still looks like a hobby.',
    body: 'No catalogue, no prices, no proper checkout â€” just a feed and a follow button. WearOn gives buyers a store. Your name on it, not ours.',
  },
]

const STEPS = [
  { n: '01', title: 'Set up in 10 minutes', body: 'Logo, brand colors, your kurtis, sarees, lehengas, co-ords. Live under your name â€” not ours.' },
  { n: '02', title: 'One link in your bio', body: 'Drop it into your Instagram bio. Followers open it on mobile â€” no download, no app store.' },
  { n: '03', title: 'WhatsApp orders, no DMs', body: 'Every product has an order button. Size, color, price â€” pre-filled. Your phone buzzes with the order, not a question.' },
]

const FEATURES = [
  { title: 'Your branding. Not ours.', body: 'Your logo, your colors, your store name. Buyers see your boutique â€” white-label by default.' },
  { title: 'WhatsApp checkout, built in.', body: 'Every product has a pre-filled order button straight to your number. No payment gateway setup required.' },
  { title: 'A real catalogue.', body: 'Categories, sizes, colors, descriptions, photos. Buyers browse your full range â€” not just your last post.' },
  { title: 'Analytics that mean something.', body: 'Which products get views, which convert to orders, which drop off. Know what buyers actually want.' },
]

const AI_REELS = {
  title: 'AI Reels, not just product photos',
  body: 'No photoshoot, no model, no studio. Upload one flat-lay of your garment â€” we put an AI model in it and hand you a Reel-ready video.',
  price: 'â‚¹50',
  priceLabel: 'per video',
}

const PRODUCT_MOCKUP = [
  { img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop', name: 'Silk Banarasi Saree', price: 'â‚¹4,999' },
  { img: `${STORAGE_BASE}/velvet-lehenga-choli-demo14.jpg`, name: 'Velvet Lehenga Choli', price: 'â‚¹6,499' },
  { img: `${STORAGE_BASE}/embroidered-anarkali-demo2.jpg`, name: 'Embroidered Anarkali', price: 'â‚¹2,199' },
  { img: `${STORAGE_BASE}/handloom-cotton-saree-demo11.jpg`, name: 'Handloom Cotton Saree', price: 'â‚¹2,199' },
]

const ACCENT = '#A6134A'
const INK = '#171512'

function Check({ color = ACCENT }: { color?: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 18, height: 18, borderRadius: '50%', background: `${color}18`, flexShrink: 0,
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  )
}

export default function Home() {
  return <USHomePage />
}

function _IndiaHomePage() {

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
        .wo-hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease; }
        .wo-hover-lift:hover { transform: translateY(-2px); opacity: 0.92; }
        .wo-hover-fade { transition: opacity 0.2s ease, color 0.2s ease; }
        .wo-hover-fade:hover { opacity: 0.7; }
        .wo-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .wo-card:hover { transform: translateY(-3px); box-shadow: 0 20px 40px -18px rgba(23,21,18,0.18); }
      `}</style>

      <div style={{ background: '#FAF7F3', color: INK, minHeight: '100vh', fontFamily: 'var(--font-body)' }}>

        <MarketingNav />

        {/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
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
              So many likes. So few <em style={{ fontStyle: 'italic' }}>sales</em>.
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, maxWidth: 460, marginTop: 24, marginBottom: 36 }}>
              Instagram gets you the double-taps, not the checkout. Build your own branded website and app â€” so followers can actually buy, not just admire.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                href="/auth/signup"
                className="wo-hover-lift"
                style={{ background: '#fff', color: INK, padding: '16px 30px', borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}
              >
                Launch my store, free â†’
              </Link>
              <Link
                href="/store/priyas-boutique"
                className="wo-hover-lift"
                style={{ color: '#fff', padding: '16px 30px', borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.4)' }}
              >
                See a real store
              </Link>
            </div>
          </div>
        </section>

        {/* â”€â”€ PAIN POINTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ position: 'relative', padding: '90px 0 80px', maxWidth: 1240, margin: '0 auto', overflow: 'hidden' }}>
          <div aria-hidden style={{
            position: 'absolute', top: -120, right: -80, width: 380, height: 380, borderRadius: '50%',
            background: `radial-gradient(circle, ${ACCENT}12, transparent 70%)`, pointerEvents: 'none',
          }} />
          <h2 style={{ position: 'relative', fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.6vw, 40px)', fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 40, padding: '0 24px' }}>
            You built a real boutique.<br />Instagram wasn&apos;t built for it.
          </h2>
          <div className="wo-pain-scroll" style={{ display: 'flex', gap: 20, overflowX: 'auto', padding: '4px 24px 20px', scrollSnapType: 'x mandatory' }}>
            {PAIN_POINTS.map(({ n, label, body }) => (
              <div key={n} className="wo-card" style={{
                flexShrink: 0, width: 320, scrollSnapAlign: 'start',
                background: '#fff', borderRadius: 20, padding: '30px 28px',
                boxShadow: '0 12px 30px -18px rgba(23,21,18,0.14)',
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: '50%', background: `${ACCENT}14`,
                  fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: ACCENT,
                }}>{n}</span>
                <p style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.2px', margin: '18px 0 10px' }}>{label}</p>
                <p style={{ fontSize: 14.5, color: `${INK}99`, lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* â”€â”€ HOW IT WORKS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ padding: '90px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>how it works</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.2vw, 36px)', fontWeight: 500, letterSpacing: '-0.4px', marginBottom: 56, maxWidth: 500 }}>
              Live in 10 minutes. Seriously.
            </h2>
            <div className="wo-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
              {STEPS.map(({ n, title, body }) => (
                <div key={n} style={{ borderTop: `2px solid ${ACCENT}`, paddingTop: 22 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 500, color: `${INK}1a` }}>{n}</span>
                  <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.2px', margin: '12px 0 10px' }}>{title}</h3>
                  <p style={{ fontSize: 15, color: `${INK}99`, lineHeight: 1.7 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* â”€â”€ STORE SHOWCASE (real product, real data) â”€â”€â”€ */}
        <section style={{ padding: '110px 24px', maxWidth: 1240, margin: '0 auto' }}>
          <div className="wo-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>your store, your brand</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.6vw, 42px)', fontWeight: 500, lineHeight: 1.12, letterSpacing: '-0.5px', marginBottom: 24 }}>
                Looks like a fashion app.<br />Costs like a free link.
              </h2>
              <p style={{ fontSize: 16, color: `${INK}99`, lineHeight: 1.75, marginBottom: 28, maxWidth: 460 }}>
                This is a real, live WearOn store â€” not a mockup. Every seller gets their own: logo, colors, full catalogue, and a checkout that goes straight to their WhatsApp.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                {[
                  'Your logo and brand colors, not WearOn\'s',
                  'Full catalogue â€” sizes, colors, descriptions',
                  'WhatsApp order button on every product',
                  'Works on any phone, nothing to install',
                ].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Check />
                    <span style={{ fontSize: 15, color: `${INK}cc` }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/store/priyas-boutique" className="wo-hover-fade" style={{ display: 'inline-block', marginTop: 32, fontSize: 15, fontWeight: 600, color: INK, textDecoration: 'underline', textDecorationColor: ACCENT, textUnderlineOffset: 4 }}>
                Walk through this store â†’
              </Link>
            </div>

            {/* Phone mockup â€” real demo store data */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div aria-hidden style={{
                position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
                width: 340, height: 340, borderRadius: '50%',
                background: `radial-gradient(circle, ${ACCENT}1a, transparent 70%)`, pointerEvents: 'none', zIndex: 0,
              }} />
              <div
                className="wo-card"
                style={{
                  position: 'relative', zIndex: 1,
                  width: 280, background: '#fff', borderRadius: 36, border: `10px solid ${INK}`,
                  overflow: 'hidden', boxShadow: '0 40px 70px -20px rgba(23,21,18,0.35)',
                }}>
                <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${INK}14` }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: ACCENT, color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>P</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>Priya&apos;s Boutique</div>
                    <div style={{ fontSize: 10, color: `${INK}77` }}>Handpicked ethnic wear Â· Surat</div>
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

        {/* â”€â”€ FEATURES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ padding: '90px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>what you get</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.2vw, 36px)', fontWeight: 500, letterSpacing: '-0.4px', marginBottom: 56, maxWidth: 560 }}>
              Built for Instagram sellers. Not generic e-commerce.
            </h2>
            <div className="wo-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px 20px', marginBottom: 40 }}>
              {FEATURES.map(({ title, body }) => (
                <div key={title} className="wo-card" style={{ background: '#FAF7F3', borderRadius: 20, padding: '26px 28px' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.2px', marginBottom: 8 }}>{title}</h3>
                  <p style={{ fontSize: 15, color: `${INK}99`, lineHeight: 1.7, maxWidth: 420 }}>{body}</p>
                </div>
              ))}
            </div>

            {/* AI Reels â€” one distinct callout, real price */}
            <div style={{
              padding: '36px 40px', borderRadius: 20, background: INK, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 28, flexWrap: 'wrap',
              boxShadow: '0 24px 50px -24px rgba(23,21,18,0.4)',
            }}>
              <div style={{ maxWidth: 620 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.2px', marginBottom: 8, color: '#fff' }}>{AI_REELS.title}</h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>{AI_REELS.body}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 500, color: '#F0A8BE', lineHeight: 1 }}>{AI_REELS.price}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{AI_REELS.priceLabel}</div>
              </div>
            </div>
          </div>
        </section>

        {/* â”€â”€ SEE YOUR OWN STORE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ padding: '110px 24px', background: INK }}>
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 18 }}>see it before you build it</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.6vw, 40px)', fontWeight: 500, letterSpacing: '-0.5px', color: '#fff', marginBottom: 20 }}>
              What would <em style={{ fontStyle: 'italic' }}>your</em> store look like?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 40 }}>
              Type your boutique name and email â€” see a live preview of your store and dashboard, with real analytics and an AI-automated inbox already running. No signup required to look.
            </p>
            <StorePreviewCapture />
          </div>
        </section>

        {/* â”€â”€ POSITIONING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ padding: '110px 24px', background: '#fff' }}>
          <div className="wo-grid-2" style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>why sellers choose wearon</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.4vw, 38px)', fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 22 }}>
                One platform. Every boutique looks like its own.
              </h2>
              <p style={{ fontSize: 16, color: `${INK}99`, lineHeight: 1.75, marginBottom: 20, maxWidth: 460 }}>
                You focus on your boutique â€” the sourcing, the styling, the customers who trust you. We handle everything that makes it feel like a real app: hosting, uptime, updates, security. That&apos;s our job so it doesn&apos;t have to be yours.
              </p>
              <p style={{ fontSize: 15, color: `${INK}77`, lineHeight: 1.75, maxWidth: 460 }}>
                Buyers never see &quot;powered by WearOn.&quot; They see your boutique â€” your name on every page, every product, every WhatsApp message.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 44px -24px rgba(23,21,18,0.2)' }}>
              {[
                { label: 'Instagram DMs', desc: '3 hours a day answering the same questions', active: false },
                { label: 'Linktree / bio page', desc: 'A list of links. No catalogue, no ordering.', active: false },
                { label: 'Shopify / WooCommerce', desc: 'Built for Western brands. â‚¹20k setup. No WhatsApp.', active: false },
                { label: 'WearOn', desc: 'Branded boutique store. WhatsApp checkout. â‚¹0 to start.', active: true },
              ].map(({ label, desc, active }) => (
                <div key={label} style={{
                  padding: '20px 22px',
                  background: active ? INK : '#FAF7F3',
                  borderBottom: active ? 'none' : `1px solid ${INK}0f`,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: active ? '#fff' : INK, marginBottom: 3 }}>{label}{active && <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 600, color: '#F0A8BE' }}>â€” that&apos;s us</span>}</div>
                  <div style={{ fontSize: 13, color: active ? 'rgba(255,255,255,0.65)' : `${INK}77` }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* â”€â”€ PRICING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ padding: '100px 24px', background: '#FAF7F3' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>plans</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.4vw, 38px)', fontWeight: 500, letterSpacing: '-0.5px', marginBottom: 10 }}>
                Start free. Upgrade when you&apos;re ready.
              </h2>
              <p style={{ fontSize: 15, color: `${INK}77` }}>Annual plans get 2 months free Â· Pay via UPI</p>
            </div>
            <div className="wo-pricing" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {pricingPlans.map(([key, plan]) => {
                const featured = key === 'growth'
                return (
                  <div
                    key={key}
                    className="wo-card"
                    style={{
                      padding: '28px 24px',
                      borderRadius: 20,
                      background: featured ? INK : '#fff',
                      color: featured ? '#fff' : INK,
                      position: 'relative',
                      boxShadow: featured ? '0 24px 50px -20px rgba(23,21,18,0.5)' : '0 12px 30px -20px rgba(23,21,18,0.12)',
                      outline: featured ? `2px solid ${ACCENT}` : 'none',
                      outlineOffset: -2,
                    }}
                  >
                    {featured && (
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#F0A8BE', letterSpacing: '0.08em', marginBottom: 10 }}>
                        MOST POPULAR
                      </div>
                    )}
                    <div style={{ fontSize: 13, fontWeight: 600, color: featured ? 'rgba(255,255,255,0.6)' : `${INK}77`, marginBottom: 14 }}>{plan.name}</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 500, letterSpacing: '-0.5px', marginBottom: 4 }}>
                      {plan.price_inr === 0 ? 'Free' : `â‚¹${plan.price_inr.toLocaleString('en-IN')}`}
                      {plan.price_inr > 0 && <span style={{ fontSize: 14, fontWeight: 400, color: featured ? 'rgba(255,255,255,0.5)' : `${INK}66` }}>/mo</span>}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '22px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        `${plan.products === 9999 ? 'Unlimited' : plan.products} products`,
                        'Branded PWA store',
                        'WhatsApp ordering',
                        ...(key !== 'free' ? ['WhatsApp + Instagram + Facebook AI automation'] : ['Basic AI DM automation']),
                        ...(key === 'growth' || key === 'pro' ? ['Native Android app + Play Store listing'] : []),
                        ...(key === 'pro' ? ['Buyer virtual try-on', 'AI Reels â€” from â‚¹50/video'] : []),
                      ].map(f => (
                        <li key={f} style={{ fontSize: 13, color: featured ? 'rgba(255,255,255,0.8)' : `${INK}99`, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Check color={featured ? '#F0A8BE' : ACCENT} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/auth/signup"
                      className="wo-hover-lift"
                      style={{
                        display: 'block', textAlign: 'center', textDecoration: 'none',
                        padding: '12px 0', fontSize: 14, fontWeight: 700, borderRadius: 999,
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

            {/* Custom design â€” one-time add-on, not a plan tier */}
            <div style={{
              marginTop: 20, padding: '28px 32px', background: '#fff', borderRadius: 20,
              boxShadow: '0 12px 30px -20px rgba(23,21,18,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
            }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: ACCENT, marginBottom: 6 }}>
                  Don&apos;t want to pick from our themes?
                </p>
                <p style={{ fontSize: 15, color: `${INK}99`, maxWidth: 480 }}>
                  Our team designs a completely custom look for your store â€” your colors, your layout, built from scratch. One-time, not a subscription.
                </p>
              </div>
              <a
                href="mailto:hello@wyberai.com?subject=Custom%20WearOn%20store%20design&body=Hi%2C%20I%27d%20like%20a%20custom%20design%20for%20my%20WearOn%20store."
                className="wo-hover-lift"
                style={{ flexShrink: 0, textAlign: 'center', padding: '13px 24px', borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: 'none', background: INK, color: '#fff' }}
              >
                â‚¹2,000 one-time â€” Get a custom design â†’
              </a>
            </div>
          </div>
        </section>

        {/* â”€â”€ FINAL CTA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section style={{ position: 'relative', padding: '130px 24px', textAlign: 'center', overflow: 'hidden' }}>
          <div aria-hidden style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 700, height: 500, borderRadius: '50%',
            background: `radial-gradient(circle, ${ACCENT}10, transparent 65%)`, pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 5.5vw, 60px)', fontWeight: 500, letterSpacing: '-1px', lineHeight: 1.08, marginBottom: 22 }}>
              Stop answering DMs.<br /><em style={{ fontStyle: 'italic', color: ACCENT }}>Start getting orders.</em>
            </h2>
            <p style={{ fontSize: 16, color: `${INK}99`, marginBottom: 36, lineHeight: 1.7 }}>
              One link in your bio. WhatsApp orders flowing in. Your brand, not ours.
            </p>
            <Link
              href="/auth/signup"
              className="wo-hover-lift"
              style={{ background: INK, color: '#fff', padding: '18px 40px', borderRadius: 999, fontSize: 16, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
            >
              Launch my store, free â†’
            </Link>
            <p style={{ marginTop: 20, fontSize: 13, color: `${INK}66` }}>
              Free plan Â· No credit card Â· Live in 10 minutes
            </p>
          </div>
        </section>

        {/* â”€â”€ FOOTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <footer style={{ borderTop: `1px solid ${INK}14`, padding: '28px 24px' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 16 }}>WearOn</span>
            <span style={{ fontSize: 13, color: `${INK}66` }}>Built for Indian Instagram boutiques Â· 2026</span>
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

// â”€â”€â”€ US HOMEPAGE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const US_ACCENT = '#A6134A'
const US_INK = '#111010'

// The US market pain: Shopify costs + platform fees + no owned audience.
// Nothing about WhatsApp. Nothing about DMs. Nothing about pan-India shipping.
const US_PAIN = [
  {
    label: 'Shopify is $79/mo before you touch a single app',
    body: 'Klaviyo for email. Loox for reviews. Gorgias for support. Tidio for chat. You\'re paying $79 to Shopify and $80 more in apps before you make a single sale.',
  },
  {
    label: 'TikTok Shop takes 8% on every order',
    body: 'On a $10,000 month, that\'s $800 straight to TikTok. Instagram Shopping breaks every other update. You\'re building on someone else\'s platform with someone else\'s rules.',
  },
  {
    label: 'You have 20K followers and zero of their contact info',
    body: 'If Instagram changed its algorithm tomorrow â€” or banned your account â€” you\'d lose everything. Your buyers are Meta\'s customers. Not yours.',
  },
]

const US_FEATURES = [
  {
    title: 'Card checkout. No extra setup.',
    body: 'Stripe built in â€” cards, Apple Pay, Google Pay. Buyers tap, pick size, pay. You get the order. No DM, no invoice, no "can you send your Venmo?"',
  },
  {
    title: 'Your store. Your domain.',
    body: 'yourboutique.com or yourbrand.wearon.store. Your buyers land on your brand, not a platform subdomain. You own the customer â€” not the platform.',
  },
  {
    title: 'AI product photos. No studio needed.',
    body: 'Upload a flat-lay of your garment. Get a styled, model-on photo in 60 seconds. Short video clips available as a $0.60/clip add-on.',
  },
  {
    title: 'Analytics that tell you what\'s actually selling',
    body: 'Which products drive views. Which ones convert. Where buyers drop off. Know your bestsellers before you reorder â€” not after you\'ve already over-bought.',
  },
]

const US_THEMES = [
  { name: 'Editorial', bg: '#0C0C0B', accent: '#C4AE8F', ink: '#F0EBE4', tag: 'Fashion-forward' },
  { name: 'Soft Blush', bg: '#FDF4EF', accent: '#D4715C', ink: '#2A1E1A', tag: 'Feminine & warm' },
  { name: 'Minimal', bg: '#FAFAFA', accent: '#1A1A1A', ink: '#1A1A1A', tag: 'Clean & airy' },
  { name: 'Bold Feed', bg: '#111111', accent: '#FF3B5C', ink: '#FFFFFF', tag: 'TikTok-native' },
  { name: 'Luxury', bg: '#F8F5F0', accent: '#8B6E4E', ink: '#1C1410', tag: 'Premium boutique' },
]

function USThemeCard({ t }: { t: typeof US_THEMES[0] }) {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', background: t.bg, minWidth: 190, flexShrink: 0, boxShadow: '0 8px 28px rgba(0,0,0,0.14)' }}>
      <div style={{ padding: '10px 12px', borderBottom: `1px solid ${t.ink}18`, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: t.accent }} />
        <div style={{ width: 64, height: 8, borderRadius: 4, background: `${t.ink}44` }} />
      </div>
      <div style={{ padding: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ background: `${t.ink}0D`, borderRadius: 8, aspectRatio: '3/4' }}>
            <div style={{ height: '68%', background: `${t.ink}1A`, borderRadius: '8px 8px 0 0' }} />
            <div style={{ padding: '4px 5px' }}>
              <div style={{ width: '75%', height: 5, background: `${t.ink}33`, borderRadius: 3, marginBottom: 3 }} />
              <div style={{ width: '45%', height: 5, background: t.accent, borderRadius: 3, opacity: 0.75 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: '8px 12px 14px' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: t.ink, marginBottom: 2 }}>{t.name}</p>
        <p style={{ fontSize: 11, color: `${t.ink}77` }}>{t.tag}</p>
      </div>
    </div>
  )
}

const HERO_COLLAGE = [
  '/august/products/field-jacket.jpg',
  '/ember/products/flame-cardigan.jpg',
  '/bloom/products/linen-wrap-top.jpg',
  '/august/products/leather-belt.jpg',
  '/ember/products/cobalt-turtleneck.jpg',
  '/bloom/products/pleated-midi-skirt.jpg',
  '/august/products/overcoat.jpg',
  '/ember/products/chain-belt.jpg',
  '/bloom/products/leather-sandal.jpg',
]

function USHomePage() {
  const THEME_TILES = [
    { name: 'AUGUST', sub: 'Old-world tailoring, ask-anything styling', img: '/august/campaign/hero.jpg', slug: 'august' },
    { name: 'EMBER', sub: 'Dress by mood, one tap to an outfit', img: '/ember/campaign/hero.jpg', slug: 'ember' },
    { name: 'BLOOM', sub: 'Four questions, one built capsule', img: '/bloom/campaign/hero.jpg', slug: 'bloom' },
    { name: 'MELA', sub: 'Bazaar haggling, real AI counter-offers', img: '/mela/products/anarkali-3pc-set.jpg', slug: 'mela' },
    { name: 'TAANA', sub: 'Handloom provenance, thread by thread', img: '/taana/campaign/hero.jpg', slug: 'taana' },
    { name: 'SAAJ', sub: 'Wedding-function planner, one outfit each', img: '/saaj/products/emerald-reception-lehenga.jpg', slug: 'saaj' },
    { name: 'SCROLL', sub: 'Shop like a feed — stories, DMs, likes', img: '/scroll/products/wrap-dress.jpg', slug: 'scroll' },
    { name: 'DHAMAKA', sub: 'Flash-sale hype, real price history', img: '/dhamaka/campaign/hero.jpg', slug: 'dhamaka' },
    { name: 'AARAM', sub: 'Comfort matched to your day', img: '/aaram/campaign/hero.jpg', slug: 'aaram' },
    { name: 'UTSAV', sub: 'Festival gifting, built from who it’s for', img: '/utsav/products/diwali-deluxe-hamper.jpg', slug: 'utsav' },
    { name: 'GALLI', sub: 'Drop culture, countdown and captions', img: '/galli/products/ghost-logo-hoodie.jpg', slug: 'galli' },
    { name: 'KIRAYA', sub: 'Rent bridal-grade wear for one night', img: '/kiraya/campaign/hero.jpg', slug: 'kiraya' },
  ]

  return (
    <>
      <style>{`
        .wo-tile-img { transition: transform 0.55s ease; }
        .wo-tile:hover .wo-tile-img { transform: scale(1.04); }
        @media (max-width: 640px) {
          .wo-us-features { grid-template-columns: 1fr !important; gap: 32px !important; }
          .wo-us-pricing { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 460px) {
          .wo-us-pricing { grid-template-columns: 1fr !important; }
        }
        .wo-collage {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(3, 90px);
          gap: 3px;
        }
        @media (min-width: 720px) {
          .wo-collage { grid-template-rows: repeat(3, 160px); }
        }
        .wo-collage-tile { background-size: cover; background-position: center; }
        .wo-collage-t1 { grid-column: 1 / 2; grid-row: 1 / 2; }
        .wo-collage-t2 { grid-column: 2 / 3; grid-row: 1 / 2; }
        .wo-collage-t3 { grid-column: 3 / 5; grid-row: 1 / 2; }
        .wo-collage-t4 { grid-column: 1 / 2; grid-row: 2 / 4; }
        .wo-collage-t5 { grid-column: 2 / 3; grid-row: 2 / 3; }
        .wo-collage-t6 { grid-column: 3 / 4; grid-row: 2 / 3; }
        .wo-collage-t7 { grid-column: 4 / 5; grid-row: 2 / 3; }
        .wo-collage-t8 { grid-column: 2 / 3; grid-row: 3 / 4; }
        .wo-collage-t9 { grid-column: 3 / 5; grid-row: 3 / 4; }
        .wo-collage-card {
          position: absolute;
          top: 50%;
          left: 24px;
          transform: translateY(-50%);
          width: min(380px, calc(100% - 48px));
        }
        @media (max-width: 720px) {
          .wo-collage-card { position: static; transform: none; width: auto; margin: 16px 16px 0; }
        }
        .wo-feat-fan { display: flex; }
        .wo-feat-fan div { width: 56px; height: 68px; border-radius: 6px; border: 1px solid rgba(23,21,18,0.08); margin-left: -20px; box-shadow: -3px 0 8px rgba(23,21,18,0.1); background-size: cover; background-position: center; }
        .wo-feat-fan div:first-child { margin-left: 0; }
        @media (max-width: 900px) { .wo-tile-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 640px) { .wo-tile-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>


      <div style={{ background: '#fff', color: US_INK, minHeight: '100vh' }}>
        {/* Announcement bar */}
        <div style={{ background: US_INK, color: '#fff', padding: '11px 24px', textAlign: 'center', fontSize: 12, letterSpacing: '0.05em' }}>
          Start free — no credit card required.{'  '}
          <a href="https://cal.com/wyberai/wearon-consultation-with-the-founder" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 700 }}>
            Book a 20-min founder demo →
          </a>
        </div>

        <MarketingNav />

        {/* HERO — photo-collage of real garments from the twelve live flagship stores, */}
        {/* with a floating card, instead of one stock photo behind a gradient. */}
        <section style={{ position: 'relative' }}>
          <div className="wo-collage">
            {HERO_COLLAGE.map((src, i) => (
              <div
                key={src}
                className={`wo-collage-tile wo-collage-t${i + 1}`}
                style={{ backgroundImage: `url(${src})` }}
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="wo-collage-card" style={{ background: '#fff', borderRadius: 20, padding: '32px 32px 28px', boxShadow: '0 20px 50px -20px rgba(23,21,18,0.35)' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: `${US_INK}66`, marginBottom: 14 }}>
              Twelve flagship themes
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.4vw, 36px)', fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.5px', color: US_INK, margin: '0 0 14px' }}>
              Every boutique gets its own atelier.
            </h1>
            <p style={{ fontSize: 14.5, color: `${US_INK}99`, lineHeight: 1.65, marginBottom: 22 }}>
              All twelve are live now — twelve genuinely different ways to shop, not one template with a color picker.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/auth/signup" style={{ background: US_INK, color: '#fff', padding: '13px 24px', borderRadius: 999, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                Launch my store, free →
              </Link>
              <Link href="/themes" style={{ color: US_INK, padding: '13px 20px', borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none', border: `1px solid ${US_INK}22` }}>
                See all twelve stores
              </Link>
            </div>
          </div>
        </section>

        {/* DEMO FEATURE CARDS — show the feature happening, not a stock photo standing in for it */}
        <section style={{ padding: '48px 24px 8px' }}>
          <div className="wo-us-features" style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="wo-card" style={{ background: '#f8f8f6', borderRadius: 20, padding: '28px 28px 26px' }}>
              <div className="wo-feat-fan" style={{ marginBottom: 20 }}>
                <div style={{ backgroundImage: 'url(/august/campaign/hero.jpg)' }} />
                <div style={{ backgroundImage: 'url(/ember/campaign/hero.jpg)' }} />
                <div style={{ backgroundImage: 'url(/bloom/campaign/hero.jpg)' }} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.2px', marginBottom: 8, color: US_INK }}>Twelve flagship themes</h3>
              <p style={{ fontSize: 14, color: `${US_INK}88`, lineHeight: 1.7, marginBottom: 14 }}>
                Not a template with a color picker — twelve completely different shopping mechanics, all live.
              </p>
              <Link href="/themes" style={{ fontSize: 13, fontWeight: 700, color: US_INK, textDecoration: 'underline', textDecorationColor: US_ACCENT, textUnderlineOffset: 4 }}>
                Preview all twelve →
              </Link>
            </div>
            <div className="wo-card" style={{
              borderRadius: 20, padding: '28px 28px 26px',
              background: 'radial-gradient(circle at 25% 20%, rgba(232,137,90,0.14), transparent 55%), radial-gradient(circle at 75% 80%, rgba(91,140,255,0.14), transparent 55%), #f8f8f6',
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid rgba(23,21,18,0.1)', borderRadius: 999, padding: '6px 12px', fontSize: 12, color: `${US_INK}99`, marginBottom: 20 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5B8CFF', display: 'inline-block' }} />
                MCP endpoint, live on every store
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.2px', marginBottom: 8, color: US_INK }}>Built for AI shoppers</h3>
              <p style={{ fontSize: 14, color: `${US_INK}88`, lineHeight: 1.7 }}>
                Claude, ChatGPT, and Google AI Mode can browse your catalog and check sizes through your own MCP endpoint — no extra setup.
              </p>
            </div>
          </div>
        </section>

        {/* MARQUEE STRIP */}
        <div style={{ background: US_INK, color: '#fff', padding: '13px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <style>{`@keyframes wo-scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
          <div style={{ display: 'inline-block', animation: 'wo-scroll 24s linear infinite' }}>
            {['AI BUYER — SEASONAL EDITS', 'MCP ENDPOINT FOR CLAUDE', 'DM CHECKOUT', 'AI VISIBILITY DASHBOARD', 'STRIPE + RAZORPAY', 'YOUR OWN DOMAIN', 'AI PRODUCT PHOTOS', 'OPENAPI FOR CHATGPT', 'FREE TO START', 'AI BUYER — SEASONAL EDITS', 'MCP ENDPOINT FOR CLAUDE', 'DM CHECKOUT', 'AI VISIBILITY DASHBOARD', 'STRIPE + RAZORPAY', 'YOUR OWN DOMAIN', 'AI PRODUCT PHOTOS', 'OPENAPI FOR CHATGPT', 'FREE TO START'].map((item, i) => (
              <span key={i} style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 500 }}>
                {item}<span style={{ margin: '0 28px', opacity: 0.3 }}>·</span>
              </span>
            ))}
          </div>
        </div>

        {/* THEME TILES — all twelve flagship stores, live now, not cosmetic reskins */}
        <section style={{ paddingTop: 64 }}>
          <div style={{ padding: '0 24px', marginBottom: 32 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${US_INK}55`, marginBottom: 10 }}>Twelve flagship themes, all live</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 400, letterSpacing: '-1px', lineHeight: 1.1, color: US_INK }}>
              Your store. Your look.
            </h2>
          </div>
          <div className="wo-tile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {THEME_TILES.map(t => (
              <Link key={t.slug} href={`/store/${t.slug}`} className="wo-tile" style={{ position: 'relative', display: 'block', textDecoration: 'none', aspectRatio: '3/4', overflow: 'hidden' }}>
                <img src={t.img} alt={t.name} className="wo-tile-img" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.75) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 22px 24px' }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{t.sub}</p>
                  <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{t.name}</p>
                  <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', fontWeight: 700 }}>PREVIEW →</span>
                </div>
              </Link>
            ))}
          </div>
          <p style={{ textAlign: 'center', padding: '18px 24px 0', fontSize: 13, color: `${US_INK}66` }}>
            Every theme: full checkout · your domain · AI-native features · <Link href="/themes" style={{ color: US_INK, textDecoration: 'underline' }}>see all twelve →</Link>
          </p>
        </section>

        {/* 6-FEATURE GRID — AI-native differentiators */}
        <section style={{ borderTop: `1px solid ${US_INK}0E`, padding: '80px 24px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${US_INK}44`, marginBottom: 14, textAlign: 'center' }}>What makes WearOn different in 2026</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 400, letterSpacing: '-1px', textAlign: 'center', marginBottom: 56, color: US_INK }}>
              Built for agents. Owned by you.
            </h2>
            <div className="wo-us-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px 48px' }}>
              {[
                { label: 'AI BUYER', title: 'AI curates your seasonal edits.', body: 'Describe a vibe — "Summer Beach Edit", "Wedding Guest" — and your AI Buyer selects the products, writes editorial copy, and publishes the collection.' },
                { label: 'MCP ENDPOINT', title: 'Claude can shop your store.', body: 'Every WearOn store gets a live MCP endpoint. When a buyer asks Claude to find a dress, it browses your catalog, checks sizes, and routes to checkout.' },
                { label: 'DM CHECKOUT', title: 'Instagram → payment in one thread.', body: '"I want this" in a DM. AI detects intent, asks for size, sends a payment link — all without leaving the conversation. No app, no redirect.' },
                { label: 'AI VISIBILITY', title: 'See how AI describes your products.', body: 'Your AI Discoverability Score shows whether Rufus, Perplexity, and Google AI Mode can find you — and fixes the gaps with one click.' },
                { label: 'BRAND DNA', title: 'Every AI output sounds like you.', body: "Set your tone, aesthetic, and buyer philosophy once. Every caption, reply, and collection description carries your voice — not a generic AI's." },
                { label: 'CHECKOUT', title: 'Stripe, Razorpay, COD. Zero setup.', body: 'Card, Apple Pay, UPI, COD — all built in. Buyers tap, pick size, pay. You get the order. No DM invoice, no payment-link chase.' },
              ].map(f => (
                <div key={f.label} style={{ borderTop: `1.5px solid ${US_INK}12`, paddingTop: 24 }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: US_ACCENT, marginBottom: 14, fontWeight: 700 }}>{f.label}</p>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 500, letterSpacing: '-0.2px', lineHeight: 1.25, marginBottom: 10, color: US_INK }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: `${US_INK}77`, lineHeight: 1.75 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING — real plans, real INR, matches billing exactly */}
        <section style={{ padding: '100px 24px' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${US_INK}55`, marginBottom: 16, textAlign: 'center' }}>Pricing</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 400, letterSpacing: '-1px', textAlign: 'center', marginBottom: 12, color: US_INK }}>
              Start free. Scale when you&apos;re ready.
            </h2>
            <p style={{ textAlign: 'center', fontSize: 14, color: `${US_INK}66`, marginBottom: 56 }}>All prices in INR · Razorpay + WhatsApp checkout on every plan</p>
            <div className="wo-us-pricing" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {[
                { key: 'free', desc: 'Try it, no card required.', features: [`${PLANS.free.products} products`, 'Branded storefront', 'WhatsApp + card checkout', 'Basic analytics'] },
                { key: 'starter', desc: 'A real store, fully checked out.', features: [`${PLANS.starter.products} products`, 'Full storefront + checkout', 'Custom domain', 'Razorpay + WhatsApp ordering', 'Analytics dashboard'] },
                { key: 'growth', desc: 'Everything in Store, plus the app.', features: [`${PLANS.growth.products} products`, 'Everything in Store', 'Native Android app + Play Store listing', 'Priority support'], featured: true },
                { key: 'pro', desc: 'For sellers who want it all.', features: ['Unlimited products', 'Everything in Store + App', `${PLANS.pro.try_ons} AI try-ons/mo`, `${PLANS.pro.ai_credits} AI photoshoot credits/mo`] },
              ].map(plan => {
                const data = PLANS[plan.key as keyof typeof PLANS]
                return (
                  <div key={plan.key} style={{ padding: '32px 24px', background: plan.featured ? US_INK : '#f8f8f8', color: plan.featured ? '#fff' : US_INK }}>
                    {plan.featured && <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: US_ACCENT, marginBottom: 14, fontWeight: 700 }}>Most popular</p>}
                    <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: plan.featured ? 'rgba(255,255,255,0.45)' : `${US_INK}66`, marginBottom: 10 }}>{data.name}</p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 400, letterSpacing: '-1.5px', marginBottom: 4, lineHeight: 1 }}>
                      {data.price_inr === 0 ? 'Free' : `₹${data.price_inr.toLocaleString('en-IN')}`}
                      <span style={{ fontSize: 13, fontWeight: 400, opacity: 0.45, letterSpacing: 0 }}>{data.price_inr > 0 ? '/mo' : ''}</span>
                    </p>
                    <p style={{ fontSize: 13, color: plan.featured ? 'rgba(255,255,255,0.5)' : `${US_INK}66`, marginBottom: 24 }}>{plan.desc}</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ fontSize: 13, display: 'flex', gap: 8, color: plan.featured ? 'rgba(255,255,255,0.8)' : `${US_INK}99` }}>
                          <span style={{ color: US_ACCENT, flexShrink: 0 }}>—</span>{f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/auth/signup" style={{ display: 'block', textAlign: 'center', padding: '13px 0', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', background: plan.featured ? '#fff' : US_INK, color: plan.featured ? US_INK : '#fff' }}>
                      {data.label} →
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* FOUNDER CTA */}
        <section style={{ padding: '100px 24px', background: US_INK }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Talk to the founder</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 400, letterSpacing: '-1.5px', lineHeight: 1.08, color: '#fff', marginBottom: 20 }}>
              See your store built live. 20 minutes.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 36 }}>
              Sumeet builds a demo store around your niche on the call. No script, no deck, no sales team.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://cal.com/wyberai/wearon-consultation-with-the-founder" target="_blank" rel="noopener noreferrer" style={{ background: '#fff', color: US_INK, padding: '14px 32px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Book a free 20-min call →
              </a>
              <Link href="/auth/signup" style={{ color: '#fff', padding: '14px 32px', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}>
                Start free
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: `1px solid ${US_INK}10`, padding: '28px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 18, letterSpacing: '-0.3px', color: US_INK }}>WearOn</span>
            <span style={{ fontSize: 11, letterSpacing: '0.06em', color: `${US_INK}55`, textTransform: 'uppercase' }}>The Shopify Alternative for Boutiques · 2026</span>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link href="/auth/login" style={{ fontSize: 12, color: `${US_INK}66`, textDecoration: 'none' }}>Login</Link>
              <Link href="/themes" style={{ fontSize: 12, color: `${US_INK}66`, textDecoration: 'none' }}>Live Demo</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}