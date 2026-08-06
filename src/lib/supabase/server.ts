import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

const isConfigured = url.startsWith('http') && service.length > 20

export async function createClient() {
  const cookieStore = await cookies()
  if (!isConfigured) {
    // Return a no-op client stub when env vars are not set
    return createServerClient('https://placeholder.supabase.co', anon || 'placeholder', {
      cookies: { getAll: () => [], setAll: () => {} },
    })
  }
  return createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cs) => cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
    },
  })
}

export function createAdminClient() {
  if (!isConfigured) {
    return createSupabaseClient('https://placeholder.supabase.co', 'placeholder', {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return createSupabaseClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } })
}
