// SAAJ — the live interactive demo of the "June" flagship theme.
// A fictional showcase brand ("One wedding. Six outfits. Zero panic.") — an
// Indian wedding/occasion-wear specialist for both the person shopping for
// themselves and for menswear (the series' first theme with a real,
// first-class menswear range). Festive jewel tones — magenta, antique gold,
// emerald, ivory — golden-hour warmth, fabric caught mid-motion. A different
// register from BLOOM's soft botanical calm or AUGUST's quiet neutral studio.
// Every component in src/components/saaj/ is written against
// ThemeProduct/ThemeBrand (src/lib/flagship/types.ts) — same contract as
// every other flagship theme. Signature AI mechanic: the Function Planner
// (see SaajFunctionPlanner.tsx) — a multi-step wizard that shortlists one
// outfit per wedding function (Mehendi/Sangeet/Haldi/Wedding/Reception)
// instead of a single quiz-to-capsule pass.

import type { ThemeProduct, ThemeBrand } from '@/lib/flagship/types'

export type SaajFunctionTag = 'mehendi' | 'sangeet' | 'haldi' | 'wedding' | 'reception'
export type SaajGenderTag = 'womens' | 'mens'

interface DemoProduct extends ThemeProduct {
  category: 'Lehengas' | 'Sarees' | 'Sherwanis & Kurtas' | 'Jewellery' | 'Footwear'
  detail: string
  fabric: string
  fit: string
  image: string
}

const IMG = (slug: string) => `/saaj/products/${slug}.jpg`

export const SAAJ_PRODUCTS: DemoProduct[] = [
  // ---- Lehengas (womenswear) ----
  { id: 'sj-01', slug: 'marigold-mehendi-lehenga', name: 'Marigold Mehendi Lehenga', category: 'Lehengas', price: 7999,
    description: 'A mustard-yellow georgette lehenga with hand-block floral print and a tasselled dupatta, built to move through a whole afternoon of mehendi dancing.',
    detail: 'Flared six-panel skirt, tasselled dupatta, elastic waist for all-day comfort.', fabric: 'Georgette with hand-block print', fit: 'True to size, flared silhouette',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Marigold Yellow'], tags: ['mehendi', 'womens', 'floral', 'bestseller'], image: IMG('marigold-mehendi-lehenga') },
  { id: 'sj-02', slug: 'rani-pink-sangeet-lehenga', name: 'Rani Pink Sangeet Lehenga', category: 'Lehengas', price: 12999,
    description: 'A rani-pink lehenga in mirror-work georgette, cut to catch the light on every twirl — built for a night of sangeet choreography.',
    detail: 'Mirror-work bodice, gota-trimmed hem, concealed back zip.', fabric: 'Georgette with mirror and gota work', fit: 'True to size, semi-flared',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Rani Pink'], tags: ['sangeet', 'womens', 'mirror-work', 'signature'], image: IMG('rani-pink-sangeet-lehenga') },
  { id: 'sj-03', slug: 'emerald-reception-lehenga', name: 'Emerald Reception Lehenga', category: 'Lehengas', price: 18999,
    originalPrice: 22999,
    description: 'A deep emerald lehenga in sequinned net over a satin base, the kind of shine built for reception portraits.',
    detail: 'Fully sequinned net overlay, satin lining, scalloped hem.', fabric: 'Sequinned net, satin lining', fit: 'True to size, structured flare',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Emerald'], tags: ['reception', 'womens', 'sequin', 'sale'], image: IMG('emerald-reception-lehenga') },
  { id: 'sj-04', slug: 'bridal-magenta-lehenga', name: 'Bridal Magenta Lehenga', category: 'Lehengas', price: 24999,
    description: 'A magenta bridal lehenga with hand-done zardozi and dabka embroidery across the bodice and hem — the centrepiece look of the whole wardrobe.',
    detail: 'Hand zardozi bodice, heavily embroidered hem, comes with a matching dupatta.', fabric: 'Raw silk with zardozi and dabka embroidery', fit: 'Made-to-measure feel, structured flare',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Magenta'], tags: ['wedding', 'womens', 'bridal', 'zardozi', 'signature'], image: IMG('bridal-magenta-lehenga') },

  // ---- Sarees (womenswear) ----
  { id: 'sj-05', slug: 'banarasi-silk-wedding-saree', name: 'Banarasi Silk Wedding Saree', category: 'Sarees', price: 15999,
    description: 'A red-and-gold Banarasi silk saree with a woven zari border, the traditional pick for the wedding ceremony itself.',
    detail: 'Woven zari border and pallu, comes with an unstitched matching blouse piece.', fabric: 'Pure Banarasi silk', fit: 'Free size, 6.3m with blouse piece',
    sizes: ['Free Size'], colors: ['Red & Gold'], tags: ['wedding', 'womens', 'silk', 'banarasi', 'bridal', 'bestseller'], image: IMG('banarasi-silk-wedding-saree') },
  { id: 'sj-06', slug: 'ivory-chiffon-reception-saree', name: 'Ivory Chiffon Reception Saree', category: 'Sarees', price: 10999,
    description: 'An ivory chiffon saree scattered with sequins, light enough to move in for a reception evening of photos and dancing.',
    detail: 'Scattered sequin work, satin-edged border, stitched fall.', fabric: 'Chiffon with sequin embellishment', fit: 'Free size, 5.5m with blouse piece',
    sizes: ['Free Size'], colors: ['Ivory'], tags: ['reception', 'womens', 'chiffon', 'new'], image: IMG('ivory-chiffon-reception-saree') },
  { id: 'sj-07', slug: 'haldi-yellow-organza-saree', name: 'Haldi Yellow Organza Saree', category: 'Sarees', price: 6999,
    description: 'A bright yellow organza saree with a delicate floral border, made for the turmeric and marigold energy of haldi morning.',
    detail: 'Floral-printed organza, contrast piped border, lightweight drape.', fabric: 'Organza with floral print', fit: 'Free size, 5.5m with blouse piece',
    sizes: ['Free Size'], colors: ['Haldi Yellow'], tags: ['haldi', 'womens', 'organza', 'floral'], image: IMG('haldi-yellow-organza-saree') },
  { id: 'sj-08', slug: 'sangeet-sequin-saree', name: 'Sangeet Sequin Saree', category: 'Sarees', price: 11999,
    description: 'A teal-to-emerald ombre saree in sequinned georgette, a saree that still holds its own on the sangeet dance floor.',
    detail: 'Ombre sequin georgette, pre-pleated for quick draping.', fabric: 'Sequinned georgette', fit: 'Free size, 5.5m with blouse piece',
    sizes: ['Free Size'], colors: ['Teal-Emerald Ombre'], tags: ['sangeet', 'womens', 'sequin'], image: IMG('sangeet-sequin-saree') },

  // ---- Sherwanis & Kurtas (menswear) ----
  { id: 'sj-09', slug: 'ivory-wedding-sherwani', name: 'Ivory Wedding Sherwani', category: 'Sherwanis & Kurtas', price: 16999,
    description: 'An ivory silk sherwani with gold thread embroidery down the placket, the groom\'s centrepiece for the wedding ceremony.',
    detail: 'Gold zari embroidery on placket and cuffs, comes with matching churidar and stole.', fabric: 'Silk blend with zari embroidery', fit: 'True to size, tailored through the chest',
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'], colors: ['Ivory & Gold'], tags: ['wedding', 'mens', 'sherwani', 'bridal', 'signature'], image: IMG('ivory-wedding-sherwani') },
  { id: 'sj-10', slug: 'emerald-bandhgala-sherwani', name: 'Emerald Bandhgala Sherwani', category: 'Sherwanis & Kurtas', price: 19999,
    description: 'A deep emerald velvet bandhgala with a structured collar, sharp enough for reception portraits under evening light.',
    detail: 'Structured bandhgala collar, velvet body, hand-finished buttons.', fabric: 'Velvet', fit: 'Tailored, structured shoulder',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Emerald'], tags: ['reception', 'mens', 'bandhgala', 'bestseller'], image: IMG('emerald-bandhgala-sherwani') },
  { id: 'sj-11', slug: 'mustard-haldi-kurta-set', name: 'Mustard Haldi Kurta Set', category: 'Sherwanis & Kurtas', price: 4999,
    description: 'A mustard cotton kurta-pyjama set, breathable and easy to move in through a haldi ceremony that gets messy on purpose.',
    detail: 'Straight-cut kurta, matching pyjama, side pockets.', fabric: '100% cotton', fit: 'True to size, relaxed',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Mustard'], tags: ['haldi', 'mens', 'kurta', 'new'], image: IMG('mustard-haldi-kurta-set') },
  { id: 'sj-12', slug: 'mehendi-print-kurta', name: 'Mehendi Print Kurta', category: 'Sherwanis & Kurtas', price: 5999,
    description: 'A pastel block-printed kurta over matching pants, casual enough for an afternoon of mehendi photos with cousins.',
    detail: 'Hand block print, mandarin collar, side slits.', fabric: 'Cotton blend', fit: 'True to size, straight fit',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Pastel Multi'], tags: ['mehendi', 'mens', 'kurta', 'floral'], image: IMG('mehendi-print-kurta') },
  { id: 'sj-13', slug: 'sangeet-nehru-jacket-set', name: 'Sangeet Nehru Jacket Set', category: 'Sherwanis & Kurtas', price: 8999,
    description: 'A magenta Nehru jacket over an ivory kurta, dressy enough to stand out in sangeet photos without weighing you down on the dance floor.',
    detail: 'Brocade Nehru jacket, ivory kurta and churidar included.', fabric: 'Brocade jacket, cotton-silk kurta', fit: 'True to size, tailored jacket',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Magenta & Ivory'], tags: ['sangeet', 'mens', 'nehru-jacket', 'signature'], image: IMG('sangeet-nehru-jacket-set') },

  // ---- Jewellery ----
  { id: 'sj-14', slug: 'kundan-bridal-choker-set', name: 'Kundan Bridal Choker Set', category: 'Jewellery', price: 13999,
    description: 'A gold-toned kundan choker with matching jhumka earrings and a maang tikka, the finishing layer for the bridal look.',
    detail: 'Choker, jhumka earrings, and maang tikka included.', fabric: 'Kundan and pearl on gold-toned alloy', fit: 'Adjustable thread closure',
    sizes: ['One Size'], colors: ['Gold & Pearl'], tags: ['wedding', 'womens', 'kundan', 'bridal', 'bestseller'], image: IMG('kundan-bridal-choker-set') },
  { id: 'sj-15', slug: 'temple-jhumka-earrings', name: 'Temple Jhumka Earrings', category: 'Jewellery', price: 4999,
    description: 'Gold-toned temple jhumkas with a fine pearl drop, dressy enough for sangeet or reception without overpowering the outfit.',
    detail: 'Antique gold finish, pearl drops, push-back closure.', fabric: 'Gold-plated alloy with pearl beads', fit: 'One size',
    sizes: ['One Size'], colors: ['Antique Gold'], tags: ['sangeet', 'reception', 'womens', 'jhumka', 'new'], image: IMG('temple-jhumka-earrings') },
  { id: 'sj-16', slug: 'grooms-kalgi-mala-set', name: "Groom's Kalgi & Mala Set", category: 'Jewellery', price: 6999,
    description: 'A turban kalgi brooch paired with a layered pearl-and-gold mala, the two pieces that finish a groom\'s wedding-day look.',
    detail: 'Kalgi brooch with pin backing, triple-layer mala.', fabric: 'Gold-plated alloy, faux pearls', fit: 'One size, adjustable mala length',
    sizes: ['One Size'], colors: ['Gold & Pearl'], tags: ['wedding', 'mens', 'kalgi', 'signature'], image: IMG('grooms-kalgi-mala-set') },

  // ---- Footwear ----
  { id: 'sj-17', slug: 'embroidered-mojari', name: "Men's Embroidered Mojari", category: 'Footwear', price: 3999,
    description: 'Hand-embroidered gold-thread mojaris in a comfortable cushioned sole, built to be worn from the mandap to the dance floor.',
    detail: 'Gold zari embroidery, cushioned footbed, slip-on style.', fabric: 'Velvet upper, rubber sole', fit: 'True to size',
    sizes: ['6', '7', '8', '9', '10', '11'], colors: ['Ivory & Gold'], tags: ['wedding', 'mens', 'mojari', 'bestseller'], image: IMG('embroidered-mojari') },
  { id: 'sj-18', slug: 'embellished-block-heels', name: "Women's Embellished Block Heels", category: 'Footwear', price: 5999,
    description: 'Magenta block heels with a hand-embellished strap, comfortable enough to dance in through a whole sangeet night.',
    detail: 'Hand-embellished strap, 2.5-inch block heel, cushioned insole.', fabric: 'Satin upper, block heel', fit: 'True to size',
    sizes: ['4', '5', '6', '7', '8'], colors: ['Magenta'], tags: ['sangeet', 'reception', 'womens', 'heels', 'new'], image: IMG('embellished-block-heels') },
]

export const SAAJ_CATEGORIES = ['Lehengas', 'Sarees', 'Sherwanis & Kurtas', 'Jewellery', 'Footwear'] as const

export const SAAJ_CAMPAIGN = {
  hero: '/saaj/campaign/hero.jpg',
  motionStudy: '/saaj/campaign/motion-study.jpg',
  texture: '/saaj/campaign/texture.jpg',
  stillLife: '/saaj/campaign/still-life.jpg',
  detail: '/saaj/campaign/detail.jpg',
  flatlayOutfit: '/saaj/campaign/flatlay-outfit.jpg',
}

export const SAAJ_BRAND: ThemeBrand = {
  name: 'SAAJ',
  tagline: 'One wedding. Six outfits. Zero panic.',
  slug: 'saaj',
  currency: 'INR',
  categories: [...SAAJ_CATEGORIES],
  sellerId: null,
  description:
    'SAAJ is a wedding and occasion-wear specialist for every function on the card — mehendi, sangeet, haldi, the wedding itself, and the reception — with real menswear alongside lehengas, sarees and jewellery, priced ₹3,999–₹24,999.',
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
