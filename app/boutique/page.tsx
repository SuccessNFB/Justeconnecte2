import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase-server'
import ProductCard from '@/components/ProductCard'
import ScrollReveal from '@/components/ScrollReveal'
import BoutiqueFilters from '@/components/BoutiqueFilters'
import type { Brand, Category, Product, ProductVariant, ProductZonePrice } from '@/lib/types'
import { DEMO_BRANDS, DEMO_PRODUCTS } from '@/lib/demo-data'

export const metadata: Metadata = {
  title: 'Boutique — Smartphones neufs iPhone, Samsung, Xiaomi',
  description: 'Découvrez notre catalogue de smartphones neufs : iPhone, Samsung Galaxy, Xiaomi, livrés en Guadeloupe, Martinique et Guyane. Garantie constructeur, paiement 100% sécurisé.',
}

interface SearchParams { marque?: string; categorie?: string; stockage?: string; tri?: string }

type ProductRow = Product & {
  brands: Brand
  product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[]
}

function getMinPrice(product: ProductRow): number {
  const prices = product.product_variants
    ?.flatMap(v => v.product_zone_prices?.map(p => p.price) ?? []) ?? []
  return prices.length > 0 ? Math.min(...prices) : Infinity
}

async function getData(params: SearchParams) {
  try {
    const supabase = await createClient()
    const [brandsRes, categoriesRes, productsRes] = await Promise.all([
      supabase.from('brands').select('*').order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('products').select(`*, brands(*), product_variants(*, product_zone_prices(*))`).eq('is_active', true).order('created_at', { ascending: false }),
    ])

    if (brandsRes.error || productsRes.error) throw new Error('db')

    const allCategories = (categoriesRes.data ?? []) as Category[]
    const allProducts   = (productsRes.data ?? []) as ProductRow[]

    const brandIdsWithProducts = new Set(allProducts.map(p => p.brand_id).filter(Boolean))
    const catIdsWithProducts   = new Set(allProducts.map(p => p.category_id).filter(Boolean))

    const activeBrands     = ((brandsRes.data ?? []) as Brand[]).filter(b => brandIdsWithProducts.has(b.id))
    const activeCategories = allCategories.filter(c => catIdsWithProducts.has(c.id))

    let products = [...allProducts]
    if (params.marque)    products = products.filter(p => p.brands?.slug === params.marque)
    if (params.categorie) {
      const cat = allCategories.find(c => c.slug === params.categorie)
      if (cat) products = products.filter(p => p.category_id === cat.id)
    }
    if (params.stockage)         products = products.filter(p => p.product_variants?.some(v => v.storage === params.stockage))
    if (params.tri === 'new')        products = products.filter(p => p.is_new)
    if (params.tri === 'bestseller') products = products.filter(p => p.is_bestseller)
    if (params.tri === 'prix-asc')   products.sort((a, b) => getMinPrice(a) - getMinPrice(b))
    if (params.tri === 'prix-desc')  products.sort((a, b) => getMinPrice(b) - getMinPrice(a))

    return { brands: activeBrands, categories: activeCategories, products }
  } catch {
    let products = DEMO_PRODUCTS as typeof DEMO_PRODUCTS
    if (params.marque) products = products.filter(p => p.brands?.slug === params.marque)
    return { brands: DEMO_BRANDS, categories: [], products }
  }
}

export default async function BoutiquePage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const { brands, categories, products } = await getData(searchParams)
  const activeMarque    = searchParams.marque
  const activeCategorie = searchParams.categorie
  const activeTri       = searchParams.tri

  return (
    <div className="py-10 min-h-screen">
      <div className="jc-container">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Filtres : barre compacte mobile + sidebar desktop */}
          <BoutiqueFilters
            brands={brands}
            categories={categories}
            activeMarque={activeMarque}
            activeCategorie={activeCategorie}
            activeTri={activeTri}
          />

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
