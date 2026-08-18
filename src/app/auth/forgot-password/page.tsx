'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { BrandLogo } from '@/components/BrandLogo'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
const supabase = createBrowserClient(
  supabaseUrl.startsWith('http') ? supabaseUrl : 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
)

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    setLoading(false)
    if (authError) {
      setError('Could not send reset email. Please try again.')
      return
    }
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-[#FAF7F3] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6"><BrandLogo size={40} /></div>
          <h1 className="text-2xl font-semibold text-gray-900">Reset your password</h1>
          <p className="text-sm text-gray-500 mt-2">
            {sent
              ? 'Check your inbox for a reset link.'
              : "Enter your email and we'll send a reset link."}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-2.5 bg-pink-600 text-white text-sm font-semibold rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>

            <p className="text-center text-sm text-gray-500">
              <Link href="/auth/login" className="text-pink-600 hover:underline">
                Back to login
              </Link>
            </p>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              We sent a reset link to <strong>{email}</strong>. It expires in 1 hour.
            </p>
            <Link href="/auth/login" className="text-sm text-pink-600 hover:underline">
              Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
