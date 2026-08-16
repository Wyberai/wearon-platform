// TAANA — the live interactive demo of the "May" flagship theme.
// "Taana" is the warp thread in handloom weaving — the fixed, foundational
// thread every weft crosses. Quiet-luxury Indian heritage handloom: the
// opposite energy of a bazaar. Editorial, slow, considered. Deep indigo,
// rust, antique gold, ivory. Every piece is tagged with a specific weaving
// technique and region — Banarasi, Kanjivaram, Ikat, Chanderi, Maheshwari,
// Jamdani, Bagh block-print — which power this theme's signature AI
// mechanic, "The Weaver's Note" (see TaanaWeaversNote.tsx): a short
// provenance/craft story generated per-product from those tags.
//
// Every component in src/components/taana/ is written against
// ThemeProduct/ThemeBrand (src/lib/flagship/types.ts) — same contract as
// every other flagship theme. `technique` and `region` are additive fields
// on top of ThemeProduct (optional there, so a real seller's own product —
// which won't have them — still satisfies the same component props; the
// Weaver's Note just falls back to a generic story in that case).

import type { ThemeProduct, ThemeBrand } from '@/lib/flagship/types'

export interface DemoProduct extends ThemeProduct {
  category: 'Sarees' | 'Kurta Sets' | 'Stoles & Dupattas' | 'Nehru Jackets' | 'Home Textiles'
  technique: string
  region: string
  detail: string
  fabric: string
  fit: string
  image: string
}

const IMG = (slug: string) => `/taana/products/${slug}.jpg`

export const TAANA_PRODUCTS: DemoProduct[] = [
  // Sarees
  { id: 'ta-01', slug: 'banarasi-silk-saree-indigo', name: 'The Indigo Banarasi Saree', category: 'Sarees', price: 18999,
    technique: 'Banarasi Brocade (Kadhwa)', region: 'Varanasi, Uttar Pradesh',
    description: 'A handwoven Banarasi silk saree in deep indigo, the zari brocade laid in by hand, one weft pick at a time.',
    detail: 'Kadhwa-technique zari brocade throughout, real zari border and pallu, comes with an unstitched blouse piece.', fabric: 'Pure Banarasi silk with real zari', fit: 'Free size, 6.3m with blouse piece',
    sizes: [], colors: ['Deep Indigo'], tags: ['signature', 'bestseller'], image: IMG('banarasi-silk-saree-indigo') },
  { id: 'ta-02', slug: 'kanjivaram-silk-saree-gold', name: 'The Antique Gold Kanjivaram', category: 'Sarees', price: 16499,
    technique: 'Kanjivaram Silk Weave', region: 'Kanchipuram, Tamil Nadu',
    description: 'A Kanjivaram silk saree woven on a pit loom in antique gold, the temple border interlocked thread by thread in the traditional korvai technique.',
    detail: 'Korvai-interlocked temple border, mulberry silk body with zari-shot pallu.', fabric: 'Pure mulberry silk with zari', fit: 'Free size, 6.3m with blouse piece',
    sizes: [], colors: ['Antique Gold'], tags: ['signature'], image: IMG('kanjivaram-silk-saree-gold') },
  { id: 'ta-03', slug: 'sambalpuri-ikat-saree-rust', name: 'The Rust Sambalpuri Ikat', category: 'Sarees', price: 8499,
    technique: 'Sambalpuri Double Ikat (Bandha)', region: 'Bargarh, Odisha',
    description: 'A Sambalpuri cotton saree in rust, warp and weft resist-dyed and tied separately before weaving so the pattern only resolves on the loom.',
    detail: 'Traditional rudraksha and conch-shell motifs, single-shuttle handloom weave.', fabric: 'Handloom cotton', fit: 'Free size, 6.1m with blouse piece',
    sizes: [], colors: ['Rust'], tags: ['bestseller'], image: IMG('sambalpuri-ikat-saree-rust') },
  { id: 'ta-04', slug: 'jamdani-cotton-saree-ivory', name: 'The Ivory Jamdani Saree', category: 'Sarees', price: 9999,
    technique: 'Jamdani (discontinuous supplementary weft)', region: 'Shantipur, West Bengal',
    description: 'A Jamdani cotton saree in ivory, its motifs hand-inlaid weft by weft with small bamboo sticks — a technique so fine it once wove for royal courts.',
    detail: 'Hand-inlaid floral butis on a fine cotton ground, sheer and lightweight.', fabric: 'Fine handloom cotton', fit: 'Free size, 5.8m with blouse piece',
    sizes: [], colors: ['Ivory'], tags: ['new'], image: IMG('jamdani-cotton-saree-ivory') },
  { id: 'ta-05', slug: 'chanderi-silk-cotton-saree-rose', name: 'The Dusty Rose Chanderi', category: 'Sarees', price: 7499,
    originalPrice: 9299,
    technique: 'Chanderi Silk-Cotton Weave', region: 'Chanderi, Madhya Pradesh',
    description: 'A Chanderi saree in dusty rose with a signature sheer, glossy hand, woven on traditional pit looms with fine silk-cotton yarn.',
    detail: 'Featherweight sheer weave, hand-butis in silver zari.', fabric: 'Chanderi silk-cotton blend', fit: 'Free size, 6m with blouse piece',
    sizes: [], colors: ['Dusty Rose'], tags: ['sale'], image: IMG('chanderi-silk-cotton-saree-rose') },

  // Kurta Sets
  { id: 'ta-06', slug: 'maheshwari-kurta-set-indigo', name: 'The Indigo Maheshwari Kurta Set', category: 'Kurta Sets', price: 6999,
    technique: 'Maheshwari Weave', region: 'Maheshwar, Madhya Pradesh',
    description: 'A kurta and palazzo set in indigo Maheshwari fabric, known for its reversible weave and the distinctive checks first designed for a queen’s court.',
    detail: 'Straight-cut kurta, matching palazzo, dupatta with the signature Maheshwari border.', fabric: 'Maheshwari silk-cotton', fit: 'Relaxed, true to size',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Indigo'], tags: ['signature'], image: IMG('maheshwari-kurta-set-indigo') },
  { id: 'ta-07', slug: 'pochampally-ikat-kurta-set-rust', name: 'The Rust Pochampally Ikat Set', category: 'Kurta Sets', price: 5499,
    technique: 'Pochampally Ikat', region: 'Bhoodan Pochampally, Telangana',
    description: 'A kurta set cut from Pochampally Ikat cotton in rust and ivory, the geometric diamonds emerging from yarn dyed before a single thread is set on the loom.',
    detail: 'A-line kurta with side slits, straight pants, matching dupatta.', fabric: 'Pochampally Ikat cotton', fit: 'Relaxed, true to size',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Rust & Ivory'], tags: ['bestseller'], image: IMG('pochampally-ikat-kurta-set-rust') },
  { id: 'ta-08', slug: 'chanderi-kurta-set-gold', name: 'The Antique Gold Chanderi Set', category: 'Kurta Sets', price: 6499,
    technique: 'Chanderi Silk-Cotton Weave', region: 'Chanderi, Madhya Pradesh',
    description: 'A sheer Chanderi kurta set in antique gold, its glossy hand catching the light the way only silk-cotton woven on a pit loom can.',
    detail: 'Straight kurta with an inner lining, matching pants, sheer Chanderi dupatta.', fabric: 'Chanderi silk-cotton with cotton lining', fit: 'Relaxed, true to size',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Antique Gold'], tags: ['new'], image: IMG('chanderi-kurta-set-gold') },
  { id: 'ta-09', slug: 'bagh-block-print-kurta-set-indigo', name: 'The Indigo Bagh Kurta Set', category: 'Kurta Sets', price: 4999,
    technique: 'Bagh Hand Block Print', region: 'Bagh, Madhya Pradesh',
    description: 'A kurta set in hand block-printed cotton, each repeat stamped by hand along the Bagh river’s mineral-rich waters that fix the indigo and rust dyes.',
    detail: 'Straight kurta, matching cotton pants, natural-dyed block print throughout.', fabric: 'Handloom cotton, natural dyes', fit: 'Relaxed, true to size',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Indigo & Rust'], tags: [], image: IMG('bagh-block-print-kurta-set-indigo') },

  // Stoles & Dupattas
  { id: 'ta-10', slug: 'banarasi-silk-stole-rust', name: 'The Rust Banarasi Tissue Stole', category: 'Stoles & Dupattas', price: 3999,
    technique: 'Banarasi Tissue Weave', region: 'Varanasi, Uttar Pradesh',
    description: 'A Banarasi tissue stole in rust, woven with a fine metallic weft that gives the silk its characteristic shimmer without a single printed thread.',
    detail: 'Fine zari border on both ends, lightweight tissue-silk drape.', fabric: 'Tissue silk with zari', fit: 'One size, 2.2m',
    sizes: [], colors: ['Rust'], tags: [], image: IMG('banarasi-silk-stole-rust') },
  { id: 'ta-11', slug: 'kota-doria-dupatta-ivory', name: 'The Ivory Kota Doria Dupatta', category: 'Stoles & Dupattas', price: 2999,
    technique: 'Kota Doria Weave', region: 'Kaithoon, Rajasthan',
    description: 'A Kota Doria dupatta in ivory, its signature khat (checks) formed by the alternating twist of cotton and silk yarn on a pit loom.',
    detail: 'Sheer, airy weave with a fine zari-edge border.', fabric: 'Kota Doria cotton-silk', fit: 'One size, 2.3m',
    sizes: [], colors: ['Ivory'], tags: ['bestseller'], image: IMG('kota-doria-dupatta-ivory') },
  { id: 'ta-12', slug: 'bagh-block-print-dupatta-indigo', name: 'The Indigo Bagh Dupatta', category: 'Stoles & Dupattas', price: 3499,
    technique: 'Bagh Hand Block Print', region: 'Bagh, Madhya Pradesh',
    description: 'A cotton dupatta hand block-printed with the Bagh workshop’s signature indigo and rust motifs, each repeat stamped and river-washed by hand.',
    detail: 'Dense sikki and paisley repeat, tasseled edges.', fabric: 'Handloom cotton, natural dyes', fit: 'One size, 2.4m',
    sizes: [], colors: ['Indigo'], tags: ['new'], image: IMG('bagh-block-print-dupatta-indigo') },

  // Nehru Jackets
  { id: 'ta-13', slug: 'jamdani-nehru-jacket-indigo', name: 'The Indigo Jamdani Nehru Jacket', category: 'Nehru Jackets', price: 8999,
    technique: 'Jamdani (discontinuous supplementary weft)', region: 'Shantipur, West Bengal',
    description: 'A Nehru jacket cut from indigo Jamdani cotton, its fine hand-inlaid motifs worked in on the loom rather than embroidered after the fact.',
    detail: 'Structured shoulder, five-button placket, fully lined.', fabric: 'Jamdani cotton, cotton lining', fit: 'Tailored, true to size',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Indigo'], tags: ['signature'], image: IMG('jamdani-nehru-jacket-indigo') },
  { id: 'ta-14', slug: 'pochampally-ikat-nehru-jacket-rust', name: 'The Rust Ikat Nehru Jacket', category: 'Nehru Jackets', price: 7499,
    technique: 'Pochampally Ikat', region: 'Bhoodan Pochampally, Telangana',
    description: 'A Nehru jacket in Pochampally Ikat, the geometric rust motifs already resolved in the dyed yarn before the fabric ever reached the loom.',
    detail: 'Slim structured cut, four-button placket, silk lining.', fabric: 'Pochampally Ikat cotton, silk lining', fit: 'Tailored, true to size',
    sizes: ['S', 'M', 'L', 'XL'], colors: ['Rust'], tags: [], image: IMG('pochampally-ikat-nehru-jacket-rust') },
  { id: 'ta-15', slug: 'chanderi-nehru-jacket-gold', name: 'The Antique Gold Chanderi Nehru Jacket', category: 'Nehru Jackets', price: 6999,
    originalPrice: 8499,
    technique: 'Chanderi Silk-Cotton Weave', region: 'Chanderi, Madhya Pradesh',
    description: 'A Nehru jacket in antique gold Chanderi, its glossy hand giving even a structured silhouette the fabric’s characteristic soft sheen.',
    detail: 'Structured shoulder, five-button placket, cotton lining.', fabric: 'Chanderi silk-cotton, cotton lining', fit: 'Tailored, true to size',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Antique Gold'], tags: ['sale'], image: IMG('chanderi-nehru-jacket-gold') },

  // Home Textiles
  { id: 'ta-16', slug: 'sambalpuri-ikat-cushion-set-rust', name: 'The Rust Ikat Cushion Cover Set', category: 'Home Textiles', price: 2999,
    technique: 'Sambalpuri Single Ikat (Bandha)', region: 'Bargarh, Odisha',
    description: 'A set of two cushion covers in rust Sambalpuri Ikat cotton, the resist-dyed yarn woven so the pattern aligns exactly at every seam.',
    detail: 'Set of two, 16x16in, concealed zip closure, traditional temple-motif border.', fabric: 'Handloom cotton', fit: 'Fits standard 16in inserts',
    sizes: [], colors: ['Rust'], tags: ['bestseller'], image: IMG('sambalpuri-ikat-cushion-set-rust') },
  { id: 'ta-17', slug: 'jamdani-table-runner-ivory', name: 'The Ivory Jamdani Table Runner', category: 'Home Textiles', price: 3499,
    technique: 'Jamdani (discontinuous supplementary weft)', region: 'Shantipur, West Bengal',
    description: 'A table runner in ivory Jamdani cotton, its fine inlaid motifs hand-worked by the same weavers who weave the sarees this technique is best known for.',
    detail: '14 x 72in, hand-inlaid floral repeat, fringed edges.', fabric: 'Fine handloom cotton', fit: 'One size',
    sizes: [], colors: ['Ivory'], tags: ['new'], image: IMG('jamdani-table-runner-ivory') },
  { id: 'ta-18', slug: 'kanjivaram-silk-throw-gold', name: 'The Antique Gold Kanjivaram Throw', category: 'Home Textiles', price: 5999,
    technique: 'Kanjivaram Silk Weave', region: 'Kanchipuram, Tamil Nadu',
    description: 'A silk throw woven by Kanjivaram saree weavers using the same korvai border technique, brought to a smaller, everyday scale for the home.',
    detail: '54 x 72in, korvai-interlocked border, mulberry silk with zari edge.', fabric: 'Pure mulberry silk with zari', fit: 'One size',
    sizes: [], colors: ['Antique Gold'], tags: ['signature'], image: IMG('kanjivaram-silk-throw-gold') },
]

export const TAANA_CATEGORIES = ['Sarees', 'Kurta Sets', 'Stoles & Dupattas', 'Nehru Jackets', 'Home Textiles'] as const

export const TAANA_CAMPAIGN = {
  hero: '/taana/campaign/hero.jpg',
  loomStudio: '/taana/campaign/loom-studio.jpg',
  weaveMacro: '/taana/campaign/weave-macro.jpg',
  artisanHands: '/taana/campaign/artisan-hands.jpg',
  indigoVat: '/taana/campaign/indigo-vat.jpg',
  stillLife: '/taana/campaign/still-life.jpg',
}

export const TAANA_BRAND: ThemeBrand = {
  name: 'TAANA',
  tagline: 'Every thread has a name.',
  slug: 'taana',
  currency: 'INR',
  categories: [...TAANA_CATEGORIES],
  sellerId: null,
  description:
    'TAANA is a considered edit of handloom sarees, kurta sets, stoles and home textiles from India’s weaving belts — Varanasi, Kanchipuram, Bargarh, Chanderi, Pochampally, Bagh. Every piece names its weave and its weavers’ region, because taana, the warp, is the thread every story is set against.',
}

// Renders "₹18,999" — Indian digit grouping, no decimals (whole-rupee pricing
// throughout this theme).
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
