import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://qyvhkpyshkvogdcsbzst.supabase.co'

const UPDATES: { slug: string; image_url: string }[] = [
  { slug: 'iphone-17',               image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-1311.jpg?v=1778781337' },
  { slug: 'samsung-galaxy-a37',      image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/B942644E-32EC-40D0-84D7-D5F2CA2EDF3C.png?v=1778857015' },
  { slug: 'samsung-galaxy-a57',      image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/FDFD729A-07D5-4F54-A1A2-303A93AD6D57.png?v=1778856783' },
  { slug: 'xiaomi-15',               image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-1012.webp?v=1776995420' },
  { slug: 'xiaomi-15-t',             image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-1006_9ff53951-5713-4bdd-a193-19bc71eb4991.webp?v=1776994376' },
  { slug: 'xiaomi-15-t-pro',         image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-0985.webp?v=1776926738' },
  { slug: 'samsung-galaxy-s26-plus', image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/2DAB7588-6AC4-4258-BCDD-2D35945E6897.png?v=1776374897' },
  { slug: 'samsung-galaxy-s26',      image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/D0A81291-2779-4095-B2C0-F6D0C68E306C.png?v=1776374778' },
  { slug: 'samsung-galaxy-s26-ultra',image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-0062.png?v=1776374854' },
  { slug: 'xiaomi-redmi-note-14-pro',image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9343.jpg?v=1764266220' },
  { slug: 'iphone-air',              image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9333.jpg?v=1776375373' },
  { slug: 'iphone-16-pro-max',       image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9339.webp?v=1764259834' },
  { slug: 'iphone-17-pro-max',       image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9394.png?v=1776375420' },
  { slug: 'iphone-17-pro',           image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9323.jpg?v=1776375123' },
  { slug: 'samsung-galaxy-z-fold-7', image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9399.png?v=1776375347' },
  { slug: 'samsung-galaxy-s25',      image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-1346.png?v=1778857696' },
  { slug: 'samsung-galaxy-s25-ultra',image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-1345.png?v=1778857593' },
  { slug: 'iphone-16',               image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-8980.jpg?v=1776375284' },
  { slug: 'gopro-hero-13',           image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9362.png?v=1764342366' },
  { slug: 'gopro-hero-13-pack',      image_url: 'https://cdn.shopify.com/s/files/1/0952/4366/5698/files/IMG-9362.png?v=1764342366' },
]

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key')
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 401 })

  const results: { slug: string; ok: boolean; error?: string }[] = []

  for (const { slug, image_url } of UPDATES) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/products?slug=eq.${encodeURIComponent(slug)}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ image_url }),
      }
    )
    results.push({ slug, ok: res.ok, error: res.ok ? undefined : await res.text() })
  }

  const failed = results.filter(r => !r.ok)
  return NextResponse.json({
    total: results.length,
    ok: results.length - failed.length,
    failed,
  })
}
