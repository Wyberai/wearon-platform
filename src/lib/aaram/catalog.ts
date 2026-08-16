// AARAM — the live interactive demo of the "September" flagship theme.
// A fictional showcase brand ("Dress for your day, not your calendar
// invite.") — cozy loungewear/WFH comfort specialist, budget-mid INR
// pricing, warm-clay/oat/sage palette, soft home-lifestyle photography.
// Part of the "one flagship theme per month" series, pivoted to an Indian
// Instagram/D2C-seller context — every theme here is INR-priced. Every
// component in src/components/aaram/ is written against ThemeProduct/
// ThemeBrand (src/lib/flagship/types.ts) — same contract as every other
// flagship theme — so a real seller who picks "September" gets the same
// components rendered with their own data. All imagery is locally
// generated (see scripts/generate-aaram-assets.mjs).
//
// Signature AI feature: "Day Match" — tap ONE day-type chip (WFH, Meeting
// day, Lazy Sunday, Running errands, Hosting) and get one AI-recommended
// outfit with a short comfort-vs-presentable reasoning sentence. A
// day-type/schedule mental model, distinct from Ember's mood/feeling axis
// even though the tap-a-chip UI shape rhymes with it.

import type { ThemeProduct, ThemeBrand } from '@/lib/flagship/types'

interface DemoProduct extends ThemeProduct {
  category: 'Loungewear' | 'Co-ord Sets' | 'Nightwear' | 'Home Slippers' | 'Comfort Basics'
  detail: string
  fabric: string
  fit: string
  image: string
}

const IMG = (slug: string) => `/aaram/products/${slug}.jpg`

export const AARAM_PRODUCTS: DemoProduct[] = [
  // Loungewear
  { id: 'ar-01', slug: 'clay-jogger', name: 'The Clay Jogger', category: 'Loungewear', price: 1299,
    description: 'A brushed French terry jogger in warm clay, soft enough for a Zoom-to-bed kind of day.',
    detail: 'Elastic waist with drawstring, tapered ankle, side pockets deep enough for your phone.',
    fabric: '95% cotton, 5% elastane French terry', fit: 'Relaxed, tapered',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Clay', 'Oat', 'Charcoal'], tags: ['bestseller', 'signature'], image: IMG('clay-jogger') },
  { id: 'ar-02', slug: 'oat-hoodie', name: 'The Oat Hoodie', category: 'Loungewear', price: 1599,
    description: 'A brushed-fleece pullover hoodie in oat, the one you reach for before you\'ve even opened your eyes properly.',
    detail: 'Kangaroo pocket, ribbed cuffs, roomy hood that doesn\'t squeeze.',
    fabric: '100% brushed cotton fleece', fit: 'Relaxed, oversized',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Oat', 'Sage'], tags: ['new'], image: IMG('oat-hoodie') },
  { id: 'ar-03', slug: 'weekend-oversized-tee', name: 'The Weekend Oversized Tee', category: 'Loungewear', price: 799,
    description: 'A washed-soft oversized tee that gets better every wash — equally at home under a blanket or over leggings.',
    detail: 'Dropped shoulder, wide neckline, boxy cropped-long length.',
    fabric: '100% combed cotton, garment-washed', fit: 'Oversized',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Oat', 'Dove Grey', 'Blush'], tags: ['bestseller'], image: IMG('weekend-oversized-tee') },
  { id: 'ar-04', slug: 'wrap-cardigan', name: 'The Wrap Cardigan', category: 'Loungewear', price: 1799,
    description: 'A soft-knit wrap cardigan in sage, thrown on over anything the moment the fan gets a little too honest.',
    detail: 'Self-tie waist, no buttons to fuss with, patch pockets.',
    fabric: '80% cotton, 20% acrylic knit', fit: 'Relaxed, throw-on',
    sizes: ['XS/S', 'M/L', 'XL'], colors: ['Sage', 'Oat'], tags: ['signature'], image: IMG('wrap-cardigan') },

  // Co-ord Sets
  { id: 'ar-05', slug: 'rib-knit-coord', name: 'The Rib-Knit Co-ord', category: 'Co-ord Sets', price: 1899,
    description: 'A ribbed knit tee-and-shorts co-ord in clay, matching enough to look intentional on a screen-share, comfortable enough that no one below the waist will ever know.',
    detail: 'Fitted rib tee, elastic-waist shorts with side pockets.',
    fabric: '95% cotton, 5% elastane rib knit', fit: 'True to size, stretch',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Clay', 'Charcoal'], tags: ['bestseller', 'signature'], image: IMG('rib-knit-coord') },
  { id: 'ar-06', slug: 'textured-co-ord', name: 'The Textured Lounge Co-ord', category: 'Co-ord Sets', price: 2099,
    description: 'A textured waffle-knit shirt and pant set in oat, dressy enough for a video call, soft enough that you\'ll want to nap in it right after.',
    detail: 'Relaxed shirt with full button placket, elastic-waist pants.',
    fabric: '100% waffle-knit cotton', fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Oat', 'Sage'], tags: ['new'], image: IMG('textured-co-ord') },
  { id: 'ar-07', slug: 'linen-blend-coord', name: 'The Linen-Blend Co-ord', category: 'Co-ord Sets', price: 2499,
    description: 'A linen-blend shirt set in soft charcoal, breathable enough for a Hyderabad afternoon, put-together enough for a client walking in unannounced.',
    detail: 'Camp collar shirt, elastic-and-drawstring pants, side pockets.',
    fabric: '55% linen, 45% cotton', fit: 'Relaxed',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Soft Charcoal', 'Oat'], tags: ['signature'], image: IMG('linen-blend-coord') },
  { id: 'ar-08', slug: 'terry-co-ord', name: 'The Terry Co-ord', category: 'Co-ord Sets', price: 1699,
    originalPrice: 1999,
    description: 'A toweling-soft terry set in blush, built for the days that don\'t leave the house at all.',
    detail: 'Relaxed short-sleeve top, elastic-waist shorts, both fully lined in terry.',
    fabric: '100% cotton terry', fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Blush', 'Oat'], tags: ['sale'], image: IMG('terry-co-ord') },

  // Nightwear
  { id: 'ar-09', slug: 'cloud-nightsuit', name: 'The Cloud Nightsuit', category: 'Nightwear', price: 1499,
    description: 'A modal nightsuit so soft it barely feels like fabric — the whole point of a good night\'s sleep, sorted.',
    detail: 'Notch-collar shirt, elastic-waist pants, mother-of-pearl-look buttons.',
    fabric: '95% modal, 5% elastane', fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Oat', 'Sage'], tags: ['bestseller', 'signature'], image: IMG('cloud-nightsuit') },
  { id: 'ar-10', slug: 'slip-nightdress', name: 'The Satin-Feel Slip Nightdress', category: 'Nightwear', price: 1299,
    description: 'A satin-feel slip nightdress in blush, cool against skin and just fancy enough for the nights that feel like they deserve it.',
    detail: 'Adjustable straps, midi length, side slit for ease of movement.',
    fabric: '100% satin-finish polyester', fit: 'True to size, fluid drape',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Blush', 'Charcoal'], tags: ['new'], image: IMG('slip-nightdress') },
  { id: 'ar-11', slug: 'printed-pyjama-set', name: 'The Printed Pyjama Set', category: 'Nightwear', price: 1099,
    description: 'A soft cotton pyjama set in a small sage print, the kind of unremarkable comfort you don\'t think about until 11pm.',
    detail: 'Notch-collar shirt with chest pocket, drawstring pants.',
    fabric: '100% cotton poplin', fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Sage Print', 'Oat Print'], tags: [], image: IMG('printed-pyjama-set') },
  { id: 'ar-12', slug: 'cotton-nighty', name: 'The Everyday Cotton Nighty', category: 'Nightwear', price: 899,
    description: 'A knee-length cotton nighty in dove grey, the reliable, un-fussy layer between you and sleep.',
    detail: 'Round neck, short sleeves, A-line cut for easy movement.',
    fabric: '100% cotton hosiery', fit: 'Relaxed, A-line',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Dove Grey', 'Oat'], tags: ['bestseller'], image: IMG('cotton-nighty') },

  // Home Slippers
  { id: 'ar-13', slug: 'plush-slide', name: 'The Plush Home Slide', category: 'Home Slippers', price: 599,
    description: 'A plush slide in oat, the first thing your feet want the second you\'re through the door.',
    detail: 'Cushioned footbed, wide strap, indoor non-slip sole.',
    fabric: 'Plush polyester upper, EVA sole', fit: 'True to size',
    sizes: ['S (5-6)', 'M (7-8)', 'L (9-10)'], colors: ['Oat', 'Charcoal'], tags: ['bestseller'], image: IMG('plush-slide') },
  { id: 'ar-14', slug: 'memory-foam-slipper', name: 'The Memory-Foam Slipper', category: 'Home Slippers', price: 799,
    description: 'A closed-back slipper in clay with a memory-foam footbed that quietly ends every "my feet hurt" conversation.',
    detail: 'Memory-foam insole, terry lining, non-slip textured sole.',
    fabric: 'Knit upper, memory-foam insole', fit: 'True to size',
    sizes: ['S (5-6)', 'M (7-8)', 'L (9-10)'], colors: ['Clay', 'Sage'], tags: ['signature'], image: IMG('memory-foam-slipper') },
  { id: 'ar-15', slug: 'cozy-bootie-slipper', name: 'The Cozy Bootie Slipper', category: 'Home Slippers', price: 999,
    description: 'An ankle-height bootie slipper in charcoal, fleece-lined for the mornings the floor is colder than the AC remote admits.',
    detail: 'Fleece lining, elastic ankle, rubberized sole for the balcony too.',
    fabric: 'Brushed knit upper, fleece lining', fit: 'True to size',
    sizes: ['S (5-6)', 'M (7-8)', 'L (9-10)'], colors: ['Charcoal', 'Oat'], tags: ['new'], image: IMG('cozy-bootie-slipper') },

  // Comfort Basics
  { id: 'ar-16', slug: 'everyday-bralette', name: 'The Everyday Bralette', category: 'Comfort Basics', price: 699,
    description: 'A wire-free bralette in sage, soft enough to forget you\'re wearing it by hour two.',
    detail: 'Wide elastic band, removable pads, racerback straps.',
    fabric: '90% cotton, 10% elastane', fit: 'True to size, stretch',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Sage', 'Oat', 'Blush'], tags: ['bestseller'], image: IMG('everyday-bralette') },
  { id: 'ar-17', slug: 'seamless-tank', name: 'The Seamless Tank', category: 'Comfort Basics', price: 649,
    description: 'A seamless tank in oat, the quiet layer that goes under the hoodie, under the co-ord, under everything.',
    detail: 'Seamless knit construction, scoop neck, fitted body.',
    fabric: '92% modal, 8% elastane', fit: 'Fitted',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Oat', 'Charcoal'], tags: [], image: IMG('seamless-tank') },
  { id: 'ar-18', slug: 'soft-leggings', name: 'The Soft-Rib Legging', category: 'Comfort Basics', price: 1199,
    description: 'A soft-rib legging in clay, forgiving at the waist and honestly better than most of what you already own for "pants."',
    detail: 'High-rise elastic waistband, four-way stretch, full length.',
    fabric: '85% cotton, 15% elastane rib knit', fit: 'High-rise, stretch',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Clay', 'Charcoal', 'Sage'], tags: ['bestseller', 'signature'], image: IMG('soft-leggings') },
]

export const AARAM_CATEGORIES = ['Loungewear', 'Co-ord Sets', 'Nightwear', 'Home Slippers', 'Comfort Basics'] as const

export const AARAM_CAMPAIGN = {
  hero: '/aaram/campaign/hero.jpg',
  homeStudy: '/aaram/campaign/home-study.jpg',
  texture: '/aaram/campaign/texture.jpg',
  stillLife: '/aaram/campaign/still-life.jpg',
  detail: '/aaram/campaign/detail.jpg',
  flatlayOutfit: '/aaram/campaign/flatlay-outfit.jpg',
}

export const AARAM_BRAND: ThemeBrand = {
  name: 'AARAM',
  tagline: 'Dress for your day, not your calendar invite.',
  slug: 'aaram',
  currency: 'INR',
  categories: [...AARAM_CATEGORIES],
  sellerId: null,
  description:
    'AARAM (आराम — comfort, rest) is unhurried loungewear and nightwear built for the Indian home: soft fabrics, forgiving fits, and clothes that let your day set the pace instead of the other way around. No aspirational glam, just genuine ease.',
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

// Signature AI feature: "Day Match" — pick the shape of your day, get one
// outfit and the comfort-vs-presentable reasoning behind it. A day-type/
// schedule mental model — distinct from Ember's mood/feeling axis even
// though the tap-a-chip interaction rhymes with it.
export const DAY_TYPES = [
  { key: 'wfh', label: 'WFH', emoji: '💻' },
  { key: 'meeting', label: 'Meeting Day', emoji: '🗓️' },
  { key: 'lazy-sunday', label: 'Lazy Sunday', emoji: '☁️' },
  { key: 'errands', label: 'Running Errands', emoji: '🧺' },
  { key: 'hosting', label: 'Hosting', emoji: '🫖' },
] as const
