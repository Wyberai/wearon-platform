import Link from 'next/link'

export default function StoreNotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl mb-4">🛍️</p>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Store not found</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-sm">
        This store doesn&apos;t exist or may have moved. Check the link and try again.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-pink-600 text-white text-sm font-semibold rounded-lg hover:bg-pink-700 transition-colors"
      >
        Back to Instastarz
      </Link>
    </div>
  )
}
