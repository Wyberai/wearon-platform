'use client'

import { useState, useRef } from 'react'

const PROMPTS = [
  'casual workwear for summer',
  'festive look for Diwali',
  'date night in the city',
  'comfortable travel outfit',
]

export default function AIStyleDemo() {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [typed, setTyped] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  async function handleSubmit(q?: string) {
    const input = q ?? query
    if (!input.trim()) return

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setLoading(true)
    setResponse('')
    if (q) setQuery(q)

    try {
      const res = await fetch('/api/style-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
        signal: abortRef.current.signal,
      })

      if (!res.ok || !res.body) throw new Error('Failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let result = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        result += text
        setResponse(result)
      }
    } catch {
      // Silently handle abort or errors
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
      {/* Terminal-style header */}
      <div className="flex items-center gap-2 px-5 py-3" style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-70" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-70" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-70" />
        <span className="ml-3 text-xs" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>Instastarz AI Stylist · GPT-4o</span>
      </div>

      <div className="p-6">
        {/* Prompt chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => handleSubmit(p)}
              className="text-xs px-3 py-1.5 rounded-full transition-all"
              style={{ background: 'rgba(247,37,133,0.12)', color: '#F472B6', border: '1px solid rgba(247,37,133,0.25)' }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-3 mb-5">
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setTyped(true) }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Describe your style or occasion..."
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
            }}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={loading || !query.trim()}
            className="px-5 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
            style={{ background: '#F72585', color: '#fff' }}
          >
            {loading ? '...' : '✦ Ask AI'}
          </button>
        </div>

        {/* Response */}
        <div className="min-h-[120px] text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {!response && !loading && !typed && (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
              Ask for outfit ideas, occasion styling, or size advice — the AI knows your store&apos;s catalog.
            </p>
          )}
          {loading && !response && (
            <div className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <span className="inline-block w-1.5 h-4 rounded-sm animate-pulse" style={{ background: '#F72585' }} />
              <span className="text-xs">AI is thinking...</span>
            </div>
          )}
          {response && (
            <div className="whitespace-pre-wrap">
              {response}
              {loading && <span className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse" style={{ background: '#F72585' }} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
