import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Instastarz',
    short_name: 'Instastarz',
    description: 'Try on clothes before you buy',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#E91E63',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
