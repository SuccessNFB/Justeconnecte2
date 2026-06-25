'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Search, Heart, ChevronDown, Menu, X } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useZone } from '@/contexts/ZoneContext'
import { useWishlist } from '@/contexts/WishlistContext'
import SearchOverlay from '@/components/SearchOverlay'

const ZONE_FLAGS: Record<string, string> = {
  'martinique-guadeloupe': '🇲🇶',
  'guyane': '🇬🇫',
}

const NAV_LINKS = [
  { href: '/boutique',                label: 'Boutique'  },
  { href: '/boutique?marque=apple',   label: 'Apple'     },
  { href: '/boutique?marque=samsung', label: 'Samsung'   },
  { href: '/boutique?marque=xiaomi',  label: 'Xiaomi'    },
  { href: '/boutique?marque=gopro',   label: 'GoPro'     },
]

export default function Header() {
  const { totalItems }             = useCart()
  const { zone, setShowSelector }  = useZone()
  const { count: wishlistCount }   = useWishlist()
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const zoneLabel = zone
    ? `${ZONE_FLAGS[zone.name] ?? '🌍'} ${zone.label}`
    : 'Zone de livraison'

  function isActive(href: string) {
    if (href === '/boutique' && !pathname.includes('?')) return pathname === '/boutique'
    return pathname + (typeof window !== 'undefined' ? window.location.search : '') === href ||
      (href.includes('?marque=') && typeof window !== 'undefined' && window.location.href.includes(href.split('?')[1]))
  }

  return (
    <>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: 'rgba(248,247,245,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="jc-container flex items-center justify-between h-[58px]">

          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-[15px] tracking-tight shrink-0"
            style={{ letterSpacing: '-0.03em' }}
          >
            Juste Connecté
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || pathname === href.split('?')[0] && href.includes('boutique') && !href.includes('?') && pathname === '/boutique'
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-150"
                  style={{
                    color: 'var(--foreground)',
                    opacity: 1,
                  }}
                >
                  <span className="relative z-10 hover:opacity-60 transition-opacity">{label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-0.5">
            {/* Zone selector */}
            <button
              onClick={() => setShowSelector(true)}
              className="hidden sm:flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-full transition-colors hover:bg-black/5"
              aria-label="Choisir la zone de livraison"
            >
              <span>{zoneLabel}</span>
              <ChevronDown size={10} className="opacity-40" />
            </button>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
              aria-label="Rechercher un produit"
            >
              <Search size={17} strokeWidth={1.8} />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-full hover:bg-black/5 transition-colors"
              aria-label={`Favoris${wishlistCount > 0 ? ` (${wishlistCount})` : ''}`}
            >
              <Heart
                size={17}
                strokeWidth={1.8}
                style={{
                  fill: wishlistCount > 0 ? 'var(--gold)' : 'none',
                  color: wishlistCount > 0 ? 'var(--gold)' : 'inherit',
                  transition: 'fill 0.2s, color 0.2s',
                }}
              />
              {wishlistCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full text-white text-[9px] font-bold"
                  style={{ background: 'var(--gold)' }}
                  aria-hidden="true"
                >
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/panier"
              className="relative p-2 rounded-full hover:bg-black/5 transition-colors"
              aria-label={`Panier${totalItems > 0 ? ` (${totalItems} article${totalItems > 1 ? 's' : ''})` : ''}`}
            >
              <ShoppingCart size={17} strokeWidth={1.8} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 rounded-full text-white text-[9px] font-bold"
                  style={{ background: 'var(--gold)' }}
                  aria-hidden="true"
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2 rounded-full hover:bg-black/5 transition-colors ml-0.5"
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} strokeWidth={1.8} /> : <Menu size={18} strokeWidth={1.8} />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div
            className="md:hidden border-t"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <nav className="jc-container py-4 flex flex-col gap-1" aria-label="Menu mobile">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    background: 'transparent',
                    color: 'var(--foreground)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-soft)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={() => { setShowSelector(true); setMobileOpen(false) }}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium w-full rounded-xl transition-colors"
                  style={{ color: 'var(--foreground)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-soft)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span>{zoneLabel}</span>
                  <ChevronDown size={12} className="opacity-40" />
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}
