import Link from 'next/link'
import { MarketingNav } from '@/components/marketing/MarketingNav'

const INK = '#111010'

export const metadata = {
  title: 'Terms of Service — Instastarz',
  description: 'The terms governing your use of Instastarz.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 20, fontWeight: 600, letterSpacing: '-0.2px', marginBottom: 12, color: INK }}>{title}</h2>
      <div style={{ fontSize: 14.5, lineHeight: 1.75, color: `${INK}CC` }}>{children}</div>
    </section>
  )
}

export default function TermsPage() {
  return (
    <div style={{ background: '#fff', color: INK, minHeight: '100vh' }}>
      <MarketingNav />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 96px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: `${INK}66`, marginBottom: 16 }}>Legal</p>
        <h1 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 400, letterSpacing: '-1px', marginBottom: 12, color: INK }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: 13, color: `${INK}66`, marginBottom: 48 }}>Last updated August 16, 2026</p>

        <Section title="Agreement">
          <p>These Terms govern your use of Instastarz, a product of Signalpulse Technologies (&quot;we&quot;, &quot;us&quot;). By creating a store on Instastarz, you agree to these Terms.</p>
        </Section>

        <Section title="What Instastarz provides">
          <p>A branded storefront, checkout (Razorpay, WhatsApp ordering, and cash on delivery), and optional AI-native features (AI Buyer, AI product photos, AI auto-replies) depending on your plan. Every plan is a flat monthly subscription — we do not take a percentage of your sales.</p>
        </Section>

        <Section title="Plans and billing">
          <p style={{ marginBottom: 12 }}>Current plans: <strong>Free</strong> (₹0, 10 products), <strong>Store</strong> (₹3,000/mo, 100 products + custom domain), <strong>Store + App</strong> (₹9,999/mo, 500 products + native Android app), <strong>Store + App + AI Photoshoot</strong> (₹19,999/mo, unlimited products + AI photoshoot credits). Enterprise pricing is available on request.</p>
          <p>Paid plans bill monthly in advance. There is no lock-in contract — you can downgrade to Free or cancel from your dashboard at any time; cancellation takes effect at the end of the current billing cycle.</p>
        </Section>

        <Section title="Your responsibilities as a seller">
          <p>You&apos;re responsible for the accuracy of your product listings, pricing, and fulfilling orders you accept. You must not use Instastarz to sell counterfeit goods, prohibited items, or anything that violates Indian law or Razorpay&apos;s acceptable use policies.</p>
        </Section>

        <Section title="Demo stores">
          <p>The 12 flagship demo stores (August, Ember, and so on) shown on our homepage and /themes page are illustrative previews with sample products — they are not real storefronts you can purchase from, and the products shown are not available for sale until a seller builds their own catalog on that theme.</p>
        </Section>

        <Section title="AI features">
          <p>AI-generated content (product descriptions, photos, auto-replies) is provided as a convenience and may occasionally be inaccurate. You&apos;re responsible for reviewing AI-generated content before it&apos;s shown to your buyers.</p>
        </Section>

        <Section title="Termination">
          <p>We may suspend or terminate a store that violates these Terms, engages in fraud, or abuses the platform (including automated account creation to bypass usage limits). You can close your own account at any time.</p>
        </Section>

        <Section title="Limitation of liability">
          <p>Instastarz is provided &quot;as is&quot;. To the extent permitted by law, Signalpulse Technologies is not liable for indirect or consequential damages arising from your use of the platform, including lost sales or data, beyond amounts you&apos;ve paid us in the preceding 3 months.</p>
        </Section>

        <Section title="Changes to these Terms">
          <p>We may update these Terms as the product evolves. Material changes will be communicated by email to active sellers.</p>
        </Section>

        <Section title="Contact">
          <p>Questions about these Terms: <a href="mailto:hello@instastarz.in" style={{ color: INK }}>hello@instastarz.in</a>.</p>
        </Section>

        <p style={{ fontSize: 12, color: `${INK}55`, marginTop: 56, paddingTop: 24, borderTop: `1px solid ${INK}12` }}>
          Instastarz is a product of Signalpulse Technologies. See also our <Link href="/privacy" style={{ color: INK, textDecoration: 'underline' }}>Privacy Policy</Link> and <Link href="/refund-policy" style={{ color: INK, textDecoration: 'underline' }}>Refund Policy</Link>.
        </p>
      </div>
    </div>
  )
}
