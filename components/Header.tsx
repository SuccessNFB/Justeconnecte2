'use client'
import Link from 'next/link'
import { ShoppingCart, MapPin, Zap } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useZone } from '@/contexts/ZoneContext'

export default function Header() {
  const { totalItems } = useCart()
  const { zone, setShowSelector } = useZone()

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'oklch(1 0 0 / 0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="jc-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg text-white"
            style={{ background: 'var(--primary)' }}
          >
            <Zap size={16} fill="currentColor" />
          </span>
          <span>Juste Connecté</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/boutique" className="hover:opacity-70 transition-opacity">Boutique</Link>
          <Link href="/boutique?marque=apple" className="hover:opacity-70 transition-opacity">Apple</Link>
          <Link href="/boutique?marque=samsung" className="hover:opacity-70 transition-opacity">Samsung</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSelector(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all"
            style={{ border: '1.5px solid var(--border)', background: 'var(--surface-soft)' }}
          >
            <MapPin size={12} />
            {zone ? zone.label.replace(/\s🇲🇶|🇬🇵|🇬🇫|🇸🇽/g, '') : 'Choisir zone'}
          </button>

          <Link href="/panier" className="relative p-2 rounded-xl hover:bg-black/5 transition-colors">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full text-white text-[10px] font-bold"
                style={{ background: 'var(--gold)' }}
              >
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
