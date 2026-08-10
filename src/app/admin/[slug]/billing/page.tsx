import Link from 'next/link'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { PLAN_AI_REPLY_LIMITS, PLANS } from '@/lib/constants'
import { ApiKeyCard } from '@/components/admin/ApiKeyCard'

const PLAN_FEATURES: Record<string, string[]> = {
  free:       ['10 products', 'Branded PWA store', 'WhatsApp orders', `${PLAN_AI_REPLY_LIMITS.free} AI replies/month`, 'No try-on / AI photoshoot'],
  starter:    ['100 products', 'Branded PWA store', 'WhatsApp orders', 'Margin tracking & analytics', `${PLAN_AI_REPLY_LIMITS.starter} AI replies/month (WhatsApp + Instagram + Facebook)`, 'No try-on / AI photoshoot'],
  growth:     ['500 products', 'Everything in Store', 'Native Android app for you (seller app)', 'Branded Android app for your buyers', 'Play Store listing', `${PLAN_AI_REPLY_LIMITS.growth.toLocaleString('en-IN')} AI replies/month`, 'No try-on / AI photoshoot'],
  pro:        ['Unlimited products', 'Everything in Store + App', 'Buyer virtual try-on (300/month)', 'AI photoshoot — cloth to model photo/video (150/month)', `${PLAN_AI_REPLY_LIMITS.pro.toLocaleString('en-IN')} AI replies/month`],
  enterprise: ['Unlimited everything', 'Unlimited try-on & AI photoshoot', 'Unlimited AI replies', 'Own Play Store account', 'Custom domain', 'Dedicated support', 'White-glove onboarding'],
}

export default async function BillingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const admin = createAdminClient()
  const { data: profile } = await admin.from('profiles').select('plan, try_ons_used, try_ons_limit, ai_replies_used, ai_reply_limit, subscription_status').eq('id', user.id).single()

  const currentPlan = (profile?.plan ?? 'free') as keyof typeof PLANS
  const plan = PLANS[currentPlan]
  const tryOnPct = profile ? Math.round((profile.try_ons_used / profile.try_ons_limit) * 100) : 0
  const aiReplyPct = profile ? Math.round((profile.ai_replies_used / (profile.ai_reply_limit || 1)) * 100) : 0

  const dodoBusinessId = process.env.NEXT_PUBLIC_DODO_BUSINESS_ID
  const dodoPlanIds: Record<string, string | undefined> = {
    starter:    process.env.DODO_PRODUCT_STARTER,
    growth:     process.env.DODO_PRODUCT_GROWTH,
    pro:        process.env.DODO_PRODUCT_PRO,
    enterprise: process.env.DODO_PRODUCT_ENTERPRISE,
  }

  function checkoutUrl(planKey: string) {
    const productId = dodoPlanIds[planKey]
    if (!productId || !dodoBusinessId) return '/auth/login'
    const email = user?.email ?? ''
    return `https://checkout.dodopayments.com/buy/${productId}?quantity=1&email=${encodeURIComponent(email)}&metadata[seller_id]=${user!.id}&metadata[slug]=${slug}&redirect_url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/admin/${slug}/billing?upgraded=1`)}`
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Plan</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your subscription and try-on credits</p>
      </div>

      {/* Current plan */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-semibold text-pink-600 uppercase tracking-wide">Current Plan</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">{plan.name}</h2>
            <p className="text-gray-500 text-sm mt-1">
              {plan.price_inr === 0 ? 'Free forever' : `₹${plan.price_inr.toLocaleString('en-IN')}/month`}
              {profile?.subscription_status === 'active' && (
                <span className="ml-2 text-green-600 font-medium">· Active</span>
              )}
            </p>
          </div>
          {currentPlan !== 'enterprise' && (
            <span className="text-xs bg-pink-50 text-pink-700 border border-pink-100 px-3 py-1.5 rounded-full font-medium">
              Upgrade to unlock more →
            </span>
          )}
        </div>

        {/* Try-on usage */}
        <div className="mt-6 pt-6 border-t border-gray-50">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Try-ons this month</span>
            <span className="font-semibold">{profile?.try_ons_used ?? 0} / {profile?.try_ons_limit ?? 20}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${tryOnPct > 80 ? 'bg-red-500' : 'bg-pink-500'}`}
              style={{ width: `${Math.min(tryOnPct, 100)}%` }}
            />
          </div>
          {tryOnPct > 80 && (
            <p className="text-xs text-red-600 mt-2">Running low! Overages are ₹3 per try-on.</p>
          )}
        </div>

        {/* AI reply usage */}
        <div className="mt-6 pt-6 border-t border-gray-50">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">AI replies this month (WhatsApp + Instagram + Messenger)</span>
            <span className="font-semibold">{profile?.ai_replies_used ?? 0} / {profile?.ai_reply_limit ?? 50}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${aiReplyPct > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(aiReplyPct, 100)}%` }}
            />
          </div>
          {aiReplyPct >= 100 && (
            <p className="text-xs text-red-600 mt-2">Limit reached — new messages won&apos;t get an AI reply until you upgrade or the month resets. You can still reply manually from the Inbox.</p>
          )}
          {aiReplyPct > 80 && aiReplyPct < 100 && (
            <p className="text-xs text-amber-600 mt-2">Running low on AI replies this month.</p>
          )}
        </div>
      </div>

      {/* Plan cards */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upgrade your plan</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][])
          .filter(([k]) => k !== 'free' && k !== currentPlan)
          .map(([key, p]) => {
            const features = PLAN_FEATURES[key] ?? []
            const isEnterprise = key === 'enterprise'
            return (
              <div key={key} className={`bg-white rounded-xl border-2 p-6 ${key === 'growth' ? 'border-pink-300' : 'border-gray-100'}`}>
                {key === 'growth' && (
                  <div className="text-xs font-bold text-pink-600 uppercase tracking-wide mb-2">Most Popular</div>
                )}
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {p.price_inr === 0 ? 'Free' : `₹${p.price_inr.toLocaleString('en-IN')}`}
                  {p.price_inr > 0 && <span className="text-sm font-normal text-gray-400">/mo</span>}
                </div>
                <div className="font-semibold text-gray-700 mb-4">{p.name}</div>
                <ul className="space-y-1.5 mb-5">
                  {features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-pink-500 mt-0.5 flex-shrink-0">✓</span> {f}
                    </li>
                  ))}
                </ul>
                {isEnterprise ? (
                  <a
                    href="https://wa.me/919100000000?text=Hi%2C+I+want+to+discuss+the+Enterprise+plan+for+WearOn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-2.5 rounded-lg text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 transition-colors"
                  >
                    Contact Sales
                  </a>
                ) : (
                  <a
                    href={checkoutUrl(key)}
                    className={`block text-center py-2.5 rounded-lg text-sm font-semibold transition-colors ${key === 'growth' ? 'bg-pink-600 text-white hover:bg-pink-700' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
                  >
                    Upgrade to {p.name} →
                  </a>
                )}
              </div>
            )
          })
        }
      </div>

      <p className="text-sm text-gray-400 text-center mb-10">
        Pay via UPI, cards, or net banking · Annual plans get 2 months free ·{' '}
        <Link href={`/store/${slug}`} className="text-pink-600 hover:underline" target="_blank">View your store</Link>
      </p>

      {/* API Access + Referral */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">API Access &amp; Referrals</h3>
      <ApiKeyCard />
    </div>
  )
}
