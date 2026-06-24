import { NextRequest, NextResponse } from 'next/server'

// Required env vars (set in Vercel → Settings → Environment Variables):
//   RESEND_API_KEY  — your key from resend.com (free tier: 3 000 emails/mois)
//   NOTIFY_EMAIL    — adresse qui reçoit les alertes (défaut: Contact@justeconnecte.fr)
//   RESEND_FROM     — expéditeur vérifié sur Resend (défaut: onboarding@resend.dev)

const ZONE_LABEL: Record<string, string> = {
  'martinique-guadeloupe': 'Martinique / Guadeloupe',
  'guyane': 'Guyane',
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return NextResponse.json({ ok: false, reason: 'no_key' })

  try {
    const { zone, items } = (await req.json()) as { zone?: string; items?: number }

    const to       = process.env.NOTIFY_EMAIL ?? 'Contact@justeconnecte.fr'
    const from     = process.env.RESEND_FROM  ?? 'Juste Connecté <onboarding@resend.dev>'
    const zoneStr  = ZONE_LABEL[zone ?? ''] ?? 'Zone non renseignée'
    const now      = new Date().toLocaleString('fr-FR', { timeZone: 'America/Martinique' })

    const res = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `🛒 Nouveau checkout — ${zoneStr}`,
        html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f7f3ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px">
    <tr><td align="center">
      <table width="540" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#c4922a,#a87820);padding:28px 32px">
            <p style="margin:0;color:rgba(255,255,255,0.7);font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase">Juste Connecté</p>
            <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:700">🛒 Nouveau checkout</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px">
            <p style="margin:0 0 24px;font-size:15px;color:#555">Un client vient de passer à l'étape panier.</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:10px;overflow:hidden;border:1px solid #ece8df">
              <tr style="background:#faf7f2">
                <td style="padding:12px 16px;font-size:12px;color:#888;font-weight:600">Zone</td>
                <td style="padding:12px 16px;font-size:13px;font-weight:700;text-align:right;color:#1a1a1a">${zoneStr}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:12px;color:#888;font-weight:600;border-top:1px solid #ece8df">Articles</td>
                <td style="padding:12px 16px;font-size:13px;font-weight:700;text-align:right;color:#1a1a1a;border-top:1px solid #ece8df">${items ?? '—'}</td>
              </tr>
              <tr style="background:#faf7f2">
                <td style="padding:12px 16px;font-size:12px;color:#888;font-weight:600;border-top:1px solid #ece8df">Heure (Antilles)</td>
                <td style="padding:12px 16px;font-size:13px;font-weight:700;text-align:right;color:#1a1a1a;border-top:1px solid #ece8df">${now}</td>
              </tr>
            </table>

            <div style="margin-top:28px;text-align:center">
              <a href="https://justeconnecte2.vercel.app/admin/analytiques"
                style="display:inline-block;background:#c4922a;color:#fff;font-size:13px;font-weight:700;padding:12px 28px;border-radius:50px;text-decoration:none">
                Voir le dashboard →
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;background:#faf7f2;border-top:1px solid #ece8df">
            <p style="margin:0;font-size:11px;color:#bbb;text-align:center">Juste Connecté · Smartphones reconditionnés Antilles &amp; Guyane</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
      }),
    })

    if (!res.ok) {
      const txt = await res.text()
      console.error('[notify-sale] Resend error:', txt)
    }

    return NextResponse.json({ ok: res.ok })
  } catch (err) {
    console.error('[notify-sale]', err)
    return NextResponse.json({ ok: false })
  }
}
