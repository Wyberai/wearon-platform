import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

const ALLOWED_TYPES = ['logo', 'favicon', 'banner'] as const
type AssetType = typeof ALLOWED_TYPES[number]
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid multipart form data' }, { status: 400 })
  }

  const file = formData.get('file')
  const type = formData.get('type') as string | null

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file field' }, { status: 400 })
  }

  if (!type || !(ALLOWED_TYPES as readonly string[]).includes(type)) {
    return NextResponse.json(
      { error: `type must be one of: ${ALLOWED_TYPES.join(', ')}` },
      { status: 400 }
    )
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File exceeds 5 MB limit' }, { status: 400 })
  }

  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin'
  const filename = `${Date.now()}.${ext}`
  const path = `${user.id}/${type as AssetType}/${filename}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  const admin = createAdminClient()
  const { error: uploadError } = await admin.storage
    .from('tenant-assets')
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: publicUrlData } = admin.storage
    .from('tenant-assets')
    .getPublicUrl(path)

  return NextResponse.json({
    url: publicUrlData.publicUrl,
    type,
  })
}
