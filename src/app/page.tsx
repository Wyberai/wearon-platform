import Link from 'next/link'
import { PLANS } from '@/lib/constants'
import { PRICING_COPY } from '@/lib/pricing-copy'
import { ThemePicker } from '@/components/marketing/ThemePicker'
import { MarketingNav } from '@/components/marketing/MarketingNav'
import { faqToJsonLd } from '@/lib/schema-org'
import { getLocale } from '@/lib/i18n/get-locale'
import { HOME_DICT } from '@/lib/i18n/dict/home'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import type { Locale } from '@/lib/i18n/config'

export default async function Home() {
  const locale = await getLocale()
  return <USHomePage locale={locale} />
}

// ---- US HOMEPAGE ----

const US_ACCENT = '#A6134A'
const US_INK = '#111010'

function USHomePage({ locale }: { locale: Locale }) {
  const t = HOME_DICT[locale]

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
        .wo-feat-fan { display: flex; }
        .wo-feat-fan div { width: 56px; height: 68px; border-radius: 6px; border: 1px solid rgba(23,21,18,0.08); margin-left: -20px; box-shadow: -3px 0 8px rgba(23,21,18,0.1); background-size: cover; background-position: center; }
        .wo-feat-fan div:first-child { margin-left: 0; }
        @media (max-width: 900px) { .wo-tile-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 640px) { .wo-tile-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>


      <div style={{ background: '#fff', color: US_INK, minHeight: '100vh' }}>
        {/* Announcement bar — single line, no wrap, no clutter */}
        <div style={{ background: US_INK, color: '#fff', padding: '10px 20px', textAlign: 'center', fontSize: 12, letterSpacing: '0.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {t.announcementText}{' '}
          <Link href="/auth/signup" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 700 }}>
            {t.announcementCta}
          </Link>
        </div>

        <MarketingNav />

        {/* HERO — text-first, aspiration-led (à la Shopify's "Be the next..."),
            generously padded instead of a cramped floating card over an
            image. The real reel-to-receipt asset moves below the headline
            block as a supporting visual, not a backdrop fighting the type. */}
        <section style={{ padding: '72px 24px 96px' }}>
          <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: `${US_INK}66`, marginBottom: 22 }}>
              {t.heroEyebrow}
            </p>
            <h1 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(40px, 7vw, 88px)', fontWeight: 400, lineHeight: 1.02, letterSpacing: '-2px', color: US_INK, margin: '0 0 24px' }}>
              {t.heroHeadline}
            </h1>
            <p style={{ fontSize: 17, color: `${US_INK}99`, lineHeight: 1.6, marginBottom: 32, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
              {t.heroSubcopy}
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 56 }}>
              <Link href="/auth/signup" style={{ background: US_INK, color: '#fff', padding: '15px 28px', borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                {t.heroCtaPrimary}
              </Link>
              <Link href="/themes" style={{ color: US_INK, padding: '15px 24px', borderRadius: 999, fontSize: 14, fontWeight: 600, textDecoration: 'none', border: `1px solid ${US_INK}22` }}>
                {t.heroCtaSecondary}
              </Link>
            </div>
          </div>
        </section>

        {/* TRUST STRIP — real integration partners, not fabricated customer
            logos (this site has zero real sellers yet on the fresh DB, so
            inventing customer names would be dishonest). Deliberately NOT
            listing Stripe here even though it's technically in the checkout
            stack — Stripe barely operates for Indian merchants in practice,
            so it doesn't build local credibility the way Razorpay does. */}
        <section style={{ padding: '28px 24px', borderBottom: `1px solid ${US_INK}0E` }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: `${US_INK}44` }}>{t.worksWith}</span>
            {['Razorpay', 'WhatsApp Business', 'Instagram'].map(name => (
              <span key={name} style={{ fontSize: 15, fontWeight: 700, color: `${US_INK}55`, letterSpacing: '-0.2px' }}>{name}</span>
            ))}
          </div>
        </section>

        {/* DEMO FEATURE CARDS — show the feature happening, not a stock photo standing in for it */}
        <section style={{ padding: '96px 24px' }}>
          <div className="wo-us-features" style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="wo-card" style={{ background: '#f8f8f6', borderRadius: 20, padding: '28px 28px 26px' }}>
              <div className="wo-feat-fan" style={{ marginBottom: 20 }}>
                <div style={{ backgroundImage: 'url(/august/campaign/hero.jpg)' }} />
                <div style={{ backgroundImage: 'url(/ember/campaign/hero.jpg)' }} />
                <div style={{ backgroundImage: 'url(/bloom/campaign/hero.jpg)' }} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.2px', marginBottom: 8, color: US_INK }}>{t.themesCardTitle}</h3>
              <p style={{ fontSize: 14, color: `${US_INK}88`, lineHeight: 1.7, marginBottom: 14 }}>
                {t.themesCardBody}
              </p>
              <Link href="/themes" style={{ fontSize: 13, fontWeight: 700, color: US_INK, textDecoration: 'underline', textDecorationColor: US_ACCENT, textUnderlineOffset: 4 }}>
                {t.themesCardCta}
              </Link>
            </div>
            <div className="wo-card" style={{
              borderRadius: 20, padding: '28px 28px 26px',
              background: 'radial-gradient(circle at 25% 20%, rgba(232,137,90,0.14), transparent 55%), radial-gradient(circle at 75% 80%, rgba(91,140,255,0.14), transparent 55%), #f8f8f6',
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid rgba(23,21,18,0.1)', borderRadius: 999, padding: '6px 12px', fontSize: 12, color: `${US_INK}99`, marginBottom: 20 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5B8CFF', display: 'inline-block' }} />
                {t.aiCardBadge}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.2px', marginBottom: 8, color: US_INK }}>{t.aiCardTitle}</h3>
              <p style={{ fontSize: 14, color: `${US_INK}88`, lineHeight: 1.7 }}>
                {t.aiCardBody}
              </p>
            </div>
          </div>
        </section>

        {/* MARQUEE STRIP */}
        <div style={{ background: US_INK, color: '#fff', padding: '13px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <style>{`@keyframes wo-scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
          <div style={{ display: 'inline-block', animation: 'wo-scroll 24s linear infinite' }}>
            {['AI BUYER — SEASONAL EDITS', 'SHOP FROM CHATGPT, GEMINI & CLAUDE', 'DM CHECKOUT', 'AI VISIBILITY DASHBOARD', 'STRIPE + RAZORPAY', 'YOUR OWN DOMAIN', 'AI PRODUCT PHOTOS', 'FREE TO START', 'AI BUYER — SEASONAL EDITS', 'SHOP FROM CHATGPT, GEMINI & CLAUDE', 'DM CHECKOUT', 'AI VISIBILITY DASHBOARD', 'STRIPE + RAZORPAY', 'YOUR OWN DOMAIN', 'AI PRODUCT PHOTOS', 'FREE TO START'].map((item, i) => (
              <span key={i} style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 500 }}>
                {item}<span style={{ margin: '0 28px', opacity: 0.3 }}>·</span>
              </span>
            ))}
          </div>
        </div>

        {/* THEME TILES — all twelve flagship stores, live now, not cosmetic reskins */}
        <section style={{ paddingTop: 96 }}>
          <div style={{ padding: '0 24px', marginBottom: 32 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${US_INK}55`, marginBottom: 10 }}>{t.themeTilesEyebrow}</p>
            <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 400, letterSpacing: '-1px', lineHeight: 1.1, color: US_INK }}>
              {t.themeTilesHeadline}
            </h2>
          </div>
          <ThemePicker tiles={THEME_TILES} />
          <p style={{ textAlign: 'center', padding: '18px 24px 0', fontSize: 13, color: `${US_INK}66` }}>
            {t.themeTilesFooterPrefix}<Link href="/themes" style={{ color: US_INK, textDecoration: 'underline' }}>{t.themeTilesFooterCta}</Link>
          </p>
        </section>

        {/* HOW IT WORKS — the real, true 3-step flow (no invented process) */}
        <section style={{ borderTop: `1px solid ${US_INK}0E`, padding: '96px 24px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 400, letterSpacing: '-1px', textAlign: 'center', marginBottom: 56, color: US_INK }}>
              {t.stepsHeadline}
            </h2>
            <div className="wo-us-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px 48px' }}>
              {t.steps.map((step, i) => (
                <div key={step.title}>
                  <p style={{ fontFamily: 'var(--font-marketing)', fontSize: 40, fontWeight: 400, color: `${US_INK}22`, marginBottom: 14, letterSpacing: '-1px' }}>{`0${i + 1}`}</p>
                  <h3 style={{ fontFamily: 'var(--font-marketing)', fontSize: 19, fontWeight: 500, letterSpacing: '-0.2px', marginBottom: 10, color: US_INK }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: `${US_INK}77`, lineHeight: 1.75 }}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6-FEATURE GRID — AI-native differentiators */}
        <section style={{ borderTop: `1px solid ${US_INK}0E`, padding: '96px 24px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${US_INK}44`, marginBottom: 14, textAlign: 'center' }}>{t.featuresEyebrow}</p>
            <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 400, letterSpacing: '-1px', textAlign: 'center', marginBottom: 56, color: US_INK }}>
              {t.featuresHeadline}
            </h2>
            <div className="wo-us-features" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px 48px' }}>
              {t.features.map(f => (
                <div key={f.label} style={{ borderTop: `1.5px solid ${US_INK}12`, paddingTop: 24 }}>
                  <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: US_ACCENT, marginBottom: 14, fontWeight: 700 }}>{f.label}</p>
                  <h3 style={{ fontFamily: 'var(--font-marketing)', fontSize: 19, fontWeight: 500, letterSpacing: '-0.2px', lineHeight: 1.25, marginBottom: 10, color: US_INK }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: `${US_INK}77`, lineHeight: 1.75 }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING — real plans, real INR, matches billing exactly */}
        <section style={{ padding: '96px 24px' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${US_INK}55`, marginBottom: 16, textAlign: 'center' }}>{t.pricingEyebrow}</p>
            <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 400, letterSpacing: '-1px', textAlign: 'center', marginBottom: 12, color: US_INK }}>
              {t.pricingHeadline}
            </h2>
            <p style={{ textAlign: 'center', fontSize: 14, color: `${US_INK}66`, marginBottom: 56 }}>{t.pricingSubcopy}</p>
            <div className="wo-us-pricing" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {PRICING_COPY.map(plan => {
                const data = PLANS[plan.key]
                return (
                  <div key={plan.key} style={{ padding: '32px 24px', background: plan.featured ? US_INK : '#f8f8f8', color: plan.featured ? '#fff' : US_INK }}>
                    {plan.featured && <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: US_ACCENT, marginBottom: 14, fontWeight: 700 }}>{t.mostPopular}</p>}
                    <p style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: plan.featured ? 'rgba(255,255,255,0.45)' : `${US_INK}66`, marginBottom: 10 }}>{data.name}</p>
                    <p style={{ fontFamily: 'var(--font-marketing)', fontSize: 38, fontWeight: 400, letterSpacing: '-1.5px', marginBottom: 4, lineHeight: 1 }}>
                      {data.price_inr === 0 ? t.free : `₹${data.price_inr.toLocaleString('en-IN')}`}
                      <span style={{ fontSize: 13, fontWeight: 400, opacity: 0.45, letterSpacing: 0 }}>{data.price_inr > 0 ? t.perMonth : ''}</span>
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
              {t.referralLine}
            </p>
          </div>
        </section>

        {/* FAQ — visible Q&A + FAQPage JSON-LD, both for AEO */}
        <section style={{ padding: '96px 24px', borderTop: `1px solid ${US_INK}0E` }}>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqToJsonLd(t.faqs.map(f => ({ question: f.q, answer: f.a })))) }} />
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: `${US_INK}55`, marginBottom: 16, textAlign: 'center' }}>{t.faqEyebrow}</p>
            <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(28px, 3.6vw, 40px)', fontWeight: 400, letterSpacing: '-1px', textAlign: 'center', marginBottom: 48, color: US_INK }}>
              {t.faqHeadline}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {t.faqs.map(f => (
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
        <section style={{ padding: '96px 24px', background: US_INK }}>
          <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>{t.closingEyebrow}</p>
            <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 400, letterSpacing: '-1.5px', lineHeight: 1.08, color: '#fff', marginBottom: 20 }}>
              {t.closingHeadline}
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 36 }}>
              {t.closingSubcopy}
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" style={{ background: '#fff', color: US_INK, padding: '14px 32px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
                {t.closingCta}
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ borderTop: `1px solid ${US_INK}10`, padding: '28px 24px', background: '#fff' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontFamily: 'var(--font-marketing)', fontWeight: 400, fontSize: 18, letterSpacing: '-0.3px', color: US_INK }}>Instastarz</span>
            <span style={{ fontSize: 11, letterSpacing: '0.06em', color: `${US_INK}55`, textTransform: 'uppercase' }}>{t.footerTagline}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <Link href="/auth/login" style={{ fontSize: 12, color: `${US_INK}66`, textDecoration: 'none' }}>{t.footerLogin}</Link>
              <Link href="/themes" style={{ fontSize: 12, color: `${US_INK}66`, textDecoration: 'none' }}>{t.footerDemo}</Link>
              <Link href="/privacy" style={{ fontSize: 12, color: `${US_INK}66`, textDecoration: 'none' }}>{t.footerPrivacy}</Link>
              <Link href="/terms" style={{ fontSize: 12, color: `${US_INK}66`, textDecoration: 'none' }}>{t.footerTerms}</Link>
              <Link href="/refund-policy" style={{ fontSize: 12, color: `${US_INK}66`, textDecoration: 'none' }}>{t.footerRefunds}</Link>
              <LanguageSwitcher current={locale} />
            </div>
          </div>
          <p style={{ maxWidth: 900, margin: '16px auto 0', fontSize: 12, color: `${US_INK}88`, textAlign: 'center' }}>
            {t.customDesignText}{' '}
            <a
              href={`https://wa.me/917892603192?text=${encodeURIComponent('Hi! I want a fully custom-built store on Instastarz.')}`}
              target="_blank" rel="noopener noreferrer"
              style={{ color: US_ACCENT, fontWeight: 700, textDecoration: 'underline' }}
            >
              {t.customDesignCta}
            </a>
          </p>
          <p style={{ maxWidth: 900, margin: '10px auto 0', fontSize: 11, color: `${US_INK}44`, textAlign: 'center' }}>
            © 2026 Signalpulse Technologies. Instastarz is a product of Signalpulse Technologies.
          </p>
        </footer>
      </div>
    </>
  )
}
