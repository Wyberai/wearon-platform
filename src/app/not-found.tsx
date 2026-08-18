import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF7F3] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold text-pink-600 mb-4">404</p>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-sm">
        This page doesn&apos;t exist or may have been moved.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-pink-600 text-white text-sm font-semibold rounded-lg hover:bg-pink-700 transition-colors"
      >
        Go home
      </Link>
    </div>
  )
}
