'use client'

import { THEGRID_CAMPAIGN } from '@/lib/thegrid/catalog'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { TheGridImg } from './TheGridShell'
import { TheGridShopGrid } from './TheGridShopGrid'
import { Reveal } from '@/components/flagship/Reveal'

// Home reads like a profile page — avatar, bio, stats — then the grid
// itself, rather than a conventional hero + sections layout.
export function TheGridHome({ brand, products }: { brand: ThemeBrand; products: ThemeProduct[] }) {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'ClothingStore', name: brand.name, description: brand.description }) }} />

      <Reveal>
        <div className="max-w-[1080px] mx-auto px-6 pt-10 pb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0 ring-2" style={{ ringColor: 'var(--tg-accent)' } as React.CSSProperties}>
              <TheGridImg src={THEGRID_CAMPAIGN.hero} alt={brand.name} wrapperClassName="w-full h-full" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold" style={{ fontFamily: 'var(--tg-display)' }}>{brand.name}</h1>
              <p className="text-sm mt-1 max-w-md" style={{ color: 'var(--tg-ink-muted)' }}>{brand.tagline}</p>
              <div className="flex items-center gap-5 mt-3 text-sm">
                <span><strong>{products.length}</strong> <span style={{ color: 'var(--tg-ink-muted)' }}>posts</span></span>
                <span><strong>{brand.categories.length}</strong> <span style={{ color: 'var(--tg-ink-muted)' }}>categories</span></span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="border-t" style={{ borderColor: 'var(--tg-line)' }} />

      <TheGridShopGrid brand={brand} products={products} />
    </div>
  )
}
