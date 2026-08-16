import Link from 'next/link'
import { PLANS } from '@/lib/constants'
import { StorePreviewCapture } from '@/components/marketing/StorePreviewCapture'
import { MarketingNav } from '@/components/marketing/MarketingNav'

const PAIN_POINTS = [
  {
    n: '01',
    label: 'Everyone asks "price?". Almost nobody buys.',
    body: 'Your comments fill up, your DMs fill up, you reply to the same question forty times a day — and most of those conversations just go quiet. That\'s not a sales problem. That\'s a checkout problem.',
  },
  {
    n: '02',
    label: 'Instagram gives you exactly one clickable link',
    body: 'A Reel does 40K views, comments flood in — and not one of them can tap to buy. Your bio has one link. You\'re not using it like a store, because it isn\'t one.',
  },
  {
    n: '03',
    label: 'You\'ve built a real boutique. It still looks like a hobby.',
    body: 'No catalogue, no prices, no proper checkout — just a feed and a follow button. Instastarz gives buyers a store. Your name on it, not ours.',
  },
]

const STEPS = [
  { n: '01', title: 'Pick a look built for reels', body: 'Three storefronts designed around video, not just photos — pick the one that fits how you already post.' },
  { n: '02', title: 'Import your reels as products', body: 'Connect Instagram, pick the posts, add price and size. The reel plays right on the product page — no re-filming.' },
  { n: '03', title: 'WhatsApp orders, no more "price?"', body: 'Every product has an order button. Size, color, price — pre-filled. Your phone buzzes with the order, not the question.' },
]

const FEATURES = [
  { title: 'Your branding. Not ours.', body: 'Your logo, your colors, your store name. Buyers see your boutique — white-label by default.' },
  { title: 'WhatsApp checkout, built in.', body: 'Every product has a pre-filled order button straight to your number. No payment gateway setup required.' },
  { title: 'A real catalogue.', body: 'Categories, sizes, colors, descriptions, photos and video. Buyers browse your full range — not just your last post.' },
  { title: 'Analytics that mean something.', body: 'Which products get views, which convert to orders, which drop off. Know what buyers actually want.' },
]

const AI_REELS = {
  title: 'AI Reels, not just product photos',
  body: 'No photoshoot, no model, no studio. Upload one flat-lay of your garment — we put an AI model in it and hand you a Reel-ready video.',
  price: '₹50',
  priceLabel: 'per video',
}

const INSTA_THEMES = [
  { id: 'reelrack', name: 'Reel Rack', tagline: 'Every reel, on the rack.', image: '/reelrack/products/wine-wrap-midi-dress.jpg', desc: 'A clean, category-driven storefront — sale badges, wishlist, and your reels playing right on the product cards.' },
  { id: 'thegrid', name: 'The Grid', tagline: 'Shop the grid, not the feed.', image: '/thegrid/products/black-slip-midi-dress.jpg', desc: 'The classic Instagram profile grid, turned into a real shop — videos autoplay in-grid exactly like scrolling your own page.' },
  { id: 'tryiton', name: 'Try It On', tagline: 'See it move before you buy.', image: '/tryiton/products/sequin-bodycon-dress.jpg', desc: 'A normal catalogue, except every product page opens with your actual reel playing instead of a photo.' },
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

export default function InstaLandingPage() {
  const pricingPlans = (Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).filter(([k]) => k !== 'enterprise')

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .wo-grid-2 { grid-template-columns: 1fr !important; }
          .wo-steps { grid-template-columns: 1fr !important; }
          .wo-features { grid-template-columns: 1fr !important; }
          .wo-pricing { grid-template-columns: repeat(2, 1fr) !important; }
          .wo-themes { grid-template-columns: 1fr !important; }
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

        {/* ── HERO ── */}
        <section style={{ position: 'relative', minHeight: 620, display: 'flex', alignItems: 'center', overflow: 'hidden', padding: '160px 24px 100px', background: `linear-gradient(160deg, ${ACCENT}14 0%, #FAF7F3 60%)` }}>
          <div style={{ position: 'relative', zIndex: 5, maxWidth: 1240, margin: '0 auto', width: '100%' }}>
            <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 18 }}>
              for indian instagram fashion sellers
            </p>
            <h1 className="wo-hero-h1" style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(44px, 7vw, 84px)', fontWeight: 500, lineHeight: 1.02, letterSpacing: '-1.5px', color: INK, maxWidth: 780, margin: 0 }}>
              So many likes. So few <em style={{ fontStyle: 'italic', color: ACCENT }}>sales</em>.
            </h1>
            <p style={{ fontSize: 18, color: `${INK}bb`, lineHeight: 1.6, maxWidth: 500, marginTop: 24, marginBottom: 36 }}>
              Someone asks &quot;price?&quot;. You reply. They go quiet. Bring your Insta shop to life with a real storefront built around your reels — and let it automate the selling, not just the scrolling.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link
                href="/auth/signup"
                className="wo-hover-lift"
                style={{ background: INK, color: '#fff', padding: '16px 30px', borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: 'none' }}
              >
                Launch my store, free →
              </Link>
              <a href="#pick-your-look" className="wo-hover-lift" style={{ color: INK, padding: '16px 30px', borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: `1px solid ${INK}33` }}>
                See the 3 looks
              </a>
            </div>
          </div>
        </section>

        {/* ── PAIN POINTS ── */}
        <section style={{ position: 'relative', padding: '90px 0 80px', maxWidth: 1240, margin: '0 auto', overflow: 'hidden' }}>
          <div aria-hidden style={{
            position: 'absolute', top: -120, right: -80, width: 380, height: 380, borderRadius: '50%',
            background: `radial-gradient(circle, ${ACCENT}12, transparent 70%)`, pointerEvents: 'none',
          }} />
          <h2 style={{ position: 'relative', fontFamily: 'var(--font-marketing)', fontSize: 'clamp(28px, 3.6vw, 40px)', fontWeight: 500, lineHeight: 1.15, letterSpacing: '-0.5px', marginBottom: 40, padding: '0 24px' }}>
            Reach isn&apos;t the problem.<br />Turning it into a sale is.
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
                  fontFamily: 'var(--font-marketing)', fontSize: 13, fontWeight: 600, color: ACCENT,
                }}>{n}</span>
                <p style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.2px', margin: '18px 0 10px' }}>{label}</p>
                <p style={{ fontSize: 14.5, color: `${INK}99`, lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PICK YOUR LOOK — the 3 Insta themes ── */}
        <section id="pick-your-look" style={{ padding: '90px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>built for reels, not just photos</p>
            <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(26px, 3.4vw, 38px)', fontWeight: 500, letterSpacing: '-0.5px', marginBottom: 16, maxWidth: 640 }}>
              Three storefronts. All three play your actual reels.
            </h2>
            <p style={{ fontSize: 15, color: `${INK}99`, marginBottom: 48, maxWidth: 560, lineHeight: 1.7 }}>
              Pick the one that fits how you already post — your reel plays right on the product, not just your Instagram feed.
            </p>
            <div className="wo-themes" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {INSTA_THEMES.map(t => (
                <Link
                  key={t.id}
                  href={`/auth/signup?theme=${t.id}`}
                  className="wo-card"
                  style={{ display: 'block', borderRadius: 20, overflow: 'hidden', background: '#FAF7F3', textDecoration: 'none', color: INK, boxShadow: '0 12px 30px -20px rgba(23,21,18,0.14)' }}
                >
                  <div style={{ aspectRatio: '4/5', overflow: 'hidden', background: '#efe9e0' }}>
                    <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ padding: '22px 22px 26px' }}>
                    <h3 style={{ fontFamily: 'var(--font-marketing)', fontSize: 20, fontWeight: 600, letterSpacing: '-0.2px', marginBottom: 4 }}>{t.name}</h3>
                    <p style={{ fontSize: 13, color: ACCENT, fontWeight: 600, marginBottom: 10 }}>{t.tagline}</p>
                    <p style={{ fontSize: 14, color: `${INK}99`, lineHeight: 1.6, marginBottom: 16 }}>{t.desc}</p>
                    <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>Start with {t.name} →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: '90px 24px', background: '#FAF7F3' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>how it works</p>
            <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(26px, 3.2vw, 36px)', fontWeight: 500, letterSpacing: '-0.4px', marginBottom: 56, maxWidth: 500 }}>
              Live in 10 minutes. Reels included.
            </h2>
            <div className="wo-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
              {STEPS.map(({ n, title, body }) => (
                <div key={n} style={{ borderTop: `2px solid ${ACCENT}`, paddingTop: 22 }}>
                  <span style={{ fontFamily: 'var(--font-marketing)', fontSize: 40, fontWeight: 500, color: `${INK}1a` }}>{n}</span>
                  <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.2px', margin: '12px 0 10px' }}>{title}</h3>
                  <p style={{ fontSize: 15, color: `${INK}99`, lineHeight: 1.7 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ padding: '90px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>what you get</p>
            <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(26px, 3.2vw, 36px)', fontWeight: 500, letterSpacing: '-0.4px', marginBottom: 56, maxWidth: 560 }}>
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

            {/* AI Reels — one distinct callout, real price */}
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
                <div style={{ fontFamily: 'var(--font-marketing)', fontSize: 34, fontWeight: 500, color: '#F0A8BE', lineHeight: 1 }}>{AI_REELS.price}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{AI_REELS.priceLabel}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SEE YOUR OWN STORE ── */}
        <section style={{ padding: '110px 24px', background: INK }}>
          <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 18 }}>see it before you build it</p>
            <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(28px, 3.6vw, 40px)', fontWeight: 500, letterSpacing: '-0.5px', color: '#fff', marginBottom: 20 }}>
              What would <em style={{ fontStyle: 'italic' }}>your</em> store look like?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 40 }}>
              Type your boutique name and email — see a live preview of your store and dashboard, with real analytics and an AI-automated inbox already running. No signup required to look.
            </p>
            <StorePreviewCapture theme={{ name: INSTA_THEMES[0].name, slug: INSTA_THEMES[0].id }} />
          </div>
        </section>

        {/* ── PRICING ── */}
        <section style={{ padding: '100px 24px', background: '#FAF7F3' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <p style={{ fontSize: 13, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT, marginBottom: 16 }}>plans</p>
              <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(26px, 3.4vw, 38px)', fontWeight: 500, letterSpacing: '-0.5px', marginBottom: 10 }}>
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
                    <div style={{ fontFamily: 'var(--font-marketing)', fontSize: 32, fontWeight: 500, letterSpacing: '-0.5px', marginBottom: 4 }}>
                      {plan.price_inr === 0 ? 'Free' : `₹${plan.price_inr.toLocaleString('en-IN')}`}
                      {plan.price_inr > 0 && <span style={{ fontSize: 14, fontWeight: 400, color: featured ? 'rgba(255,255,255,0.5)' : `${INK}66` }}>/mo</span>}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '22px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        `${plan.products === 9999 ? 'Unlimited' : plan.products} products`,
                        'Branded PWA store',
                        'WhatsApp ordering',
                        ...(key !== 'free' ? ['WhatsApp + Instagram + Facebook AI automation'] : ['Basic AI DM automation']),
                        ...(key === 'starter' || key === 'growth' || key === 'pro' ? ['Custom domain'] : []),
                        ...(key === 'growth' || key === 'pro' ? ['Native Android app'] : []),
                        ...(key === 'pro' ? ['Buyer virtual try-on', 'AI Reels — from ₹50/video'] : []),
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
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{ position: 'relative', padding: '130px 24px', textAlign: 'center', overflow: 'hidden' }}>
          <div aria-hidden style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 700, height: 500, borderRadius: '50%',
            background: `radial-gradient(circle, ${ACCENT}10, transparent 65%)`, pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(34px, 5.5vw, 60px)', fontWeight: 500, letterSpacing: '-1px', lineHeight: 1.08, marginBottom: 22 }}>
              Stop answering &quot;price?&quot;.<br /><em style={{ fontStyle: 'italic', color: ACCENT }}>Start getting orders.</em>
            </h2>
            <p style={{ fontSize: 16, color: `${INK}99`, marginBottom: 36, lineHeight: 1.7 }}>
              One link in your bio. Your reels, selling on their own. Your brand, not ours.
            </p>
            <Link
              href="/auth/signup"
              className="wo-hover-lift"
              style={{ background: INK, color: '#fff', padding: '18px 40px', borderRadius: 999, fontSize: 16, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}
            >
              Launch my store, free →
            </Link>
            <p style={{ marginTop: 20, fontSize: 13, color: `${INK}66` }}>
              Free plan · No credit card · Live in 10 minutes
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: `1px solid ${INK}14`, padding: '28px 24px' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontFamily: 'var(--font-marketing)', fontWeight: 500, fontSize: 16 }}>Instastarz</span>
            <span style={{ fontSize: 13, color: `${INK}66` }}>Built for Indian Instagram boutiques · 2026</span>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link href="/auth/login" style={{ fontSize: 13, color: `${INK}77`, textDecoration: 'none' }}>Login</Link>
              <Link href="/themes" style={{ fontSize: 13, color: `${INK}77`, textDecoration: 'none' }}>All themes</Link>
            </div>
          </div>
          <p style={{ maxWidth: 1240, margin: '16px auto 0', fontSize: 11, color: `${INK}44`, textAlign: 'center' }}>
            © 2026 Signalpulse Technologies. Instastarz is a product of Signalpulse Technologies.
          </p>
        </footer>

      </div>
    </>
  )
}
