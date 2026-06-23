'use client'
import Link from 'next/link'
import { ShoppingCart, Search, Heart, ChevronDown } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useZone } from '@/contexts/ZoneContext'

const ZONE_FLAGS: Record<string, string> = {
  martinique: '🇲🇶', guadeloupe: '🇬🇵', guyane: '🇬🇫',
  'saint-martin': '🇸🇽', 'saint-barthelemy': '',
}

export default function Header() {
  const { totalItems } = useCart()
  const { zone, setShowSelector } = useZone()

  const zoneLabel = zone
    ? `${ZONE_FLAGS[zone.name] ?? ''} ${zone.label.replace(/\s🇲🇶|🇬🇵|🇬🇫|🇸🇽/g, '').trim()}`
    : 'Choisir une zone'

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="jc-container flex items-center justify-between h-[54px]">
        {/* Logo */}
        <Link href="/" className="font-semibold text-base tracking-tight shrink-0">
          Juste Connecté
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {[
            { href: '/boutique',           label: 'Boutique' },
            { href: '/boutique?marque=apple',   label: 'Apple' },
            { href: '/boutique?marque=samsung', label: 'Samsung' },
            { href: '/boutique?marque=xiaomi',  label: 'Xiaomi' },
            { href: '/boutique?marque=google',  label: 'Google' },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className="transition-opacity hover:opacity-60">
              {label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Zone */}
          <button
            onClick={() => setShowSelector(true)}
            className="hidden sm:flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full hover:bg-black/5 transition-colors"
          >
            {zoneLabel}
            <ChevronDown size={11} className="opacity-50" />
          </button>

          {/* Search */}
          <button className="p-2 rounded-full hover:bg-black/5 transition-colors">
            <Search size={17} />
          </button>

          {/* Wishlist */}
          <button className="p-2 rounded-full hover:bg-black/5 transition-colors">
            <Heart size={17} />
          </button>

          {/* Cart */}
          <Link href="/panier" className="relative p-2 rounded-full hover:bg-black/5 transition-colors">
            <ShoppingCart size={17} />
            {totalItems > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full text-white text-[9px] font-bold"
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
