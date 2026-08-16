// GALLI — the live interactive demo of the "November" flagship theme.
// A fictional showcase brand ("Drops before you're ready.") — Gen-Z
// streetwear hype/drop culture, India edition. Loud, high-contrast, urban
// concrete-and-graffiti photography — the deliberate opposite energy of
// BLOOM's soft daylight botanicals and a louder, younger register than
// DHAMAKA's sale-poster energy or SCROLL's soft UGC candidness. Every
// component in src/components/galli/ is written against
// ThemeProduct/ThemeBrand (src/lib/flagship/types.ts) — same contract as
// every other flagship theme — so a real seller who picks "November" gets
// the same components rendered with their own data. All imagery is locally
// generated (see scripts/generate-galli-assets.mjs).

import type { ThemeProduct, ThemeBrand } from '@/lib/flagship/types'

interface DemoProduct extends ThemeProduct {
  category: 'Hoodies' | 'Oversized Tees' | 'Cargos' | 'Sneakers' | 'Caps'
  detail: string
  fabric: string
  fit: string
  image: string
  // Static fallback for the "Caption This Fit" AI mechanic — shown instantly
  // on product cards, and used on the PDP whenever the live AI caption call
  // fails or is still loading. Never leaves the page without a caption.
  caption: string
}

const IMG = (slug: string) => `/galli/products/${slug}.jpg`

export const GALLI_PRODUCTS: DemoProduct[] = [
  // ---- Hoodies ----
  { id: 'ga-01', slug: 'blacktop-hoodie', name: 'Blacktop Hoodie', category: 'Hoodies', price: 2799,
    description: 'Heavyweight fleece hoodie in jet black with a sleeve wordmark. Oversized, thoda extra, ekdum galli-approved.',
    detail: 'Dropped shoulder, kangaroo pocket, ribbed hem and cuffs, screen-print sleeve wordmark.', fabric: '380 GSM cotton fleece', fit: 'Oversized',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Blackout'], tags: ['signature', 'bestseller'],
    image: IMG('blacktop-hoodie'), caption: 'Blackout mode on — security bhi puchega yeh kaun hai.' },
  { id: 'ga-02', slug: 'static-neon-hoodie', name: 'Static Neon Hoodie', category: 'Hoodies', price: 3199,
    description: 'Near-black hoodie with neon green drawcords and trim — the kind of loud that photographs even louder.',
    detail: 'Neon drawcord and rib trim, dropped shoulder, oversized hood.', fabric: '380 GSM cotton fleece', fit: 'Oversized',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Blackout / Neon'], tags: ['new', 'signature'],
    image: IMG('static-neon-hoodie'), caption: 'Neon itna loud, DJ bhi mixer band kar de.' },
  { id: 'ga-03', slug: 'rust-riot-hoodie', name: 'Rust Riot Hoodie', category: 'Hoodies', price: 2999,
    description: 'Burnt-orange colorblock hoodie for the days you want to be seen from two gallis away.',
    detail: 'Colorblock front panel, raglan sleeve, dropped shoulder.', fabric: '360 GSM cotton fleece', fit: 'Oversized',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Rust / Black'], tags: ['new'],
    image: IMG('rust-riot-hoodie'), caption: 'Riot nahi, bas thoda sa rust ka drama hai.' },
  { id: 'ga-04', slug: 'ghost-logo-hoodie', name: 'Ghost Logo Hoodie', category: 'Hoodies', price: 3499,
    originalPrice: 3999,
    description: 'Tonal puff-print logo that only shows up under direct light — quiet flex, loud when it counts.',
    detail: 'Tonal puff-print chest logo, oversized hood, dropped shoulder.', fabric: '380 GSM cotton fleece', fit: 'Oversized',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Blackout'], tags: ['sale', 'bestseller'],
    image: IMG('ghost-logo-hoodie'), caption: 'Logo dikhta nahi, feel hota hai — ghost mode, bhai.' },

  // ---- Oversized Tees ----
  { id: 'ga-05', slug: 'galli-wordmark-tee', name: 'Galli Wordmark Tee', category: 'Oversized Tees', price: 999,
    description: 'A boxy, oversized tee with the GALLI wordmark stretched chest to chest. One tee, poori attitude.',
    detail: 'Drop-shoulder boxy fit, ribbed crew neck, chest wordmark print.', fabric: '220 GSM cotton jersey', fit: 'Oversized',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Blackout'], tags: ['bestseller', 'signature'],
    image: IMG('galli-wordmark-tee'), caption: 'Ek tee, poori galli ka pata bata degi.' },
  { id: 'ga-06', slug: 'static-noise-tee', name: 'Static Noise Tee', category: 'Oversized Tees', price: 1099,
    description: 'All-over static-noise print — like your TV lost signal and found drip instead.',
    detail: 'Drop-shoulder boxy fit, all-over sublimation print.', fabric: '220 GSM cotton jersey', fit: 'Oversized',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Static Grey'], tags: ['new'],
    image: IMG('static-noise-tee'), caption: 'TV ka static, ab teri body pe.' },
  { id: 'ga-07', slug: 'blank-canvas-tee', name: 'Blank Canvas Tee', category: 'Oversized Tees', price: 799,
    description: 'No print, no logo, just a heavyweight blank — for the fits that do the talking on their own.',
    detail: 'Drop-shoulder boxy fit, heavyweight jersey, no branding.', fabric: '240 GSM cotton jersey', fit: 'Oversized',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Blackout', 'Bone White'], tags: ['bestseller'],
    image: IMG('blank-canvas-tee'), caption: 'Blank hai upar se, drip hai andar se.' },
  { id: 'ga-08', slug: 'drop-zero-tee', name: 'Drop Zero Tee', category: 'Oversized Tees', price: 1199,
    originalPrice: 1499,
    description: 'The tee that started the drop calendar — back-print graphic, limited run, first of the series.',
    detail: 'Drop-shoulder boxy fit, oversized back-print graphic.', fabric: '220 GSM cotton jersey', fit: 'Oversized',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Blackout'], tags: ['sale', 'signature'],
    image: IMG('drop-zero-tee'), caption: 'Drop zero, hype hundred — simple hisaab.' },

  // ---- Cargos ----
  { id: 'ga-09', slug: 'combat-cargo-pants', name: 'Combat Cargo Pants', category: 'Cargos', price: 2199,
    description: 'Six-pocket relaxed cargo trousers built for the galli and the gig alike.',
    detail: 'Six utility pockets, elastic-and-drawcord waist, tapered leg.', fabric: 'Cotton ripstop', fit: 'Relaxed, tapered',
    sizes: ['28', '30', '32', '34', '36'], colors: ['Blackout'], tags: ['bestseller'],
    image: IMG('combat-cargo-pants'), caption: 'Pockets itne, phone dhoondhne mein hafta lag jaaye.' },
  { id: 'ga-10', slug: 'utility-six-pocket-cargo', name: 'Utility Six-Pocket Cargo', category: 'Cargos', price: 2399,
    description: 'The six-pocket cargo, upgraded — reinforced seams, adjustable ankle cuffs, zero excuses.',
    detail: 'Six pockets, adjustable ankle cuffs, reinforced knee panels.', fabric: 'Cotton ripstop', fit: 'Relaxed',
    sizes: ['28', '30', '32', '34', '36'], colors: ['Olive'], tags: ['new'],
    image: IMG('utility-six-pocket-cargo'), caption: 'Six pocket, zero excuses — sab kuch fit hoga.' },
  { id: 'ga-11', slug: 'track-cargo-joggers', name: 'Track Cargo Joggers', category: 'Cargos', price: 1999,
    description: 'Tapered joggers with cargo pockets — built to move, styled to stand still and look good doing it.',
    detail: 'Tapered leg, ribbed ankle cuff, side cargo pockets.', fabric: 'Cotton-poly fleece', fit: 'Tapered',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Blackout'], tags: ['bestseller'],
    image: IMG('track-cargo-joggers'), caption: 'Bhaagne ke liye nahi, dikhne ke liye bane hain.' },
  { id: 'ga-12', slug: 'reflective-cargo-shorts', name: 'Reflective Cargo Shorts', category: 'Cargos', price: 1799,
    description: 'Cargo shorts with reflective piping — catches every flash without needing a single filter.',
    detail: 'Reflective piping, four cargo pockets, elastic waist.', fabric: 'Cotton ripstop', fit: 'Relaxed',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Blackout / Reflective'], tags: ['new', 'signature'],
    image: IMG('reflective-cargo-shorts'), caption: 'Raat ko bhi spotlight, bina DJ ke.' },

  // ---- Sneakers ----
  { id: 'ga-13', slug: 'volt-high-tops', name: 'Volt High-Tops', category: 'Sneakers', price: 3499,
    description: 'Neon green high-top sneakers built to be the loudest thing in the fit, on purpose.',
    detail: 'Chunky rubber sole, padded collar, neon overlay panels.', fabric: 'Canvas upper, rubber sole', fit: 'True to size',
    sizes: ['6', '7', '8', '9', '10', '11'], colors: ['Volt Green / Black'], tags: ['signature', 'bestseller'],
    image: IMG('volt-high-tops'), caption: 'Charge full, mood bhi full — volt on kar.' },
  { id: 'ga-14', slug: 'concrete-runner', name: 'Concrete Runner', category: 'Sneakers', price: 2999,
    description: 'Grey-on-black chunky runners that make every pavement look like a ramp.',
    detail: 'Chunky midsole, mesh-and-suede upper, pull tab.', fabric: 'Mesh, suede, rubber sole', fit: 'True to size',
    sizes: ['6', '7', '8', '9', '10', '11'], colors: ['Concrete Grey'], tags: ['new'],
    image: IMG('concrete-runner'), caption: 'Concrete pe chalte chalte, ramp bana diya.' },
  { id: 'ga-15', slug: 'blackout-slip-on', name: 'Blackout Slip-On', category: 'Sneakers', price: 2799,
    description: 'All-black slip-ons — no laces, no drama, just step in and step out looking correct.',
    detail: 'Elastic gusset, no-lace slip-on, cushioned footbed.', fabric: 'Canvas upper, rubber sole', fit: 'True to size',
    sizes: ['6', '7', '8', '9', '10', '11'], colors: ['Blackout'], tags: ['bestseller'],
    image: IMG('blackout-slip-on'), caption: 'Laces ka jhanjhat nahi, seedha slip, seedha swag.' },

  // ---- Caps ----
  { id: 'ga-16', slug: 'corduroy-snap-cap', name: 'Corduroy Snap Cap', category: 'Caps', price: 899,
    description: 'A corduroy six-panel snapback that leans vintage but wears like today.',
    detail: 'Adjustable snapback closure, curved brim, embroidered eyelets.', fabric: 'Corduroy', fit: 'One size, adjustable',
    sizes: [], colors: ['Rust'], tags: ['bestseller'],
    image: IMG('corduroy-snap-cap'), caption: 'Cap seedhi nahi, thoda tilt maar — asli galli style.' },
  { id: 'ga-17', slug: 'neon-patch-cap', name: 'Neon Patch Cap', category: 'Caps', price: 799,
    description: 'Blackout dad-cap with a single neon patch — one hit of color, maximum attention.',
    detail: 'Adjustable strap closure, curved brim, rubber patch.', fabric: 'Cotton twill', fit: 'One size, adjustable',
    sizes: [], colors: ['Blackout / Neon'], tags: ['new', 'signature'],
    image: IMG('neon-patch-cap'), caption: 'Patch ek, attention sabki.' },
  { id: 'ga-18', slug: 'bucket-hat-blackout', name: 'Bucket Hat Blackout', category: 'Caps', price: 999,
    description: 'A reversible blackout bucket hat — two hats, one price, zero reasons to skip it.',
    detail: 'Reversible, stiffened brim, reinforced eyelets.', fabric: 'Cotton twill', fit: 'One size',
    sizes: [], colors: ['Blackout'], tags: ['bestseller'],
    image: IMG('bucket-hat-blackout'), caption: 'Bucket list mein sirf ek item — yeh hat.' },
]

export const GALLI_CATEGORIES = ['Hoodies', 'Oversized Tees', 'Cargos', 'Sneakers', 'Caps'] as const

export const GALLI_CAMPAIGN = {
  hero: '/galli/campaign/hero.jpg',
  alleyPortrait: '/galli/campaign/alley-portrait.jpg',
  graffitiTexture: '/galli/campaign/graffiti-texture.jpg',
  crateStillLife: '/galli/campaign/crate-still-life.jpg',
  detail: '/galli/campaign/detail.jpg',
  lineupFlatlay: '/galli/campaign/lineup-flatlay.jpg',
}

export const GALLI_BRAND: ThemeBrand = {
  name: 'GALLI',
  tagline: 'Drops before you’re ready.',
  slug: 'galli',
  currency: 'INR',
  categories: [...GALLI_CATEGORIES],
  sellerId: null,
  description:
    'GALLI is Gen-Z streetwear hype straight off the block — limited drops, waitlists, and meme energy, priced ₹799–₹3,499. No slow fashion. Just the next drop, and whether you were fast enough for it.',
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

// Static per-product meme caption lookup — used by GalliPDP/product cards as
// the instant + fallback path for "Caption This Fit" (see GalliPDP.tsx for
// the live-AI attempt that tries to beat this before falling back to it).
export function staticCaption(product: ThemeProduct): string {
  const match = GALLI_PRODUCTS.find(p => p.id === product.id)
  return match?.caption ?? 'Drip loading… caption abhi likha ja raha hai.'
}
