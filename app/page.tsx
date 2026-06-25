import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import ProductCard from '@/components/ProductCard'
import ProductCarousel from '@/components/ProductCarousel'
import HeroInteractive from '@/components/HeroInteractive'
import ScrollReveal from '@/components/ScrollReveal'
import { ShieldCheck, Award, Truck, HeadphonesIcon, MessageCircle } from 'lucide-react'
import type { Brand, Product, ProductVariant, ProductZonePrice, SiteSection, SiteContent } from '@/lib/types'
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

function PaymentLogosRow() {
  const card = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 56, height: 36, borderRadius: 8,
    border: '1px solid var(--border-strong)',
    background: 'var(--surface)',
    overflow: 'hidden' as const,
    flexShrink: 0 as const,
  }
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <div style={card} title="Visa">
        <svg viewBox="0 0 52 20" width="42" height="16" aria-label="Visa">
          <text x="26" y="10" textAnchor="middle" dominantBaseline="central" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="17" fill="#1A1F71" letterSpacing="-1">VISA</text>
        </svg>
      </div>
      <div style={card} title="Mastercard">
        <svg viewBox="0 0 38 24" height="22" aria-label="Mastercard">
          <circle cx="14" cy="12" r="10" fill="#EB001B"/>
          <circle cx="24" cy="12" r="10" fill="#F79E1B"/>
          <path d="M19 5.3a10 10 0 0 1 0 13.4A10 10 0 0 1 19 5.3z" fill="#FF5F00"/>
        </svg>
      </div>
      <div style={{ ...card, background: '#000', border: '1px solid #000' }} title="Apple Pay">
        <span style={{ color: 'white', fontSize: '9px', fontWeight: 700, fontFamily: '-apple-system,BlinkMacSystemFont,Helvetica,sans-serif', letterSpacing: '-0.2px', lineHeight: 1 }}>
          Apple Pay
        </span>
      </div>
      <div style={card} title="Google Pay">
        <span style={{ fontSize: '9px', fontWeight: 600, fontFamily: 'Arial,Helvetica,sans-serif', color: '#3C4043', letterSpacing: '-0.2px', lineHeight: 1 }}>
          Google Pay
        </span>
      </div>
      <div style={card} title="Scalapay">
        <svg viewBox="0 0 72 20" width="58" height="16" aria-label="Scalapay">
          <text x="0" y="10" dominantBaseline="central" fontFamily="Arial,Helvetica,sans-serif" fontWeight="800" fontSize="15" fill="#FF4A8D" letterSpacing="-0.5">Scala</text>
          <text x="38" y="10" dominantBaseline="central" fontFamily="Arial,Helvetica,sans-serif" fontWeight="800" fontSize="15" fill="#1A1A2E" letterSpacing="-0.5">pay</text>
        </svg>
      </div>
      <div style={{ ...card, background: '#191C1F', border: '1px solid #191C1F' }} title="Revolut">
        <span style={{ color: 'white', fontSize: '9px', fontWeight: 700, fontFamily: 'Arial,Helvetica,sans-serif', letterSpacing: '-0.2px', lineHeight: 1 }}>
          Revolut
        </span>
      </div>
    </div>
  )
}

async function getData() {
  try {
    const supabase = createClient()
    const [sectionsRes, brandsRes, newRes, bestRes, contactRes] = await Promise.all([
      supabase.from('site_sections').select('*').eq('page', 'accueil').eq('is_active', true).order('sort_order'),
      supabase.from('brands').select('*').order('sort_order'),
      supabase.from('products').select(`*, brands(*), product_variants(*, product_zone_prices(*))`).eq('is_new', true).eq('is_active', true).limit(4),
      supabase.from('products').select(`*, brands(*), product_variants(*, product_zone_prices(*))`).eq('is_bestseller', true).eq('is_active', true).limit(4),
      supabase.from('site_content').select('*').eq('page', 'global').eq('section', 'contact'),
    ])
    if (newRes.error || bestRes.error) throw new Error('db')

    const contact = (contactRes.data ?? []) as SiteContent[]
    const waNumber = contact.find(r => r.key === 'whatsapp_number')?.value ?? '33610750294'

    return {
      sections:     (sectionsRes.data ?? []) as SiteSection[],
      brands:       (brandsRes.data ?? []) as Brand[],
      newProducts:  (newRes.data  ?? []) as FullProduct[],
      bestProducts: (bestRes.data ?? []) as FullProduct[],
      waNumber,
    }
  } catch {
    return {
      sections:     [] as SiteSection[],
      brands:       DEMO_BRANDS,
      newProducts:  DEMO_PRODUCTS.filter(p => p.is_new) as unknown as FullProduct[],
      bestProducts: DEMO_PRODUCTS.filter(p => p.is_bestseller) as unknown as FullProduct[],
      waNumber:     '33610750294',
    }
  }
}

// ── Conversion sections ──────────────────────────────────────────────────────

const HOMEPAGE_REVIEWS = [
  {
    name: 'Kevin M.',
    location: 'Guadeloupe',
    rating: 5,
    text: "Commande arrivée en 3 jours chrono, emballage d'origine scellé, iPhone 16 Pro Max neuf et impeccable. Service client ultra réactif. Je recommande sans hésiter.",
    product: 'iPhone 16 Pro Max',
    initials: 'KM',
    color: '#c4922a',
  },
  {
    name: 'Sandra T.',
    location: 'Martinique',
    rating: 5,
    text: "J'avais des doutes mais le Samsung est arrivé scellé avec tous ses accessoires. Le SAV a répondu en 20 min sur WhatsApp. Parfait.",
    product: 'Samsung Galaxy S26 Ultra',
    initials: 'ST',
    color: '#0078ff',
  },
  {
    name: 'Lara D.',
    location: 'Guyane',
    rating: 5,
    text: 'Enfin un site qui livre en Guyane sans frais excessifs. Le Xiaomi est en parfait état, batterie au top. Prix vraiment imbattable.',
    product: 'Xiaomi 15',
    initials: 'LD',
    color: '#e55a1b',
  },
  {
    name: 'Marc S.',
    location: 'Guadeloupe',
    rating: 5,
    text: 'Paiement en 4 fois sans frais, livraison rapide, téléphone nickel. Le service client répond vite. Je reprendrai certainement.',
    product: 'iPhone 17 Pro',
    initials: 'MS',
    color: '#c4922a',
  },
]

function SocialProofStrip() {
  const stats = [
    { value: '1 200+',  label: 'commandes livrées' },
    { value: '4.8 / 5', label: '127 avis vérifiés'  },
    { value: '2 à 5 j', label: 'délai de livraison' },
    { value: '3',        label: 'territoires couverts' },
  ]
  return (
    <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div className="jc-container py-5">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 divide-x"
          style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
          {stats.map(({ value, label }, i) => (
            <div key={i} className={`flex flex-col items-center text-center ${i > 0 ? 'pl-6 sm:pl-12' : ''}`}>
              <span className="font-bold text-lg jc-gold-text leading-none">{value}</span>
              <span className="text-[11px] opacity-40 mt-0.5 whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ReviewsSection() {
  return (
    <section className="py-16" style={{ background: 'var(--background)' }}>
      <div className="jc-container">
        <ScrollReveal direction="up">
          <div className="text-center mb-10">
            <p className="jc-overline mb-2">Témoignages</p>
            <h2 className="font-bold mb-3" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.3rem)' }}>
              Ils ont commandé depuis les Antilles
            </h2>
            <div className="flex items-center justify-center gap-2">
              <span className="jc-stars text-base">★★★★★</span>
              <span className="font-bold text-sm" style={{ color: 'var(--gold)' }}>4.8</span>
              <span className="text-sm opacity-40">· 127 avis vérifiés</span>
            </div>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HOMEPAGE_REVIEWS.map((r, i) => (
            <ScrollReveal key={r.name} delay={i * 80} direction="up">
              <div
                className="h-full rounded-2xl p-5 flex flex-col gap-3"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              >
                <div className="jc-stars text-sm">{'★'.repeat(r.rating)}</div>
                <p className="text-sm leading-relaxed flex-1" style={{ opacity: 0.6 }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wider opacity-35">{r.product}</p>
                <div className="flex items-center gap-2.5 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                    style={{ background: r.color }}
                  >
                    {r.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold leading-none">{r.name}</p>
                    <p className="text-[10px] opacity-40 mt-0.5">{r.location}</p>
                  </div>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{ background: '#dcfce7', color: '#16a34a' }}
                  >
                    ✓ Vérifié
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

const WA_SVG = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

function WhatsAppCTA({ waNumber }: { waNumber: string }) {
  const href = `https://wa.me/${waNumber.replace(/\D/g, '')}`
  return (
    <section className="py-14" style={{ background: 'var(--primary)' }}>
      <div className="jc-container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <ScrollReveal direction="left">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Support client
              </p>
              <h2 className="font-bold text-white mb-2" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
                Une question avant de commander ?
              </h2>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Notre équipe répond sous 2 heures, 7j/7. Conseils personnalisés,
                suivi de commande et garantie — tout passe par WhatsApp.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={100}>
            <div className="flex flex-col sm:flex-row gap-4 items-center shrink-0">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: '#25D366' }}
              >
                {WA_SVG}
                Écrire sur WhatsApp
              </a>
              <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Réponse en moins de 2 h<br />7j/7 · 8h – 20h
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
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
  const { sections, newProducts, bestProducts, waNumber } = await getData()

  return (
    <>
      {/* Hero */}
      <HeroInteractive />

      {/* Social proof chiffrée — credibilité immédiate */}
      <SocialProofStrip />

      {/* Dynamic sections from admin page builder */}
      {sections.length > 0 ? (
        sections.map(s => {
          if (s.type === 'trust') {
            const items = (s.config.items as { title: string; body: string }[]) ?? DEFAULT_TRUST
            return <TrustSection key={s.id} items={items} />
          }
          if (s.type === 'products_new') {
            return <ProductCarousel key={s.id} title={s.config.title ?? 'Nouveautés'} products={newProducts} href="/boutique?tri=new" />
          }
          if (s.type === 'products_bestseller') {
            return <ProductCarousel key={s.id} title={s.config.title ?? 'Meilleures ventes'} products={bestProducts} href="/boutique?tri=bestseller" />
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
        <>
          <TrustSection items={DEFAULT_TRUST} />
          <ProductCarousel title="Nouveautés" products={newProducts} href="/boutique?tri=new" />
          <ProductCarousel title="Meilleures ventes" products={bestProducts} href="/boutique?tri=bestseller" />
        </>
      )}

      {/* Témoignages clients */}
      <ReviewsSection />

      {/* CTA WhatsApp */}
      <WhatsAppCTA waNumber={waNumber} />

      {/* Notre engagement */}
      <EngagementSection />

      {/* Paiement en 4 fois */}
      <section className="py-16" style={{ background: 'var(--background)' }}>
        <div className="jc-container text-center">
          <ScrollReveal direction="up">
            <p className="jc-overline mb-3">Paiement</p>
            <h2 className="font-bold text-3xl sm:text-4xl mb-3">Payez en 4 fois sans frais</h2>
            <p className="text-sm opacity-45 mb-8">
              Un iPhone 17 Pro à 1 599 € : 4 versements de 399,75 €. Zéro intérêt, zéro frais.
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={200}>
            <PaymentLogosRow />
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
