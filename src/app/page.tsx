import Link from 'next/link'
import { PLANS } from '@/lib/constants'
import { PRICING_COPY } from '@/lib/pricing-copy'
import { ThemePicker } from '@/components/marketing/ThemePicker'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { faqToJsonLd } from '@/lib/schema-org'

// Short, direct-answer format on purpose — this is what AI answer engines
// (Google AI Mode, Perplexity, ChatGPT search) actually quote, not long copy.
const FAQS = [
  { q: 'Is Instastarz really free to start?', a: 'Yes. The Free plan gives you 10 products, a branded storefront, and WhatsApp + Razorpay checkout at no cost — no credit card required.' },
  { q: 'Can I use my own domain?', a: 'Yes. Every paid plan (Store, ₹3,000/mo, and above) includes a custom domain and a professional email address for your store.' },
  { q: 'Are the products I see on the demo stores mine to sell?', a: 'No — the 12 flagship stores (August, Ember, Kiraya, and so on) are live demos showing what each theme looks like with real sample products. When you sign up, your store starts empty and you add your own catalog.' },
  { q: 'Can I import products straight from Instagram?', a: 'Yes. Connect your Instagram account and import your photos and Reels directly as products — including the video, not just a thumbnail.' },
  { q: 'Does Instastarz take a cut of my sales?', a: "No. Instastarz charges a flat monthly subscription, not a percentage of your revenue — you keep 100% of what you sell, minus Razorpay's standard payment processing fee." },
  { q: 'Can I cancel anytime?', a: "Yes. There's no lock-in contract — downgrade to Free or cancel from your dashboard whenever you want." },
  { q: 'Can AI assistants like ChatGPT or Claude find and shop my store?', a: 'Yes. Every Instastarz store gets a live MCP endpoint and an OpenAPI spec, so AI shopping assistants can browse your catalog, check sizes, and check out on a buyer\'s behalf.' },
]

export default function Home() {
  return <USHomePage />
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

const HERO_IMAGE = '/hero/reel-to-receipt.webp'

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
        .wo-hero-image {
          width: 100%;
          height: 340px;
          object-fit: cover;
          object-position: center 30%;
          display: block;
        }
        @media (min-width: 720px) {
          .wo-hero-image { height: 480px; }
        }
        .wo-hero-card {
          position: absolute;
          top: 50%;
          left: 24px;
          transform: translateY(-50%);
          width: min(380px, calc(100% - 48px));
        }
        @media (max-width: 720px) {
          .wo-hero-card { position: static; transform: none; width: auto; margin: 16px 16px 0; }
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
          <Link href="/auth/signup" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 700 }}>
            Launch your store →
          </Link>
        </div>

        <MarketingNav />

        {/* HERO — "reel becomes a receipt": a phone mid-Reel with a checkout */}
        {/* card sliding onto it, visualizing the core pitch directly, with a */}
        {/* floating card over it same as the old photo-collage treatment. */}
        <section style={{ position: 'relative' }}>
          <img src={HERO_IMAGE} alt="An Instagram Reel turning into a checkout — reels become sales on Instastarz" className="wo-hero-image" />
          <div className="wo-hero-card" style={{ background: '#fff', borderRadius: 20, padding: '32px 32px 28px', boxShadow: '0 20px 50px -20px rgba(23,21,18,0.35)' }}>
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

        {/* TRUST STRIP — real integration partners, not fabricated customer
            logos (this site has zero real sellers yet on the fresh DB, so
            inventing customer names would be dishonest). */}
        <section style={{ padding: '28px 24px', borderBottom: `1px solid ${US_INK}0E` }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: `${US_INK}44` }}>Works with</span>
            {['Razorpay', 'WhatsApp Business', 'Instagram'].map(name => (
              <span key={name} style={{ fontSize: 15, fontWeight: 700, color: `${US_INK}55`, letterSpacing: '-0.2px' }}>{name}</span>
            ))}
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
          <ThemePicker tiles={THEME_TILES} />
          <p style={{ textAlign: 'center', padding: '18px 24px 0', fontSize: 13, color: `${US_INK}66` }}>
            Every theme: full checkout · your domain · AI-native features · <Link href="/themes" style={{ color: US_INK, textDecoration: 'underline' }}>see all twelve →</Link>
          </p>
        </section>

        {/* 6-FEATURE GRID — AI-native differentiators */}
        <section style={{ borderTop: `1px solid ${US_INK}0E`, padding: '80px 24px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${US_INK}44`, marginBottom: 14, textAlign: 'center' }}>What makes Instastarz different in 2026</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 400, letterSpacing: '-1px', textAlign: 'center', marginBottom: 56, color: US_INK }}>
              Built for agents. Owned by you.
            </h2>
            <div className="wo-us-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px 48px' }}>
              {[
                { label: 'AI BUYER', title: 'AI curates your seasonal edits.', body: 'Describe a vibe — "Summer Beach Edit", "Wedding Guest" — and your AI Buyer selects the products, writes editorial copy, and publishes the collection.' },
                { label: 'MCP ENDPOINT', title: 'Claude can shop your store.', body: 'Every Instastarz store gets a live MCP endpoint. When a buyer asks Claude to find a dress, it browses your catalog, checks sizes, and routes to checkout.' },
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
              {PRICING_COPY.map(plan => {
                const data = PLANS[plan.key]
                return (
                  <div key={plan.key} style={{ padding: '32px 24px', background: plan.featured ? US_INK : '#f8f8f8', color: plan.featured ? '#fff' : US_INK }}>
                    {plan.featured && <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: US_ACCENT, marginBottom: 14, fontWeight: 700 }}>Most popular</p>}
                    <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: plan.featured ? 'rgba(255,255,255,0.45)' : `${US_INK}66`, marginBottom: 10 }}>{data.name}</p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 400, letterSpacing: '-1.5px', marginBottom: 4, lineHeight: 1 }}>
                      {data.price_inr === 0 ? 'Free' : `₹${data.price_inr.toLocaleString('en-IN')}`}
                      <span style={{ fontSize: 13, fontWeight: 400, opacity: 0.45, letterSpacing: 0 }}>{data.price_inr > 0 ? '/mo' : ''}</span>
                    </p>
                    <p style={{ fontSize: 13, color: plan.featured ? 'rgba(255,255,255,0.5)' : `${US_INK}66`, marginBottom: 24 }}>{plan.description}</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {plan.inclusions.map(f => (
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
            <p style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: `${US_INK}77` }}>
              Refer a seller, get <strong style={{ color: US_INK }}>200 free AI try-ons</strong> — real credit, not a gimmick.
            </p>
          </div>
        </section>

        {/* FAQ — visible Q&A + FAQPage JSON-LD, both for AEO */}
        <section style={{ padding: '100px 24px', borderTop: `1px solid ${US_INK}0E` }}>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqToJsonLd(FAQS.map(f => ({ question: f.q, answer: f.a })))) }} />
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${US_INK}55`, marginBottom: 16, textAlign: 'center' }}>Questions</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.6vw, 40px)', fontWeight: 400, letterSpacing: '-1px', textAlign: 'center', marginBottom: 48, color: US_INK }}>
              Everything you&apos;re wondering.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {FAQS.map(f => (
                <details key={f.q} style={{ borderTop: `1px solid ${US_INK}14`, padding: '20px 0' }}>
                  <summary style={{ fontSize: 16, fontWeight: 600, color: US_INK, cursor: 'pointer', listStyle: 'none' }}>
                    {f.q}
                  </summary>
                  <p style={{ fontSize: 14, color: `${US_INK}88`, lineHeight: 1.7, marginTop: 12, marginBottom: 0 }}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CLOSING CTA — pure self-serve, no human-in-the-loop pitch */}
        <section style={{ padding: '100px 24px', background: US_INK }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Ready when you are</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 400, letterSpacing: '-1.5px', lineHeight: 1.08, color: '#fff', marginBottom: 20 }}>
              Bring your Instagram shop to life.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 36 }}>
              Pick a theme, add your products, start selling — live in minutes, no card required.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" style={{ background: '#fff', color: US_INK, padding: '14px 32px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Start free →
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: `1px solid ${US_INK}10`, padding: '28px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 18, letterSpacing: '-0.3px', color: US_INK }}>Instastarz</span>
            <span style={{ fontSize: 11, letterSpacing: '0.06em', color: `${US_INK}55`, textTransform: 'uppercase' }}>The Shopify Alternative for Boutiques · 2026</span>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link href="/auth/login" style={{ fontSize: 12, color: `${US_INK}66`, textDecoration: 'none' }}>Login</Link>
              <Link href="/themes" style={{ fontSize: 12, color: `${US_INK}66`, textDecoration: 'none' }}>Live Demo</Link>
            </div>
          </div>
          <p style={{ maxWidth: 900, margin: '16px auto 0', fontSize: 11, color: `${US_INK}44`, textAlign: 'center' }}>
            © 2026 Signalpulse Technologies. Instastarz is a product of Signalpulse Technologies.
          </p>
        </footer>
      </div>
    </>
  )
}