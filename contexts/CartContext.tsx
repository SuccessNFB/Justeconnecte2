'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import type { CartItem } from '@/lib/types'

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
      try { setItems(JSON.parse(stored)) } catch {}
    }
  }, [])

  function persist(next: CartItem[]) {
    setItems(next)
    localStorage.setItem('jc-cart', JSON.stringify(next))
  }

  function addItem(variantId: string, quantity = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.variantId === variantId)
      const next = existing
        ? prev.map(i => i.variantId === variantId ? { ...i, quantity: i.quantity + quantity } : i)
        : [...prev, { variantId, quantity }]
      localStorage.setItem('jc-cart', JSON.stringify(next))
      return next
    })
  }

  function removeItem(variantId: string) {
    persist(items.filter(i => i.variantId !== variantId))
  }

  function updateQuantity(variantId: string, quantity: number) {
    if (quantity <= 0) { removeItem(variantId); return }
    persist(items.map(i => i.variantId === variantId ? { ...i, quantity } : i))
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
