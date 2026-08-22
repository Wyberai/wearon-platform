'use client'

import { useEffect, useState } from 'react'
import { SCROLL_STORIES } from '@/lib/scroll/catalog'
import type { ThemeBrand, ThemeProduct } from '@/lib/flagship/types'
import { ScrollStoriesBar } from './ScrollStoriesBar'
import { ScrollFeedPost } from './ScrollFeedPost'
import { ScrollDMSheet } from './ScrollDMSheet'
import { getOrCreateDeviceToken } from '@/lib/device-token'

const WISHLIST_KEY = 'scroll_wishlist_v1'
const TIME_LABELS = ['2 HOURS AGO', '4 HOURS AGO', '6 HOURS AGO', '1 DAY AGO', '2 DAYS AGO', '3 DAYS AGO', '1 WEEK AGO']

function readWishlist(): Set<string> {
  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

// SCROLL's homepage IS the shopping paradigm — a stories bar of new-drop
// teasers above a single vertical feed of "posts" (one product per post).
// Double-tapping a post's image likes it — instant/optimistic like a real
// feed, backed by localStorage for this-device state, and also persisted to
// the real wishlist backend (POST/DELETE /api/store/wishlist) for a real
// seller so it survives across devices instead of being purely cosmetic;
// demo showcases (brand.sellerId null) skip the network call entirely.
// "DM to order" opens an in-app chat-bubble overlay, never a real messaging
// backend.
export function ScrollHome({ brand, products }: { brand: ThemeBrand; products: ThemeProduct[] }) {
  const slug = brand.slug
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [hydrated, setHydrated] = useState(false)
  const [dmProduct, setDmProduct] = useState<ThemeProduct | null>(null)

  useEffect(() => {
    setWishlist(readWishlist())
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try { window.localStorage.setItem(WISHLIST_KEY, JSON.stringify([...wishlist])) } catch { /* ignore */ }
  }, [wishlist, hydrated])

  function toggleLike(productId: string) {
    const nowLiked = !wishlist.has(productId)
    setWishlist(prev => {
      const next = new Set(prev)
      if (next.has(productId)) next.delete(productId)
      else next.add(productId)
      return next
    })

    if (!brand.sellerId) return
    const device_token = getOrCreateDeviceToken()
    if (nowLiked) {
      fetch('/api/store/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller_id: brand.sellerId, product_id: productId, device_token }),
      }).catch(() => {})
    } else {
      fetch('/api/store/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, device_token }),
      }).catch(() => {})
    }
  }

  return (
    <div className="max-w-[600px] mx-auto">
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

      <ScrollStoriesBar stories={SCROLL_STORIES} products={products} slug={slug} />

      <div>
        {products.map((p, i) => (
          <ScrollFeedPost
            key={p.id}
            product={p}
            slug={slug}
            brandHandle={`${slug}.store`}
            liked={wishlist.has(p.id)}
            onToggleLike={toggleLike}
            onDM={setDmProduct}
            timeLabel={TIME_LABELS[i % TIME_LABELS.length]}
          />
        ))}
      </div>

      {dmProduct && (
        <ScrollDMSheet brandName={brand.name} product={dmProduct} onClose={() => setDmProduct(null)} />
      )}
    </div>
  )
}
