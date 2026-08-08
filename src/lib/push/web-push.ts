'use client'

/**
 * Returns the Firebase client config built from NEXT_PUBLIC_FIREBASE_* env vars.
 * Use this to initialize the Firebase app on the client side.
 */
export function getPushConfig(): object {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }
}

/**
 * Client-side helper: requests notification permission, obtains an FCM token,
 * and registers it with the backend via POST /api/admin/push.
 *
 * Returns the FCM token on success, or null if permission was denied, the
 * environment is not supported, or any step fails.
 *
 * Must be called from a browser context (not during SSR/SSG).
 */
export async function requestPushPermission(): Promise<string | null> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('[web-push] Notifications not supported in this environment')
    return null
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    console.log('[web-push] Notification permission denied:', permission)
    return null
  }

  try {
    // Dynamic imports so this module is safe to import on the server.
    // Install firebase before using: npm install firebase
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore — firebase not installed until env is configured
    const { initializeApp, getApps, getApp } = await import('firebase/app')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { getMessaging, getToken } = await import('firebase/messaging')

    const config = getPushConfig()
    const app = getApps().length === 0 ? initializeApp(config) : getApp()
    const messaging = getMessaging(app)

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    if (!vapidKey) {
      console.error('[web-push] NEXT_PUBLIC_FIREBASE_VAPID_KEY is not set')
      return null
    }

    const token = await getToken(messaging, { vapidKey })
    if (!token) {
      console.warn('[web-push] getToken returned empty — check VAPID key and SW registration')
      return null
    }

    // Register the token with the backend
    const res = await fetch('/api/admin/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })

    if (!res.ok) {
      console.error('[web-push] Failed to register token with backend:', res.status)
    }

    return token
  } catch (err) {
    console.error('[web-push] Error requesting push permission:', err)
    return null
  }
}
