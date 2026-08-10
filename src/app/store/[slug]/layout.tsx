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
      <div className="store-root min-h-screen" data-tenant={slug}>
        <PreviewBanner />
        {/* Store header */}
        <header style={{ backgroundColor: tc.primary_color }} className="px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-3">
            {tc.logo_url ? (
              <img src={tc.logo_url} alt={tc.brand_name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                {tc.brand_name.charAt(0)}
              </div>
            )}
            <span className="text-white font-bold text-lg">{tc.brand_name}</span>
          </div>
          {tc.whatsapp_number && (
            <a
              href={`https://wa.me/${tc.whatsapp_number.replace(/\D/g, '')}`}
              className="text-white/80 text-xs flex items-center gap-1 hover:text-white"
            >
              💬 Chat
            </a>
          )}
        </header>

        {/* Page content */}
        {children}

        {/* Footer */}
        <footer style={{ backgroundColor: tc.primary_color + '15' }} className="mt-12 py-8 text-center text-sm text-gray-500 border-t border-gray-100">
          <p>
            {tc.instagram_handle && <span className="mr-4">Instagram: {tc.instagram_handle}</span>}
            Powered by <a href="/" className="text-pink-600 font-medium">WearOn</a>
          </p>
        </footer>
      </div>
    </>
  )
}
