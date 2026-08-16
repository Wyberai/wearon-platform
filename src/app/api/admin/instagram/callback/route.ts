import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://instastarz.in'

  if (error || !code || !state) {
    return NextResponse.redirect(`${appUrl}/admin?ig_error=cancelled`)
  }

  const [sellerId, slug] = state.split('|')
  if (!sellerId || !slug) {
    return NextResponse.redirect(`${appUrl}/admin?ig_error=invalid_state`)
  }

  const callbackUrl = `${appUrl}/api/admin/instagram/callback`
  const appId = process.env.META_APP_ID ?? ''
  const appSecret = process.env.META_APP_SECRET ?? ''

  try {
    // Step 1: exchange code for short-lived token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `client_id=${appId}&redirect_uri=${encodeURIComponent(callbackUrl)}&client_secret=${appSecret}&code=${code}`
    )
    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) throw new Error('No access token')

    // Step 2: exchange for long-lived token
    const longRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${tokenData.access_token}`
    )
    const longData = await longRes.json()
    const longLivedToken = longData.access_token ?? tokenData.access_token
    const expiresIn = longData.expires_in // seconds, typically 60 days

    // Step 3: get Facebook pages the user manages
    const pagesRes = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${longLivedToken}`
    )
    const pagesData = await pagesRes.json()
    const pages = pagesData.data ?? []

    // Find first page with an Instagram Business Account
    const page = pages.find((p: { instagram_business_account?: { id: string } }) => p.instagram_business_account?.id)
    if (!page) {
      return NextResponse.redirect(`${appUrl}/admin/${slug}/settings?ig_error=no_instagram_account`)
    }

    const igBusinessAccountId = page.instagram_business_account.id
    const pageAccessToken = page.access_token

    // Step 4: get Instagram username
    const igRes = await fetch(
      `https://graph.facebook.com/v18.0/${igBusinessAccountId}?fields=username&access_token=${pageAccessToken}`
    )
    const igData = await igRes.json()
    const igUsername = igData.username ?? null

    // Step 5: subscribe page to webhook
    await fetch(
      `https://graph.facebook.com/v18.0/${page.id}/subscribed_apps?subscribed_fields=messages,messaging_postbacks&access_token=${pageAccessToken}`,
      { method: 'POST' }
    )

    // Step 6: store in DB
    const admin = createAdminClient()
    const tokenExpiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 1000).toISOString()
      : null

    await admin.from('instagram_connections').upsert(
      {
        seller_id: sellerId,
        ig_business_account_id: igBusinessAccountId,
        ig_username: igUsername,
        page_id: page.id,
        page_name: page.name,
        page_access_token: pageAccessToken,
        token_expires_at: tokenExpiresAt,
        webhook_subscribed: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'seller_id' }
    )

    // Ensure agent config row exists
    await admin.from('instagram_agent_config').upsert(
      { seller_id: sellerId },
      { onConflict: 'seller_id', ignoreDuplicates: true }
    )

    return NextResponse.redirect(`${appUrl}/admin/${slug}/inbox?ig_connected=1`)
  } catch (err) {
    console.error('[ig-callback]', err)
    return NextResponse.redirect(`${appUrl}/admin/${slug}/settings?ig_error=failed`)
  }
}
