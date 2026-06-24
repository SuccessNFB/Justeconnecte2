'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function parseStored(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((s): s is string => typeof s === 'string' && SLUG_RE.test(s) && s.length < 120)
      .slice(0, 100)
  } catch { return [] }
}

interface WishlistContextValue {
  slugs: string[]
  toggle: (slug: string) => void
  isWishlisted: (slug: string) => boolean
  count: number
}

const WishlistContext = createContext<WishlistContextValue>({
  slugs: [],
  toggle: () => {},
  isWishlisted: () => false,
  count: 0,
})

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('jc-wishlist')
    if (stored) setSlugs(parseStored(stored))
  }, [])

  function persist(next: string[]) {
    setSlugs(next)
    localStorage.setItem('jc-wishlist', JSON.stringify(next))
  }

  function toggle(slug: string) {
    if (!SLUG_RE.test(slug) || slug.length >= 120) return
    persist(slugs.includes(slug) ? slugs.filter(s => s !== slug) : [...slugs, slug])
  }

  return (
    <WishlistContext.Provider value={{
      slugs,
      toggle,
      isWishlisted: (slug) => slugs.includes(slug),
      count: slugs.length,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
