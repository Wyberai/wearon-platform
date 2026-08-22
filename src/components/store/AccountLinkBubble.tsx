import Link from 'next/link'

// Bottom-left floating counterpart to WhatsAppBubble (bottom-right) — the
// real order-lookup page at /store/[slug]/account already existed but was
// linked from none of the 12 flagship themes' bespoke headers/footers.
export function AccountLinkBubble({ slug }: { slug: string }) {
  return (
    <Link
      href={`/store/${slug}/account`}
      aria-label="My orders"
      style={{
        position: 'fixed', bottom: 20, left: 20, zIndex: 60,
        width: 56, height: 56, borderRadius: '50%', background: '#171512',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.28)', textDecoration: 'none',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    </Link>
  )
}
