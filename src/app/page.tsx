import Link from 'next/link'
import { PLANS } from '@/lib/constants'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-pink-600">WearOn</span>
          <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-medium">Beta</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">Login</Link>
          <Link href="/auth/signup" className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors">
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block bg-pink-50 text-pink-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          India&apos;s first virtual try-on app for Instagram sellers
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Your own fashion app.<br />
          <span className="text-pink-600">With try-on built in.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Give your Instagram followers a branded shopping app where they can try on your
          clothes before ordering. No code. Live in 10 minutes.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/auth/signup" className="bg-pink-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-pink-700 transition-colors shadow-lg shadow-pink-200">
            Create Your Store Free
          </Link>
          <Link href="/store/demo" className="text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors">
            See Demo Store
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Set up your store', desc: 'Upload your logo, pick your brand color, add your products. Done in 10 minutes.' },
              { step: '02', title: 'Share your link', desc: 'Put wearon.in/store/yourname in your Instagram bio. Your followers get a full branded app experience.' },
              { step: '03', title: 'Watch orders roll in', desc: "Buyers try on your clothes with their camera. One tap to order via WhatsApp. Returns drop by 40%." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="text-4xl font-bold text-pink-100 mb-4">{step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Simple pricing</h2>
        <p className="text-center text-gray-500 mb-12">Start free. Pay only when you grow.</p>
        <div className="grid md:grid-cols-4 gap-6">
          {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).filter(([k]) => k !== 'enterprise').map(([key, plan]) => (
            <div key={key} className={`rounded-2xl p-6 border-2 ${key === 'growth' ? 'border-pink-500 bg-pink-50' : 'border-gray-100 bg-white'}`}>
              {key === 'growth' && <div className="text-xs font-bold text-pink-600 mb-3 uppercase tracking-wide">Most Popular</div>}
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {plan.price_inr === 0 ? 'Free' : `₹${plan.price_inr.toLocaleString('en-IN')}`}
                {plan.price_inr > 0 && <span className="text-sm font-normal text-gray-500">/mo</span>}
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-4">{plan.name}</div>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>✓ {plan.products === 9999 ? 'Unlimited' : plan.products} products</li>
                <li>✓ {plan.try_ons} try-ons/month</li>
                <li>✓ Branded PWA store</li>
                {key === 'growth' && <li>✓ Android APK (24hr)</li>}
                {key === 'pro' && <li>✓ Play Store listing</li>}
              </ul>
              <Link
                href="/auth/signup"
                className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${key === 'growth' ? 'bg-pink-600 text-white hover:bg-pink-700' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
              >
                {plan.label}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-400 mt-6">₹3 per extra try-on · Annual plans get 2 months free · No setup fee</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <p>WearOn — Built for Indian fashion sellers · <Link href="/auth/login" className="hover:text-gray-600">Login</Link></p>
      </footer>
    </div>
  )
}
