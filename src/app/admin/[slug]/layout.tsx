import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/AdminNav'
import { NativeBridge } from '@/components/admin/NativeBridge'
import { LayoutDashboard, Package, ShoppingBag, MessageSquare, Sparkles, Film, BarChart2, Palette, Settings, CreditCard, ExternalLink, LogOut, BookOpen, Eye, Tag } from 'lucide-react'
import { getLocale } from '@/lib/i18n/get-locale'
import { ADMIN_NAV_DICT } from '@/lib/i18n/dict/admin-nav'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = createAdminClient()
  const { data: config } = await admin
    .from('tenant_config')
    .select('brand_name, slug, primary_color')
    .eq('slug', slug)
    .eq('seller_id', user.id)
    .single()

  if (!config) redirect('/admin')

  const locale = await getLocale()
  const nav = ADMIN_NAV_DICT[locale]

  const navLinks = [
    { href: `/admin/${slug}`, label: nav.dashboard, icon: <LayoutDashboard size={16} /> },
    { href: `/admin/${slug}/products`, label: nav.products, icon: <Package size={16} /> },
    { href: `/admin/${slug}/orders`, label: nav.orders, icon: <ShoppingBag size={16} /> },
    { href: `/admin/${slug}/inbox`, label: nav.inbox, icon: <MessageSquare size={16} /> },
    { href: `/admin/${slug}/ai-studio`, label: nav.aiStudio, icon: <Sparkles size={16} /> },
    { href: `/admin/${slug}/ai-buyer`, label: nav.aiBuyer, icon: <BookOpen size={16} /> },
    { href: `/admin/${slug}/content`, label: nav.content, icon: <Film size={16} /> },
    { href: `/admin/${slug}/analytics`, label: nav.analytics, icon: <BarChart2 size={16} /> },
    { href: `/admin/${slug}/ai-visibility`, label: nav.aiVisibility, icon: <Eye size={16} /> },
    { href: `/admin/${slug}/customize`, label: nav.customize, icon: <Palette size={16} /> },
    { href: `/admin/${slug}/settings`, label: nav.settings, icon: <Settings size={16} /> },
    { href: `/admin/${slug}/discounts`, label: nav.discounts, icon: <Tag size={16} /> },
    { href: `/admin/${slug}/billing`, label: nav.billing, icon: <CreditCard size={16} /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NativeBridge />
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col fixed h-full">
        <div className="p-5 border-b border-gray-100">
          <Link href="/" className="text-lg font-bold" style={{ color: '#A6134A' }}>Instastarz</Link>
          <div className="text-sm text-gray-500 mt-1 truncate">{config.brand_name}</div>
        </div>
        <AdminNav links={navLinks} primaryColor={config.primary_color ?? '#ec4899'} />
        <div className="p-4 border-t border-gray-100 space-y-2">
          <div className="px-1 pb-1">
            <LanguageSwitcher current={locale} />
          </div>
          <Link
            href={`/store/${slug}`}
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={13} /> {nav.viewStore}
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors w-full text-left">
              <LogOut size={13} /> {nav.signOut}
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
