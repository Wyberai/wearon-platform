'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { ThemeProduct } from '@/lib/flagship/types'
import { TheGridImg } from './TheGridShell'

// The signature mechanic: a square IG-profile-grid tile whose video (an
// imported Reel) autoplays muted/looped the moment it scrolls into view —
// exactly like scrolling a real Instagram profile grid — falling back to
// the static image for products with none.
export function TheGridTile({ product, slug, priority = false }: { product: ThemeProduct; slug: string; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!product.video || !ref.current) return
    const el = ref.current
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.6 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [product.video])

  return (
    <div ref={ref} className="relative aspect-square overflow-hidden">
      <Link href={`/store/${slug}/product/${product.slug}`} className="group absolute inset-0 block" style={{ background: 'var(--tg-card)' }}>
        <TheGridImg src={product.image} alt={product.name} wrapperClassName="absolute inset-0" imgClassName="w-full h-full object-cover" priority={priority} />
        {product.video && (
          <video src={product.video} muted loop playsInline autoPlay={inView} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300" style={{ opacity: inView ? 1 : 0 }} />
        )}
        {product.video && (
          <span className="absolute top-2 right-2 text-white text-[10px]" style={{ filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' }}>▶</span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </Link>
    </div>
  )
}
