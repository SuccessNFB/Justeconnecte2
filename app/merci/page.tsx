'use client'
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { trackEvent } from '@/lib/analytics'

function TrackPurchase() {
  const params = useSearchParams()

  useEffect(() => {
    // Récupère ref + montant stockés au moment du checkout
    let ref:    string | null = null
    let amount: number        = 0
    try {
      ref    = sessionStorage.getItem('jc_ref')
      amount = parseFloat(sessionStorage.getItem('jc_amount') ?? '0') || 0
      if (ref) { sessionStorage.removeItem('jc_ref'); sessionStorage.removeItem('jc_amount') }
    } catch {}

    if (!ref) return

    trackEvent('purchase', {
      metadata: { reference: ref, amount, currency: 'EUR' },
    })

    // Meta Pixel — Purchase
    if (typeof window !== 'undefined' && (window as any).fbq) {
      ;(window as any).fbq('track', 'Purchase', { value: amount, currency: 'EUR' })
    }

    // Google Tag — conversion
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      ;(window as any).gtag('event', 'purchase', {
        transaction_id: ref,
        value:          amount,
        currency:       'EUR',
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default function MerciPage() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="py-32 text-center">
      <Suspense>
        <TrackPurchase />
      </Suspense>

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
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  )
}
