'use client'

import { useState } from 'react'

export function ApiKeyCard() {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [masked, setMasked] = useState(true)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [referredCount, setReferredCount] = useState(0)
  const [keyLoaded, setKeyLoaded] = useState(false)

  async function loadKey() {
    if (keyLoaded) return
    const res = await fetch('/api/admin/api-key')
    const data = await res.json()
    setApiKey(data.api_key)
    setKeyLoaded(true)

    const refRes = await fetch('/api/referral')
    const refData = await refRes.json()
    setReferralCode(refData.referral_code)
    setReferredCount(refData.referred_count ?? 0)
  }

  async function generateKey() {
    if (!confirm('This will invalidate your current key. Continue?')) return
    setLoading(true)
    const res = await fetch('/api/admin/api-key', { method: 'POST' })
    const data = await res.json()
    setApiKey(data.api_key)
    setMasked(false)
    setTimeout(() => setMasked(true), 10000)
    setLoading(false)
  }

  async function revokeKey() {
    if (!confirm('Revoke your API key? All integrations using it will stop working.')) return
    setLoading(true)
    await fetch('/api/admin/api-key', { method: 'DELETE' })
    setApiKey(null)
    setLoading(false)
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function displayKey(key: string) {
    if (!masked) return key
    return `weon_live_${'•'.repeat(20)}${key.slice(-4)}`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* API Key section */}
      <div style={{
        background: '#18181b',
        border: '1px solid #27272a',
        borderRadius: 12,
        padding: 24,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>
          API Key
        </h3>
        <p style={{ fontSize: 13, color: '#71717a', margin: '0 0 20px' }}>
          Use your API key to call the WearOn try-on endpoint from your own apps.
        </p>

        {!keyLoaded ? (
          <button
            onClick={loadKey}
            style={{
              background: '#27272a',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Load API Key
          </button>
        ) : apiKey ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              background: '#09090b',
              border: '1px solid #27272a',
              borderRadius: 8,
              padding: '10px 14px',
              fontFamily: 'monospace',
              fontSize: 13,
              color: '#a1a1aa',
              letterSpacing: '0.5px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
              overflowX: 'auto',
            }}>
              <span style={{ flexShrink: 0 }}>{displayKey(apiKey)}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => { setMasked(m => !m); if (masked) setTimeout(() => setMasked(true), 10000) }}
                style={{ background: '#27272a', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}
              >
                {masked ? 'Reveal (10s)' : 'Hide'}
              </button>
              <button
                onClick={() => copy(apiKey)}
                style={{ background: '#27272a', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={generateKey}
                disabled={loading}
                style={{ background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}
              >
                Rotate Key
              </button>
              <button
                onClick={revokeKey}
                disabled={loading}
                style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}
              >
                Revoke
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ color: '#71717a', fontSize: 13 }}>No API key generated yet.</span>
            <button
              onClick={generateKey}
              disabled={loading}
              style={{ background: '#F72585', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}
            >
              Generate Key
            </button>
          </div>
        )}
      </div>

      {/* Referral section */}
      {keyLoaded && referralCode && (
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: 12,
          padding: 24,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#fff' }}>
            Refer a Seller — Get 200 Free Try-Ons
          </h3>
          <p style={{ fontSize: 13, color: '#71717a', margin: '0 0 16px' }}>
            Share your code. Every seller who signs up with it earns you 200 extra try-ons.
            You&apos;ve referred {referredCount} seller{referredCount !== 1 ? 's' : ''} so far.
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <code style={{
              background: '#09090b',
              border: '1px solid #27272a',
              borderRadius: 6,
              padding: '8px 16px',
              fontSize: 15,
              color: '#F72585',
              fontWeight: 700,
              letterSpacing: 2,
            }}>
              {referralCode.toUpperCase()}
            </code>
            <button
              onClick={() => copy(referralCode)}
              style={{ background: '#27272a', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', cursor: 'pointer', fontSize: 13 }}
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <a
              href={`https://wa.me/?text=Join%20WearOn%20and%20get%20200%20free%20try-ons%3A%20wearon.in%2Fsignup%3Fref%3D${referralCode}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ background: '#16a34a', color: '#fff', borderRadius: 6, padding: '8px 16px', textDecoration: 'none', fontSize: 13 }}
            >
              Share on WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
