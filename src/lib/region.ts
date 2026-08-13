import { headers } from 'next/headers'

export type Region = 'US' | 'IN'

export async function resolveRegion(): Promise<Region> {
  const h = await headers()
  const country = h.get('x-vercel-ip-country') ?? ''
  return country === 'IN' ? 'IN' : 'US'
}
