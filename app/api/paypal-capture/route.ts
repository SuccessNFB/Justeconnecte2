import { NextRequest, NextResponse } from 'next/server'
import { captureOrder } from '@/lib/paypal'
import { createServiceClient } from '@/lib/supabase'

// PayPal redirige ici (GET) après approbation du client sur son site.
export async function GET(req: NextRequest) {
  const origin    = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin
  const paypalId  = req.nextUrl.searchParams.get('token')       // id de commande PayPal
  const reference = req.nextUrl.searchParams.get('reference')

  if (!paypalId || !reference) {
    return NextResponse.redirect(`${origin}/panier`)
  }

  try {
    const capture = await captureOrder(paypalId)

    if (capture.ok && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createServiceClient()
      const { data: order } = await supabase
        .from('orders')
        .select('delivery_zone, total_eur, status')
        .eq('reference', reference)
        .maybeSingle()

      // Idempotent : si déjà marquée payée (ex. rechargement de la page retour), ne rien refaire
      if (order && order.status !== 'paid') {
        await supabase
          .from('orders')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .eq('reference', reference)
          .then(({ error }) => {
            if (error) console.error('[paypal-capture] order update error:', error.message)
          })

        await fetch(`${origin}/api/notify-sale`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            zone:      order.delivery_zone,
            items:     1,
            amount:    Number(order.total_eur),
            reference,
          }),
        }).catch(() => {})
      }

      return NextResponse.redirect(`${origin}/merci`)
    }

    console.error('[paypal-capture] capture non complétée', { reference, status: capture.status })
    return NextResponse.redirect(`${origin}/panier`)
  } catch (err) {
    console.error('[paypal-capture]', err)
    return NextResponse.redirect(`${origin}/panier`)
  }
}
