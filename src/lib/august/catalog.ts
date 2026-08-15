// AUGUST — the live interactive demo of the "January" flagship theme.
// A fictional showcase brand ("Considered clothing, quietly intelligent.")
// used both to demonstrate the theme publicly (WearOn's own /themes gallery
// links here) and as sample data — every component in src/components/august/
// is written against ThemeProduct/ThemeBrand (src/lib/flagship/types.ts) so
// the exact same components also render a real seller's own store once they
// pick this theme, via the adapters in src/lib/flagship/adapters.ts. All
// imagery is locally generated (see scripts/generate-august-assets.mjs) so
// the demo has zero runtime dependency on external services.

import type { ThemeProduct, ThemeBrand } from '@/lib/flagship/types'

export type AugustProduct = ThemeProduct

interface DemoProduct extends ThemeProduct {
  category: 'Outerwear' | 'Tailoring' | 'Knitwear' | 'Essentials' | 'Accessories'
  detail: string
  fabric: string
  fit: string
  image: string
}

const IMG = (slug: string) => `/august/products/${slug}.jpg`

export const AUGUST_PRODUCTS: DemoProduct[] = [
  { id: 'aug-01', slug: 'overcoat', name: 'The Overcoat', category: 'Outerwear', price: 780,
    description: 'A single-breasted overcoat in wool-cashmere, cut long and lean.',
    detail: 'Notch lapel, horn buttons, welt chest pocket, besom hip pockets. Half-canvassed construction for a coat that moves with you rather than against you.',
    fabric: '80% wool, 20% cashmere', fit: 'True to size — runs long by design',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Camel', 'Charcoal'], tags: ['new', 'signature'], image: IMG('overcoat') },
  { id: 'aug-02', slug: 'field-jacket', name: 'The Field Jacket', category: 'Outerwear', price: 420,
    description: 'A waxed-cotton field jacket built for a decade of wear, not a season.',
    detail: 'Four flap pockets, corozo buttons, storm-proof waxed finish that re-waxes at home. Ages into its own patina.',
    fabric: '100% waxed organic cotton', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Olive', 'Black'], tags: ['bestseller'], image: IMG('field-jacket') },
  { id: 'aug-03', slug: 'trench', name: 'The Trench', category: 'Outerwear', price: 560,
    description: 'A cotton-linen trench with a soft, unstructured shoulder.',
    detail: 'Belted waist, storm flap, removable liner sold separately. Quietly does the work of three coats.',
    fabric: '70% cotton, 30% linen', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Stone', 'Ink'], tags: ['new'], image: IMG('trench') },
  { id: 'aug-04', slug: 'shearling-vest', name: 'The Shearling Vest', category: 'Outerwear', price: 495,
    description: 'A shearling-lined suede vest for the six weeks a year that need it.',
    detail: 'Full shearling lining, snap closure, welt pockets. Layers over everything in the collection.',
    fabric: 'Suede shell, shearling lining', fit: 'Runs true, size up for heavy layering',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Ecru'], tags: [], image: IMG('shearling-vest') },
  { id: 'aug-05', slug: 'tailored-blazer', name: 'The Tailored Blazer', category: 'Tailoring', price: 650,
    description: 'A wool crepe blazer with a soft shoulder and a quiet drape.',
    detail: 'Half-canvassed, horn buttons, single vent. Built to be worn open, not just on the hanger.',
    fabric: '100% wool crepe', fit: 'True to size — soft shoulder, no padding',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Ink Navy', 'Charcoal'], tags: ['signature'], image: IMG('tailored-blazer') },
  { id: 'aug-06', slug: 'wide-leg-trouser', name: 'The Wide-Leg Trouser', category: 'Tailoring', price: 340,
    description: 'A wool wide-leg trouser with a clean, single crease.',
    detail: 'Side-adjuster waist, no belt loops needed. Cut to break just once at the shoe.',
    fabric: '100% wool', fit: 'True to size, wide through the leg by design',
    sizes: ['26', '28', '30', '32', '34', '36'], colors: ['Graphite'], tags: [], image: IMG('wide-leg-trouser') },
  { id: 'aug-07', slug: 'pleated-trouser', name: 'The Pleated Trouser', category: 'Tailoring', price: 310,
    description: 'A tropical wool pleated trouser, lightweight enough for year-round wear.',
    detail: 'Double forward pleat, tapered leg, side-adjuster waist.',
    fabric: '100% tropical wool', fit: 'True to size',
    sizes: ['26', '28', '30', '32', '34', '36'], colors: ['Sand'], tags: ['new'], image: IMG('pleated-trouser') },
  { id: 'aug-08', slug: 'waistcoat', name: 'The Waistcoat', category: 'Tailoring', price: 280,
    description: 'A micro-check wool waistcoat, worn alone or under the blazer.',
    detail: 'Adjustable back strap, four welt pockets, satin back panel.',
    fabric: '95% wool, 5% silk', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Taupe'], tags: [], image: IMG('waistcoat') },
  { id: 'aug-09', slug: 'merino-crew', name: 'The Merino Crew', category: 'Knitwear', price: 220,
    description: 'A fine-gauge merino crewneck that layers under anything.',
    detail: '14-gauge knit, ribbed collar and cuffs. The everyday layer of the collection.',
    fabric: '100% extra-fine merino wool', fit: 'True to size, slim',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Oat', 'Black', 'Ink'], tags: ['bestseller'], image: IMG('merino-crew') },
  { id: 'aug-10', slug: 'cable-cardigan', name: 'The Cable Cardigan', category: 'Knitwear', price: 260,
    description: 'A chunky aran cardigan, hand-finished cable knit.',
    detail: 'Horn buttons, ribbed hem and cuffs, patch pockets.',
    fabric: '100% lambswool', fit: 'Relaxed — size down for a closer fit',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Ivory'], tags: ['new'], image: IMG('cable-cardigan') },
  { id: 'aug-11', slug: 'turtleneck', name: 'The Turtleneck', category: 'Knitwear', price: 195,
    originalPrice: 240,
    description: 'A silk-merino turtleneck, fine enough to wear under tailoring.',
    detail: '16-gauge knit blending silk for drape and merino for warmth.',
    fabric: '70% merino wool, 30% silk', fit: 'True to size, slim',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Black'], tags: ['sale'], image: IMG('turtleneck') },
  { id: 'aug-12', slug: 'half-zip', name: 'The Half-Zip', category: 'Knitwear', price: 230,
    description: 'A brushed wool half-zip, somewhere between a sweater and a jacket.',
    detail: 'Brass zip, ribbed collar, dropped shoulder seam for ease of movement.',
    fabric: '90% wool, 10% nylon', fit: 'Relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Clay'], tags: [], image: IMG('half-zip') },
  { id: 'aug-13', slug: 'oxford-shirt', name: 'The Oxford Shirt', category: 'Essentials', price: 165,
    description: 'A cotton oxford shirt, the one you reach for without thinking.',
    detail: 'Button-down collar, single-needle tailoring, mother-of-pearl buttons.',
    fabric: '100% cotton oxford', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['White', 'Sky Blue'], tags: ['bestseller'], image: IMG('oxford-shirt') },
  { id: 'aug-14', slug: 'band-collar-shirt', name: 'The Band-Collar Shirt', category: 'Essentials', price: 175,
    description: 'A washed cotton band-collar shirt with a quiet, modern collar.',
    detail: 'Garment-dyed for depth of color, coconut buttons, curved hem.',
    fabric: '100% washed cotton poplin', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Sage'], tags: ['new'], image: IMG('band-collar-shirt') },
  { id: 'aug-15', slug: 'straight-trouser', name: 'The Straight Trouser', category: 'Essentials', price: 190,
    description: 'A cotton twill trouser that works as hard as denim and looks better doing it.',
    detail: 'Straight leg, hidden elastic waistband panel for all-day comfort.',
    fabric: '98% cotton, 2% elastane', fit: 'True to size',
    sizes: ['26', '28', '30', '32', '34', '36'], colors: ['Khaki'], tags: [], image: IMG('straight-trouser') },
  { id: 'aug-16', slug: 'long-sleeve-tee', name: 'The Long-Sleeve Tee', category: 'Essentials', price: 95,
    description: 'A heavyweight cotton long-sleeve tee, built to outlast the rest of your drawer.',
    detail: '240gsm cotton jersey, reinforced collar seam.',
    fabric: '100% combed cotton', fit: 'True to size, slightly relaxed',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], colors: ['Bone', 'Black'], tags: ['bestseller'], image: IMG('long-sleeve-tee') },
  { id: 'aug-17', slug: 'leather-belt', name: 'The Leather Belt', category: 'Accessories', price: 145,
    description: 'A full-grain leather belt that will outlive the trousers it holds up.',
    detail: 'Brushed brass buckle, hand-cut edges, burnishes with age.',
    fabric: 'Full-grain leather', fit: 'True to waist size',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Cognac', 'Black'], tags: [], image: IMG('leather-belt') },
  { id: 'aug-18', slug: 'structured-tote', name: 'The Structured Tote', category: 'Accessories', price: 410,
    description: 'A structured leather tote, wide enough for a laptop, quiet enough for anywhere.',
    detail: 'Vegetable-tanned leather, magnetic top closure, interior zip pocket.',
    fabric: 'Full-grain vegetable-tanned leather', fit: 'One size',
    sizes: [], colors: ['Black', 'Cognac'], tags: ['signature'], image: IMG('structured-tote') },
]

export const AUGUST_CATEGORIES = ['Outerwear', 'Tailoring', 'Knitwear', 'Essentials', 'Accessories'] as const

export const AUGUST_CAMPAIGN = {
  hero: '/august/campaign/hero.jpg',
  fabricMacro: '/august/campaign/fabric-macro.jpg',
  stillLife: '/august/campaign/still-life.jpg',
  architecture: '/august/campaign/architecture.jpg',
  detail: '/august/campaign/detail.jpg',
  flatlayOutfit: '/august/campaign/flatlay-outfit.jpg',
}

export const AUGUST_BRAND: ThemeBrand = {
  name: 'AUGUST',
  tagline: 'Considered clothing. Quietly intelligent.',
  slug: 'august',
  currency: 'USD',
  categories: [...AUGUST_CATEGORIES],
  sellerId: null,
  description:
    'AUGUST is a single, considered collection — outerwear, tailoring and knitwear designed to be worn for a decade, not a season. No drops, no noise. Just the wardrobe, reasoned through.',
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
