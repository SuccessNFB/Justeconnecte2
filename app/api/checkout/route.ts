import { NextRequest, NextResponse } from 'next/server'
import { buildPaymentForm, generateReference } from '@/lib/monetico'
import { createServiceClient } from '@/lib/supabase'
import { resolveLineItems, type RequestedItem } from '@/lib/pricing'
import { isDuplicateOrder } from '@/lib/anti-spam'

interface CustomerInfo {
  prenom:    string
  nom:       string
  email:     string
  telephone: string
  adresse?:  string
}

// Ville/code postal par défaut par zone de livraison — utilisés pour compléter
// l'adresse de facturation envoyée à Monetico (3DS v2) quand le client n'a
// saisi qu'une ligne d'adresse libre, sans ville ni code postal séparés.
const ZONE_BILLING_DEFAULTS: Record<string, { city: string; postalCode: string }> = {
  martinique: { city: 'Fort-de-France', postalCode: '97200' },
  guadeloupe: { city: 'Pointe-à-Pitre',  postalCode: '97110' },
  guyane:     { city: 'Cayenne',        postalCode: '97300' },
}

export async function POST(req: NextRequest) {
  if (!process.env.MONETICO_TPE || !process.env.MONETICO_KEY || !process.env.MONETICO_URL) {
    return NextResponse.json({ error: 'Paiement non configuré.' }, { status: 500 })
  }

  let items:         RequestedItem[]
  let zone:          string | undefined
  let pricingZoneId: string
  let customer:      CustomerInfo | undefined

  try {
    const body    = await req.json()
    items         = body.items
    zone          = body.zone
    pricingZoneId = body.pricingZoneId
    customer      = body.customer
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const resolved = await resolveLineItems(supabase, items, pricingZoneId)
  if (!resolved) {
    return NextResponse.json({ error: 'Panier invalide ou produits indisponibles.' }, { status: 400 })
  }

  const origin     = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin
  const totalCents = resolved.reduce((s, i) => s + i.price * i.quantity, 0)
  const totalEur   = (totalCents / 100).toFixed(2)

  if (await isDuplicateOrder(supabase, customer?.email, totalEur)) {
    return NextResponse.json({ error: 'Une commande identique est déjà en cours. Merci de patienter une minute.' }, { status: 429 })
  }

  const reference  = generateReference()
  const description = resolved.map(i => `${i.quantity}x ${i.name}`).join(', ')

  const zoneDefaults = ZONE_BILLING_DEFAULTS[zone ?? ''] ?? ZONE_BILLING_DEFAULTS.martinique
  const billingAddress = customer?.adresse
    ? { addressLine1: customer.adresse, ...zoneDefaults, country: 'FR' }
    : undefined

  const form = buildPaymentForm({
    amountCents: totalCents,
    reference,
    description,
    zone,
    email:      customer?.email,
    successUrl: `${origin}/merci`,
    cancelUrl:  `${origin}/panier`,
    billingAddress,
  })

  // Save order to Supabase (best-effort — never blocks payment)
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    await supabase.from('orders').insert({
      reference,
      status:             'pending',
      customer_prenom:    customer?.prenom    ?? '',
      customer_nom:       customer?.nom       ?? '',
      customer_email:     customer?.email     ?? '',
      customer_telephone: customer?.telephone ?? '',
      customer_adresse:   customer?.adresse   ?? '',
      delivery_zone:      zone ?? '',
      items:              resolved,
      total_eur:          totalEur,
    }).then(({ error }) => {
      if (error) console.error('[checkout] order save error:', error.message)
    })
  }

  return NextResponse.json({ ...form, reference })
}
