import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { FONTS } from '@/lib/constants'
import { getTheme, HEADING_TYPE, LOGO_RADIUS } from '@/lib/themes'
import type { TenantConfig } from '@/lib/types'
import { PreviewBanner } from '@/components/store/PreviewBanner'
import { AugustShell } from '@/components/august/AugustShell'
import { AUGUST_BRAND } from '@/lib/august/catalog'
import { EmberShell } from '@/components/ember/EmberShell'
import { EMBER_BRAND } from '@/lib/ember/catalog'
import { BloomShell } from '@/components/bloom/BloomShell'
import { BLOOM_BRAND } from '@/lib/bloom/catalog'
import { MelaShell } from '@/components/mela/MelaShell'
import { MELA_BRAND } from '@/lib/mela/catalog'
import { TaanaShell } from '@/components/taana/TaanaShell'
import { TAANA_BRAND } from '@/lib/taana/catalog'
import { SaajShell } from '@/components/saaj/SaajShell'
import { SAAJ_BRAND } from '@/lib/saaj/catalog'
import { ScrollShell } from '@/components/scroll/ScrollShell'
import { SCROLL_BRAND } from '@/lib/scroll/catalog'
import { DhamakaShell } from '@/components/dhamaka/DhamakaShell'
import { DHAMAKA_BRAND } from '@/lib/dhamaka/catalog'
import { AaramShell } from '@/components/aaram/AaramShell'
import { AARAM_BRAND } from '@/lib/aaram/catalog'
import { UtsavShell } from '@/components/utsav/UtsavShell'
import { UTSAV_BRAND } from '@/lib/utsav/catalog'
import { GalliShell } from '@/components/galli/GalliShell'
import { GALLI_BRAND } from '@/lib/galli/catalog'
import { KirayaShell } from '@/components/kiraya/KirayaShell'
import { KIRAYA_BRAND } from '@/lib/kiraya/catalog'
import { ReelRackShell } from '@/components/reelrack/ReelRackShell'
import { REELRACK_BRAND } from '@/lib/reelrack/catalog'
import { TheGridShell } from '@/components/thegrid/TheGridShell'
import { THEGRID_BRAND } from '@/lib/thegrid/catalog'
import { TryItOnShell } from '@/components/tryiton/TryItOnShell'
import { TRYITON_BRAND } from '@/lib/tryiton/catalog'
import { configToThemeBrand } from '@/lib/flagship/adapters'
import { AccountLinkBubble } from '@/components/store/AccountLinkBubble'
import { FLAGSHIP_REGISTRY } from '@/lib/flagship-generic/registry'
import { GenericFlagshipShell } from '@/components/flagship-generic/GenericShell'
import { ReformationShell } from '@/components/flagship-generic/reformation-style/ReformationShell'
import { NycGrungeShell } from '@/components/flagship-generic/nyc-grunge-style/NycGrungeShell'
import { SoukShell } from '@/components/flagship-generic/moroccan-souk-style/SoukShell'
import { AdobeShell } from '@/components/flagship-generic/santafe-adobe-style/AdobeShell'
import { ResortShell } from '@/components/flagship-generic/tropical-resort-style/ResortShell'
import { NoirShell } from '@/components/flagship-generic/nordic-noir-style/NoirShell'
import { PrairieShell } from '@/components/flagship-generic/prairie-cottagecore-style/PrairieShell'
import { FjordShell } from '@/components/flagship-generic/scandi-minimal-style/FjordShell'
import { KintsugiShell } from '@/components/flagship-generic/wabi-sabi-style/KintsugiShell'
import { RiveShell } from '@/components/flagship-generic/parisian-chic-style/RiveShell'
import { SartoriaShell } from '@/components/flagship-generic/milanese-tailoring-style/SartoriaShell'
import { ShibuyaShell } from '@/components/flagship-generic/tokyo-streetstyle-style/ShibuyaShell'
import { GangnamShell } from '@/components/flagship-generic/seoul-y2k-style/GangnamShell'
import { RiotShell } from '@/components/flagship-generic/london-punk-style/RiotShell'
import { KraftShell } from '@/components/flagship-generic/berlin-utilitarian-style/KraftShell'
import { VeniceShell } from '@/components/flagship-generic/la-skate-style/VeniceShell'
import { OceanShell } from '@/components/flagship-generic/miami-vice-style/OceanShell'
import { MagnoliaShell } from '@/components/flagship-generic/southern-prep-style/MagnoliaShell'
import { CampusShell } from '@/components/flagship-generic/ivy-varsity-style/CampusShell'
import { HedgerowShell } from '@/components/flagship-generic/countryside-tweed-style/HedgerowShell'

// Fetch tenant config server-side and inject CSS variables
export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Shell wraps EVERY route under a demo slug (Home, Shop, PDP, Checkout,
  // etc. all rely on it for chrome + FlagshipCartProvider — none of those
  // pages wrap themselves), so it can't be skipped here even though this is
  // a server component with no access to ?preview_name=. Each Shell is a
  // client component that reads preview_name itself via useSearchParams()
  // and overrides brand.name internally — see e.g. AugustShell.tsx — so the
  // static *_BRAND constant passed here is just the pre-override default.
  if (slug === 'august') {
    return <AugustShell brand={AUGUST_BRAND}>{children}</AugustShell>
  }
  if (slug === 'ember') {
    return <EmberShell brand={EMBER_BRAND}>{children}</EmberShell>
  }
  if (slug === 'bloom') {
    return <BloomShell brand={BLOOM_BRAND}>{children}</BloomShell>
  }
  if (slug === 'mela') {
    return <MelaShell brand={MELA_BRAND}>{children}</MelaShell>
  }
  if (slug === 'taana') {
    return <TaanaShell brand={TAANA_BRAND}>{children}</TaanaShell>
  }
  if (slug === 'saaj') {
    return <SaajShell brand={SAAJ_BRAND}>{children}</SaajShell>
  }
  if (slug === 'scroll') {
    return <ScrollShell brand={SCROLL_BRAND}>{children}</ScrollShell>
  }
  if (slug === 'dhamaka') {
    return <DhamakaShell brand={DHAMAKA_BRAND}>{children}</DhamakaShell>
  }
  if (slug === 'aaram') {
    return <AaramShell brand={AARAM_BRAND}>{children}</AaramShell>
  }
  if (slug === 'utsav') {
    return <UtsavShell brand={UTSAV_BRAND}>{children}</UtsavShell>
  }
  if (slug === 'galli') {
    return <GalliShell brand={GALLI_BRAND}>{children}</GalliShell>
  }
  if (slug === 'kiraya') {
    return <KirayaShell brand={KIRAYA_BRAND}>{children}</KirayaShell>
  }
  if (slug === 'reelrack') {
    return <ReelRackShell brand={REELRACK_BRAND}>{children}</ReelRackShell>
  }
  if (slug === 'thegrid') {
    return <TheGridShell brand={THEGRID_BRAND}>{children}</TheGridShell>
  }
  if (slug === 'tryiton') {
    return <TryItOnShell brand={TRYITON_BRAND}>{children}</TryItOnShell>
  }

  // coastal-linen is a proof-of-concept rebuild modeled directly on
  // thereformation.com's real structure (giant overlapping wordmark hero,
  // editorial product-rail modules, sparse text nav) — a one-off override
  // ahead of FLAGSHIP_REGISTRY, same precedent as the 15 slugs above.
  if (slug === 'coastal-linen' && FLAGSHIP_REGISTRY[slug]) {
    return <ReformationShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</ReformationShell>
  }

  // nyc-grunge — modeled on aimeleondore.com (hamburger-drawer nav, live
  // dateline strip, full-bleed macro product photography, no lifestyle hero).
  if (slug === 'nyc-grunge' && FLAGSHIP_REGISTRY[slug]) {
    return <NycGrungeShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</NycGrungeShell>
  }

  // moroccan-souk — modeled on freepeople.com (prominent search bar, 2x2
  // collage promo grid, alternating full-bleed category banners).
  if (slug === 'moroccan-souk' && FLAGSHIP_REGISTRY[slug]) {
    return <SoukShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</SoukShell>
  }

  // santafe-adobe — modeled on shopdoen.com (refined serif nav, full-bleed
  // vintage-editorial photo stack with flourish dividers, size-run cards).
  if (slug === 'santafe-adobe' && FLAGSHIP_REGISTRY[slug]) {
    return <AdobeShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</AdobeShell>
  }

  // tropical-resort — modeled on vacation.inc (VHS-grain hero, cursive
  // script logo, star-rating social proof, folded-corner promo badge).
  if (slug === 'tropical-resort' && FLAGSHIP_REGISTRY[slug]) {
    return <ResortShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</ResortShell>
  }

  // nordic-noir — a faithful clone of norseprojects.com: transparent-to-
  // solid nav, no-headline hero, asymmetric editorial sections with real
  // material/construction copywriting instead of marketing headlines.
  if (slug === 'nordic-noir' && FLAGSHIP_REGISTRY[slug]) {
    return <NoirShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</NoirShell>
  }

  // prairie-cottagecore — a faithful clone of loveshackfancy.com (two-tier
  // nav, mixed serif+script headline, pink category-tile section, floral-
  // bordered brand-moment panel).
  if (slug === 'prairie-cottagecore' && FLAGSHIP_REGISTRY[slug]) {
    return <PrairieShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</PrairieShell>
  }

  // scandi-minimal — a faithful clone of arket.com (always-visible search
  // bar, plain-text category list, journal/editorial section with real
  // long-form writing before any product grid).
  if (slug === 'scandi-minimal' && FLAGSHIP_REGISTRY[slug]) {
    return <FjordShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</FjordShell>
  }

  // wabi-sabi — a faithful clone of toa.st (quiet "Menu"/"Bag" text chrome,
  // split two-column hero with boxed text-link CTAs, seasonal poetic
  // editorial passage, craft/maker magazine section).
  if (slug === 'wabi-sabi' && FLAGSHIP_REGISTRY[slug]) {
    return <KintsugiShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</KintsugiShell>
  }

  // parisian-chic — a faithful clone of sezane.com (icon-only header with
  // no text labels, category-tile hero grid with centered white serif
  // labels instead of a headline, members'-circle editorial section).
  if (slug === 'parisian-chic' && FLAGSHIP_REGISTRY[slug]) {
    return <RiveShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</RiveShell>
  }

  // milanese-tailoring — a faithful clone of loropiana.com (rotating
  // service announcement strip, hero with a bottom white card and
  // em-dash category links, "The Look" material-tagged outfit section).
  if (slug === 'milanese-tailoring' && FLAGSHIP_REGISTRY[slug]) {
    return <SartoriaShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</SartoriaShell>
  }

  // tokyo-streetstyle — a faithful clone of shop.doverstreetmarket.com
  // (house-crest icon, massive bold condensed wordmark, plain text-only
  // nav labels with no icon glyphs, 2-column campaign blocks with the
  // caption below the image rather than overlaid).
  if (slug === 'tokyo-streetstyle' && FLAGSHIP_REGISTRY[slug]) {
    return <ShibuyaShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</ShibuyaShell>
  }

  // seoul-y2k — a faithful clone of motelrocks.com (rotating marquee
  // promo strip, lowercase script wordmark, "Most Wanted" curated tile
  // row, a drop/fit-guide callout, Instagram-style UGC grid).
  if (slug === 'seoul-y2k' && FLAGSHIP_REGISTRY[slug]) {
    return <GangnamShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</GangnamShell>
  }

  // london-punk — a faithful clone of viviennewestwood.com (black promo
  // strip, orb crest above a two-line serif wordmark, Quick View hover
  // on product tiles, a punchy pull-quote section, heritage editorial).
  if (slug === 'london-punk' && FLAGSHIP_REGISTRY[slug]) {
    return <RiotShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</RiotShell>
  }

  // berlin-utilitarian — a faithful clone of acrnm.com (pure white
  // ground, stark black type, plain function-first text nav with no
  // icons, no hero — a dense grid of cryptic alphanumeric product
  // codes as the entire homepage).
  if (slug === 'berlin-utilitarian' && FLAGSHIP_REGISTRY[slug]) {
    return <KraftShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</KraftShell>
  }

  // la-skate — a faithful clone of santacruzskateboards.com (circular
  // badge-seal logo, action-photo hero with a rotating badge overlay,
  // "Customer Favorites"/"Browse X" merchandising rows per category).
  if (slug === 'la-skate' && FLAGSHIP_REGISTRY[slug]) {
    return <VeniceShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</VeniceShell>
  }

  // miami-vice — a faithful clone of trinaturk.com (bold-color promo
  // strip over a dark announcement bar, a split vivid campaign hero,
  // a "Modern Resort Lifestyle" brand-story passage, category showcase
  // blocks by product type).
  if (slug === 'miami-vice' && FLAGSHIP_REGISTRY[slug]) {
    return <OceanShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</OceanShell>
  }

  // southern-prep — a faithful clone of draperjames.com (navy promo
  // strip over cream, centered serif wordmark, a pull-quote hero, an
  // "In with the New" narrative passage, an original founder's-story
  // section closing with a family saying).
  if (slug === 'southern-prep' && FLAGSHIP_REGISTRY[slug]) {
    return <MagnoliaShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</MagnoliaShell>
  }

  // ivy-varsity — a faithful clone of rowingblazers.com (bold serif
  // wordmark, full text nav, a season-labeled campus-life hero, a
  // "Shop By Category" link row, a named collab campaign banner,
  // Quick View hover on product tiles).
  if (slug === 'ivy-varsity' && FLAGSHIP_REGISTRY[slug]) {
    return <CampusShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</CampusShell>
  }

  // countryside-tweed — a faithful clone of barbour.com (crest icon
  // above a serif wordmark with an "Established" subtitle, a split
  // monochrome campaign hero with dual CTA buttons, a "Repair Hub"
  // heritage-craft passage reframed as a mending room).
  if (slug === 'countryside-tweed' && FLAGSHIP_REGISTRY[slug]) {
    return <HedgerowShell entry={FLAGSHIP_REGISTRY[slug]}>{children}</HedgerowShell>
  }

  // Generic-kit flagship stores (see src/lib/flagship-generic/registry.ts) —
  // same bespoke-feeling experience shape as the 15 slugs above, built on a
  // reusable component kit instead of a hand-written tree per brand. Slugs
  // here never collide with the ones above or with real seller slugs.
  const genericFlagship = FLAGSHIP_REGISTRY[slug]
  if (genericFlagship) {
    return <GenericFlagshipShell entry={genericFlagship}>{children}</GenericFlagshipShell>
  }

  const admin = createAdminClient()
  // 'demo' always uses the fallback config so it shows US content regardless of any DB record
  const { data: config } = slug === 'demo'
    ? { data: null }
    : await admin.from('tenant_config').select('*').eq('slug', slug).single() as { data: TenantConfig | null }

  if (!config && slug !== 'demo') notFound()

  // Any real seller who has picked the "January" theme also gets the bespoke
  // component tree, rendered with their own brand data.
  if (config?.theme_id === 'january') {
    return <><AugustShell brand={configToThemeBrand(config, slug)}>{children}</AugustShell><AccountLinkBubble slug={slug} /></>
  }
  if (config?.theme_id === 'february') {
    return <><EmberShell brand={configToThemeBrand(config, slug)}>{children}</EmberShell><AccountLinkBubble slug={slug} /></>
  }
  if (config?.theme_id === 'march') {
    return <><BloomShell brand={configToThemeBrand(config, slug)}>{children}</BloomShell><AccountLinkBubble slug={slug} /></>
  }
  if (config?.theme_id === 'april') {
    return <><MelaShell brand={configToThemeBrand(config, slug)}>{children}</MelaShell><AccountLinkBubble slug={slug} /></>
  }
  if (config?.theme_id === 'may') {
    return <><TaanaShell brand={configToThemeBrand(config, slug)}>{children}</TaanaShell><AccountLinkBubble slug={slug} /></>
  }
  if (config?.theme_id === 'june') {
    return <><SaajShell brand={configToThemeBrand(config, slug)}>{children}</SaajShell><AccountLinkBubble slug={slug} /></>
  }
  if (config?.theme_id === 'july') {
    return <><ScrollShell brand={configToThemeBrand(config, slug)}>{children}</ScrollShell><AccountLinkBubble slug={slug} /></>
  }
  if (config?.theme_id === 'august') {
    return <><DhamakaShell brand={configToThemeBrand(config, slug)}>{children}</DhamakaShell><AccountLinkBubble slug={slug} /></>
  }
  if (config?.theme_id === 'september') {
    return <><AaramShell brand={configToThemeBrand(config, slug)}>{children}</AaramShell><AccountLinkBubble slug={slug} /></>
  }
  if (config?.theme_id === 'october') {
    return <><UtsavShell brand={configToThemeBrand(config, slug)}>{children}</UtsavShell><AccountLinkBubble slug={slug} /></>
  }
  if (config?.theme_id === 'november') {
    return <><GalliShell brand={configToThemeBrand(config, slug)}>{children}</GalliShell><AccountLinkBubble slug={slug} /></>
  }
  if (config?.theme_id === 'december') {
    return <><KirayaShell brand={configToThemeBrand(config, slug)}>{children}</KirayaShell><AccountLinkBubble slug={slug} /></>
  }
  if (config?.theme_id === 'reelrack') {
    return <ReelRackShell brand={configToThemeBrand(config, slug)}>{children}</ReelRackShell>
  }
  if (config?.theme_id === 'thegrid') {
    return <TheGridShell brand={configToThemeBrand(config, slug)}>{children}</TheGridShell>
  }
  if (config?.theme_id === 'tryiton') {
    return <TryItOnShell brand={configToThemeBrand(config, slug)}>{children}</TryItOnShell>
  }

  // Fallback demo config
  const tc: TenantConfig = config ?? {
    seller_id: 'demo',
    slug: 'demo',
    brand_name: 'Luna Boutique',
    tagline: 'Curated fashion for the modern woman',
    logo_url: null,
    favicon_url: null,
    primary_color: '#1A1A1A',
    secondary_color: '#F5F5F5',
    accent_color: '#A6134A',
    background_color: '#FFFFFF',
    font_family: 'poppins',
    theme_id: 'editorial',
    dark_mode_default: false,
    currency: 'USD',
    payment_method: 'stripe',
    payment_config: {},
    whatsapp_number: null,
    instagram_handle: '@lunaboutique',
    try_on_enabled: true,
    reviews_enabled: true,
    wishlist_enabled: true,
    categories: ['Dresses', 'Tops', 'Denim', 'Outerwear', 'Accessories'],
    size_guide_url: null,
    banners: [],
    custom_domain: null,
    play_store_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const fontCss = FONTS[tc.font_family as keyof typeof FONTS]?.css ?? "'Poppins', sans-serif"
  const theme = getTheme(tc.theme_id)
  const brandType = HEADING_TYPE[theme.headingStyle]
  const logoRadius = LOGO_RADIUS[theme.logoShape]

  const cssVars = `
    :root {
      --primary: ${tc.primary_color};
      --primary-light: ${tc.secondary_color};
      --primary-dark: ${tc.accent_color};
      --store-bg: ${tc.background_color || '#FEFDFB'};
      --store-ink: #171512;
      --store-font: ${fontCss};
      --store-logo-radius: ${logoRadius};
      --store-brand-weight: ${brandType.weight};
      --store-brand-case: ${brandType.case};
      --store-brand-tracking: ${brandType.tracking};
      --store-brand-size: ${brandType.size};
    }
    .store-root { font-family: var(--store-font); background: var(--store-bg); color: var(--store-ink); }
  `

  // Header/footer read CSS vars (not tc.*/theme.* literals) so a client-side
  // theme preview override (?theme=) — set in page.tsx via a style-tag effect
  // — recolors AND reshapes (logo radius, brand-name weight/case/tracking)
  // the whole store consistently, not just the page content underneath.
  return (
    <>
      {/* Every seller picks a font in Customize Store, but until now nothing
          ever loaded the actual font file — every store silently rendered in
          the browser's default sans regardless of what was selected. */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700&family=Raleway:wght@400;500;600;700&family=Fraunces:ital,wght@0,400;0,500;0,600;1,400&family=Bebas+Neue&family=Space+Grotesk:wght@400;500;600;700&family=Cormorant:wght@400;500;600&display=swap"
      />
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      <div className="store-root min-h-screen" data-tenant={slug}>
        <PreviewBanner />

        {/* Announcement bar — shown when the store has a banner configured */}
        {Array.isArray(tc.banners) && tc.banners.length > 0 && (
          <div className="w-full py-2.5 px-4 text-center text-xs tracking-wide" style={{ background: 'var(--store-ink)', color: 'var(--store-bg)' }}>
            {tc.banners[0].caption ?? ''}
          </div>
        )}

        {/* Store header — Farfetch/F21 style: hamburger | centered brand | icons */}
        <header className="sticky top-0 z-50 border-b" style={{ background: 'var(--store-bg)', borderColor: 'color-mix(in srgb, var(--store-ink) 8%, transparent)' }}>
          <div className="max-w-[1400px] mx-auto px-5 md:px-8 h-14 md:h-16 flex items-center justify-between gap-4">

            {/* Left — hamburger (opens category nav; no-op for now) */}
            <div className="flex items-center gap-5 flex-shrink-0 w-20 md:w-32">
              <button aria-label="Menu" className="transition-opacity hover:opacity-50" style={{ color: 'var(--store-ink)' }}>
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                  <line x1="0" y1="1" x2="20" y2="1"/>
                  <line x1="0" y1="7" x2="20" y2="7"/>
                  <line x1="0" y1="13" x2="20" y2="13"/>
                </svg>
              </button>
              {/* Logo image — hidden on very small screens, shown md+ beside hamburger */}
              {tc.logo_url && (
                <img src={tc.logo_url} alt={tc.brand_name} className="hidden md:block h-7 w-7 object-cover flex-shrink-0" style={{ borderRadius: 'var(--store-logo-radius)' }} />
              )}
            </div>

            {/* Center — brand name, always centered */}
            <div className="flex-1 text-center">
              <a href={`/store/${slug}`} style={{ textDecoration: 'none' }}>
                <span style={{
                  color: 'var(--store-ink)',
                  fontWeight: 'var(--store-brand-weight)' as React.CSSProperties['fontWeight'],
                  textTransform: 'var(--store-brand-case)' as React.CSSProperties['textTransform'],
                  letterSpacing: 'var(--store-brand-tracking)',
                  fontSize: 'clamp(15px, 2.5vw, 20px)',
                }}>
                  {tc.brand_name}
                </span>
              </a>
            </div>

            {/* Right — search + wishlist icons */}
            <div className="flex items-center gap-4 flex-shrink-0 w-20 md:w-32 justify-end">
              <button aria-label="Search" className="transition-opacity hover:opacity-50" style={{ color: 'var(--store-ink)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                  <circle cx="11" cy="11" r="7.5"/>
                  <path d="M21 21l-4.8-4.8"/>
                </svg>
              </button>
              <button aria-label="Saved items" className="transition-opacity hover:opacity-50" style={{ color: 'var(--store-ink)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 21s-7.5-4.6-10-9.2C.5 8.4 2.2 5 5.6 5c2 0 3.6 1.2 4.4 2.6C10.8 6.2 12.4 5 14.4 5c3.4 0 5.1 3.4 3.6 6.8-2.5 4.6-10 9.2-10 9.2z"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        {children}

        {/* Footer */}
        <footer className="mt-20 border-t" style={{ borderColor: 'color-mix(in srgb, var(--store-ink) 8%, transparent)' }}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 flex flex-col items-center gap-4 text-center">
            <span style={{
              color: 'var(--store-ink)',
              fontWeight: 'var(--store-brand-weight)' as React.CSSProperties['fontWeight'],
              textTransform: 'var(--store-brand-case)' as React.CSSProperties['textTransform'],
              letterSpacing: 'var(--store-brand-tracking)',
              fontSize: 'clamp(16px, 2vw, 20px)',
            }}>
              {tc.brand_name}
            </span>
            <div className="flex items-center gap-6 text-xs" style={{ color: 'color-mix(in srgb, var(--store-ink) 45%, transparent)' }}>
              {tc.instagram_handle && <a href={`https://instagram.com/${tc.instagram_handle.replace('@','')}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" style={{ color: 'inherit', textDecoration: 'none' }}>Instagram</a>}
              {tc.whatsapp_number && <a href={`https://wa.me/${tc.whatsapp_number.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>}
            </div>
            <p className="text-[11px]" style={{ color: 'color-mix(in srgb, var(--store-ink) 30%, transparent)' }}>
              Powered by <a href="/" className="hover:opacity-70 transition-opacity" style={{ color: 'inherit' }}>Instastarz</a>
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
