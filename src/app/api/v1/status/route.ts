import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-wearon-key')
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing X-WearOn-Key header' }, { status: 401 })
  }

  const jobId = req.nextUrl.searchParams.get('job_id')
  if (!jobId) {
    return NextResponse.json({ error: 'Missing job_id query param' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: profile } = await admin
    .from('profiles')
    .select('id')
    .eq('api_key', apiKey)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  const { data: job } = await admin
    .from('try_on_results')
    .select('id, result_image_url, processing_ms, created_at')
    .eq('id', jobId)
    .eq('seller_id', profile.id)
    .single()

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  if (job.result_image_url) {
    return NextResponse.json({
      job_id: jobId,
      status: 'complete',
      result_url: job.result_image_url,
      processing_ms: job.processing_ms,
    })
  }

  return NextResponse.json({
    job_id: jobId,
    status: 'processing',
    result_url: null,
    eta_seconds: 18,
  })
}
