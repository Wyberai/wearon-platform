'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

// A faithful clone of Aires de Feria's real homepage: a full-bleed
// campaign hero with an outlined "DESCUBRIR" button, a genuine live
// countdown to the next Feria de Abril (their real "¿Cuánto falta...?"
// widget), and a craft-copy passage in the "no vendemos disfraces,
// vendemos tradición" voice.
function nextAprilFair(): Date {
  const now = new Date()
  const year = now.getMonth() > 3 || (now.getMonth() === 3 && now.getDate() > 20) ? now.getFullYear() + 1 : now.getFullYear()
  return new Date(year, 3, 15)
}

function FeriaCountdown() {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null)

  useEffect(() => {
    const target = nextAprilFair().getTime()
    function tick() {
      const diff = Math.max(0, target - Date.now())
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  if (!left) return null
  return (
    <div className="flex gap-6 justify-center text-center">
      {[['Días', left.d], ['Horas', left.h], ['Min', left.m], ['Seg', left.s]].map(([label, val]) => (
        <div key={label as string}>
          <p className="text-2xl md:text-3xl font-bold tabular-nums" style={{ color: 'var(--fg-ink)' }}>{String(val).padStart(2, '0')}</p>
          <p className="text-[10px] uppercase tracking-[0.1em]" style={{ color: 'var(--fg-ink-dim)' }}>{label}</p>
        </div>
      ))}
    </div>
  )
}

function GridCard({ p, slug }: { p: ThemeProduct; slug: string }) {
  const { addLine } = useFlagshipCart()
  return (
    <Link href={`/store/${slug}/product/${p.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden mb-3" style={{ background: 'var(--fg-card)' }}>
        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); addLine(p, p.sizes[0] ?? '', p.colors[0] ?? '', 1) }}
          className="absolute bottom-2 left-2 right-2 py-2 text-[11px] uppercase tracking-[0.08em] text-center opacity-0 group-hover:opacity-100 transition-opacity font-semibold"
          style={{ background: 'var(--fg-ink)', color: 'var(--fg-bg)' }}
        >
          Add to Bag
        </button>
      </div>
      <p className="text-[13px] italic" style={{ color: 'var(--fg-ink)' }}>{p.name}</p>
      <p className="text-[13px]" style={{ color: 'var(--fg-ink-dim)' }}>${p.price.toLocaleString('en-IN')}</p>
    </Link>
  )
}

export function FlamencaHome({ brand, products, mechanicLabel, mechanicIntro, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; mechanicIntro: string; onOpenMechanic: () => void }) {
  const slug = brand.slug
  const heroImg = products[0]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      {/* Full-bleed campaign hero, outlined DESCUBRIR button */}
      <section className="relative h-[70vh] min-h-[460px] flex items-center justify-center text-center">
        {heroImg && <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative text-white px-6">
          <h1 className="text-3xl md:text-5xl mb-6" style={{ fontFamily: 'Georgia, serif' }}>Colección Verano {new Date().getFullYear()}</h1>
          <Link href={`/store/${slug}/shop`} className="inline-block px-8 py-3 text-[12px] uppercase tracking-[0.1em] border border-white hover:bg-white hover:text-black transition-colors">
            Descubrir
          </Link>
        </div>
      </section>

      {/* Live countdown to the next Feria de Abril — the real Aires de Feria widget */}
      <section className="px-6 md:px-10 py-14 text-center border-b" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-sm mb-6" style={{ color: 'var(--fg-ink-muted)' }}>¿Cuánto falta para la próxima Feria de Abril?</p>
        <FeriaCountdown />
      </section>

      <section className="px-6 md:px-10 py-14">
        <h2 className="text-sm uppercase tracking-[0.08em] mb-8 text-center" style={{ color: 'var(--fg-ink)' }}>Nuestros Modelos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {products.map(p => <GridCard key={p.id} p={p} slug={slug} />)}
        </div>
      </section>

      {/* Craft passage — the real "no vendemos disfraces, vendemos tradición" voice */}
      <section className="px-6 md:px-10 py-20 max-w-2xl mx-auto text-center border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <p className="text-[11px] uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--fg-ink-dim)' }}>Alma Artesanal</p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-ink-muted)' }}>
          {brand.tagline} En {brand.name} no vendemos disfraces, vendemos tradición actualizada. Cada volante nace de un patrón cortado a mano en nuestros talleres, con sedas y popelines elegidos por su caída, para que la prenda se mueva contigo &mdash; en la Feria, en la Romería, o simplemente el día en que quieras sentir ese fuego.
        </p>
      </section>

      <section className="px-6 md:px-10 py-16 border-t" style={{ borderColor: 'var(--fg-line)' }}>
        <h2 className="text-sm mb-3" style={{ color: 'var(--fg-ink)' }}>{mechanicLabel}</h2>
        <p className="text-sm leading-relaxed max-w-md mb-5" style={{ color: 'var(--fg-ink-muted)' }}>{mechanicIntro}</p>
        <button onClick={onOpenMechanic} className="px-6 py-3 text-[12px] uppercase tracking-[0.06em] font-semibold hover:opacity-80 transition-opacity" style={{ background: 'var(--fg-accent)', color: 'white' }}>
          Begin
        </button>
      </section>
    </div>
  )
}
