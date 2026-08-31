const PAYPAL_API_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const secret   = process.env.PAYPAL_CLIENT_SECRET
  if (!clientId || !secret) throw new Error('PAYPAL_CLIENT_ID / PAYPAL_CLIENT_SECRET manquants')

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64')
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method:  'POST',
    headers: {
      Authorization:  `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  if (!res.ok) throw new Error(`PayPal auth failed: ${await res.text()}`)
  const data = await res.json()
  return data.access_token as string
}

export async function createOrder(opts: {
  amountEur:   string
  reference:   string
  description: string
  returnUrl:   string
  cancelUrl:   string
}): Promise<{ id: string; approveUrl: string }> {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: opts.reference,
        description:  opts.description.slice(0, 127),
        amount:       { currency_code: 'EUR', value: opts.amountEur },
      }],
      payment_source: {
        paypal: {
          experience_context: {
            return_url:   opts.returnUrl,
            cancel_url:   opts.cancelUrl,
            user_action:  'PAY_NOW',
            landing_page: 'GUEST_CHECKOUT',
          },
        },
      },
    }),
  })
  if (!res.ok) throw new Error(`PayPal order create failed: ${await res.text()}`)
  const data = await res.json()
  const approveUrl = (data.links ?? []).find((l: any) => l.rel === 'approve')?.href
  if (!approveUrl) throw new Error('PayPal: no approve link returned')
  return { id: data.id, approveUrl }
}

export async function captureOrder(orderId: string): Promise<{ ok: boolean; status?: string; raw: any }> {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return { ok: res.ok && data.status === 'COMPLETED', status: data.status, raw: data }
}
