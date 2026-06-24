'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, Boxes, BarChart2, LogOut, Zap, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const NAV = [
  { href: '/admin',               icon: LayoutDashboard, label: 'Dashboard'   },
  { href: '/admin/analytiques',   icon: BarChart2,       label: 'Analytiques' },
  { href: '/admin/produits',      icon: Package,         label: 'Produits'    },
  { href: '/admin/stock',         icon: Boxes,           label: 'Stock'       },
]

const MAX_ATTEMPTS = 5
const LOCKOUT_MS   = 5 * 60 * 1000  // 5 minutes

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const attemptCount  = useRef(0)
  const firstAttemptAt = useRef(0)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const now = Date.now()

    // Reset window after lockout period
    if (now - firstAttemptAt.current > LOCKOUT_MS) {
      attemptCount.current  = 0
      firstAttemptAt.current = now
    }

    if (attemptCount.current >= MAX_ATTEMPTS) {
      const remaining = Math.ceil((firstAttemptAt.current + LOCKOUT_MS - now) / 1000 / 60)
      setError(`Trop de tentatives. Réessayez dans ${remaining} min.`)
      return
    }

    if (attemptCount.current === 0) firstAttemptAt.current = now
    attemptCount.current += 1

    setLoggingIn(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoggingIn(false)

    // Generic message — do not expose whether email or password is wrong
    if (error) setError('Identifiants incorrects.')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
      <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold)' }} />
    </div>
  )

  if (!session) return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      <div className="jc-card p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 font-bold text-lg mb-6">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg text-white" style={{ background: 'var(--primary)' }}>
            <Zap size={16} fill="currentColor" />
          </span>
          Administration
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input className="jc-input" type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} required />
          <input className="jc-input" type="password" placeholder="Mot de passe" value={password}
            onChange={e => setPassword(e.target.value)} required />
          {error && <p className="text-sm" style={{ color: 'var(--destructive)' }}>{error}</p>}
          <button type="submit" disabled={loggingIn} className="jc-btn-primary">
            {loggingIn ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      {/* ── SIDEBAR ── */}
      <>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside
          className={`fixed lg:sticky top-0 h-screen z-30 w-64 flex flex-col py-6 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
          style={{ background: 'var(--primary)' }}
        >
          <div className="px-6 mb-8">
            <Link href="/admin" className="flex items-center gap-2 font-bold text-white text-base">
              <Zap size={16} fill="currentColor" /> Admin
            </Link>
          </div>

          <nav className="flex-1 px-3 flex flex-col gap-1">
            {NAV.map(({ href, icon: Icon, label }) => {
              const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: active ? 'oklch(1 0 0 / 0.12)' : 'transparent',
                    color: active ? '#fff' : 'oklch(1 0 0 / 0.55)',
                  }}
                >
                  <Icon size={16} /> {label}
                </Link>
              )
            })}
          </nav>

          <div className="px-3 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ color: 'oklch(1 0 0 / 0.55)' }}
            >
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </aside>
      </>

      {/* ── CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="lg:hidden flex items-center gap-3 p-4" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-black/5">
            <Menu size={20} />
          </button>
          <span className="font-bold">Administration</span>
        </div>

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
