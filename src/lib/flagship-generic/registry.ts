// Registry of bespoke-tier flagship stores built on the generic component
// kit (GenericShell/Header/Footer/ProductCard/ShopGrid/Home/PDP/CartDrawer/
// Checkout + a real signature mechanic) — each entry gets its own real route
// slug, brand identity, catalog, and interactive mechanic, the same
// experience shape as AUGUST/EMBER/etc. without a hand-written component
// tree per brand. Built in passes of 10; add more entries here as later
// passes land — nothing else needs to change per new entry except the slug
// checks in layout.tsx/page.tsx/shop/page.tsx/product/[productId]/page.tsx/
// checkout/page.tsx, which read this same registry.
import { THEMES } from '@/lib/themes'
import { FONTS } from '@/lib/constants'
import { FLAGSHIP_DEMO_CONTENT } from '@/lib/flagship-demo-content'
import { productToThemeProduct } from '@/lib/flagship/adapters'
import type { FlagshipEntry, MechanicType } from './types'

interface MechanicSpec { type: MechanicType; label: string; intro: string }

// Built in passes of 10 (see comment banners below). Mechanic choice matches
// each brand's actual character (a quiet-minimal brand gets a fit quiz, not
// a hype countdown; a streetwear/resort-adjacent one gets a drop countdown).
const MECHANICS: Record<string, MechanicSpec> = {
  // Pass 1
  'coastal-linen': { type: 'stylist', label: 'Ask the Stylist', intro: 'Tell us where you\'re headed and we\'ll pull looks from the collection.' },
  'prairie-cottagecore': { type: 'quiz', label: 'Find My Fit', intro: 'Three quick questions — we\'ll shortlist your pieces.' },
  'scandi-minimal': { type: 'quiz', label: 'Find My Fit', intro: 'Answer three questions for a considered shortlist.' },
  'wabi-sabi': { type: 'stylist', label: 'Ask the Stylist', intro: 'Describe the moment you\'re dressing for — we\'ll suggest pieces that fit its quiet.' },
  'alpine-lodge': { type: 'loyalty', label: 'Lodge Rewards', intro: 'Every stay in the collection earns toward your next one.' },
  'desert-boho': { type: 'stylist', label: 'Ask the Stylist', intro: 'Tell us the trip, the vibe, the plan — we\'ll build the look.' },
  'tropical-resort': { type: 'countdown', label: 'Next Drop', intro: 'A new resort capsule is landing soon — get notified first.' },
  'nordic-noir': { type: 'quiz', label: 'Find My Fit', intro: 'A few questions to narrow the collection to your register.' },
  'parisian-chic': { type: 'stylist', label: 'Ask the Stylist', intro: 'Describe the occasion — we\'ll edit the collection down to what fits.' },
  'milanese-tailoring': { type: 'loyalty', label: 'Atelier Rewards', intro: 'Return clients earn toward bespoke tailoring credit.' },

  // Pass 2
  'tokyo-streetstyle': { type: 'quiz', label: 'Find My Fit', intro: 'Three quick questions to narrow the layers to your size and budget.' },
  'seoul-y2k': { type: 'countdown', label: 'Drop Radar', intro: 'The next Y2K capsule is loading — get on the list before it sells out.' },
  'london-punk': { type: 'countdown', label: 'Drop Radar', intro: 'A new tartan restock is coming — get notified the second it lands.' },
  'berlin-utilitarian': { type: 'quiz', label: 'Find My Fit', intro: 'Answer three questions — we\'ll shortlist the utility pieces that fit.' },
  'nyc-grunge': { type: 'stylist', label: 'Ask the Stylist', intro: 'Tell us the vibe you\'re going for and we\'ll pull from the rack.' },
  'la-skate': { type: 'countdown', label: 'Drop Radar', intro: 'Next board-season drop incoming — get on the list.' },
  'miami-vice': { type: 'stylist', label: 'Ask the Stylist', intro: 'Describe the night out — we\'ll build the look.' },
  'southern-prep': { type: 'loyalty', label: 'Garden Club Rewards', intro: 'Every order earns toward your next garden-party look.' },
  'ivy-varsity': { type: 'loyalty', label: 'Campus Rewards', intro: 'Alumni and current members both earn toward crest-collection credit.' },
  'countryside-tweed': { type: 'stylist', label: 'Ask the Estate Stylist', intro: 'Tell us the occasion — shoot, dinner, or a walk through the grounds.' },

  // Pass 3
  'highland-tartan': { type: 'loyalty', label: 'Clan Rewards', intro: 'Members earn toward the next clan-tartan commission.' },
  'andalusian-flamenco': { type: 'stylist', label: 'Ask the Stylist', intro: 'Tell us the occasion — we\'ll set the mood in ruffle and red.' },
  'moroccan-souk': { type: 'stylist', label: 'Ask the Stylist', intro: 'Describe the evening — we\'ll pull from the souk shelves.' },
  'indian-block-print': { type: 'stylist', label: 'Ask the Artisan', intro: 'Tell us the occasion — we\'ll match a hand-block print to it.' },
  'balinese-batik': { type: 'quiz', label: 'Find My Fit', intro: 'Three questions to shortlist your batik pieces.' },
  'outback': { type: 'quiz', label: 'Find My Fit', intro: 'Tell us what you need it for — we\'ll narrow the kit down.' },
  'icelandic-wool': { type: 'loyalty', label: 'Wool Club Rewards', intro: 'Every knit earns toward your next lopapeysa.' },
  'swiss-precision': { type: 'quiz', label: 'Find My Fit', intro: 'Three questions for a considered, exact shortlist.' },
  'dutch-design': { type: 'countdown', label: 'Drop Radar', intro: 'A new color-block capsule is landing soon.' },
  'danish-hygge': { type: 'loyalty', label: 'Hygge Rewards', intro: 'Every cozy order earns toward your next one.' },

  // Pass 4
  'bauhaus': { type: 'quiz', label: 'Find My Fit', intro: 'Three questions to match you to the right geometry.' },
  'italian-riviera': { type: 'stylist', label: 'Ask the Stylist', intro: 'Tell us the coast, the plan — we\'ll pull the stripes.' },
  'greek-island': { type: 'stylist', label: 'Ask the Stylist', intro: 'Describe the trip — we\'ll edit down to whitewashed essentials.' },
  'cycladic-blue': { type: 'loyalty', label: 'Aegean Rewards', intro: 'Every order earns toward your next Aegean piece.' },
  'provencal-lavender': { type: 'stylist', label: 'Ask the Stylist', intro: 'Tell us the occasion — we\'ll pull from the lavender fields.' },
  'tuscan-terracotta': { type: 'stylist', label: 'Ask the Stylist', intro: 'Describe the setting — we\'ll match the clay tones to it.' },
  'amalfi-citrus': { type: 'countdown', label: 'Drop Radar', intro: 'A new citrus capsule is landing soon — get notified.' },
  'portuguese-azulejo': { type: 'quiz', label: 'Find My Fit', intro: 'Three questions to shortlist your tile-print pieces.' },
  'copenhagen-street': { type: 'quiz', label: 'Find My Fit', intro: 'Three quick questions for a considered shortlist.' },
  'amsterdam-bike': { type: 'loyalty', label: 'Canal Rewards', intro: 'Every ride-ready order earns toward your next one.' },

  // Pass 5
  'zurich-corporate': { type: 'loyalty', label: 'Bahnhofstrasse Rewards', intro: 'Every tailored order earns toward your next fitting.' },
  'vienna-secession': { type: 'stylist', label: 'Ask the Stylist', intro: 'Describe the evening — we\'ll bring the gold leaf to it.' },
  'prague-gothic': { type: 'stylist', label: 'Ask the Stylist', intro: 'Tell us the mood — we\'ll pull from the velvet racks.' },
  'budapest-ruinbar': { type: 'countdown', label: 'Drop Radar', intro: 'A new reclaimed-material capsule is landing soon.' },
  'warsaw-brutalist': { type: 'quiz', label: 'Find My Fit', intro: 'Three questions to match the right silhouette.' },
  'moscow-constructivist': { type: 'countdown', label: 'Drop Radar', intro: 'The next bold-geometry drop is coming — get on the list.' },
  'kyoto-zen': { type: 'stylist', label: 'Ask the Stylist', intro: 'Describe the moment — we\'ll suggest something quiet.' },
  'osaka-neon': { type: 'countdown', label: 'Drop Radar', intro: 'A new neon-arcade capsule is loading — get notified.' },
  'shanghai-artdeco': { type: 'loyalty', label: 'Bund Rewards', intro: 'Every order earns toward your next gilded piece.' },
  'hongkong-neonnoir': { type: 'countdown', label: 'Drop Radar', intro: 'The next after-dark capsule is coming — get on the list.' },

  // Pass 6
  'singapore-tropical': { type: 'quiz', label: 'Find My Fit', intro: 'Three questions to match the humidity-ready pieces to you.' },
  'bangkok-night-market': { type: 'countdown', label: 'Drop Radar', intro: 'A new market capsule is landing soon — get notified.' },
  'manila-jeepney': { type: 'countdown', label: 'Drop Radar', intro: 'The next chrome-and-color drop is coming.' },
  'jakarta-batik': { type: 'stylist', label: 'Ask the Stylist', intro: 'Tell us the occasion — we\'ll match the batik to it.' },
  'mumbai-bollywood': { type: 'stylist', label: 'Ask the Stylist', intro: 'Describe the event — we\'ll bring the drama to it.' },
  'delhi-durbar': { type: 'loyalty', label: 'Durbar Rewards', intro: 'Every order earns toward your next zari piece.' },
  'kolkata-colonial': { type: 'stylist', label: 'Ask the Stylist', intro: 'Tell us the occasion — we\'ll pull from the archive.' },
  'chennai-templesilk': { type: 'loyalty', label: 'Temple Silk Rewards', intro: 'Every saree order earns toward your next Kanjivaram.' },
  'bengaluru-tech': { type: 'quiz', label: 'Find My Fit', intro: 'Three questions to match your commute-to-dinner wardrobe.' },
  'karachi-chikankari': { type: 'stylist', label: 'Ask the Artisan', intro: 'Tell us the occasion — we\'ll match the embroidery to it.' },

  // Pass 7
  'lahore-mughal': { type: 'loyalty', label: 'Darbar Rewards', intro: 'Every order earns toward your next brocade commission.' },
  'dhaka-handloom': { type: 'stylist', label: 'Ask the Weaver', intro: 'Tell us the occasion — we\'ll match a handloom weave to it.' },
  'colombo-ceylon': { type: 'quiz', label: 'Find My Fit', intro: 'Three questions to shortlist your estate pieces.' },
  'kathmandu-himalayan': { type: 'stylist', label: 'Ask the Stylist', intro: 'Tell us where you\'re headed — we\'ll pack the layers.' },
  'cairo-souk-gold': { type: 'stylist', label: 'Ask the Stylist', intro: 'Describe the evening — we\'ll bring the gold to it.' },
  'marrakech-riad': { type: 'stylist', label: 'Ask the Stylist', intro: 'Tell us the mood — we\'ll pull from the courtyard shelves.' },
  'nairobi-maasai': { type: 'quiz', label: 'Find My Fit', intro: 'Three questions to shortlist your beadwork pieces.' },
  'lagos-ankara': { type: 'countdown', label: 'Drop Radar', intro: 'A new Ankara capsule is landing soon — get notified.' },
  'accra-kente': { type: 'loyalty', label: 'Kente Rewards', intro: 'Every order earns toward your next ceremonial piece.' },
  'capetown-safari': { type: 'quiz', label: 'Find My Fit', intro: 'Three questions to match the trip ahead of you.' },

  // Pass 8
  'rio-carnival': { type: 'countdown', label: 'Drop Radar', intro: 'The next feathered capsule is coming — get on the list.' },
  'saopaulo-concrete': { type: 'quiz', label: 'Find My Fit', intro: 'Three questions to match the right silhouette.' },
  'buenosaires-tango': { type: 'stylist', label: 'Ask the Stylist', intro: 'Tell us the night ahead — we\'ll bring the drama to it.' },
  'bogota-andean': { type: 'quiz', label: 'Find My Fit', intro: 'Three questions to shortlist your woven pieces.' },
  'lima-alpaca': { type: 'loyalty', label: 'Andes Rewards', intro: 'Every order earns toward your next alpaca piece.' },
  'havana-chrome': { type: 'stylist', label: 'Ask the Stylist', intro: 'Describe the evening — we\'ll bring the pastel chrome to it.' },
  'mexicocity-talavera': { type: 'countdown', label: 'Drop Radar', intro: 'A new Talavera capsule is landing soon.' },
  'toronto-minimal': { type: 'quiz', label: 'Find My Fit', intro: 'Three questions for a clean, considered shortlist.' },
  'vancouver-rain': { type: 'quiz', label: 'Find My Fit', intro: 'Three questions to match the weather ahead of you.' },
  'montreal-bistro': { type: 'stylist', label: 'Ask the Stylist', intro: 'Tell us the evening — we\'ll bring the bistro polish to it.' },

  // Pass 9
  'chicago-industrial': { type: 'quiz', label: 'Find My Fit', intro: 'Three questions to match the right denim and cut.' },
  'austin-cowboy': { type: 'stylist', label: 'Ask the Stylist', intro: 'Tell us the night out — we\'ll bring the western swagger.' },
  'nashville-denim': { type: 'loyalty', label: 'Honky Tonk Rewards', intro: 'Every order earns toward your next tooled-leather piece.' },
  'portland-indie': { type: 'stylist', label: 'Ask the Maker', intro: 'Tell us the occasion — we\'ll match a hand-dyed piece to it.' },
  'seattle-grunge': { type: 'countdown', label: 'Drop Radar', intro: 'A new flannel-layer restock is coming — get notified.' },
  'honolulu-aloha': { type: 'countdown', label: 'Drop Radar', intro: 'A new aloha-print capsule is landing soon.' },
  'santafe-adobe': { type: 'stylist', label: 'Ask the Stylist', intro: 'Describe the setting — we\'ll match the desert tones to it.' },
  'neworleans-jazz': { type: 'loyalty', label: 'French Quarter Rewards', intro: 'Every order earns toward your next velvet piece.' },
}

function buildEntry(themeId: string): FlagshipEntry | null {
  const theme = THEMES.find(t => t.id === themeId)
  const demo = FLAGSHIP_DEMO_CONTENT[themeId]
  const mech = MECHANICS[themeId]
  if (!theme || !demo || !mech) return null

  return {
    slug: themeId,
    brand: {
      name: demo.brandName,
      tagline: demo.tagline,
      description: `${demo.brandName} — ${demo.tagline}`,
      slug: themeId,
      currency: 'USD',
      categories: demo.categories,
      sellerId: null,
      whatsappNumber: null,
      instagramHandle: null,
      paymentMethod: null,
      razorpayAvailable: false,
    },
    products: demo.products.map(productToThemeProduct),
    palette: theme.palette,
    font: FONTS[theme.font as keyof typeof FONTS]?.label ?? 'Inter',
    headingWeight: 800,
    mechanic: mech.type,
    mechanicLabel: mech.label,
    mechanicIntro: mech.intro,
  }
}

const REGISTERED_SLUGS = Object.keys(MECHANICS)

export const FLAGSHIP_REGISTRY: Record<string, FlagshipEntry> = Object.fromEntries(
  REGISTERED_SLUGS.map(id => [id, buildEntry(id)]).filter((pair): pair is [string, FlagshipEntry] => pair[1] !== null)
)
