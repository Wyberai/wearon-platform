'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { PRESET_MODELS, CREDIT_COSTS } from '@/lib/ai-presets'

type GarmentType = 'saree' | 'lehenga' | 'kurti' | 'anarkali' | 'dress' | 'top' | 'other'

const GARMENT_TYPES: { value: GarmentType; label: string }[] = [
  { value: 'saree',    label: 'Saree' },
  { value: 'lehenga',  label: 'Lehenga' },
  { value: 'kurti',    label: 'Kurti / Salwar' },
  { value: 'anarkali', label: 'Anarkali' },
  { value: 'dress',    label: 'Western Dress' },
  { value: 'top',      label: 'Top / Blouse' },
  { value: 'other',    label: 'Other' },
]

type OutputType = 'image' | 'video' | 'both'

interface Product {
  id: string
  name: string
  image_url: string | null
}

interface JobResult {
  status: string
  image_url?: string
  video_url?: string
  error?: string
}

export default function AIStudioPage() {
  const { slug } = useParams() as { slug: string }

  const [credits, setCredits] = useState<number | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [garmentUrl, setGarmentUrl] = useState('')
  const [garmentPreview, setGarmentPreview] = useState<string | null>(null)
  const [selectedPreset, setSelectedPreset] = useState(PRESET_MODELS[0].key)
  const [garmentType, setGarmentType] = useState<GarmentType>('other')
  const [outputType, setOutputType] = useState<OutputType>('both')
  const [generating, setGenerating] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [result, setResult] = useState<JobResult | null>(null)
  const [pollCount, setPollCount] = useState(0)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const creditCost = outputType === 'image' ? CREDIT_COSTS.modelShotImage
    : outputType === 'video' ? CREDIT_COSTS.modelShotImage + CREDIT_COSTS.modelShotVideo
    : CREDIT_COSTS.modelShotImage + CREDIT_COSTS.modelShotVideo

  useEffect(() => {
    // Load credits + products
    Promise.all([
      fetch('/api/admin/ai-credits').then(r => r.json()),
      fetch('/api/admin/products').then(r => r.json()),
    ]).then(([creditsData, productsData]) => {
      setCredits(creditsData.ai_credits ?? 0)
      setProducts(productsData.products ?? [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedProduct) {
      setGarmentUrl(selectedProduct.image_url ?? '')
      setGarmentPreview(selectedProduct.image_url)
    }
  }, [selectedProduct])

  useEffect(() => {
    if (!jobId) return
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/admin/ai-model-shot?job_id=${jobId}`)
      const data = await res.json()
      setPollCount(c => c + 1)
      if (data.status === 'completed' || data.status === 'failed') {
        clearInterval(pollRef.current!)
        setResult(data)
        setGenerating(false)
        if (data.status === 'completed') {
          setCredits(prev => prev !== null ? prev - creditCost : null)
        }
      }
    }, 4000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [jobId, creditCost])

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string
      setGarmentPreview(dataUrl)
      // For now use the data URL directly — in production you'd upload to Supabase storage first
      setGarmentUrl(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  async function generate() {
    if (!garmentUrl || !selectedPreset || generating) return
    setGenerating(true)
    setResult(null)
    setPollCount(0)

    const res = await fetch('/api/admin/ai-model-shot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: selectedProduct?.id ?? null,
        garment_image_url: garmentUrl,
        preset_model_key: selectedPreset,
        output_type: outputType,
        garment_type: garmentType,
      }),
    })

    const data = await res.json()
    if (data.error) {
      setGenerating(false)
      setResult({ status: 'failed', error: data.error })
      return
    }

    setJobId(data.job_id)
    if (data.credits_remaining !== undefined) setCredits(data.credits_remaining)
  }

  async function useAsProductPhoto(imageUrl: string) {
    if (!selectedProduct) return
    await fetch(`/api/admin/products/${selectedProduct.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl }),
    })
    alert('Product photo updated!')
  }

  const progressLabel = pollCount < 5 ? 'Placing garment on model…'
    : pollCount < 12 ? 'Refining details…'
    : pollCount < 20 ? 'Generating video…'
    : 'Almost done…'

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>AI Studio ✨</h1>
          <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
            Generate professional model photos & videos for your products
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: credits !== null && credits < 10 ? '#EF4444' : '#111827' }}>
            {credits ?? '—'}
          </div>
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>AI credits</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left: configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Product picker */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '20px 24px' }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Product (optional)
            </label>
            <select
              value={selectedProduct?.id ?? ''}
              onChange={e => {
                const p = products.find(p => p.id === e.target.value) ?? null
                setSelectedProduct(p)
              }}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontSize: 13, color: '#111827', outline: 'none', background: '#fff' }}
            >
              <option value="">Use custom garment image</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Garment upload */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '20px 24px' }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Garment Photo
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: '2px dashed #E5E7EB', borderRadius: 12, padding: '20px', textAlign: 'center', cursor: 'pointer',
                background: garmentPreview ? '#F9FAFB' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              {garmentPreview ? (
                <img src={garmentPreview} alt="garment" style={{ maxHeight: 140, maxWidth: '100%', objectFit: 'contain', borderRadius: 8 }} />
              ) : (
                <div>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📸</div>
                  <div style={{ fontSize: 13, color: '#6B7280' }}>Click to upload a garment photo</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Flat-lay, hanger, or mannequin — all work</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          </div>

          {/* Garment type */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '20px 24px' }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Garment Type
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {GARMENT_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setGarmentType(value)}
                  style={{
                    padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
                    background: garmentType === value ? '#F72585' : '#F3F4F6',
                    color: garmentType === value ? '#fff' : '#6B7280',
                    transition: 'all 0.15s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Output type */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '20px 24px' }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Output
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {([
                { v: 'image', label: '📸 Photo only', cost: CREDIT_COSTS.modelShotImage },
                { v: 'both',  label: '🎬 Photo + Video', cost: CREDIT_COSTS.modelShotImage + CREDIT_COSTS.modelShotVideo },
              ] as const).map(({ v, label, cost }) => (
                <button
                  key={v}
                  onClick={() => setOutputType(v as OutputType)}
                  style={{
                    flex: 1, padding: '10px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    border: `1.5px solid ${outputType === v ? '#F72585' : '#E5E7EB'}`,
                    background: outputType === v ? '#FFF1F5' : '#fff',
                    color: outputType === v ? '#F72585' : '#6B7280',
                  }}
                >
                  {label}<br />
                  <span style={{ fontSize: 10, fontWeight: 500 }}>{cost} credits</span>
                </button>
              ))}
            </div>
          </div>

          {/* Model preset */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: '20px 24px' }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', display: 'block', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Model
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {PRESET_MODELS.map(preset => (
                <button
                  key={preset.key}
                  onClick={() => setSelectedPreset(preset.key)}
                  style={{
                    padding: '10px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: 'pointer', textAlign: 'center',
                    border: `1.5px solid ${selectedPreset === preset.key ? '#F72585' : '#E5E7EB'}`,
                    background: selectedPreset === preset.key ? '#FFF1F5' : '#fff',
                    color: selectedPreset === preset.key ? '#F72585' : '#6B7280',
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={!garmentUrl || generating || (credits !== null && credits < creditCost)}
            style={{
              padding: '14px 24px', borderRadius: 14, fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer',
              background: !garmentUrl || generating || (credits !== null && credits < creditCost)
                ? '#F3F4F6' : 'linear-gradient(135deg, #F72585, #7209B7)',
              color: !garmentUrl || generating || (credits !== null && credits < creditCost) ? '#9CA3AF' : '#fff',
              transition: 'all 0.2s',
            }}
          >
            {generating ? `Generating… (${progressLabel})` : `✨ Generate — ${creditCost} credits`}
          </button>

          {credits !== null && credits < creditCost && (
            <p style={{ fontSize: 12, color: '#EF4444', textAlign: 'center', margin: 0 }}>
              Not enough credits. Upgrade your plan or top up.
            </p>
          )}
        </div>

        {/* Right: result */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24,
            minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            {!result && !generating && (
              <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🪄</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#6B7280' }}>Your AI shot will appear here</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>
                  Photo: ~30s · Video: ~90s
                </div>
              </div>
            )}

            {generating && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', border: '4px solid #F3F4F6', borderTopColor: '#F72585', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{progressLabel}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>This takes 30–90 seconds</div>
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
              </div>
            )}

            {result?.status === 'failed' && (
              <div style={{ textAlign: 'center', color: '#EF4444' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>⚠️</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Generation failed</div>
                <div style={{ fontSize: 12, marginTop: 4, color: '#6B7280' }}>{result.error}</div>
              </div>
            )}

            {result?.status === 'completed' && (
              <div style={{ width: '100%' }}>
                {result.image_url && (
                  <div style={{ marginBottom: 16 }}>
                    <img
                      src={result.image_url}
                      alt="AI model shot"
                      style={{ width: '100%', borderRadius: 12, objectFit: 'cover' }}
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <a
                        href={result.image_url}
                        download="ai-model-shot.jpg"
                        style={{ flex: 1, textAlign: 'center', padding: '9px', borderRadius: 10, background: '#F3F4F6', color: '#374151', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
                      >
                        ⬇ Download Photo
                      </a>
                      {selectedProduct && (
                        <button
                          onClick={() => useAsProductPhoto(result.image_url!)}
                          style={{ flex: 1, padding: '9px', borderRadius: 10, background: '#F72585', color: '#fff', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer' }}
                        >
                          Use as Product Photo
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {result.video_url && (
                  <div>
                    <video
                      src={result.video_url}
                      controls
                      autoPlay
                      muted
                      loop
                      style={{ width: '100%', borderRadius: 12 }}
                    />
                    <a
                      href={result.video_url}
                      download="ai-model-video.mp4"
                      style={{ display: 'block', textAlign: 'center', marginTop: 8, padding: '9px', borderRadius: 10, background: '#7209B7', color: '#fff', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
                    >
                      ⬇ Download Video
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* How it works */}
          <div style={{ background: 'linear-gradient(135deg, #FFF1F5, #F5F3FF)', borderRadius: 14, padding: '16px 20px', border: '1px solid #FBCFE8' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#9D174D', marginBottom: 10 }}>How it works</div>
            {[
              { icon: '📸', text: 'Upload any garment photo — flat-lay, hanger, mannequin' },
              { icon: '🤖', text: 'AI places it on a real model matching your skin tone choice' },
              { icon: '🎬', text: 'Higgsfield animates the model into a 5s fashion video' },
              { icon: '🛍️', text: 'Use the photo/video as your product listing image' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.4 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
