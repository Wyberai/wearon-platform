'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

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
}

interface StoreConfig {
  seller_id?: string
  brand_name: string
  primary_color: string
  whatsapp_number: string | null
  instagram_handle: string | null
}

export default function ProductDetailPage() {
  const { slug, productId } = useParams() as { slug: string; productId: string }
  const [product, setProduct] = useState<ProductInfo | null>(null)
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [loading, setLoading] = useState(true)
  const [ordered, setOrdered] = useState(false)

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
      `💰 Price: ₹${product.price_inr.toLocaleString('en-IN')}`,
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
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product || !config) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center text-gray-400">
        <div className="text-5xl mb-4">😕</div>
        <p>Product not found.</p>
        <Link href={`/store/${slug}`} className="mt-4 inline-block text-sm text-pink-600 font-medium">
          ← Back to store
        </Link>
      </div>
    )
  }

  const primary = config.primary_color || '#F72585'
  const discount = product.original_price_inr && product.original_price_inr > product.price_inr
    ? Math.round((1 - product.price_inr / product.original_price_inr) * 100)
    : null
  const whatsappUrl = buildWhatsAppUrl()

  return (
    <div className="max-w-md mx-auto pb-32">
      {/* Product image */}
      <div className="relative bg-gray-50">
        <img
          src={product.garment_image_url}
          alt={product.name}
          className="w-full aspect-square object-cover"
        />
        {/* Back button */}
        <Link
          href={`/store/${slug}`}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-gray-700 hover:bg-white transition-colors"
        >
          ←
        </Link>
        {/* Share */}
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-gray-700 hover:bg-white transition-colors"
        >
          ↑
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

      {/* Product details */}
      <div className="px-4 pt-5">
        {product.category && (
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{product.category}</p>
        )}
        <h1 className="text-xl font-bold text-gray-900 leading-tight mb-2">{product.name}</h1>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-4">
          <span style={{ color: primary }} className="text-2xl font-bold">
            ₹{product.price_inr.toLocaleString('en-IN')}
          </span>
          {product.original_price_inr && (
            <span className="text-gray-400 text-base line-through">
              ₹{product.original_price_inr.toLocaleString('en-IN')}
            </span>
          )}
          {discount && (
            <span style={{ color: primary }} className="text-sm font-semibold">
              Save ₹{(product.original_price_inr! - product.price_inr).toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-500 leading-relaxed mb-5">{product.description}</p>
        )}

        {/* Size picker */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-gray-800">Size</p>
              <span className="text-xs text-gray-400">{selectedSize || 'Select a size'}</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={selectedSize === size ? { backgroundColor: primary, borderColor: primary, color: 'white' } : {}}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                    selectedSize === size ? '' : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color picker */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-800 mb-2">Colour</p>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                    selectedColor === color ? 'border-gray-800 text-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Delivery note */}
        <div className="bg-gray-50 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
          <span className="text-xl">📦</span>
          <div>
            <p className="text-xs font-semibold text-gray-700">Ships pan-India</p>
            <p className="text-xs text-gray-400">Confirm delivery time on WhatsApp</p>
          </div>
        </div>
      </div>

      {/* Sticky order bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 shadow-lg">
        <div className="max-w-md mx-auto">
          {whatsappUrl ? (
            <button
              onClick={handleOrder}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 transition-colors active:scale-98"
            >
              <span className="text-xl">💬</span>
              {ordered ? 'Opening WhatsApp...' : `Order on WhatsApp · ₹${product.price_inr.toLocaleString('en-IN')}`}
            </button>
          ) : (
            <div className="text-center text-sm text-gray-400 py-3">
              Contact seller via Instagram to order
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
