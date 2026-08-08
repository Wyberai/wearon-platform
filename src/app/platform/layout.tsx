import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')
  if (user.email !== process.env.PLATFORM_OWNER_EMAIL) redirect('/admin')

  return (
    <div style={{ background: '#09090B', minHeight: '100vh', color: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif' }}>
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#09090B', zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.3px' }}>
            Wear<span style={{ color: '#F72585' }}>On</span>
            <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(247,37,133,0.15)', color: '#F472B6', padding: '2px 7px', borderRadius: 99, border: '1px solid rgba(247,37,133,0.25)', letterSpacing: '0.05em', marginLeft: 8 }}>PLATFORM</span>
          </span>
          <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
          <a href="/platform" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Overview</a>
        </div>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>{user.email}</span>
      </nav>
      {children}
    </div>
  )
}
