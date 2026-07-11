import { NextRequest, NextResponse } from 'next/server'
import { buildPaymentForm, generateReference } from '@/lib/monetico'

interface LineItem {
  name:      string
  price:     number   // cents EUR
  quantity:  number
  image?:    string
}

export async function POST(req: NextRequest) {
  if (!process.env.MONETICO_TPE || !process.env.MONETICO_KEY || !process.env.MONETICO_URL) {
    return NextResponse.json({ error: 'Paiement non configuré.' }, { status: 500 })
  }

  let items: LineItem[]
  let zone:  string | undefined
  let email: string | undefined

  try {
    const body = await req.json()
    items = body.items
    zone  = body.zone
    email = body.email
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  if (!Array.isArray(items) || !items.length) {
    return NextResponse.json({ error: 'Panier vide.' }, { status: 400 })
  }

  const origin      = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin
  const totalCents  = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const reference   = generateReference()
  const description = items.map(i => `${i.quantity}x ${i.name}`).join(', ')

  const form = buildPaymentForm({
    amountCents: totalCents,
    reference,
    description,
    zone,
    email,
    successUrl: `${origin}/merci`,
    cancelUrl:  `${origin}/panier`,
  })

  return NextResponse.json({ ...form, reference })
}
