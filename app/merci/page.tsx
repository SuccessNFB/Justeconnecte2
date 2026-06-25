'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function MerciPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="py-32 text-center">
      <div className="mb-6 flex justify-center">
        <CheckCircle size={56} style={{ color: 'var(--success)' }} />
      </div>

      <h1 className="text-3xl font-bold mb-3">Commande confirmée !</h1>
      <p className="text-base mb-1" style={{ opacity: 0.5 }}>Merci pour votre confiance.</p>
      <p className="text-sm mb-10" style={{ opacity: 0.35 }}>
        Un email de confirmation vous a été envoyé. Livraison sous 8 à 10 jours.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/boutique" className="jc-btn-primary">
          Continuer mes achats
        </Link>
        <Link href="/" className="jc-btn-ghost">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
