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
  let zone:         string | undefined
  let email:        string | undefined
  let installments: 1 | 2 | 3 | 4 = 1

  try {
    const body = await req.json()
    items = body.items
    zone  = body.zone
    email = body.email
    const raw = Number(body.installments)
    if ([2, 3, 4].includes(raw)) installments = raw as 2 | 3 | 4
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  if (!Array.isArray(items) || !items.length) {
    return NextResponse.json({ error: 'Panier vide.' }, { status: 400 })
  }

  if (installments > 1 && (!process.env.MONETICO_TPE_FRACTIONNE || !process.env.MONETICO_KEY_FRACTIONNE)) {
    return NextResponse.json({ error: 'Paiement fractionné non configuré.' }, { status: 500 })
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
    installments,
    successUrl: `${origin}/merci`,
    cancelUrl:  `${origin}/panier`,
  })

  return NextResponse.json({ ...form, reference })
}
