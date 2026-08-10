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
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      <div className="store-root min-h-screen bg-white" data-tenant={slug}>
        <PreviewBanner />
        {/* Store header — minimal, full-width, brand color as an accent only */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {tc.logo_url ? (
                <img src={tc.logo_url} alt={tc.brand_name} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div style={{ backgroundColor: tc.primary_color }} className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {tc.brand_name.charAt(0)}
                </div>
              )}
              <div>
                <span className="font-bold text-lg tracking-tight text-gray-900">{tc.brand_name}</span>
                {tc.tagline && <p className="text-[11px] text-gray-400 -mt-0.5 hidden sm:block">{tc.tagline}</p>}
              </div>
            </div>
            {tc.whatsapp_number && (
              <a
                href={`https://wa.me/${tc.whatsapp_number.replace(/\D/g, '')}`}
                style={{ color: tc.primary_color }}
                className="text-sm font-medium flex items-center gap-1.5 hover:opacity-70 transition-opacity"
              >
                💬 <span className="hidden sm:inline">Chat with us</span>
              </a>
            )}
          </div>
        </header>

        {/* Page content */}
        {children}

        {/* Footer — minimal, understated */}
        <footer className="mt-16 py-10 text-center text-xs text-gray-400 border-t border-gray-100">
          <p>
            {tc.instagram_handle && <span className="mr-4">Instagram: {tc.instagram_handle}</span>}
            Powered by <a href="/" className="text-gray-500 font-medium hover:text-gray-700">WearOn</a>
          </p>
        </footer>
      </div>
    </>
  )
}
