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

  // ─── 88 additional storefront themes — same shared parameterized grid/feed
  // renderer as the 11 above (zero new component code), each grounded in a
  // real regional or subcultural design tradition rather than invented from
  // nothing, per this file's own convention. previewImage values reuse the
  // 11 already-verified Unsplash photos above (rotated) rather than
  // introducing unverified URLs.
  {
    id: 'coastal-linen', name: 'Coastal Linen', blurb: 'Sun-bleached linen, driftwood tones, unhurried seaside ease',
    inspiration: 'New England / Amalfi coastal wardrobe staples',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'raleway',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F7F3EC', ink: '#3B372E', accent: '#7A8B99', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #e8e2d4 0%, #d9d3c3 50%, #7a8b9922 100%)',
    previewImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=900&fit=crop',
  },
  {
    id: 'prairie-cottagecore', name: 'Prairie Cottagecore', blurb: 'Ditsy florals, gingham, homemade-feeling softness',
    inspiration: 'American prairie-dress revival / cottagecore',
    layout: 'grid', density: 'normal', decoration: 'rounded', hero: 'full-bleed', font: 'nunito',
    heroDecoration: 'blob-dots', categoryDisplay: 'tiles', headingStyle: 'rounded', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#FBF3EE', ink: '#4A342B', accent: '#C97B84', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #f5ddd0 0%, #efc9c3 50%, #c97b8422 100%)',
    previewImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=900&fit=crop',
  },
  {
    id: 'scandi-minimal', name: 'Scandinavian Minimal', blurb: 'Pale wood, white space, functional restraint',
    inspiration: 'Scandinavian design tradition — form follows function',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'text-only', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'underline', logoShape: 'square',
    palette: { bg: '#FFFFFF', ink: '#232323', accent: '#4A6D5C', card: '#F5F5F3' },
    heroGradient: 'linear-gradient(180deg, #f0f0ee 0%, #ffffff 100%)',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=900&fit=crop',
  },
  {
    id: 'wabi-sabi', name: 'Wabi-Sabi', blurb: 'Imperfect textures, muted earth tones, quiet reverence',
    inspiration: 'Japanese wabi-sabi aesthetic philosophy',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'fraunces',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#EFEAE1', ink: '#2E2A24', accent: '#8A7259', card: '#F8F5EF' },
    heroGradient: 'linear-gradient(135deg, #ddd4c4 0%, #c9bda6 50%, #8a725922 100%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },
  {
    id: 'alpine-lodge', name: 'Alpine Ski Lodge', blurb: 'Knit textures, timber and snow, fireside warmth',
    inspiration: 'Alpine ski-lodge wardrobe — the Aprés-ski aesthetic',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed-dark', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'luxury', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#F3EFE9', ink: '#241D18', accent: '#8C3B2E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #241d18 0%, #3a2c22 60%, #8c3b2e22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&h=900&fit=crop',
  },
  {
    id: 'desert-boho', name: 'Desert Boho', blurb: 'Rust and sand tones, fringe and macramé, open-road freedom',
    inspiration: 'Southwestern American desert bohemian style',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed', font: 'spacegrotesk',
    heroDecoration: 'blob-dots', categoryDisplay: 'tiles', headingStyle: 'display', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#F6EADE', ink: '#3D2A1E', accent: '#C1622E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #e8c9a3 0%, #d9ac78 50%, #c1622e22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&h=900&fit=crop',
  },
  {
    id: 'tropical-resort', name: 'Tropical Resort', blurb: 'Palm-print, citrus brights, poolside ease',
    inspiration: 'Tropical resortwear — Southeast Asian and Caribbean beach clubs',
    layout: 'grid', density: 'normal', decoration: 'badges', hero: 'full-bleed', font: 'poppins',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'display', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#FFFBF2', ink: '#1E3A34', accent: '#FF7A45', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #ff7a4522 0%, #1e3a3422 60%, #ffe08a33 100%)',
    previewImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=900&fit=crop',
  },
  {
    id: 'nordic-noir', name: 'Nordic Noir', blurb: 'Charcoal wool, muted navy, cinematic Scandinavian gloom',
    inspiration: 'Nordic-noir film and television costuming',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed-dark', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#14161C', ink: '#E7E9EE', accent: '#5B7A9A', card: '#1D2028' },
    heroGradient: 'linear-gradient(160deg, #14161c 0%, #1d2028 60%, #5b7a9a22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1558171813-7fa2b10c2135?w=1200&h=900&fit=crop',
  },
  {
    id: 'parisian-chic', name: 'Parisian Chic', blurb: 'Effortless tailoring, neutral palette, quiet confidence',
    inspiration: 'Classic Parisian off-duty style',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'text-only', font: 'playfair',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#FAF9F6', ink: '#1B1B1B', accent: '#8C1D2B', card: '#F2F0EB' },
    heroGradient: 'linear-gradient(180deg, #eeece6 0%, #faf9f6 100%)',
    previewImage: 'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=1200&h=900&fit=crop',
  },
  {
    id: 'milanese-tailoring', name: 'Milanese Tailoring', blurb: 'Sharp shoulders, rich fabric, confident Italian polish',
    inspiration: 'Milan fashion-week tailoring houses',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed-dark', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'luxury', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#F2EFEA', ink: '#1A1714', accent: '#A8842E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #1a1714 0%, #2b2620 60%, #a8842e22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1558171813-7fa2b10c2135?w=1200&h=900&fit=crop',
  },
  {
    id: 'tokyo-streetstyle', name: 'Tokyo Streetstyle', blurb: 'Layered silhouettes, monochrome with one loud accent',
    inspiration: 'Harajuku / Shimokitazawa street style',
    layout: 'feed', density: 'normal', decoration: 'none', hero: 'full-bleed-dark', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#0D0D0D', ink: '#F2F2F2', accent: '#FF2D6E', card: '#181818' },
    heroGradient: 'linear-gradient(135deg, #ff2d6e22 0%, #0d0d0d 70%)',
    previewImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=900&fit=crop',
  },

  {
    id: 'seoul-y2k', name: 'Seoul Y2K', blurb: 'Chrome, glitter, low-rise nostalgia with K-pop polish',
    inspiration: 'Seoul Y2K revival street fashion',
    layout: 'feed', density: 'dense', decoration: 'stickers', hero: 'full-bleed', font: 'bebas',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'display', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#F5F0FF', ink: '#1A1A1A', accent: '#B388FF', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #b388ff33 0%, #7dd3fc33 100%)',
    previewImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&h=900&fit=crop',
  },
  {
    id: 'london-punk', name: 'London Punk Revival', blurb: 'Tartan safety-pins, distressed denim, defiant DIY energy',
    inspiration: '1970s–2020s London punk subculture revival',
    layout: 'grid', density: 'dense', decoration: 'stickers', hero: 'full-bleed-dark', font: 'bebas',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'display', navStyle: 'pill', logoShape: 'square',
    palette: { bg: '#0A0A0A', ink: '#F5F5F5', accent: '#E0122D', card: '#171717' },
    heroGradient: 'linear-gradient(160deg, #0a0a0a 0%, #171717 60%, #e0122d22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1551232864-3f0890e1776c?w=1200&h=900&fit=crop',
  },
  {
    id: 'berlin-utilitarian', name: 'Berlin Techno-Utilitarian', blurb: 'Matte black, cargo pockets, industrial nightlife function',
    inspiration: 'Berlin techno-club utilitarian streetwear',
    layout: 'feed', density: 'dense', decoration: 'none', hero: 'full-bleed-dark', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#000000', ink: '#EDEDED', accent: '#3AF25A', card: '#131313' },
    heroGradient: 'linear-gradient(135deg, #3af25a22 0%, #000000 70%)',
    previewImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=900&fit=crop',
  },
  {
    id: 'nyc-grunge', name: 'NYC Downtown Grunge', blurb: 'Vintage band tees, worn leather, downtown-cool nonchalance',
    inspiration: '1990s–2020s NYC downtown grunge revival',
    layout: 'grid', density: 'normal', decoration: 'stickers', hero: 'full-bleed-dark', font: 'bebas',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'display', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#111111', ink: '#EDEDED', accent: '#C9A24B', card: '#1B1B1B' },
    heroGradient: 'linear-gradient(160deg, #111111 0%, #1b1b1b 60%, #c9a24b22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1551232864-3f0890e1776c?w=1200&h=900&fit=crop',
  },
  {
    id: 'la-skate', name: 'LA Skate Culture', blurb: 'Baggy fits, sun-faded graphics, Venice Beach skate energy',
    inspiration: 'Los Angeles skate/surf culture',
    layout: 'feed', density: 'normal', decoration: 'stickers', hero: 'full-bleed', font: 'bebas',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'display', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#FFF6E9', ink: '#1A1A1A', accent: '#FF5A1F', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #ff5a1f22 0%, #38bdf822 100%)',
    previewImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&h=900&fit=crop',
  },
  {
    id: 'miami-vice', name: 'Miami Vice Neon', blurb: 'Pastel neon, palm silhouettes, 1980s South Beach glamour',
    inspiration: '1980s Miami Vice visual style',
    layout: 'feed', density: 'normal', decoration: 'none', hero: 'full-bleed-dark', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'display', navStyle: 'pill', logoShape: 'square',
    palette: { bg: '#170F2E', ink: '#F5EEFF', accent: '#FF4FA3', card: '#221541' },
    heroGradient: 'linear-gradient(135deg, #ff4fa333 0%, #22d3ee33 100%)',
    previewImage: 'https://images.unsplash.com/photo-1558171813-7fa2b10c2135?w=1200&h=900&fit=crop',
  },
  {
    id: 'southern-prep', name: 'Southern Prep', blurb: 'Seersucker, monograms, garden-party polish',
    inspiration: 'American Southern preppy tradition',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'playfair',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#FBF8F1', ink: '#243B2E', accent: '#2F6B4F', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #d7e8db 0%, #f0e6c8 50%, #2f6b4f22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=900&fit=crop',
  },

  {
    id: 'ivy-varsity', name: 'Ivy League Varsity', blurb: 'Wool blazers, crest patches, old-campus tradition',
    inspiration: 'American Ivy League varsity wardrobe',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'text-only', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'luxury', navStyle: 'underline', logoShape: 'square',
    palette: { bg: '#F5F1E8', ink: '#1F2A44', accent: '#8A1E2D', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(180deg, #e7e0cd 0%, #f5f1e8 100%)',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=900&fit=crop',
  },
  {
    id: 'countryside-tweed', name: 'British Countryside Tweed', blurb: 'Herringbone wool, wellingtons, manor-house heritage',
    inspiration: 'English countryside estate wardrobe',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'fraunces',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F1ECE2', ink: '#2C2620', accent: '#5C4A34', card: '#FBF8F2' },
    heroGradient: 'linear-gradient(135deg, #d9cdb6 0%, #b9a684 50%, #5c4a3422 100%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },
  {
    id: 'highland-tartan', name: 'Highland Tartan', blurb: 'Clan plaid, kilts, rugged Scottish highland character',
    inspiration: 'Scottish highland tartan tradition',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed-dark', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'luxury', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#F3EEE7', ink: '#1D2320', accent: '#7A2331', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #1d2320 0%, #2c3530 60%, #7a233122 100%)',
    previewImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&h=900&fit=crop',
  },
  {
    id: 'andalusian-flamenco', name: 'Andalusian Flamenco', blurb: 'Ruffled polka-dot, deep reds, passionate southern-Spain flair',
    inspiration: 'Andalusian flamenco dress tradition',
    layout: 'grid', density: 'normal', decoration: 'rounded', hero: 'full-bleed', font: 'playfair',
    heroDecoration: 'blob-dots', categoryDisplay: 'tiles', headingStyle: 'serif', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#FFF6F2', ink: '#2A1210', accent: '#B0142F', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #b0142f22 0%, #f2b90522 100%)',
    previewImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=900&fit=crop',
  },
  {
    id: 'moroccan-souk', name: 'Moroccan Souk', blurb: 'Jewel-tone kaftans, brass and tile, market-alley richness',
    inspiration: 'Marrakech souk textile tradition',
    layout: 'grid', density: 'dense', decoration: 'badges', hero: 'full-bleed', font: 'fraunces',
    heroDecoration: 'blob-dots', categoryDisplay: 'tiles', headingStyle: 'serif', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#FBF2E3', ink: '#2E1E0F', accent: '#C0682B', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #c0682b22 0%, #1f6f6b22 60%, #f2b90522 100%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },
  {
    id: 'indian-block-print', name: 'Indian Block Print', blurb: 'Hand-blocked cotton, indigo and madder, artisan-slow craft',
    inspiration: 'Rajasthani hand block-printing tradition',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'fraunces',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#FBF6EC', ink: '#241B12', accent: '#2A4D6E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #2a4d6e22 0%, #b5502c22 60%, #fbf6ec 100%)',
    previewImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=900&fit=crop',
  },
  {
    id: 'balinese-batik', name: 'Balinese Batik', blurb: 'Wax-resist patterns, warm browns, island-temple serenity',
    inspiration: 'Indonesian batik textile tradition',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed', font: 'nunito',
    heroDecoration: 'blob-dots', categoryDisplay: 'tiles', headingStyle: 'rounded', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F5EEDD', ink: '#2E2417', accent: '#8B5A2B', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #d9c6a0 0%, #b98f56 50%, #8b5a2b22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },
  {
    id: 'outback', name: 'Australian Outback', blurb: 'Sun-worn khaki, dusty red earth, no-nonsense durability',
    inspiration: 'Australian outback workwear tradition',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'underline', logoShape: 'square',
    palette: { bg: '#F3EDE3', ink: '#2B241C', accent: '#A85C32', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #d8b48f 0%, #c08858 50%, #a85c3222 100%)',
    previewImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&h=900&fit=crop',
  },

  {
    id: 'icelandic-wool', name: 'Icelandic Wool', blurb: 'Chunky lopapeysa knits, glacier tones, elemental warmth',
    inspiration: 'Icelandic lopapeysa knitwear tradition',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed-dark', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#EFF1F2', ink: '#1C2226', accent: '#5C7A82', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #1c2226 0%, #2b343a 60%, #5c7a8222 100%)',
    previewImage: 'https://images.unsplash.com/photo-1558171813-7fa2b10c2135?w=1200&h=900&fit=crop',
  },
  {
    id: 'swiss-precision', name: 'Swiss Precision', blurb: 'Grid-aligned typography, neutral tones, engineered clarity',
    inspiration: 'Swiss International Typographic Style',
    layout: 'grid', density: 'dense', decoration: 'none', hero: 'text-only', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'underline', logoShape: 'square',
    palette: { bg: '#FFFFFF', ink: '#111111', accent: '#D62E1F', card: '#F4F4F4' },
    heroGradient: 'linear-gradient(180deg, #f0f0f0 0%, #ffffff 100%)',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=900&fit=crop',
  },
  {
    id: 'dutch-design', name: 'Dutch Design', blurb: 'Bold primary color-blocking, graphic confidence, De Stijl clarity',
    inspiration: 'Dutch De Stijl design movement',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'banner-strip', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'display', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#FFFFFF', ink: '#111111', accent: '#1D4ED8', card: '#F5F5F5' },
    heroGradient: 'linear-gradient(135deg, #1d4ed822 0%, #eab30822 50%, #dc262622 100%)',
    previewImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=900&fit=crop',
  },
  {
    id: 'danish-hygge', name: 'Danish Hygge', blurb: 'Candlelit neutrals, soft knits, cozy contentment',
    inspiration: 'Danish hygge lifestyle philosophy',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'nunito',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'rounded', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F6F0E9', ink: '#332B24', accent: '#B98763', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #e8d9c6 0%, #d9c2a3 50%, #b9876322 100%)',
    previewImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=900&fit=crop',
  },
  {
    id: 'bauhaus', name: 'German Bauhaus', blurb: 'Geometric shapes, primary color accents, functionalist rigor',
    inspiration: 'Bauhaus design school principles',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'text-only', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'minimal', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#F5F5F0', ink: '#141414', accent: '#C1272D', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #c1272d22 0%, #f6c50022 50%, #2166ac22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=900&fit=crop',
  },
  {
    id: 'italian-riviera', name: 'Italian Riviera', blurb: 'Striped linen, citrus brights, dolce-vita ease',
    inspiration: 'Italian Riviera summer wardrobe',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed', font: 'playfair',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#FFF9F0', ink: '#173A4A', accent: '#E0793C', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #e0793c22 0%, #173a4a22 60%, #fff9f0 100%)',
    previewImage: 'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=1200&h=900&fit=crop',
  },
  {
    id: 'greek-island', name: 'Greek Island White', blurb: 'Whitewashed walls, cerulean trim, Cycladic simplicity',
    inspiration: 'Santorini / Mykonos island architecture',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#FFFFFF', ink: '#0F2A3D', accent: '#1D6FA5', card: '#F4F8FA' },
    heroGradient: 'linear-gradient(135deg, #dbeefb 0%, #ffffff 60%, #1d6fa522 100%)',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=900&fit=crop',
  },

  {
    id: 'cycladic-blue', name: 'Cycladic Blue', blurb: 'Deep Aegean blue, sea salt white, sun-bleached calm',
    inspiration: 'Greek Cycladic island color palette',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed-dark', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'luxury', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#F0F5F8', ink: '#0E2233', accent: '#1560A8', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #0e2233 0%, #1a3c56 60%, #1560a822 100%)',
    previewImage: 'https://images.unsplash.com/photo-1558171813-7fa2b10c2135?w=1200&h=900&fit=crop',
  },
  {
    id: 'provencal-lavender', name: 'Provençal Lavender', blurb: 'Lavender fields, soft sage, French countryside charm',
    inspiration: 'Provence, France countryside textile tradition',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'fraunces',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F6F2F6', ink: '#332B3D', accent: '#7C6BA6', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #e2d7ec 0%, #cabbe0 50%, #7c6ba622 100%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },
  {
    id: 'tuscan-terracotta', name: 'Tuscan Terracotta', blurb: 'Sun-baked clay, olive groves, unhurried Italian countryside',
    inspiration: 'Tuscany, Italy rural color and craft tradition',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'fraunces',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F5EDE1', ink: '#3B2A1D', accent: '#B85C38', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #e2c3a3 0%, #cf9c72 50%, #b85c3822 100%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },
  {
    id: 'amalfi-citrus', name: 'Amalfi Citrus', blurb: 'Lemon-grove yellow, majolica tile, coastal-cliff brightness',
    inspiration: 'Amalfi Coast, Italy citrus-and-ceramic tradition',
    layout: 'grid', density: 'normal', decoration: 'rounded', hero: 'full-bleed', font: 'playfair',
    heroDecoration: 'blob-dots', categoryDisplay: 'tiles', headingStyle: 'serif', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#FFFCF0', ink: '#1B3A3A', accent: '#F2B705', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #f2b70533 0%, #1b3a3a22 60%, #ffffff 100%)',
    previewImage: 'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=1200&h=900&fit=crop',
  },
  {
    id: 'portuguese-azulejo', name: 'Portuguese Azulejo', blurb: 'Blue-and-white tilework patterns, maritime heritage',
    inspiration: 'Portuguese azulejo ceramic tile tradition',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'luxury', navStyle: 'underline', logoShape: 'square',
    palette: { bg: '#F2F6F8', ink: '#132A3D', accent: '#1D5C8C', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #1d5c8c22 0%, #f2f6f8 60%)',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=900&fit=crop',
  },
  {
    id: 'copenhagen-street', name: 'Copenhagen Street', blurb: 'Oversized tailoring, muted brights, effortless Danish cool',
    inspiration: 'Copenhagen Fashion Week street style',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'underline', logoShape: 'square',
    palette: { bg: '#F7F5F2', ink: '#1C1C1C', accent: '#E85D3D', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #e85d3d22 0%, #f7f5f2 60%)',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=900&fit=crop',
  },
  {
    id: 'amsterdam-bike', name: 'Amsterdam Bike Culture', blurb: 'Practical layering, canal-side muted tones, everyday utility',
    inspiration: 'Amsterdam everyday cycling wardrobe',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'text-only', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F3F1EC', ink: '#20241E', accent: '#FF7A00', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(180deg, #e9e5da 0%, #f3f1ec 100%)',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=900&fit=crop',
  },

  {
    id: 'zurich-corporate', name: 'Zurich Corporate', blurb: 'Crisp tailoring, cool greys, banking-district precision',
    inspiration: 'Zurich financial-district workwear',
    layout: 'grid', density: 'dense', decoration: 'none', hero: 'banner-strip', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#F2F3F5', ink: '#161A1F', accent: '#2A5C8A', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #dfe3e8 0%, #c7ced6 100%)',
    previewImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=900&fit=crop',
  },
  {
    id: 'vienna-secession', name: 'Vienna Secession', blurb: 'Gold-leaf ornament, art-nouveau curves, imperial elegance',
    inspiration: 'Vienna Secession art movement',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed-dark', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'luxury', navStyle: 'ghost', logoShape: 'circle',
    palette: { bg: '#F3EEE3', ink: '#1B1710', accent: '#B08B57', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #1b1710 0%, #2c2517 60%, #b08b5722 100%)',
    previewImage: 'https://images.unsplash.com/photo-1558171813-7fa2b10c2135?w=1200&h=900&fit=crop',
  },
  {
    id: 'prague-gothic', name: 'Prague Gothic', blurb: 'Dark velvet, spired silhouettes, medieval-city romance',
    inspiration: 'Prague Gothic architecture and folklore',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed-dark', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'luxury', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#171018', ink: '#EDE6EF', accent: '#7C2E4A', card: '#241A26' },
    heroGradient: 'linear-gradient(160deg, #171018 0%, #241a26 60%, #7c2e4a22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1558171813-7fa2b10c2135?w=1200&h=900&fit=crop',
  },
  {
    id: 'budapest-ruinbar', name: 'Budapest Ruin-Bar', blurb: 'Reclaimed textures, eclectic mixing, underground creativity',
    inspiration: 'Budapest ruin-bar district aesthetic',
    layout: 'grid', density: 'dense', decoration: 'stickers', hero: 'full-bleed-dark', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'display', navStyle: 'pill', logoShape: 'square',
    palette: { bg: '#151312', ink: '#EDE7DE', accent: '#C97A2E', card: '#201D1A' },
    heroGradient: 'linear-gradient(160deg, #151312 0%, #201d1a 60%, #c97a2e22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1551232864-3f0890e1776c?w=1200&h=900&fit=crop',
  },
  {
    id: 'warsaw-brutalist', name: 'Warsaw Brutalist', blurb: 'Raw concrete tones, blocky silhouettes, unapologetic form',
    inspiration: 'Warsaw brutalist architecture',
    layout: 'grid', density: 'dense', decoration: 'none', hero: 'text-only', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#E9E9E6', ink: '#1B1B1B', accent: '#FF3B1F', card: '#F5F5F3' },
    heroGradient: 'linear-gradient(180deg, #d8d8d4 0%, #e9e9e6 100%)',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=900&fit=crop',
  },
  {
    id: 'moscow-constructivist', name: 'Moscow Constructivist', blurb: 'Bold red-and-black geometry, propaganda-poster confidence',
    inspiration: 'Russian Constructivist graphic design',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'banner-strip', font: 'bebas',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'display', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#F2F0EC', ink: '#141414', accent: '#C8102E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #c8102e22 0%, #14141422 100%)',
    previewImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1200&h=900&fit=crop',
  },

  {
    id: 'kyoto-zen', name: 'Kyoto Zen Garden', blurb: 'Raked gravel calm, moss green, deliberate emptiness',
    inspiration: 'Kyoto Zen garden design principles',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'text-only', font: 'fraunces',
    heroDecoration: 'blob-dots', categoryDisplay: 'tiles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F3F1EA', ink: '#1F2A1F', accent: '#4B6B4E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #dbe3d5 0%, #f3f1ea 60%, #4b6b4e22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1200&h=900&fit=crop',
  },
  {
    id: 'osaka-neon', name: 'Osaka Neon Arcade', blurb: 'Dense neon signage, retro-arcade color, night-market buzz',
    inspiration: 'Osaka Dotonbori neon district',
    layout: 'feed', density: 'dense', decoration: 'stickers', hero: 'full-bleed-dark', font: 'bebas',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'display', navStyle: 'pill', logoShape: 'square',
    palette: { bg: '#0B0B14', ink: '#F2F2F2', accent: '#FF3D81', card: '#15151F' },
    heroGradient: 'linear-gradient(135deg, #ff3d8133 0%, #22d3ee33 60%, #0b0b14 100%)',
    previewImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=900&fit=crop',
  },
  {
    id: 'shanghai-artdeco', name: 'Shanghai Art Deco', blurb: 'Gilded geometry, jade and lacquer, 1930s Bund glamour',
    inspiration: '1930s Shanghai Art Deco architecture',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed-dark', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'luxury', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#F2EEE6', ink: '#171B16', accent: '#0F6B4C', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #171b16 0%, #23281f 60%, #0f6b4c22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1558171813-7fa2b10c2135?w=1200&h=900&fit=crop',
  },
  {
    id: 'hongkong-neonnoir', name: 'Hong Kong Neon Noir', blurb: 'Rain-slick streets, dense neon reflections, cinematic edge',
    inspiration: 'Hong Kong neon-lit street cinema aesthetic',
    layout: 'feed', density: 'dense', decoration: 'none', hero: 'full-bleed-dark', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#08090D', ink: '#EDEDED', accent: '#FF2D6E', card: '#121319' },
    heroGradient: 'linear-gradient(135deg, #ff2d6e22 0%, #22d3ee22 60%, #08090d 100%)',
    previewImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=900&fit=crop',
  },
  {
    id: 'singapore-tropical', name: 'Singapore Tropical Modern', blurb: 'Glass-and-garden precision, tropical modernism, clean humidity',
    inspiration: 'Singapore tropical-modernist architecture',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'underline', logoShape: 'square',
    palette: { bg: '#F5F8F3', ink: '#12211A', accent: '#1E8A5F', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #1e8a5f22 0%, #f5f8f3 60%)',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=900&fit=crop',
  },
  {
    id: 'bangkok-night-market', name: 'Bangkok Night Market', blurb: 'Warm string-light glow, dense stalls, vibrant street-food color',
    inspiration: 'Bangkok night-market culture',
    layout: 'feed', density: 'dense', decoration: 'badges', hero: 'full-bleed-dark', font: 'poppins',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'display', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#150F0A', ink: '#F5EEE2', accent: '#FF8A3D', card: '#221A12' },
    heroGradient: 'linear-gradient(135deg, #ff8a3d33 0%, #150f0a 70%)',
    previewImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=900&fit=crop',
  },

  {
    id: 'manila-jeepney', name: 'Manila Jeepney Pop', blurb: 'Chrome ornament, riotous color, joyful maximalist spirit',
    inspiration: 'Philippine jeepney folk-art decoration',
    layout: 'grid', density: 'dense', decoration: 'stickers', hero: 'full-bleed', font: 'bebas',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'display', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#FFF7EC', ink: '#1A1A1A', accent: '#E6007A', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #e6007a22 0%, #00a9a522 50%, #ffb80022 100%)',
    previewImage: 'https://images.unsplash.com/photo-1551232864-3f0890e1776c?w=1200&h=900&fit=crop',
  },
  {
    id: 'jakarta-batik', name: 'Jakarta Batik Modern', blurb: 'Traditional batik motif, contemporary tailoring, city polish',
    inspiration: 'Modern Indonesian batik-fusion fashion',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed', font: 'fraunces',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F6EFE3', ink: '#241C12', accent: '#9A4B2E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #9a4b2e22 0%, #f6efe3 60%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },
  {
    id: 'mumbai-bollywood', name: 'Mumbai Bollywood Glam', blurb: 'Sequins and drama, saturated jewel tones, red-carpet spectacle',
    inspiration: 'Bollywood red-carpet glamour tradition',
    layout: 'grid', density: 'normal', decoration: 'badges', hero: 'full-bleed-dark', font: 'playfair',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'serif', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#160A14', ink: '#F5E9EF', accent: '#D4145A', card: '#241120' },
    heroGradient: 'linear-gradient(160deg, #160a14 0%, #241120 60%, #d4145a22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1558171813-7fa2b10c2135?w=1200&h=900&fit=crop',
  },
  {
    id: 'delhi-durbar', name: 'Delhi Durbar Royal', blurb: 'Regal brocade, gold zari embroidery, imperial ceremony',
    inspiration: 'Mughal-Delhi royal durbar court dress',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed-dark', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'luxury', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#F5EFDF', ink: '#231A0E', accent: '#B08B2E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #231a0e 0%, #35280f 60%, #b08b2e33 100%)',
    previewImage: 'https://images.unsplash.com/photo-1558171813-7fa2b10c2135?w=1200&h=900&fit=crop',
  },
  {
    id: 'kolkata-colonial', name: 'Kolkata Colonial Revival', blurb: 'Faded colonial elegance, sepia tones, literary old-world charm',
    inspiration: 'Colonial-era Kolkata architecture and dress',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'text-only', font: 'fraunces',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F2EBDD', ink: '#2C2213', accent: '#7A4A2B', card: '#FBF6EC' },
    heroGradient: 'linear-gradient(180deg, #e4d5b8 0%, #f2ebdd 100%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },
  {
    id: 'chennai-templesilk', name: 'Chennai Temple Silk', blurb: 'Kanjivaram gold borders, temple motifs, South Indian tradition',
    inspiration: 'Kanjivaram temple-silk weaving tradition',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'luxury', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F6EEDD', ink: '#2A1810', accent: '#8C1F2E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #8c1f2e22 0%, #b08b2e22 60%, #f6eedd 100%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },

  {
    id: 'bengaluru-tech', name: 'Bengaluru Tech-Casual', blurb: 'Smart-casual layering, muted tech-office palette, campus ease',
    inspiration: 'Bengaluru tech-campus everyday wardrobe',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'text-only', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'underline', logoShape: 'square',
    palette: { bg: '#F4F5F3', ink: '#1B1F1D', accent: '#2F7A5C', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(180deg, #e6e9e5 0%, #f4f5f3 100%)',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=900&fit=crop',
  },
  {
    id: 'karachi-chikankari', name: 'Karachi Chikankari', blurb: 'Delicate white-on-white embroidery, breezy cotton, hand-craft grace',
    inspiration: 'Lucknawi chikankari embroidery tradition',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'fraunces',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#FBF9F4', ink: '#221F1A', accent: '#3E6B5C', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(180deg, #f0eee6 0%, #fbf9f4 100%)',
    previewImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=900&fit=crop',
  },
  {
    id: 'lahore-mughal', name: 'Lahore Mughal Court', blurb: 'Ornate paisley, rich brocade, Mughal-garden opulence',
    inspiration: 'Mughal-era Lahore court textile tradition',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed-dark', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'luxury', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#F3ECDD', ink: '#241A10', accent: '#0F6B4C', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #241a10 0%, #35281a 60%, #0f6b4c22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1558171813-7fa2b10c2135?w=1200&h=900&fit=crop',
  },
  {
    id: 'dhaka-handloom', name: 'Dhaka Handloom', blurb: 'Featherlight jamdani weave, muted natural dye, artisan patience',
    inspiration: 'Bengali jamdani handloom weaving tradition',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'fraunces',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F6F2E9', ink: '#231F16', accent: '#5C6E3E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(180deg, #ece5d3 0%, #f6f2e9 100%)',
    previewImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=900&fit=crop',
  },
  {
    id: 'colombo-ceylon', name: 'Colombo Ceylon Tea', blurb: 'Highland tea-garden green, warm cream, tropical-colonial calm',
    inspiration: 'Sri Lankan Ceylon tea-estate tradition',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'nunito',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'rounded', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F5F3E7', ink: '#22301F', accent: '#3E6B3A', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #cfe0c6 0%, #f5f3e7 60%, #3e6b3a22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },
  {
    id: 'kathmandu-himalayan', name: 'Kathmandu Himalayan Craft', blurb: 'Hand-felted wool, prayer-flag color, mountain-trail resilience',
    inspiration: 'Nepali Himalayan handicraft tradition',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed', font: 'nunito',
    heroDecoration: 'blob-dots', categoryDisplay: 'tiles', headingStyle: 'rounded', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#F5F0E6', ink: '#241E14', accent: '#B0402E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #b0402e22 0%, #2a6f8c22 50%, #f2b70522 100%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },

  {
    id: 'cairo-souk-gold', name: 'Cairo Souk Gold', blurb: 'Brass filigree, sandstone warmth, ancient-market richness',
    inspiration: 'Khan el-Khalili souk tradition',
    layout: 'grid', density: 'dense', decoration: 'badges', hero: 'full-bleed', font: 'fraunces',
    heroDecoration: 'blob-dots', categoryDisplay: 'tiles', headingStyle: 'serif', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#F6EEDC', ink: '#2A1E10', accent: '#B08B2E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #b08b2e33 0%, #f6eedc 60%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },
  {
    id: 'marrakech-riad', name: 'Marrakech Riad', blurb: 'Tadelakt plaster pink, cobalt tile, courtyard tranquility',
    inspiration: 'Marrakech riad interior-design tradition',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed', font: 'fraunces',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F7EDE7', ink: '#2A1B18', accent: '#1D5C8C', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #1d5c8c22 0%, #e0917722 60%, #f7ede7 100%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },
  {
    id: 'nairobi-maasai', name: 'Nairobi Maasai Bead', blurb: 'Vivid beadwork color-blocking, shuka red, savanna confidence',
    inspiration: 'Maasai beadwork and shuka textile tradition',
    layout: 'grid', density: 'normal', decoration: 'badges', hero: 'full-bleed', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'display', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#FFF7EE', ink: '#221512', accent: '#C8102E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #c8102e22 0%, #1a6b4222 50%, #f2b70522 100%)',
    previewImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&h=900&fit=crop',
  },
  {
    id: 'lagos-ankara', name: 'Lagos Ankara Print', blurb: 'Bold wax-print pattern, confident color clash, Afrobeats energy',
    inspiration: 'West African Ankara wax-print fashion',
    layout: 'grid', density: 'dense', decoration: 'badges', hero: 'full-bleed', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'display', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#FFF8EC', ink: '#1E1207', accent: '#E6007A', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #e6007a22 0%, #f2b70522 50%, #1a6b4222 100%)',
    previewImage: 'https://images.unsplash.com/photo-1551232864-3f0890e1776c?w=1200&h=900&fit=crop',
  },
  {
    id: 'accra-kente', name: 'Accra Kente Weave', blurb: 'Geometric kente strips, gold-and-emerald symbolism, ceremonial pride',
    inspiration: 'Ghanaian kente cloth weaving tradition',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed', font: 'fraunces',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#FBF3E1', ink: '#221B0C', accent: '#0F6B4C', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #0f6b4c22 0%, #b08b2e22 50%, #c8102e22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },

  {
    id: 'capetown-safari', name: 'Cape Town Safari Chic', blurb: 'Khaki utility, vineyard neutrals, coastal-mountain adventure',
    inspiration: 'Cape Town / South African safari-lodge wardrobe',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'underline', logoShape: 'square',
    palette: { bg: '#F3EFE4', ink: '#241F16', accent: '#7A5C33', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #d9c8a3 0%, #b9a274 50%, #7a5c3322 100%)',
    previewImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&h=900&fit=crop',
  },
  {
    id: 'rio-carnival', name: 'Rio Carnival Color', blurb: 'Feathered sequins, samba-bright hues, festival joy',
    inspiration: 'Rio de Janeiro Carnival costume tradition',
    layout: 'feed', density: 'dense', decoration: 'badges', hero: 'full-bleed', font: 'poppins',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'display', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#FFF6EF', ink: '#1D1006', accent: '#FF3D6E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #ff3d6e33 0%, #f2b70533 50%, #1a6b4233 100%)',
    previewImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=900&fit=crop',
  },
  {
    id: 'saopaulo-concrete', name: 'São Paulo Concrete Modern', blurb: 'Raw concrete tones, bold silhouette, metropolitan confidence',
    inspiration: 'São Paulo Brutalist-modernist architecture',
    layout: 'grid', density: 'dense', decoration: 'none', hero: 'text-only', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#ECEBE7', ink: '#161514', accent: '#D6431F', card: '#F6F5F2' },
    heroGradient: 'linear-gradient(180deg, #dedcd6 0%, #ecebe7 100%)',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=900&fit=crop',
  },
  {
    id: 'buenosaires-tango', name: 'Buenos Aires Tango Noir', blurb: 'Smoky velvet, dramatic red, milonga-hall intensity',
    inspiration: 'Buenos Aires tango-hall dress tradition',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed-dark', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'luxury', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#170D10', ink: '#EDE2E4', accent: '#A8112E', card: '#241318' },
    heroGradient: 'linear-gradient(160deg, #170d10 0%, #241318 60%, #a8112e22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1558171813-7fa2b10c2135?w=1200&h=900&fit=crop',
  },
  {
    id: 'bogota-andean', name: 'Bogotá Andean Craft', blurb: 'Hand-loomed wool, mountain-mist neutrals, highland resilience',
    inspiration: 'Colombian Andean weaving tradition',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'nunito',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'rounded', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F2EFE8', ink: '#221E17', accent: '#8C5B2E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(180deg, #e3ddcf 0%, #f2efe8 100%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },
  {
    id: 'lima-alpaca', name: 'Lima Alpaca Wool', blurb: 'Soft alpaca neutrals, geometric Andean pattern, refined warmth',
    inspiration: 'Peruvian alpaca-wool weaving tradition',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'nunito',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'rounded', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F5F1E9', ink: '#241F18', accent: '#A8622E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(180deg, #e8ddc9 0%, #f5f1e9 100%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },

  {
    id: 'havana-chrome', name: 'Havana Vintage Chrome', blurb: 'Faded pastel façades, chrome trim, timeless mid-century cool',
    inspiration: 'Havana, Cuba vintage-car and architecture color palette',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed', font: 'poppins',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'display', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#FFF3EC', ink: '#231712', accent: '#2E8FA3', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #2e8fa322 0%, #f2967022 60%, #fff3ec 100%)',
    previewImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&h=900&fit=crop',
  },
  {
    id: 'mexicocity-talavera', name: 'Mexico City Talavera', blurb: 'Hand-painted ceramic pattern, vivid folk color, market vibrancy',
    inspiration: 'Mexican Talavera pottery tradition',
    layout: 'grid', density: 'dense', decoration: 'badges', hero: 'full-bleed', font: 'poppins',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'display', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#FFF8EE', ink: '#221607', accent: '#1D6FA5', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #1d6fa522 0%, #f2b70522 50%, #c8102e22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1551232864-3f0890e1776c?w=1200&h=900&fit=crop',
  },
  {
    id: 'toronto-minimal', name: 'Toronto Minimal Winter', blurb: 'Clean layering, muted cool tones, quiet cold-weather practicality',
    inspiration: 'Toronto winter minimalist wardrobe',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'text-only', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'underline', logoShape: 'square',
    palette: { bg: '#F5F6F7', ink: '#1A1D21', accent: '#3D5A80', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(180deg, #e8eaec 0%, #f5f6f7 100%)',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=900&fit=crop',
  },
  {
    id: 'vancouver-rain', name: 'Vancouver Rain Coast', blurb: 'Technical outerwear, moss and slate tones, coastal-rainforest calm',
    inspiration: 'Pacific Northwest rain-coast technical wear',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed-dark', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'underline', logoShape: 'square',
    palette: { bg: '#EEF1EC', ink: '#1B211C', accent: '#3E6B52', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #1b211c 0%, #2a332b 60%, #3e6b5222 100%)',
    previewImage: 'https://images.unsplash.com/photo-1558171813-7fa2b10c2135?w=1200&h=900&fit=crop',
  },
  {
    id: 'montreal-bistro', name: 'Montreal Bistro Chic', blurb: 'French-inflected polish, warm brasserie tones, old-port charm',
    inspiration: 'Montreal Old-Port bistro-district style',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'playfair',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F8F3EC', ink: '#241C14', accent: '#8C2E22', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(180deg, #eee2d1 0%, #f8f3ec 100%)',
    previewImage: 'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?w=1200&h=900&fit=crop',
  },

  {
    id: 'chicago-industrial', name: 'Chicago Industrial Loft', blurb: 'Exposed brick tones, workwear denim, converted-warehouse edge',
    inspiration: 'Chicago industrial-loft workwear revival',
    layout: 'grid', density: 'dense', decoration: 'none', hero: 'text-only', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#EFE9E2', ink: '#221B15', accent: '#A8452C', card: '#F7F3ED' },
    heroGradient: 'linear-gradient(180deg, #ded2c2 0%, #efe9e2 100%)',
    previewImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&h=900&fit=crop',
  },
  {
    id: 'austin-cowboy', name: 'Austin Cowboy Modern', blurb: 'Western tailoring, sun-baked leather, live-music-town swagger',
    inspiration: 'Austin, Texas modern western wardrobe',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed', font: 'bebas',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'display', navStyle: 'underline', logoShape: 'square',
    palette: { bg: '#F5EEE1', ink: '#241A10', accent: '#A8402A', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #d9b98c 0%, #c08e5c 50%, #a8402a22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&h=900&fit=crop',
  },
  {
    id: 'nashville-denim', name: 'Nashville Denim & Boots', blurb: 'Rugged denim, tooled leather boots, honky-tonk heritage',
    inspiration: 'Nashville country-music wardrobe tradition',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed-dark', font: 'bebas',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'display', navStyle: 'underline', logoShape: 'square',
    palette: { bg: '#F2EAD9', ink: '#221A10', accent: '#7A2E22', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #221a10 0%, #35281a 60%, #7a2e2222 100%)',
    previewImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&h=900&fit=crop',
  },
  {
    id: 'portland-indie', name: 'Portland Indie Craft', blurb: 'Hand-dyed textiles, flannel layering, maker-market authenticity',
    inspiration: 'Portland indie-craft maker culture',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed', font: 'raleway',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F3EFE6', ink: '#221F19', accent: '#4A6B3E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(180deg, #e2ddc9 0%, #f3efe6 100%)',
    previewImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=900&fit=crop',
  },
  {
    id: 'seattle-grunge', name: 'Seattle Grunge Revival', blurb: 'Flannel layers, muted rain-cloud tones, 90s unbothered cool',
    inspiration: '1990s Seattle grunge music-scene style',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed-dark', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'minimal', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#16181A', ink: '#E7E7E4', accent: '#8A5A3B', card: '#202325' },
    heroGradient: 'linear-gradient(160deg, #16181a 0%, #202325 60%, #8a5a3b22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1551232864-3f0890e1776c?w=1200&h=900&fit=crop',
  },

  {
    id: 'honolulu-aloha', name: 'Honolulu Aloha Print', blurb: 'Bold floral aloha shirts, tropical brights, island hospitality',
    inspiration: 'Hawaiian aloha-shirt tradition',
    layout: 'grid', density: 'normal', decoration: 'rounded', hero: 'full-bleed', font: 'nunito',
    heroDecoration: 'none', categoryDisplay: 'circles', headingStyle: 'rounded', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#FFF9EF', ink: '#1C2E22', accent: '#E0483F', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #e0483f22 0%, #1c6b5522 50%, #f2b70522 100%)',
    previewImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=900&fit=crop',
  },
  {
    id: 'santafe-adobe', name: 'Santa Fe Desert Adobe', blurb: 'Sun-baked adobe pink, turquoise accent, high-desert stillness',
    inspiration: 'Santa Fe, New Mexico adobe architecture and Southwest craft',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'fraunces',
    heroDecoration: 'blob-dots', categoryDisplay: 'tiles', headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F3E7DC', ink: '#2A1D14', accent: '#2E8B8B', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #d9a98c 0%, #c98868 50%, #2e8b8b22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1200&h=900&fit=crop',
  },
  {
    id: 'neworleans-jazz', name: 'New Orleans Jazz Velvet', blurb: 'Deep velvet jewel tones, brass-band gold, French Quarter romance',
    inspiration: 'New Orleans jazz-age French Quarter style',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed-dark', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'tiles', headingStyle: 'luxury', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#160F16', ink: '#EFE6EF', accent: '#B08B2E', card: '#221A22' },
    heroGradient: 'linear-gradient(160deg, #160f16 0%, #221a22 60%, #b08b2e22 100%)',
    previewImage: 'https://images.unsplash.com/photo-1558171813-7fa2b10c2135?w=1200&h=900&fit=crop',
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
  {
    // Fourth flagship theme — pivot to Indian Instagram/D2C-seller context.
    // Demo brand "MELA" — a bazaar/bargain marketplace, not a boutique.
    // Signature mechanic: "Make an Offer", a real haggling exchange with a
    // deterministic price floor. Lives at /store/mela.
    id: 'april',
    name: 'April — The Bazaar',
    blurb: 'Flagship theme #4: bazaar marketplace, AI haggling — make an offer, get a real counter (demo brand: MELA)',
    inspiration: 'Sarojini Nagar / Colaba street-market energy',
    layout: 'grid', density: 'dense', decoration: 'badges', hero: 'full-bleed', font: 'spacegrotesk',
    heroDecoration: 'none', categoryDisplay: 'tiles',
    headingStyle: 'display', navStyle: 'pill', logoShape: 'square',
    palette: { bg: '#FFF4F8', ink: '#1A1A1A', accent: '#E6007A', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #E6007A22 0%, #FFB80022 50%, #00A9A522 100%)',
    previewImage: '/mela/products/anarkali-3pc-set.jpg',
  },
  {
    // Fifth flagship theme. Demo brand "TAANA" — quiet-luxury heritage
    // handloom, the opposite energy of MELA's bazaar. Signature mechanic:
    // "The Weaver's Note", an AI-generated provenance story per weave.
    // Lives at /store/taana.
    id: 'may',
    name: 'May — The Weaver’s Note',
    blurb: 'Flagship theme #5: heritage handloom, AI writes each weave’s provenance story (demo brand: TAANA)',
    inspiration: 'Banarasi / Kanjivaram / Ikat / Chanderi weaving traditions',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'tiles',
    headingStyle: 'luxury', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F5F0E6', ink: '#1F3A5F', accent: '#B5502C', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #1F3A5F22 0%, #F5F0E6 60%, #C9A66722 100%)',
    previewImage: '/taana/products/banarasi-silk-saree-indigo.jpg',
  },
  {
    // Sixth flagship theme. Demo brand "SAAJ" — wedding/occasion specialist,
    // first theme with real menswear. Signature mechanic: "Function Planner",
    // a multi-step wizard planning outfits per shaadi function. Extra route
    // at /store/[slug]/planner. Lives at /store/saaj.
    id: 'june',
    name: 'June — The Function Planner',
    blurb: 'Flagship theme #6: wedding-function AI planner across Mehendi/Sangeet/Haldi/Reception (demo brand: SAAJ)',
    inspiration: 'Indian multi-function wedding season',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed', font: 'playfair',
    heroDecoration: 'none', categoryDisplay: 'tiles',
    headingStyle: 'serif', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#FFF8F0', ink: '#2A1420', accent: '#C6115B', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #C6115B22 0%, #D4A94C22 60%, #1B5E4A22 100%)',
    previewImage: '/saaj/products/emerald-reception-lehenga.jpg',
  },
  {
    // Seventh flagship theme — the literal Instagram-clone storefront
    // explicitly requested: stories bar, feed of posts-as-products,
    // double-tap-to-like, DM-to-buy. An original UI inspired by that app
    // genre, not a copy of Meta's branding. Demo brand "SCROLL", lives at
    // /store/scroll.
    id: 'july',
    name: 'July — Shop Like You Scroll',
    blurb: 'Flagship theme #7: literal Instagram-style feed — stories, double-tap-to-like, DM to buy (demo brand: SCROLL)',
    inspiration: 'Social-feed shopping UX, UGC photography',
    layout: 'feed', density: 'normal', decoration: 'none', hero: 'full-bleed-dark', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles',
    headingStyle: 'minimal', navStyle: 'ghost', logoShape: 'circle',
    palette: { bg: '#FFFFFF', ink: '#0D0D0D', accent: '#FF5864', card: '#FAFAFA' },
    heroGradient: 'linear-gradient(135deg, #FF586422 0%, #7B2FF722 100%)',
    previewImage: '/scroll/products/wrap-dress.jpg',
  },
  {
    // Eighth flagship theme. Demo brand "DHAMAKA" — hyper-deal flash-sale
    // hype (Big Billion Days energy). Signature mechanic: "Price Radar",
    // computed from real fixed price-history data, never random. Lives at
    // /store/dhamaka.
    id: 'august',
    name: 'August — Ends When It Ends',
    blurb: 'Flagship theme #8: flash-sale hype, AI price-drop radar computed from real history (demo brand: DHAMAKA)',
    inspiration: 'Big Billion Days / mega-sale urgency',
    layout: 'grid', density: 'dense', decoration: 'stickers', hero: 'banner-strip', font: 'bebas',
    heroDecoration: 'none', categoryDisplay: 'circles',
    headingStyle: 'display', navStyle: 'pill', logoShape: 'square',
    palette: { bg: '#FFF9E6', ink: '#121212', accent: '#E11D2E', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #E11D2E22 0%, #FFD40022 100%)',
    previewImage: '/dhamaka/products/bodycon-mini-dress.jpg',
  },
  {
    // Ninth flagship theme. Demo brand "AARAM" — cozy WFH/loungewear
    // comfort, calm and unhurried. Signature mechanic: "Day Match", an AI
    // day-type recommender (structurally similar to Ember's Mood Match, but
    // the axis is schedule/day-type, not feeling). Lives at /store/aaram.
    id: 'september',
    name: 'September — Day Match',
    blurb: 'Flagship theme #9: cozy WFH loungewear, AI matches outfit to your day-type (demo brand: AARAM)',
    inspiration: 'Work-from-home comfort culture',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'text-only', font: 'nunito',
    heroDecoration: 'blob-dots', categoryDisplay: 'tiles',
    headingStyle: 'rounded', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#F3ECE3', ink: '#3A342C', accent: '#C08B6C', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(135deg, #C08B6C22 0%, #8A9A7E22 100%)',
    previewImage: '/aaram/products/textured-co-ord.jpg',
  },
  {
    // Tenth flagship theme. Demo brand "UTSAV" — Diwali/festival gifting,
    // shopping FOR someone else. Signature mechanic: "Gift Finder", AI
    // curates a bundle from a description of the recipient + budget. Extra
    // route at /store/[slug]/gift-finder. Lives at /store/utsav.
    id: 'october',
    name: 'October — The Gift Finder',
    blurb: 'Flagship theme #10: festival gifting, AI builds a gift bundle from who you’re buying for (demo brand: UTSAV)',
    inspiration: 'Diwali gifting season',
    layout: 'grid', density: 'normal', decoration: 'badges', hero: 'full-bleed', font: 'fraunces',
    heroDecoration: 'none', categoryDisplay: 'tiles',
    headingStyle: 'serif', navStyle: 'pill', logoShape: 'circle',
    palette: { bg: '#FFF6E9', ink: '#3B1E0F', accent: '#A8193B', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #A8193B22 0%, #D4AF3722 60%, #E67E2222 100%)',
    previewImage: '/utsav/products/diwali-deluxe-hamper.jpg',
  },
  {
    // Eleventh flagship theme. Demo brand "GALLI" — Gen-Z streetwear
    // drop culture, India edition. Signature mechanics: "Drop Radar"
    // (countdown + waitlist) and "Caption This Fit" (AI meme captions).
    // Lives at /store/galli.
    id: 'november',
    name: 'November — Drop Radar',
    blurb: 'Flagship theme #11: streetwear drop culture, countdown + AI meme captions (demo brand: GALLI)',
    inspiration: 'Gen-Z hype/drop culture, India streetwear',
    layout: 'grid', density: 'dense', decoration: 'stickers', hero: 'full-bleed-dark', font: 'bebas',
    heroDecoration: 'none', categoryDisplay: 'circles',
    headingStyle: 'display', navStyle: 'pill', logoShape: 'square',
    palette: { bg: '#0D0D0D', ink: '#F0F0F0', accent: '#B6FF3C', card: '#181818' },
    heroGradient: 'linear-gradient(160deg, #0D0D0D 0%, #181818 60%, #B6FF3C22 100%)',
    previewImage: '/galli/products/ghost-logo-hoodie.jpg',
  },
  {
    // Twelfth and final flagship theme. Demo brand "KIRAYA" — the most
    // structurally different of all twelve: a RENTAL marketplace, not a
    // purchase one. Signature mechanic: "Rent for the Date", picks an event
    // date, computes a rental window, checks simulated availability. Lives
    // at /store/kiraya.
    id: 'december',
    name: 'December — Rent for the Date',
    blurb: 'Flagship theme #12: rent occasion-wear for one event instead of buying it (demo brand: KIRAYA)',
    inspiration: 'Occasion-wear rental — wear it once, return it happy',
    layout: 'grid', density: 'airy', decoration: 'none', hero: 'full-bleed-dark', font: 'cormorant',
    heroDecoration: 'none', categoryDisplay: 'tiles',
    headingStyle: 'luxury', navStyle: 'ghost', logoShape: 'square',
    palette: { bg: '#2A1730', ink: '#F0E9E2', accent: '#C6A15B', card: '#3D1E3F' },
    heroGradient: 'linear-gradient(160deg, #2A1730 0%, #3D1E3F 60%, #C6A15B22 100%)',
    previewImage: '/kiraya/products/royal-plum-silk-lehenga.jpg',
  },
  {
    // First of three "Insta" themes — reachable via the dedicated /insta
    // landing page for Instagram sellers, not the monthly gallery. Demo
    // brand "REEL RACK": a clean, category-driven commercial storefront
    // (sale badges, wishlist) where product videos (imported Reels) play
    // natively on cards/PDP wherever a product has one.
    id: 'reelrack',
    name: 'Reel Rack — Every Reel, On the Rack',
    blurb: 'Insta theme: clean, category-driven storefront with sale badges, wishlist, and native reel/video product playback',
    inspiration: 'Polished ethnic/fashion D2C storefronts (sale badges, wishlist, category nav)',
    layout: 'grid', density: 'normal', decoration: 'badges', hero: 'full-bleed-dark', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'tiles',
    headingStyle: 'display', navStyle: 'pill', logoShape: 'square',
    palette: { bg: '#FFF9F5', ink: '#241419', accent: '#B0234B', card: '#FFFFFF' },
    heroGradient: 'linear-gradient(160deg, #B0234B22 0%, #FFF9F5 70%)',
    previewImage: '/reelrack/products/wine-wrap-midi-dress.jpg',
  },
  {
    // Second "Insta" theme. Demo brand "THE GRID": a classic 3-column
    // IG-profile-style square grid where product videos autoplay in-grid.
    id: 'thegrid',
    name: 'The Grid — Shop the Grid, Not the Feed',
    blurb: 'Insta theme: classic 3-column IG-profile square grid with autoplay-in-grid video',
    inspiration: 'Instagram profile grid browsing',
    layout: 'grid', density: 'dense', decoration: 'none', hero: 'text-only', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'circles',
    headingStyle: 'minimal', navStyle: 'underline', logoShape: 'circle',
    palette: { bg: '#FFFFFF', ink: '#000000', accent: '#C13584', card: '#FAFAFA' },
    heroGradient: 'linear-gradient(135deg, #C1358522 0%, #FFFFFF 70%)',
    previewImage: '/thegrid/products/black-slip-midi-dress.jpg',
  },
  {
    // Third "Insta" theme. Demo brand "TRY IT ON": a normal catalog grid,
    // but every PDP defaults to the seller's reel playing instead of a
    // photo, with an explicit Photo/Video toggle.
    id: 'tryiton',
    name: 'Try It On — See It Move Before You Buy',
    blurb: 'Insta theme: normal catalog browsing, but every product page defaults to the reel playing instead of a photo',
    inspiration: 'Video-first product pages',
    layout: 'grid', density: 'normal', decoration: 'none', hero: 'full-bleed-dark', font: 'inter',
    heroDecoration: 'none', categoryDisplay: 'tiles',
    headingStyle: 'display', navStyle: 'pill', logoShape: 'square',
    palette: { bg: '#141116', ink: '#F5F0EC', accent: '#FF6B4A', card: '#1E1A21' },
    heroGradient: 'linear-gradient(160deg, #FF6B4A22 0%, #141116 70%)',
    previewImage: '/tryiton/products/sequin-bodycon-dress.jpg',
  },
]

export function getTheme(id: string | null | undefined): Theme {
  return THEMES.find(t => t.id === id) ?? THEMES[0]
}

// Flagship theme ids (calendar months) map to a fictional showcase brand's
// demo route — the only place a seller can preview the real bespoke
// component tree before picking the theme for their own store. The generic
// `/store/demo?theme=` override only ever recolors the shared grid renderer,
// so it can't stand in for these — see the slug-based bypass in
// store/[slug]/layout.tsx.
export const FLAGSHIP_DEMO_SLUG: Record<string, string> = {
  reelrack: 'reelrack',
  thegrid: 'thegrid',
  tryiton: 'tryiton',
  january: 'august',
  february: 'ember',
  march: 'bloom',
  april: 'mela',
  may: 'taana',
  june: 'saaj',
  july: 'scroll',
  august: 'dhamaka',
  september: 'aaram',
  october: 'utsav',
  november: 'galli',
  december: 'kiraya',
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
