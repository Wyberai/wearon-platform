// Storefront themes — each bundles a color palette, font, layout mode, grid
// density, card decoration, and hero treatment. Grounded in real reference
// points rather than invented from nothing: Shopify's own free-theme library
// spans genuinely distinct genres (Dawn=minimal, Sense=soft/bright,
// Craft=artisanal/editorial), Instagram's own Shopping/Reels UX for the feed
// layout, and — for 'atelier' — Colorlib's free "Male Fashion" template,
// rebuilt in our own components/data rather than copied as static files.
// All but 'feed' share one parameterized grid renderer — density, decoration,
// hero style, palette and font are different enough per preset to read as
// distinct storefronts, without maintaining a separate layout per theme.

export type ThemeLayout = 'grid' | 'feed'
export type ThemeDensity = 'airy' | 'normal' | 'dense'
export type ThemeDecoration = 'none' | 'badges' | 'stickers' | 'rounded'
export type ThemeHero = 'full-bleed' | 'full-bleed-dark' | 'text-only' | 'banner-strip'
// Controls heading weight/case/tracking + price-text treatment — the part of
// a theme's personality that isn't a color or a font, but reads instantly as
// "boutique" vs "streetwear drop" vs "quiet luxury" at a glance.
export type ThemeHeadingStyle = 'serif' | 'display' | 'minimal' | 'rounded' | 'luxury'
// Controls the category/filter tab treatment in the nav row.
export type ThemeNavStyle = 'underline' | 'pill' | 'ghost'
// Small decorative accent behind a text-only hero — a soft blurred color
// blob plus a dot grid, the one purely-ornamental touch borrowed from the
// Male Fashion (Colorlib) reference build rather than invented from nothing.
export type ThemeHeroDecoration = 'none' | 'blob-dots'
// Circles (existing default) vs. large photo tiles for the category row —
// the tile treatment is the other structural idea taken from that reference.
export type ThemeCategoryDisplay = 'circles' | 'tiles'

export interface Theme {
  id: string
  name: string
  blurb: string
  inspiration: string
  layout: ThemeLayout
  density: ThemeDensity
  decoration: ThemeDecoration
  hero: ThemeHero
  heroDecoration: ThemeHeroDecoration
  categoryDisplay: ThemeCategoryDisplay
  headingStyle: ThemeHeadingStyle
  navStyle: ThemeNavStyle
  logoShape: 'circle' | 'square'
  font: string // key into FONTS
  palette: { bg: string; ink: string; accent: string; card: string }
  previewImage: string
}

const STORAGE_BASE = 'https://zhrubbutcsvhcbuaalep.supabase.co/storage/v1/object/public/product-images'

export const THEMES: Theme[] = [
  {
    id: 'editorial',
    name: 'Editorial',
    blurb: 'Full-bleed photography, quiet typography',
    inspiration: 'Mulmul, COS',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'poppins',
    heroDecoration: 'none', categoryDisplay: 'circles',
    headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#FAF7F3', ink: '#171512', accent: '#A6134A', card: '#F4F1EC' },
    previewImage: `${STORAGE_BASE}/velvet-lehenga-choli-demo14.jpg`,
  },
  {
    id: 'feed',
    name: 'Feed',
    blurb: 'Scroll like Instagram, tap the tag to shop',
    inspiration: 'Instagram Reels + Shopping',
    layout: 'feed', density: 'normal', decoration: 'none', hero: 'full-bleed-dark', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles',
    headingStyle: 'minimal', navStyle: 'ghost', logoShape: 'circle',
    palette: { bg: '#000000', ink: '#ffffff', accent: '#F72585', card: '#111111' },
    previewImage: `${STORAGE_BASE}/party-wear-gown-demo9.jpg`,
  },
  {
    id: 'dawn',
    name: 'Minimal',
    blurb: 'Clean grid, huge whitespace, no decoration',
    inspiration: 'Shopify Dawn',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'text-only', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles',
    headingStyle: 'minimal', navStyle: 'underline', logoShape: 'square',
    palette: { bg: '#FFFFFF', ink: '#161616', accent: '#161616', card: '#FAFAFA' },
    previewImage: `${STORAGE_BASE}/chikankari-kurti-demo6.jpg`,
  },
  {
    id: 'soft',
    name: 'Soft & Bright',
    blurb: 'Pastel palette, rounded shapes, friendly',
    inspiration: 'Shopify Sense',
    layout: 'grid', density: 'normal', decoration: 'rounded', hero: 'full-bleed', font: 'nunito',
    heroDecoration: 'none', categoryDisplay: 'circles',
    headingStyle: 'rounded', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#FFF5F8', ink: '#4A2E39', accent: '#FF6FA5', card: '#FFFFFF' },
    previewImage: `${STORAGE_BASE}/sharara-set-demo12.jpg`,
  },
  {
    id: 'craft',
    name: 'Artisanal',
    blurb: 'Warm, storytelling, handmade feel',
    inspiration: 'Shopify Craft',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'fraunces',
    heroDecoration: 'none', categoryDisplay: 'circles',
    headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F3ECE1', ink: '#3D2E1F', accent: '#8B5E34', card: '#FFFDF9' },
    previewImage: `${STORAGE_BASE}/handloom-cotton-saree-demo11.jpg`,
  },
  {
    id: 'streetwear',
    name: 'Streetwear',
    blurb: 'Bold color, oversized type, sticker tags',
    inspiration: 'Bewakoof, Bonkers Corner',
    layout: 'grid', density: 'normal', decoration: 'stickers', hero: 'text-only', font: 'bebas',
    heroDecoration: 'none', categoryDisplay: 'circles',
    headingStyle: 'display', navStyle: 'pill', logoShape: 'square',
    palette: { bg: '#FFE600', ink: '#0A0A0A', accent: '#FF3366', card: '#FFFFFF' },
    previewImage: `${STORAGE_BASE}/denim-jacket-coord-demo10.jpg`,
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    blurb: 'Dense grid, price-forward, badges everywhere',
    inspiration: 'Myntra, Amazon Fashion',
    layout: 'grid', density: 'dense', decoration: 'badges', hero: 'banner-strip', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'circles',
    headingStyle: 'minimal', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#F1F3F6', ink: '#212121', accent: '#FF3E6C', card: '#FFFFFF' },
    previewImage: `${STORAGE_BASE}/crop-top-skirt-demo18.jpg`,
  },
  {
    id: 'noir',
    name: 'Dark Luxury',
    blurb: 'Black, monochrome, generous negative space',
    inspiration: 'High-fashion dark mode',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed-dark', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'circles',
    headingStyle: 'luxury', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#0A0A0A', ink: '#F0EDE8', accent: '#C9A66B', card: '#141414' },
    previewImage: `${STORAGE_BASE}/designer-bridal-lehenga-demo5.jpg`,
  },
  {
    id: 'retro',
    name: 'Retro Revival',
    blurb: 'Y2K color, playful, sticker chaos',
    inspiration: '2000s revival / Gen-Z nostalgia',
    layout: 'grid', density: 'normal', decoration: 'stickers', hero: 'full-bleed', font: 'bebas',
    heroDecoration: 'none', categoryDisplay: 'circles',
    headingStyle: 'display', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#D6F5E3', ink: '#1A1A1A', accent: '#FF5A36', card: '#FFF9E8' },
    previewImage: `${STORAGE_BASE}/georgette-sequin-saree-demo8.jpg`,
  },
  {
    id: 'lookbook',
    name: 'Lookbook',
    blurb: 'Big magazine spreads, minimal text',
    inspiration: 'Vogue-style editorial',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'playfair',
    heroDecoration: 'none', categoryDisplay: 'circles',
    headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#FFFFFF', ink: '#0A0A0A', accent: '#0A0A0A', card: '#F7F7F7' },
    previewImage: `${STORAGE_BASE}/embroidered-anarkali-demo2.jpg`,
  },
  {
    id: 'atelier',
    name: 'Atelier',
    blurb: 'Soft color accents, confident type, editorial calm',
    inspiration: 'Male Fashion (Colorlib) — rebuilt in our own code',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'text-only', font: 'nunito',
    heroDecoration: 'blob-dots', categoryDisplay: 'tiles',
    headingStyle: 'rounded', navStyle: 'underline', logoShape: 'square',
    palette: { bg: '#FAF7F3', ink: '#171512', accent: '#A6134A', card: '#F4F1EC' },
    previewImage: `${STORAGE_BASE}/velvet-lehenga-choli-demo14.jpg`,
  },
]

export function getTheme(id: string | null | undefined): Theme {
  return THEMES.find(t => t.id === id) ?? THEMES[0]
}

// Header brand-name typography per headingStyle, expressed as CSS custom-
// property values (not Tailwind classes) so the ?theme= preview override —
// which only ever touches document.documentElement.style, since the header
// lives in the server-rendered layout — can flip it live, the same way it
// already flips --store-bg/--store-font.
export const HEADING_TYPE: Record<ThemeHeadingStyle, { weight: string; case: string; tracking: string; size: string }> = {
  serif:   { weight: '600', case: 'none',      tracking: '-0.01em', size: '1.125rem' },
  display: { weight: '900', case: 'uppercase', tracking: '-0.01em', size: '1.125rem' },
  minimal: { weight: '500', case: 'uppercase', tracking: '0.1em',   size: '1rem' },
  rounded: { weight: '800', case: 'none',      tracking: '-0.01em', size: '1.125rem' },
  luxury:  { weight: '300', case: 'uppercase', tracking: '0.16em',  size: '1rem' },
}

export const LOGO_RADIUS: Record<Theme['logoShape'], string> = {
  circle: '9999px',
  square: '10px',
}
