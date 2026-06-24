import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import ProductCard from '@/components/ProductCard'
import ScrollReveal from '@/components/ScrollReveal'
import type { Brand, Category, Product, ProductVariant, ProductZonePrice } from '@/lib/types'
import { DEMO_BRANDS, DEMO_PRODUCTS } from '@/lib/demo-data'

export const metadata: Metadata = {
  title: 'Boutique',
  description: 'Tous nos smartphones disponibles aux Antilles et en Guyane.',
}

interface SearchParams { marque?: string; categorie?: string; stockage?: string; tri?: string }

async function getData(params: SearchParams) {
  try {
    const supabase = createClient()
    const [brandsRes, categoriesRes, productsRes] = await Promise.all([
      supabase.from('brands').select('*').order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('products').select(`*, brands(*), category:categories(*), product_variants(*, product_zone_prices(*))`).eq('is_active', true).order('created_at', { ascending: false }),
    ])

    let products = (productsRes.data ?? []) as (Product & {
      brands: Brand
      category: Category | null
      product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[]
    })[]

    if (params.marque) products = products.filter(p => p.brands?.slug === params.marque)
    if (params.categorie) products = products.filter(p => p.category?.slug === params.categorie)
    if (params.stockage) products = products.filter(p => p.product_variants?.some(v => v.storage === params.stockage))
    if (params.tri === 'new') products = products.filter(p => p.is_new)
    if (params.tri === 'bestseller') products = products.filter(p => p.is_bestseller)

    return {
      brands: (brandsRes.data ?? []) as Brand[],
      categories: (categoriesRes.data ?? []) as Category[],
      products,
    }
  } catch {
    let products = DEMO_PRODUCTS as typeof DEMO_PRODUCTS
    if (params.marque) products = products.filter(p => p.brands?.slug === params.marque)
    return { brands: DEMO_BRANDS, categories: [], products }
  }
}

export default async function BoutiquePage({ searchParams }: { searchParams: SearchParams }) {
  const { brands, categories, products } = await getData(searchParams)
  const activeMarque = searchParams.marque
  const activeCategorie = searchParams.categorie

  return (
    <div className="py-10 min-h-screen">
      <div className="jc-container">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* ── SIDEBAR ── */}
          <aside className="lg:w-48 shrink-0">
            <div className="sticky top-20 flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40">Catégorie</p>
                <div className="flex flex-col gap-0.5">
                  <SidebarLink
                    href={activeMarque ? `/boutique?marque=${activeMarque}` : '/boutique'}
                    active={!activeCategorie}
                  >
                    Tout
                  </SidebarLink>
                  {categories.map(c => (
                    <SidebarLink
                      key={c.id}
                      href={activeMarque ? `/boutique?marque=${activeMarque}&categorie=${c.slug}` : `/boutique?categorie=${c.slug}`}
                      active={activeCategorie === c.slug}
                    >
                      {c.name}
                    </SidebarLink>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40">Marque</p>
                <div className="flex flex-col gap-0.5">
                  <SidebarLink
                    href={activeCategorie ? `/boutique?categorie=${activeCategorie}` : '/boutique'}
                    active={!activeMarque}
                  >
                    Toutes les marques
                  </SidebarLink>
                  {brands.map(b => (
                    <SidebarLink
                      key={b.id}
                      href={activeCategorie ? `/boutique?categorie=${activeCategorie}&marque=${b.slug}` : `/boutique?marque=${b.slug}`}
                      active={activeMarque === b.slug}
                    >
                      {b.name}
                    </SidebarLink>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ── GRILLE ── */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-bold text-2xl">
                {activeCategorie
                  ? categories.find(c => c.slug === activeCategorie)?.name ?? 'Boutique'
                  : activeMarque
                    ? brands.find(b => b.slug === activeMarque)?.name ?? 'Boutique'
                    : 'Boutique'}
              </h1>
              <p className="text-sm opacity-40">{products.length} produit{products.length !== 1 ? 's' : ''}</p>
            </div>

            {products.length === 0 ? (
              <ScrollReveal direction="up">
                <div className="text-center py-24 opacity-30">
                  <p className="text-5xl mb-4">📱</p>
                  <p className="font-medium">Aucun produit trouvé.</p>
                </div>
              </ScrollReveal>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((p, i) => (
                  <ScrollReveal key={p.id} delay={Math.min(i, 5) * 65} direction="up">
                    <ProductCard product={p} />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SidebarLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <a href={href}
      className="block px-3 py-2 rounded-lg text-sm transition-all"
      style={{
        fontWeight: active ? 600 : 400,
        background: active ? 'var(--surface)' : 'transparent',
        color: active ? 'var(--foreground)' : 'inherit',
        opacity: active ? 1 : 0.5,
        border: active ? '1px solid var(--border)' : '1px solid transparent',
      }}>
      {children}
    </a>
  )
}
