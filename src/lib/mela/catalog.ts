// MELA — the live interactive demo of the "April" flagship theme.
// A fictional showcase brand ("Every price is a starting price.") — loud,
// dense, bargain-bazaar marketplace energy (Sarojini Nagar / Colaba street-
// market), not a boutique. Budget Indian fast-fashion, INR 399-2499. The
// deliberate opposite of every quiet-luxury flagship before it: hot pink,
// marigold, turquoise, near-black ink — loud, not muted. Signature AI
// mechanic is "Make an Offer" (see MelaOfferBox.tsx), not a styling quiz.
// Every component in src/components/mela/ is written against
// ThemeProduct/ThemeBrand (src/lib/flagship/types.ts) — same contract as
// every other flagship theme — so a real seller who picks "April" gets the
// same components rendered with their own data. All imagery is locally
// generated (see scripts/generate-mela-assets.mjs).

import type { ThemeProduct, ThemeBrand } from '@/lib/flagship/types'

interface DemoProduct extends ThemeProduct {
  category: 'Kurtis' | 'Co-ord Sets' | 'Ethnic Sets' | 'Footwear' | 'Jewellery'
  detail: string
  fabric: string
  fit: string
  image: string
}

const IMG = (slug: string) => `/mela/products/${slug}.jpg`

export const MELA_PRODUCTS: DemoProduct[] = [
  // Kurtis
  { id: 'me-01', slug: 'rayon-solid-kurti', name: 'Rayon Solid Straight Kurti', category: 'Kurtis', price: 449,
    originalPrice: 699,
    description: 'Stall bestseller. Soft rayon, straight cut, zero ironing drama — the kurti that does Monday to shaadi season, no questions asked.',
    detail: 'Round neck, three-quarter sleeves, side slits, straight hem.', fabric: '100% rayon', fit: 'Regular fit, true to size',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Hot Pink', 'Turquoise', 'Marigold Yellow', 'Jet Black'], tags: ['bestseller', 'sale'], image: IMG('rayon-solid-kurti') },
  { id: 'me-02', slug: 'printed-a-line-kurti', name: 'Block-Print A-Line Kurti', category: 'Kurtis', price: 599,
    description: 'Hand-block print, loud pattern, quiet price. Buy two, wear it on repeat — nobody will notice, that’s the whole trick.',
    detail: 'A-line silhouette, mandarin collar, front button placket.', fabric: 'Cotton blend', fit: 'A-line, relaxed',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Marigold Print', 'Turquoise Print'], tags: ['new'], image: IMG('printed-a-line-kurti') },
  { id: 'me-03', slug: 'angrakha-wrap-kurti', name: 'Angrakha Wrap Kurti', category: 'Kurtis', price: 799,
    originalPrice: 999,
    description: 'Wrap-and-tie angrakha style — the front overlap that makes everyone ask where you got it stitched. You didn’t. It’s ₹799.',
    detail: 'Side tie-up closure, asymmetric hem, three-quarter sleeves.', fabric: 'Rayon-cotton blend', fit: 'True to size',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Hot Pink', 'Ink Black'], tags: ['bestseller'], image: IMG('angrakha-wrap-kurti') },
  { id: 'me-04', slug: 'chikankari-georgette-kurti', name: 'Chikankari Georgette Kurti', category: 'Kurtis', price: 1199,
    description: 'Lucknowi hand-embroidery on flowy georgette. This one’s the upgrade pick — still bazaar price, festival-ready finish.',
    detail: 'Chikankari embroidery throughout, cotton lining included, straight cut.', fabric: 'Georgette with cotton lining', fit: 'Regular',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Off-White', 'Turquoise'], tags: ['signature'], image: IMG('chikankari-georgette-kurti') },

  // Co-ord Sets
  { id: 'me-05', slug: 'floral-coord-set', name: 'Floral Print Co-ord Set', category: 'Co-ord Sets', price: 1099,
    originalPrice: 1499,
    description: 'Crop top plus palazzo, matched so you don’t have to think. Loud florals, real pockets — yes, actual pockets.',
    detail: 'Crop top with tie-back, elastic-waist palazzo pants.', fabric: 'Cotton-rayon blend', fit: 'Relaxed',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Marigold Floral', 'Turquoise Floral'], tags: ['bestseller', 'sale'], image: IMG('floral-coord-set') },
  { id: 'me-06', slug: 'ikat-print-coord-set', name: 'Ikat Print Co-ord Set', category: 'Co-ord Sets', price: 999,
    description: 'Ikat-print top and pants, cut from the same fabric roll so the match is never off. Grab it before the roll runs out.',
    detail: 'Straight-fit top, straight-leg pants, side pockets.', fabric: 'Cotton', fit: 'Regular',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Hot Pink Ikat'], tags: ['new'], image: IMG('ikat-print-coord-set') },
  { id: 'me-07', slug: 'tie-dye-coord-set', name: 'Tie-Dye Co-ord Set', category: 'Co-ord Sets', price: 899,
    description: 'No two pieces dye exactly the same — that’s the point. Tie-dye top, matching shorts, market-stall energy guaranteed.',
    detail: 'Round neck top, elastic-waist shorts.', fabric: 'Cotton', fit: 'Relaxed',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Turquoise Tie-Dye', 'Pink Tie-Dye'], tags: [], image: IMG('tie-dye-coord-set') },
  { id: 'me-08', slug: 'shrug-3pc-coord-set', name: 'Floral Shrug 3-Piece Set', category: 'Co-ord Sets', price: 1499,
    originalPrice: 1899,
    description: 'Cami, palazzo, and a shrug that ties the whole thing together — three pieces, one price, zero separate decisions.',
    detail: 'Cami top, palazzo pants, open-front shrug.', fabric: 'Rayon', fit: 'Relaxed',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Marigold Floral'], tags: ['signature'], image: IMG('shrug-3pc-coord-set') },

  // Ethnic Sets
  { id: 'me-09', slug: 'anarkali-3pc-set', name: 'Anarkali 3-Piece Set with Dupatta', category: 'Ethnic Sets', price: 1799,
    originalPrice: 2299,
    description: 'Full-flare Anarkali, matching bottom, dupatta included — the whole outfit in one box, no separate dupatta hunt required.',
    detail: 'Flared Anarkali kurta, churidar, net dupatta.', fabric: 'Rayon with net dupatta', fit: 'Regular',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Hot Pink', 'Turquoise'], tags: ['bestseller', 'sale'], image: IMG('anarkali-3pc-set') },
  { id: 'me-10', slug: 'sharara-set', name: 'Embroidered Sharara Set', category: 'Ethnic Sets', price: 2199,
    description: 'Flared sharara, embroidered kurti, dupatta — this is the one you save for the wedding invite you just got.',
    detail: 'Embroidered short kurti, flared sharara pants, dupatta.', fabric: 'Georgette', fit: 'Regular',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Marigold', 'Ink Black'], tags: ['signature'], image: IMG('sharara-set') },
  { id: 'me-11', slug: 'palazzo-suit-set', name: 'Printed Palazzo Suit Set', category: 'Ethnic Sets', price: 1399,
    description: 'Printed kurti and palazzo, stitched, ready to wear straight off the hanger — no tailor trip needed.',
    detail: 'Straight kurti, palazzo pants, dupatta included.', fabric: 'Cotton', fit: 'Regular',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Turquoise Print'], tags: ['new'], image: IMG('palazzo-suit-set') },
  { id: 'me-12', slug: 'rayon-kurta-pant-set', name: 'Rayon Kurta Set with Pants', category: 'Ethnic Sets', price: 1299,
    originalPrice: 1599,
    description: 'Solid kurta, matching pants, no dupatta drama — the set for days you want ethnic without the extra layer.',
    detail: 'Straight kurta, cigarette pants.', fabric: 'Rayon', fit: 'Regular',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Jet Black', 'Hot Pink'], tags: ['sale'], image: IMG('rayon-kurta-pant-set') },

  // Footwear
  { id: 'me-13', slug: 'mojari-juttis', name: 'Embroidered Mojari Juttis', category: 'Footwear', price: 499,
    description: 'Punjabi mojari with real thread embroidery — the shoe that finishes an ethnic outfit and survives a full wedding season.',
    detail: 'Flat sole, slip-on, embroidered upper.', fabric: 'Synthetic leather with thread work', fit: 'True to size',
    sizes: ['36', '37', '38', '39', '40', '41'], colors: ['Gold Embroidery', 'Silver Embroidery'], tags: ['bestseller'], image: IMG('mojari-juttis') },
  { id: 'me-14', slug: 'kolhapuri-chappals', name: 'Kolhapuri Chappals', category: 'Footwear', price: 399,
    originalPrice: 599,
    description: 'The original everyday sandal — flat, tough, goes with literally everything in this store. Stock up, they sell out fast.',
    detail: 'Handcrafted leather straps, flat sole.', fabric: 'Leather', fit: 'True to size',
    sizes: ['36', '37', '38', '39', '40'], colors: ['Tan', 'Ink Black'], tags: ['bestseller', 'sale'], image: IMG('kolhapuri-chappals') },
  { id: 'me-15', slug: 'block-heel-sandals', name: 'Turquoise Block Heel Sandals', category: 'Footwear', price: 799,
    description: 'Block heel, ankle strap, actually walkable — built for a full day at the mela, not just the photo.',
    detail: '2.5 inch block heel, buckle strap.', fabric: 'Synthetic leather', fit: 'True to size',
    sizes: ['36', '37', '38', '39', '40', '41'], colors: ['Turquoise', 'Marigold'], tags: ['new'], image: IMG('block-heel-sandals') },

  // Jewellery
  { id: 'me-16', slug: 'oxidised-jhumkas', name: 'Oxidised Silver Jhumkas', category: 'Jewellery', price: 399,
    description: 'Big jhumkas, real weight, the earring that does ninety percent of the outfit’s work for ten percent of the price.',
    detail: 'Oxidised finish, push-back closure.', fabric: 'Oxidised metal', fit: 'One size',
    sizes: [], colors: ['Oxidised Silver'], tags: ['bestseller'], image: IMG('oxidised-jhumkas') },
  { id: 'me-17', slug: 'kundan-choker-set', name: 'Kundan Choker Necklace Set', category: 'Jewellery', price: 899,
    originalPrice: 1299,
    description: 'Kundan choker with matching earrings — the set that turns any kurti into a function-ready look in ten seconds.',
    detail: 'Choker plus earrings, adjustable thread closure.', fabric: 'Kundan stones, alloy', fit: 'Adjustable',
    sizes: [], colors: ['Gold Tone'], tags: ['signature', 'sale'], image: IMG('kundan-choker-set') },
  { id: 'me-18', slug: 'glass-bangles-set', name: 'Glass Bangles Set (Dozen)', category: 'Jewellery', price: 399,
    description: 'A dozen glass bangles, mixed colours, the sound your wrist makes at every single family function from now on.',
    detail: 'Set of twelve, mixed hot pink, turquoise and marigold.', fabric: 'Glass', fit: 'Sized — 2.4 / 2.6 / 2.8',
    sizes: ['2.4', '2.6', '2.8'], colors: ['Mixed Bazaar Colours'], tags: ['new'], image: IMG('glass-bangles-set') },
]

export const MELA_CATEGORIES = ['Kurtis', 'Co-ord Sets', 'Ethnic Sets', 'Footwear', 'Jewellery'] as const

export const MELA_CAMPAIGN = {
  hero: '/mela/campaign/hero.jpg',
  rack: '/mela/campaign/rack.jpg',
  pile: '/mela/campaign/pile.jpg',
  jewelleryTable: '/mela/campaign/jewellery-table.jpg',
  footwearRow: '/mela/campaign/footwear-row.jpg',
}

export const MELA_BRAND: ThemeBrand = {
  name: 'MELA',
  tagline: 'Every price is a starting price.',
  slug: 'mela',
  currency: 'INR',
  categories: [...MELA_CATEGORIES],
  sellerId: null,
  description:
    'MELA is a loud, dense, bargain-bazaar storefront — Sarojini Nagar and Colaba street-market energy in eighteen pieces, ₹399 to ₹2499. Kurtis, co-ord sets, ethnic sets, footwear and jewellery, priced to move — and every price on the tag is just where the conversation starts. Make an offer, haggle it out, walk away with a deal.',
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
