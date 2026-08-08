import { createAdminClient } from '@/lib/supabase/server'

/**
 * Send a single push notification to one device token via FCM legacy HTTP API.
 * Throws on failure so the caller can count errors.
 */
export async function sendPushNotification({
  token,
  platform,
  title,
  body,
  data,
}: {
  token: string
  platform: string
  title: string
  body: string
  data?: Record<string, string>
}): Promise<void> {
  const serverKey = process.env.FIREBASE_SERVER_KEY
  if (!serverKey) {
    throw new Error('FIREBASE_SERVER_KEY is not configured')
  }

  // APNs tokens are sent via FCM for cross-platform convenience when using
  // Firebase Cloud Messaging with APNs bridging. For native-only APNs, swap
  // this to the APNs HTTP/2 API. For now we use the FCM endpoint for both.
  const FCM_URL = 'https://fcm.googleapis.com/fcm/send'

  const res = await fetch(FCM_URL, {
    method: 'POST',
    headers: {
      Authorization: `key=${serverKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: token,
      notification: { title, body },
      data: data ?? {},
    }),
  })

  if (!res.ok) {
    throw new Error(`FCM HTTP ${res.status} for platform=${platform}`)
  }

  const json = (await res.json()) as {
    results?: Array<{ error?: string }>
  }
  const result = json.results?.[0]
  if (result?.error) {
    throw new Error(`FCM error: ${result.error}`)
  }
}

/**
 * Send a push notification to all registered devices for a seller via FCM legacy HTTP API.
 * Never throws — errors are logged and invalid tokens are pruned.
 */
export async function sendPushToSeller(
  sellerId: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<void> {
  const serverKey = process.env.FIREBASE_SERVER_KEY
  if (!serverKey) {
    console.log('[FCM] FIREBASE_SERVER_KEY not set — skipping push notification')
    return
  }

  const supabase = createAdminClient()

  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('id, token')
    .eq('seller_id', sellerId)

  if (error) {
    console.error('[FCM] Failed to fetch push subscriptions:', error.message)
    return
  }

  if (!subscriptions || subscriptions.length === 0) {
    return
  }

  const FCM_URL = 'https://fcm.googleapis.com/fcm/send'

  for (const sub of subscriptions) {
    const { id, token } = sub as { id: string; token: string }

    try {
      const res = await fetch(FCM_URL, {
        method: 'POST',
        headers: {
          Authorization: `key=${serverKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: token,
          notification: { title, body },
          data: data ?? {},
        }),
      })

      if (!res.ok) {
        console.error(`[FCM] HTTP ${res.status} for subscription ${id}`)
        continue
      }

      const json = (await res.json()) as {
        results?: Array<{ error?: string; registration_id?: string }>
      }

      const result = json.results?.[0]

      if (result?.error) {
        const errCode = result.error

        if (
          errCode === 'NotRegistered' ||
          errCode === 'InvalidRegistration' ||
          errCode === 'MismatchSenderId'
        ) {
          // Token is no longer valid — remove it
          const { error: delError } = await supabase
            .from('push_subscriptions')
            .delete()
            .eq('id', id)

          if (delError) {
            console.error(`[FCM] Failed to delete stale subscription ${id}:`, delError.message)
          } else {
            console.log(`[FCM] Removed stale subscription ${id} (${errCode})`)
          }
        } else {
          console.error(`[FCM] Error for subscription ${id}: ${errCode}`)
        }
      }

      // If FCM issued a canonical registration ID, update the stored token
      if (result?.registration_id) {
        const { error: upError } = await supabase
          .from('push_subscriptions')
          .update({ token: result.registration_id })
          .eq('id', id)

        if (upError) {
          console.error(`[FCM] Failed to update canonical token for ${id}:`, upError.message)
        }
      }
    } catch (err) {
      console.error(`[FCM] Unexpected error for subscription ${id}:`, err)
    }
  }
}
