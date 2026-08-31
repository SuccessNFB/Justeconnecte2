import { createClient } from '@/lib/supabase-server'
import type { Brand, Product, ProductVariant, ProductZonePrice, Zone } from '@/lib/types'

export const revalidate = 3600

const SITE_URL = 'https://www.justeconnecte.fr'

type VariantRow = ProductVariant & { product_zone_prices: ProductZonePrice[] }
type ProductRow = Product & { brands: Brand; product_variants: VariantRow[] }

function esc(str: string | null | undefined): string {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatPrice(amount: number): string {
  return `${amount.toFixed(2)} EUR`
}

export async function GET() {
  const supabase = await createClient()

  const [productsRes, zonesRes] = await Promise.all([
    supabase
      .from('products')
      .select('*, brands(*), product_variants(*, product_zone_prices(*))')
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
    supabase.from('zones').select('*').order('sort_order'),
  ])

  const products = (productsRes.data ?? []) as ProductRow[]
  const zones    = (zonesRes.data ?? []) as Zone[]

  // Default zone: martinique-guadeloupe (first by sort_order)
  const defaultZone = zones.find(z => z.name === 'martinique-guadeloupe') ?? zones[0]

  const items: string[] = []

  for (const product of products) {
    const variants = (product.product_variants ?? []).filter(v => v.is_active)
    const productImage = product.images?.[0] ?? product.image_url ?? null

    for (const variant of variants) {
      const zonePrice = defaultZone
        ? variant.product_zone_prices?.find(p => p.zone_id === defaultZone.id)
        : variant.product_zone_prices?.[0]

      if (!zonePrice) continue

      const variantImage = variant.images?.[0] ?? productImage
      if (!variantImage) continue

      const title = `${esc(product.name)} ${esc(variant.color_name)} ${esc(variant.storage)}`
      const link  = `${SITE_URL}/boutique/${product.slug}`
      const desc  = esc(product.description ?? product.name)
      const avail = variant.stock > 0 && !variant.out_of_stock ? 'in stock' : 'out of stock'

      const priceStr      = formatPrice(zonePrice.price)
      const salePriceStr  = zonePrice.compare_at_price && zonePrice.compare_at_price > zonePrice.price
        ? formatPrice(zonePrice.price)
        : null
      const regularPrice  = zonePrice.compare_at_price && zonePrice.compare_at_price > zonePrice.price
        ? formatPrice(zonePrice.compare_at_price)
        : priceStr

      items.push(`    <item>
      <g:id>${esc(variant.sku)}</g:id>
      <g:item_group_id>${esc(product.id)}</g:item_group_id>
      <g:title>${title}</g:title>
      <g:description>${desc}</g:description>
      <g:link>${link}</g:link>
      <g:image_link>${esc(variantImage)}</g:image_link>
      <g:availability>${avail}</g:availability>
      <g:price>${regularPrice}</g:price>${salePriceStr ? `\n      <g:sale_price>${salePriceStr}</g:sale_price>` : ''}
      <g:brand>${esc(product.brands?.name)}</g:brand>
      <g:condition>new</g:condition>
      <g:google_product_category>267</g:google_product_category>
      <g:identifier_exists>no</g:identifier_exists>
      <g:color>${esc(variant.color_name)}</g:color>
      <g:storage_capacity>${esc(variant.storage)}</g:storage_capacity>
      <g:shipping>
        <g:country>GP</g:country>
        <g:price>0.00 EUR</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>MQ</g:country>
        <g:price>0.00 EUR</g:price>
      </g:shipping>
      <g:shipping>
        <g:country>GF</g:country>
        <g:price>0.00 EUR</g:price>
      </g:shipping>
    </item>`)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Juste Connecté</title>
    <link>${SITE_URL}</link>
    <description>Smartphones neufs — Guadeloupe, Martinique, Guyane</description>
${items.join('\n')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
