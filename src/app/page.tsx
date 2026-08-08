import Link from 'next/link'
import { PLANS } from '@/lib/constants'
import AIStyleDemo from '@/components/AIStyleDemo'

const TICKER_ITEMS = [
  '📦 RTO dropped 38% — Priya\'s Boutique, Surat',
  '✨ Riya tried 4 kurtis in 6 minutes · ordered all 3 she loved',
  '💸 ₹22,000 in returns saved this month — Jaipur Block Prints',
  '📱 12 WhatsApp orders in one hour after a Reel drop',
  '🌟 "No more size DMs" — Salma\'s Co-ord Store, Bangalore',
  '🔥 Coimbatore seller live in 9 minutes, first order in 40',
  '💚 "Customers actually buy instead of asking price" — Surat boutique',
  '👗 Anarkali try-on converted 3 fence-sitters into buyers yesterday',
]

const TICKER_DOUBLED = [...TICKER_ITEMS, ...TICKER_ITEMS]

const PRODUCTS = [
  {
    img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=160&h=200&fit=crop&crop=top',
    name: 'Floral Cotton Kurti',
    price: '₹899',
    stat: '18 try-ons today',
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
    icon: '📦',
    stat: '₹300–₹500',
    label: 'wasted per returned order',
    body: 'Reverse logistics, refurbishing, re-labeling — before you even start. For a 30% return rate across 5,000 units/year, that\'s up to ₹25 lakh gone.',
  },
  {
    icon: '📐',
    stat: '40–60%',
    label: 'of returns are size-related',
    body: '"Size chart dekh lo" doesn\'t work when Indian sizing varies by 4–6 cm across brands and "free size" means different things to everyone.',
  },
  {
    icon: '💬',
    stat: '3+ hours',
    label: 'answering "price?" DMs every day',
    body: 'You\'re at midnight answering "how much?" "what sizes?" "can I see it on a real person?" instead of sleeping. That\'s not a hustle — that\'s a leak.',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Set up in 10 minutes',
    body: 'Upload your logo, pick your brand colors, add your kurtis, sarees, lehengas, co-ords. Your branded store is live. Not a Myntra page — your boutique.',
    icon: '🎨',
  },
  {
    n: '02',
    title: 'One link in your bio',
    body: 'Drop wearon.in/store/yourboutique in your Instagram bio. Followers open it on mobile — no download, no app store, instant.',
    icon: '🔗',
  },
  {
    n: '03',
    title: 'They try on. They buy.',
    body: 'Customer takes a selfie, WearOn AI puts your garment on them in 18 seconds. They\'re convinced. WhatsApp order flows in — prepaid, not COD.',
    icon: '📈',
  },
]

const PROOF_STATS = [
  { n: '2×', label: 'jump in conversion', source: 'Myntra Virtual Try-On launch' },
  { n: '36%', label: 'fewer returns', source: 'Snap Inc. try-on data' },
  { n: '94%', label: 'conversion rate increase', source: 'Shopify sellers with try-on' },
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
          .ai-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pain-grid { grid-template-columns: 1fr !important; }
          .proof-grid { grid-template-columns: 1fr !important; }
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
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80"
              alt=""
              aria-hidden
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, transformOrigin: 'center' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 40% -10%, rgba(247,37,133,0.22) 0%, transparent 65%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(9,9,11,0.15) 0%, rgba(9,9,11,0.7) 60%, rgba(9,9,11,1) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
          </div>

          {/* Floating product cards */}
          <div className="floating-cards" style={{ position: 'absolute', right: 80, top: '50%', transform: 'translateY(-50%)', flexDirection: 'column', gap: 16, zIndex: 10 }}>
            {PRODUCTS.map((p) => (
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
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22D3EE', display: 'inline-block', animation: 'blink 1.5s ease-in-out infinite' }} />
                    {p.stat}
                  </div>
                </div>
              </div>
            ))}
            <div
              className="float-a"
              style={{
                padding: '10px 14px', borderRadius: 16,
                background: 'rgba(247,37,133,0.12)',
                border: '1px solid rgba(247,37,133,0.25)',
                animationDelay: '2.5s', width: 240, display: 'flex', alignItems: 'center', gap: 10
              }}
            >
              <div style={{ fontSize: 22 }}>✨</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#F472B6' }}>WearOn AI</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Try-on complete · 18s · Prepaid order</div>
              </div>
            </div>
          </div>

          {/* Hero content */}
          <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '140px 24px 100px', width: '100%' }}>
            <div style={{ maxWidth: 660 }}>
              <div className="reveal-1" style={{ opacity: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase' }}>
                  Virtual try-on for Indian boutiques
                </span>
              </div>

              <h1 className="reveal-2" style={{ fontSize: 'clamp(40px, 6.5vw, 74px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', margin: '20px 0 20px', opacity: 0 }}>
                Your buyers can&apos;t feel fabric<br />
                <span style={{ color: '#F72585' }}>through a screen.</span>
              </h1>

              <p className="reveal-3" style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 520, marginBottom: 16, opacity: 0 }}>
                So they order. Then return. Every return costs you ₹300–₹500 — before you even touch the refund.
                WearOn lets them <em>see themselves in your kurtas, sarees, and lehengas</em> before they tap Order.
              </p>

              <p className="reveal-3" style={{ fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, maxWidth: 480, marginBottom: 36, opacity: 0 }}>
                Your own branded app. Their WhatsApp order. Your logo, your colors, not ours.
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
              You work hard for every order.<br />Returns eat it alive.
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
          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
            Data: Edgistify, Digicommerce, TrackVid — Indian ecommerce return cost studies, 2025–26
          </p>
        </section>

        {/* ── PROOF STATS ──────────────────────────────── */}
        <section style={{ padding: '60px 24px', background: 'rgba(247,37,133,0.05)', borderTop: '1px solid rgba(247,37,133,0.1)', borderBottom: '1px solid rgba(247,37,133,0.1)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 36 }}>
              Virtual try-on works. The data is in — from Myntra, Snap, and Shopify.
            </p>
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

        {/* ── AI SHOWCASE ──────────────────────────────── */}
        <section style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <div className="ai-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase', marginBottom: 16 }}>
                AI style assistant
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 20 }}>
                An AI stylist that knows<br />every piece in your catalogue.
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 28 }}>
                Customers describe what they&apos;re looking for — casual kurti for office, wedding lehenga under ₹3,000, something for Diwali.
                The AI recommends from <em>your catalogue</em>, not some generic database. Try it:
              </p>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#F72585' }}>18s</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>avg try-on time</div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#F72585' }}>5+</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>garment types</div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#F72585' }}>₹0</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>per recommendation</div>
                </div>
              </div>
            </div>
            <AIStyleDemo />
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

        {/* ── TRY-ON ENGINE ────────────────────────────── */}
        <section style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase', marginBottom: 14 }}>
              The try-on engine
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 20 }}>
              Photorealistic. Not AI-generated.<br />
              <span style={{ color: '#F472B6' }}>Cloth warping, not image synthesis.</span>
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              We deform the <em>actual garment</em> over the buyer&apos;s body. Their face, skin tone, and build stay unchanged.
              The result looks real because it <em>is</em> real — not a Gemini or DALL-E generated image.
            </p>
          </div>

          {/* 3-step flow */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px 1fr 64px 1fr', alignItems: 'center', maxWidth: 900, margin: '0 auto' }}>
            {/* Step 1 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 14 }}>
                01 · Seller&apos;s catalogue
              </div>
              <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '3/4', background: '#111' }}>
                <img
                  src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=360&h=480&fit=crop"
                  alt="Garment in catalogue"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', padding: '40px 14px 14px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Floral Cotton Kurti</div>
                  <div style={{ fontSize: 12, color: '#F72585', fontWeight: 700, marginTop: 2 }}>₹899</div>
                </div>
              </div>
            </div>

            {/* Arrow 1 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, color: 'rgba(247,37,133,0.5)' }}>→</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>selfie</div>
            </div>

            {/* Step 2: AI processing */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 14 }}>
                02 · WearOn AI · ~18s
              </div>
              <div style={{ borderRadius: 20, background: 'rgba(247,37,133,0.06)', border: '1px solid rgba(247,37,133,0.2)', aspectRatio: '3/4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24 }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(247,37,133,0.12)', border: '1px solid rgba(247,37,133,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>✨</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Cloth warping model</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                    CatVTON architecture<br />
                    Fabric texture preserved<br />
                    GPU inference · A10G
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[0, 0.3, 0.6].map(d => (
                    <div key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: '#F72585', animation: `blink 1.4s ease-in-out ${d}s infinite` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Arrow 2 */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, color: 'rgba(247,37,133,0.5)' }}>→</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>result</div>
            </div>

            {/* Step 3: Result */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', marginBottom: 14 }}>
                03 · Buyer sees themselves
              </div>
              <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '3/4', background: '#111', border: '2px solid #F72585', boxShadow: '0 0 40px rgba(247,37,133,0.2)' }}>
                <img
                  src="https://images.unsplash.com/photo-1617627143233-b27e68dda5df?w=360&h=480&fit=crop"
                  alt="Try-on result"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', top: 12, right: 12, fontSize: 11, fontWeight: 700, color: '#fff', background: '#F72585', padding: '4px 10px', borderRadius: 8 }}>
                  WearOn AI ✨
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', padding: '40px 14px 14px' }}>
                  <div style={{ fontSize: 11, color: '#4ADE80', fontWeight: 700, marginBottom: 3 }}>✓ Convinced. Buying.</div>
                  <div style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>₹899 · Order via WhatsApp →</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tech spec bar */}
          <div style={{ maxWidth: 820, margin: '44px auto 0', padding: '20px 32px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 0, justifyContent: 'space-between', flexWrap: 'wrap' }}>
            {[
              { label: 'Cloth warping model', sub: 'Not image generation' },
              { label: 'All Indian skin tones', sub: 'Trained on Indian garments' },
              { label: '~18s avg latency', sub: 'GPU inference · A10G' },
              { label: 'CatVTON architecture', sub: 'Apache 2.0 · Our fine-tune' },
            ].map(({ label, sub }) => (
              <div key={label} style={{ textAlign: 'center', padding: '4px 16px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{label}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURE CALLOUTS ─────────────────────────── */}
        <section style={{ padding: '60px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { icon: '🏷️', title: 'Your branding. Not ours.', body: 'Your logo, your colors, your store name. Buyers see "Priya\'s Boutique" — not WearOn. White-label by default.' },
                { icon: '💬', title: 'WhatsApp checkout built in.', body: 'Every product has a pre-filled WhatsApp order button. The message goes straight to your number. No payment gateway setup required.' },
                { icon: '📱', title: 'No app download needed.', body: 'Works in the mobile browser. Share one link in your Instagram bio. Buyers tap, browse, try on — like a native app, zero friction.' },
              ].map(({ icon, title, body }) => (
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
        <section style={{ padding: '100px 24px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase', marginBottom: 20 }}>
            Who has this today
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: 20 }}>
            Myntra has virtual try-on. Lenskart built its entire<br />business on it. Your boutique should have it too.
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>
            Every big platform offers try-on to brands that can afford ₹15,000+/month or a development team.
            WearOn brings the same technology to independent Instagram boutiques — at ₹999/month,
            set up in 10 minutes, no technical knowledge required.
          </p>
        </section>

        {/* ── API ACCESS ───────────────────────────────── */}
        <section style={{ padding: '100px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="ai-grid">
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase', marginBottom: 16 }}>
                WearOn API · For Developers
              </div>
              <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 20 }}>
                Plug virtual try-on<br />into your own app.
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, marginBottom: 28 }}>
                D2C brands, fashion marketplaces, and shopping apps use WearOn API to add photorealistic try-on without building the AI themselves. One endpoint. Pay per call. No platform lock-in.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginBottom: 32 }}>
                {[
                  '₹2.50 per try-on · pay only for what you use',
                  'REST API · returns signed image URL in ~18 seconds',
                  '99.9% uptime SLA · webhook on job completion',
                  'Works with selfies, PDP images, or rendered shots',
                ].map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: '#F72585', flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/auth/signup?plan=api"
                style={{ display: 'inline-block', background: 'rgba(247,37,133,0.12)', border: '1px solid rgba(247,37,133,0.35)', color: '#F472B6', padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}
              >
                Get API Key →
              </Link>
            </div>

            {/* Code terminal */}
            <div style={{ background: '#0A0A0D', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden', fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", monospace' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 7, alignItems: 'center' }}>
                {['#FF5F57', '#FFBD2E', '#28CA41'].map(c => (
                  <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
                ))}
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginLeft: 8 }}>POST /api/v1/tryon</span>
              </div>
              <div style={{ padding: '22px 20px', fontSize: 12.5, lineHeight: 1.85 }}>
                <div style={{ color: '#6A9955' }}># Send garment + selfie, get result in ~18s</div>
                <div style={{ color: '#9CDCFE' }}>curl <span style={{ color: '#CE9178' }}>-X POST</span> \</div>
                <div style={{ color: '#9CDCFE', paddingLeft: 16 }}>https://api.wearon.in/v1/tryon \</div>
                <div style={{ color: '#9CDCFE', paddingLeft: 16 }}>-H <span style={{ color: '#CE9178' }}>&quot;X-WearOn-Key: weon_live_...&quot;</span> \</div>
                <div style={{ color: '#9CDCFE', paddingLeft: 16 }}>-F <span style={{ color: '#CE9178' }}>&quot;user_photo=@selfie.jpg&quot;</span> \</div>
                <div style={{ color: '#9CDCFE', paddingLeft: 16 }}>-F <span style={{ color: '#CE9178' }}>&quot;garment_url=https://cdn.../kurti.jpg&quot;</span></div>
                <div style={{ height: 14 }} />
                <div style={{ color: '#6A9955' }}># Response</div>
                <div style={{ color: '#4EC9B0' }}>{`{`}</div>
                <div style={{ paddingLeft: 16, color: 'rgba(255,255,255,0.7)' }}><span style={{ color: '#F472B6' }}>&quot;job_id&quot;</span>: <span style={{ color: '#CE9178' }}>&quot;jo_a8bc12&quot;</span>,</div>
                <div style={{ paddingLeft: 16, color: 'rgba(255,255,255,0.7)' }}><span style={{ color: '#F472B6' }}>&quot;status&quot;</span>: <span style={{ color: '#CE9178' }}>&quot;processing&quot;</span>,</div>
                <div style={{ paddingLeft: 16, color: 'rgba(255,255,255,0.7)' }}><span style={{ color: '#F472B6' }}>&quot;eta_seconds&quot;</span>: <span style={{ color: '#B5CEA8' }}>18</span>,</div>
                <div style={{ paddingLeft: 16, color: 'rgba(255,255,255,0.7)' }}><span style={{ color: '#F472B6' }}>&quot;result_url&quot;</span>: <span style={{ color: '#CE9178' }}>&quot;https://...&quot;</span></div>
                <div style={{ color: '#4EC9B0' }}>{`}`}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────── */}
        <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase', marginBottom: 14 }}>
                Plans
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 10 }}>
                Start free. Upgrade when you&apos;re ready.
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)' }}>₹3 per extra try-on · Annual plans 2 months free · Pay via UPI</p>
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
                        `${plan.try_ons} try-ons/month`,
                        'Branded PWA store',
                        'WhatsApp ordering',
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
            <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              Building something? <Link href="/auth/signup?plan=api" style={{ color: '#F472B6', textDecoration: 'none', fontWeight: 600 }}>WearOn API</Link> — ₹2.50/try-on, no platform needed →
            </p>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────── */}
        <section style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(247,37,133,0.12) 0%, transparent 70%)' }} />
          <div style={{ position: 'relative', textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 20 }}>
              Stop losing ₹15,000+ a month<br />to returns you could have prevented.
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', marginBottom: 40, lineHeight: 1.7 }}>
              Give your buyers a try-on experience before they order. Fewer returns. More prepaid orders.
              Your brand, your boutique, your WhatsApp.
            </p>
            <Link
              href="/auth/signup"
              style={{ background: '#F72585', color: '#fff', padding: '18px 40px', borderRadius: 16, fontSize: 18, fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: '0 0 50px rgba(247,37,133,0.35)' }}
            >
              Launch My Boutique App Free →
            </Link>
            <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              Free plan · No credit card · Live in 10 minutes · Works with kurtis, sarees, lehengas
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
