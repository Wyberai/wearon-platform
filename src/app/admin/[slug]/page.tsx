import Link from 'next/link'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { PLANS } from '@/lib/constants'
import { getLocale } from '@/lib/i18n/get-locale'
import { ADMIN_DASHBOARD_DICT } from '@/lib/i18n/dict/admin-dashboard'

const INK = '#171512'
const ACCENT = '#A6134A'

export default async function AdminDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const locale = await getLocale()
  const t = ADMIN_DASHBOARD_DICT[locale]

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

  const hasWhatsApp = !!storeConfig?.whatsapp_number
  const hasProducts = productCount > 0
  const setupDone = hasWhatsApp && hasProducts
  const setupSteps = [
    { done: hasWhatsApp, label: t.setupWhatsApp, href: `/admin/${slug}/customize`, action: t.setUp },
    { done: hasProducts, label: t.setupFirstProduct, href: `/admin/${slug}/products`, action: t.addProduct },
    { done: true, label: t.setupShareLink, href: null, action: null },
  ]
  const completedCount = [hasWhatsApp, hasProducts].filter(Boolean).length

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: INK }}>{t.dashboard}</h1>
          <p className="text-sm mt-0.5" style={{ color: `${INK}77` }}>{t.last7Days}</p>
        </div>
        <Link
          href={`/store/${slug}`}
          target="_blank"
          className="text-sm font-medium px-4 py-2 rounded-lg transition-opacity hover:opacity-85"
          style={{ background: INK, color: '#fff' }}
        >
          {t.viewMyStore}
        </Link>
      </div>

      {/* Setup checklist — quiet, not a party banner */}
      {!setupDone && (
        <div className="rounded-[20px] mb-6 overflow-hidden bg-white" style={{ boxShadow: '0 12px 30px -20px rgba(23,21,18,0.14)' }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: `${INK}0f` }}>
            <span className="text-sm font-medium" style={{ color: INK }}>{t.finishSetup}</span>
            <span className="text-xs font-medium" style={{ color: `${INK}66` }}>{completedCount}/2 {t.done}</span>
          </div>
          <div>
            {setupSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 border-b last:border-0" style={{ borderColor: `${INK}0a` }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
                  style={{ background: step.done ? '#e8f5e9' : `${ACCENT}14`, color: step.done ? '#2e7d32' : ACCENT }}>
                  {step.done ? '✓' : i + 1}
                </span>
                <span className={`flex-1 text-sm ${step.done ? 'line-through' : ''}`} style={{ color: step.done ? `${INK}55` : INK }}>
                  {step.label}
                </span>
                {!step.done && step.href && (
                  <Link href={step.href} className="text-xs font-semibold" style={{ color: ACCENT }}>
                    {step.action} →
                  </Link>
                )}
                {i === 2 && (
                  <code className="text-xs font-mono" style={{ color: `${INK}55` }}>instastarz.in/store/{slug}</code>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: t.storeVisits, value: totalVisits },
          { label: t.tryOns, value: totalTryOns },
          { label: t.products, value: productCount },
          { label: t.ordersLast30d, value: orderCount },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-[20px] p-4 bg-white transition-shadow duration-200 hover:shadow-md" style={{ boxShadow: '0 8px 20px -16px rgba(23,21,18,0.12)' }}>
            <div className="text-2xl font-semibold" style={{ color: INK }}>{value.toLocaleString('en-IN')}</div>
            <div className="text-xs mt-0.5" style={{ color: `${INK}77` }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        {/* Plan + try-on usage */}
        <div className="rounded-[20px] p-5 bg-white" style={{ boxShadow: '0 8px 20px -16px rgba(23,21,18,0.12)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs" style={{ color: `${INK}77` }}>{t.currentPlan}</span>
              <h3 className="text-base font-semibold mt-0.5" style={{ color: INK }}>{plan.name}</h3>
            </div>
            <Link href={`/admin/${slug}/billing`} className="text-xs font-semibold" style={{ color: ACCENT }}>{t.upgrade}</Link>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs" style={{ color: `${INK}99` }}>
              <span>{t.tryOnsUsed}</span>
              <span className="font-medium" style={{ color: INK }}>{profile?.try_ons_used ?? 0} / {profile?.try_ons_limit ?? 20}</span>
            </div>
            <div className="w-full rounded-full h-1.5" style={{ background: `${INK}0f` }}>
              <div className="h-1.5 rounded-full" style={{ width: `${Math.min(tryOnPct, 100)}%`, background: tryOnPct > 80 ? '#dc2626' : ACCENT }} />
            </div>
            {tryOnPct > 80 && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>{t.runningLow}</p>}
          </div>
        </div>

        {/* 7-day chart */}
        <div className="rounded-[20px] p-5 bg-white" style={{ boxShadow: '0 8px 20px -16px rgba(23,21,18,0.12)' }}>
          <h3 className="text-xs font-medium mb-4" style={{ color: `${INK}77` }}>{t.tryOnsLast7Days}</h3>
          {analytics.length > 0 ? (() => {
            const maxVal = Math.max(...analytics.map(d => d.try_ons), 1)
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            return (
              <div className="flex items-end gap-2 h-20">
                {[...analytics].reverse().map((d, i) => {
                  const pct = (d.try_ons / maxVal) * 100
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5" title={`${d.try_ons} try-ons`}>
                      <div className="w-full rounded-sm" style={{ height: `${Math.max(pct, 4)}%`, background: `${ACCENT}cc` }} />
                      <span className="text-[10px]" style={{ color: `${INK}55` }}>{days[new Date(d.date).getDay()]}</span>
                    </div>
                  )
                })}
              </div>
            )
          })() : <p className="text-xs" style={{ color: `${INK}55` }}>{t.noDataYet}</p>}
        </div>

        {/* Store link */}
        <div className="rounded-[20px] p-5 flex items-center justify-between gap-3 bg-white" style={{ boxShadow: '0 8px 20px -16px rgba(23,21,18,0.12)' }}>
          <div className="min-w-0">
            <span className="text-xs" style={{ color: `${INK}77` }}>{t.yourStoreLink}</span>
            <code className="block text-sm font-mono mt-1 truncate" style={{ color: INK }}>instastarz.in/store/{slug}</code>
          </div>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=https://instastarz.in/store/${slug}`}
            alt="QR" className="w-14 h-14 rounded-lg flex-shrink-0 border" style={{ borderColor: `${INK}14` }}
          />
        </div>
      </div>

      {/* Quick actions — quiet rows, not emoji cards */}
      <div className="rounded-[20px] mb-5 overflow-hidden bg-white" style={{ boxShadow: '0 12px 30px -20px rgba(23,21,18,0.14)' }}>
        {[
          { label: t.quickAddProducts, desc: t.quickAddProductsDesc, href: `/admin/${slug}/products` },
          { label: t.quickCustomize, desc: t.quickCustomizeDesc, href: `/admin/${slug}/customize` },
        ].map((a, i) => (
          <Link key={a.label} href={a.href} className="flex items-center justify-between px-5 py-3.5 hover:bg-black/[0.02] transition-colors"
            style={{ borderTop: i === 0 ? 'none' : `1px solid ${INK}0a` }}>
            <div>
              <div className="text-sm font-medium" style={{ color: INK }}>{a.label}</div>
              <div className="text-xs mt-0.5" style={{ color: `${INK}77` }}>{a.desc}</div>
            </div>
            <span style={{ color: `${INK}55` }}>→</span>
          </Link>
        ))}
      </div>

      {/* Instagram DM */}
      <div className="rounded-[20px] px-5 py-4 flex items-center justify-between gap-4 bg-white" style={{ boxShadow: '0 8px 20px -16px rgba(23,21,18,0.12)' }}>
        <div>
          <h3 className="text-sm font-medium" style={{ color: INK }}>
            {igConnected ? t.igConnectedTitle : t.igNotConnectedTitle}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: `${INK}77` }}>
            {igConnected ? t.igConnectedDesc : t.igNotConnectedDesc}
          </p>
        </div>
        <Link
          href={igConnected ? `/admin/${slug}/inbox` : `/api/admin/instagram/connect?slug=${slug}`}
          className="text-sm font-semibold px-4 py-2 rounded-lg flex-shrink-0"
          style={{ background: INK, color: '#fff' }}
        >
          {igConnected ? t.openInbox : t.connect}
        </Link>
      </div>
    </div>
  )
}
