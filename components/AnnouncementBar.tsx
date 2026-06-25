'use client'
import { useState, useEffect } from 'react'
import { Truck, Shield, CreditCard } from 'lucide-react'

const MESSAGES = [
  { icon: Truck,       text: 'Livraison gratuite · Taxes et octroi de mer inclus' },
  { icon: Shield,      text: 'Garantie constructeur incluse sur tous les appareils' },
  { icon: CreditCard,  text: 'Paiement en 4× sans frais avec Scalapay — sans condition de montant minimum' },
]

export default function AnnouncementBar() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % MESSAGES.length)
        setVisible(true)
      }, 300)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  const { icon: Icon, text } = MESSAGES[idx]

  return (
    <div
      className="w-full py-2"
      style={{ background: 'var(--primary)', color: 'white' }}
    >
      <div
        className="flex items-center justify-center gap-2 text-xs font-medium"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-4px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        <Icon size={12} strokeWidth={2} aria-hidden="true" />
        <span>{text}</span>
      </div>
    </div>
  )
}
