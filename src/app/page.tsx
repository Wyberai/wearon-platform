import Link from 'next/link'
import { PLANS } from '@/lib/constants'
import AIStyleDemo from '@/components/AIStyleDemo'

const TICKER_ITEMS = [
  '⚡ Priya from Delhi just tried on a Silk Saree',
  '✨ Riya\'s Boutique hit 200 try-ons this week',
  '💸 Ananya saved ₹3,200 in returns this month',
  '📱 Kavya ordered an Anarkali right after her try-on',
  '🌟 Meera tried 3 styles in under 8 minutes',
  '🛍️ Sona\'s store onboarded 40 new followers today',
  '💚 Divya from Hyderabad: "My customers love this!"',
  '🔥 Preethi\'s Boutique launched in 9 minutes flat',
]

// Doubled for seamless loop
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

const STEPS = [
  {
    n: '01',
    title: 'Set up your store',
    body: 'Upload your logo, choose your brand colors, and add your products. Your branded AI store is live in 10 minutes.',
    icon: '🎨',
  },
  {
    n: '02',
    title: 'Share one link',
    body: 'Drop your store URL in your Instagram bio. Followers open it like an app — no downloads, no friction.',
    icon: '🔗',
  },
  {
    n: '03',
    title: 'Watch orders flow',
    body: 'Customers try on your clothes with their camera, fall in love, and tap Order via WhatsApp. Returns drop 40%.',
    icon: '📈',
  },
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
        .ticker-track { display: flex; width: max-content; animation: ticker 40s linear infinite; gap: 4rem; }
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
          .showcase-grid { grid-template-columns: 1fr auto 1fr !important; }
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
                Start Free →
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ─────────────────────────────────────── */}
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>

          {/* Background image with Ken Burns */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <img
              className="hero-bg"
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80"
              alt=""
              aria-hidden
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, transformOrigin: 'center' }}
            />
            {/* Radial pink glow */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 50% at 40% -10%, rgba(247,37,133,0.22) 0%, transparent 65%)' }} />
            {/* Dark gradient */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(9,9,11,0.15) 0%, rgba(9,9,11,0.7) 60%, rgba(9,9,11,1) 100%)' }} />
            {/* Grid */}
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

            {/* Try-on result preview */}
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
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Try-on complete · 18s</div>
              </div>
            </div>
          </div>

          {/* Hero content */}
          <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '140px 24px 100px', width: '100%' }}>
            <div style={{ maxWidth: 640 }}>
              <div className="reveal-1" style={{ opacity: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase' }}>
                  India&apos;s first AI try-on platform for fashion sellers
                </span>
              </div>

              <h1 className="reveal-2" style={{ fontSize: 'clamp(44px, 7vw, 78px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', margin: '20px 0 28px', opacity: 0 }}>
                Your followers try on.<br />
                <span style={{ color: '#F72585' }}>Before they buy.</span>
              </h1>

              <p className="reveal-3" style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 500, marginBottom: 40, opacity: 0 }}>
                Give every Instagram follower a branded fashion app with AI virtual try-on built in.
                Zero code. Live in 10 minutes. Orders via WhatsApp.
              </p>

              <div className="reveal-4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', opacity: 0 }}>
                <Link
                  href="/auth/signup"
                  className="cta-glow"
                  style={{ background: '#F72585', color: '#fff', padding: '16px 32px', borderRadius: 14, fontSize: 16, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}
                >
                  Create Your Store Free →
                </Link>
                <Link
                  href="/store/demo"
                  style={{ color: '#fff', padding: '16px 32px', borderRadius: 14, fontSize: 16, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', display: 'inline-block', backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.05)' }}
                >
                  See Live Demo
                </Link>
              </div>

              <div className="reveal-5" style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 48, opacity: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block', boxShadow: '0 0 8px #4ADE80' }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>47,293 try-ons processed today</span>
                </div>
                <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>Free forever plan · No credit card</span>
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

        {/* ── AI SHOWCASE ──────────────────────────────── */}
        <section style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <div className="ai-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase', marginBottom: 16 }}>
                Powered by OpenAI GPT-4o
              </div>
              <h2 style={{ fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: 20 }}>
                An AI stylist.<br />Built into every store.
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 28 }}>
                Your buyers don&apos;t just try on clothes — they get personalized outfit advice from an AI that knows your entire catalog. Try typing a style preference below.
              </p>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#F72585' }}>40%</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>fewer returns</div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#F72585' }}>3×</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>more orders</div>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: '#F72585' }}>18s</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>avg try-on time</div>
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
                Simple by design
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.5px' }}>
                Live in 10 minutes. Really.
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

        {/* ── TRY-ON SHOWCASE ──────────────────────────── */}
        <section style={{ padding: '100px 24px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase', marginBottom: 14 }}>
              The WearOn difference
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-0.5px' }}>
              See it on yourself. Then order.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 24, maxWidth: 800, margin: '0 auto' }}>
            {/* Before */}
            <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=520&fit=crop&crop=top"
                alt="Before try-on"
                style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', bottom: 14, left: 14, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: 8 }}>
                Customer selfie
              </div>
            </div>

            {/* Arrow */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#F72585', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                ✨
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.4 }}>WearOn<br/>AI</div>
            </div>

            {/* After */}
            <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=520&fit=crop&crop=top"
                alt="After AI try-on"
                style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, border: '2px solid #F72585', borderRadius: 20, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 12, fontWeight: 700, color: '#fff', background: '#F72585', padding: '6px 12px', borderRadius: 8 }}>
                WearOn AI ✨
              </div>
              <div style={{ position: 'absolute', bottom: 14, left: 14, fontSize: 12, fontWeight: 600, color: '#fff', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: 8 }}>
                ₹899 · Ready to order
              </div>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
            Powered by proprietary diffusion AI · Processes in ~18 seconds · Works on all skin tones
          </p>
        </section>

        {/* ── PRICING ──────────────────────────────────── */}
        <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#F472B6', textTransform: 'uppercase', marginBottom: 14 }}>
                Pricing
              </div>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 10 }}>
                Start free. Scale as you grow.
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)' }}>₹3 per extra try-on · Annual plans get 2 months free</p>
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
                        ...(key === 'growth' ? ['Android APK (24hr)'] : []),
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
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 20 }}>
              Your store is one link away.
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', marginBottom: 40, lineHeight: 1.7 }}>
              Thousands of Indian fashion sellers are already giving their customers an AI try-on experience. Join them today — it&apos;s free.
            </p>
            <Link
              href="/auth/signup"
              style={{ background: '#F72585', color: '#fff', padding: '18px 40px', borderRadius: 16, fontSize: 18, fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: '0 0 50px rgba(247,37,133,0.35)' }}
            >
              Create Your Free Store →
            </Link>
            <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
              Free forever plan · No credit card · Live in 10 minutes
            </p>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────── */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '28px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, margin: '0 auto' }}>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Wear<span style={{ color: '#F72585' }}>On</span></span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Built for Indian fashion sellers · 2026</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/auth/login" style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Login</Link>
            <Link href="/store/demo" style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Demo</Link>
          </div>
        </footer>

      </div>
    </>
  )
}
