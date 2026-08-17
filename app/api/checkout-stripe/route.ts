import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase'
import { resolveLineItems, type RequestedItem } from '@/lib/pricing'
import { isDuplicateOrder } from '@/lib/anti-spam'

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

  let items:         RequestedItem[]
  let zone:          string | undefined
  let pricingZoneId: string
  let customer:      CustomerInfo | undefined

  try {
    const body    = await req.json()
    items         = body.items
    zone          = body.zone
    pricingZoneId = body.pricingZoneId
    customer      = body.customer
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const resolved = await resolveLineItems(supabase, items, pricingZoneId)
  if (!resolved) {
    return NextResponse.json({ error: 'Panier invalide ou produits indisponibles.' }, { status: 400 })
  }

  const origin     = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin
  const totalCents = resolved.reduce((s, i) => s + i.price * i.quantity, 0)
  const totalEur   = (totalCents / 100).toFixed(2)

  if (await isDuplicateOrder(supabase, customer?.email, totalEur)) {
    return NextResponse.json({ error: 'Une commande identique est déjà en cours. Merci de patienter une minute.' }, { status: 429 })
  }

  const reference  = generateReference()

  try {
    const stripe  = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      // Pas de payment_method_types fixe : Stripe affiche dynamiquement toutes
      // les méthodes activées sur le compte (Scalapay, carte, etc.) au client.
      line_items: resolved.map(i => ({
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
        items:              resolved,
        total_eur:          totalEur,
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
