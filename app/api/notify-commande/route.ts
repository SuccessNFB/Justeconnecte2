import { NextRequest, NextResponse } from 'next/server'

const ZONE_LABEL: Record<string, string> = {
  martinique: 'Martinique',
  guadeloupe: 'Guadeloupe',
  guyane:     'Guyane',
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return NextResponse.json({ ok: false, reason: 'no_key' })

  try {
    const { customer, deliveryZone, items, total } = await req.json() as {
      customer: { nom: string; prenom: string; email: string; telephone: string; adresse?: string }
      deliveryZone: string
      items: { name: string; price: number; quantity: number }[]
      total: number
    }

    const to      = process.env.NOTIFY_EMAIL ?? 'Contact@justeconnecte.fr'
    const from    = process.env.RESEND_FROM  ?? 'Juste Connecté <onboarding@resend.dev>'
    const zoneStr = ZONE_LABEL[deliveryZone ?? ''] ?? deliveryZone ?? 'Non renseignée'
    const now     = new Date().toLocaleString('fr-FR', { timeZone: 'America/Martinique' })

    const productRows = (items ?? []).map(item => `
      <tr>
        <td style="padding:10px 16px;border-top:1px solid #ece8df;font-size:13px;color:#1a1a1a">${item.name}</td>
        <td style="padding:10px 16px;border-top:1px solid #ece8df;font-size:13px;text-align:center;color:#555">×${item.quantity}</td>
        <td style="padding:10px 16px;border-top:1px solid #ece8df;font-size:13px;text-align:right;font-weight:700;color:#1a1a1a">${((item.price * item.quantity) / 100).toFixed(2)} €</td>
      </tr>
    `).join('')

    const adresseRow = customer.adresse ? `
      <tr>
        <td style="padding:10px 16px;font-size:12px;color:#888;font-weight:600;border-top:1px solid #ece8df">Adresse</td>
        <td style="padding:10px 16px;font-size:13px;color:#1a1a1a;border-top:1px solid #ece8df">${customer.adresse}</td>
      </tr>` : ''

    const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f7f3ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

        <tr>
          <td style="background:linear-gradient(135deg,#c4922a,#a87820);padding:28px 32px">
            <p style="margin:0;color:rgba(255,255,255,0.7);font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase">Juste Connecté</p>
            <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700">📦 Nouvelle commande</h1>
          </td>
        </tr>

        <tr><td style="padding:32px">

          <h2 style="margin:0 0 10px;font-size:13px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:1px">Client</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #ece8df;margin-bottom:24px">
            <tr style="background:#faf7f2">
              <td style="padding:10px 16px;font-size:12px;color:#888;font-weight:600;width:38%">Nom</td>
              <td style="padding:10px 16px;font-size:13px;font-weight:700;color:#1a1a1a">${customer.prenom} ${customer.nom}</td>
            </tr>
            <tr>
              <td style="padding:10px 16px;font-size:12px;color:#888;font-weight:600;border-top:1px solid #ece8df">Email</td>
              <td style="padding:10px 16px;font-size:13px;border-top:1px solid #ece8df"><a href="mailto:${customer.email}" style="color:#c4922a;text-decoration:none">${customer.email}</a></td>
            </tr>
            <tr style="background:#faf7f2">
              <td style="padding:10px 16px;font-size:12px;color:#888;font-weight:600;border-top:1px solid #ece8df">Téléphone</td>
              <td style="padding:10px 16px;font-size:13px;color:#1a1a1a;border-top:1px solid #ece8df">${customer.telephone}</td>
            </tr>
            ${adresseRow}
            <tr>
              <td style="padding:10px 16px;font-size:12px;color:#888;font-weight:600;border-top:1px solid #ece8df">Zone livraison</td>
              <td style="padding:10px 16px;font-size:13px;font-weight:700;color:#c4922a;border-top:1px solid #ece8df">${zoneStr}</td>
            </tr>
          </table>

          <h2 style="margin:0 0 10px;font-size:13px;font-weight:700;color:#aaa;text-transform:uppercase;letter-spacing:1px">Articles</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #ece8df;margin-bottom:24px">
            <tr style="background:#faf7f2">
              <td style="padding:10px 16px;font-size:12px;color:#888;font-weight:600">Produit</td>
              <td style="padding:10px 16px;font-size:12px;color:#888;font-weight:600;text-align:center">Qté</td>
              <td style="padding:10px 16px;font-size:12px;color:#888;font-weight:600;text-align:right">Prix</td>
            </tr>
            ${productRows}
            <tr style="background:#faf7f2">
              <td colspan="2" style="padding:12px 16px;font-size:14px;font-weight:700;border-top:2px solid #ece8df;color:#1a1a1a">Total</td>
              <td style="padding:12px 16px;font-size:16px;font-weight:800;text-align:right;color:#c4922a;border-top:2px solid #ece8df">${(total ?? 0).toFixed(2)} €</td>
            </tr>
          </table>

          <p style="margin:0 0 4px;font-size:12px;color:#bbb">Le client va procéder au paiement via CM-CIC Paiement.</p>
          <p style="margin:0;font-size:12px;color:#bbb">${now}</p>

          <div style="text-align:center;margin-top:24px">
            <a href="https://justeconnecte.fr/admin/analytiques"
              style="display:inline-block;background:#c4922a;color:#fff;font-size:13px;font-weight:700;padding:12px 28px;border-radius:50px;text-decoration:none">
              Voir le dashboard →
            </a>
          </div>

        </td></tr>

        <tr>
          <td style="padding:20px 32px;background:#faf7f2;border-top:1px solid #ece8df">
            <p style="margin:0;font-size:11px;color:#bbb;text-align:center">Juste Connecté · Smartphones reconditionnés Antilles &amp; Guyane</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ from, to: [to], subject: `📦 Commande — ${customer.prenom} ${customer.nom} · ${zoneStr}`, html }),
    })

    if (!res.ok) {
      const txt = await res.text()
      console.error('[notify-commande] Resend error:', txt)
    }

    return NextResponse.json({ ok: res.ok })
  } catch (err) {
    console.error('[notify-commande]', err)
    return NextResponse.json({ ok: false })
  }
}
