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
  heroGradient: string // CSS gradient used as hero fallback when photo doesn't load
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
    heroGradient: 'linear-gradient(135deg, #e8ddd4 0%, #c9b8a8 50%, #a6134a22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=900&fit=crop',
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
    heroGradient: 'linear-gradient(135deg, #1a0010 0%, #0d0d0d 60%, #2d0020 100%)',
    previewImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=900&fit=crop',
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
    heroGradient: 'linear-gradient(180deg, #f0f0f0 0%, #ffffff 100%)',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=900&fit=crop',
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
    heroGradient: 'linear-gradient(135deg, #ffd6e7 0%, #ffb3d1 50%, #ff6fa533 100%)',
    previewImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=900&fit=crop',
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
    heroGradient: 'linear-gradient(135deg, #d4c4a8 0%, #b8976a 50%, #8b5e3444 100%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
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
    heroGradient: 'linear-gradient(135deg, #ffe600 0%, #ffcc00 60%, #ff336633 100%)',
    previewImage: 'https://images.unsplash.com/photo-1551232864-3f0890e1776c?w=1200&h=900&fit=crop',
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
    heroGradient: 'linear-gradient(135deg, #e0e4ea 0%, #c8cdd6 100%)',
    previewImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=900&fit=crop',
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
    heroGradient: 'linear-gradient(160deg, #1a1208 0%, #0a0a0a 40%, #1f160a 100%)',
    previewImage: 'https://images.unsplash.com/photo-1558171813-7fa2b10c2135?w=1200&h=900&fit=crop',
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
    heroGradient: 'linear-gradient(135deg, #a8f0c8 0%, #d6f5e3 40%, #ff5a3622 100%)',
    previewImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&h=900&fit=crop',
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
    heroGradient: 'linear-gradient(135deg, #d0d0d0 0%, #e8e8e8 50%, #f7f7f7 100%)',
    previewImage: 'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=1200&h=900&fit=crop',
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
    heroGradient: 'linear-gradient(135deg, #e8ddd4 0%, #f4f1ec 60%, #a6134a11 100%)',
    previewImage: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1200&h=900&fit=crop',
  },
  {
    // First of twelve month-named flagship themes (January–December), each its
    // own distinct showcase brand and aesthetic. This one's demo brand is
    // "AUGUST" ("Considered clothing. Quietly intelligent."), living at the
    // /store/august route — the theme id is the calendar slot, not the brand.
    id: 'january',
    name: 'January — Quiet Intelligence',
    blurb: 'Flagship theme #1: adaptive AI-native storefront, editorial calm (demo brand: AUGUST)',
    inspiration: '2026 quiet-luxury AI commerce (Brunello Cucinelli x makemepulse, COS)',
    // 'january' bypasses the shared grid renderer entirely — see the slug==='august'
    // branches in store/[slug]/layout.tsx and page.tsx (the demo tenant's route
    // slug, unrelated to this theme id). These fields exist only so it lists
    // correctly in the theme picker preview card; they are not read by the
    // bespoke component tree under src/components/august/.
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed-dark', font: 'fraunces',
    heroDecoration: 'none', categoryDisplay: 'tiles',
    headingStyle: 'luxury', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#F4F0E9', ink: '#17140F', accent: '#B08B57', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #17140f 0%, #0b0a08 60%, #2a2013 100%)',
    previewImage: '/august/campaign/hero.jpg',
  },
  {
    // Second of twelve month-named flagship themes. Demo brand is "EMBER"
    // ("Dress by mood.") — the deliberate visual opposite of January's AUGUST:
    // dark-first always (no light/dark toggle), saturated color-forward
    // knitwear/loungewear/eveningwear, bold display type, a "Mood Match" AI
    // feature instead of freeform chat. Lives at /store/ember.
    id: 'february',
    name: 'February — Dress by Mood',
    blurb: 'Flagship theme #2: dark-first, color-forward, mood-driven AI styling (demo brand: EMBER)',
    inspiration: '2026 "glow" design language — dark backgrounds, luminous accents, depth-layered UI',
    // 'february' bypasses the shared grid renderer entirely — see the
    // slug==='ember' branches in store/[slug]/layout.tsx and page.tsx (the
    // demo tenant's route slug, unrelated to this theme id). These fields
    // exist only so it lists correctly in the theme picker preview card; they
    // are not read by the bespoke component tree under src/components/ember/.
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed-dark', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'tiles',
    headingStyle: 'display', navStyle: 'pill', logoShape: 'square',
    palette: { bg: '#120D12', ink: '#F5EFE8', accent: '#FF5A3C', card: '#1D1620' },
    heroGradient: 'linear-gradient(160deg, #120d12 0%, #1d1620 60%, #ff5a3c22 100%)',
    previewImage: '/ember/campaign/hero.jpg',
  },
  {
    // Third of twelve month-named flagship themes. Demo brand is "BLOOM"
    // ("One capsule. Endless outfits.") — light-first like January, but a
    // completely different mood: soft botanical sage/cream/blush/terracotta,
    // an italic serif display face, and a "Capsule Builder" AI feature (a
    // structured multi-select task, distinct from January's freeform chat and
    // February's single mood pick). Lives at /store/bloom.
    id: 'march',
    name: 'March — One Capsule',
    blurb: 'Flagship theme #3: soft botanical capsule wardrobe, AI capsule-outfit planner (demo brand: BLOOM)',
    inspiration: 'Considered capsule-wardrobe movement — fewer pieces, engineered to combine',
    // 'march' bypasses the shared grid renderer entirely — see the
    // slug==='bloom' branches in store/[slug]/layout.tsx and page.tsx (the
    // demo tenant's route slug, unrelated to this theme id). These fields
    // exist only so it lists correctly in the theme picker preview card; they
    // are not read by the bespoke component tree under src/components/bloom/.
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'playfair',
    heroDecoration: 'none', categoryDisplay: 'tiles',
    headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#FAF5EC', ink: '#2B2620', accent: '#C1694F', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #faf5ec 0%, #e8ddc9 60%, #c1694f22 100%)',
    previewImage: '/bloom/campaign/hero.jpg',
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
