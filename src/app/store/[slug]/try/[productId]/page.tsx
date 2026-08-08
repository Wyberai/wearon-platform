'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type TryOnState = 'idle' | 'uploading' | 'processing' | 'done' | 'error'

interface ProductInfo {
  id: string
  name: string
  price_inr: number
  original_price_inr: number | null
  garment_image_url: string
  mesh_url?: string | null
  sizes: string[]
  description: string | null
}

interface StoreConfig {
  seller_id?: string
  brand_name: string
  primary_color: string
  whatsapp_number: string | null
  payment_method: string
}

// Pre-staged try-on result images per demo product (convincing Indian fashion photos)
const DEMO_RESULTS: Record<string, string> = {
  p1: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&h=700&fit=crop&crop=top',
  p2: 'https://images.unsplash.com/photo-1617627143233-b27e68dda5df?w=500&h=700&fit=crop&crop=top',
  p3: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&h=700&fit=crop&crop=top',
  p4: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=500&h=700&fit=crop&crop=top',
}

export default function TryOnPage() {
  const { slug, productId } = useParams() as { slug: string; productId: string }
  const [product, setProduct] = useState<ProductInfo | null>(null)
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [state, setState] = useState<TryOnState>('idle')
  const [resultUrl, setResultUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [tryOnId, setTryOnId] = useState<string | null>(null)
  const [progressPct, setProgressPct] = useState(0)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [show3d, setShow3d] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const isDemo = slug === 'demo'

  async function submitReview() {
    if (!reviewRating || !config?.seller_id) return
    const deviceToken = localStorage.getItem('wearon_device_token') ?? crypto.randomUUID()
    await fetch('/api/store/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: productId,
        seller_id: config.seller_id,
        device_token: deviceToken,
        rating: reviewRating,
        comment: reviewComment || null,
      }),
    })
    setReviewSubmitted(true)
  }

  async function shareResult() {
    if (navigator.share && resultUrl) {
      try {
        await navigator.share({ text: `I just tried on ${product?.name} — check it out!`, url: resultUrl })
        return
      } catch { /* fall through to clipboard */ }
    }
    if (resultUrl) { navigator.clipboard.writeText(resultUrl) }
  }

  useEffect(() => {
    fetch(`/api/store/product?slug=${slug}&productId=${productId}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data.product)
        setConfig(data.config)
        if (data.product?.sizes?.[0]) setSelectedSize(data.product.sizes[0])
      })
  }, [slug, productId])

  function handleSelfieChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setSelfiePreview(ev.target?.result as string)
      handleTryOn(file)
    }
    reader.readAsDataURL(file)
  }

  async function handleTryOn(selfieFile: File) {
    setState('uploading')
    setError(null)
    setResultUrl(null)
    setProgressPct(0)

    if (isDemo) {
      // Demo mode: try real AI first (Replicate), fall back to client-side simulation
      setState('processing')
      setProgressPct(5)

      const demoForm = new FormData()
      demoForm.append('selfie', selfieFile)
      demoForm.append('product_id', productId)

      let tryonId = 'local-sim'
      let useSimulation = false

      try {
        const res = await fetch('/api/tryon/demo', { method: 'POST', body: demoForm })
        const data = await res.json()
        tryonId = data.tryon_id ?? 'local-sim'
        useSimulation = data.status === 'simulated' || tryonId === 'local-sim'
      } catch {
        useSimulation = true
      }

      if (useSimulation) {
        // No API key or error — run client-side fake simulation
        const start = Date.now()
        const duration = 18000
        const interval = setInterval(() => {
          const elapsed = Date.now() - start
          const pct = Math.min(95, Math.round((elapsed / duration) * 100))
          setProgressPct(pct)
          if (pct >= 95) clearInterval(interval)
        }, 300)
        await new Promise(r => setTimeout(r, duration))
        clearInterval(interval)
        setProgressPct(100)
        const result = DEMO_RESULTS[productId] ?? product?.garment_image_url ?? ''
        setResultUrl(result)
        setTryOnId('demo-sim-' + Date.now())
        setState('done')
        return
      }

      // Real Replicate prediction — poll for result
      setTryOnId(tryonId)
      let elapsed = 0
      while (elapsed < 120000) {
        await new Promise(r => setTimeout(r, 3000))
        elapsed += 3000
        // Progress: 5% → 90% over ~60s
        setProgressPct(Math.min(90, 5 + Math.round((elapsed / 60000) * 85)))
        try {
          const poll = await fetch(`/api/tryon/demo?id=${tryonId}`)
          const result = await poll.json()
          if (result.status === 'done' && result.result_url) {
            setProgressPct(100)
            setResultUrl(result.result_url)
            setState('done')
            return
          }
          if (result.status === 'failed') {
            setState('error')
            setError(result.error ?? 'Try-on failed')
            return
          }
        } catch { /* keep polling */ }
      }
      setState('error')
      setError('Processing timed out')
      return
    }

    // Real mode: call the API
    const formData = new FormData()
    formData.append('selfie', selfieFile)
    formData.append('product_id', productId)
    formData.append('slug', slug)

    try {
      const res = await fetch('/api/tryon', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Try-on failed')

      setTryOnId(data.tryon_id)
      setState('processing')
      pollResult(data.tryon_id)
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  async function pollResult(id: string) {
    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 2000))
      setProgressPct(Math.min(90, 20 + i * 2))
      try {
        const res = await fetch(`/api/tryon?id=${id}`)
        const data = await res.json()
        if (data.status === 'done') {
          setProgressPct(100)
          setResultUrl(data.result_url)
          setState('done')
          return
        }
        if (data.status === 'failed') {
          setState('error')
          setError(data.error ?? 'Try-on failed')
          return
        }
      } catch { /* keep polling */ }
    }
    setState('error')
    setError('Processing timed out. Please try again.')
  }

  function buildWhatsAppMessage() {
    if (!product || !config) return '#'
    const msg = encodeURIComponent(
      `Hi! I just tried on *${product.name}* on your WearOn store and I love it! 😍\n\n` +
      `📏 Size: ${selectedSize || 'Please suggest'}\n` +
      `💰 Price: ₹${product.price_inr.toLocaleString('en-IN')}\n\n` +
      `Can I place an order?`
    )
    const phone = (config.whatsapp_number ?? '').replace(/\D/g, '')
    return `https://wa.me/${phone}?text=${msg}`
  }

  async function handleWhatsAppClick() {
    if (tryOnId && !isDemo) {
      fetch('/api/tryon/whatsapp-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tryon_id: tryOnId }),
      })
    }
    window.open(buildWhatsAppMessage(), '_blank')
  }

  if (!product || !config) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const primaryColor = config.primary_color

  return (
    <div className="max-w-md mx-auto px-4 pb-12">
      {/* Back */}
      <Link href={`/store/${slug}`} className="flex items-center gap-2 text-sm text-gray-500 py-4 hover:text-gray-700">
        ← Back to store
      </Link>

      {/* Product info */}
      <div className="flex gap-4 mb-6">
        <img
          src={product.garment_image_url}
          alt={product.name}
          className="w-24 h-24 rounded-xl object-cover border border-gray-100 flex-shrink-0"
        />
        <div>
          <h1 className="font-bold text-gray-900 text-lg leading-tight">{product.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span style={{ color: primaryColor }} className="font-bold text-xl">
              ₹{product.price_inr.toLocaleString('en-IN')}
            </span>
            {product.original_price_inr && (
              <span className="text-gray-400 text-sm line-through">
                ₹{product.original_price_inr.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {product.description && <p className="text-xs text-gray-500 mt-1">{product.description}</p>}
        </div>
      </div>

      {/* Size selector */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Select Size</p>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={selectedSize === size ? { backgroundColor: primaryColor, borderColor: primaryColor, color: 'white' } : {}}
                className="px-4 py-1.5 rounded-lg text-sm border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Try-on area */}
      <div className="bg-gray-50 rounded-2xl p-6 text-center">

        {state === 'idle' && (
          <>
            <div className="text-5xl mb-4">📸</div>
            <h2 className="font-bold text-gray-900 text-xl mb-2">Try it on yourself</h2>
            <p className="text-gray-500 text-sm mb-6">
              Take a selfie or upload a photo — see how this looks on you in seconds
            </p>
            <div className="space-y-3">
              <button
                onClick={() => cameraRef.current?.click()}
                style={{ backgroundColor: primaryColor }}
                className="w-full text-white py-3.5 rounded-xl font-semibold text-base active:opacity-90"
              >
                📷 Take Selfie
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-medium text-base hover:bg-gray-50 transition-colors"
              >
                🖼️ Upload Photo
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">Your photo is not stored · AI-generated try-on</p>
          </>
        )}

        {(state === 'uploading' || state === 'processing') && (
          <div>
            {selfiePreview && (
              <img
                src={selfiePreview}
                alt="Your photo"
                className="w-28 h-28 rounded-full object-cover mx-auto mb-5 border-4 border-white shadow-md"
              />
            )}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: primaryColor, borderTopColor: 'transparent' }} />
              <span className="text-gray-700 font-medium text-sm">
                {state === 'uploading' ? 'Uploading your photo...' : 'AI is fitting the garment on you...'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto mb-3">
              <div
                style={{ backgroundColor: primaryColor, width: `${progressPct}%`, transition: 'width 0.3s ease' }}
                className="h-2 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-400">
              {progressPct < 30 ? 'Detecting body keypoints...' :
               progressPct < 60 ? 'Segmenting garment...' :
               progressPct < 85 ? 'Running diffusion model...' :
               'Upscaling result...'}
            </p>
          </div>
        )}

        {state === 'done' && resultUrl && (
          <div>
            <div className="relative inline-block w-full max-w-xs mx-auto">
              <img
                src={resultUrl}
                alt="Your try-on result"
                className="w-full rounded-xl shadow-lg"
              />
              <div
                style={{ backgroundColor: primaryColor }}
                className="absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded-lg"
              >
                WearOn AI ✨
              </div>
            </div>

            <h3 className="font-bold text-gray-900 text-lg mt-5 mb-1">Looks amazing on you! 🎉</h3>
            <p className="text-sm text-gray-500 mb-4">Ready to order? Tap below to send a WhatsApp message.</p>

            <button
              onClick={handleWhatsAppClick}
              className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
            >
              <span className="text-xl">💬</span>
              Order via WhatsApp · ₹{product.price_inr.toLocaleString('en-IN')}
            </button>

            <button
              onClick={() => { setState('idle'); setSelfiePreview(null); setResultUrl(null); setProgressPct(0) }}
              className="w-full bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-medium text-sm mt-2 hover:bg-gray-50 transition-colors"
            >
              Try Again with Different Photo
            </button>

            {/* Share button */}
            <button
              onClick={shareResult}
              className="w-full bg-white border border-gray-200 text-gray-600 py-3 rounded-xl font-medium text-sm mt-2 hover:bg-gray-50 transition-colors"
            >
              Share My Try-On →
            </button>

            {/* 3D view */}
            {product.mesh_url && (
              <div className="mt-4">
                <button
                  onClick={() => setShow3d(!show3d)}
                  className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors"
                >
                  {show3d ? 'Hide 3D View' : '🔄 View in 3D'}
                </button>
                {show3d && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
                    {/* model-viewer web component */}
                    <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js" />
                    {/* @ts-expect-error - model-viewer is a web component */}
                    <model-viewer
                      src={product.mesh_url}
                      alt={product.name}
                      shadow-intensity="1"
                      camera-controls
                      auto-rotate
                      style={{ width: '100%', height: '400px' }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Review section */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              {reviewSubmitted ? (
                <p className="text-sm text-green-600 text-center font-medium">Thanks for your review! 🙏</p>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">How did the try-on help?</p>
                  <div className="flex gap-2 justify-center mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="text-2xl transition-transform hover:scale-110"
                        style={{ color: star <= reviewRating ? '#F59E0B' : '#D1D5DB' }}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  {reviewRating > 0 && (
                    <>
                      <textarea
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        placeholder="Share your experience (optional)..."
                        maxLength={500}
                        rows={2}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 mb-2"
                      />
                      <button
                        onClick={submitReview}
                        style={{ backgroundColor: primaryColor }}
                        className="w-full text-white py-2.5 rounded-lg font-medium text-sm"
                      >
                        Submit Review
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {state === 'error' && (
          <div>
            <div className="text-5xl mb-4">😕</div>
            <h3 className="font-bold text-gray-900 mb-2">Couldn&apos;t complete try-on</h3>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => { setState('idle'); setSelfiePreview(null); setProgressPct(0) }}
              style={{ backgroundColor: primaryColor }}
              className="text-white px-6 py-3 rounded-xl font-medium"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Hidden file inputs */}
      <input ref={cameraRef} type="file" accept="image/*" capture="user" onChange={handleSelfieChange} className="hidden" />
      <input ref={fileRef} type="file" accept="image/*" onChange={handleSelfieChange} className="hidden" />
    </div>
  )
}
