// KIRAYA — the live interactive demo of the "December" flagship theme.
// A fictional showcase brand ("Wear it once. Return it happy.") — the most
// structurally different theme of the twelve: a RENTAL marketplace, not a
// purchase marketplace. Premium occasion-wear (lehengas, sherwanis, sarees,
// designer gowns, jewellery) rented for a single event instead of bought
// outright. Every product carries a rentalPrice (what the renter pays) and a
// retailValue (the real boutique price, shown struck through, ~5-8x the
// rental price) so the savings framing is always visible.
//
// Signature AI mechanic — "Rent for the Date" (see KirayaRentForDate.tsx):
// the shopper picks their event date, the component derives a delivery →
// event → return window automatically, checks it against a small
// deterministic fake-booked-dates array per product (clustered around
// Indian wedding season, Nov 2026 – Feb 2027), and only once a valid date is
// chosen does the AI-generated pickup/return reminder + savings framing
// appear. Deep plum / antique gold / near-black palette — a calmer,
// dressing-room mood, distinct from SAAJ's wedding-shopper joy or TAANA's
// artisan quiet.
//
// Every component in src/components/kiraya/ is written against
// ThemeProduct/ThemeBrand (src/lib/flagship/types.ts) — same contract as
// every other flagship theme. KirayaProduct only ADDS fields on top; it is
// still structurally assignable to ThemeProduct[] wherever the shell,
// shop grid, PDP, and checkout expect the generic shape (so the same
// components also render a real seller's own catalog, just without the
// rental extras — see rentalFieldsOf() in KirayaRentForDate.tsx for the
// fallback behaviour when those extra fields are absent).

import type { ThemeProduct, ThemeBrand } from '@/lib/flagship/types'

export type KirayaCategory = 'Lehengas' | 'Sherwanis' | 'Sarees' | 'Designer Gowns' | 'Jewellery'

export interface KirayaProduct extends ThemeProduct {
  category: KirayaCategory
  detail: string
  fabric: string
  fit: string
  image: string
  /** What the renter pays for one event — this is ThemeProduct.price. */
  rentalPrice: number
  /** The boutique's real retail price — shown struck through as the savings anchor. */
  retailValue: number
  /** Deterministic fake "already booked" single days (ISO yyyy-mm-dd), clustered
   *  around Indian wedding season — powers the availability check in the
   *  Rent for the Date mechanic. Not randomised, so demos are reproducible. */
  fakeBookedDates: string[]
}

const IMG = (slug: string) => `/kiraya/products/${slug}.jpg`

export const KIRAYA_PRODUCTS: KirayaProduct[] = [
  // ---------------------------------------------------------------- Lehengas
  { id: 'ki-01', slug: 'royal-plum-silk-lehenga', name: 'The Royal Plum Silk Lehenga', category: 'Lehengas',
    price: 4499, originalPrice: 28999, rentalPrice: 4499, retailValue: 28999,
    description: 'A deep plum raw-silk lehenga with hand-embroidered antique gold zari work, worn once by its last renter and restored to first-night condition.',
    detail: 'Heavy zari border, hand-cut mirror inlay on the choli, fully lined for structure.', fabric: 'Raw silk with zari embroidery', fit: 'True to size, adjustable drawstring waist',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Deep Plum'], tags: ['signature', 'bestseller'], image: IMG('royal-plum-silk-lehenga'),
    fakeBookedDates: ['2026-11-06', '2026-11-07', '2026-11-08', '2026-12-04', '2026-12-05', '2027-01-23'] },
  { id: 'ki-02', slug: 'antique-gold-zari-lehenga', name: 'The Antique Gold Zari Lehenga', category: 'Lehengas',
    price: 4999, originalPrice: 32000, rentalPrice: 4999, retailValue: 32000,
    description: 'An antique gold bridal-weight lehenga, dense zari and gota patti work throughout, the piece every renter says they wish they could keep.',
    detail: 'Double-layered flare, hand-finished gota patti border, detachable dupatta.', fabric: 'Silk blend with gota patti', fit: 'True to size, corseted blouse',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Antique Gold'], tags: ['signature'], image: IMG('antique-gold-zari-lehenga'),
    fakeBookedDates: ['2026-11-13', '2026-11-14', '2026-11-15', '2026-12-11', '2026-12-12', '2027-02-06'] },
  { id: 'ki-03', slug: 'emerald-mirror-work-lehenga', name: 'The Emerald Mirror-Work Lehenga', category: 'Lehengas',
    price: 3999, originalPrice: 24999, rentalPrice: 3999, retailValue: 24999,
    description: 'An emerald green lehenga scattered with hand-set mirror work, built for sangeet nights that need to catch every light in the room.',
    detail: 'All-over mirror embroidery, flared silhouette, tasseled waistband.', fabric: 'Georgette with mirror work', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Emerald'], tags: ['bestseller'], image: IMG('emerald-mirror-work-lehenga'),
    fakeBookedDates: ['2026-11-20', '2026-11-21', '2026-12-18', '2026-12-19', '2027-01-30'] },
  { id: 'ki-04', slug: 'blush-pastel-bridesmaid-lehenga', name: 'The Blush Pastel Bridesmaid Lehenga', category: 'Lehengas',
    price: 2999, originalPrice: 17999, rentalPrice: 2999, retailValue: 17999,
    description: 'A soft blush lehenga with delicate thread work, made for the bridal party that needs to coordinate without competing with the bride.',
    detail: 'Thread embroidery on net, scalloped hem, matching dupatta.', fabric: 'Net with thread embroidery', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Blush'], tags: ['new'], image: IMG('blush-pastel-bridesmaid-lehenga'),
    fakeBookedDates: ['2026-11-27', '2026-11-28', '2027-01-09', '2027-01-10'] },

  // -------------------------------------------------------------- Sherwanis
  { id: 'ki-05', slug: 'ivory-bandhgala-sherwani', name: 'The Ivory Bandhgala Sherwani', category: 'Sherwanis',
    price: 3499, originalPrice: 21999, rentalPrice: 3499, retailValue: 21999,
    description: 'An ivory bandhgala sherwani with subtle self-thread work, sharply tailored for a groom or groomsman who wants quiet not loud.',
    detail: 'Mandarin collar, covered buttons, self-thread paisley motif.', fabric: 'Raw silk', fit: 'Tailored, order one size up for a relaxed drape',
    sizes: ['38', '40', '42', '44', '46'], colors: ['Ivory'], tags: ['signature', 'bestseller'], image: IMG('ivory-bandhgala-sherwani'),
    fakeBookedDates: ['2026-11-06', '2026-11-07', '2026-12-04', '2026-12-05'] },
  { id: 'ki-06', slug: 'maroon-velvet-groom-sherwani', name: 'The Maroon Velvet Groom Sherwani', category: 'Sherwanis',
    price: 4999, originalPrice: 34999, rentalPrice: 4999, retailValue: 34999,
    description: 'A maroon velvet sherwani with gold zardozi embroidery on the collar and cuffs, built to be the room\'s centre of gravity for one night.',
    detail: 'Zardozi collar and cuff embroidery, full velvet body, matching stole included.', fabric: 'Velvet with zardozi', fit: 'Tailored',
    sizes: ['38', '40', '42', '44', '46'], colors: ['Maroon'], tags: ['signature'], image: IMG('maroon-velvet-groom-sherwani'),
    fakeBookedDates: ['2026-11-13', '2026-11-14', '2026-11-15', '2027-02-06', '2027-02-07'] },
  { id: 'ki-07', slug: 'powder-blue-indowestern-sherwani', name: 'The Powder Blue Indo-Western Sherwani', category: 'Sherwanis',
    price: 2499, originalPrice: 14999, rentalPrice: 2499, retailValue: 14999,
    description: 'A powder blue indo-western jacket-sherwani, cut slim, for the reception look that leans modern.',
    detail: 'Structured shoulder, half-placket buttons, slim trouser included.', fabric: 'Poly-viscose blend', fit: 'Slim',
    sizes: ['38', '40', '42', '44'], colors: ['Powder Blue'], tags: ['new'], image: IMG('powder-blue-indowestern-sherwani'),
    fakeBookedDates: ['2026-12-11', '2026-12-12', '2027-01-16'] },

  // ----------------------------------------------------------------- Sarees
  { id: 'ki-08', slug: 'banarasi-silk-saree', name: 'The Banarasi Silk Saree', category: 'Sarees',
    price: 1999, originalPrice: 12999, rentalPrice: 1999, retailValue: 12999,
    description: 'A classic Banarasi silk saree with a woven gold zari border, the one your mother would approve of, freshly pressed for your night.',
    detail: 'Woven zari border and pallu, comes with a stitched blouse in your size.', fabric: 'Pure Banarasi silk', fit: 'One size, drapes to fit',
    sizes: ['Free Size'], colors: ['Wine Red'], tags: ['signature', 'bestseller'], image: IMG('banarasi-silk-saree'),
    fakeBookedDates: ['2026-11-08', '2026-11-09', '2027-01-23', '2027-01-24'] },
  { id: 'ki-09', slug: 'kanjivaram-temple-border-saree', name: 'The Kanjivaram Temple-Border Saree', category: 'Sarees',
    price: 2499, originalPrice: 15999, rentalPrice: 2499, retailValue: 15999,
    description: 'A Kanjivaram silk saree with a temple-motif border, the weight and sheen that only genuine Kanjivaram silk carries.',
    detail: 'Temple border, contrast pallu, includes a matching stitched blouse.', fabric: 'Pure Kanjivaram silk', fit: 'One size, drapes to fit',
    sizes: ['Free Size'], colors: ['Emerald & Gold'], tags: ['signature'], image: IMG('kanjivaram-temple-border-saree'),
    fakeBookedDates: ['2026-11-15', '2026-11-16', '2026-12-25', '2026-12-26'] },
  { id: 'ki-10', slug: 'chiffon-sequin-party-saree', name: 'The Chiffon Sequin Party Saree', category: 'Sarees',
    price: 1499, originalPrice: 8999, rentalPrice: 1499, retailValue: 8999,
    description: 'A lightweight chiffon saree scattered with fine sequin work, made to move on a dance floor without weighing you down.',
    detail: 'All-over sequin scatter, pre-pleated pallu for an easy drape.', fabric: 'Georgette chiffon', fit: 'One size, drapes to fit',
    sizes: ['Free Size'], colors: ['Midnight Blue'], tags: ['new'], image: IMG('chiffon-sequin-party-saree'),
    fakeBookedDates: ['2026-12-31', '2027-01-01', '2027-02-14'] },
  { id: 'ki-11', slug: 'organza-floral-saree', name: 'The Organza Floral Saree', category: 'Sarees',
    price: 1799, originalPrice: 10999, rentalPrice: 1799, retailValue: 10999,
    description: 'An organza saree hand-painted with a floral motif, sheer and structured at once, for daytime functions that still call for silk.',
    detail: 'Hand-painted floral motif, crisp organza body, satin-edged border.', fabric: 'Pure organza', fit: 'One size, drapes to fit',
    sizes: ['Free Size'], colors: ['Ivory & Rose'], tags: ['bestseller'], image: IMG('organza-floral-saree'),
    fakeBookedDates: ['2026-11-21', '2026-11-22', '2027-01-02'] },

  // ---------------------------------------------------------- Designer Gowns
  { id: 'ki-12', slug: 'midnight-sequin-gown', name: 'The Midnight Sequin Gown', category: 'Designer Gowns',
    price: 2999, originalPrice: 18999, rentalPrice: 2999, retailValue: 18999,
    description: 'A floor-length midnight blue sequin gown with a fitted bodice, built for the one reception photo you\'ll keep forever.',
    detail: 'Fitted bodice, all-over sequins, floor-sweeping hem.', fabric: 'Sequin mesh over stretch lining', fit: 'True to size, fitted',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Midnight Blue'], tags: ['signature', 'bestseller'], image: IMG('midnight-sequin-gown'),
    fakeBookedDates: ['2026-12-31', '2027-01-01', '2027-02-14'] },
  { id: 'ki-13', slug: 'ivory-trail-gown', name: 'The Ivory Trail Gown', category: 'Designer Gowns',
    price: 3499, originalPrice: 22999, rentalPrice: 3499, retailValue: 22999,
    description: 'An ivory gown with a soft trail and hand-embroidered bodice, the closest thing to a bridal look without being the bride.',
    detail: 'Hand-embroidered bodice, detachable trail, corseted back.', fabric: 'Silk satin with embroidery', fit: 'True to size, corseted',
    sizes: ['XS', 'S', 'M', 'L'], colors: ['Ivory'], tags: ['signature'], image: IMG('ivory-trail-gown'),
    fakeBookedDates: ['2026-11-27', '2026-11-28', '2026-12-24', '2026-12-25'] },
  { id: 'ki-14', slug: 'emerald-cape-gown', name: 'The Emerald Cape Gown', category: 'Designer Gowns',
    price: 2799, originalPrice: 16999, rentalPrice: 2799, retailValue: 16999,
    description: 'An emerald gown with a detachable cape sleeve, dramatic from the back, comfortable enough to actually dance in.',
    detail: 'Detachable cape sleeve, side slit, concealed back zip.', fabric: 'Crepe with satin lining', fit: 'True to size',
    sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['Emerald'], tags: ['new'], image: IMG('emerald-cape-gown'),
    fakeBookedDates: ['2026-11-06', '2026-11-07', '2027-01-30', '2027-01-31'] },

  // -------------------------------------------------------------- Jewellery
  { id: 'ki-15', slug: 'kundan-choker-set', name: 'The Kundan Choker Set', category: 'Jewellery',
    price: 999, originalPrice: 6999, rentalPrice: 999, retailValue: 6999,
    description: 'A kundan choker with matching jhumka earrings, uncleaned polish and real weight — the kind of piece that photographs like an heirloom.',
    detail: 'Choker, jhumka earrings, and maang tikka included as a set.', fabric: 'Kundan stones on gold-plated brass', fit: 'One size, adjustable thread closure',
    sizes: ['One Size'], colors: ['Antique Gold'], tags: ['bestseller'], image: IMG('kundan-choker-set'),
    fakeBookedDates: ['2026-11-13', '2026-11-14', '2026-12-11', '2026-12-12'] },
  { id: 'ki-16', slug: 'polki-chandbali-set', name: 'The Polki Chandbali & Tikka Set', category: 'Jewellery',
    price: 1299, originalPrice: 8999, rentalPrice: 1299, retailValue: 8999,
    description: 'Polki chandbali earrings paired with a matching maang tikka, uncut-diamond-look stonework for a bridal-adjacent night.',
    detail: 'Chandbali earrings and maang tikka, secure screw-back closure.', fabric: 'Polki stones on gold-plated brass', fit: 'One size',
    sizes: ['One Size'], colors: ['Gold & White'], tags: ['signature'], image: IMG('polki-chandbali-set'),
    fakeBookedDates: ['2026-11-20', '2026-11-21', '2027-01-16'] },
  { id: 'ki-17', slug: 'antique-gold-temple-necklace-set', name: 'The Antique Gold Temple Necklace Set', category: 'Jewellery',
    price: 1499, originalPrice: 9999, rentalPrice: 1499, retailValue: 9999,
    description: 'A temple-motif necklace with matching earrings in antiqued gold plating, dense and layered, built for a Kanjivaram or Banarasi saree.',
    detail: 'Layered necklace, matching stud-drop earrings, box clasp closure.', fabric: 'Antique gold-plated brass', fit: 'One size',
    sizes: ['One Size'], colors: ['Antique Gold'], tags: ['new'], image: IMG('antique-gold-temple-necklace-set'),
    fakeBookedDates: ['2026-11-06', '2026-12-04', '2027-02-06'] },
]

export const KIRAYA_CATEGORIES: KirayaCategory[] = ['Lehengas', 'Sherwanis', 'Sarees', 'Designer Gowns', 'Jewellery']

export const KIRAYA_CAMPAIGN = {
  hero: '/kiraya/campaign/hero.jpg',
  dressingRoom: '/kiraya/campaign/dressing-room.jpg',
  texture: '/kiraya/campaign/texture.jpg',
  stillLife: '/kiraya/campaign/still-life.jpg',
  detail: '/kiraya/campaign/detail.jpg',
  flatlayOutfit: '/kiraya/campaign/flatlay-outfit.jpg',
}

export const KIRAYA_BRAND: ThemeBrand = {
  name: 'KIRAYA',
  tagline: 'Wear it once. Return it happy.',
  slug: 'kiraya',
  currency: 'INR',
  categories: [...KIRAYA_CATEGORIES],
  sellerId: null,
  description:
    'KIRAYA is a rental wardrobe for the nights that matter — lehengas, sherwanis, sarees, designer gowns and jewellery you wear once, at a fraction of retail, delivered before your event and picked up after. No storage, no dry-cleaning, no closet full of one-time-wear.',
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
