'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[app-error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#FAF7F3] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl mb-4">⚠️</p>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-sm">
        An unexpected error occurred. Our team has been notified.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-pink-600 text-white text-sm font-semibold rounded-lg hover:bg-pink-700 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
