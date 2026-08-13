import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/AdminNav'
import { NativeBridge } from '@/components/admin/NativeBridge'
import { LayoutDashboard, Package, ShoppingBag, MessageSquare, Sparkles, Film, BarChart2, Palette, Settings, CreditCard, ExternalLink, LogOut, BookOpen, Eye, Tag } from 'lucide-react'

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

  const navLinks = [
    { href: `/admin/${slug}`, label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { href: `/admin/${slug}/products`, label: 'Products', icon: <Package size={16} /> },
    { href: `/admin/${slug}/orders`, label: 'Orders', icon: <ShoppingBag size={16} /> },
    { href: `/admin/${slug}/inbox`, label: 'Inbox', icon: <MessageSquare size={16} /> },
    { href: `/admin/${slug}/ai-studio`, label: 'AI Studio', icon: <Sparkles size={16} /> },
    { href: `/admin/${slug}/ai-buyer`, label: 'AI Buyer', icon: <BookOpen size={16} /> },
    { href: `/admin/${slug}/content`, label: 'Content', icon: <Film size={16} /> },
    { href: `/admin/${slug}/analytics`, label: 'Analytics', icon: <BarChart2 size={16} /> },
    { href: `/admin/${slug}/ai-visibility`, label: 'AI Visibility', icon: <Eye size={16} /> },
    { href: `/admin/${slug}/customize`, label: 'Customize', icon: <Palette size={16} /> },
    { href: `/admin/${slug}/settings`, label: 'Settings', icon: <Settings size={16} /> },
    { href: `/admin/${slug}/discounts`, label: 'Discounts', icon: <Tag size={16} /> },
    { href: `/admin/${slug}/billing`, label: 'Billing', icon: <CreditCard size={16} /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NativeBridge />
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col fixed h-full">
        <div className="p-5 border-b border-gray-100">
          <Link href="/" className="text-lg font-bold" style={{ color: '#A6134A' }}>WearOn</Link>
          <div className="text-sm text-gray-500 mt-1 truncate">{config.brand_name}</div>
        </div>
        <AdminNav links={navLinks} primaryColor={config.primary_color ?? '#ec4899'} />
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            href={`/store/${slug}`}
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ExternalLink size={13} /> View Store
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors w-full text-left">
              <LogOut size={13} /> Sign Out
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
