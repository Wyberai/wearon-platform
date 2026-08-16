'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface BuildStatus {
  status: 'none' | 'queued' | 'building' | 'complete' | 'failed'
  apk_url?: string | null
}

interface Config {
  slug: string
  brand_name: string
  tagline: string | null
  whatsapp_number: string | null
  instagram_handle: string | null
  primary_color: string
  secondary_color: string | null
  accent_color: string | null
  background_color: string | null
  font_family: string | null
  payment_method: string | null
  payment_config: Record<string, string> | null
  try_on_enabled: boolean
  reviews_enabled: boolean
  wishlist_enabled: boolean
  faq_policy: string | null
}

const FONTS = ['poppins', 'inter', 'playfair', 'nunito', 'montserrat']
const PAYMENT_METHODS = [
  { value: 'whatsapp_order', label: 'WhatsApp Order (free)' },
  { value: 'razorpay', label: 'Razorpay (direct payment)' },
  { value: 'cod', label: 'Cash on Delivery' },
]

const APK_ELIGIBLE_PLANS = ['growth', 'pro', 'enterprise']

export default function SettingsPage() {
  const { slug } = useParams() as { slug: string }
  const [config, setConfig] = useState<Config | null>(null)
  const [form, setForm] = useState<Partial<Config>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState<string | null>(null)
  const [buyerBuild, setBuyerBuild] = useState<BuildStatus | null>(null)
  const [sellerBuild, setSellerBuild] = useState<BuildStatus | null>(null)
  const [buyerTriggering, setBuyerTriggering] = useState(false)
  const [sellerTriggering, setSellerTriggering] = useState(false)
  const [buildError, setBuildError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/admin/config?slug=${slug}`)
      .then(r => r.json())
      .then(d => {
        setConfig(d.config)
        setForm(d.config ?? {})
        setLoading(false)
      })
  }, [slug])

  useEffect(() => {
    fetch('/api/admin/ai-credits').then(r => r.json()).then(d => setPlan(d.plan ?? 'free')).catch(() => setPlan('free'))
    refreshBuildStatus()
  }, [])

  function refreshBuildStatus() {
    fetch('/api/admin/apk-build?app_type=buyer').then(r => r.json()).then(setBuyerBuild).catch(() => {})
    fetch('/api/admin/apk-build?app_type=seller').then(r => r.json()).then(setSellerBuild).catch(() => {})
  }

  async function triggerBuild(appType: 'buyer' | 'seller') {
    const setTriggering = appType === 'buyer' ? setBuyerTriggering : setSellerTriggering
    const setBuild = appType === 'buyer' ? setBuyerBuild : setSellerBuild
    setTriggering(true)
    setBuildError(null)
    try {
      const res = await fetch('/api/admin/apk-build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_type: appType }),
      })
      const data = await res.json()
      if (!res.ok) {
        setBuildError(data.error ?? 'Failed to start build.')
      } else {
        setBuild({ status: 'queued' })
      }
    } catch {
      setBuildError('Failed to start build. Please try again.')
    } finally {
      setTriggering(false)
    }
  }

  function update<K extends keyof Config>(key: K, value: Config[K]) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function updatePaymentConfig(key: string, value: string) {
    setForm(f => ({ ...f, payment_config: { ...(f.payment_config ?? {}), [key]: value } }))
  }

  async function save() {
    setSaving(true)
    setSaved(false)
    await fetch('/api/admin/config', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, ...form }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400 text-sm animate-pulse">Loading settings...</div>
      </div>
    )
  }

  const primary = form.primary_color ?? config?.primary_color ?? '#ec4899'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link href={`/admin/${slug}`} className="text-sm text-gray-500 hover:text-gray-700">
              ← Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">Settings</h1>
          </div>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ backgroundColor: primary }}
          >
            {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>

        {/* Brand */}
        <Section title="Brand">
          <Field label="Store Name">
            <input
              value={form.brand_name ?? ''}
              onChange={e => update('brand_name', e.target.value)}
              className="input"
              placeholder="e.g. Zara Boutique"
            />
          </Field>
          <Field label="Tagline">
            <input
              value={form.tagline ?? ''}
              onChange={e => update('tagline', e.target.value)}
              className="input"
              placeholder="e.g. Fashion for every mood"
            />
          </Field>
        </Section>

        {/* Contact */}
        <Section title="Contact">
          <Field label="WhatsApp Number" hint="Include country code: +91XXXXXXXXXX">
            <input
              value={form.whatsapp_number ?? ''}
              onChange={e => update('whatsapp_number', e.target.value)}
              className="input"
              placeholder="+919876543210"
            />
          </Field>
          <Field label="Instagram Handle" hint="Without the @">
            <input
              value={form.instagram_handle ?? ''}
              onChange={e => update('instagram_handle', e.target.value)}
              className="input"
              placeholder="yourboutique"
            />
          </Field>
        </Section>

        {/* Design */}
        <Section title="Design">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.primary_color ?? '#ec4899'}
                  onChange={e => update('primary_color', e.target.value)}
                  className="h-9 w-14 rounded cursor-pointer border border-gray-200"
                />
                <input
                  value={form.primary_color ?? '#ec4899'}
                  onChange={e => update('primary_color', e.target.value)}
                  className="input flex-1 font-mono uppercase"
                  maxLength={7}
                />
              </div>
            </Field>
            <Field label="Secondary Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.secondary_color ?? '#f9a8d4'}
                  onChange={e => update('secondary_color', e.target.value)}
                  className="h-9 w-14 rounded cursor-pointer border border-gray-200"
                />
                <input
                  value={form.secondary_color ?? '#f9a8d4'}
                  onChange={e => update('secondary_color', e.target.value)}
                  className="input flex-1 font-mono uppercase"
                  maxLength={7}
                />
              </div>
            </Field>
          </div>
          <Field label="Font">
            <div className="flex flex-wrap gap-2">
              {FONTS.map(f => (
                <button
                  key={f}
                  onClick={() => update('font_family', f)}
                  className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${
                    (form.font_family ?? 'poppins') === f
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  style={(form.font_family ?? 'poppins') === f ? { backgroundColor: primary } : {}}
                >
                  {f}
                </button>
              ))}
            </div>
          </Field>
        </Section>

        {/* Payment */}
        <Section title="Payment">
          <Field label="Order Method" hint="How buyers pay or enquire">
            <div className="space-y-2">
              {PAYMENT_METHODS.map(m => (
                <label key={m.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment_method"
                    value={m.value}
                    checked={(form.payment_method ?? 'whatsapp_order') === m.value}
                    onChange={() => update('payment_method', m.value)}
                    style={{ accentColor: primary }}
                  />
                  <span className="text-sm text-gray-700">{m.label}</span>
                </label>
              ))}
            </div>
          </Field>
          {(form.payment_method ?? 'whatsapp_order') === 'razorpay' && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <Field label="Razorpay Key ID" hint="From your Razorpay dashboard → Settings → API Keys">
                <input
                  value={form.payment_config?.razorpay_key_id ?? ''}
                  onChange={e => updatePaymentConfig('razorpay_key_id', e.target.value)}
                  className="input font-mono"
                  placeholder="rzp_live_xxxxxxxxxxxx"
                />
              </Field>
              <Field label="Razorpay Key Secret">
                <input
                  type="password"
                  value={form.payment_config?.razorpay_key_secret ?? ''}
                  onChange={e => updatePaymentConfig('razorpay_key_secret', e.target.value)}
                  className="input font-mono"
                  placeholder="••••••••••••••••"
                />
              </Field>
              {!(form.payment_config?.razorpay_key_id && form.payment_config?.razorpay_key_secret) && (
                <p className="text-xs text-amber-600">Add both keys to turn on online payment. Until then, buyers on this store still see WhatsApp order.</p>
              )}
            </div>
          )}
        </Section>

        {/* Support automation */}
        <Section title="Support Automation">
          <Field label="Returns, exchanges & shipping policy" hint="Your AI assistant uses this to answer support questions on WhatsApp, Instagram, and Facebook automatically — write it like you'd tell a new employee.">
            <textarea
              value={form.faq_policy ?? ''}
              onChange={e => update('faq_policy', e.target.value)}
              className="input"
              rows={4}
              placeholder="e.g. Returns accepted within 7 days if unused with tags. Exchanges are free. Delivery takes 3-5 days across India, 7-10 days for remote areas. COD available on orders under ₹5000."
            />
          </Field>
        </Section>

        {/* Feature flags */}
        <Section title="Features">
          {([
            { key: 'try_on_enabled', label: 'Virtual Try-on', desc: 'Buyers can try on clothes before ordering' },
            { key: 'reviews_enabled', label: 'Product Reviews', desc: 'Buyers can rate and review products' },
            { key: 'wishlist_enabled', label: 'Wishlist', desc: 'Buyers can save items to their wishlist' },
          ] as { key: keyof Config; label: string; desc: string }[]).map(feat => (
            <div key={feat.key} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium text-gray-900">{feat.label}</div>
                <div className="text-xs text-gray-400">{feat.desc}</div>
              </div>
              <button
                onClick={() => update(feat.key, !(form[feat.key] as boolean))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form[feat.key] ? 'bg-pink-600' : 'bg-gray-200'
                }`}
                style={form[feat.key] ? { backgroundColor: primary } : {}}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
                    form[feat.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </Section>

        {/* Store URL */}
        <Section title="Your Store">
          <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-600 font-mono">wearon.wyberai.com/store/{slug}</span>
            <a
              href={`/store/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium"
              style={{ color: primary }}
            >
              Open →
            </a>
          </div>
        </Section>

        {/* Mobile Apps */}
        <Section title="Mobile Apps">
          {plan && !APK_ELIGIBLE_PLANS.includes(plan) ? (
            <p className="text-sm text-gray-500">
              Native Android apps are available on the Store + App plan and above.{' '}
              <Link href={`/admin/${slug}/billing`} className="font-medium" style={{ color: primary }}>Upgrade →</Link>
            </p>
          ) : (
            <>
              {buildError && <p className="text-xs text-red-600">{buildError}</p>}
              <BuildRow
                title="Your Branded Buyer App"
                desc="A native Android app for your buyers, branded to your store — built fresh each time you trigger it."
                build={buyerBuild}
                triggering={buyerTriggering}
                onBuild={() => triggerBuild('buyer')}
                onRefresh={refreshBuildStatus}
                primary={primary}
              />
              <BuildRow
                title="Seller App (run your store from your phone)"
                desc="One shared app for every seller — install it and log in to manage your store on the go. Push notifications for new orders and messages."
                build={sellerBuild}
                triggering={sellerTriggering}
                onBuild={() => triggerBuild('seller')}
                onRefresh={refreshBuildStatus}
                primary={primary}
              />
            </>
          )}
        </Section>

        <div className="pb-8" />
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 14px;
          color: #111827;
          background: white;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus {
          border-color: ${primary};
        }
      `}</style>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="px-5 py-4 space-y-4">{children}</div>
    </div>
  )
}

function BuildRow({ title, desc, build, triggering, onBuild, onRefresh, primary }: {
  title: string
  desc: string
  build: BuildStatus | null
  triggering: boolean
  onBuild: () => void
  onRefresh: () => void
  primary: string
}) {
  const status = build?.status ?? 'none'
  const inFlight = status === 'queued' || status === 'building'

  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
      <div>
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
        {status === 'failed' && <div className="text-xs text-red-600 mt-1">Last build failed. Try again or contact support.</div>}
        {inFlight && <div className="text-xs text-amber-600 mt-1">{status === 'queued' ? 'Queued…' : 'Building…'} ready in ~12 min — <button onClick={onRefresh} className="underline">refresh</button></div>}
      </div>
      {status === 'complete' && build?.apk_url ? (
        <a href={build.apk_url} className="px-4 py-2 rounded-lg text-sm font-semibold text-white whitespace-nowrap" style={{ backgroundColor: primary }}>
          Download APK
        </a>
      ) : (
        <button
          onClick={onBuild}
          disabled={triggering || inFlight}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white whitespace-nowrap disabled:opacity-50"
          style={{ backgroundColor: primary }}
        >
          {inFlight ? 'Building…' : triggering ? 'Starting…' : 'Build'}
        </button>
      )}
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {children}
    </div>
  )
}
