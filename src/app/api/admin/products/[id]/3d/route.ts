import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

type Params = Promise<{ id: string }>

export async function POST(_req: NextRequest, { params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: product } = await admin
    .from('products')
    .select('id, garment_image_url')
    .eq('id', id)
    .eq('seller_id', user.id)
    .single()

  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  if (!product.garment_image_url)
    return NextResponse.json({ error: 'Product has no garment image' }, { status: 400 })
  if (!process.env.MESHY_API_KEY)
    return NextResponse.json({ error: 'Meshy API not configured' }, { status: 503 })

  const res = await fetch('https://api.meshy.ai/openapi/v2/image-to-3d', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.MESHY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_url: product.garment_image_url,
      ai_model: 'meshy-4',
      topology: 'quad',
      target_polycount: 10000,
      enable_pbr: true,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json({ error: `Meshy error: ${err}` }, { status: 502 })
  }

  const json = await res.json()
  const jobId: string = json.result
  await admin.from('products').update({ meshy_job_id: jobId }).eq('id', id)
  return NextResponse.json({ job_id: jobId, status: 'processing' }, { status: 202 })
}

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: product } = await admin
    .from('products')
    .select('meshy_job_id, mesh_url')
    .eq('id', id)
    .eq('seller_id', user.id)
    .single()

  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  if (!product.meshy_job_id) return NextResponse.json({ error: 'No 3D job' }, { status: 404 })
  if (product.mesh_url) return NextResponse.json({ status: 'complete', mesh_url: product.mesh_url })

  const res = await fetch(`https://api.meshy.ai/openapi/v2/image-to-3d/${product.meshy_job_id}`, {
    headers: { Authorization: `Bearer ${process.env.MESHY_API_KEY}` },
  })
  if (!res.ok) return NextResponse.json({ status: 'unknown' })

  const job = await res.json()
  if (job.status === 'SUCCEEDED' && job.model_urls?.glb) {
    await admin.from('products').update({ mesh_url: job.model_urls.glb }).eq('id', id)
    return NextResponse.json({ status: 'complete', mesh_url: job.model_urls.glb })
  }
  return NextResponse.json({ status: (job.status ?? 'processing').toLowerCase() })
}
