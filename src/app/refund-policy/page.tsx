import Link from 'next/link'
import { MarketingNav } from '@/components/marketing/MarketingNav'

const INK = '#111010'

export const metadata = {
  title: 'Refund Policy — Instastarz',
  description: 'Our subscription refund and cancellation policy.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: 'var(--font-marketing)', fontSize: 20, fontWeight: 600, letterSpacing: '-0.2px', marginBottom: 12, color: INK }}>{title}</h2>
      <div style={{ fontSize: 14.5, lineHeight: 1.75, color: `${INK}CC` }}>{children}</div>
    </section>
  )
}

export default function RefundPolicyPage() {
  return (
    <div style={{ background: '#fff', color: INK, minHeight: '100vh' }}>
      <MarketingNav />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 96px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: `${INK}66`, marginBottom: 16 }}>Legal</p>
        <h1 style={{ fontFamily: 'var(--font-marketing)', fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 400, letterSpacing: '-1px', marginBottom: 12, color: INK }}>
          Refund Policy
        </h1>
        <p style={{ fontSize: 13, color: `${INK}66`, marginBottom: 48 }}>Last updated August 16, 2026</p>

        <Section title="Scope">
          <p>This policy covers <strong>Instastarz subscription charges</strong> — what a seller pays us for their Store, Store + App, or Store + App + AI Photoshoot plan. It does not cover orders placed with individual sellers on their own storefronts — refunds for a product you bought from an Instastarz-powered store are that seller&apos;s responsibility, not ours, since we&apos;re the storefront platform, not the merchant of record for their goods.</p>
        </Section>

        <Section title="Free plan">
          <p>The Free plan costs nothing, so there&apos;s nothing to refund. You can use it indefinitely or upgrade at any time.</p>
        </Section>

        <Section title="Paid plan cancellation">
          <p>You can cancel a paid plan at any time from your dashboard. Cancellation stops future billing but does not refund the current billing period — you keep access to your paid features until the end of the period you&apos;ve already paid for, then your store reverts to Free.</p>
        </Section>

        <Section title="Billing errors">
          <p>If you&apos;re charged in error — a duplicate charge, a charge after you cancelled, or a charge that doesn&apos;t match your plan — email us within 30 days and we&apos;ll refund the erroneous amount in full.</p>
        </Section>

        <Section title="No refund for partial-month use">
          <p>We don&apos;t prorate refunds for downgrading or cancelling partway through a paid month, since the subscription grants access for the full period regardless of how much you use it.</p>
        </Section>

        <Section title="How refunds are processed">
          <p>Approved refunds are issued to the original payment method via Razorpay or Stripe, typically within 5-7 business days depending on your bank.</p>
        </Section>

        <Section title="Requesting a refund">
          <p>Email <a href="mailto:hello@instastarz.in" style={{ color: INK }}>hello@instastarz.in</a> with your store slug and the charge in question.</p>
        </Section>

        <p style={{ fontSize: 12, color: `${INK}55`, marginTop: 56, paddingTop: 24, borderTop: `1px solid ${INK}12` }}>
          Instastarz is a product of Signalpulse Technologies. See also our <Link href="/privacy" style={{ color: INK, textDecoration: 'underline' }}>Privacy Policy</Link> and <Link href="/terms" style={{ color: INK, textDecoration: 'underline' }}>Terms of Service</Link>.
        </p>
      </div>
    </div>
  )
}
