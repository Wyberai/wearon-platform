'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface Product {
  id: string
  name: string
  description: string | null
  garment_image_url: string | null
  category: string | null
  aeo_content: { agent_answer: string; faqs: { q: string; a: string }[]; generated_at: string } | null
}

interface StoreConfig {
  brand_name: string
  slug: string
}

interface AgentQueryRow {
  source: string
  tool: string
  created_at: string
  result_count: number
}

interface AgentOrder {
  id: string
  source: string
  total_inr: number
  created_at: string
}

function ScoreRing({ score }: { score: number }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = score >= 70 ? '#16a34a' : score >= 40 ? '#d97706' : '#dc2626'
  return (
    <svg width="112" height="112" viewBox="0 0 112 112">
      <circle cx="56" cy="56" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
      <circle
        cx="56" cy="56" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 56 56)"
      />
      <text x="56" y="54" textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="700" fill={color}>{score}</text>
      <text x="56" y="70" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#9ca3af">/100</text>
    </svg>
  )
}

export default function AiVisibilityPage() {
  const { slug } = useParams() as { slug: string }
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [agentQueries, setAgentQueries] = useState<AgentQueryRow[]>([])
  const [agentOrders, setAgentOrders] = useState<AgentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [optimizing, setOptimizing] = useState(false)
  const [tab, setTab] = useState<'score' | 'traffic'>('score')

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/config?slug=${slug}`).then(r => r.json()),
      fetch(`/api/admin/products?slug=${slug}`).then(r => r.json()),
      fetch(`/api/admin/agent-traffic`).then(r => r.json()),
    ]).then(([cfgData, prodData, trafficData]) => {
      setConfig(cfgData.config)
      setProducts(prodData.products ?? [])
      setAgentQueries(trafficData.queries ?? [])
      setAgentOrders(trafficData.orders ?? [])
      setLoading(false)
    })
  }, [slug])

  const productsWithDesc = products.filter(p => p.description && p.description.length > 20)
  const productsWithImage = products.filter(p => p.garment_image_url)
  const productsWithAeo = products.filter(p => p.aeo_content)
  const total = products.length || 1

  const scoreBreakdown = [
    { label: 'MCP Server active', points: 20, earned: 20, help: `claude.ai MCP endpoint live at /api/store/${slug}/mcp` },
    { label: 'OpenAPI spec published', points: 15, earned: 15, help: `ChatGPT Actions schema at /api/store/${slug}/openapi.json` },
    { label: 'Product feed published', points: 15, earned: 15, help: `Google Merchant Center feed at /api/store/${slug}/feed.json` },
    { label: 'Product descriptions', points: 20, earned: Math.round((productsWithDesc.length / total) * 20), help: `${productsWithDesc.length}/${products.length} products have descriptions` },
    { label: 'Product images', points: 15, earned: Math.round((productsWithImage.length / total) * 15), help: `${productsWithImage.length}/${products.length} products have images` },
    { label: 'AEO content generated', points: 15, earned: Math.round((productsWithAeo.length / total) * 15), help: `${productsWithAeo.length}/${products.length} products have agent-optimized content` },
  ]

  const score = scoreBreakdown.reduce((s, r) => s + r.earned, 0)
  const missingDesc = products.filter(p => !p.description || p.description.length <= 20)
  const missingAeo = products.filter(p => !p.aeo_content)

  async function optimizeAll() {
    setOptimizing(true)
    await fetch('/api/admin/aeo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })
    const prodData = await fetch(`/api/admin/products?slug=${slug}`).then(r => r.json())
    setProducts(prodData.products ?? [])
    setOptimizing(false)
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const mcpUrl = `${baseUrl}/api/store/${slug}/mcp`
  const openApiUrl = `${baseUrl}/api/store/${slug}/openapi.json`
  const feedUrl = `${baseUrl}/api/store/${slug}/feed.json`

  if (loading) return <div className="text-gray-400 text-sm">Loading…</div>

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Visibility</h1>
        <p className="text-gray-500 text-sm mt-1">How discoverable is your store to AI agents — Claude, ChatGPT, Perplexity, Google AI Mode, and Rufus?</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {(['score', 'traffic'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t === 'score' ? 'Discoverability' : 'Agent Traffic'}
          </button>
        ))}
      </div>

      {tab === 'score' && (
        <div className="space-y-5">
          {/* Score card */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 flex items-center gap-8">
            <ScoreRing score={score} />
            <div>
              <p className="text-lg font-bold text-gray-900">
                {score >= 70 ? 'Strong AI visibility' : score >= 40 ? 'Moderate AI visibility' : 'Low AI visibility'}
              </p>
              <p className="text-sm text-gray-500 mt-1 max-w-sm">
                {score >= 70
                  ? 'AI agents can discover, describe, and sell your products. You\'re ahead of most Shopify stores.'
                  : score >= 40
                  ? 'Agents can find your store but may miss some products. Generate AEO content to improve.'
                  : 'Agents struggle to find and describe your products. Fix the items below.'}
              </p>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Score breakdown</h2>
            <div className="space-y-3">
              {scoreBreakdown.map(row => (
                <div key={row.label} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${row.earned === row.points ? 'bg-green-100' : row.earned > 0 ? 'bg-amber-100' : 'bg-red-50'}`}>
                    {row.earned === row.points
                      ? <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      : row.earned > 0
                      ? <svg className="w-3 h-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v4m0 4h.01" /></svg>
                      : <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    }
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-gray-700">{row.label}</span>
                    <span className="text-xs text-gray-400 ml-2">{row.help}</span>
                  </div>
                  <span className="text-sm font-semibold tabular-nums" style={{ color: row.earned === row.points ? '#16a34a' : row.earned > 0 ? '#d97706' : '#dc2626' }}>
                    {row.earned}/{row.points}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Endpoints */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-1">Your AI shopping endpoints</h2>
            <p className="text-xs text-gray-500 mb-4">These URLs let Claude, ChatGPT, and other AI agents shop your store. Share them or point a Custom GPT at the OpenAPI URL.</p>
            {[
              { label: 'Claude MCP', url: mcpUrl, badge: 'Claude' },
              { label: 'ChatGPT OpenAPI', url: openApiUrl, badge: 'ChatGPT' },
              { label: 'Product Feed', url: feedUrl, badge: 'Google / Rufus' },
            ].map(({ label, url, badge }) => (
              <div key={label} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400 font-mono truncate max-w-xs">{url}</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-purple-50 border border-purple-100 rounded text-xs text-purple-600">{badge}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(url)}
                    className="text-xs px-3 py-1 border border-gray-200 rounded-lg text-gray-600 hover:border-gray-400 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* AEO optimize */}
          {missingAeo.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-amber-800">{missingAeo.length} products missing agent-optimized content</p>
                <p className="text-xs text-amber-600 mt-0.5">AI agents will give vague answers about these products. Generate AEO content to fix this.</p>
              </div>
              <button
                onClick={optimizeAll}
                disabled={optimizing}
                className="shrink-0 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {optimizing ? 'Optimizing…' : 'Optimize All'}
              </button>
            </div>
          )}

          {missingAeo.length === 0 && products.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 font-medium">
              ✓ All {products.length} products have AEO content — AI agents can answer questions about your full catalog.
            </div>
          )}

          {/* Products missing descriptions */}
          {missingDesc.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-1">Products without descriptions</h2>
              <p className="text-xs text-gray-500 mb-3">AI agents can't describe these products accurately.</p>
              <div className="space-y-2">
                {missingDesc.slice(0, 5).map(p => (
                  <div key={p.id} className="flex items-center justify-between py-1">
                    <span className="text-sm text-gray-700">{p.name}</span>
                    <a href={`/admin/${slug}/products`} className="text-xs text-pink-600 hover:underline">Add description →</a>
                  </div>
                ))}
                {missingDesc.length > 5 && <p className="text-xs text-gray-400">+{missingDesc.length - 5} more</p>}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'traffic' && (
        <div className="space-y-5">
          {agentOrders.length === 0 && agentQueries.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
              <p className="text-3xl mb-3">🤖</p>
              <p className="font-semibold text-gray-700">No agent traffic yet</p>
              <p className="text-sm text-gray-400 mt-1">Once AI agents start browsing your store via MCP or OpenAPI, their queries and purchases will appear here.</p>
              <p className="text-xs text-gray-400 mt-3">Share your Claude MCP link or ChatGPT OpenAPI URL to get started.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Agent queries', value: agentQueries.length },
                  { label: 'Agent orders', value: agentOrders.length },
                  { label: 'Agent revenue', value: `₹${agentOrders.reduce((s, o) => s + o.total_inr, 0).toLocaleString('en-IN')}` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white rounded-xl border border-gray-100 p-4">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
