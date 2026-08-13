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

const US_PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    badge: null,
    desc: 'Up to 20 products. Try it, no card required.',
    features: ['Branded storefront', 'Card checkout (Stripe)', 'Basic analytics'],
  },
  {
    name: 'Pro',
    price: '$49',
    badge: 'LESS THAN SHOPIFY BASIC',
    desc: 'Everything a boutique actually needs.',
    features: ['Unlimited products', 'Stripe checkout, 0% platform fee*', 'AI product photos', 'Your own domain', 'Full analytics'],
    featured: true,
  },
  {
    name: 'Growth',
    price: '$149',
    badge: null,
    desc: 'Still less than Shopify + Klaviyo + Loox.',
    features: ['Everything in Pro', 'Android app + Play Store listing', 'Virtual try-on', 'AI video clips ($0.60/clip)', 'TikTok Shop sync'],
  },
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

function USHomePage() {
  const THEME_TILES = [
    { name: 'EDITORIAL', sub: 'Dark & fashion-forward', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop', slug: 'editorial' },
    { name: 'SOFT BLUSH', sub: 'Feminine & warm', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=800&fit=crop', slug: 'soft-blush' },
    { name: 'MINIMAL', sub: 'Clean & airy', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop', slug: 'minimal' },
    { name: 'BOLD FEED', sub: 'TikTok-native', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop', slug: 'bold-feed' },
    { name: 'LUXURY', sub: 'Premium boutique', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop', slug: 'luxury' },
  ]

  return (
    <>
      <style>{`
        .wo-tile-img { transition: transform 0.55s ease; }
        .wo-tile:hover .wo-tile-img { transform: scale(1.04); }
        @media (max-width: 640px) {
          .wo-us-compare { grid-template-columns: 1fr !important; }
          .wo-us-features { grid-template-columns: 1fr !important; gap: 32px !important; }
          .wo-us-pricing { grid-template-columns: 1fr !important; }
        }
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

        {/* HERO */}
        <section style={{ position: 'relative', height: '92vh', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=900&fit=crop"
            alt="" aria-hidden
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.65) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 32px 52px' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 14 }}>
              For boutique sellers on Instagram, TikTok &amp; Facebook
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 7vw, 88px)', fontWeight: 400, lineHeight: 1.02, letterSpacing: '-2px', color: '#fff', margin: '0 0 28px', maxWidth: 780 }}>
              Everything Shopify charges $150/mo for. We charge $49.
            </h1>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/auth/signup" style={{ background: '#fff', color: US_INK, padding: '14px 28px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase' }}>
                Start free →
              </Link>
              <a href="https://cal.com/wyberai/wearon-consultation-with-the-founder" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', padding: '14px 28px', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textDecoration: 'none', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.5)' }}>
                Book a demo
              </a>
            </div>
          </div>
        </section>

        {/* MARQUEE STRIP */}
        <div style={{ background: US_INK, color: '#fff', padding: '13px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <style>{`@keyframes wo-scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
          <div style={{ display: 'inline-block', animation: 'wo-scroll 24s linear infinite' }}>
            {['STRIPE CHECKOUT', 'AI PRODUCT PHOTOS', 'YOUR OWN DOMAIN', 'INSTAGRAM SYNC', 'TIKTOK SHOP', 'FREE TO START', 'NO SHOPIFY FEES', 'REAL ANALYTICS', 'STRIPE CHECKOUT', 'AI PRODUCT PHOTOS', 'YOUR OWN DOMAIN', 'INSTAGRAM SYNC', 'TIKTOK SHOP', 'FREE TO START', 'NO SHOPIFY FEES', 'REAL ANALYTICS'].map((item, i) => (
              <span key={i} style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 500 }}>
                {item}<span style={{ margin: '0 28px', opacity: 0.3 }}>·</span>
              </span>
            ))}
          </div>
        </div>

        {/* THEME TILES */}
        <section style={{ paddingTop: 64 }}>
          <div style={{ padding: '0 24px', marginBottom: 32 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${US_INK}55`, marginBottom: 10 }}>5 storefront looks</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 400, letterSpacing: '-1px', lineHeight: 1.1, color: US_INK }}>
              Your store. Your look.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {THEME_TILES.slice(0, 4).map(t => (
              <Link key={t.slug} href={`/store/demo?theme=${t.slug}`} className="wo-tile" style={{ position: 'relative', display: 'block', textDecoration: 'none', aspectRatio: '3/4', overflow: 'hidden' }}>
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
          <Link href={`/store/demo?theme=${THEME_TILES[4].slug}`} className="wo-tile" style={{ position: 'relative', display: 'block', textDecoration: 'none', height: 320, overflow: 'hidden' }}>
            <img src={THEME_TILES[4].img} alt={THEME_TILES[4].name} className="wo-tile-img" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.72) 0%, transparent 55%)' }} />
            <div style={{ position: 'absolute', top: '50%', left: 32, transform: 'translateY(-50%)' }}>
              <p style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{THEME_TILES[4].sub}</p>
              <p style={{ fontSize: 34, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{THEME_TILES[4].name}</p>
              <span style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff', fontWeight: 700 }}>PREVIEW →</span>
            </div>
          </Link>
          <p style={{ textAlign: 'center', padding: '18px 24px 0', fontSize: 13, color: `${US_INK}66` }}>
            Every theme: Stripe checkout · Your domain · AI product photos
          </p>
        </section>

        {/* SHOPIFY COMPARISON */}
        <section style={{ padding: '100px 24px' }}>
          <div className="wo-us-compare" style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <div style={{ background: '#f3f3f3', padding: '40px 36px' }}>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${US_INK}55`, marginBottom: 24 }}>What boutiques pay Shopify</p>
              {[['Shopify Basic', '$79'], ['Klaviyo', '$45'], ['Loox reviews', '$10'], ['Gorgias support', '$10'], ['Tidio chat', '$19']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                  <span style={{ fontSize: 14, color: `${US_INK}77` }}>{k}</span>
                  <span style={{ fontSize: 14, color: `${US_INK}66`, fontVariantNumeric: 'tabular-nums' }}>{v}/mo</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0' }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: US_INK }}>Total</span>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#c0392b', fontVariantNumeric: 'tabular-nums' }}>$163/mo</span>
              </div>
              <p style={{ fontSize: 11, color: `${US_INK}44`, marginTop: 6 }}>+ 2.9% transaction fee on every sale</p>
            </div>
            <div style={{ background: US_INK, padding: '40px 36px', color: '#fff' }}>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>WearOn Pro — all of it</p>
              {[['Storefront + Stripe checkout', '✓'], ['Email capture + analytics', '✓'], ['Customer reviews', '✓'], ['AI product photos', '✓'], ['Your own domain', '✓']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{k}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: US_ACCENT }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0' }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>$49/mo</span>
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>+ Stripe rate (2.9% + 30¢), passed through at cost</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/auth/signup" style={{ display: 'inline-block', background: US_INK, color: '#fff', padding: '14px 36px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Start free — no card required →
            </Link>
          </div>
        </section>

        {/* 3-COLUMN FEATURES */}
        <section style={{ borderTop: `1px solid ${US_INK}0E`, borderBottom: `1px solid ${US_INK}0E`, padding: '80px 24px' }}>
          <div className="wo-us-features" style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
            {[
              { label: 'CHECKOUT', title: 'Card. Apple Pay. Google Pay.', body: 'Stripe built in. No payment setup, no DM invoice. Buyer taps, pays, done.' },
              { label: 'OWNERSHIP', title: 'Your domain. Your customers.', body: "yourboutique.com. Your email list. Not Meta's algorithm, not Shopify's platform." },
              { label: 'AI STUDIO', title: 'Studio photos from a flat-lay.', body: 'Upload your garment. Get a styled model photo in 60 seconds. $0.60/clip for video.' },
            ].map(f => (
              <div key={f.label}>
                <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${US_INK}44`, marginBottom: 14 }}>{f.label}</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 500, letterSpacing: '-0.2px', lineHeight: 1.25, marginBottom: 10, color: US_INK }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: `${US_INK}88`, lineHeight: 1.7 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section style={{ padding: '100px 24px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${US_INK}55`, marginBottom: 16, textAlign: 'center' }}>Pricing</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 400, letterSpacing: '-1px', textAlign: 'center', marginBottom: 56, color: US_INK }}>
              Start free. Scale when you&apos;re ready.
            </h2>
            <div className="wo-us-pricing" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {[
                { name: 'Starter', price: 'Free', desc: '20 products. Try it.', features: ['Branded storefront', 'Card checkout', 'Basic analytics'], cta: 'Start free', featured: false },
                { name: 'Pro', price: '$49', desc: 'Less than Shopify Basic.', features: ['Unlimited products', '0% platform fee*', 'AI product photos', 'Your domain', 'Full analytics'], cta: 'Get started', featured: true },
                { name: 'Growth', price: '$149', desc: 'Less than Shopify + apps.', features: ['Everything in Pro', 'Android app', 'Virtual try-on', 'AI video clips', 'TikTok sync'], cta: 'Get started', featured: false },
              ].map(plan => (
                <div key={plan.name} style={{ padding: '36px 28px', background: plan.featured ? US_INK : '#f8f8f8', color: plan.featured ? '#fff' : US_INK }}>
                  {plan.featured && <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: US_ACCENT, marginBottom: 14, fontWeight: 700 }}>Most popular</p>}
                  <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: plan.featured ? 'rgba(255,255,255,0.45)' : `${US_INK}66`, marginBottom: 10 }}>{plan.name}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 400, letterSpacing: '-2px', marginBottom: 4, lineHeight: 1 }}>
                    {plan.price}<span style={{ fontSize: 14, fontWeight: 400, opacity: 0.45, letterSpacing: 0 }}>{plan.price !== 'Free' ? '/mo' : ''}</span>
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
                    {plan.cta} →
                  </Link>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: 11, color: `${US_INK}44`, marginTop: 20 }}>
              * Stripe transaction fee (2.9% + 30¢) applies, passed through at cost.
            </p>
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
              <Link href="/store/demo?theme=editorial" style={{ fontSize: 12, color: `${US_INK}66`, textDecoration: 'none' }}>Live Demo</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}