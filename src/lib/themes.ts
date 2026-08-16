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
