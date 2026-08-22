'use client'

import { useRef, useState } from 'react'
import { getOrCreateDeviceToken } from '@/lib/device-token'

type TryOnStep = 'idle' | 'upload' | 'generating' | 'done' | 'error'

interface TryOnLauncherProps {
  slug: string
  productName: string
  garmentImageUrl: string
  priceInr: number
  currency?: string
  whatsappNumber?: string | null
  videoUrl?: string | null
  sellerId?: string | null
  productId?: string
}

// Theme-native like AiStylistSearch — reads the same --primary/--store-*
// CSS custom properties every flagship theme already sets, so this drops
// into any of the 12 themes' PDPs without a per-theme variant. Ports the
// try-on flow that already existed (and worked) in the generic/non-flagship
// PDP, fixed to call POST /api/store/try-on with `store_slug` — the seller_id
// is resolved server-side from the slug for a real seller, but the reserved
// demo slugs (august, dhamaka, etc.) resolve to no seller, so this correctly
// self-hides via the SELLER_NO_CREDITS/store-not-found response on those.
// Also renders the product's garment_video_url (if set) above the button —
// bundled here rather than as a separate component since this is already
// the one shared injection point wired into all 12 flagship PDPs.
export function TryOnLauncher({ slug, productName, garmentImageUrl, priceInr, currency, whatsappNumber, videoUrl, sellerId, productId }: TryOnLauncherProps) {
  const [step, setStep] = useState<TryOnStep>('idle')
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ image_url?: string; video_url?: string } | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)
  const [hidden, setHidden] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Real wishlist backend (POST /api/store/wishlist) — no per-item "is this
  // saved" check exists server-side, so this reflects only what happened in
  // this page view, not prior visits; still a genuine save, unlike the
  // localStorage-only version this replaces on Scroll.
  async function toggleWishlist() {
    if (!sellerId || !productId || saving) return
    setSaving(true)
    try {
      await fetch('/api/store/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seller_id: sellerId, product_id: productId, device_token: getOrCreateDeviceToken() }),
      })
      setSaved(true)
    } catch { /* best-effort */ }
    setSaving(false)
  }

  const currencySymbol = currency === 'USD' ? '$' : '₹'
  const priceLocale = currency === 'USD' ? 'en-US' : 'en-IN'

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string
      setPhotoPreview(dataUrl)
      setPhotoDataUrl(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  async function startTryOn() {
    if (!photoDataUrl) return
    setStep('generating')
    setResult(null)
    setError('')

    const res = await fetch('/api/store/try-on', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        store_slug: slug,
        garment_image_url: garmentImageUrl,
        buyer_image_url: photoDataUrl,
        output_type: 'both',
      }),
    })
    const data = await res.json()

    if (data.code === 'SELLER_NO_CREDITS' || res.status === 404) {
      setHidden(true)
      return
    }
    if (data.error || !data.job_id) {
      setStep('error')
      setError(data.error ?? 'Try-on failed')
      return
    }

    pollRef.current = setInterval(async () => {
      const pollRes = await fetch(`/api/store/try-on?job_id=${data.job_id}`)
      const pollData = await pollRes.json()
      if (pollData.status === 'completed') {
        clearInterval(pollRef.current!)
        setResult({ image_url: pollData.image_url, video_url: pollData.video_url })
        setStep('done')
      } else if (pollData.status === 'failed') {
        clearInterval(pollRef.current!)
        setStep('error')
        setError(pollData.error ?? 'Generation failed')
      }
    }, 5000)
  }

  function close() {
    clearInterval(pollRef.current!)
    setStep('idle')
    setResult(null)
    setPhotoPreview(null)
    setPhotoDataUrl(null)
    setError('')
  }

  async function shareResult() {
    const url = result?.video_url ?? result?.image_url ?? (typeof window !== 'undefined' ? window.location.href : '')
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title: `Me in ${productName}`, url }); return } catch { /* fall through */ }
    }
    if (typeof navigator !== 'undefined') navigator.clipboard?.writeText(url)
  }

  function orderOnWhatsApp() {
    if (!whatsappNumber) return
    const phone = whatsappNumber.replace(/\D/g, '')
    const text = `Hi! I'd like to order *${productName}* — I just tried it on and love it!\n💰 Price: ${currencySymbol}${priceInr.toLocaleString(priceLocale)}\n\nCan you confirm availability and share payment details?`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank')
  }

  if (hidden) return null

  const primary = 'var(--primary, #A6134A)'

  return (
    <>
      {videoUrl && (
        <video
          src={videoUrl}
          controls
          playsInline
          preload="metadata"
          style={{ width: '100%', borderRadius: 16, marginBottom: 12, display: 'block', background: '#000' }}
        />
      )}
      <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        <button
          onClick={() => setStep('upload')}
          style={{
            flex: 1, padding: '14px', borderRadius: 16, fontSize: 14, fontWeight: 700,
            border: `2px solid ${primary}`, color: primary, background: 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'var(--store-font, inherit)',
          }}
        >
          <span style={{ fontSize: 18 }}>🪄</span> See yourself wearing this
        </button>
        {sellerId && productId && (
          <button
            onClick={toggleWishlist}
            disabled={saving}
            aria-label={saved ? 'Saved to wishlist' : 'Save to wishlist'}
            style={{
              width: 52, flexShrink: 0, borderRadius: 16, fontSize: 18,
              border: `2px solid ${saved ? primary : 'color-mix(in srgb, var(--store-ink, #171512) 20%, transparent)'}`,
              background: 'transparent', color: saved ? primary : 'var(--store-ink, #171512)',
              cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1,
            }}
          >
            {saved ? '♥' : '♡'}
          </button>
        )}
      </div>

      {step !== 'idle' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 480, padding: '24px 20px 40px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>
                {step === 'done' ? '✨ Your try-on' : '🪄 Try it on'}
              </div>
              <button onClick={close} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>

            {step === 'upload' && (
              <div>
                <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16, lineHeight: 1.5 }}>
                  Upload a full-length photo or selfie — AI will show you wearing this {productName}.
                  <span style={{ display: 'block', marginTop: 4, fontSize: 11, color: '#9CA3AF' }}>
                    🔒 Your photo is deleted immediately after generation. Never stored.
                  </span>
                </p>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed #E5E7EB', borderRadius: 16, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', background: photoPreview ? '#F9FAFB' : 'transparent', marginBottom: 16 }}
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="your photo" style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain', borderRadius: 12 }} />
                  ) : (
                    <div>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>🤳</div>
                      <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Tap to upload your photo</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Full-body works best · Selfies also work</div>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" capture="user" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                <button
                  onClick={startTryOn}
                  disabled={!photoDataUrl}
                  style={{ width: '100%', padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer', background: photoDataUrl ? `linear-gradient(135deg, ${primary}, #7209B7)` : '#F3F4F6', color: photoDataUrl ? '#fff' : '#9CA3AF' }}
                >
                  Generate Try-On ✨
                </button>
                <p style={{ fontSize: 10, color: '#9CA3AF', textAlign: 'center', marginTop: 8 }}>Takes about 45–90 seconds</p>
              </div>
            )}

            {step === 'generating' && (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', border: '4px solid #F3F4F6', borderTopColor: primary, animation: 'tryon-spin 0.8s linear infinite', margin: '0 auto 20px' }} />
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Generating your look…</div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>AI is placing the garment on you</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>Then creating a short video</div>
                <style>{`@keyframes tryon-spin { to { transform: rotate(360deg) } }`}</style>
              </div>
            )}

            {step === 'done' && result && (
              <div>
                {result.video_url ? (
                  <video src={result.video_url} autoPlay muted loop controls style={{ width: '100%', borderRadius: 16, marginBottom: 16 }} />
                ) : result.image_url ? (
                  <img src={result.image_url} alt="your try-on" style={{ width: '100%', borderRadius: 16, marginBottom: 16 }} />
                ) : null}
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <button onClick={shareResult} style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#25D366', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
                    💬 Share
                  </button>
                  {result.video_url && (
                    <a href={result.video_url} download="my-tryon.mp4" style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#F3F4F6', color: '#374151', fontWeight: 700, fontSize: 13, textDecoration: 'none', textAlign: 'center' }}>
                      ⬇ Save Video
                    </a>
                  )}
                </div>
                {whatsappNumber && (
                  <button onClick={orderOnWhatsApp} style={{ width: '100%', padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer', background: '#25D366', color: '#fff' }}>
                    💬 Love it? Order on WhatsApp · {currencySymbol}{priceInr.toLocaleString(priceLocale)}
                  </button>
                )}
              </div>
            )}

            {step === 'error' && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>😕</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Couldn&apos;t generate your look</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>{error || 'Please try again.'}</div>
                <button onClick={() => { setStep('upload'); setError('') }} style={{ padding: '10px 24px', borderRadius: 10, background: primary, color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
