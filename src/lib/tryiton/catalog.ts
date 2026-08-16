// TRY IT ON — third of three "Insta" flagship themes. Browsing is a normal
// catalog grid (closest to a conventional storefront of the three) — the
// signature mechanic lives entirely on the PDP, which defaults to playing
// the seller's reel instead of a photo, with an image/video toggle (see
// TryItOnVideoStage.tsx). Distinct catalog focus from the other two
// (fusion/going-out wear + footwear) so all three don't read as the same
// shop reskinned.

import type { ThemeProduct, ThemeBrand } from '@/lib/flagship/types'

export interface DemoProduct extends ThemeProduct {
  category: 'Jumpsuits' | 'Dresses' | 'Ethnic Fusion' | 'Footwear'
}

const IMG = (slug: string) => `/tryiton/products/${slug}.jpg`

export const TRYITON_PRODUCTS: DemoProduct[] = [
  { id: 'ti-01', slug: 'black-satin-jumpsuit', name: 'Black Satin Jumpsuit', category: 'Jumpsuits', price: 2299,
    description: 'A wide-leg satin jumpsuit in black — one piece, zero effort, ready for a night out.',
    detail: 'Halter neck, wide leg, side zip.', fabric: 'Satin', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Black'], tags: ['bestseller'], image: IMG('black-satin-jumpsuit') },
  { id: 'ti-02', slug: 'red-belted-jumpsuit', name: 'Red Belted Jumpsuit', category: 'Jumpsuits', price: 1999, originalPrice: 2499,
    description: 'A tailored red jumpsuit with a self-belt — sharp enough for a party, easy enough to move in.',
    detail: 'Notch lapel, self-belt, tapered leg.', fabric: 'Crepe', fit: 'Tailored',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Red'], tags: ['sale'], image: IMG('red-belted-jumpsuit') },
  { id: 'ti-03', slug: 'sequin-bodycon-dress', name: 'Sequin Bodycon Dress', category: 'Dresses', price: 2799,
    description: 'A fully sequined bodycon mini dress — the one that catches every light in the room.',
    detail: 'Round neck, sleeveless, mini length, lined.', fabric: 'Sequin mesh', fit: 'Bodycon',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Silver'], tags: ['signature'], image: IMG('sequin-bodycon-dress') },
  { id: 'ti-04', slug: 'emerald-cape-dress', name: 'Emerald Cape Dress', category: 'Dresses', price: 3199,
    description: 'A dramatic emerald dress with a detachable cape — statement dressing, made simple.',
    detail: 'Detachable cape sleeves, fitted bodice, midi length.', fabric: 'Georgette', fit: 'True to size',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Emerald'], tags: ['new'], image: IMG('emerald-cape-dress') },
  { id: 'ti-05', slug: 'indowestern-cowl-saree-gown', name: 'Indo-Western Cowl Saree Gown', category: 'Ethnic Fusion', price: 4499,
    description: 'A pre-draped saree gown with a cowl silhouette — the saree drape, zero pleating required.',
    detail: 'Pre-stitched drape, attached cowl pallu, concealed zip.', fabric: 'Georgette', fit: 'True to size',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Wine'], tags: ['bestseller'], image: IMG('indowestern-cowl-saree-gown') },
  { id: 'ti-06', slug: 'dhoti-jumpsuit-fusion', name: 'Dhoti-Style Fusion Jumpsuit', category: 'Ethnic Fusion', price: 2699,
    description: 'A dhoti-draped jumpsuit that reads festive without being a full ethnic outfit.',
    detail: 'Dhoti-draped legs, fitted bodice, back zip.', fabric: 'Silk blend', fit: 'True to size',
    sizes: ['S', 'M', 'L'], colors: ['Mustard'], tags: ['signature'], image: IMG('dhoti-jumpsuit-fusion') },
  { id: 'ti-07', slug: 'strappy-block-heels', name: 'Strappy Block Heels', category: 'Footwear', price: 1499,
    description: 'Strappy block heels in nude — comfortable enough to dance in.',
    detail: 'Block heel, ankle strap, cushioned footbed.', fabric: 'Faux leather', fit: 'True to size',
    sizes: ['5', '6', '7', '8', '9'], colors: ['Nude'], tags: ['bestseller'], image: IMG('strappy-block-heels') },
  { id: 'ti-08', slug: 'embellished-flat-sandals', name: 'Embellished Flat Sandals', category: 'Footwear', price: 999, originalPrice: 1299,
    description: 'Flat sandals with a jewelled strap — festive comfort for when heels aren\'t the move.',
    detail: 'Jewelled strap, cushioned sole.', fabric: 'Faux leather', fit: 'True to size',
    sizes: ['5', '6', '7', '8'], colors: ['Gold'], tags: ['sale'], image: IMG('embellished-flat-sandals') },
]

export const TRYITON_CATEGORIES = ['Jumpsuits', 'Dresses', 'Ethnic Fusion', 'Footwear'] as const

export const TRYITON_CAMPAIGN = {
  hero: '/tryiton/campaign/hero.jpg',
}

export const TRYITON_BRAND: ThemeBrand = {
  name: 'TRY IT ON',
  tagline: 'See it move before you buy.',
  slug: 'tryiton',
  currency: 'INR',
  categories: [...TRYITON_CATEGORIES],
  sellerId: null,
  description:
    'TRY IT ON is a normal catalog with one difference — every product page opens with your actual reel playing instead of a photo, so buyers see the drape and the movement before they decide.',
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
