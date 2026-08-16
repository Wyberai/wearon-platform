// SCROLL — the live interactive demo of the "July" flagship theme ("theme
// #7" in the one-flagship-per-month series). The shopping paradigm here is
// literally the social-feed app itself: a stories bar of new-drop teasers
// above a single-column vertical feed of "posts" (one product per post —
// square photo, caption, like/comment counts, double-tap-to-like, DM-to-
// order). This is an ORIGINAL interface inspired by that genre of app — no
// real platform's name, logo, or trademarked gradient mark appears anywhere
// in copy or assets. Trendy Gen-Z pricing, Hinglish caption voice, authentic
// UGC/content-creator photography (mirror selfies, candid phone-camera
// shots) — the deliberate opposite of every other flagship theme's
// polished studio photography.
//
// Every component in src/components/scroll/ is written against
// ThemeProduct/ThemeBrand (src/lib/flagship/types.ts) — same contract as
// every other flagship theme.

import type { ThemeProduct, ThemeBrand } from '@/lib/flagship/types'

interface DemoProduct extends ThemeProduct {
  category: 'Tops' | 'Dresses' | 'Ethnic Fusion' | 'Accessories'
  detail: string
  fabric: string
  fit: string
  image: string
  /** Feed post caption — casual, punchy, Hinglish, line-broken like a real caption. Deliberately emoji-free. */
  caption: string
  likes: number
  comments: number
}

const IMG = (slug: string) => `/scroll/products/${slug}.jpg`
const STORY_IMG = (slug: string) => `/scroll/campaign/${slug}.jpg`

export const SCROLL_PRODUCTS: DemoProduct[] = [
  { id: 'sc-01', slug: 'boxy-crop-tee', name: 'Boxy Crop Tee', category: 'Tops', price: 649,
    description: 'A boxy cropped tee in ivory, heavyweight cotton, the kind you reach for on repeat.',
    detail: 'Dropped shoulder, boxy crop, ribbed neckline.', fabric: '100% heavyweight cotton', fit: 'Relaxed boxy fit',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Ivory'], tags: ['bestseller'], image: IMG('boxy-crop-tee'),
    caption: 'not me wearing this every single day\nbasic but make it iconic', likes: 2140, comments: 61 },
  { id: 'sc-02', slug: 'ruched-bodycon-cami', name: 'Ruched Bodycon Cami', category: 'Tops', price: 799,
    description: 'A ruched bodycon cami in black, stretch jersey that holds its shape all night.',
    detail: 'Side ruching, adjustable straps, bodycon fit.', fabric: '92% cotton, 8% elastane', fit: 'Bodycon, stretch',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Black'], tags: ['bestseller'], image: IMG('ruched-bodycon-cami'),
    caption: 'the fit that does all the talking\nzero effort, full attitude', likes: 3082, comments: 94 },
  { id: 'sc-03', slug: 'oversized-graphic-tee', name: 'Oversized Graphic Tee', category: 'Tops', price: 899,
    description: 'An oversized graphic tee in sand, garment-washed for that lived-in feel from day one.',
    detail: 'Drop shoulder, oversized fit, garment-washed print.', fabric: '100% combed cotton', fit: 'Oversized',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Sand'], tags: ['new'], image: IMG('oversized-graphic-tee'),
    caption: 'borrowed from no one, made for you\ncomfy over everything, always', likes: 1567, comments: 38 },
  { id: 'sc-04', slug: 'halter-neck-top', name: 'Halter Neck Top', category: 'Tops', price: 749,
    description: 'A halter neck top in coral, tie-back detail, built for golden hour photos.',
    detail: 'Tie-back halter neck, lined bodice.', fabric: '95% viscose, 5% elastane', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Coral'], tags: ['new'], image: IMG('halter-neck-top'),
    caption: 'coral season is not over, you heard it here\nyour camera roll will thank you', likes: 1888, comments: 52 },
  { id: 'sc-05', slug: 'puff-sleeve-blouse', name: 'Puff Sleeve Blouse', category: 'Tops', price: 1099,
    description: 'A puff sleeve blouse in butter yellow, the loudest colour in your closet and worth it.',
    detail: 'Balloon sleeve, elastic cuff, tie-neck.', fabric: '100% crepe', fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Butter Yellow'], tags: [], image: IMG('puff-sleeve-blouse'),
    caption: 'sunshine but make it wearable\nputting the rest of your closet on notice', likes: 1204, comments: 33 },
  { id: 'sc-06', slug: 'bodycon-mini-dress', name: 'Bodycon Mini Dress', category: 'Dresses', price: 1499,
    originalPrice: 1899,
    description: 'A bodycon mini dress in cherry red, one dress, zero decision fatigue.',
    detail: 'Square neck, back zip, stretch bodycon.', fabric: '90% polyester, 10% spandex', fit: 'Bodycon',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Cherry Red'], tags: ['sale', 'bestseller'], image: IMG('bodycon-mini-dress'),
    caption: 'the dress that ends the "what do I wear" debate\nred alert, in the best way', likes: 4210, comments: 118 },
  { id: 'sc-07', slug: 'coord-slip-dress', name: 'Co-ord Slip Dress', category: 'Dresses', price: 1799,
    description: 'A bias-cut slip dress in lilac, the simplest dress in your feed, doing the most work.',
    detail: 'Adjustable straps, bias-cut, midi length.', fabric: '100% satin', fit: 'True to size, fluid drape',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Lilac'], tags: ['new'], image: IMG('coord-slip-dress'),
    caption: 'slip dress, zero drama\njust vibes and good lighting', likes: 2765, comments: 71 },
  { id: 'sc-08', slug: 'wrap-dress', name: 'Wrap Dress', category: 'Dresses', price: 1699,
    description: 'A wrap dress in emerald, tie-waist silhouette that works from brunch to the club.',
    detail: 'Adjustable wrap tie, V-neck, midi length.', fabric: '100% crepe', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Emerald'], tags: ['bestseller'], image: IMG('wrap-dress'),
    caption: 'wrap it, tie it, own it\nemerald is doing the most and we love that', likes: 3390, comments: 88 },
  { id: 'sc-09', slug: 'denim-mini-dress', name: 'Denim Mini Dress', category: 'Dresses', price: 1599,
    description: 'A denim mini dress in mid-blue wash, your denim jacket got a serious glow up.',
    detail: 'Button-front, collared, mini length.', fabric: '100% cotton denim', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Blue Wash'], tags: ['new'], image: IMG('denim-mini-dress'),
    caption: "your denim jacket's glow up\nsame energy, way less effort", likes: 1932, comments: 47 },
  { id: 'sc-10', slug: 'corset-midi-dress', name: 'Corset Midi Dress', category: 'Dresses', price: 1999,
    description: 'A corset midi dress in black, structured bodice, soft-girl skirt, one whole mood.',
    detail: 'Boned corset bodice, flowing midi skirt.', fabric: '100% satin, structured lining', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Black'], tags: ['signature'], image: IMG('corset-midi-dress'),
    caption: "structured on the outside, soft girl on the inside\nthis one's a whole mood", likes: 2981, comments: 76 },
  { id: 'sc-11', slug: 'indo-western-kurti-set', name: 'Indo-Western Kurti Set', category: 'Ethnic Fusion', price: 1899,
    description: 'A mustard indo-western kurti set with a straight-cut jacket, desi core with a street edit.',
    detail: 'Straight kurti, attached jacket panel, straight pants.', fabric: '100% cotton blend', fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Mustard'], tags: ['bestseller'], image: IMG('indo-western-kurti-set'),
    caption: "desi core but make it street\nyour mom will approve, your feed will too", likes: 2450, comments: 69 },
  { id: 'sc-12', slug: 'ethnic-print-coord', name: 'Ethnic Print Co-ord', category: 'Ethnic Fusion', price: 2199,
    description: 'A rani pink ethnic print co-ord set, block print so loud it barely needs a caption.',
    detail: 'Crop top with tie-back, matching palazzo.', fabric: '100% cotton, block print', fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Rani Pink'], tags: ['new'], image: IMG('ethnic-print-coord'),
    caption: "print so loud it doesn't need a caption\n(writing one anyway)", likes: 1802, comments: 44 },
  { id: 'sc-13', slug: 'fusion-jacket-kurta', name: 'Fusion Jacket over Kurta', category: 'Ethnic Fusion', price: 2499,
    description: 'An indigo fusion jacket layered over a matching short kurta, a new layering personality.',
    detail: 'Structured open jacket, short kurta beneath.', fabric: '100% cotton twill', fit: 'Relaxed layered fit',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Indigo'], tags: ['signature'], image: IMG('fusion-jacket-kurta'),
    caption: 'layering szn just got an upgrade\nkurta plus jacket equals new personality unlocked', likes: 2117, comments: 55 },
  { id: 'sc-14', slug: 'bandhani-wrap-top', name: 'Bandhani Wrap Top', category: 'Ethnic Fusion', price: 999,
    description: 'A magenta bandhani wrap top, traditional tie-dye cut for absolutely any day of the week.',
    detail: 'Wrap-tie front, traditional bandhani print.', fabric: '100% cotton', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Magenta'], tags: ['new'], image: IMG('bandhani-wrap-top'),
    caption: "bandhani but make it everyday\nnani's fabric, gen z's fit", likes: 1655, comments: 41 },
  { id: 'sc-15', slug: 'chikankari-shirt-dress', name: 'Chikankari Shirt Dress', category: 'Ethnic Fusion', price: 1699,
    description: 'A white chikankari shirt dress, hand embroidery that ages like a favourite playlist.',
    detail: 'Hand chikankari embroidery, collared, belted.', fabric: '100% cotton voile', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['White'], tags: ['bestseller'], image: IMG('chikankari-shirt-dress'),
    caption: 'hand embroidery hits different\nthis one ages like a favourite playlist', likes: 2634, comments: 63 },
  { id: 'sc-16', slug: 'chunky-hoop-earrings', name: 'Chunky Hoop Earrings', category: 'Accessories', price: 499,
    description: 'Gold chunky hoop earrings, lightweight, the one accessory pulling overtime.',
    detail: 'Gold-plated brass, lightweight hollow hoop.', fabric: 'Gold-plated brass', fit: 'One size',
    sizes: [], colors: ['Gold'], tags: ['bestseller'], image: IMG('chunky-hoop-earrings'),
    caption: 'the only accessory doing overtime\nadd to cart before you overthink it', likes: 1329, comments: 27 },
  { id: 'sc-17', slug: 'mini-sling-bag', name: 'Mini Sling Bag', category: 'Accessories', price: 1299,
    description: 'A black mini sling bag, fits your phone, your cards, your whole personality.',
    detail: 'Adjustable strap, zip closure, interior card slot.', fabric: 'Vegan leather', fit: 'One size',
    sizes: [], colors: ['Black'], tags: ['new'], image: IMG('mini-sling-bag'),
    caption: 'fits your phone, your cards, your whole personality\nsmall bag, big main character energy', likes: 1740, comments: 35 },
  { id: 'sc-18', slug: 'layered-chain-necklace', name: 'Layered Chain Necklace', category: 'Accessories', price: 899,
    description: 'A silver layered chain necklace set, instant outfit upgrade, no styling skills required.',
    detail: 'Three-layer chain set, lobster clasp.', fabric: 'Silver-plated brass', fit: 'One size, adjustable',
    sizes: [], colors: ['Silver'], tags: [], image: IMG('layered-chain-necklace'),
    caption: 'layered necklace equals instant outfit upgrade\nno styling skills required', likes: 1091, comments: 24 },
]

export const SCROLL_CATEGORIES = ['Tops', 'Dresses', 'Ethnic Fusion', 'Accessories'] as const

// Stories bar data — each "story" is a new-drop/restock teaser that opens a
// fullscreen story-viewer overlay pointing at one real product's PDP.
export interface ScrollStory {
  id: string
  label: string
  image: string
  productSlug: string
}

export const SCROLL_STORIES: ScrollStory[] = [
  { id: 'st-01', label: 'New Drop', image: STORY_IMG('story-new-drop'), productSlug: 'boxy-crop-tee' },
  { id: 'st-02', label: 'Restock', image: STORY_IMG('story-restock'), productSlug: 'ruched-bodycon-cami' },
  { id: 'st-03', label: 'Ethnic Edit', image: STORY_IMG('story-ethnic-edit'), productSlug: 'indo-western-kurti-set' },
  { id: 'st-04', label: 'Flash Sale', image: STORY_IMG('story-flash-sale'), productSlug: 'bodycon-mini-dress' },
  { id: 'st-05', label: 'Accessorize', image: STORY_IMG('story-accessorize'), productSlug: 'mini-sling-bag' },
  { id: 'st-06', label: 'Behind Seams', image: STORY_IMG('story-behind-seams'), productSlug: 'chikankari-shirt-dress' },
  { id: 'st-07', label: 'Style Hack', image: STORY_IMG('story-style-hack'), productSlug: 'wrap-dress' },
]

export const SCROLL_CAMPAIGN = {
  storyNewDrop: STORY_IMG('story-new-drop'),
  storyRestock: STORY_IMG('story-restock'),
  storyEthnicEdit: STORY_IMG('story-ethnic-edit'),
  storyFlashSale: STORY_IMG('story-flash-sale'),
  storyAccessorize: STORY_IMG('story-accessorize'),
  storyBehindSeams: STORY_IMG('story-behind-seams'),
  storyStyleHack: STORY_IMG('story-style-hack'),
}

export const SCROLL_BRAND: ThemeBrand = {
  name: 'SCROLL',
  tagline: 'Shop like you scroll.',
  slug: 'scroll',
  currency: 'INR',
  categories: [...SCROLL_CATEGORIES],
  sellerId: null,
  description:
    'SCROLL is a feed-first storefront — stories, posts, double-tap-to-like, DM-to-order. Trendy Gen-Z pieces across tops, dresses, ethnic fusion and accessories, shot like your favourite creator shoots their outfit reels, not a studio campaign.',
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
