import Link from 'next/link'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/constants'

export default async function AdminDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()

  const [profileResult, analyticsResult, productCountResult, orderCountResult, configResult, igResult] = await Promise.all([
    admin.from('profiles').select('plan, try_ons_used, try_ons_limit').eq('id', user.id).single(),
    admin.from('daily_analytics').select('*').eq('seller_id', user.id).order('date', { ascending: false }).limit(7),
    admin.from('products').select('id', { count: 'exact' }).eq('seller_id', user.id).eq('is_active', true),
    admin.from('orders').select('id', { count: 'exact' }).eq('seller_id', user.id).gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString()),
    admin.from('tenant_config').select('whatsapp_number, primary_color, brand_name, logo_url').eq('seller_id', user.id).single(),
    admin.from('instagram_connections').select('ig_username').eq('seller_id', user.id).maybeSingle(),
  ])

  const profile = profileResult.data
  const analytics = analyticsResult.data ?? []
  const productCount = productCountResult.count ?? 0
  const orderCount = orderCountResult.count ?? 0
  const storeConfig = configResult.data
  const igConnected = !!igResult.data

  const totalTryOns = analytics.reduce((sum, d) => sum + d.try_ons, 0)
  const totalVisits = analytics.reduce((sum, d) => sum + d.store_visits, 0)
  const plan = PLANS[profile?.plan as keyof typeof PLANS ?? 'free']
  const tryOnPct = profile ? Math.round((profile.try_ons_used / profile.try_ons_limit) * 100) : 0

  // Setup checklist state
  const hasWhatsApp = !!storeConfig?.whatsapp_number
  const hasProducts = productCount > 0
  const setupDone = hasWhatsApp && hasProducts
  const setupSteps = [
    { done: hasWhatsApp, label: 'Add your WhatsApp number', href: `/admin/${slug}/customize`, action: 'Set up →' },
    { done: hasProducts, label: 'Add your first product', href: `/admin/${slug}/products`, action: 'Add product →' },
    { done: true, label: 'Share your store link', href: null, action: null },
  ]
  const completedCount = [hasWhatsApp, hasProducts].filter(Boolean).length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Last 7 days overview</p>
        </div>
        <Link
          href={`/store/${slug}`}
          target="_blank"
          className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors"
        >
          View My Store →
        </Link>
      </div>

      {/* First-run setup wizard — shown until all steps are complete */}
      {!setupDone && (
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-6 mb-8">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Welcome to WearOn{storeConfig?.brand_name ? `, ${storeConfig.brand_name}` : ''}! 🎉
              </h2>
              <p className="text-sm text-gray-500 mt-1">Complete these steps to launch your boutique app.</p>
            </div>
            <span className="text-xs font-semibold bg-pink-100 text-pink-700 px-3 py-1 rounded-full whitespace-nowrap">
              {completedCount} / 2 done
            </span>
          </div>
          <div className="space-y-3">
            {setupSteps.map((step, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 bg-white rounded-xl px-5 py-4 border transition-all ${
                  step.done ? 'border-green-100 opacity-70' : 'border-gray-100 shadow-sm'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  step.done ? 'bg-green-100 text-green-600' : 'bg-pink-100 text-pink-600'
                }`}>
                  {step.done ? '✓' : i + 1}
                </div>
                <span className={`flex-1 text-sm font-medium ${step.done ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                  {step.label}
                </span>
                {!step.done && step.href && (
                  <Link
                    href={step.href}
                    className="text-xs font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {step.action}
                  </Link>
                )}
                {i === 2 && (
                  <code className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                    wearon.in/store/{slug}
                  </code>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Store Visits', value: totalVisits.toLocaleString('en-IN'), icon: '👁' },
          { label: 'Try-Ons', value: totalTryOns.toLocaleString('en-IN'), icon: '👗' },
          { label: 'Products', value: productCount.toLocaleString('en-IN'), icon: '📦' },
          { label: 'Orders (30d)', value: orderCount.toLocaleString('en-IN'), icon: '🛍' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Plan status */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Current Plan</span>
            <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
          </div>
          <Link href={`/admin/${slug}/billing`} className="text-sm text-pink-600 font-medium hover:text-pink-700">
            Upgrade Plan →
          </Link>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Try-ons used</span>
            <span className="font-medium">{profile?.try_ons_used ?? 0} / {profile?.try_ons_limit ?? 20}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${tryOnPct > 80 ? 'bg-red-500' : 'bg-pink-500'}`}
              style={{ width: `${Math.min(tryOnPct, 100)}%` }}
            />
          </div>
          {tryOnPct > 80 && (
            <p className="text-xs text-red-600">Running low! Upgrade to avoid service interruption.</p>
          )}
        </div>
      </div>

      {/* 7-day try-ons chart */}
      {analytics.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Try-Ons — Last 7 Days</h3>
          {(() => {
            const maxVal = Math.max(...analytics.map(d => d.try_ons), 1)
            const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
            return (
              <div className="flex items-end gap-2 h-24">
                {[...analytics].reverse().map((d, i) => {
                  const pct = (d.try_ons / maxVal) * 100
                  const dayName = days[new Date(d.date).getDay()]
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${d.try_ons} try-ons`}>
                      <div className="w-full rounded-t-sm bg-pink-500 transition-all" style={{ height: `${Math.max(pct, 4)}%` }} />
                      <span className="text-xs text-gray-400">{dayName}</span>
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>
      )}

      {/* Store link card */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100 p-5 mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-pink-600 font-semibold uppercase tracking-wide mb-1">Your Store Link</p>
          <code className="text-sm text-gray-700 font-mono">wearon.in/store/{slug}</code>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <a
            href={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://wearon.in/store/${slug}`}
            target="_blank" rel="noopener noreferrer"
          >
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://wearon.in/store/${slug}`}
              alt="QR" className="w-16 h-16 rounded-lg border border-pink-100" />
          </a>
          <Link href={`/store/${slug}`} target="_blank"
            className="self-center bg-pink-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-pink-700 transition-colors">
            Open →
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Link href={`/admin/${slug}/products`} className="bg-white border border-gray-100 rounded-xl p-5 hover:border-pink-200 hover:shadow-sm transition-all">
          <div className="text-2xl mb-3">👗</div>
          <h3 className="font-semibold text-gray-900 mb-1">Add Products</h3>
          <p className="text-xs text-gray-500">Upload your garments for try-on</p>
        </Link>
        <Link href={`/admin/${slug}/customize`} className="bg-white border border-gray-100 rounded-xl p-5 hover:border-pink-200 hover:shadow-sm transition-all">
          <div className="text-2xl mb-3">🎨</div>
          <h3 className="font-semibold text-gray-900 mb-1">Customize Store</h3>
          <p className="text-xs text-gray-500">Logo, colors, fonts, and more</p>
        </Link>
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="text-2xl mb-3">🔗</div>
          <h3 className="font-semibold text-gray-900 mb-1">Share Your Store</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2 py-1 rounded font-mono truncate">
              wearon.in/store/{slug}
            </span>
          </div>
        </div>
      </div>

      {/* Instagram DM card */}
      <div className={`rounded-xl border p-5 flex items-center justify-between gap-4 ${igConnected ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-pink-100' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-lg flex-shrink-0">
            💬
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-0.5">
              {igConnected ? 'Instagram DMs connected' : 'Connect Instagram DMs'}
            </h3>
            <p className="text-xs text-gray-500">
              {igConnected
                ? 'AI agent is handling buyer queries — check your inbox'
                : 'Let AI reply to buyer DMs automatically with your product info'}
            </p>
          </div>
        </div>
        <Link
          href={igConnected ? `/admin/${slug}/inbox` : `/api/admin/instagram/connect?slug=${slug}`}
          className="text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0"
        >
          {igConnected ? 'Open Inbox →' : 'Connect →'}
        </Link>
      </div>
    </div>
  )
}
