'use client'

import { useState, useEffect } from 'react'

interface ChangeRequest {
  id: string
  request_type: string
  description: string
  status: string
  billable: boolean
  charge_amount_inr: number | null
  payment_status: string | null
  created_at: string
}

interface QuotaStatus {
  plan: string
  limit: number
  used_this_month: number
  remaining_free: number
  overage_price_inr: number
  requests: ChangeRequest[]
}

const TYPE_LABELS: Record<string, string> = {
  design: 'Design change',
  product: 'Product/catalog change',
  mobile_app: 'Mobile app change',
}

export function ChangeRequestCard() {
  const [status, setStatus] = useState<QuotaStatus | null>(null)
  const [requestType, setRequestType] = useState('design')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [lastResult, setLastResult] = useState<{ billable: boolean } | null>(null)

  function load() {
    fetch('/api/admin/change-requests').then(r => r.json()).then(setStatus)
  }

  useEffect(load, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) return
    setSubmitting(true)
    setLastResult(null)
    const res = await fetch('/api/admin/change-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request_type: requestType, description }),
    })
    const data = await res.json()
    setSubmitting(false)
    if (res.ok) {
      setLastResult({ billable: data.billable })
      setDescription('')
      load()
    }
  }

  if (!status) return null

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Request a Change</h2>
        <span className="text-xs text-gray-500">
          {status.remaining_free} of {status.limit} free change{status.limit !== 1 ? 's' : ''} left this month
        </span>
      </div>
      <p className="text-sm text-gray-500">
        For design tweaks, new features, or mobile app changes you'd like our team to build for you —
        not self-serve edits (use Products/Customize for those). Requests past your free monthly limit
        are billed at ₹{status.overage_price_inr} each.
      </p>

      <form onSubmit={submit} className="space-y-3">
        <select
          value={requestType}
          onChange={e => setRequestType(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="design">Design change</option>
          <option value="product">Product/catalog change</option>
          <option value="mobile_app">Mobile app change</option>
        </select>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          placeholder="Describe what you'd like changed..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
        />
        <button
          type="submit"
          disabled={submitting || !description.trim()}
          className="bg-pink-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit request'}
        </button>
        {lastResult && (
          <p className={`text-xs ${lastResult.billable ? 'text-amber-600' : 'text-emerald-600'}`}>
            {lastResult.billable
              ? `Submitted — this is past your free monthly limit, so it'll be billed at ₹${status.overage_price_inr}. We'll confirm before starting.`
              : 'Submitted — this one counted against your free monthly changes.'}
          </p>
        )}
      </form>

      {status.requests.length > 0 && (
        <div className="border-t border-gray-100 pt-3 space-y-2">
          {status.requests.slice(0, 5).map(r => (
            <div key={r.id} className="flex items-center justify-between text-xs">
              <span className="text-gray-600 truncate flex-1">{TYPE_LABELS[r.request_type] ?? r.request_type}: {r.description}</span>
              <span className={`ml-3 px-2 py-0.5 rounded-full flex-shrink-0 ${
                r.status === 'completed' ? 'bg-green-50 text-green-700'
                : r.status === 'in_progress' ? 'bg-blue-50 text-blue-700'
                : r.status === 'rejected' ? 'bg-red-50 text-red-600'
                : 'bg-gray-100 text-gray-600'
              }`}>{r.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
