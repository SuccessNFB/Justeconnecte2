import { NextRequest, NextResponse } from 'next/server'
import { buildPaymentForm, generateReference } from '@/lib/monetico'
import { createServiceClient } from '@/lib/supabase'

interface LineItem {
  name:     string
  price:    number   // cents EUR
  quantity: number
  image?:   string
}

interface CustomerInfo {
  prenom:    string
  nom:       string
  email:     string
  telephone: string
  adresse?:  string
}

export async function POST(req: NextRequest) {
  if (!process.env.MONETICO_TPE || !process.env.MONETICO_KEY || !process.env.MONETICO_URL) {
    return NextResponse.json({ error: 'Paiement non configuré.' }, { status: 500 })
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
  const description = items.map(i => `${i.quantity}x ${i.name}`).join(', ')

  const form = buildPaymentForm({
    amountCents: totalCents,
    reference,
    description,
    zone,
    email:      customer?.email,
    successUrl: `${origin}/merci`,
    cancelUrl:  `${origin}/panier`,
  })

  // Save order to Supabase (best-effort — never blocks payment)
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createServiceClient()
    await supabase.from('orders').insert({
      reference,
      status:             'pending',
      customer_prenom:    customer?.prenom    ?? '',
      customer_nom:       customer?.nom       ?? '',
      customer_email:     customer?.email     ?? '',
      customer_telephone: customer?.telephone ?? '',
      customer_adresse:   customer?.adresse   ?? '',
      delivery_zone:      zone ?? '',
      items,
      total_eur:          (totalCents / 100).toFixed(2),
    }).then(({ error }) => {
      if (error) console.error('[checkout] order save error:', error.message)
    })
  }

  return NextResponse.json({ ...form, reference })
}
