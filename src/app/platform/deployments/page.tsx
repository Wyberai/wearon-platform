'use client'

import { useEffect, useState } from 'react'

interface Deployment {
  id: string
  seller_name: string
  seller_email: string
  domain: string | null
  supabase_project_ref: string | null
  supabase_project_url: string | null
  vercel_project_id: string | null
  vercel_project_url: string | null
  plan: string
  status: string
  provisioned_at: string
  notes: string | null
}

const STATUS_COLOR: Record<string, string> = {
  active: '#4ADE80',
  provisioning: '#F59E0B',
  suspended: '#EF4444',
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newDep, setNewDep] = useState({ seller_name: '', seller_email: '', domain: '', vercel_project_url: '', supabase_project_url: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/platform/deployments')
      .then(r => r.json())
      .then(d => { setDeployments(d.deployments ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function addDeployment() {
    setSaving(true)
    const res = await fetch('/api/platform/deployments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDep),
    })
    const data = await res.json()
    if (data.deployment) {
      setDeployments(prev => [data.deployment, ...prev])
      setShowAdd(false)
      setNewDep({ seller_name: '', seller_email: '', domain: '', vercel_project_url: '', supabase_project_url: '' })
    }
    setSaving(false)
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/platform/deployments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setDeployments(prev => prev.map(d => d.id === id ? { ...d, status } : d))
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>Deployed Stores</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '4px 0 0' }}>
            Each seller owns their own Supabase + Vercel + domain
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          style={{ padding: '9px 18px', borderRadius: 10, background: '#F72585', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}
        >
          + Register store
        </button>
      </div>

      {/* Quick-add form */}
      {showAdd && (
        <div style={{ padding: '20px 24px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { key: 'seller_name', label: 'Seller name', placeholder: "Priya's Boutique" },
            { key: 'seller_email', label: 'Seller email', placeholder: 'priya@gmail.com' },
            { key: 'domain', label: 'Domain', placeholder: 'priyasboutique.com' },
            { key: 'vercel_project_url', label: 'Vercel URL', placeholder: 'https://wearon-xxx.vercel.app' },
            { key: 'supabase_project_url', label: 'Supabase URL', placeholder: 'https://abc.supabase.co' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 5 }}>{label}</label>
              <input
                value={newDep[key as keyof typeof newDep]}
                onChange={e => setNewDep(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 9, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <button onClick={addDeployment} disabled={saving || !newDep.seller_email} style={{ padding: '9px 18px', borderRadius: 9, background: '#4ADE80', color: '#000', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setShowAdd(false)} style={{ padding: '9px 14px', borderRadius: 9, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', fontSize: 13, border: 'none', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* How to provision */}
      <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(247,37,133,0.06)', border: '1px solid rgba(247,37,133,0.15)', marginBottom: 24, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
        <span style={{ color: '#F472B6', fontWeight: 700 }}>How to provision a new seller:</span>
        {' '}Run{' '}
        <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: 6, color: '#F9A8D4', fontFamily: 'monospace' }}>
          node scripts/provision-seller.mjs --name &quot;Seller Name&quot; --email seller@email.com --slug theirslug
        </code>
        {' '}— creates Supabase + Vercel + sets env vars + registers here automatically.
      </div>

      {/* Deployments table */}
      <div style={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 90px 100px', gap: 0, padding: '10px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['Seller', 'Domain / URL', 'Supabase', 'Plan', 'Status', 'Actions'].map(h => (
            <div key={h} style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>

        {loading && <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading…</div>}
        {!loading && deployments.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            No stores provisioned yet. Run the CLI to set up your first seller.
          </div>
        )}

        {deployments.map((dep, i) => (
          <div key={dep.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.5fr 1fr 90px 100px', gap: 0, padding: '14px 20px', borderBottom: i < deployments.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            {/* Seller */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{dep.seller_name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{dep.seller_email}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 1 }}>Provisioned {fmtDate(dep.provisioned_at)}</div>
            </div>

            {/* Domain */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
              {dep.domain ? (
                <a href={`https://${dep.domain}`} target="_blank" style={{ fontSize: 12, color: '#F472B6', textDecoration: 'none' }}>{dep.domain} ↗</a>
              ) : (
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>No custom domain</span>
              )}
              {dep.vercel_project_url && (
                <a href={dep.vercel_project_url} target="_blank" style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
                  {dep.vercel_project_url.replace('https://', '')} ↗
                </a>
              )}
            </div>

            {/* Supabase */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {dep.supabase_project_url ? (
                <a
                  href={`https://supabase.com/dashboard/project/${dep.supabase_project_ref}`}
                  target="_blank"
                  style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}
                >
                  {dep.supabase_project_ref ?? dep.supabase_project_url.split('//')[1]?.split('.')[0]} ↗
                </a>
              ) : (
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>—</span>
              )}
            </div>

            {/* Plan */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: dep.plan === 'free' ? '#6B7280' : '#F72585', textTransform: 'capitalize' }}>{dep.plan}</span>
            </div>

            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_COLOR[dep.status] ?? '#6B7280', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>{dep.status}</span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {dep.vercel_project_url && (
                <a href={`${dep.vercel_project_url}/admin`} target="_blank"
                  style={{ fontSize: 10, fontWeight: 600, color: '#F472B6', textDecoration: 'none', padding: '4px 8px', borderRadius: 7, border: '1px solid rgba(247,37,133,0.25)', background: 'rgba(247,37,133,0.08)' }}>
                  Admin ↗
                </a>
              )}
              {dep.status === 'active' ? (
                <button onClick={() => updateStatus(dep.id, 'suspended')}
                  style={{ fontSize: 10, fontWeight: 600, cursor: 'pointer', padding: '4px 8px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
                  Suspend
                </button>
              ) : dep.status === 'suspended' ? (
                <button onClick={() => updateStatus(dep.id, 'active')}
                  style={{ fontSize: 10, fontWeight: 600, cursor: 'pointer', padding: '4px 8px', borderRadius: 7, border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.08)', color: '#4ADE80' }}>
                  Restore
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
