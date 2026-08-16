import Link from 'next/link'
import type { ThemeBrand } from '@/lib/flagship/types'

export function EmberFooter({ brand }: { brand: ThemeBrand }) {
  const slug = brand.slug
  const isDemoData = !brand.sellerId

  return (
    <footer id="journal" className="mt-32 border-t" style={{ borderColor: 'var(--e-line)' }}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <span className="ember-display text-lg tracking-tight" style={{ fontWeight: 800 }}>{brand.name}</span>
          <p className="text-sm mt-3 max-w-[220px] leading-relaxed" style={{ color: 'var(--e-ink-muted)' }}>
            {brand.tagline}
          </p>
        </div>
        {brand.categories.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--e-ink-dim)' }}>Shop</p>
            <div className="flex flex-col gap-2.5 text-sm">
              {brand.categories.map(c => (
                <Link key={c} href={`/store/${slug}/shop?category=${encodeURIComponent(c)}`} className="hover:opacity-60 transition-opacity" style={{ color: 'var(--e-ink-muted)' }}>
                  {c}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--e-ink-dim)' }}>About</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--e-ink-muted)' }}>
            <a href="#" className="hover:opacity-60 transition-opacity">Our story</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Materials</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Care guide</a>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: 'var(--e-ink-dim)' }}>Client Services</p>
          <div className="flex flex-col gap-2.5 text-sm" style={{ color: 'var(--e-ink-muted)' }}>
            <a href="#" className="hover:opacity-60 transition-opacity">Shipping &amp; returns</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Size guide</a>
            <a href="#" className="hover:opacity-60 transition-opacity">Contact</a>
          </div>
        </div>
      </div>
      <div className="border-t py-6" style={{ borderColor: 'var(--e-line)' }}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]" style={{ color: 'var(--e-ink-dim)' }}>
          {isDemoData ? (
            <p>A concept storefront demonstrating Instastarz&apos;s &quot;February&quot; flagship theme. Not a real retailer.</p>
          ) : (
            <p>{brand.name}, built on Instastarz.</p>
          )}
          <p>Powered by <Link href="/" className="hover:opacity-70 transition-opacity" style={{ color: 'inherit' }}>Instastarz</Link></p>
        </div>
      </div>
    </footer>
  )
}
