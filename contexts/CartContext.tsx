'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import type { CartItem } from '@/lib/types'

const MAX_QUANTITY   = 10
const MAX_CART_LINES = 20
const UUID_RE        = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidCartItem(v: unknown): v is CartItem {
  return (
    v !== null &&
    typeof v === 'object' &&
    typeof (v as any).variantId === 'string' &&
    UUID_RE.test((v as any).variantId) &&
    typeof (v as any).quantity === 'number' &&
    (v as any).quantity >= 1 &&
    (v as any).quantity <= MAX_QUANTITY
  )
}

function parseStoredCart(raw: string): CartItem[] {
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(isValidCartItem)
      .slice(0, MAX_CART_LINES)
  } catch { return [] }
}

interface CartContextValue {
  items: CartItem[]
  addItem: (variantId: string, quantity?: number) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
}

const CartContext = createContext<CartContextValue>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('jc-cart')
    if (stored) {
      const parsed = parseStoredCart(stored)
      setItems(parsed)
    }
  }, [])

  function persist(next: CartItem[]) {
    setItems(next)
    localStorage.setItem('jc-cart', JSON.stringify(next))
  }

  function addItem(variantId: string, quantity = 1) {
    if (!UUID_RE.test(variantId) || quantity < 1) return
    setItems(prev => {
      const existing = prev.find(i => i.variantId === variantId)
      let next: CartItem[]
      if (existing) {
        next = prev.map(i =>
          i.variantId === variantId
            ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_QUANTITY) }
            : i
        )
      } else {
        if (prev.length >= MAX_CART_LINES) return prev
        next = [...prev, { variantId, quantity: Math.min(quantity, MAX_QUANTITY) }]
      }
      localStorage.setItem('jc-cart', JSON.stringify(next))
      return next
    })
  }

  function removeItem(variantId: string) {
    persist(items.filter(i => i.variantId !== variantId))
  }

  function updateQuantity(variantId: string, quantity: number) {
    if (quantity <= 0) { removeItem(variantId); return }
    const clamped = Math.min(Math.max(1, quantity), MAX_QUANTITY)
    persist(items.map(i => i.variantId === variantId ? { ...i, quantity: clamped } : i))
  }

  function clearCart() { persist([]) }

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems: items.reduce((s, i) => s + i.quantity, 0),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
