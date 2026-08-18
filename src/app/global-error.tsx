'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[global-error]', error)
  }, [error])

  return (
    <html>
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#FAF7F3', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', textAlign: 'center', padding: '1rem' }}>
        <p style={{ fontSize: '3rem', margin: '0 0 1rem' }}>⚠️</p>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111', margin: '0 0 0.5rem' }}>Something went wrong</h1>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: '0 0 2rem', maxWidth: '320px' }}>
          A critical error occurred. Our team has been notified.
        </p>
        <button
          onClick={reset}
          style={{ padding: '10px 20px', background: '#db2777', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
