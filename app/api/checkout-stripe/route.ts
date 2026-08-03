import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase'

interface LineItem {
  name:     string
  price:    number   // cents EUR
  quantity: number
}

interface CustomerInfo {
  prenom:    string
  nom:       string
  email:     string
  telephone: string
  adresse?:  string
}

function generateReference(): string {
  return Date.now().toString(36).toUpperCase().slice(-12)
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Paiement en plusieurs fois non configuré.' }, { status: 500 })
  }

  let items:    LineItem[]
  let zone:     string | undefined
  let customer: CustomerInfo | undefined

  try {
    const body = await req.json()
    items    = body.items
    zone     = body.zone
    customer = body.customer
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  if (!Array.isArray(items) || !items.length) {
    return NextResponse.json({ error: 'Panier vide.' }, { status: 400 })
  }

  const origin     = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin
  const totalCents = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const reference  = generateReference()

  try {
    const stripe  = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      // Pas de payment_method_types fixe : Stripe affiche dynamiquement toutes
      // les méthodes activées sur le compte (Scalapay, carte, etc.) au client.
      line_items: items.map(i => ({
        price_data: {
          currency:    'eur',
          unit_amount: i.price,
          product_data: { name: i.name },
        },
        quantity: i.quantity,
      })),
      client_reference_id: reference,
      metadata:             { reference, zone: zone ?? '' },
      customer_email:       customer?.email,
      success_url:          `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:           `${origin}/panier`,
    })

    // Save order to Supabase (best-effort — never blocks payment)
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createServiceClient()
      await supabase.from('orders').insert({
        reference,
        status:             'pending',
        payment_method:     'scalapay',
        customer_prenom:    customer?.prenom    ?? '',
        customer_nom:       customer?.nom       ?? '',
        customer_email:     customer?.email     ?? '',
        customer_telephone: customer?.telephone ?? '',
        customer_adresse:   customer?.adresse   ?? '',
        delivery_zone:      zone ?? '',
        items,
        total_eur:          (totalCents / 100).toFixed(2),
      }).then(({ error }) => {
        if (error) console.error('[checkout-stripe] order save error:', error.message)
      })
    }

    return NextResponse.json({ url: session.url, reference })
  } catch (err: any) {
    console.error('[checkout-stripe]', err.message)
    return NextResponse.json({ error: 'Paiement impossible pour le moment.' }, { status: 500 })
  }
}
