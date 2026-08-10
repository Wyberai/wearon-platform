'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/lib/types'
import type { Theme } from '@/lib/themes'

export function StoreFeedLayout({
  products,
  slug,
  theme,
}: {
  products: Product[]
  slug: string
  theme: Theme
}) {
  return (
    <div className="h-[calc(100vh-73px)] overflow-y-scroll snap-y snap-mandatory" style={{ background: theme.palette.bg }}>
      {products.length === 0 ? (
        <div className="h-full flex items-center justify-center" style={{ color: `${theme.palette.ink}88` }}>
          No products yet.
        </div>
      ) : (
        products.map(product => (
          <FeedSlide key={product.id} product={product} slug={slug} theme={theme} />
        ))
      )}
    </div>
  )
}

function FeedSlide({ product, slug, theme }: { product: Product; slug: string; theme: Theme }) {
  const [showTag, setShowTag] = useState(false)

  return (
    <section className="relative h-full w-full snap-start snap-always flex items-center justify-center overflow-hidden">
      <img src={product.garment_image_url} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

      <button
        onClick={() => setShowTag(s => !s)}
        className="absolute top-6 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center text-white"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
      >
        🛍️
      </button>

      {showTag && (
        <div className="absolute top-[70px] right-4 z-20 w-56 rounded-2xl overflow-hidden shadow-xl" style={{ background: 'rgba(20,20,20,0.95)' }}>
          <div className="p-3 flex gap-3 items-center">
            <img src={product.garment_image_url} alt="" className="w-12 h-14 rounded-lg object-cover flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-white text-xs font-medium truncate">{product.name}</p>
              <p className="text-white/60 text-xs">₹{product.price_inr.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <Link
            href={`/store/${slug}/product/${product.id}`}
            className="block w-full py-2.5 text-xs font-bold text-center"
            style={{ background: theme.palette.accent, color: '#fff' }}
          >
            View & order →
          </Link>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-16 p-5 pb-10 z-10 pointer-events-none text-white">
        <p className="font-semibold text-sm mb-1">{product.name}</p>
        <p className="text-sm opacity-85">₹{product.price_inr.toLocaleString('en-IN')}{product.category ? ` · ${product.category}` : ''}</p>
      </div>
    </section>
  )
}
