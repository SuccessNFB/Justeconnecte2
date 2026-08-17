import { NextRequest, NextResponse } from 'next/server'
import { verifyNotifyMac, computeNotifyMac } from '@/lib/monetico'
import { createServiceClient } from '@/lib/supabase'

function ack(ok: boolean) {
  return new NextResponse(`version=2\ncdr=${ok ? 0 : 1}`, {
    status:  200,
    headers: { 'Content-Type': 'text/plain' },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const params: Record<string, string> = {}
    new URLSearchParams(body).forEach((v, k) => { params[k] = v })

    const codeRetour = params['code-retour'] ?? ''
    const isPaid     = codeRetour === 'paye' || codeRetour === 'payetest'
    const macValid   = verifyNotifyMac(params)
    const reference  = params['reference'] ?? ''

    console.log('[monetico-notify] reçu', {
      tpe: params['TPE'],
      codeRetour,
      macValid,
      fields: Object.keys(params).sort(),
    })

    const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY ? createServiceClient() : null
    let orderMatched: boolean | null = null

    if (macValid && isPaid) {
      const montantStr  = params['montant'] ?? ''
      const amountEur   = parseFloat(montantStr.replace(/[^0-9.]/g, '')) || 0
      const texteLibre  = params['texte-libre'] ?? ''
      const zoneMatch   = texteLibre.match(/^zone:([^|]+)\|/)
      const zone        = zoneMatch?.[1] ?? undefined

      // Mark order as paid
      if (supabase && reference) {
        const { data: updated, error } = await supabase
          .from('orders')
          .update({ status: 'paid', paid_at: new Date().toISOString() })
          .eq('reference', reference)
          .select('id')
        if (error) console.error('[monetico-notify] order update error:', error.message)
        orderMatched = !error && !!updated && updated.length > 0
      }

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://justeconnecte.fr'
      await fetch(`${siteUrl}/api/notify-sale`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ zone, items: 1, amount: amountEur, reference }),
      }).catch(() => {})
    }

    // Journal de diagnostic temporaire — à retirer une fois le problème confirmé résolu.
    if (supabase) {
      await supabase.from('monetico_notify_log').insert({
        reference,
        tpe:           params['TPE'] ?? null,
        code_retour:   codeRetour,
        mac_received:  params['MAC'] ?? null,
        mac_expected:  computeNotifyMac(params),
        mac_valid:     macValid,
        order_matched: orderMatched,
      }).then(({ error }) => {
        if (error) console.error('[monetico-notify] debug log error:', error.message)
      })
    }

    // Toujours cdr=0 : on accuse réception quelle que soit la validité du MAC.
    // Si le MAC est invalide, on logue mais on ne bloque pas — évite "accusé de réception invalide".
    return ack(true)
  } catch (err) {
    console.error('[monetico-notify]', err)
    return ack(true)
  }
}
