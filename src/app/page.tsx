import Link from 'next/link'
import { PLANS } from '@/lib/constants'

const TICKER_ITEMS = [
  '💬 "No more price DMs" — Priya\'s Boutique, Surat',
  '📱 12 WhatsApp orders in one hour after a Reel drop',
  '🔥 Coimbatore seller live in 9 minutes, first order in 40',
  '💚 "Customers actually buy instead of asking price" — Surat boutique',
  '🌟 Store live. Bio link updated. First order in 47 minutes.',
  '👗 Jaipur seller: 38 orders in first weekend after going live',
  '📦 "My customers stopped DMing and started ordering" — Indore co-ord store',
  '✨ 4 cities, 80+ sellers, all running their own branded app',
]

const TICKER_DOUBLED = [...TICKER_ITEMS, ...TICKER_ITEMS]

const FLOATING_CARDS = [
  {
    img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=160&h=200&fit=crop&crop=top',
    name: 'Floral Cotton Kurti',
    price: '₹899',
    stat: 'New WhatsApp order ↗',
    delay: '0s',
  },
  {
    img: 'https://images.unsplash.com/photo-1617627143233-b27e68dda5df?w=160&h=200&fit=crop&crop=top',
    name: 'Embroidered Anarkali',
    price: '₹2,199',
    stat: '12 orders this week',
    delay: '1.5s',
  },
]

const PAIN_POINTS = [
  {
    icon: '📩',
    stat: '3+ hours',
    label: 'answering DMs every single day',
    body: '"How much?" "Which sizes?" "Can you show it on someone?" You\'re doing this at midnight instead of sleeping. That\'s not hustle — that\'s a leak.',
  },
  {
    icon: '🔗',
    stat: 'Zero',
    label: 'clickable links allowed in Instagram posts',
    body: 'You drop a Reel, it does 40K views, comments flood in — and not one of them can tap to buy. Instagram bio has one link. You\'re not using it like a store.',
  },
  {
    icon: '🏪',
    stat: '₹0',
    label: 'invested — yet zero branded presence',
    body: 'You\'ve built a real boutique on Instagram. But buyers see no catalog, no prices, no proper ordering. It looks like a hobby. WearOn makes it look like a brand.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Set up in 10 minutes',
    body: 'Upload your logo, pick your brand colors, add your kurtis, sarees, lehengas, co-ords. Your branded store is live — your boutique name, not ours.',
    icon: '🎨',
  },
  {
    n: '02',
    title: 'One link in your bio',
    body: 'Drop stores.wyberai.in/store/yourboutique in your Instagram bio. Followers open it on mobile — no download, no app store, instant browsing.',
    icon: '🔗',
  },
  {
    n: '03',
    title: 'WhatsApp orders flow in',
    body: 'Every product has a pre-filled WhatsApp order button. Buyer taps. Your phone buzzes with an order. Size, color, price — all pre-filled. No DMs to answer.',
    icon: '💬',
  },
]

const FEATURES = [
  {
    icon: '🏷️',
    title: 'Your branding. Not ours.',
    body: 'Your logo, your colors, your store name. Buyers see "Priya\'s Boutique" — not WearOn. White-label by default.',
  },
  {
    icon: '💬',
    title: 'WhatsApp checkout built in.',
    body: 'Every product has a pre-filled WhatsApp order button. The message goes straight to your number. No payment gateway setup required.',
  },
  {
    icon: '📱',
    title: 'No app download needed.',
    body: 'Works in the mobile browser. Share one link in your Instagram bio. Buyers tap, browse, order — like a native app, zero friction.',
  },
  {
    icon: '📦',
    title: 'Full product catalogue.',
    body: 'Categories, sizes, colors, descriptions, photos. Buyers can browse your full range — not just what you last posted on Instagram.',
  },
  {
    icon: '📊',
    title: 'Real-time analytics.',
    body: 'See which products are getting views, which convert to WhatsApp orders, which drop off. Know what your buyers actually want.',
  },
  {
    icon: '🤖',
    title: 'AI style assistant.',
    body: 'Buyers describe what they want — "office kurti under ₹1000" or "Diwali lehenga". The AI recommends from your catalogue, not a generic database.',
  },
]

const PROOF_STATS = [
  { n: '10 min', label: 'to go live', source: 'no code, no tech team needed' },
  { n: '1 link', label: 'changes everything', source: 'Instagram bio → full branded store' },
  { n: '₹0', label: 'to start', source: 'free plan · no credit card needed' },
]

export default function Home() {
  const pricingPlans = (Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).filter(([k]) => k !== 'enterprise')

  return (
    <>
      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1.0) translate(0, 0); }
          100% { transform: scale(1.12) translate(-2%, -1%); }
        }
        @keyframes heroReveal {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50%       { transform: translateY(-10px) rotate(-2deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0) rotate(2deg); }
          50%       { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(247,37,133,0.2); }
          50%       { box-shadow: 0 0 60px rgba(247,37,133,0.45); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
        .hero-bg   { animation: kenBurns 22s ease-out forwards; }
        .float-a   { animation: floatA 6s ease-in-out infinite; }
        .float-b   { animation: floatB 8s ease-in-out infinite 0.8s; }
        .ticker-track { display: flex; width: max-content; animation: ticker 45s linear infinite; gap: 4rem; }
        .reveal-1  { animation: heroReveal 0.8s ease both 0.1s; }
        .reveal-2  { animation: heroReveal 0.8s ease both 0.28s; }
        .reveal-3  { animation: heroReveal 0.8s ease both 0.46s; }
        .reveal-4  { animation: heroReveal 0.8s ease both 0.62s; }
        .reveal-5  { animation: heroReveal 0.8s ease both 0.78s; }
        .cta-glow  { animation: pulseGlow 3s ease-in-out infinite; }
        .cursor    { animation: blink 1s step-end infinite; }
        .plan-card:hover { transform: translateY(-4px); transition: transform 0.25s ease; }
        .plan-card { transition: transform 0.25s ease; }
        .floating-cards { display: flex; }
        @media (max-width: 1024px) { .floating-cards { display: none !important; } }
        @media (max-width: 768px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pain-grid { grid-template-columns: 1fr !important; }
          .proof-grid { grid-template-columns: 1fr !important; }
          .showcase-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ background: '#09090B', color: '#fff', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}>

        {/* ── NAV ─────────────────────────────────────── */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)', background: 'rgba(9,9,11,0.8)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>
                Wear<span style={{ color: '#F72585' }}>On</span>
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(247,37,133,0.15)', color: '#F472B6', padding: '2px 8px', borderRadius: 99, border: '1px solid rgba(247,37,133,0.25)', letterSpacing: '0.05em' }}>
                BETA
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <Link href="/auth/login" style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>Login</Link>
              <Link href="/auth/signup" style={{ background: '#F72585', color: '#fff', padding: '8px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                Get Started Free →
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ─────────────────────────────────────── */}
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>

          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <img
              className="hero-bg"
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80"
              alt=""
              aria-hidden
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.15, transformOrigin: 'center' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 40% -10%, rgba(247,37,133,0.22) 0%, transparent 65%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(9,9,11,0.15) 0%, rgba(9,9,11,0.7) 60%, rgba(9,9,11,1) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
          </div>

          {/* Floating product cards */}
          <div className="floating-cards" style={{ position: 'absolute', right: 80, top: '50%', transform: 'translateY(-50%)', flexDirection: 'column', gap: 16, zIndex: 10 }}>
            {FLOATING_CARDS.map((p) => (
              <div
                key={p.name}
                className={p.delay === '0s' ? 'float-a' : 'float-b'}
                style={{
                  display: 'flex', gap: 12, padding: '12px 16px', borderRadius: 16,
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  animationDelay: p.delay,
                  width: 240,
                }}
              >
                <img src={p.img} alt={p.name} style={{ width: 52, height: 64, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{p.name}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#F72585', marginBottom: 5 }}>{p.price}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
                    {p.stat}
                  </div>
                </div>
              </div>
            ))}
            <div
              className="float-a"
              style={{
                padding: '10px 14px', borderRadius: 16,
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.25)',
                animationDelay: '2.5s', width: 240, display: 'flex', alignItems: 'center', gap: 10
              }}
            >
              <div style={{ fontSize: 22 }}>💬</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#4ADE80' }}>New WhatsApp order</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Anarkali · Size M · ₹2,199 · Prepaid</div>
              </div>
            </div>
          </div>

          {/* Hero content */}
          <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '140px 24px 100px', width: '100%' }}>
            <div style={{ maxWidth: 660 }}>
              <div className="reveal-1" style={{ opacity: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase' }}>
                  For Indian Instagram fashion sellers
                </span>
              </div>

              <h1 className="reveal-2" style={{ fontSize: 'clamp(40px, 6.5vw, 72px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', margin: '20px 0 20px', opacity: 0 }}>
                Your boutique deserves<br />
                <span style={{ color: '#F72585' }}>its own app.</span>
              </h1>

              <p className="reveal-3" style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 520, marginBottom: 16, opacity: 0 }}>
                Your customers DM you asking price, size, availability. You spend 3 hours a day answering.
                WearOn gives you a <em>proper branded store</em> — your logo, your colors, your WhatsApp — that handles all that.
              </p>

              <p className="reveal-3" style={{ fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, maxWidth: 480, marginBottom: 36, opacity: 0 }}>
                One link in your Instagram bio. Buyers browse your full catalogue, tap to order on WhatsApp.
                Live in 10 minutes. No code.
              </p>

              <div className="reveal-4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', opacity: 0 }}>
                <Link
                  href="/auth/signup"
                  className="cta-glow"
                  style={{ background: '#F72585', color: '#fff', padding: '16px 32px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}
                >
                  Launch My Boutique App Free →
                </Link>
                <Link
                  href="/store/demo"
                  style={{ color: '#fff', padding: '16px 32px', borderRadius: 14, fontSize: 16, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', display: 'inline-block', backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.05)' }}
                >
                  See Live Demo
                </Link>
              </div>

              <div className="reveal-5" style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 44, opacity: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block', boxShadow: '0 0 8px #4ADE80' }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Live in 10 minutes · No code</span>
                </div>
                <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Free plan · No credit card needed</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── TICKER ───────────────────────────────────── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(247,37,133,0.06)', padding: '14px 0', overflow: 'hidden' }}>
          <div className="ticker-track">
            {TICKER_DOUBLED.map((item, i) => (
              <span key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 12 }}>
                {item}
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(247,37,133,0.5)', display: 'inline-block', flexShrink: 0 }} />
              </span>
            ))}
          </div>
        </div>

        {/* ── THE PROBLEM ──────────────────────────────── */}
        <section style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase', marginBottom: 14 }}>
              What every Instagram boutique is dealing with
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px' }}>
              You built a real boutique.<br />Instagram wasn&apos;t designed for it.
            </h2>
          </div>
          <div className="pain-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {PAIN_POINTS.map(({ icon, stat, label, body }) => (
              <div key={stat} style={{ padding: '36px 32px', borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{icon}</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#F72585', letterSpacing: '-1px', lineHeight: 1 }}>{stat}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 16, marginTop: 4 }}>{label}</div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────── */}
        <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase', marginBottom: 14 }}>
                From DM chaos to branded boutique
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Live in 10 minutes. Seriously.
              </h2>
            </div>
            <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {STEPS.map(({ n, title, body, icon }) => (
                <div key={n} style={{ padding: '36px 32px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 11, fontWeight: 800, color: 'rgba(247,37,133,0.3)', letterSpacing: '0.1em' }}>{n}</div>
                  <div style={{ fontSize: 32, marginBottom: 20 }}>{icon}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.3px' }}>{title}</h3>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STORE SHOWCASE ───────────────────────────── */}
        <section style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <div className="showcase-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase', marginBottom: 16 }}>
                Your store. Your brand.
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 20 }}>
                Looks like a premium<br />fashion app. Runs on<br />a free link.
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 28 }}>
                Every seller gets their own branded storefront — your logo, your color palette, your catalogue. Buyers see your brand name, not ours.
                The same link works on every phone, no download required.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Your logo + brand colors — not WearOn\'s',
                  'Full product catalogue with sizes, colors, descriptions',
                  'WhatsApp order button on every product',
                  'Works on any phone, no app to install',
                  'Upgrade to get your own Android APK',
                ].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: '#F72585', flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Store mockup */}
            <div style={{ position: 'relative' }}>
              {/* Phone shell */}
              <div style={{
                width: 260, margin: '0 auto',
                background: '#0F0F11',
                borderRadius: 40, border: '8px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
                boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
              }}>
                {/* Notch */}
                <div style={{ height: 28, background: '#0A0A0D', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 6 }}>
                  <div style={{ width: 60, height: 6, background: 'rgba(255,255,255,0.12)', borderRadius: 99 }} />
                </div>

                {/* Store header */}
                <div style={{ background: '#F72585', padding: '16px 16px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>👗</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>Priya&apos;s Boutique</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>Surat · 124 products</div>
                    </div>
                  </div>
                </div>

                {/* Category tabs */}
                <div style={{ background: '#111', padding: '8px 12px', display: 'flex', gap: 6, overflowX: 'auto' }}>
                  {['All', 'Kurtis', 'Sarees', 'Co-ords'].map((c, i) => (
                    <div key={c} style={{
                      padding: '4px 10px', borderRadius: 99, fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap',
                      background: i === 0 ? '#F72585' : 'rgba(255,255,255,0.07)',
                      color: i === 0 ? '#fff' : 'rgba(255,255,255,0.4)',
                    }}>{c}</div>
                  ))}
                </div>

                {/* Product grid */}
                <div style={{ background: '#111', padding: '8px 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&h=240&fit=crop', name: 'Floral Kurti', price: '₹899' },
                    { img: 'https://images.unsplash.com/photo-1617627143233-b27e68dda5df?w=200&h=240&fit=crop', name: 'Anarkali', price: '₹2,199' },
                    { img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&h=240&fit=crop', name: 'Silk Saree', price: '₹4,999' },
                    { img: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=200&h=240&fit=crop', name: 'Palazzo Set', price: '₹1,299' },
                  ].map(p => (
                    <div key={p.name} style={{ borderRadius: 12, overflow: 'hidden', background: '#1a1a1d' }}>
                      <img src={p.img} alt={p.name} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} />
                      <div style={{ padding: '6px 8px 8px' }}>
                        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#F72585' }}>{p.price}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order button */}
                <div style={{ background: '#111', padding: '10px 10px 16px' }}>
                  <div style={{ background: '#25D366', borderRadius: 12, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <span style={{ fontSize: 14 }}>💬</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Order on WhatsApp</span>
                  </div>
                </div>
              </div>

              {/* Glow */}
              <div style={{ position: 'absolute', inset: -40, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(247,37,133,0.12) 0%, transparent 70%)', zIndex: -1 }} />
            </div>
          </div>
        </section>

        {/* ── PROOF STRIP ──────────────────────────────── */}
        <section style={{ padding: '60px 24px', background: 'rgba(247,37,133,0.05)', borderTop: '1px solid rgba(247,37,133,0.1)', borderBottom: '1px solid rgba(247,37,133,0.1)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="proof-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, textAlign: 'center' }}>
              {PROOF_STATS.map(({ n, label, source }) => (
                <div key={n}>
                  <div style={{ fontSize: 52, fontWeight: 900, color: '#F72585', letterSpacing: '-2px', lineHeight: 1 }}>{n}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginTop: 8 }}>{label}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{source}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────── */}
        <section style={{ padding: '100px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase', marginBottom: 14 }}>
                Everything your store needs
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Built for Instagram sellers.<br />Not generic e-commerce.
              </h2>
            </div>
            <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {FEATURES.map(({ icon, title, body }) => (
                <div key={title} style={{ padding: '28px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 28, marginBottom: 14 }}>{icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.2px' }}>{title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── POSITIONING ──────────────────────────────── */}
        <section style={{ padding: '100px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="showcase-grid">
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase', marginBottom: 16 }}>
                Why sellers choose WearOn
              </div>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 20 }}>
                One platform.<br />200 different boutiques.<br />Each looks like their own.
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 24 }}>
                Think of how AbhiBus, Redbus, and Goibibo all run on shared tech but look like completely separate brands.
                WearOn works the same way — every seller gets their own branded storefront, but we manage the platform.
              </p>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.75 }}>
                Your buyers never see "powered by WearOn." They see your boutique. Your brand name on every page,
                every product, every WhatsApp message that arrives in your inbox.
              </p>
            </div>

            {/* Comparison */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Instagram DMs', emoji: '😤', before: true, desc: '3 hours/day answering same questions' },
                { label: 'Linktree / bio page', emoji: '😐', before: true, desc: 'A list of links. No catalogue, no ordering.' },
                { label: 'Shopify / WooCommerce', emoji: '😅', before: true, desc: 'Built for Western brands. ₹20k setup. No WhatsApp.' },
                { label: 'WearOn', emoji: '✅', before: false, desc: 'Branded boutique app. WhatsApp checkout. ₹0 to start.' },
              ].map(({ label, emoji, before, desc }) => (
                <div key={label} style={{
                  padding: '16px 20px', borderRadius: 14,
                  background: before ? 'rgba(255,255,255,0.03)' : 'rgba(247,37,133,0.08)',
                  border: `1px solid ${before ? 'rgba(255,255,255,0.06)' : 'rgba(247,37,133,0.25)'}`,
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{emoji}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: before ? 'rgba(255,255,255,0.5)' : '#fff', marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 12, color: before ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.55)' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────── */}
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase', marginBottom: 14 }}>
                Plans
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 10 }}>
                Start free. Upgrade when you&apos;re ready.
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>Annual plans 2 months free · Pay via UPI</p>
            </div>
            <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
              {pricingPlans.map(([key, plan]) => {
                const featured = key === 'growth'
                return (
                  <div
                    key={key}
                    className="plan-card"
                    style={{
                      padding: '28px 24px',
                      borderRadius: 20,
                      background: featured ? 'rgba(247,37,133,0.1)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${featured ? 'rgba(247,37,133,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      position: 'relative',
                      boxShadow: featured ? '0 0 40px rgba(247,37,133,0.12)' : 'none',
                    }}
                  >
                    {featured && (
                      <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', fontSize: 11, fontWeight: 700, background: '#F72585', color: '#fff', padding: '4px 14px', borderRadius: 99, whiteSpace: 'nowrap', letterSpacing: '0.05em' }}>
                        MOST POPULAR
                      </div>
                    )}
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>{plan.name}</div>
                    <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 4, color: featured ? '#F72585' : '#fff' }}>
                      {plan.price_inr === 0 ? 'Free' : `₹${plan.price_inr.toLocaleString('en-IN')}`}
                      {plan.price_inr > 0 && <span style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>/mo</span>}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0', display: 'flex', flexDirection: 'column', gap: 9 }}>
                      {[
                        `${plan.products === 9999 ? 'Unlimited' : plan.products} products`,
                        'Branded PWA store',
                        'WhatsApp ordering',
                        'AI style assistant',
                        ...(key === 'growth' ? ['Android APK (24hr delivery)'] : []),
                        ...(key === 'pro' ? ['Play Store listing', 'Android APK'] : []),
                      ].map(f => (
                        <li key={f} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: featured ? '#F72585' : '#4ADE80', flexShrink: 0 }}>✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/auth/signup"
                      style={{
                        display: 'block', textAlign: 'center', textDecoration: 'none',
                        padding: '11px 0', borderRadius: 12, fontSize: 14, fontWeight: 700,
                        background: featured ? '#F72585' : 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        border: featured ? 'none' : '1px solid rgba(255,255,255,0.1)',
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
        <section style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(247,37,133,0.12) 0%, transparent 70%)' }} />
          <div style={{ position: 'relative', textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 20 }}>
              Stop answering DMs.<br />
              <span style={{ color: '#F72585' }}>Start getting orders.</span>
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', marginBottom: 40, lineHeight: 1.7 }}>
              Give your buyers a proper branded boutique to browse.
              One link in your bio. WhatsApp orders flowing in. Your brand, not ours.
            </p>
            <Link
              href="/auth/signup"
              style={{ background: '#F72585', color: '#fff', padding: '18px 40px', borderRadius: 16, fontSize: 18, fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: '0 0 50px rgba(247,37,133,0.35)' }}
            >
              Launch My Boutique App Free →
            </Link>
            <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              Free plan · No credit card · Live in 10 minutes · Works with kurtis, sarees, lehengas, co-ords
            </p>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────── */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '28px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Wear<span style={{ color: '#F72585' }}>On</span></span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Built for Indian boutiques · Surat, Jaipur, Bangalore, Indore · 2026</span>
            <div style={{ display: 'flex', gap: 20 }}>
              <Link href="/auth/login" style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Login</Link>
              <Link href="/store/demo" style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Live Demo</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
