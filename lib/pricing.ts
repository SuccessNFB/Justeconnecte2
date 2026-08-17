import type { SupabaseClient } from '@supabase/supabase-js'

export interface RequestedItem {
  variantId: string
  quantity:  number
}

export interface ResolvedItem {
  variantId:  string
  name:       string
  price:      number   // cents EUR — dérivé du prix en base, jamais du client
  quantity:   number
  image?:     string
  color_name: string
  color_hex:  string
  storage:    string
}

/**
 * Recalcule le prix de chaque ligne à partir de la base (jamais du prix envoyé
 * par le client) pour empêcher toute manipulation du montant payé.
 * Retourne null si un article est invalide, inactif, ou sans prix pour la zone.
 */
export async function resolveLineItems(
  supabase: SupabaseClient,
  requested: unknown,
  pricingZoneId: unknown
): Promise<ResolvedItem[] | null> {
  if (!Array.isArray(requested) || !requested.length) return null
  if (typeof pricingZoneId !== 'string' || !pricingZoneId) return null

  const ids = requested.map(i => i?.variantId).filter((id): id is string => typeof id === 'string')
  if (ids.length !== requested.length) return null

  const { data, error } = await supabase
    .from('product_variants')
    .select('*, products(*), product_zone_prices(*)')
    .in('id', ids)
    .eq('is_active', true)

  if (error || !data) return null

  const byId = new Map(data.map((v: any) => [v.id, v]))
  const resolved: ResolvedItem[] = []

  for (const req of requested as RequestedItem[]) {
    const quantity = Math.floor(Number(req.quantity))
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > 20) return null

    const variant = byId.get(req.variantId)
    if (!variant) return null

    const zonePrice = (variant.product_zone_prices ?? []).find((p: any) => p.zone_id === pricingZoneId)
    if (!zonePrice) return null

    resolved.push({
      variantId:  variant.id,
      name:       `${variant.products?.name ?? 'Produit'} · ${variant.color_name} · ${variant.storage}`,
      price:      Math.round(Number(zonePrice.price) * 100),
      quantity,
      image:      (variant.images ?? [])[0] ?? variant.products?.image_url ?? undefined,
      color_name: variant.color_name,
      color_hex:  variant.color_hex,
      storage:    variant.storage,
    })
  }

  return resolved
}
