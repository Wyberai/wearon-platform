// EMBER — the live interactive demo of the "February" flagship theme.
// A fictional showcase brand ("Dress by mood.") — bold, color-forward
// knitwear, loungewear and eveningwear, dark-first "glow" aesthetic. The
// deliberate opposite energy of January's AUGUST (quiet, neutral, light-
// first). Every component in src/components/ember/ is written against
// ThemeProduct/ThemeBrand (src/lib/flagship/types.ts) — same contract as
// every other flagship theme — so a real seller who picks "February" gets
// the same components rendered with their own data. All imagery is locally
// generated (see scripts/generate-ember-assets.mjs).

import type { ThemeProduct, ThemeBrand } from '@/lib/flagship/types'

interface DemoProduct extends ThemeProduct {
  category: 'Knitwear' | 'Loungewear' | 'Eveningwear' | 'Outerwear' | 'Accessories'
  detail: string
  fabric: string
  fit: string
  image: string
}

const IMG = (slug: string) => `/ember/products/${slug}.jpg`

export const EMBER_PRODUCTS: DemoProduct[] = [
  { id: 'emb-01', slug: 'flame-cardigan', name: 'The Flame Cardigan', category: 'Knitwear', price: 245,
    description: 'A chunky mohair-blend cardigan in a color that refuses to be ignored.',
    detail: 'Oversized fit, horn buttons, dropped shoulder. Built for layering over everything else in the closet.',
    fabric: '60% mohair, 40% wool', fit: 'Oversized — size down for a closer fit',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Burnt Orange', 'Charcoal'], tags: ['new', 'signature'], image: IMG('flame-cardigan') },
  { id: 'emb-02', slug: 'cobalt-turtleneck', name: 'The Cobalt Turtleneck', category: 'Knitwear', price: 155,
    description: 'A fine-ribbed merino turtleneck in a blue that photographs exactly as bold as it feels.',
    detail: '16-gauge knit, fitted through the body, ribbed collar and cuffs.',
    fabric: '100% merino wool', fit: 'True to size, fitted',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Cobalt'], tags: ['bestseller'], image: IMG('cobalt-turtleneck') },
  { id: 'emb-03', slug: 'fuchsia-crew', name: 'The Fuchsia Crew', category: 'Knitwear', price: 165,
    originalPrice: 210,
    description: 'A brushed wool crewneck in a fuchsia that owns every room it enters.',
    detail: 'Brushed for softness, ribbed hem, relaxed body.',
    fabric: '80% wool, 20% nylon', fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Fuchsia'], tags: ['sale'], image: IMG('fuchsia-crew') },
  { id: 'emb-04', slug: 'ember-vest', name: 'The Ember Vest', category: 'Knitwear', price: 135,
    description: 'A cable-knit sweater vest in rust, worn alone or layered under the trench.',
    detail: 'Hand-finished cable pattern, ribbed armholes, V-neck.',
    fabric: '100% lambswool', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Rust'], tags: [], image: IMG('ember-vest') },
  { id: 'emb-05', slug: 'velvet-track-pant', name: 'The Velvet Track Pant', category: 'Loungewear', price: 145,
    description: 'A crushed velvet jogger that upgrades "loungewear" without losing the comfort.',
    detail: 'Elastic waist with drawstring, tapered leg, side pockets.',
    fabric: '90% cotton velvet, 10% elastane', fit: 'Relaxed, tapered',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Deep Plum', 'Black'], tags: ['new'], image: IMG('velvet-track-pant') },
  { id: 'emb-06', slug: 'cloud-robe', name: 'The Cloud Robe', category: 'Loungewear', price: 195,
    description: 'A plush fleece robe in a chartreuse loud enough to wake you up properly.',
    detail: 'Shawl collar, deep patch pockets, self-tie belt.',
    fabric: '100% recycled polyester fleece', fit: 'One size, oversized',
    sizes: [], colors: ['Chartreuse'], tags: ['signature'], image: IMG('cloud-robe') },
  { id: 'emb-07', slug: 'silk-cami-set', name: 'The Silk Cami Set', category: 'Loungewear', price: 175,
    description: 'A silk cami and short set in cherry red, for the nights that deserve better fabric.',
    detail: 'Adjustable straps, lace trim, matching shorts with elastic waist.',
    fabric: '100% mulberry silk', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Cherry Red'], tags: ['new'], image: IMG('silk-cami-set') },
  { id: 'emb-08', slug: 'terry-hoodie', name: 'The Terry Hoodie', category: 'Loungewear', price: 135,
    description: 'A heavyweight terry hoodie in cobalt, the one you actually reach for.',
    detail: 'Kangaroo pocket, ribbed cuffs, drawcord hood.',
    fabric: '100% cotton terry', fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Cobalt', 'Black'], tags: ['bestseller'], image: IMG('terry-hoodie') },
  { id: 'emb-09', slug: 'slip-dress', name: 'The Slip Dress', category: 'Eveningwear', price: 285,
    description: 'A bias-cut satin slip dress in magenta, cut to move exactly as you do.',
    detail: 'Adjustable straps, side slit, bias-cut for a fluid drape.',
    fabric: '100% silk satin', fit: 'True to size, fluid drape',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Magenta', 'Black'], tags: ['signature'], image: IMG('slip-dress') },
  { id: 'emb-10', slug: 'sculpt-blazer-dress', name: 'The Sculpt Blazer Dress', category: 'Eveningwear', price: 325,
    description: 'A fitted blazer dress in emerald, structure with nowhere to hide.',
    detail: 'Peak lapel, single button, fully lined, thigh-high back vent.',
    fabric: '95% wool, 5% elastane', fit: 'Fitted through the waist',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Emerald'], tags: ['new'], image: IMG('sculpt-blazer-dress') },
  { id: 'emb-11', slug: 'halter-jumpsuit', name: 'The Halter Jumpsuit', category: 'Eveningwear', price: 295,
    description: 'A wide-leg halter jumpsuit in crimson, one piece that does the whole night.',
    detail: 'Halter neck tie, open back, wide palazzo leg.',
    fabric: '100% crepe', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Crimson'], tags: [], image: IMG('halter-jumpsuit') },
  { id: 'emb-12', slug: 'sequin-mini', name: 'The Sequin Mini', category: 'Eveningwear', price: 265,
    originalPrice: 340,
    description: 'A hand-sequined mini in gold, for the entrance you were planning anyway.',
    detail: 'Fully hand-sequined, stretch lining, invisible back zip.',
    fabric: 'Sequins on stretch mesh, poly lining', fit: 'Fitted',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Gold'], tags: ['sale'], image: IMG('sequin-mini') },
  { id: 'emb-13', slug: 'puffer-cape', name: 'The Puffer Cape', category: 'Outerwear', price: 315,
    description: 'An oversized puffer cape in tangerine — outerwear as a statement, not an afterthought.',
    detail: 'Cape silhouette with arm slits, snap closure, quilted channels.',
    fabric: '100% recycled nylon shell, down-alternative fill', fit: 'Oversized',
    sizes: ['S/M', 'L/XL'], colors: ['Tangerine'], tags: ['signature'], image: IMG('puffer-cape') },
  { id: 'emb-14', slug: 'shearling-bomber', name: 'The Shearling Bomber', category: 'Outerwear', price: 385,
    description: 'A cropped shearling bomber in rust, built to be the loudest thing in the room and the warmest.',
    detail: 'Full shearling lining, ribbed collar and cuffs, snap closure.',
    fabric: 'Suede shell, shearling lining', fit: 'Cropped, true to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Rust'], tags: ['new'], image: IMG('shearling-bomber') },
  { id: 'emb-15', slug: 'colorblock-trench', name: 'The Color-Block Trench', category: 'Outerwear', price: 265,
    description: 'A color-blocked trench in cobalt and fuchsia — quiet luxury\'s opposite, on purpose.',
    detail: 'Belted waist, storm flap, contrast-color panel construction.',
    fabric: '100% cotton gabardine', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Cobalt/Fuchsia'], tags: [], image: IMG('colorblock-trench') },
  { id: 'emb-16', slug: 'chain-belt', name: 'The Chain Belt', category: 'Accessories', price: 95,
    description: 'A chunky gold chain belt that turns any silhouette into an outfit.',
    detail: 'Adjustable length, lobster clasp, brass-plated chain.',
    fabric: 'Brass-plated metal', fit: 'Adjustable, one size',
    sizes: [], colors: ['Gold'], tags: ['bestseller'], image: IMG('chain-belt') },
  { id: 'emb-17', slug: 'beret', name: 'The Beret', category: 'Accessories', price: 65,
    description: 'A wool beret in cherry red — the fastest way to look like you tried harder than you did.',
    detail: 'Wool felt construction, adjustable inner band.',
    fabric: '100% wool felt', fit: 'One size',
    sizes: [], colors: ['Cherry Red'], tags: ['new'], image: IMG('beret') },
  { id: 'emb-18', slug: 'statement-hoop', name: 'The Statement Hoop', category: 'Accessories', price: 85,
    description: 'An oversized gold hoop, lightweight enough to actually wear all day.',
    detail: 'Gold-plated brass, hinged closure, hollow tube construction.',
    fabric: '18k gold-plated brass', fit: 'One size',
    sizes: [], colors: ['Gold'], tags: ['signature'], image: IMG('statement-hoop') },
]

export const EMBER_CATEGORIES = ['Knitwear', 'Loungewear', 'Eveningwear', 'Outerwear', 'Accessories'] as const

export const EMBER_CAMPAIGN = {
  hero: '/ember/campaign/hero.jpg',
  colorStudy: '/ember/campaign/color-study.jpg',
  texture: '/ember/campaign/texture.jpg',
  stillLife: '/ember/campaign/still-life.jpg',
  detail: '/ember/campaign/detail.jpg',
  flatlayOutfit: '/ember/campaign/flatlay-outfit.jpg',
}

export const EMBER_BRAND: ThemeBrand = {
  name: 'EMBER',
  tagline: 'Dress by mood.',
  slug: 'ember',
  currency: 'USD',
  categories: [...EMBER_CATEGORIES],
  sellerId: null,
  description:
    'EMBER is color-forward ready-to-wear for people who dress by how they feel, not what\'s "in." Bold knitwear, sensory loungewear and eveningwear that isn\'t afraid of a room. No neutrals unless you ask for them.',
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

// Signature AI feature: "Mood Match" — pick a mood, get an outfit. A distinct
// interaction pattern from January's freeform "Ask AUGUST" chat.
export const MOODS = [
  { key: 'bold', label: 'Bold', emoji: '🔥' },
  { key: 'cozy', label: 'Cozy', emoji: '🕯️' },
  { key: 'electric', label: 'Electric', emoji: '⚡' },
  { key: 'romantic', label: 'Romantic', emoji: '🌹' },
  { key: 'radiant', label: 'Radiant', emoji: '✨' },
] as const
