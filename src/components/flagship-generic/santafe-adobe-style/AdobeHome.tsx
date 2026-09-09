'use client'

import Link from 'next/link'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// Modeled on shopdoen.com's real homepage — full-bleed vintage-editorial
// photo sections stacked, each carrying only a small centered serif label
// with an ornamental flourish divider (no big headline). Product cards show
// their full size run directly, another real DÔEN detail no other
// Generic* home uses.
function SizeRunCard({ p, slug }: { p: ThemeProduct; slug: string }) {
  const { addLine } = useFlagshipCart()
  return (
    <div className="group">
      <Link href={`/store/${slug}/product/${p.slug}`} className="block relative aspect-[4/5] overflow-hidden mb-3" style={{ background: 'var(--fg-card)' }}>
        <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      </Link>
      <p className="text-[13px] mb-1" style={{ color: 'var(--fg-ink)' }}>{p.name}</p>
      <p className="text-[13px] mb-2.5" style={{ color: 'var(--fg-ink-dim)' }}>${p.price.toLocaleString('en-IN')}</p>
      <div className="flex flex-wrap gap-1.5">
        {p.sizes.map(s => (
          <button key={s} onClick={() => addLine(p, s, p.colors[0] ?? '', 1)} className="text-[10px] min-w-[26px] h-[22px] px-1.5 border rounded-sm hover:opacity-100 transition-opacity" style={{ borderColor: 'var(--fg-line)', color: 'var(--fg-ink-muted)' }}>
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

function FlourishSection({ label, image, href }: { label: string; image?: string; href: string }) {
  return (
    <Link href={href} className="block relative h-[62vh] min-h-[400px] overflow-hidden">
      {image && <img src={image} alt="" className="w-full h-full object-cover" />}
      <div className="absolute bottom-0 left-0 right-0 pb-8 flex flex-col items-center">
        <p className="text-[13px] tracking-[0.25em] uppercase" style={{ color: '#fff', textShadow: '0 1px 8px rgba(0,0,0,0.45)' }}>{label}</p>
        <span className="text-[11px] mt-1.5" style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 8px rgba(0,0,0,0.45)' }}>✦ ⟡ ✦</span>
      </div>
    </Link>
  )
}

export function AdobeHome({ brand, products, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const heroImage = products[0]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      <div className="relative h-[80vh] min-h-[520px] overflow-hidden">
        {heroImage && <img src={heroImage} alt="" className="w-full h-full object-cover" />}
      </div>

      <section className="py-10 text-center px-6">
        <p className="text-[13px] tracking-[0.1em]" style={{ color: 'var(--fg-ink-muted)', fontStyle: 'italic' }}>{brand.tagline}</p>
      </section>

      <FlourishSection label="New Arrivals" image={products[1]?.image} href={`/store/${slug}/shop`} />
      <FlourishSection label="Turquoise & Adobe" image={products[2]?.image} href={`/store/${slug}/shop`} />

      <section className="px-6 md:px-10 py-16">
        <div className="text-center mb-3">
          <p className="text-[13px] tracking-[0.2em] uppercase" style={{ color: 'var(--fg-ink)' }}>Featured</p>
          <p className="text-[11px] mt-1" style={{ color: 'var(--fg-ink-dim)' }}>✦ ⟡ ✦</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-8">
          {products.map(p => <SizeRunCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      <section className="px-6 md:px-10 py-16 border-t text-center" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-[11px] tracking-[0.15em] uppercase mb-3" style={{ color: 'var(--fg-ink-dim)' }}>Not sure where to start?</p>
        <h2 className="text-xl md:text-2xl mb-5" style={{ fontStyle: 'italic', fontWeight: 500 }}>{mechanicLabel}</h2>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[11px] tracking-[0.15em] uppercase" style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}>
          {mechanicLabel}
        </button>
      </section>
    </div>
  )
}
