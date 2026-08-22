'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { ThemeProduct } from '@/lib/flagship/types'
import { useFlagshipCart } from '@/lib/flagship/cart-context'

export function AugustProductCard({ product, slug, priority = false }: { product: ThemeProduct; slug: string; priority?: boolean }) {
  const { addLine } = useFlagshipCart()
  const [hovered, setHovered] = useState(false)

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addLine(product, product.sizes[0] ?? '', product.colors[0] ?? '', 1)
  }

  return (
    <Link
      href={`/store/${slug}/product/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm" style={{ background: 'var(--a-card)' }}>
        <img
          src={product.image}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {product.tags.includes('new') && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.1em] uppercase px-2 py-1" style={{ background: 'var(--a-bg)', color: 'var(--a-ink)' }}>New</span>
        )}
        {product.tags.includes('sale') && (
          <span className="absolute top-3 left-3 text-[10px] tracking-[0.1em] uppercase px-2 py-1" style={{ background: 'var(--a-accent)', color: 'var(--a-accent-ink)' }}>Sale</span>
        )}
        <button
          onClick={quickAdd}
          className="absolute bottom-0 left-0 right-0 py-3 text-[12px] tracking-[0.1em] uppercase text-center transition-all duration-300"
          style={{
            background: 'var(--a-glass)',
            backdropFilter: 'blur(12px)',
            color: 'var(--a-ink)',
            transform: hovered ? 'translateY(0)' : 'translateY(100%)',
            opacity: hovered ? 1 : 0,
          }}
        >
          Quick Add
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm" style={{ color: 'var(--a-ink)' }}>{product.name}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--a-ink-dim)' }}>{product.colors[0]}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm" style={{ color: product.originalPrice ? 'var(--a-accent)' : 'var(--a-ink)' }}>₹{product.price.toLocaleString('en-IN')}</p>
          {product.originalPrice && (
            <p className="text-xs line-through" style={{ color: 'var(--a-ink-dim)' }}>₹{product.originalPrice.toLocaleString('en-IN')}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
