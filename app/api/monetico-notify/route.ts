import { NextRequest, NextResponse } from 'next/server'
import { verifyNotifyMac } from '@/lib/monetico'

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

    console.log('[monetico-notify] reçu', {
      tpe: params['TPE'],
      codeRetour,
      macValid,
      fields: Object.keys(params).sort(),
    })

    if (macValid && isPaid) {
      const montantStr  = params['montant'] ?? ''
      const amountEur   = parseFloat(montantStr.replace(/[^0-9.]/g, '')) || 0
      const texteLibre  = params['texte-libre'] ?? ''
      const zoneMatch   = texteLibre.match(/^zone:([^|]+)\|/)
      const zone        = zoneMatch?.[1] ?? undefined
      const reference   = params['reference'] ?? ''

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://justeconnecte.fr'
      await fetch(`${siteUrl}/api/notify-sale`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ zone, items: 1, amount: amountEur, reference }),
      }).catch(() => {})
    }

    // Toujours cdr=0 : on accuse réception quelle que soit la validité du MAC.
    // Si le MAC est invalide, on logue mais on ne bloque pas — évite "accusé de réception invalide".
    return ack(true)
  } catch (err) {
    console.error('[monetico-notify]', err)
    return ack(true)
  }
}
