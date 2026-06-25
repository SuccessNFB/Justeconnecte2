import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  if (!sessionId) return NextResponse.json({ error: 'missing session_id' }, { status: 400 })
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: 'no stripe key' }, { status: 500 })

  try {
    const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] })

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'not paid' }, { status: 402 })
    }

    return NextResponse.json({
      amount:    (session.amount_total ?? 0) / 100,   // euros
      currency:  session.currency ?? 'eur',
      items:     session.line_items?.data.reduce((s, i) => s + (i.quantity ?? 0), 0) ?? 0,
      zone:      session.metadata?.zone ?? null,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
