'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface Collection {
  id: string
  title: string
  description: string | null
  product_ids: string[]
  occasion_tags: string[]
  is_featured: boolean
  editorial_copy: { intro: string; product_captions: Record<string, string> } | null
  created_at: string
}

interface Product {
  id: string
  name: string
  price_inr: number
  garment_image_url: string | null
  category: string | null
}

const QUICK_PROMPTS = [
  'Summer Edit',
  'Wedding Guest',
  'Office Ready',
  'Date Night',
  'Beach Vacation',
  'Festival Season',
  'Winter Warmth',
  'Brunch Looks',
]

export default function AiBuyerPage() {
  const { slug } = useParams() as { slug: string }
  const [collections, setCollections] = useState<Collection[]>([])
  const [products, setProducts] = useState<Record<string, Product>>({})
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/collections?slug=${slug}`).then(r => r.json()),
      fetch(`/api/admin/products?slug=${slug}`).then(r => r.json()),
    ]).then(([colData, prodData]) => {
      setCollections(colData.collections ?? [])
      const map: Record<string, Product> = {}
      for (const p of (prodData.products ?? [])) map[p.id] = p
      setProducts(map)
      setLoading(false)
    })
  }, [slug])

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!prompt.trim()) return
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, prompt: prompt.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Generation failed')
      setCollections(prev => [data.collection, ...prev])
      setPrompt('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
    setGenerating(false)
  }

  async function toggleFeatured(id: string, current: boolean) {
    await fetch('/api/admin/collections', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_featured: !current }),
    })
    setCollections(prev => prev.map(c => c.id === id ? { ...c, is_featured: !current } : c))
  }

  async function deleteCollection(id: string) {
    await fetch(`/api/admin/collections?id=${id}`, { method: 'DELETE' })
    setCollections(prev => prev.filter(c => c.id !== id))
  }

  if (loading) return <div className="text-gray-400 text-sm">Loading...</div>

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Buyer</h1>
        <p className="text-gray-500 text-sm mt-1">Describe a collection and the AI curates products, writes editorial copy, and builds it instantly.</p>
      </div>

      {/* Generate form */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What do you want to curate?</label>
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="e.g. Summer beach vacation looks under ₹2,000"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map(q => (
              <button
                key={q}
                type="button"
                onClick={() => setPrompt(q)}
                className="px-3 py-1 text-xs rounded-full border border-gray-200 text-gray-600 hover:border-pink-400 hover:text-pink-600 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={generating || !prompt.trim()}
            className="bg-pink-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-pink-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {generating ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Curating…
              </>
            ) : '✦ Generate Collection'}
          </button>
        </form>
      </div>

      {/* Collections list */}
      {collections.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">✦</p>
          <p className="text-sm">No collections yet — generate your first one above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {collections.map(col => {
            const colProducts = col.product_ids.map(id => products[id]).filter(Boolean)
            return (
              <div key={col.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{col.title}</h3>
                      {col.is_featured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">Featured</span>
                      )}
                    </div>
                    {col.description && <p className="text-sm text-gray-500 mt-0.5">{col.description}</p>}
                    {col.editorial_copy?.intro && (
                      <p className="text-xs text-gray-400 italic mt-1 max-w-lg">&ldquo;{col.editorial_copy.intro}&rdquo;</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleFeatured(col.id, col.is_featured)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${col.is_featured ? 'border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                    >
                      {col.is_featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      onClick={() => deleteCollection(col.id)}
                      className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Product thumbnails */}
                {colProducts.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {colProducts.map(p => (
                      <div key={p.id} className="shrink-0 w-20">
                        {p.garment_image_url ? (
                          <img src={p.garment_image_url} alt={p.name} className="w-20 h-24 object-cover rounded-lg bg-gray-50" />
                        ) : (
                          <div className="w-20 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-300 text-xl">👗</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1 truncate">{p.name}</p>
                        {col.editorial_copy?.product_captions?.[p.id] && (
                          <p className="text-xs text-gray-400 italic mt-0.5 line-clamp-2">{col.editorial_copy.product_captions[p.id]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                  <span className="text-xs text-gray-400">{col.product_ids.length} products</span>
                  {col.occasion_tags.length > 0 && (
                    <div className="flex gap-1">
                      {col.occasion_tags.map(t => (
                        <span key={t} className="px-2 py-0.5 bg-gray-50 rounded-full text-xs text-gray-500">{t}</span>
                      ))}
                    </div>
                  )}
                  <span className="text-xs text-gray-300 ml-auto">{new Date(col.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
