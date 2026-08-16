// UTSAV — the live interactive demo of the "October" flagship theme.
// A fictional showcase brand ("Tell us who. We'll find the gift.") — a
// Diwali/festival gifting specialist. Unlike every other flagship theme, the
// shopper here is buying FOR someone else, not for themselves — so this
// catalog carries extra recipient-matching metadata (giftKeywords, role)
// that the Gift Finder mechanic (src/components/utsav/UtsavGiftFinder.tsx)
// scores against a free-text description of the recipient. Every component
// in src/components/utsav/ is written against ThemeProduct/ThemeBrand
// (src/lib/flagship/types.ts) — same contract as every other flagship theme.

import type { ThemeProduct, ThemeBrand } from '@/lib/flagship/types'

export interface DemoProduct extends ThemeProduct {
  category: 'Gifting Sets' | 'Sarees & Kurtas' | 'Sweets & Hampers' | 'Jewellery' | 'Home Decor'
  detail: string
  fabric: string
  fit: string
  image: string
  // Gift Finder metadata — never shown in the UI, only used to score a
  // product against a free-text description of who the gift is for.
  giftKeywords: string[]
  // 'primary' = can anchor a gift bundle on its own (a garment, a big
  // hamper, a statement jewellery piece). 'addon' = a smaller complementary
  // item (sweets, small decor, small jewellery) the Gift Finder layers on
  // top of a primary pick when the budget allows.
  role: 'primary' | 'addon'
}

const IMG = (slug: string) => `/utsav/products/${slug}.jpg`

export const UTSAV_PRODUCTS: DemoProduct[] = [
  // ---------------------------------------------------------------- Gifting Sets
  { id: 'ut-01', slug: 'diwali-deluxe-hamper', name: 'The Diwali Deluxe Hamper', category: 'Gifting Sets', price: 4999,
    description: 'A generous all-in-one hamper — dry fruits, mithai, a brass diya pair and a silk stole, boxed in deep red and gold.',
    detail: 'Rigid gift box with ribbon and a card slot, hand-packed.', fabric: 'Mixed — silk stole, brass, boxed sweets', fit: 'One size',
    sizes: [], colors: ['Red & Gold'], tags: ['signature', 'bestseller'], image: IMG('diwali-deluxe-hamper'),
    giftKeywords: ['hamper', 'combo', 'premium', 'luxury', 'family', 'elder', 'traditional', 'parents', 'in-laws'], role: 'primary' },
  { id: 'ut-02', slug: 'family-gifting-box', name: 'The Family Gifting Box', category: 'Gifting Sets', price: 3499,
    description: 'A generous shared box built for a household — snacks, sweets and a set of tea-light holders for the whole family to enjoy together.',
    detail: 'Compartmentalised box, tea-lights included.', fabric: 'Mixed — ceramic, boxed snacks and sweets', fit: 'One size',
    sizes: [], colors: ['Marigold'], tags: ['bestseller'], image: IMG('family-gifting-box'),
    giftKeywords: ['family', 'combo', 'value', 'homemaker', 'everyone', 'household', 'aunty', 'uncle'], role: 'primary' },
  { id: 'ut-03', slug: 'corporate-diwali-gift-set', name: 'The Corporate Diwali Gift Set', category: 'Gifting Sets', price: 2999,
    description: 'A polished, professional gift box for colleagues and clients — premium mithai, dry fruits and a minimal gold-foil card.',
    detail: 'Understated matte box, no loud branding, corporate-safe.', fabric: 'Mixed — boxed sweets and dry fruits', fit: 'One size',
    sizes: [], colors: ['Deep Red'], tags: ['new'], image: IMG('corporate-diwali-gift-set'),
    giftKeywords: ['office', 'colleague', 'boss', 'client', 'corporate', 'professional', 'coworker', 'formal'], role: 'primary' },
  { id: 'ut-04', slug: 'mini-festive-box', name: 'The Mini Festive Box', category: 'Gifting Sets', price: 1299,
    description: 'A small, thoughtful festive box — enough sweetness and sparkle without the big price tag.',
    detail: 'Compact kraft-and-gold box, easy to carry or courier.', fabric: 'Mixed — boxed sweets, small diya', fit: 'One size',
    sizes: [], colors: ['Marigold'], tags: ['new'], image: IMG('mini-festive-box'),
    giftKeywords: ['budget', 'small', 'friend', 'token', 'simple', 'neighbour', 'classmate', 'affordable'], role: 'primary' },

  // ---------------------------------------------------------------- Sarees & Kurtas
  { id: 'ut-05', slug: 'banarasi-silk-saree', name: 'The Banarasi Silk Saree', category: 'Sarees & Kurtas', price: 4999,
    description: 'A deep red Banarasi silk saree with a woven gold zari border, the kind that’s handed down, not just worn once.',
    detail: 'Woven zari border and pallu, comes with an unstitched blouse piece.', fabric: '100% pure silk', fit: 'Free size (5.5m)',
    sizes: ['Free Size'], colors: ['Deep Red & Gold'], tags: ['signature', 'bestseller'], image: IMG('banarasi-silk-saree'),
    giftKeywords: ['saree', 'mother', 'mother-in-law', 'traditional', 'silk', 'elder', 'wedding', 'formal', 'grandmother'], role: 'primary' },
  { id: 'ut-06', slug: 'chanderi-cotton-saree', name: 'The Chanderi Cotton Saree', category: 'Sarees & Kurtas', price: 2999,
    description: 'A featherlight Chanderi cotton saree in gold, easy to drape and easy to wear the whole evening.',
    detail: 'Sheer zari-shot border, lightweight everyday-festive drape.', fabric: 'Chanderi cotton-silk blend', fit: 'Free size (5.5m)',
    sizes: ['Free Size'], colors: ['Gold'], tags: ['new'], image: IMG('chanderi-cotton-saree'),
    giftKeywords: ['saree', 'traditional', 'lightweight', 'daily', 'aunt', 'grandmother', 'mother', 'elder'], role: 'primary' },
  { id: 'ut-07', slug: 'mens-silk-kurta-set', name: "The Men's Silk Kurta Set", category: 'Sarees & Kurtas', price: 2499,
    description: 'A marigold-orange silk kurta and churidar set with a subtle gold thread border, sharp enough for pooja to party.',
    detail: 'Kurta, churidar and a matching stole, mandarin collar.', fabric: 'Art silk', fit: 'True to size',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Marigold Orange'], tags: ['bestseller'], image: IMG('mens-silk-kurta-set'),
    giftKeywords: ['kurta', 'father', 'husband', 'brother', 'men', 'formal', 'traditional', 'dad', 'son'], role: 'primary' },
  { id: 'ut-08', slug: 'womens-anarkali-kurta', name: "The Women's Anarkali Kurta", category: 'Sarees & Kurtas', price: 3299,
    originalPrice: 3899,
    description: 'A flared gold-and-red Anarkali kurta with mirror-work detailing, made for someone who likes to twirl into a room.',
    detail: 'Flared floor-grazing silhouette, mirror and thread embroidery.', fabric: 'Georgette with lining', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Red & Gold'], tags: ['sale'], image: IMG('womens-anarkali-kurta'),
    giftKeywords: ['kurta', 'anarkali', 'sister', 'friend', 'colorful', 'fun', 'young', 'modern', 'cousin', 'college'], role: 'primary' },

  // ---------------------------------------------------------------- Jewellery
  { id: 'ut-09', slug: 'kundan-choker-set', name: 'The Kundan Choker Set', category: 'Jewellery', price: 3999,
    description: 'A gold-toned Kundan choker with matching jhumkas, festive enough for a wedding, elegant enough for any Diwali evening.',
    detail: 'Choker, earrings and a tikka, comes in a velvet box.', fabric: 'Gold-plated brass, Kundan stones', fit: 'Adjustable',
    sizes: [], colors: ['Gold'], tags: ['signature'], image: IMG('kundan-choker-set'),
    giftKeywords: ['jewellery', 'necklace', 'wife', 'girlfriend', 'elegant', 'bridal', 'traditional', 'partner'], role: 'primary' },
  { id: 'ut-10', slug: 'jhumka-earrings', name: 'The Jhumka Earrings', category: 'Jewellery', price: 1599,
    description: 'Gold-plated jhumka earrings with tiny bells, the easy finishing touch on any festive outfit.',
    detail: 'Lightweight, push-back closure, gentle bell chime.', fabric: 'Gold-plated brass', fit: 'One size',
    sizes: [], colors: ['Gold'], tags: ['bestseller'], image: IMG('jhumka-earrings'),
    giftKeywords: ['earrings', 'jewellery', 'sister', 'friend', 'colorful', 'fun', 'young', 'fashionable', 'cousin'], role: 'addon' },
  { id: 'ut-11', slug: 'temple-necklace-set', name: 'The Temple Necklace Set', category: 'Jewellery', price: 5999,
    description: 'A traditional temple-motif necklace and earring set, the kind reserved for the most important pooja of the year.',
    detail: 'Temple motif pendants, matching jhumkas, boxed.', fabric: 'Gold-plated brass', fit: 'Adjustable',
    sizes: [], colors: ['Antique Gold'], tags: ['signature'], image: IMG('temple-necklace-set'),
    giftKeywords: ['jewellery', 'temple', 'traditional', 'mother', 'grandmother', 'elder', 'religious', 'pooja'], role: 'primary' },

  // ---------------------------------------------------------------- Home Decor
  { id: 'ut-12', slug: 'brass-diya-set', name: 'The Brass Diya Set', category: 'Home Decor', price: 1299,
    description: 'A set of twelve hand-cast brass diyas, the kind that get lit every single year and never go out of style.',
    detail: 'Set of 12, cotton wicks included.', fabric: 'Cast brass', fit: 'One size',
    sizes: [], colors: ['Antique Brass'], tags: ['bestseller'], image: IMG('brass-diya-set'),
    giftKeywords: ['diya', 'home', 'pooja', 'traditional', 'elder', 'decor', 'housewarming', 'parents'], role: 'addon' },
  { id: 'ut-13', slug: 'rangoli-stencil-candle-set', name: 'The Rangoli Stencil & Candle Set', category: 'Home Decor', price: 999,
    description: 'A reusable rangoli stencil kit with scented tea-light candles, for the friend who loves making the doorway pretty.',
    detail: '5 stencil designs, 12 tea-lights, coloured powders.', fabric: 'Mixed — steel stencils, wax candles', fit: 'One size',
    sizes: [], colors: ['Multicolour'], tags: ['new'], image: IMG('rangoli-stencil-candle-set'),
    giftKeywords: ['rangoli', 'candle', 'home', 'decor', 'friend', 'fun', 'creative', 'young', 'colorful'], role: 'addon' },
  { id: 'ut-14', slug: 'marigold-torans', name: 'Marigold Torans', category: 'Home Decor', price: 1499,
    description: 'A set of three artificial marigold door-hangings that look freshly strung all festive season, no wilting.',
    detail: 'Set of 3 torans, 3ft each, reusable.', fabric: 'Artificial silk marigold', fit: 'One size',
    sizes: [], colors: ['Marigold Orange'], tags: [], image: IMG('marigold-torans'),
    giftKeywords: ['toran', 'door', 'decor', 'home', 'traditional', 'housewarming', 'aunt', 'family'], role: 'addon' },

  // ---------------------------------------------------------------- Sweets & Hampers
  { id: 'ut-15', slug: 'premium-dryfruit-mithai-box', name: 'The Premium Dry Fruit & Mithai Box', category: 'Sweets & Hampers', price: 1499,
    description: 'A layered box of Kaju Katli, Soan Papdi and roasted almonds and cashews, the safe, always-loved gift.',
    detail: 'Two-tier box, 500g total, gold foil finish.', fabric: 'Boxed sweets and dry fruits', fit: 'One size',
    sizes: [], colors: ['Gold Box'], tags: ['bestseller'], image: IMG('premium-dryfruit-mithai-box'),
    giftKeywords: ['sweets', 'mithai', 'dry fruits', 'elder', 'premium', 'boss', 'colleague', 'parents'], role: 'addon' },
  { id: 'ut-16', slug: 'assorted-mithai-box', name: 'The Assorted Mithai Box', category: 'Sweets & Hampers', price: 999,
    description: 'A classic assorted mithai box — Motichoor Ladoo, Kaju Katli and Barfi, simple and always right.',
    detail: 'One-tier box, 400g total.', fabric: 'Boxed sweets', fit: 'One size',
    sizes: [], colors: ['Red Box'], tags: [], image: IMG('assorted-mithai-box'),
    giftKeywords: ['sweets', 'mithai', 'budget', 'friend', 'simple', 'classmate', 'neighbour'], role: 'addon' },
  { id: 'ut-17', slug: 'choco-diwali-fusion-hamper', name: 'The Choco-Diwali Fusion Hamper', category: 'Sweets & Hampers', price: 1799,
    description: 'A modern twist — chocolate-coated dry fruits and mithai truffles, for the friend who’d pick chocolate over ladoo any day.',
    detail: 'Assorted chocolate mithai fusion, 350g.', fabric: 'Boxed sweets', fit: 'One size',
    sizes: [], colors: ['Gold Box'], tags: ['new'], image: IMG('choco-diwali-fusion-hamper'),
    giftKeywords: ['chocolate', 'fusion', 'kids', 'young', 'modern', 'friend', 'cousin', 'college'], role: 'addon' },
  { id: 'ut-18', slug: 'nuts-namkeen-hamper', name: 'The Nuts & Namkeen Hamper', category: 'Sweets & Hampers', price: 1199,
    description: 'A savoury counterpart to all the sweetness — spiced nuts, namkeen mixes and roasted seeds in a festive tin.',
    detail: 'Reusable festive tin, 400g total.', fabric: 'Boxed savoury snacks', fit: 'One size',
    sizes: [], colors: ['Marigold Tin'], tags: [], image: IMG('nuts-namkeen-hamper'),
    giftKeywords: ['namkeen', 'snacks', 'savory', 'office', 'colleague', 'neighbour', 'boss', 'dad', 'uncle'], role: 'addon' },
]

export const UTSAV_CATEGORIES = ['Gifting Sets', 'Sarees & Kurtas', 'Sweets & Hampers', 'Jewellery', 'Home Decor'] as const

export const UTSAV_CAMPAIGN = {
  hero: '/utsav/campaign/hero.jpg',
  diyaSpread: '/utsav/campaign/diya-spread.jpg',
  marigoldDetail: '/utsav/campaign/marigold-detail.jpg',
  giftTable: '/utsav/campaign/gift-table.jpg',
  sareeDrape: '/utsav/campaign/saree-drape.jpg',
  rangoli: '/utsav/campaign/rangoli.jpg',
}

export const UTSAV_BRAND: ThemeBrand = {
  name: 'UTSAV',
  tagline: 'Tell us who. We’ll find the gift.',
  slug: 'utsav',
  currency: 'INR',
  categories: [...UTSAV_CATEGORIES],
  sellerId: null,
  description:
    'UTSAV is a Diwali and festival gifting specialist — sarees, kurtas, jewellery, sweets and home decor curated for the person you’re shopping for, not for yourself. Describe who it’s for, set a budget, and the Gift Finder builds the bundle and writes the card.',
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
