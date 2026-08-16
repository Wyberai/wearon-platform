'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
// See the same fix in auth/login/page.tsx — the ssr browser client is
// required so the session lands in cookies the server can actually read.
const supabase = createBrowserClient(
  supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
)

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [brandName, setBrandName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  // Prefill from a live-preview handoff (StorePreviewCapture -> PreviewBanner
  // -> here), so a visitor who already gave us their email/derived brand name
  // never has to retype either — same silent-carry pattern the theme param
  // already used before this.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const prefilledEmail = params.get('email')
    const prefilledBrand = params.get('brand')
    if (prefilledEmail) setEmail(prefilledEmail)
    if (prefilledBrand) setBrandName(prefilledBrand)
  }, [])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const slug = brandName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20)
    if (!slug || slug.length < 3) {
      setError('Brand name must be at least 3 letters')
      setLoading(false)
      return
    }

    // Carried silently from a theme-card link on a segment landing page
    // (e.g. /insta?theme=reelrack) — not a visible form field, same as slug.
    const theme = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('theme') : null

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { brand_name: brandName, slug, ...(theme ? { theme_id: theme } : {}) } },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md w-full text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your inbox</h2>
          <p className="text-gray-500">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your store.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md w-full">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-pink-600">Instastarz</span>
          <h1 className="text-xl font-bold text-gray-900 mt-4">Create your fashion store</h1>
          <p className="text-gray-500 text-sm mt-1">Free forever · No credit card</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand / Store name</label>
            <input
              type="text"
              value={brandName}
              onChange={e => setBrandName(e.target.value)}
              placeholder="e.g. Zara Boutique"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
            {brandName.length >= 3 && (
              <p className="text-xs text-gray-400 mt-1">
                Your store: instastarz.in/store/{brandName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              minLength={8}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating store...' : 'Create My Store'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have a store? <Link href="/auth/login" className="text-pink-600 font-medium">Login</Link>
        </p>
      </div>
    </div>
  )
}
