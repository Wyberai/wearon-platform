// THE GRID — second of three "Insta" flagship themes. Browsing pattern is
// the signature here: a classic 3-column Instagram-profile-style square
// grid (see TheGridTile.tsx) instead of Reel Rack's category-first list
// layout. Videos autoplay muted in-grid on hover/inview exactly like a real
// IG profile grid, falling back to the static image when a product has
// none. Leans Western/casual (vs Reel Rack's ethnic-wear focus) so the
// three Insta themes don't read as redundant catalogs of each other.

import type { ThemeProduct, ThemeBrand } from '@/lib/flagship/types'

export interface DemoProduct extends ThemeProduct {
  category: 'Dresses' | 'Tops' | 'Denim' | 'Outerwear' | 'Accessories'
}

const IMG = (slug: string) => `/thegrid/products/${slug}.jpg`

export const THEGRID_PRODUCTS: DemoProduct[] = [
  { id: 'tg-01', slug: 'black-slip-midi-dress', name: 'Black Slip Midi Dress', category: 'Dresses', price: 1799,
    description: 'A satin slip midi dress in black — the kind of piece that works for a dinner or a night out.',
    detail: 'Cowl neckline, adjustable straps, midi length.', fabric: 'Satin', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Black'], tags: ['bestseller'], image: IMG('black-slip-midi-dress') },
  { id: 'tg-02', slug: 'yellow-sundress', name: 'Yellow Cotton Sundress', category: 'Dresses', price: 1399, originalPrice: 1799,
    description: 'A breezy yellow cotton sundress — easy, bright, made for warm days.',
    detail: 'Smocked bodice, adjustable straps, midi length.', fabric: 'Cotton', fit: 'True to size',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Yellow'], tags: ['sale'], image: IMG('yellow-sundress') },
  { id: 'tg-03', slug: 'white-poplin-shirt', name: 'White Poplin Shirt', category: 'Tops', price: 999,
    description: 'A crisp white poplin shirt — the one top that goes with everything.',
    detail: 'Relaxed fit, button-down, curved hem.', fabric: 'Cotton poplin', fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['White'], tags: ['signature'], image: IMG('white-poplin-shirt') },
  { id: 'tg-04', slug: 'ribbed-tank-top', name: 'Ribbed Tank Top', category: 'Tops', price: 599,
    description: 'A fitted ribbed tank in a soft cotton blend — a layering staple.',
    detail: 'Scoop neck, fitted, cropped length.', fabric: 'Cotton-elastane rib', fit: 'Fitted',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Cream', 'Black'], tags: ['new'], image: IMG('ribbed-tank-top') },
  { id: 'tg-05', slug: 'high-rise-mom-jeans', name: 'High-Rise Mom Jeans', category: 'Denim', price: 1699,
    description: 'High-rise mom jeans in a mid-blue wash — the fit that never goes out of style.',
    detail: 'Tapered leg, high rise, five-pocket styling.', fabric: 'Cotton denim', fit: 'Relaxed through hip and thigh',
    sizes: ['26', '28', '30', '32', '34'], colors: ['Mid Blue'], tags: ['bestseller'], image: IMG('high-rise-mom-jeans') },
  { id: 'tg-06', slug: 'wide-leg-denim', name: 'Wide-Leg Jeans', category: 'Denim', price: 1899, originalPrice: 2299,
    description: 'Wide-leg jeans in a light wash — the silhouette everyone\'s wearing right now.',
    detail: 'High rise, wide leg, raw hem.', fabric: 'Cotton denim', fit: 'Relaxed, wide through leg',
    sizes: ['26', '28', '30', '32'], colors: ['Light Blue'], tags: ['sale'], image: IMG('wide-leg-denim') },
  { id: 'tg-07', slug: 'oversized-denim-jacket', name: 'Oversized Denim Jacket', category: 'Outerwear', price: 2199,
    description: 'An oversized denim jacket in classic blue — throw it over anything.',
    detail: 'Dropped shoulder, button-front, chest pockets.', fabric: 'Cotton denim', fit: 'Oversized',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Blue'], tags: ['signature'], image: IMG('oversized-denim-jacket') },
  { id: 'tg-08', slug: 'cropped-bomber-jacket', name: 'Cropped Bomber Jacket', category: 'Outerwear', price: 2499,
    description: 'A cropped bomber jacket in olive — a wardrobe staple for cooler days.',
    detail: 'Ribbed cuffs and hem, zip-front, side pockets.', fabric: 'Nylon shell', fit: 'Cropped, true to size',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Olive'], tags: ['new'], image: IMG('cropped-bomber-jacket') },
  { id: 'tg-09', slug: 'gold-layered-necklace', name: 'Gold Layered Necklace Set', category: 'Accessories', price: 699,
    description: 'A set of three layered gold-toned necklaces — an easy way to elevate any outfit.',
    detail: 'Set of 3, adjustable lengths.', fabric: 'Alloy, gold-plated', fit: 'Adjustable',
    sizes: [], colors: ['Gold'], tags: ['bestseller'], image: IMG('gold-layered-necklace') },
  { id: 'tg-10', slug: 'oversized-sunglasses', name: 'Oversized Sunglasses', category: 'Accessories', price: 899,
    description: 'Oversized sunglasses with a tortoiseshell frame — the finishing touch on any look.',
    detail: 'UV400 protection, tortoiseshell frame.', fabric: 'Acetate', fit: 'One size',
    sizes: [], colors: ['Tortoiseshell'], tags: ['new'], image: IMG('oversized-sunglasses') },
]

export const THEGRID_CATEGORIES = ['Dresses', 'Tops', 'Denim', 'Outerwear', 'Accessories'] as const

export const THEGRID_CAMPAIGN = {
  hero: '/thegrid/campaign/hero.jpg',
}

export const THEGRID_BRAND: ThemeBrand = {
  name: 'THE GRID',
  tagline: 'Shop the grid, not the feed.',
  slug: 'thegrid',
  currency: 'INR',
  categories: [...THEGRID_CATEGORIES],
  sellerId: null,
  description:
    'THE GRID turns your Instagram profile into a real storefront — a classic square-tile grid where every video plays right in place, just like scrolling your own page.',
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function findProduct(products: ThemeProduct[], idOrSlug: string): ThemeProduct | undefined {
  return products.find(p => p.id === idOrSlug || p.slug === idOrSlug)
}

export function relatedProducts(products: ThemeProduct[], product: ThemeProduct, count = 4): ThemeProduct[] {
  return products
    .filter(p => p.id !== product.id && p.category === product.category)
    .concat(products.filter(p => p.id !== product.id && p.category !== product.category))
    .slice(0, count)
}
