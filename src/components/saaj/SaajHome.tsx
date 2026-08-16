'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SAAJ_CAMPAIGN } from '@/lib/saaj/catalog'
import { useCuratedForYou } from '@/lib/flagship/use-recently-viewed'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { SaajProductCard } from './SaajShell'
import { Reveal } from '@/components/flagship/Reveal'

const HOW_IT_WORKS = [
  { n: '01', title: 'Tell us your role & functions', body: 'Bride\'s friend or groom\'s cousin, mehendi through reception — pick what you\'re actually attending.' },
  { n: '02', title: 'Set a budget', body: 'One number, per function. We shortlist real pieces from the collection that fit it.' },
  { n: '03', title: 'Get one outfit per function', body: 'A lehenga for sangeet, a sherwani for the wedding — with a reason for every pick, not a random grid.' },
]

function HeroImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [ok, setOk] = useState(true)
  return (
    <div className={className} style={{ background: 'var(--sj-emerald)' }}>
      {ok && <img src={src} alt={alt} className="w-full h-full object-cover" onError={() => setOk(false)} />}
    </div>
  )
}

export function SaajHome({ brand, products }: { brand: ThemeBrand; products: ThemeProduct[] }) {
  const slug = brand.slug

  const categories = useMemo(() => {
    const list = brand.categories.length ? brand.categories : Array.from(new Set(products.map(p => p.category)))
    return list.map(c => ({ name: c, image: products.find(p => p.category === c)?.image ?? products[0]?.image }))
  }, [brand.categories, products])

  const { products: curated, personalized } = useCuratedForYou('saaj_viewed_v1', products, 4)
  const bestsellers = products.filter(p => p.tags.includes('bestseller')).slice(0, 4)
  const fallbackFeatured = bestsellers.length ? bestsellers : products.slice(0, 4)

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ClothingStore',
            name: brand.name,
            description: brand.description,
          }),
        }}
      />

      {/* Hero — the Function Planner is the primary CTA, not a widget bolted
          onto a browse-first homepage. Mount-triggered fade only, never
          scroll-linked (see Reveal.tsx). */}
      <div className="relative h-[92vh] min-h-[560px] overflow-hidden" style={{ background: 'var(--sj-emerald)' }}>
        <div className="absolute inset-0">
          <HeroImageBg src={SAAJ_CAMPAIGN.hero} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(42,20,32,0.15) 0%, rgba(20,8,16,0.6) 100%)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-full flex flex-col items-center justify-center text-center px-6"
        >
          <p className="text-[11px] tracking-[0.3em] uppercase mb-5" style={{ color: 'rgba(255,255,255,0.85)' }}>Six functions, zero panic</p>
          <h1 className="saaj-display text-[11vw] sm:text-6xl md:text-7xl leading-[0.98] tracking-tight font-semibold" style={{ color: '#FFF8EF' }}>
            {brand.tagline}
          </h1>
          <p className="text-sm md:text-base mt-5 mb-9 max-w-md" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Tell us your role, your functions and your budget — the Function Planner shortlists one outfit for each.
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/store/${slug}/planner`} className="px-8 py-3.5 rounded-full text-sm tracking-wide font-medium transition-transform hover:scale-105" style={{ background: 'var(--sj-accent)', color: 'var(--sj-accent-ink)' }}>
              Open the Function Planner
            </Link>
            <Link href={`/store/${slug}/shop`} className="px-7 py-3.5 rounded-full text-sm tracking-wide border transition-opacity hover:opacity-70" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#FFF8EF' }}>
              Or browse everything
            </Link>
          </div>
        </motion.div>
      </div>

      {/* How it works */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-24 grid grid-cols-1 md:grid-cols-3 gap-12">
        {HOW_IT_WORKS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.1}>
            <p className="saaj-display text-3xl mb-4 font-semibold" style={{ color: 'var(--sj-accent)' }}>{s.n}</p>
            <h3 className="text-lg mb-2.5 font-medium">{s.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--sj-ink-muted)' }}>{s.body}</p>
          </Reveal>
        ))}
      </section>

      {/* Editorial — festive story */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-stretch">
          <Reveal className="md:row-span-2">
            <HeroImage src={SAAJ_CAMPAIGN.motionStudy} alt="" className="w-full h-full object-cover rounded-xl min-h-[320px] overflow-hidden" />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col justify-center h-full py-8 md:py-0 md:pl-8">
              <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'var(--sj-accent)' }}>Every function, sorted</p>
              <h2 className="saaj-display text-4xl md:text-5xl leading-tight mb-5 font-semibold">One wardrobe, six functions, no last-minute scramble.</h2>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--sj-ink-muted)' }}>
                {brand.name} brings mehendi, sangeet, haldi, the wedding and the reception under one roof — lehengas, sarees, sherwanis, kurtas, jewellery and footwear, priced ₹3,999 to ₹24,999, for the whole wedding party.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <HeroImage src={SAAJ_CAMPAIGN.texture} alt="" className="w-full h-full object-cover rounded-xl min-h-[220px] overflow-hidden" />
          </Reveal>
        </div>
      </section>

      {/* Browse instead */}
      {categories.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
          <Reveal>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="saaj-display text-3xl md:text-4xl font-semibold">Prefer to browse?</h2>
                <p className="text-sm mt-1.5" style={{ color: 'var(--sj-ink-muted)' }}>The full collection, by category.</p>
              </div>
              <Link href={`/store/${slug}/shop`} className="text-sm underline underline-offset-4 hover:opacity-70" style={{ color: 'var(--sj-ink-muted)' }}>View all</Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {categories.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.05}>
                <Link href={`/store/${slug}/shop?category=${encodeURIComponent(c.name)}`} className="group block relative aspect-[3/4] overflow-hidden rounded-xl" style={{ background: 'var(--sj-emerald)' }}>
                  {c.image && <CategoryImage src={c.image} alt={c.name} />}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(20,8,16,0.6) 100%)' }} />
                  <span className="absolute bottom-4 left-4 text-sm tracking-wide" style={{ color: '#fff' }}>{c.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Curated for you */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 pb-24">
        <Reveal>
          <div className="mb-8">
            <h2 className="saaj-display text-3xl md:text-4xl font-semibold">{personalized ? 'Curated for you' : 'Festive favourites'}</h2>
            <p className="text-sm mt-1.5" style={{ color: 'var(--sj-ink-muted)' }}>
              {personalized ? 'Based on what you’ve been looking at.' : 'The pieces our shoppers keep coming back for.'}
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
          {(personalized ? curated : fallbackFeatured).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <SaajProductCard product={p} slug={slug} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Planner CTA band */}
      <section className="pb-24">
        <Reveal>
          <div className="max-w-[1440px] mx-auto px-6 md:px-10">
            <div className="relative rounded-xl overflow-hidden" style={{ background: 'var(--sj-emerald)' }}>
              <HeroImage src={SAAJ_CAMPAIGN.flatlayOutfit} alt="" className="w-full h-[380px] md:h-[460px] object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ background: 'linear-gradient(180deg, rgba(20,8,16,0.1) 0%, rgba(20,8,16,0.72) 100%)' }}>
                <p className="text-[11px] tracking-[0.25em] uppercase mb-4 font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>Haven&apos;t planned your functions yet?</p>
                <h2 className="saaj-display text-3xl md:text-5xl mb-6 font-semibold" style={{ color: '#FFF8EF' }}>See your whole wedding wardrobe in three steps.</h2>
                <Link
                  href={`/store/${slug}/planner`}
                  className="px-8 py-3.5 rounded-full text-sm tracking-wide font-medium transition-transform hover:scale-105"
                  style={{ background: '#FFF8EF', color: 'var(--sj-ink)' }}
                >
                  Open the Function Planner
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

function HeroImageBg({ src }: { src: string }) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  return <img src={src} alt="" className="w-full h-full object-cover" onError={() => setOk(false)} />
}

function CategoryImage({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true)
  if (!ok) return null
  return <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" onError={() => setOk(false)} />
}
