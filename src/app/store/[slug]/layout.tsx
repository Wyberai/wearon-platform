import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { FONTS } from '@/lib/constants'
import type { TenantConfig } from '@/lib/types'
import { PreviewBanner } from '@/components/store/PreviewBanner'

// Fetch tenant config server-side and inject CSS variables
export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const admin = createAdminClient()
  const { data: config } = await admin
    .from('tenant_config')
    .select('*')
    .eq('slug', slug)
    .single() as { data: TenantConfig | null }

  if (!config && slug !== 'demo') notFound()

  // Fallback demo config
  const tc: TenantConfig = config ?? {
    seller_id: 'demo',
    slug: 'demo',
    brand_name: 'Demo Boutique',
    tagline: 'Try before you buy',
    logo_url: null,
    favicon_url: null,
    primary_color: '#E91E63',
    secondary_color: '#FCE4EC',
    accent_color: '#880E4F',
    background_color: '#FFFFFF',
    font_family: 'poppins',
    dark_mode_default: false,
    currency: 'INR',
    payment_method: 'whatsapp_order',
    payment_config: {},
    whatsapp_number: '+919876543210',
    instagram_handle: '@demoboutique',
    try_on_enabled: true,
    reviews_enabled: true,
    wishlist_enabled: true,
    categories: ['Kurtas', 'Sarees', 'Lehengas', 'Western', 'Accessories'],
    size_guide_url: null,
    banners: [],
    custom_domain: null,
    play_store_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const fontCss = FONTS[tc.font_family as keyof typeof FONTS]?.css ?? "'Poppins', sans-serif"

  const cssVars = `
    :root {
      --primary: ${tc.primary_color};
      --primary-light: ${tc.secondary_color};
      --primary-dark: ${tc.accent_color};
      --store-bg: ${tc.background_color};
      --store-font: ${fontCss};
    }
    .store-root { font-family: var(--store-font); background: var(--store-bg); }
  `

  return (
    <>
      {/* Every seller picks a font in Customize Store, but until now nothing
          ever loaded the actual font file — every store silently rendered in
          the browser's default sans regardless of what was selected. */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap"
      />
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      <div className="store-root min-h-screen" style={{ background: tc.background_color || '#FEFDFB' }} data-tenant={slug}>
        <PreviewBanner />
        {/* Store header — minimal, full-width, brand color as an accent only */}
        <header className="sticky top-0 z-50 backdrop-blur-md border-b border-black/[0.06]" style={{ background: `${tc.background_color || '#FEFDFB'}F2` }}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {tc.logo_url ? (
                <img src={tc.logo_url} alt={tc.brand_name} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div style={{ backgroundColor: tc.primary_color }} className="h-9 w-9 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                  {tc.brand_name.charAt(0)}
                </div>
              )}
              <div>
                <span className="font-semibold text-lg tracking-tight" style={{ color: '#171512' }}>{tc.brand_name}</span>
                {tc.tagline && <p className="text-[11px] -mt-0.5 hidden sm:block" style={{ color: '#17151277' }}>{tc.tagline}</p>}
              </div>
            </div>
            {tc.whatsapp_number && (
              <a
                href={`https://wa.me/${tc.whatsapp_number.replace(/\D/g, '')}`}
                style={{ color: tc.primary_color }}
                className="text-sm font-medium flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.83 14.02c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.34-.14-.2-1.17-1.55-1.17-2.96 0-1.4.73-2.09 1-2.38.27-.28.58-.35.78-.35.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.85 2.08.92 2.23.08.15.13.32.03.51-.1.19-.15.31-.3.48-.15.17-.31.37-.44.5-.15.14-.3.3-.13.59.17.29.77 1.27 1.66 2.06 1.14 1.02 2.11 1.33 2.41 1.48.3.15.47.13.65-.05.18-.19.75-.87.95-1.17.2-.3.4-.24.66-.14.27.09 1.71.81 2 .95.29.15.48.22.55.35.07.13.07.72-.17 1.4z"/></svg>
                <span className="hidden sm:inline">Chat with us</span>
              </a>
            )}
          </div>
        </header>

        {/* Page content */}
        {children}

        {/* Footer — minimal, understated */}
        <footer className="mt-16 py-10 text-center text-xs border-t border-black/[0.06]" style={{ color: '#17151266' }}>
          <p>
            {tc.instagram_handle && <span className="mr-4">Instagram: {tc.instagram_handle}</span>}
            Powered by <a href="/" className="font-medium hover:opacity-70" style={{ color: '#17151299' }}>WearOn</a>
          </p>
        </footer>
      </div>
    </>
  )
}
