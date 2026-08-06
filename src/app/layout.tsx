import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WearOn — Virtual Try-On for Your Fashion Store',
  description: 'Give your Instagram customers a branded fashion app with AI virtual try-on. No code needed.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
