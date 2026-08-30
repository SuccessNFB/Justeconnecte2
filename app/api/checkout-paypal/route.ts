import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/paypal'
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
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return NextResponse.json({ error: 'Paiement non configuré.' }, { status: 500 })
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

  const reference   = generateReference()
  const description = resolved.map(i => `${i.quantity}x ${i.name}`).join(', ')

  try {
    const order = await createOrder({
      amountEur:   totalEur,
      reference,
      description,
      returnUrl:   `${origin}/api/paypal-capture?reference=${reference}`,
      cancelUrl:   `${origin}/panier`,
    })

    // Save order to Supabase (best-effort — never blocks payment)
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      await supabase.from('orders').insert({
        reference,
        status:             'pending',
        payment_method:     'paypal',
        paypal_order_id:    order.id,
        customer_prenom:    customer?.prenom    ?? '',
        customer_nom:       customer?.nom       ?? '',
        customer_email:     customer?.email     ?? '',
        customer_telephone: customer?.telephone ?? '',
        customer_adresse:   customer?.adresse   ?? '',
        delivery_zone:      zone ?? '',
        items:              resolved,
        total_eur:          totalEur,
      }).then(({ error }) => {
        if (error) console.error('[checkout-paypal] order save error:', error.message)
      })
    }

    return NextResponse.json({ url: order.approveUrl, reference })
  } catch (err: any) {
    console.error('[checkout-paypal]', err.message)
    return NextResponse.json({ error: 'Paiement impossible pour le moment.' }, { status: 500 })
  }
}
