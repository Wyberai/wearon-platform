'use client'

import { useEffect } from 'react'

// The native seller app (wearon-seller-app) injects window.__WEARON_FCM_TOKEN__
// and window.__WEARON_NATIVE_ROLE__ into this WebView on load — this bridges
// that into a real, authenticated push-token registration. Runs same-origin
// inside the page, so the seller's Supabase auth cookie is attached
// automatically; no token/session needs to cross into React Native.
export function NativeBridge() {
  useEffect(() => {
    const w = window as unknown as { __WEARON_FCM_TOKEN__?: string; __WEARON_NATIVE_ROLE__?: string }
    if (w.__WEARON_NATIVE_ROLE__ !== 'seller' || !w.__WEARON_FCM_TOKEN__) return

    fetch('/api/admin/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: w.__WEARON_FCM_TOKEN__, platform: 'fcm' }),
    }).catch(() => {})
  }, [])

  return null
}
