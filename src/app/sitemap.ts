import type { MetadataRoute } from 'next'
import { FLAGSHIP_REGISTRY } from '@/lib/flagship-generic/registry'

const BASE_URL = 'https://instastarz.in'

// The 12 month-calendar flagship demo stores (see FLAGSHIP_DEMO_SLUG in
// src/lib/themes.ts) plus the 3 "Insta" bespoke demos — listed directly
// rather than looping the registry, since these 15 are the only stable
// public demo slugs outside FLAGSHIP_REGISTRY and there's no risk of this
// list silently drifting without a second file needing an update too.
const DEMO_SLUGS = [
  'august', 'ember', 'bloom', 'mela', 'taana', 'saaj',
  'scroll', 'dhamaka', 'aaram', 'utsav', 'galli', 'kiraya',
  'reelrack', 'thegrid', 'tryiton',
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

  // The 88 generic-kit flagship stores (src/lib/flagship-generic/registry.ts)
  // — looped from the registry itself (unlike DEMO_SLUGS above) since this
  // list is expected to keep growing and re-typing 88+ slugs by hand here
  // would just be a second place for it to silently drift out of sync.
  const genericFlagshipRoutes: MetadataRoute.Sitemap = Object.keys(FLAGSHIP_REGISTRY).map(slug => ({
    url: `${BASE_URL}/store/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...demoRoutes, ...genericFlagshipRoutes]
}
