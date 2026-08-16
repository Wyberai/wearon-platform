// REEL RACK — first of three "Insta" flagship themes, built for sellers
// coming from a dedicated /insta landing page rather than the monthly
// gallery. Design direction: NOT an app-gimmick swipe feed — a clean,
// trustworthy, category-driven ecommerce grid (sale badges, wishlist,
// category nav) in the spirit of a serious ethnic/fashion boutique site,
// with the seller's own Reels playing natively on product cards and PDPs
// wherever a product has one (ThemeProduct.video), rather than the video
// being the entire mechanic.
//
// Distinct from the other two Insta themes by browsing pattern:
// category-first navigation (a left/top category rail) is the signature
// here, vs. The Grid's IG-square-tile browsing and Try It On's video-first PDP.

import type { ThemeProduct, ThemeBrand } from '@/lib/flagship/types'

export interface DemoProduct extends ThemeProduct {
  category: 'Kurta Sets' | 'Co-Ord Sets' | 'Dresses' | 'Sarees' | 'Accessories'
}

const IMG = (slug: string) => `/reelrack/products/${slug}.jpg`

export const REELRACK_PRODUCTS: DemoProduct[] = [
  { id: 'rr-01', slug: 'mustard-anarkali-kurta-set', name: 'Mustard Anarkali Kurta Set', category: 'Kurta Sets', price: 2499, originalPrice: 2999,
    description: 'A flowing anarkali kurta set in mustard, paired with matching palazzos and a printed dupatta.',
    detail: 'Flared anarkali silhouette, gotta-patti border, matching palazzo and dupatta.', fabric: 'Rayon', fit: 'Relaxed, true to size',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Mustard'], tags: ['bestseller'], image: IMG('mustard-anarkali-kurta-set') },
  { id: 'rr-02', slug: 'teal-straight-kurta-set', name: 'Teal Straight-Cut Kurta Set', category: 'Kurta Sets', price: 1899,
    description: 'A crisp straight-cut kurta in teal cotton with a contrast dupatta and straight pants.',
    detail: 'Mandarin collar, side slits, contrast dupatta border.', fabric: 'Pure cotton', fit: 'Straight, true to size',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Teal'], tags: ['new'], image: IMG('teal-straight-kurta-set') },
  { id: 'rr-03', slug: 'maroon-velvet-coord-set', name: 'Maroon Velvet Co-Ord Set', category: 'Co-Ord Sets', price: 3299,
    description: 'A festive co-ord set in maroon velvet — a fitted top and flared skirt, ready for the wedding season.',
    detail: 'Sweetheart neckline, flared skirt with pockets, concealed zip.', fabric: 'Velvet', fit: 'Fitted top, flared skirt',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Maroon'], tags: ['signature'], image: IMG('maroon-velvet-coord-set') },
  { id: 'rr-04', slug: 'sage-green-coord-set', name: 'Sage Green Co-Ord Set', category: 'Co-Ord Sets', price: 2199, originalPrice: 2699,
    description: 'A relaxed co-ord set in sage green — cropped shirt and wide-leg pants for easy, everyday styling.',
    detail: 'Cropped button-down shirt, wide-leg pants, elastic waist.', fabric: 'Linen blend', fit: 'Relaxed',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Sage Green'], tags: ['sale'], image: IMG('sage-green-coord-set') },
  { id: 'rr-05', slug: 'wine-wrap-midi-dress', name: 'Wine Wrap Midi Dress', category: 'Dresses', price: 2799,
    description: 'A wrap-style midi dress in wine crepe — flattering, easy to move in, dressed up or down.',
    detail: 'Surplice neckline, self-tie waist belt, midi length.', fabric: 'Crepe', fit: 'True to size, adjustable waist',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Wine'], tags: ['bestseller'], image: IMG('wine-wrap-midi-dress') },
  { id: 'rr-06', slug: 'floral-a-line-midi-dress', name: 'Floral A-Line Midi Dress', category: 'Dresses', price: 1999,
    description: 'A soft floral A-line dress in georgette — light enough for daytime, pretty enough for a lunch date.',
    detail: 'V-neck, A-line silhouette, midi length, lined.', fabric: 'Georgette', fit: 'A-line, true to size',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Floral Print'], tags: ['new'], image: IMG('floral-a-line-midi-dress') },
  { id: 'rr-07', slug: 'blush-organza-saree', name: 'Blush Organza Saree', category: 'Sarees', price: 3499,
    description: 'A blush organza saree with a delicate sequin border — light, romantic, easy to drape.',
    detail: 'Sequin-bordered pallu, comes with unstitched blouse piece.', fabric: 'Organza', fit: 'Free size, 6.3m with blouse piece',
    sizes: [], colors: ['Blush'], tags: ['signature'], image: IMG('blush-organza-saree') },
  { id: 'rr-08', slug: 'emerald-silk-saree', name: 'Emerald Silk Saree', category: 'Sarees', price: 4999, originalPrice: 5999,
    description: 'A rich emerald silk saree with a zari border — a festive staple that photographs beautifully on reels.',
    detail: 'Zari border and pallu, comes with unstitched blouse piece.', fabric: 'Silk blend', fit: 'Free size, 6.3m with blouse piece',
    sizes: [], colors: ['Emerald'], tags: ['sale'], image: IMG('emerald-silk-saree') },
  { id: 'rr-09', slug: 'gold-jhumka-earrings', name: 'Gold Jhumka Earrings', category: 'Accessories', price: 799,
    description: 'Classic gold-toned jhumka earrings — the finishing touch for any ethnic look.',
    detail: 'Lightweight, push-back closure.', fabric: 'Alloy, gold-plated', fit: 'One size',
    sizes: [], colors: ['Gold'], tags: ['bestseller'], image: IMG('gold-jhumka-earrings') },
  { id: 'rr-10', slug: 'kundan-choker-set', name: 'Kundan Choker Set', category: 'Accessories', price: 1499,
    description: 'A kundan-studded choker with matching earrings — bridal-party ready.',
    detail: 'Necklace + earring set, adjustable thread closure.', fabric: 'Alloy, kundan stones', fit: 'Adjustable',
    sizes: [], colors: ['Gold & White'], tags: ['new'], image: IMG('kundan-choker-set') },
]

export const REELRACK_CATEGORIES = ['Kurta Sets', 'Co-Ord Sets', 'Dresses', 'Sarees', 'Accessories'] as const

export const REELRACK_CAMPAIGN = {
  hero: '/reelrack/campaign/hero.jpg',
}

export const REELRACK_BRAND: ThemeBrand = {
  name: 'REEL RACK',
  tagline: 'Every reel, on the rack.',
  slug: 'reelrack',
  currency: 'INR',
  categories: [...REELRACK_CATEGORIES],
  sellerId: null,
  description:
    'REEL RACK turns the reels you already made into a real store — clean categories, sale pricing, wishlist, and every product plays your actual reel right on the card.',
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
