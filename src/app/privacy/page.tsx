import Link from 'next/link'
import { MarketingNav } from '@/components/marketing/MarketingNav'

const INK = '#111010'

export const metadata = {
  title: 'Privacy Policy — Instastarz',
  description: 'How Instastarz collects, uses, and protects your data.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 20, fontWeight: 600, letterSpacing: '-0.2px', marginBottom: 12, color: INK }}>{title}</h2>
      <div style={{ fontSize: 14.5, lineHeight: 1.75, color: `${INK}CC` }}>{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <div style={{ background: '#fff', color: INK, minHeight: '100vh' }}>
      <MarketingNav />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 96px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: `${INK}66`, marginBottom: 16 }}>Legal</p>
        <h1 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 400, letterSpacing: '-1px', marginBottom: 12, color: INK }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 13, color: `${INK}66`, marginBottom: 48 }}>Last updated August 16, 2026</p>

        <Section title="Who we are">
          <p>Instastarz is a product of Signalpulse Technologies. This policy explains what data we collect from you, why, and what control you have over it — whether you&apos;re a seller running a store on Instastarz, or a buyer shopping one.</p>
        </Section>

        <Section title="What we collect">
          <p style={{ marginBottom: 12 }}><strong>From sellers:</strong> your name, email, phone/WhatsApp number, store details (brand name, logo, colors), product catalog, order and payment records, and any Instagram account data you choose to connect for product import.</p>
          <p><strong>From buyers:</strong> name, contact details, shipping address, and order history — collected on behalf of the seller whose store you&apos;re shopping, to fulfil your order.</p>
        </Section>

        <Section title="How we use it">
          <p>To run your store (checkout, order management, analytics), to process payments through Razorpay, to send transactional messages via WhatsApp or email, and to power optional AI features (product photos, auto-replies, AI Buyer) you explicitly enable. We do not sell your data to third parties.</p>
        </Section>

        <Section title="Payment processing">
          <p>Card and UPI payments are processed by Razorpay, not stored on our servers. We never see or store your full card number. Cash-on-delivery and WhatsApp orders are recorded directly by us to fulfil the transaction.</p>
        </Section>

        <Section title="Third-party services we use">
          <p>Razorpay (payments), WhatsApp Business Platform and Meta (messaging, Instagram import), Supabase (database and file storage), Vercel (hosting), Resend (transactional email). Each processes only the data required for the specific function you use.</p>
        </Section>

        <Section title="Data retention">
          <p>We retain your account and store data for as long as your account is active, plus a reasonable period afterward for legal and accounting purposes. You can request deletion of your account and associated data by emailing us — see Contact below.</p>
        </Section>

        <Section title="Your rights">
          <p>You can access, correct, or request deletion of your personal data at any time. For sellers, this includes exporting your product catalog and order history before closing your account.</p>
        </Section>

        <Section title="Contact">
          <p>Questions about this policy or a data request: <a href="mailto:hello@instastarz.in" style={{ color: INK }}>hello@instastarz.in</a>.</p>
        </Section>

        <p style={{ fontSize: 12, color: `${INK}55`, marginTop: 56, paddingTop: 24, borderTop: `1px solid ${INK}12` }}>
          Instastarz is a product of Signalpulse Technologies. See also our <Link href="/terms" style={{ color: INK, textDecoration: 'underline' }}>Terms of Service</Link> and <Link href="/refund-policy" style={{ color: INK, textDecoration: 'underline' }}>Refund Policy</Link>.
        </p>
      </div>
    </div>
  )
}
