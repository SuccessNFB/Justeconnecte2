import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import ProductCard from '@/components/ProductCard'
import type { Brand, Product, ProductVariant, ProductZonePrice } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Boutique',
  description: 'Tous nos smartphones reconditionnés disponibles aux Antilles et en Guyane.',
}

const STORAGES = ['64 GB', '128 GB', '256 GB', '512 GB']

interface SearchParams { marque?: string; stockage?: string; tri?: string }

async function getData(params: SearchParams) {
  const supabase = createClient()
  const [brandsRes, productsRes] = await Promise.all([
    supabase.from('brands').select('*').order('sort_order'),
    supabase
      .from('products')
      .select(`*, brands(*), product_variants(*, product_zone_prices(*))`)
      .eq('is_active', true)
      .order('created_at', { ascending: false }),
  ])

  let products = (productsRes.data ?? []) as (Product & {
    brands: Brand
    product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[]
  })[]

  if (params.marque) {
    products = products.filter(p => p.brands?.slug === params.marque)
  }
  if (params.stockage) {
    products = products.filter(p =>
      p.product_variants?.some(v => v.storage === params.stockage)
    )
  }
  if (params.tri === 'new') products = products.filter(p => p.is_new)
  if (params.tri === 'bestseller') products = products.filter(p => p.is_bestseller)

  return { brands: (brandsRes.data ?? []) as Brand[], products }
}

export default async function BoutiquePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { brands, products } = await getData(searchParams)

  return (
    <div className="py-12">
      <div className="jc-container">
        <h1 className="text-4xl font-bold mb-2">Boutique</h1>
        <p className="mb-10" style={{ color: 'oklch(0.18 0.004 264 / 0.5)' }}>
          {products.length} smartphone{products.length !== 1 ? 's' : ''} reconditionné{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
        </p>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* ── FILTRES ── */}
          <aside className="lg:w-52 shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--gold-deep)' }}>Marque</p>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  <FilterChip href="/boutique" active={!searchParams.marque}>Toutes</FilterChip>
                  {brands.map(b => (
                    <FilterChip key={b.id} href={`/boutique?marque=${b.slug}`} active={searchParams.marque === b.slug}>
                      {b.name}
                    </FilterChip>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--gold-deep)' }}>Stockage</p>
                <div className="flex flex-wrap lg:flex-col gap-2">
                  <FilterChip href={searchParams.marque ? `/boutique?marque=${searchParams.marque}` : '/boutique'} active={!searchParams.stockage}>
                    Tous
                  </FilterChip>
                  {STORAGES.map(s => (
                    <FilterChip
                      key={s}
                      href={`/boutique?${searchParams.marque ? `marque=${searchParams.marque}&` : ''}stockage=${encodeURIComponent(s)}`}
                      active={searchParams.stockage === s}
                    >
                      {s}
                    </FilterChip>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── GRILLE ── */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-24" style={{ color: 'oklch(0.18 0.004 264 / 0.4)' }}>
                <p className="text-4xl mb-4">📱</p>
                <p className="font-medium">Aucun produit trouvé avec ces filtres.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
      style={{
        background: active ? 'var(--primary)' : 'var(--surface)',
        color: active ? '#fff' : 'inherit',
        border: '1px solid ' + (active ? 'var(--primary)' : 'var(--border)'),
      }}
    >
      {children}
    </a>
  )
}
