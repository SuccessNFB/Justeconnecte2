import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import ProductCard from '@/components/ProductCard'
import HeroInteractive from '@/components/HeroInteractive'
import ScrollReveal from '@/components/ScrollReveal'
import { ShieldCheck, Award, Truck, HeadphonesIcon } from 'lucide-react'
import type { Brand, Product, ProductVariant, ProductZonePrice, SiteSection } from '@/lib/types'
import { DEMO_BRANDS, DEMO_PRODUCTS } from '@/lib/demo-data'

type FullProduct = Product & {
  brands: Brand
  product_variants: (ProductVariant & { product_zone_prices: ProductZonePrice[] })[]
}

const TRUST_ICONS = [ShieldCheck, Award, Truck, HeadphonesIcon]

const DEFAULT_TRUST = [
  { title: 'Produits 100 % authentiques',  body: 'Sélectionnés directement chez les distributeurs officiels.' },
  { title: 'Garantie constructeur',         body: 'Tous nos appareils bénéficient de la garantie officielle.' },
  { title: 'Livraison express',             body: 'Guadeloupe, Martinique, Guyane. Délai estimé à la commande.' },
  { title: 'Support réactif',               body: 'WhatsApp, email ou téléphone. Réponse sous 2 heures.' },
]

const PAYMENT_LOGOS = ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'Scalapay', 'Revolut']

async function getData() {
  try {
    const supabase = createClient()
    const [sectionsRes, brandsRes, newRes, bestRes] = await Promise.all([
      supabase.from('site_sections').select('*').eq('page', 'accueil').eq('is_active', true).order('sort_order'),
      supabase.from('brands').select('*').order('sort_order'),
      supabase.from('products').select(`*, brands(*), product_variants(*, product_zone_prices(*))`).eq('is_new', true).eq('is_active', true).limit(4),
      supabase.from('products').select(`*, brands(*), product_variants(*, product_zone_prices(*))`).eq('is_bestseller', true).eq('is_active', true).limit(4),
    ])
    if (newRes.error || bestRes.error) throw new Error('db')

    return {
      sections:     (sectionsRes.data ?? []) as SiteSection[],
      brands:       (brandsRes.data ?? []) as Brand[],
      newProducts:  (newRes.data  ?? []) as FullProduct[],
      bestProducts: (bestRes.data ?? []) as FullProduct[],
    }
  } catch {
    return {
      sections:     [] as SiteSection[],
      brands:       DEMO_BRANDS,
      newProducts:  DEMO_PRODUCTS.filter(p => p.is_new) as unknown as FullProduct[],
      bestProducts: DEMO_PRODUCTS.filter(p => p.is_bestseller) as unknown as FullProduct[],
    }
  }
}

// ── Section renderers ────────────────────────────────────────────────────────

function TrustSection({ items }: { items: { title: string; body: string }[] }) {
  return (
    <section className="py-16" style={{ background: 'var(--background)' }}>
      <div className="jc-container">
        <ScrollReveal direction="up">
          <div className="flex items-center gap-2 justify-center mb-10">
            <span className="jc-stars text-sm">★★★★★</span>
            <span className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>4.8</span>
            <span className="text-sm opacity-40">· 127 avis</span>
            <span className="text-sm opacity-30 mx-1">—</span>
            <span className="text-xs opacity-40">Avis vérifiés par Trustpilot</span>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ title, body }, i) => {
            const Icon = TRUST_ICONS[i % TRUST_ICONS.length]
            return (
              <ScrollReveal key={title} delay={i * 80} direction="up">
                <div className="jc-trust-card p-5 h-full">
                  <div className="jc-trust-icon w-9 h-9 flex items-center justify-center rounded-xl mb-4"
                    style={{ background: 'var(--gold-bg)' }}>
                    <Icon size={18} style={{ color: 'var(--gold)' }} />
                  </div>
                  <h3 className="font-semibold text-sm mb-1.5">{title}</h3>
                  <p className="text-xs leading-relaxed opacity-50">{body}</p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ProductsSection({ title, products, href }: { title: string; products: FullProduct[]; href: string }) {
  if (!products.length) return null
  return (
    <section className="py-14" style={{ background: 'var(--surface)' }}>
      <div className="jc-container">
        <ScrollReveal direction="up">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-bold" style={{ fontSize: 'clamp(1.7rem,3.5vw,2.4rem)' }}>{title}</h2>
            <Link href={href} className="text-sm font-medium opacity-40 hover:opacity-70 transition-opacity">
              Tout voir
            </Link>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 80} direction="up">
              <ProductCard product={p} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function TextSection({ title, body }: { title: string; body: string }) {
  if (!title && !body) return null
  return (
    <section className="py-16" style={{ background: 'var(--background)' }}>
      <div className="jc-container max-w-2xl">
        <ScrollReveal direction="up">
          {title && <h2 className="font-bold text-3xl sm:text-4xl mb-4">{title}</h2>}
          {body && <p className="text-base leading-relaxed opacity-55">{body}</p>}
        </ScrollReveal>
      </div>
    </section>
  )
}

function BannerSection({ text, cta, cta_href }: { text: string; cta: string; cta_href: string }) {
  if (!text) return null
  return (
    <section className="py-10" style={{ background: 'var(--primary)' }}>
      <div className="jc-container flex flex-col sm:flex-row items-center justify-between gap-4">
        <ScrollReveal direction="left">
          <p className="font-bold text-xl text-white">{text}</p>
        </ScrollReveal>
        {cta && cta_href && (
          <ScrollReveal direction="right" delay={100}>
            <Link href={cta_href}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
              style={{ background: 'white', color: 'var(--primary)' }}>
              {cta}
            </Link>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}

function EngagementSection() {
  return (
    <section className="py-16" style={{ background: 'var(--background)' }}>
      <div className="jc-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left" duration={750}>
            <div className="flex justify-center">
              <div className="relative w-80">
                <div className="rounded-3xl overflow-hidden"
                  style={{ background: 'linear-gradient(135deg,#f5f0e8,#ede5d4)' }}>
                  <div className="relative w-full max-w-sm mx-auto">
                    <div className="relative z-10 w-52 ml-0">
                      <svg viewBox="0 0 160 280" fill="none" className="w-full drop-shadow-2xl">
                        <rect x="6" y="4" width="148" height="272" rx="26" fill="#c8b89a"/>
                        <rect x="10" y="8" width="140" height="264" rx="23" fill="#d4c4a8"/>
                        <rect x="14" y="24" width="132" height="226" rx="14" fill="#e8e0d0" opacity="0.85"/>
                        <rect x="60" y="28" width="40" height="12" rx="6" fill="#b8a888"/>
                        <rect x="20" y="32" width="44" height="44" rx="12" fill="#b8a888" opacity="0.5"/>
                        <circle cx="31" cy="47" r="9" fill="#1a1a1a" opacity="0.7"/>
                        <circle cx="51" cy="47" r="9" fill="#1a1a1a" opacity="0.7"/>
                        <circle cx="41" cy="66" r="4" fill="#1a1a1a" opacity="0.4"/>
                        <rect x="60" y="255" width="40" height="5" rx="2.5" fill="#b8a888" opacity="0.6"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={150} duration={750}>
            <div>
              <p className="jc-overline mb-3">Notre engagement</p>
              <h2 className="font-bold text-3xl sm:text-4xl mb-2">Juste Connecté</h2>
              <p className="text-base mb-5 italic" style={{ color: 'var(--gold)' }}>la technologie, simplement</p>
              <p className="text-sm leading-relaxed opacity-55 mb-7">
                Chacun devrait pouvoir accéder à la technologie au prix le plus juste, quel que soit l'endroit où il vit.
                Nous sélectionnons des smartphones authentiques chez les distributeurs officiels, et nous les livrons rapidement dans toute la zone Antilles Guyane.
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {[
                  { icon: ShieldCheck,    label: 'Authentiques' },
                  { icon: Award,          label: 'Garantie officielle' },
                  { icon: Truck,          label: 'Livraison express' },
                  { icon: HeadphonesIcon, label: 'Support 2 h' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5 text-sm font-medium opacity-70">
                    <Icon size={15} style={{ color: 'var(--gold)' }} /> {label}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { sections, newProducts, bestProducts } = await getData()

  return (
    <>
      {/* Hero — always */}
      <HeroInteractive />

      {/* Dynamic sections from admin page builder */}
      {sections.length > 0 ? (
        sections.map(s => {
          if (s.type === 'trust') {
            const items = (s.config.items as { title: string; body: string }[]) ?? DEFAULT_TRUST
            return <TrustSection key={s.id} items={items} />
          }
          if (s.type === 'products_new') {
            return <ProductsSection key={s.id} title={s.config.title ?? 'Nouveautés'} products={newProducts} href="/boutique?tri=new" />
          }
          if (s.type === 'products_bestseller') {
            return <ProductsSection key={s.id} title={s.config.title ?? 'Meilleures ventes'} products={bestProducts} href="/boutique?tri=bestseller" />
          }
          if (s.type === 'text_block') {
            return <TextSection key={s.id} title={s.config.title ?? ''} body={s.config.body ?? ''} />
          }
          if (s.type === 'banner') {
            return <BannerSection key={s.id} text={s.config.text ?? ''} cta={s.config.cta ?? ''} cta_href={s.config.cta_href ?? '/boutique'} />
          }
          return null
        })
      ) : (
        // Fallback hardcoded layout (before migration is applied)
        <>
          <TrustSection items={DEFAULT_TRUST} />
          <ProductsSection title="Nouveautés" products={newProducts} href="/boutique?tri=new" />
          <ProductsSection title="Meilleures ventes" products={bestProducts} href="/boutique?tri=bestseller" />
        </>
      )}

      {/* Notre engagement — always */}
      <EngagementSection />

      {/* Scalapay — always */}
      <section className="py-16" style={{ background: 'var(--background)' }}>
        <div className="jc-container text-center">
          <ScrollReveal direction="up">
            <p className="jc-overline mb-3">Paiement</p>
            <h2 className="font-bold text-3xl sm:text-4xl mb-3">Payez en 4 fois sans frais avec Scalapay</h2>
            <p className="text-sm opacity-45 mb-8">
              Exemple pour un iPhone 16 Pro à 1 299 € : 4 versements de 324,75 €. Sans intérêts.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <div className="flex flex-wrap justify-center gap-3">
              {PAYMENT_LOGOS.map(p => (
                <span key={p}
                  className="text-xs font-semibold px-4 py-2 rounded-full border"
                  style={{ borderColor: 'var(--border-strong)', opacity: 0.65 }}>
                  {p}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
