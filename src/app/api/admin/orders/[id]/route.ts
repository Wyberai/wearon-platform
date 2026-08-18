import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

type Params = Promise<{ id: string }>

const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const
type OrderStatus = typeof VALID_STATUSES[number]

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { status, tracking_number, tracking_url } = body as { status?: OrderStatus; tracking_number?: string; tracking_url?: string }

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({
      error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
    }, { status: 400 })
  }

  const admin = createAdminClient()
  const update: Record<string, unknown> = {}
  if (status) {
    update.status = status
    if (status === 'confirmed') update.whatsapp_confirmed = true
    if (status === 'shipped') update.shipped_at = new Date().toISOString()
  }
  if (tracking_number !== undefined) update.tracking_number = tracking_number
  if (tracking_url !== undefined) update.tracking_url = tracking_url

  const { data, error } = await admin
    .from('orders')
    .update(update)
    .eq('id', id)
    .eq('seller_id', user.id)
    .select('id, status, items, total_inr, buyer_phone, buyer_email, whatsapp_confirmed, shipped_at, tracking_number, tracking_url')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (status === 'confirmed') {
    try {
      const { sendEmail } = await import('@/lib/email/resend')
      const { buyerConfirmationEmail } = await import('@/lib/email/templates/buyer-confirmation')
      const { data: config } = await admin
        .from('tenant_config').select('brand_name, slug, primary_color').eq('seller_id', user.id).single()
      const buyerEmail: string | undefined = (data as Record<string, unknown>).buyer_email as string | undefined
      if (config && data && buyerEmail) {
        const tpl = buyerConfirmationEmail({
          brandName: config.brand_name,
          primaryColor: config.primary_color ?? undefined,
          orderId: data.id,
          items: (data.items ?? []) as Array<{ name: string; qty: number; price: number }>,
          totalInr: data.total_inr,
          storeSlug: config.slug,
        })
        await sendEmail({ to: buyerEmail, subject: tpl.subject, html: tpl.html })
      }
    } catch { /* email is best-effort */ }
  }

  if (status === 'shipped') {
    try {
      const { sendEmail } = await import('@/lib/email/resend')
      const { orderEmail } = await import('@/lib/email/templates/order')
      const { data: config } = await admin
        .from('tenant_config').select('brand_name, slug').eq('seller_id', user.id).single()
      if (config && data) {
        const tpl = orderEmail({
          brandName: config.brand_name,
          orderId: data.id,
          slug: config.slug,
          items: (data.items ?? []) as Array<{ name: string; qty: number; price: number }>,
          totalInr: data.total_inr,
          buyerPhone: data.buyer_phone ?? undefined,
        })
        const buyerEmail: string | undefined = (data as Record<string, unknown>).buyer_email as string | undefined
        if (buyerEmail) {
          await sendEmail({ to: buyerEmail, subject: tpl.subject, html: tpl.html })
        }
        const { data: sellerProfile } = await admin.from('profiles').select('email').eq('id', user.id).single()
        if (sellerProfile?.email) {
          await sendEmail({ to: sellerProfile.email, subject: tpl.subject, html: tpl.html })
        }
      }
    } catch { /* email is best-effort */ }
  }

  if (status === 'delivered') {
    try {
      const { sendEmail } = await import('@/lib/email/resend')
      const { deliveryConfirmationEmail } = await import('@/lib/email/templates/delivery-confirmation')
      const { data: config } = await admin
        .from('tenant_config').select('brand_name, slug, primary_color').eq('seller_id', user.id).single()
      const buyerEmail: string | undefined = (data as Record<string, unknown>).buyer_email as string | undefined
      if (config && data && buyerEmail) {
        const tpl = deliveryConfirmationEmail({
          brandName: config.brand_name,
          primaryColor: config.primary_color ?? undefined,
          orderId: data.id,
          items: (data.items ?? []) as Array<{ name: string; qty: number; price: number }>,
          totalInr: data.total_inr,
          storeSlug: config.slug,
        })
        await sendEmail({ to: buyerEmail, subject: tpl.subject, html: tpl.html })
      }
    } catch { /* email is best-effort */ }
  }

  return NextResponse.json(data)
}
