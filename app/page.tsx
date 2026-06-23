import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import ProductCard from '@/components/ProductCard'
import BrandLogoStrip from '@/components/BrandLogoStrip'
import { Shield, Award, Headphones } from 'lucide-react'
import type { Brand, Product, ProductVariant, ProductZonePrice } from '@/lib/types'

async function getData() {
  const supabase = createClient()
  const [brandsRes, newRes, bestRes] = await Promise.all([
    supabase.from('brands').select('*').order('sort_order'),
    supabase.from('products').select(`*, brands(*), product_variants(*, product_zone_prices(*))`).eq('is_new', true).eq('is_active', true).limit(4),
    supabase.from('products').select(`*, brands(*), product_variants(*, product_zone_prices(*))`).eq('is_bestseller', true).eq('is_active', true).limit(4),
  ])
  return {
    brands: (brandsRes.data ?? []) as Brand[],
    newProducts: (newRes.data ?? []) as (Product & { brands: Brand; product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[] })[],
    bestProducts: (bestRes.data ?? []) as (Product & { brands: Brand; product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[] })[],
  }
}

const WHY_US = [
  { icon: Award,       title: 'Certifié & Testé',   body: 'Chaque appareil passe 72 points de contrôle avant expédition. Grade A ou B uniquement.' },
  { icon: Shield,      title: 'Garantie 12 mois',   body: 'Tous nos produits bénéficient d\'une garantie commerciale d\'un an, pièces et main-d\'œuvre.' },
  { icon: Headphones,  title: 'Support local',       body: 'Une équipe francophone basée aux Antilles, disponible par chat, email et téléphone.' },
]

export default async function HomePage() {
  const { brands, newProducts, bestProducts } = await getData()

  return (
    <>
      {/* ── HERO ── */}
      <section className="py-24 sm:py-32">
        <div className="jc-container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 animate-float"
            style={{ border: '1.5px solid var(--border)', background: 'var(--surface)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--success)' }} />
            ✓ Certifié remis à neuf — Garantie 12 mois
          </div>

          <h1 className="font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight mb-6 animate-fade-up">
            Smartphones{' '}
            <span className="jc-gold-text">reconditionnés</span>
            <br />
            pour les Antilles
          </h1>

          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up"
            style={{ color: 'oklch(0.18 0.004 264 / 0.55)', animationDelay: '0.1s' }}>
            Qualité premium, prix juste, livré chez vous en Martinique, Guadeloupe, Guyane &amp; Saint-Martin.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/boutique" className="jc-btn-primary text-base px-8 py-4">
              Découvrir la boutique
            </Link>
            <Link href="/boutique#marques" className="jc-btn-ghost text-base px-8 py-4">
              Nos marques
            </Link>
          </div>
        </div>
      </section>

      {/* ── BRAND STRIP ── */}
      <BrandLogoStrip brands={brands} />

      {/* ── NOUVEAUTÉS ── */}
      {newProducts.length > 0 && (
        <section className="py-20">
          <div className="jc-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--gold-deep)' }}>Arrivages</p>
                <h2 className="text-3xl font-bold">Nouveautés</h2>
              </div>
              <Link href="/boutique?tri=new" className="text-sm font-medium hover:opacity-70 transition-opacity">
                Tout voir →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── BESTSELLERS ── */}
      {bestProducts.length > 0 && (
        <section className="py-20" style={{ background: 'var(--surface)' }}>
          <div className="jc-container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--gold-deep)' }}>Tendances</p>
                <h2 className="text-3xl font-bold">Bestsellers</h2>
              </div>
              <Link href="/boutique?tri=bestseller" className="text-sm font-medium hover:opacity-70 transition-opacity">
                Tout voir →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── POURQUOI NOUS ── */}
      <section className="py-20">
        <div className="jc-container">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--gold-deep)' }}>Notre engagement</p>
            <h2 className="text-3xl font-bold">Pourquoi nous choisir ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WHY_US.map(({ icon: Icon, title, body }) => (
              <div key={title} className="jc-card p-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
                  style={{ background: 'oklch(0.745 0.085 78 / 0.12)' }}>
                  <Icon size={24} style={{ color: 'var(--gold-deep)' }} />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.18 0.004 264 / 0.55)' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
