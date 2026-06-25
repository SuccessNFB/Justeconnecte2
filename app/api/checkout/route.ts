import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

interface LineItem {
  name: string
  price: number    // cents EUR
  quantity: number
  image?: string
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe non configuré.' }, { status: 500 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  let items: LineItem[]
  let zone: string | undefined

  try {
    const body = await req.json()
    items = body.items
    zone  = body.zone
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  if (!Array.isArray(items) || !items.length) {
    return NextResponse.json({ error: 'Panier vide.' }, { status: 400 })
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: items.map(item => ({
      price_data: {
        currency: 'eur',
        unit_amount: item.price,
        product_data: {
          name: item.name,
          ...(item.image ? { images: [item.image] } : {}),
        },
      },
      quantity: item.quantity,
    })),
    shipping_address_collection: {
      allowed_countries: ['GP', 'MQ', 'GF', 'FR', 'RE', 'PM'],
    },
    custom_text: {
      shipping_address: {
        message: 'Livraison gratuite · Taxe & octroi de mer offerts en Guadeloupe, Martinique et Guyane.',
      },
    },
    success_url: `${origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${origin}/panier`,
    metadata:    { zone: zone ?? '' },
  })

  return NextResponse.json({ url: session.url })
}
