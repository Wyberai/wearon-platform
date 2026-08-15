'use client'

import { useRef, useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getOrCreateDeviceToken } from '@/lib/device-token'
import { productToJsonLd } from '@/lib/schema-org'
import { ArrowLeft, Share2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { AugustPDP } from '@/components/august/AugustPDP'
import { AUGUST_BRAND, AUGUST_PRODUCTS, findProduct, relatedProducts } from '@/lib/august/catalog'
import { EmberPDP } from '@/components/ember/EmberPDP'
import { EMBER_BRAND, EMBER_PRODUCTS, findProduct as findEmberProduct, relatedProducts as relatedEmberProducts } from '@/lib/ember/catalog'
import { BloomPDP } from '@/components/bloom/BloomPDP'
import { BLOOM_BRAND, BLOOM_PRODUCTS, findProduct as findBloomProduct, relatedProducts as relatedBloomProducts } from '@/lib/bloom/catalog'
import { configToThemeBrand, productToThemeProduct } from '@/lib/flagship/adapters'

interface RazorpayCheckoutOptions {
  key: string
  amount: number
  currency: string
  name: string
  description?: string
  order_id: string
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void
  theme?: { color?: string }
  modal?: { ondismiss?: () => void }
}

function loadRazorpayCheckout(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) return resolve()
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load payment gateway'))
    document.body.appendChild(script)
  })
}

interface ProductInfo {
  id: string
  name: string
  price_inr: number
  original_price_inr: number | null
  garment_image_url: string
  sizes: string[]
  colors: string[]
  description: string | null
  category: string | null
  tags: string[]
  stock_by_variant?: Record<string, number> | null
}

interface StoreConfig {
  seller_id?: string
  brand_name: string
  tagline?: string | null
  theme_id?: string
  categories?: string[]
  primary_color: string
  whatsapp_number: string | null
  instagram_handle: string | null
  razorpay_available?: boolean
  currency?: string
}

type TryOnStep = 'idle' | 'upload' | 'generating' | 'done' | 'error'

export default function ProductDetailPage() {
  const { slug, productId } = useParams() as { slug: string; productId: string }

  // 'august' is the live demo of the "January" flagship theme — a wholly
  // bespoke PDP with its own hook tree. Rendered as a distinct component so
  // switching slugs client-side never changes the hook order of a single
  // mounted component.
  if (slug === 'august') {
    const product = findProduct(AUGUST_PRODUCTS, productId)
    if (!product) return notFound()
    return <AugustPDP brand={AUGUST_BRAND} product={product} related={relatedProducts(AUGUST_PRODUCTS, product)} />
  }
  if (slug === 'ember') {
    const product = findEmberProduct(EMBER_PRODUCTS, productId)
    if (!product) return notFound()
    return <EmberPDP brand={EMBER_BRAND} product={product} related={relatedEmberProducts(EMBER_PRODUCTS, product)} />
  }
  if (slug === 'bloom') {
    const product = findBloomProduct(BLOOM_PRODUCTS, productId)
    if (!product) return notFound()
    return <BloomPDP brand={BLOOM_BRAND} product={product} related={relatedBloomProducts(BLOOM_PRODUCTS, product)} />
  }

  return <GenericProductDetailPage slug={slug} productId={productId} />
}

function GenericProductDetailPage({ slug, productId }: { slug: string; productId: string }) {
  const [product, setProduct] = useState<ProductInfo | null>(null)
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [loading, setLoading] = useState(true)
  const [ordered, setOrdered] = useState(false)
  const [paying, setPaying] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)
  const [payError, setPayError] = useState('')
  const [tryOnStep, setTryOnStep] = useState<TryOnStep>('idle')
  const [tryOnJobId, setTryOnJobId] = useState<string | null>(null)
  const [tryOnResult, setTryOnResult] = useState<{ image_url?: string; video_url?: string } | null>(null)
  const [tryOnError, setTryOnError] = useState('')
  const [buyerPhotoPreview, setBuyerPhotoPreview] = useState<string | null>(null)
  const [buyerPhotoDataUrl, setBuyerPhotoDataUrl] = useState<string | null>(null)
  const tryOnPollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const selfieInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`/api/store/product?slug=${slug}&productId=${productId}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data.product)
        setConfig(data.config)
        if (data.product?.sizes?.[0]) setSelectedSize(data.product.sizes[0])
        if (data.product?.colors?.[0]) setSelectedColor(data.product.colors[0])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug, productId])

  function buildWhatsAppUrl() {
    if (!product || !config?.whatsapp_number) return null
    const phone = config.whatsapp_number.replace(/\D/g, '')
    const parts = [
      `Hi! I'd like to order *${product.name}* from ${config.brand_name}.`,
      selectedSize ? `📏 Size: ${selectedSize}` : null,
      selectedColor ? `🎨 Colour: ${selectedColor}` : null,
      `💰 Price: ${config?.currency === 'USD' ? '$' : '₹'}${product.price_inr.toLocaleString(config?.currency === 'USD' ? 'en-US' : 'en-IN')}`,
      `\nCan you confirm availability and share payment details?`,
    ].filter(Boolean).join('\n')
    return `https://wa.me/${phone}?text=${encodeURIComponent(parts)}`
  }

  async function handleOrder() {
    const url = buildWhatsAppUrl()
    if (!url) return
    setOrdered(true)
    window.open(url, '_blank')
  }

  // WhatsApp stays the default order path — this is an additional option
  // shown only once the seller has actually configured Razorpay keys.
  async function handlePayOnline() {
    if (!product || !config?.seller_id) return
    setPaying(true)
    setPayError('')
    try {
      const res = await fetch('/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seller_id: config.seller_id,
          product_id: product.id,
          quantity: 1,
          payment_method: 'razorpay',
          device_token: getOrCreateDeviceToken(),
          ...(selectedSize ? { size: selectedSize } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPayError(data.error ?? 'Could not start payment. Try WhatsApp instead.')
        setPaying(false)
        return
      }

      await loadRazorpayCheckout()
      const RazorpayCtor = (window as unknown as { Razorpay: new (opts: RazorpayCheckoutOptions) => { open: () => void } }).Razorpay
      const rzp = new RazorpayCtor({
        key: data.razorpay_key_id,
        amount: data.amount,
        currency: config.currency ?? 'INR',
        name: config.brand_name,
        description: product.name,
        order_id: data.razorpay_order_id,
        handler: () => setPaymentDone(true),
        theme: { color: primary },
        modal: { ondismiss: () => setPaying(false) },
      })
      rzp.open()
      setPaying(false)
    } catch {
      setPayError('Payment gateway unreachable. Try WhatsApp instead.')
      setPaying(false)
    }
  }

  function handleSelfieUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string
      setBuyerPhotoPreview(dataUrl)
      setBuyerPhotoDataUrl(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  async function startTryOn() {
    if (!buyerPhotoDataUrl || !product || !config?.seller_id) return
    setTryOnStep('generating')
    setTryOnResult(null)
    setTryOnError('')

    const res = await fetch('/api/store/try-on', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seller_id: config.seller_id,
        product_id: product.id,
        garment_image_url: product.garment_image_url,
        buyer_image_url: buyerPhotoDataUrl,
        output_type: 'both',
      }),
    })
    const data = await res.json()

    if (data.error || !data.job_id) {
      setTryOnStep('error')
      setTryOnError(data.error ?? 'Try-on failed')
      return
    }

    setTryOnJobId(data.job_id)
    tryOnPollRef.current = setInterval(async () => {
      const pollRes = await fetch(`/api/store/try-on?job_id=${data.job_id}`)
      const pollData = await pollRes.json()
      if (pollData.status === 'completed') {
        clearInterval(tryOnPollRef.current!)
        setTryOnResult({ image_url: pollData.image_url, video_url: pollData.video_url })
        setTryOnStep('done')
      } else if (pollData.status === 'failed') {
        clearInterval(tryOnPollRef.current!)
        setTryOnStep('error')
        setTryOnError(pollData.error ?? 'Generation failed')
      }
    }, 5000)
  }

  function closeTryOn() {
    clearInterval(tryOnPollRef.current!)
    setTryOnStep('idle')
    setTryOnJobId(null)
    setTryOnResult(null)
    setBuyerPhotoPreview(null)
    setBuyerPhotoDataUrl(null)
    setTryOnError('')
  }

  async function shareResult() {
    const url = tryOnResult?.video_url ?? tryOnResult?.image_url ?? window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: `Me in ${product?.name}`, url }); return } catch { /* fall through */ }
    }
    await navigator.clipboard.writeText(url)
  }

  async function handleShare() {
    const shareUrl = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: product?.name, url: shareUrl })
        return
      } catch { /* fall through */ }
    }
    await navigator.clipboard.writeText(shareUrl)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20" style={{ color: 'var(--store-ink)' }}>
        <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
      </div>
    )
  }

  if (!product || !config) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center" style={{ color: 'color-mix(in srgb, var(--store-ink) 45%, transparent)' }}>
        <div className="text-5xl mb-4">😕</div>
        <p>Product not found.</p>
        <Link href={`/store/${slug}`} className="mt-4 inline-block text-sm font-medium" style={{ color: 'var(--primary)' }}>
          ← Back to store
        </Link>
      </div>
    )
  }

  // Any real seller on the "January" flagship theme gets the bespoke PDP,
  // rendered with their own brand + product data.
  if (config.theme_id === 'january') {
    return (
      <AugustPDP
        brand={configToThemeBrand({ ...config, seller_id: config.seller_id ?? null }, slug)}
        product={productToThemeProduct({
          id: product.id,
          seller_id: config.seller_id ?? '',
          name: product.name,
          description: product.description,
          category: product.category,
          price_inr: product.price_inr,
          original_price_inr: product.original_price_inr,
          cost_price_inr: null,
          garment_image_url: product.garment_image_url,
          garment_preprocessed_url: null,
          slug: productId,
          is_active: true,
          sizes: product.sizes,
          colors: product.colors,
          tags: product.tags,
          created_at: '',
        })}
      />
    )
  }
  if (config.theme_id === 'february') {
    return (
      <EmberPDP
        brand={configToThemeBrand({ ...config, seller_id: config.seller_id ?? null }, slug)}
        product={productToThemeProduct({
          id: product.id,
          seller_id: config.seller_id ?? '',
          name: product.name,
          description: product.description,
          category: product.category,
          price_inr: product.price_inr,
          original_price_inr: product.original_price_inr,
          cost_price_inr: null,
          garment_image_url: product.garment_image_url,
          garment_preprocessed_url: null,
          slug: productId,
          is_active: true,
          sizes: product.sizes,
          colors: product.colors,
          tags: product.tags,
          created_at: '',
        })}
      />
    )
  }
  if (config.theme_id === 'march') {
    return (
      <BloomPDP
        brand={configToThemeBrand({ ...config, seller_id: config.seller_id ?? null }, slug)}
        product={productToThemeProduct({
          id: product.id,
          seller_id: config.seller_id ?? '',
          name: product.name,
          description: product.description,
          category: product.category,
          price_inr: product.price_inr,
          original_price_inr: product.original_price_inr,
          cost_price_inr: null,
          garment_image_url: product.garment_image_url,
          garment_preprocessed_url: null,
          slug: productId,
          is_active: true,
          sizes: product.sizes,
          colors: product.colors,
          tags: product.tags,
          created_at: '',
        })}
      />
    )
  }

  const primary = config.primary_color || '#F72585'
  const currencySymbol = config.currency === 'USD' ? '$' : '₹'
  const priceLocale = config.currency === 'USD' ? 'en-US' : 'en-IN'
  const discount = product.original_price_inr && product.original_price_inr > product.price_inr
    ? Math.round((1 - product.price_inr / product.original_price_inr) * 100)
    : null
  const whatsappUrl = buildWhatsAppUrl()
  const borderMuted = 'color-mix(in srgb, var(--store-ink) 12%, transparent)'
  const textMuted = 'color-mix(in srgb, var(--store-ink) 50%, transparent)'
  const textDim = 'color-mix(in srgb, var(--store-ink) 35%, transparent)'

  const jsonLd = productToJsonLd(
    {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      price_inr: product.price_inr,
      original_price_inr: product.original_price_inr,
      garment_image_url: product.garment_image_url,
      slug: productId,
    },
    {
      brandName: config.brand_name,
      currency: config.currency ?? 'USD',
      baseUrl: typeof window !== 'undefined' ? window.location.origin : '',
      storeSlug: slug,
    }
  )

  return (
    <div style={{ background: 'var(--store-bg)', color: 'var(--store-ink)' }}>
      {/* JSON-LD for AI agent discoverability (Rufus, Perplexity, Google AI Mode) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Desktop: 2-col grid. Mobile: stacked. */}
      <div className="max-w-screen-lg mx-auto md:grid md:grid-cols-2 md:gap-12 md:px-10 md:py-12 pb-32 md:pb-16">

        {/* Left / Top — product image */}
        <div className="relative" style={{ background: 'color-mix(in srgb, var(--store-bg) 80%, var(--store-ink))' }}>
          <img
            src={product.garment_image_url}
            alt={product.name}
            className="w-full aspect-square object-cover md:rounded-2xl"
          />
          <Link
            href={`/store/${slug}`}
            className="absolute top-4 left-4 w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center shadow-sm transition-opacity hover:opacity-80"
            style={{ background: 'color-mix(in srgb, var(--store-bg) 92%, transparent)', color: 'var(--store-ink)' }}
          >
            <ArrowLeft size={16} />
          </Link>
          <button
            onClick={handleShare}
            className="absolute top-4 right-4 w-9 h-9 rounded-full backdrop-blur-sm flex items-center justify-center shadow-sm transition-opacity hover:opacity-80"
            style={{ background: 'color-mix(in srgb, var(--store-bg) 92%, transparent)', color: 'var(--store-ink)' }}
          >
            <Share2 size={16} />
          </button>
          {discount && (
            <div
              style={{ backgroundColor: primary }}
              className="absolute bottom-4 left-4 text-white text-xs font-bold px-2.5 py-1 rounded-full"
            >
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Right / Bottom — product details, sticky on desktop */}
        <div className="px-4 pt-5 md:px-0 md:pt-0 md:sticky md:top-24 md:self-start">
          {product.category && (
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: textDim }}>{product.category}</p>
          )}
          <h1 className="text-xl font-bold leading-tight mb-2" style={{ color: 'var(--store-ink)' }}>{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span style={{ color: primary }} className="text-2xl font-bold">
              {currencySymbol}{product.price_inr.toLocaleString(priceLocale)}
            </span>
            {product.original_price_inr && (
              <span className="text-base line-through" style={{ color: textMuted }}>
                {currencySymbol}{product.original_price_inr.toLocaleString(priceLocale)}
              </span>
            )}
            {discount && (
              <span style={{ color: primary }} className="text-sm font-semibold">
                Save {currencySymbol}{(product.original_price_inr! - product.price_inr).toLocaleString(priceLocale)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-sm leading-relaxed mb-5" style={{ color: textMuted }}>{product.description}</p>
          )}

          {/* Size picker */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold" style={{ color: 'var(--store-ink)' }}>Size</p>
                <span className="text-xs" style={{ color: textDim }}>{selectedSize || 'Select a size'}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(size => {
                  const stock = product.stock_by_variant?.[size]
                  const isOos = stock === 0
                  const isLow = typeof stock === 'number' && stock > 0 && stock <= 3
                  return (
                    <div key={size} className="relative">
                      <button
                        onClick={() => !isOos && setSelectedSize(size)}
                        disabled={isOos}
                        className="px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all"
                        style={isOos
                          ? { borderColor: borderMuted, color: '#9ca3af', cursor: 'not-allowed', opacity: 0.5 }
                          : selectedSize === size
                          ? { backgroundColor: primary, borderColor: primary, color: 'white' }
                          : { borderColor: borderMuted, color: 'var(--store-ink)' }
                        }
                      >
                        {size}
                      </button>
                      {isLow && (
                        <span className="absolute -top-1.5 -right-1.5 text-xs bg-amber-500 text-white px-1 rounded-full leading-4">
                          {stock}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
              {product.stock_by_variant && selectedSize && (product.stock_by_variant[selectedSize] ?? Infinity) <= 3 && product.stock_by_variant[selectedSize] > 0 && (
                <p className="text-xs text-amber-600 mt-1.5">Only {product.stock_by_variant[selectedSize]} left in {selectedSize}!</p>
              )}
            </div>
          )}

          {/* Color picker */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold mb-2" style={{ color: 'var(--store-ink)' }}>Colour</p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className="px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all"
                    style={selectedColor === color
                      ? { borderColor: 'var(--store-ink)', color: 'var(--store-ink)' }
                      : { borderColor: borderMuted, color: textMuted }
                    }
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Try-On button */}
          {config.seller_id && (
            <button
              onClick={() => setTryOnStep('upload')}
              style={{ borderColor: primary, color: primary }}
              className="w-full border-2 rounded-2xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 mb-4 hover:opacity-80 transition-opacity"
            >
              <span className="text-lg">🪄</span>
              See yourself wearing this
            </button>
          )}

          {/* Shop with AI — links to Claude with this store's MCP pre-configured */}
          <a
            href={`https://claude.ai/new?mcp=${encodeURIComponent(`${typeof window !== 'undefined' ? window.location.origin : ''}/api/store/${slug}/mcp`)}&prompt=${encodeURIComponent(`I want to buy ${product.name} from this store`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border rounded-2xl py-3 font-medium text-sm flex items-center justify-center gap-2 mb-4 hover:opacity-80 transition-opacity"
            style={{ borderColor: 'color-mix(in srgb, var(--store-ink) 15%, transparent)', color: 'color-mix(in srgb, var(--store-ink) 60%, transparent)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
            Buy with Claude AI
          </a>

          {/* Delivery note */}
          <div className="rounded-xl px-4 py-3 mb-6 flex items-center gap-3" style={{ background: `color-mix(in srgb, var(--store-bg) 60%, color-mix(in srgb, var(--store-ink) 8%, transparent))` }}>
            <span className="text-xl">📦</span>
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--store-ink)' }}>Free shipping on orders over $75</p>
              <p className="text-xs" style={{ color: textMuted }}>Confirm delivery time via message</p>
            </div>
          </div>

          {/* Desktop inline order bar */}
          <div className="hidden md:block">
            {whatsappUrl ? (
              <div className="flex gap-2">
                <button
                  onClick={handleOrder}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 transition-colors"
                >
                  <span className="text-xl">💬</span>
                  {ordered ? 'Opening WhatsApp...' : `Order on WhatsApp · ${currencySymbol}${product.price_inr.toLocaleString(priceLocale)}`}
                </button>
                {config.razorpay_available && (
                  <button
                    onClick={handlePayOnline}
                    disabled={paying}
                    style={{ borderColor: primary, color: primary }}
                    className="px-4 rounded-2xl font-bold text-sm border-2 flex items-center justify-center gap-1.5 disabled:opacity-60 flex-shrink-0"
                  >
                    💳 {paying ? '…' : 'Pay Online'}
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center text-sm py-3" style={{ color: textDim }}>
                Contact seller via Instagram to order
              </div>
            )}
            {paymentDone && <p className="text-center text-xs text-green-600 font-semibold mt-2">Payment received! Seller will confirm your order shortly.</p>}
            {payError && <p className="text-center text-xs text-red-500 mt-2">{payError}</p>}
          </div>
        </div>
      </div>

      {/* AI Try-On Modal */}
      {tryOnStep !== 'idle' && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 480, padding: '24px 20px 40px', maxHeight: '90vh', overflowY: 'auto' }}>
            {/* Handle + close */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>
                {tryOnStep === 'done' ? '✨ Your try-on' : '🪄 Try it on'}
              </div>
              <button onClick={closeTryOn} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>

            {/* Upload step */}
            {tryOnStep === 'upload' && (
              <div>
                <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16, lineHeight: 1.5 }}>
                  Upload a full-length photo or selfie — AI will show you wearing this {product?.name}.
                  <span style={{ display: 'block', marginTop: 4, fontSize: 11, color: '#9CA3AF' }}>
                    🔒 Your photo is deleted immediately after generation. Never stored.
                  </span>
                </p>

                <div
                  onClick={() => selfieInputRef.current?.click()}
                  style={{
                    border: '2px dashed #E5E7EB', borderRadius: 16, padding: '28px 20px', textAlign: 'center', cursor: 'pointer',
                    background: buyerPhotoPreview ? '#F9FAFB' : 'transparent', marginBottom: 16,
                  }}
                >
                  {buyerPhotoPreview ? (
                    <img src={buyerPhotoPreview} alt="your photo" style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain', borderRadius: 12 }} />
                  ) : (
                    <div>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>🤳</div>
                      <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Tap to upload your photo</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>Full-body works best · Selfies also work</div>
                    </div>
                  )}
                </div>
                <input ref={selfieInputRef} type="file" accept="image/*" capture="user" onChange={handleSelfieUpload} style={{ display: 'none' }} />

                <button
                  onClick={startTryOn}
                  disabled={!buyerPhotoDataUrl}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer',
                    background: buyerPhotoDataUrl ? `linear-gradient(135deg, ${primary}, #7209B7)` : '#F3F4F6',
                    color: buyerPhotoDataUrl ? '#fff' : '#9CA3AF',
                  }}
                >
                  Generate Try-On ✨
                </button>
                <p style={{ fontSize: 10, color: '#9CA3AF', textAlign: 'center', marginTop: 8 }}>Takes about 45–90 seconds</p>
              </div>
            )}

            {/* Generating step */}
            {tryOnStep === 'generating' && (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', border: '4px solid #F3F4F6',
                  borderTopColor: primary, animation: 'spin 0.8s linear infinite', margin: '0 auto 20px',
                }} />
                <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Generating your look…</div>
                <div style={{ fontSize: 13, color: '#6B7280' }}>AI is placing the garment on you</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>Then creating a short video</div>
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

                {buyerPhotoPreview && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24, alignItems: 'center' }}>
                    <img src={buyerPhotoPreview} alt="you" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', opacity: 0.7 }} />
                    <span style={{ fontSize: 20 }}>+</span>
                    <img src={product?.garment_image_url} alt="garment" style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover', opacity: 0.7 }} />
                    <span style={{ fontSize: 20 }}>→</span>
                    <div style={{ width: 64, height: 64, borderRadius: 12, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🪄</div>
                  </div>
                )}
              </div>
            )}

            {/* Result step */}
            {tryOnStep === 'done' && tryOnResult && (
              <div>
                {tryOnResult.video_url ? (
                  <video
                    src={tryOnResult.video_url}
                    autoPlay
                    muted
                    loop
                    controls
                    style={{ width: '100%', borderRadius: 16, marginBottom: 16 }}
                  />
                ) : tryOnResult.image_url ? (
                  <img src={tryOnResult.image_url} alt="your try-on" style={{ width: '100%', borderRadius: 16, marginBottom: 16 }} />
                ) : null}

                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <button
                    onClick={shareResult}
                    style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#25D366', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}
                  >
                    💬 Share on WhatsApp
                  </button>
                  {tryOnResult.video_url && (
                    <a
                      href={tryOnResult.video_url}
                      download="my-tryon.mp4"
                      style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#F3F4F6', color: '#374151', fontWeight: 700, fontSize: 13, textDecoration: 'none', textAlign: 'center' }}
                    >
                      ⬇ Save Video
                    </a>
                  )}
                </div>

                <button
                  onClick={handleOrder}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer',
                    background: '#25D366', color: '#fff',
                  }}
                >
                  💬 Love it? Order on WhatsApp · {currencySymbol}{product?.price_inr.toLocaleString(priceLocale)}
                </button>
              </div>
            )}

            {/* Error step */}
            {tryOnStep === 'error' && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>😕</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Couldn&apos;t generate your look</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>{tryOnError || 'Please try again.'}</div>
                <button
                  onClick={() => { setTryOnStep('upload'); setTryOnError('') }}
                  style={{ padding: '10px 24px', borderRadius: 10, background: primary, color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sticky order bar — mobile only; desktop shows inline in details col */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 px-4 py-3 shadow-lg border-t"
        style={{ background: 'var(--store-bg)', borderColor: 'color-mix(in srgb, var(--store-ink) 10%, transparent)' }}>
        <div className="max-w-md mx-auto">
          {whatsappUrl ? (
            <div className="flex gap-2">
              <button
                onClick={handleOrder}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 transition-colors active:scale-98"
              >
                <span className="text-xl">💬</span>
                {ordered ? 'Opening WhatsApp...' : `Order on WhatsApp · ${currencySymbol}${product.price_inr.toLocaleString(priceLocale)}`}
              </button>
              {config.razorpay_available && (
                <button
                  onClick={handlePayOnline}
                  disabled={paying}
                  style={{ borderColor: primary, color: primary }}
                  className="px-4 rounded-2xl font-bold text-sm border-2 flex items-center justify-center gap-1.5 disabled:opacity-60 flex-shrink-0"
                >
                  💳 {paying ? '…' : 'Pay Online'}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center text-sm py-3" style={{ color: 'color-mix(in srgb, var(--store-ink) 45%, transparent)' }}>
              Contact seller via Instagram to order
            </div>
          )}
          {paymentDone && (
            <p className="text-center text-xs text-green-600 font-semibold mt-2">Payment received! The seller will confirm your order on WhatsApp shortly.</p>
          )}
          {payError && (
            <p className="text-center text-xs text-red-500 mt-2">{payError}</p>
          )}
        </div>
      </div>
    </div>
  )
}
