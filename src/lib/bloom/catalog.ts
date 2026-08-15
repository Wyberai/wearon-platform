// BLOOM — the live interactive demo of the "March" flagship theme.
// A fictional showcase brand ("One capsule. Endless outfits.") — soft
// botanical, light-first, structured-but-airy linen and cotton separates
// designed to mix into a small capsule wardrobe. Light-first like January
// (AUGUST), but a warmer, softer, more playful palette and a completely
// different signature AI feature: Capsule Builder (pick a few pieces, see
// how many outfits they make, and what one more piece would unlock).
// Every component in src/components/bloom/ is written against
// ThemeProduct/ThemeBrand (src/lib/flagship/types.ts) — same contract as
// every other flagship theme.

import type { ThemeProduct, ThemeBrand } from '@/lib/flagship/types'

interface DemoProduct extends ThemeProduct {
  category: 'Tops' | 'Bottoms' | 'Dresses' | 'Layers' | 'Accessories'
  detail: string
  fabric: string
  fit: string
  image: string
}

const IMG = (slug: string) => `/bloom/products/${slug}.jpg`

export const BLOOM_PRODUCTS: DemoProduct[] = [
  { id: 'bl-01', slug: 'linen-wrap-top', name: 'The Linen Wrap Top', category: 'Tops', price: 95,
    description: 'A wrap top in washed linen, sage, that ties at the waist and goes with everything else in the capsule.',
    detail: 'Adjustable wrap tie, dropped shoulder, cropped length.', fabric: '100% washed linen', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Sage'], tags: ['signature', 'bestseller'], image: IMG('linen-wrap-top') },
  { id: 'bl-02', slug: 'poplin-blouse', name: 'The Poplin Blouse', category: 'Tops', price: 110,
    description: 'A cotton poplin blouse in cream with the softest puff sleeve, dressy enough alone, quiet enough to layer.',
    detail: 'Puff sleeve with elastic cuff, covered button placket.', fabric: '100% cotton poplin', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Cream'], tags: ['new'], image: IMG('poplin-blouse') },
  { id: 'bl-03', slug: 'rib-tank', name: 'The Rib Tank', category: 'Tops', price: 55,
    description: 'A fitted ribbed tank in blush, the quiet layer every capsule outfit needs underneath.',
    detail: 'Fine rib knit, scoop neck, fitted body.', fabric: '95% cotton, 5% elastane', fit: 'Fitted',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Blush', 'Cream'], tags: ['bestseller'], image: IMG('rib-tank') },
  { id: 'bl-04', slug: 'botanical-camisole', name: 'The Botanical Camisole', category: 'Tops', price: 120,
    originalPrice: 150,
    description: 'A silk camisole in a hand-painted botanical print, terracotta, for the days that call for a little more.',
    detail: 'Adjustable straps, bias-cut hem, exclusive print.', fabric: '100% silk', fit: 'True to size, fluid drape',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Terracotta Botanical'], tags: ['sale'], image: IMG('botanical-camisole') },
  { id: 'bl-05', slug: 'wide-leg-linen-pant', name: 'The Wide-Leg Linen Pant', category: 'Bottoms', price: 145,
    description: 'A wide-leg linen trouser in sage, cut to move in heat and hold its shape anyway.',
    detail: 'High rise, side-adjuster waist, wide leg with a soft break.', fabric: '100% linen', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Sage'], tags: ['signature'], image: IMG('wide-leg-linen-pant') },
  { id: 'bl-06', slug: 'pleated-midi-skirt', name: 'The Pleated Midi Skirt', category: 'Bottoms', price: 135,
    description: 'A pleated midi skirt in cream cotton poplin that catches the light with every step.',
    detail: 'Knife pleats throughout, elastic back waist, midi length.', fabric: '100% cotton poplin', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Cream'], tags: ['new'], image: IMG('pleated-midi-skirt') },
  { id: 'bl-07', slug: 'tailored-short', name: 'The Tailored Short', category: 'Bottoms', price: 95,
    description: 'A tailored short in terracotta twill, the trouser silhouette in warm-weather length.',
    detail: 'Front crease, side-adjuster waist, mid-thigh length.', fabric: '100% cotton twill', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Terracotta'], tags: [], image: IMG('tailored-short') },
  { id: 'bl-08', slug: 'cropped-trouser', name: 'The Cropped Trouser', category: 'Bottoms', price: 125,
    description: 'A cropped straight-leg trouser in blush, the one that works from the market to dinner.',
    detail: 'Ankle length, welt back pockets, straight leg.', fabric: '98% cotton, 2% elastane', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Blush'], tags: ['bestseller'], image: IMG('cropped-trouser') },
  { id: 'bl-09', slug: 'wrap-midi-dress', name: 'The Wrap Midi Dress', category: 'Dresses', price: 195,
    description: 'A wrap midi dress in a sage botanical print, the one dress the whole capsule was built around.',
    detail: 'Adjustable wrap tie, V-neck, midi length with movement.', fabric: '100% viscose', fit: 'True to size, fluid drape',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Sage Botanical'], tags: ['signature', 'bestseller'], image: IMG('wrap-midi-dress') },
  { id: 'bl-10', slug: 'poplin-shirtdress', name: 'The Poplin Shirtdress', category: 'Dresses', price: 175,
    description: 'A cotton poplin shirtdress in cream, belted, that reads dressed-up with zero effort.',
    detail: 'Covered placket, removable belt, side seam pockets.', fabric: '100% cotton poplin', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Cream'], tags: ['new'], image: IMG('poplin-shirtdress') },
  { id: 'bl-11', slug: 'slip-sundress', name: 'The Slip Sundress', category: 'Dresses', price: 145,
    originalPrice: 180,
    description: 'A bias-cut slip sundress in terracotta, the simplest possible dress done exactly right.',
    detail: 'Adjustable straps, bias-cut, midi length.', fabric: '100% cotton voile', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Terracotta'], tags: ['sale'], image: IMG('slip-sundress') },
  { id: 'bl-12', slug: 'linen-duster', name: 'The Linen Duster', category: 'Layers', price: 210,
    description: 'An unstructured linen duster in sage, long enough to layer over the whole capsule at once.',
    detail: 'Open front, no closure, patch pockets, floor-grazing length.', fabric: '100% linen', fit: 'Oversized',
    sizes: ['XS/S', 'M/L', 'XL'], colors: ['Sage'], tags: ['signature'], image: IMG('linen-duster') },
  { id: 'bl-13', slug: 'cropped-cardigan', name: 'The Cropped Cardigan', category: 'Layers', price: 115,
    description: 'A cropped cotton-knit cardigan in blush, the layer that finishes every combination.',
    detail: 'Horn buttons, ribbed hem and cuffs, cropped length.', fabric: '100% cotton', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Blush', 'Cream'], tags: ['bestseller'], image: IMG('cropped-cardigan') },
  { id: 'bl-14', slug: 'utility-vest', name: 'The Utility Vest', category: 'Layers', price: 105,
    description: 'A linen utility vest in cream, four pockets doing more work than most jackets.',
    detail: 'Four patch pockets, side tabs, relaxed fit.', fabric: '100% linen', fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Cream'], tags: ['new'], image: IMG('utility-vest') },
  { id: 'bl-15', slug: 'woven-tote', name: 'The Woven Tote', category: 'Accessories', price: 85,
    description: 'A natural raffia tote, roomy enough for the whole day, structured enough not to slouch.',
    detail: 'Interior zip pocket, reinforced handles, structured base.', fabric: 'Natural raffia', fit: 'One size',
    sizes: [], colors: ['Natural'], tags: ['bestseller'], image: IMG('woven-tote') },
  { id: 'bl-16', slug: 'wide-brim-hat', name: 'The Wide-Brim Hat', category: 'Accessories', price: 65,
    description: 'A cream straw hat with a brim wide enough to actually matter.',
    detail: 'Woven straw, grosgrain band, adjustable inner tie.', fabric: 'Straw', fit: 'One size',
    sizes: [], colors: ['Cream'], tags: ['new'], image: IMG('wide-brim-hat') },
  { id: 'bl-17', slug: 'knot-headband', name: 'The Knot Headband', category: 'Accessories', price: 35,
    description: 'A botanical-print knot headband, the fastest way to finish a look.',
    detail: 'Padded knot, elastic back, exclusive print.', fabric: '100% cotton', fit: 'One size',
    sizes: [], colors: ['Terracotta Botanical'], tags: [], image: IMG('knot-headband') },
  { id: 'bl-18', slug: 'leather-sandal', name: 'The Leather Sandal', category: 'Accessories', price: 145,
    description: 'A terracotta leather sandal, the shoe that works with every single piece in the capsule.',
    detail: 'Adjustable ankle strap, leather sole, block heel.', fabric: 'Full-grain leather', fit: 'True to size',
    sizes: ['36', '37', '38', '39', '40', '41'], colors: ['Terracotta'], tags: ['signature'], image: IMG('leather-sandal') },
]

export const BLOOM_CATEGORIES = ['Tops', 'Bottoms', 'Dresses', 'Layers', 'Accessories'] as const

export const BLOOM_CAMPAIGN = {
  hero: '/bloom/campaign/hero.jpg',
  botanicalStudy: '/bloom/campaign/botanical-study.jpg',
  texture: '/bloom/campaign/texture.jpg',
  stillLife: '/bloom/campaign/still-life.jpg',
  detail: '/bloom/campaign/detail.jpg',
  flatlayOutfit: '/bloom/campaign/flatlay-outfit.jpg',
}

export const BLOOM_BRAND: ThemeBrand = {
  name: 'BLOOM',
  tagline: 'One capsule. Endless outfits.',
  slug: 'bloom',
  currency: 'USD',
  categories: [...BLOOM_CATEGORIES],
  sellerId: null,
  description:
    'BLOOM is a small, considered capsule of linen and cotton separates in sage, cream, blush and terracotta — built so eighteen pieces make far more than eighteen outfits. No noise, just better math.',
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
