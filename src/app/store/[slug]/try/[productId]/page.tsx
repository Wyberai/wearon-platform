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
  sizes: string[]
  description: string | null
}

interface StoreConfig {
  brand_name: string
  primary_color: string
  whatsapp_number: string | null
  payment_method: string
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
  const fileRef = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)

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
    reader.onload = ev => { setSelfiePreview(ev.target?.result as string); handleTryOn(file) }
    reader.readAsDataURL(file)
  }

  async function handleTryOn(selfieFile: File) {
    setState('uploading')
    setError(null)
    setResultUrl(null)

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
      try {
        const res = await fetch(`/api/tryon?id=${id}`)
        const data = await res.json()
        if (data.status === 'done') { setResultUrl(data.result_url); setState('done'); return }
        if (data.status === 'failed') { setState('error'); setError(data.error ?? 'Try-on failed'); return }
      } catch { /* keep polling */ }
    }
    setState('error')
    setError('Processing timed out. Please try again.')
  }

  function buildWhatsAppMessage() {
    if (!product || !config) return '#'
    const msg = encodeURIComponent(
      `Hi! I just tried on *${product.name}* on your WearOn store and I love it! 😍\n\n` +
      `Size: ${selectedSize || 'Please suggest'}\n` +
      `Price: ₹${product.price_inr.toLocaleString('en-IN')}\n\n` +
      `Store link: ${window.location.origin}/store/${slug}\n\n` +
      `Can I order this?`
    )
    const phone = (config.whatsapp_number ?? '').replace(/\D/g, '')
    return `https://wa.me/${phone}?text=${msg}`
  }

  async function handleWhatsAppClick() {
    if (tryOnId) {
      fetch('/api/tryon/whatsapp-click', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tryon_id: tryOnId }) })
    }
    window.open(buildWhatsAppMessage(), '_blank')
  }

  if (!product || !config) {
    return <div className="flex items-center justify-center py-20 text-gray-400 text-sm">Loading...</div>
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
        <img src={product.garment_image_url} alt={product.name}
          className="w-24 h-24 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
        <div>
          <h1 className="font-bold text-gray-900 text-lg leading-tight">{product.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span style={{ color: primaryColor }} className="font-bold text-xl">₹{product.price_inr.toLocaleString('en-IN')}</span>
            {product.original_price_inr && (
              <span className="text-gray-400 text-sm line-through">₹{product.original_price_inr.toLocaleString('en-IN')}</span>
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
              <button key={size} onClick={() => setSelectedSize(size)}
                style={selectedSize === size ? { backgroundColor: primaryColor, borderColor: primaryColor, color: 'white' } : {}}
                className="px-4 py-1.5 rounded-lg text-sm border border-gray-200 hover:border-gray-300 transition-colors">
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
            <p className="text-gray-500 text-sm mb-6">Take a selfie or upload your photo — see how this looks on you in seconds</p>
            <div className="space-y-3">
              <button
                onClick={() => cameraRef.current?.click()}
                style={{ backgroundColor: primaryColor }}
                className="w-full text-white py-3.5 rounded-xl font-semibold text-base"
              >
                Take Selfie
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-medium text-base hover:bg-gray-50 transition-colors"
              >
                Upload Photo
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">Your photo is not stored. Try-on is AI-generated.</p>
          </>
        )}

        {(state === 'uploading' || state === 'processing') && (
          <div>
            {selfiePreview && (
              <img src={selfiePreview} alt="Your photo" className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow" />
            )}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-700 font-medium">
                {state === 'uploading' ? 'Uploading your photo...' : 'AI is fitting the garment...'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
              <div style={{ backgroundColor: primaryColor, width: state === 'uploading' ? '30%' : '75%' }} className="h-2 rounded-full animate-pulse" />
            </div>
            <p className="text-xs text-gray-400 mt-3">Usually takes 15–25 seconds</p>
          </div>
        )}

        {state === 'done' && resultUrl && (
          <div>
            <div className="relative inline-block">
              <img src={resultUrl} alt="Try-on result" className="w-full max-w-xs mx-auto rounded-xl shadow-lg" />
              <div style={{ backgroundColor: primaryColor }} className="absolute top-3 right-3 text-white text-xs font-bold px-2 py-1 rounded-lg">
                WearOn AI
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mt-4 mb-2">Looking great! 🎉</h3>

            {/* WhatsApp order button */}
            {config.whatsapp_number && (
              <button onClick={handleWhatsAppClick}
                className="w-full bg-green-500 text-white py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 hover:bg-green-600 transition-colors mt-3">
                <span className="text-xl">💬</span>
                Order on WhatsApp · ₹{product.price_inr.toLocaleString('en-IN')}
              </button>
            )}

            <button onClick={() => { setState('idle'); setSelfiePreview(null); setResultUrl(null) }}
              className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-medium text-sm mt-2 hover:bg-gray-200 transition-colors">
              Try Again / Different Photo
            </button>
          </div>
        )}

        {state === 'error' && (
          <div>
            <div className="text-5xl mb-4">😕</div>
            <h3 className="font-bold text-gray-900 mb-2">Couldn&apos;t complete try-on</h3>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button onClick={() => { setState('idle'); setSelfiePreview(null) }}
              style={{ backgroundColor: primaryColor }}
              className="text-white px-6 py-3 rounded-xl font-medium">
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
