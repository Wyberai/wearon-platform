'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useCuratedForYou } from '@/lib/flagship/use-recently-viewed'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { GenericProductCard } from './GenericProductCard'
import { Reveal } from '@/components/flagship/Reveal'

export function GenericHome({ brand, products, mechanicLabel, onOpenMechanic }: { brand: ThemeBrand; products: ThemeProduct[]; mechanicLabel: string; onOpenMechanic: () => void }) {
  const slug = brand.slug

  const categories = useMemo(() => {
    const list = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
    return list.map(c => ({ name: c, image: products.find(p => p.category === c)?.image ?? products[0]?.image }))
  }, [brand.categories, products])

  const { products: curated, personalized } = useCuratedForYou(`fg_${slug}_viewed_v1`, products, 4)
  const bestsellers = products.filter(p => p.tags.includes('bestseller')).slice(0, 4)
  const fallbackFeatured = bestsellers.length ? bestsellers : products.slice(0, 4)
  const heroImage = products[0]?.image

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      <div className="relative h-[92vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          {heroImage && <img src={heroImage} alt="" className="w-full h-full object-cover" />}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, var(--fg-bg) 100%)', opacity: 0.9 }} />
        </div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-[13vw] sm:text-6xl md:text-7xl leading-[0.95] tracking-tight" style={{ color: '#fff', fontWeight: 800, textShadow: '0 2px 24px rgba(0,0,0,0.35)' }}>{brand.name}</h1>
          <p className="text-sm md:text-base tracking-[0.1em] uppercase mt-4 mb-9 max-w-md" style={{ color: 'rgba(255,255,255,0.88)' }}>{brand.tagline}</p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link href={`/store/${slug}/shop`} className="px-7 py-3.5 rounded-full text-sm tracking-wide font-semibold transition-transform hover:scale-105" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}>
              Shop the Collection
            </Link>
            <button onClick={onOpenMechanic} className="px-7 py-3.5 rounded-full text-sm tracking-wide font-semibold transition-transform hover:scale-105 border" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
              ✦ {mechanicLabel}
            </button>
          </div>
        </motion.div>
      </div>

      {categories.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-24">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>Shop by category</h2>
              <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--fg-ink-muted)' }}>View all</Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {categories.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <Link href={`/store/${slug}/shop?category=${encodeURIComponent(c.name)}`} className="group block relative aspect-[3/4] overflow-hidden rounded-lg">
                  {c.image && <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />
                  <span className="absolute bottom-4 left-4 text-sm tracking-wide font-medium" style={{ color: '#fff' }}>{c.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <Reveal>
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl" style={{ fontWeight: 600 }}>{personalized ? 'Curated for you' : 'Fan favorites'}</h2>
            <p className="text-sm mt-1.5" style={{ color: 'var(--fg-ink-muted)' }}>{personalized ? 'Based on what you’ve been looking at.' : 'The pieces everyone asks about.'}</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {(personalized ? curated : fallbackFeatured).map((p, i) => (<Reveal key={p.id} delay={i * 0.06}><GenericProductCard product={p} slug={slug} priority={i < 2} /></Reveal>))}
        </div>
      </section>

      <section className="pb-24">
        <Reveal>
          <div className="max-w-[1440px] mx-auto px-6 md:px-10">
            <div className="relative rounded-lg overflow-hidden">
              {products[1]?.image && <img src={products[1].image} alt="" className="w-full h-[380px] md:h-[460px] object-cover" />}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%)' }}>
                <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-semibold" style={{ color: 'var(--fg-accent)' }}>Not sure where to start?</p>
                <h2 className="text-2xl md:text-4xl mb-6" style={{ color: '#fff', fontWeight: 800 }}>{mechanicLabel}</h2>
                <button onClick={onOpenMechanic} className="px-7 py-3.5 rounded-full text-sm tracking-wide font-semibold transition-transform hover:scale-105" style={{ background: 'var(--fg-accent)', color: 'var(--fg-accent-ink)' }}>
                  Try it now
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
