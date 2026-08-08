import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { AdminNav } from '@/components/admin/AdminNav'

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
    { href: `/admin/${slug}`, label: 'Dashboard', icon: '📊' },
    { href: `/admin/${slug}/products`, label: 'Products', icon: '👗' },
    { href: `/admin/${slug}/orders`, label: 'Orders', icon: '📦' },
    { href: `/admin/${slug}/inbox`, label: 'Instagram DMs', icon: '💬' },
    { href: `/admin/${slug}/ai-studio`, label: 'AI Studio', icon: '✨' },
    { href: `/admin/${slug}/analytics`, label: 'Analytics', icon: '📈' },
    { href: `/admin/${slug}/customize`, label: 'Customize', icon: '🎨' },
    { href: `/admin/${slug}/settings`, label: 'Settings', icon: '⚙️' },
    { href: `/admin/${slug}/billing`, label: 'Billing', icon: '💳' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col fixed h-full">
        <div className="p-5 border-b border-gray-100">
          <Link href="/" className="text-lg font-bold text-pink-600">WearOn</Link>
          <div className="text-sm text-gray-500 mt-1 truncate">{config.brand_name}</div>
        </div>
        <AdminNav links={navLinks} primaryColor={config.primary_color ?? '#ec4899'} />
        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            href={`/store/${slug}`}
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <span>🔗</span> View Store
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 transition-colors w-full text-left">
              <span>🚪</span> Sign Out
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
