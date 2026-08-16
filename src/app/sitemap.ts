import type { MetadataRoute } from 'next'

const BASE_URL = 'https://instastarz.in'

// The 12 flagship demo stores (see FLAGSHIP_DEMO_SLUG in src/lib/themes.ts) —
// listed directly rather than looping the registry, since these are the only
// stable public demo slugs and there's no risk of the list silently drifting
// without a second file needing an update too.
const DEMO_SLUGS = [
  'august', 'ember', 'bloom', 'mela', 'taana', 'saaj',
  'scroll', 'dhamaka', 'aaram', 'utsav', 'galli', 'kiraya',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/themes`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/insta`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/refund-policy`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const demoRoutes: MetadataRoute.Sitemap = DEMO_SLUGS.map(slug => ({
    url: `${BASE_URL}/store/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...demoRoutes]
}
