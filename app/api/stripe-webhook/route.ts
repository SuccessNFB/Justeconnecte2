import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase'

async function markPaid(session: Stripe.Checkout.Session) {
  const reference = session.metadata?.reference ?? session.client_reference_id ?? ''
  if (!reference || !process.env.SUPABASE_SERVICE_ROLE_KEY) return

  const supabase = createServiceClient()
  await supabase
    .from('orders')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('reference', reference)
    .then(({ error }) => {
      if (error) console.error('[stripe-webhook] order update error:', error.message)
    })

  const zone      = session.metadata?.zone || undefined
  const amountEur = (session.amount_total ?? 0) / 100
  const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://justeconnecte.fr'
  await fetch(`${siteUrl}/api/notify-sale`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ zone, items: 1, amount: amountEur, reference }),
  }).catch(() => {})
}

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'no webhook secret' }, { status: 500 })
  }

  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'missing signature' }, { status: 400 })

  const rawBody = await req.text()

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error('[stripe-webhook] signature invalide:', err.message)
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.payment_status === 'paid') await markPaid(session)
    }
  } catch (err) {
    console.error('[stripe-webhook]', err)
  }

  return NextResponse.json({ received: true })
}
