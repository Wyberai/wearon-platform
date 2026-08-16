// DHAMAKA — the live interactive demo of the "August" flagship theme (theme
// #8 of 12, one bespoke theme per month). "Dhamaka" (धमाका) means a big
// bang/blast — already used informally by Indian ecommerce for mega-sale
// events (Big Billion Days, Meesho mega-sale energy). Numbers-forward,
// urgency-driven, loud — the deliberate opposite of BLOOM's quiet botanical
// calm. Budget fast-fashion, INR ₹299–₹1,999.
//
// Signature AI mechanic: Price Radar (see components/dhamaka/DhamakaPriceRadar.tsx).
// Every product carries a small simulated price-history dataset (~60 days,
// right here in the catalog) that a deterministic function reads to decide
// whether this is genuinely the best time to buy — a real scarcity/timing
// signal, distinct from every sibling theme's mechanic, and distinct from
// the fake countdown-clock trope this category usually leans on.
//
// Every component in src/components/dhamaka/ is written against
// ThemeProduct/ThemeBrand (src/lib/flagship/types.ts) — same contract as
// every other flagship theme.

import type { ThemeProduct, ThemeBrand } from '@/lib/flagship/types'

export interface PricePoint {
  date: string
  price: number
}

interface DemoProduct extends ThemeProduct {
  category: 'Tops' | 'Dresses' | 'Bottoms' | 'Footwear' | 'Accessories'
  detail: string
  fabric: string
  fit: string
  image: string
  priceHistory: PricePoint[]
}

const IMG = (slug: string) => `/dhamaka/products/${slug}.jpg`

// Fixed reference date (not Date.now()) so the ~60-day price history is
// identical on server render and client hydration — a live "today" would
// make the two disagree by however many milliseconds/days apart the two
// renders happen to land on.
const TODAY = new Date('2026-08-16T00:00:00Z').getTime()
const DAY_MS = 24 * 60 * 60 * 1000
// Denser sampling near "now" than 60 days back — mirrors how a real price
// tracker would log more recent checks than ancient history.
const DAYS_AGO = [58, 52, 46, 40, 34, 28, 23, 18, 14, 10, 7, 5, 3, 1, 0]

type PricePattern = 'lowest' | 'dropping' | 'rising' | 'stable'

// Builds a deterministic ~60-day price history ending at `currentPrice` —
// no Math.random anywhere, so the exact same array comes out of a
// production build every time. `pattern` just shapes the trajectory story
// (crashed to a floor / still sliding / crept back up / held steady);
// DhamakaPriceRadar's analyzePriceTrend() re-derives the label straight
// from the numbers, it never reads this pattern tag back out.
function buildHistory(currentPrice: number, pattern: PricePattern): PricePoint[] {
  const points: PricePoint[] = DAYS_AGO.map(daysAgo => {
    const t = (58 - daysAgo) / 58 // 0 at the oldest sample, 1 at "today"
    let raw: number
    if (pattern === 'lowest') {
      // Was noticeably higher, crashed down and is sitting at the floor now.
      raw = currentPrice * (1.32 - 0.32 * t)
    } else if (pattern === 'dropping') {
      // Gentle, still-in-progress slide — hasn't bottomed out yet.
      raw = currentPrice * (1.16 - 0.16 * t)
    } else if (pattern === 'rising') {
      // Was cheaper a few weeks back, has been creeping back up since.
      raw = currentPrice * (0.82 + 0.18 * t)
    } else {
      // Stable — small wobble around the same number, no real trend.
      raw = currentPrice * (1 + Math.sin(t * Math.PI * 2.4) * 0.025)
    }
    const price = Math.max(currentPrice - 400, Math.round(raw / 5) * 5)
    return { date: new Date(TODAY - daysAgo * DAY_MS).toISOString().slice(0, 10), price }
  })
  points[points.length - 1] = { ...points[points.length - 1], price: currentPrice }
  return points
}

export const DHAMAKA_PRODUCTS: DemoProduct[] = [
  { id: 'dh-01', slug: 'graphic-oversized-tee', name: 'Blast Graphic Oversized Tee', category: 'Tops', price: 399, originalPrice: 799,
    description: 'Was ₹799, now ₹399 — oversized fit, loud graphic print, the tee that starts every dhamaka haul.',
    detail: 'Drop-shoulder oversized fit, ribbed crew neck, bold front print.', fabric: '100% cotton, 180 GSM', fit: 'Oversized — size down for a fitted look',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Black', 'White'], tags: ['flash', 'bestseller'], image: IMG('graphic-oversized-tee'),
    priceHistory: buildHistory(399, 'lowest') },
  { id: 'dh-02', slug: 'ribbed-crop-top', name: 'Neon Ribbed Crop Top', category: 'Tops', price: 349, originalPrice: 699,
    description: 'Was ₹699, now ₹349 — stretch ribbed crop in a neon pop shade, built for a full flash-sale look.',
    detail: 'Fitted ribbed knit, round neck, cropped length.', fabric: '95% cotton, 5% spandex', fit: 'Fitted, true to size',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Neon Pink', 'Yellow'], tags: ['flash'], image: IMG('ribbed-crop-top'),
    priceHistory: buildHistory(349, 'dropping') },
  { id: 'dh-03', slug: 'boxy-printed-shirt', name: 'Boxy Printed Shirt', category: 'Tops', price: 599, originalPrice: 999,
    description: 'Was ₹999, now ₹599 — a boxy all-over print shirt loud enough to match the sale itself.',
    detail: 'Boxy relaxed fit, full button placket, all-over print.', fabric: '100% rayon', fit: 'Relaxed boxy fit',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Red Multi'], tags: ['new'], image: IMG('boxy-printed-shirt'),
    priceHistory: buildHistory(599, 'stable') },
  { id: 'dh-04', slug: 'basic-tank-2pack', name: 'Basic Tank 2-Pack', category: 'Tops', price: 299, originalPrice: 499,
    description: 'Was ₹499, now ₹299 for the pack — two everyday tanks, the cheapest way into the haul.',
    detail: 'Set of 2, scoop neck, fitted body.', fabric: '95% cotton, 5% elastane', fit: 'Fitted',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Black + White'], tags: ['bestseller'], image: IMG('basic-tank-2pack'),
    priceHistory: buildHistory(299, 'rising') },
  { id: 'dh-05', slug: 'bodycon-mini-dress', name: 'Bodycon Mini Dress', category: 'Dresses', price: 799, originalPrice: 1499,
    description: 'Was ₹1,499, now ₹799 — stretch bodycon mini built for one night and every story after it.',
    detail: 'Bodycon fit, square neck, stretch hem, mini length.', fabric: '92% polyester, 8% spandex', fit: 'Body-hugging, stretch fit',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Black', 'Red'], tags: ['flash', 'bestseller'], image: IMG('bodycon-mini-dress'),
    priceHistory: buildHistory(799, 'lowest') },
  { id: 'dh-06', slug: 'floral-wrap-dress', name: 'Floral Wrap Dress', category: 'Dresses', price: 899, originalPrice: 1799,
    description: 'Was ₹1,799, now ₹899 — a flowy wrap dress in a loud floral, half price while the blast lasts.',
    detail: 'Wrap tie waist, V-neck, flowy midi length.', fabric: '100% crepe polyester', fit: 'True to size, flowy',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Red Floral'], tags: ['new'], image: IMG('floral-wrap-dress'),
    priceHistory: buildHistory(899, 'dropping') },
  { id: 'dh-07', slug: 'coord-set-dress', name: 'Two-Piece Co-ord Set', category: 'Dresses', price: 1299, originalPrice: 1999,
    description: 'Was ₹1,999, now ₹1,299 — matching co-ord set, the whole outfit sorted in one add-to-bag.',
    detail: 'Cropped top + matching skirt, elastic waist.', fabric: '100% cotton blend', fit: 'True to size',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Yellow', 'Black'], tags: ['signature'], image: IMG('coord-set-dress'),
    priceHistory: buildHistory(1299, 'stable') },
  { id: 'dh-08', slug: 'high-rise-jeans', name: 'High-Rise Straight Jeans', category: 'Bottoms', price: 999, originalPrice: 1799,
    description: 'Was ₹1,799, now ₹999 — high-rise straight denim, the one pair that outlasts the sale.',
    detail: 'High rise, straight leg, five-pocket styling.', fabric: '98% cotton, 2% elastane', fit: 'True to size',
    sizes: ['26', '28', '30', '32', '34'], colors: ['Mid Blue'], tags: ['bestseller'], image: IMG('high-rise-jeans'),
    priceHistory: buildHistory(999, 'lowest') },
  { id: 'dh-09', slug: 'relaxed-joggers', name: 'Relaxed Fit Joggers', category: 'Bottoms', price: 699, originalPrice: 1299,
    description: 'Was ₹1,299, now ₹699 — relaxed jogger with a tapered cuff, comfort at blast pricing.',
    detail: 'Elastic drawstring waist, tapered cuff, side pockets.', fabric: '80% cotton, 20% polyester fleece', fit: 'Relaxed',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Grey Melange', 'Black'], tags: ['new'], image: IMG('relaxed-joggers'),
    priceHistory: buildHistory(699, 'rising') },
  { id: 'dh-10', slug: 'flowy-palazzo-pants', name: 'Flowy Palazzo Pants', category: 'Bottoms', price: 599, originalPrice: 999,
    description: 'Was ₹999, now ₹599 — wide-leg palazzo that moves as loud as the print on it.',
    detail: 'Elastic waist, wide flowy leg, ankle length.', fabric: '100% rayon', fit: 'Relaxed, flowy',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Yellow Print'], tags: ['flash'], image: IMG('flowy-palazzo-pants'),
    priceHistory: buildHistory(599, 'dropping') },
  { id: 'dh-11', slug: 'denim-shorts', name: 'Frayed Hem Denim Shorts', category: 'Bottoms', price: 499, originalPrice: 899,
    description: 'Was ₹899, now ₹499 — frayed hem denim shorts, a mega-sale staple every single season.',
    detail: 'Mid rise, frayed raw hem, classic five-pocket.', fabric: '99% cotton, 1% elastane', fit: 'True to size',
    sizes: ['26', '28', '30', '32'], colors: ['Light Wash'], tags: ['bestseller'], image: IMG('denim-shorts'),
    priceHistory: buildHistory(499, 'stable') },
  { id: 'dh-12', slug: 'chunky-sneakers', name: 'Chunky Street Sneakers', category: 'Footwear', price: 1499, originalPrice: 2499,
    description: 'Was ₹2,499, now ₹1,499 — chunky-sole sneakers, the biggest single discount in the whole blast.',
    detail: 'Thick lug sole, lace-up, padded ankle collar.', fabric: 'Synthetic upper, rubber sole', fit: 'True to size',
    sizes: ['6', '7', '8', '9', '10'], colors: ['White/Red'], tags: ['flash', 'signature'], image: IMG('chunky-sneakers'),
    priceHistory: buildHistory(1499, 'lowest') },
  { id: 'dh-13', slug: 'slide-sandals', name: 'Everyday Slide Sandals', category: 'Footwear', price: 399, originalPrice: 799,
    description: 'Was ₹799, now ₹399 — cushioned slides for the days between the going-out shoes.',
    detail: 'Cushioned footbed, adjustable strap, non-slip sole.', fabric: 'EVA + synthetic strap', fit: 'True to size',
    sizes: ['6', '7', '8', '9', '10'], colors: ['Black', 'Yellow'], tags: ['new'], image: IMG('slide-sandals'),
    priceHistory: buildHistory(399, 'rising') },
  { id: 'dh-14', slug: 'canvas-sneakers', name: 'Low-Top Canvas Sneakers', category: 'Footwear', price: 899, originalPrice: 1599,
    description: 'Was ₹1,599, now ₹899 — classic low-top canvas, goes with literally everything else in the haul.',
    detail: 'Lace-up, canvas upper, rubber cupsole.', fabric: 'Canvas upper, rubber sole', fit: 'True to size',
    sizes: ['6', '7', '8', '9', '10'], colors: ['White', 'Black'], tags: ['bestseller'], image: IMG('canvas-sneakers'),
    priceHistory: buildHistory(899, 'dropping') },
  { id: 'dh-15', slug: 'canvas-tote-bag', name: 'Big Print Canvas Tote', category: 'Accessories', price: 349, originalPrice: 699,
    description: 'Was ₹699, now ₹349 — oversized canvas tote, roomy enough for the entire dhamaka haul.',
    detail: 'Reinforced handles, internal slip pocket, oversized.', fabric: '100% canvas cotton', fit: 'One size',
    sizes: [], colors: ['Natural', 'Black'], tags: ['flash'], image: IMG('canvas-tote-bag'),
    priceHistory: buildHistory(349, 'stable') },
  { id: 'dh-16', slug: 'oversized-sunglasses', name: 'Oversized Statement Sunglasses', category: 'Accessories', price: 299, originalPrice: 599,
    description: 'Was ₹599, now ₹299 — oversized frames, UV400, the finishing flex on every look.',
    detail: 'UV400 protection, oversized frame, spring hinges.', fabric: 'Acetate frame, polycarbonate lens', fit: 'One size',
    sizes: [], colors: ['Black', 'Tortoise'], tags: ['bestseller'], image: IMG('oversized-sunglasses'),
    priceHistory: buildHistory(299, 'lowest') },
  { id: 'dh-17', slug: 'hair-clips-combo', name: 'Claw Clip Combo Set', category: 'Accessories', price: 299, originalPrice: 599,
    description: 'Was ₹599, now ₹299 for the set of 6 — claw clips in every shade you were about to buy separately anyway.',
    detail: 'Set of 6 claw clips, mixed sizes and finishes.', fabric: 'Acetate + matte metal', fit: 'One size',
    sizes: [], colors: ['Mixed'], tags: ['new'], image: IMG('hair-clips-combo'),
    priceHistory: buildHistory(299, 'rising') },
  { id: 'dh-18', slug: 'statement-belt', name: 'Wide Statement Belt', category: 'Accessories', price: 399, originalPrice: 799,
    description: 'Was ₹799, now ₹399 — a wide statement belt that turns any basic outfit into a dhamaka outfit.',
    detail: 'Wide width, oversized buckle, adjustable.', fabric: 'Faux leather', fit: 'Adjustable, one size',
    sizes: [], colors: ['Black', 'Red'], tags: ['flash'], image: IMG('statement-belt'),
    priceHistory: buildHistory(399, 'dropping') },
]

export const DHAMAKA_CATEGORIES = ['Tops', 'Dresses', 'Bottoms', 'Footwear', 'Accessories'] as const

export const DHAMAKA_CAMPAIGN = {
  hero: '/dhamaka/campaign/hero.jpg',
  saleWall: '/dhamaka/campaign/sale-wall.jpg',
  priceTagStack: '/dhamaka/campaign/price-tag-stack.jpg',
  flashDetail: '/dhamaka/campaign/flash-detail.jpg',
  haulFlatlay: '/dhamaka/campaign/haul-flatlay.jpg',
  texture: '/dhamaka/campaign/texture.jpg',
}

export const DHAMAKA_BRAND: ThemeBrand = {
  name: 'DHAMAKA',
  tagline: 'Ends when it ends.',
  slug: 'dhamaka',
  currency: 'INR',
  categories: [...DHAMAKA_CATEGORIES],
  sellerId: null,
  description:
    'DHAMAKA is the mega-sale that never quite has a closing date — budget fast-fashion at ₹299–₹1,999, tracked in real time by Price Radar so every "now ₹X" actually means something instead of a made-up countdown clock.',
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

// Price history lives on the DemoProduct, not the shared ThemeProduct shape
// (a real seller's product has no such dataset) — this helper reads it back
// off safely for any ThemeProduct that happens to be one of ours.
export function getPriceHistory(product: ThemeProduct): PricePoint[] | null {
  const withHistory = product as Partial<DemoProduct>
  return withHistory.priceHistory ?? null
}
