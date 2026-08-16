'use client'

import { useEffect, useMemo, useState } from 'react'

interface Prospect {
  id: string
  instagram_username: string
  full_name: string | null
  phone: string | null
  email: string | null
  bio: string | null
  detected_language: string | null
  detected_city: string | null
  detected_state: string | null
  source_hashtag: string | null
  source_post_url: string | null
  status: string
  notes: string | null
  last_contacted_at: string | null
  created_at: string
}

interface Stats {
  total: number
  with_contact: number
  by_language: Record<string, number>
  by_status: Record<string, number>
}

const STATUSES = ['new', 'queued', 'sent', 'replied', 'converted', 'opted_out', 'invalid']
const STATUS_COLORS: Record<string, string> = {
  new: '#6B7280',
  queued: '#F59E0B',
  sent: '#3B82F6',
  replied: '#8B5CF6',
  converted: '#4ADE80',
  opted_out: '#EF4444',
  invalid: 'rgba(255,255,255,0.25)',
}
const LANGUAGE_LABELS: Record<string, string> = {
  hi: 'Hindi', ta: 'Tamil', kn: 'Kannada', te: 'Telugu', ml: 'Malayalam',
  bn: 'Bengali', gu: 'Gujarati', pa: 'Punjabi', or: 'Odia', en: 'English/unmarked',
}

function daysAgo(iso: string | null) {
  if (!iso) return '—'
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
  if (d === 0) return 'today'
  if (d === 1) return '1d ago'
  return `${d}d ago`
}

export default function OutboundCrmPage() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [languageFilter, setLanguageFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [exportCounts, setExportCounts] = useState<Record<string, number>>({})

  function load() {
    setLoading(true)
    fetch('/api/platform/outbound')
      .then(r => r.json())
      .then(d => { setProspects(d.prospects ?? []); setStats(d.stats ?? null); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])
  useEffect(() => {
    fetch('/api/platform/outbound/export').then(r => r.json()).then(d => setExportCounts(d.by_language ?? {})).catch(() => {})
  }, [])

  async function updateStatus(id: string, status: string) {
    setUpdating(id)
    await fetch(`/api/platform/outbound/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setProspects(prev => prev.map(p => p.id === id ? { ...p, status } : p))
    setUpdating(null)
  }

  const filtered = useMemo(() => prospects.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.instagram_username.toLowerCase().includes(q) || (p.full_name ?? '').toLowerCase().includes(q)
    const matchLanguage = languageFilter === 'all' || (p.detected_language ?? 'en') === languageFilter
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchLanguage && matchStatus
  }), [prospects, search, languageFilter, statusFilter])

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.3px', margin: 0 }}>Outbound CRM</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
          Scraped Instagram sellers — WhatsApp outreach tracking + per-language Meta audience export.
        </p>
      </div>

      {/* Stats row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total prospects', value: stats.total, color: '#fff' },
            { label: 'With phone/email', value: stats.with_contact, color: '#4ADE80' },
            { label: 'Sent', value: stats.by_status.sent ?? 0, color: '#3B82F6' },
            { label: 'Opted out', value: stats.by_status.opted_out ?? 0, color: '#EF4444' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ padding: '16px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 5 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Language breakdown + export */}
      {stats && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
            By language — export ready for Meta Custom Audience
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(stats.by_language).filter(([, c]) => c > 0).map(([lang, count]) => (
              <div key={lang} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{LANGUAGE_LABELS[lang] ?? lang}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{count}</span>
                {exportCounts[lang] > 0 && (
                  <a
                    href={`/api/platform/outbound/export?language=${lang}`}
                    style={{ fontSize: 11, color: '#F72585', textDecoration: 'none', fontWeight: 700 }}
                  >
                    ↓ CSV ({exportCounts[lang]})
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search username or name…"
          style={{ flex: 1, maxWidth: 300, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13, outline: 'none' }}
        />
        <select
          value={languageFilter}
          onChange={e => setLanguageFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13, cursor: 'pointer' }}
        >
          <option value="all">All languages</option>
          {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13, cursor: 'pointer' }}
        >
          <option value="all">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginLeft: 'auto' }}>{filtered.length} prospect{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 130px 90px', gap: 0, padding: '10px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['Username / Name', 'Contact', 'Language', 'State / City', 'Status', 'Last contact'].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {loading && <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading…</div>}

        {!loading && filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            {prospects.length === 0 ? 'No prospects imported yet — run scripts/import-outbound-prospects.mjs.' : 'No prospects match this filter.'}
          </div>
        )}

        {filtered.map((p, i) => (
          <div
            key={p.id}
            style={{
              display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 130px 90px', gap: 0, padding: '14px 20px',
              borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              opacity: p.status === 'opted_out' || p.status === 'invalid' ? 0.5 : 1,
            }}
          >
            <div>
              <a href={`https://instagram.com/${p.instagram_username}`} target="_blank" style={{ fontSize: 13, fontWeight: 600, color: '#fff', textDecoration: 'none' }}>
                @{p.instagram_username}
              </a>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{p.full_name || p.source_hashtag || '—'}</div>
            </div>
            <div style={{ fontSize: 12, color: p.phone || p.email ? '#4ADE80' : 'rgba(255,255,255,0.25)' }}>
              {p.phone || p.email || 'no contact found'}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{LANGUAGE_LABELS[p.detected_language ?? 'en'] ?? p.detected_language}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{p.detected_state || p.detected_city || '—'}</div>
            <div>
              <select
                value={p.status}
                onChange={e => updateStatus(p.id, e.target.value)}
                disabled={updating === p.id}
                style={{
                  padding: '4px 8px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  background: `${STATUS_COLORS[p.status] ?? '#6B7280'}22`,
                  color: STATUS_COLORS[p.status] ?? '#6B7280',
                  border: `1px solid ${STATUS_COLORS[p.status] ?? '#6B7280'}44`,
                  outline: 'none',
                }}
              >
                {STATUSES.map(s => <option key={s} value={s} style={{ background: '#1a1a1d', color: '#fff' }}>{s}</option>)}
              </select>
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{daysAgo(p.last_contacted_at)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
