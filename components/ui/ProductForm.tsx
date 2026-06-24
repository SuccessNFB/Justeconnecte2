'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import type { Brand, Zone, Product, ProductVariant, ProductZonePrice } from '@/lib/types'

interface VariantDraft {
  id?: string
  color_name: string
  color_hex: string
  storage: string
  sku: string
  stock: number
  is_active: boolean
  sort_order: number
  prices: { zone_id: string; zone_label: string; price: string; compare_at_price: string }[]
  expanded: boolean
}

interface Props {
  product?: Product & {
    product_variants?: (ProductVariant & { product_zone_prices?: ProductZonePrice[] })[]
  }
}

export default function ProductForm({ product }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [brands, setBrands] = useState<Brand[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [brandId, setBrandId] = useState(product?.brand_id ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
    product?.specs ? Object.entries(product.specs).map(([key, value]) => ({ key, value: String(value) })) : [{ key: '', value: '' }]
  )
  const [isActive, setIsActive] = useState(product?.is_active ?? true)
  const [isNew, setIsNew] = useState(product?.is_new ?? false)
  const [isBestseller, setIsBestseller] = useState(product?.is_bestseller ?? false)
  const [badge, setBadge] = useState(product?.badge ?? '')
  const [variants, setVariants] = useState<VariantDraft[]>([])

  useEffect(() => {
    Promise.all([
      supabase.from('brands').select('*').order('sort_order'),
      supabase.from('zones').select('*').order('sort_order'),
    ]).then(([b, z]) => {
      setBrands(b.data ?? [])
      const zonesData = (z.data ?? []) as Zone[]
      setZones(zonesData)

      if (product?.product_variants?.length) {
        setVariants(
          product.product_variants.map(v => ({
            id: v.id,
            color_name: v.color_name,
            color_hex: v.color_hex,
            storage: v.storage,
            sku: v.sku,
            stock: v.stock,
            is_active: v.is_active,
            sort_order: v.sort_order,
            expanded: false,
            prices: zonesData.map(zone => {
              const existing = v.product_zone_prices?.find(p => p.zone_id === zone.id)
              return {
                zone_id: zone.id,
                zone_label: zone.label,
                price: existing ? String(existing.price) : '',
                compare_at_price: existing?.compare_at_price ? String(existing.compare_at_price) : '',
              }
            }),
          }))
        )
      } else if (!product) {
        setVariants([makeVariant(zonesData)])
      }
    })
  }, [])

  function makeVariant(zonesData: Zone[]): VariantDraft {
    return {
      color_name: '', color_hex: '#1c1c1e', storage: '128 GB',
      sku: '', stock: 0, is_active: true, sort_order: 0, expanded: true,
      prices: zonesData.map(z => ({ zone_id: z.id, zone_label: z.label, price: '', compare_at_price: '' })),
    }
  }

  function updateVariant(idx: number, patch: Partial<VariantDraft>) {
    setVariants(prev => prev.map((v, i) => i === idx ? { ...v, ...patch } : v))
  }

  function updateVariantPrice(vIdx: number, pIdx: number, field: 'price' | 'compare_at_price', val: string) {
    setVariants(prev => prev.map((v, i) => {
      if (i !== vIdx) return v
      const prices = v.prices.map((p, pi) => pi === pIdx ? { ...p, [field]: val } : p)
      return { ...v, prices }
    }))
  }

  const HEX_RE  = /^#[0-9a-fA-F]{6}$/
  const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (!SLUG_RE.test(slug)) {
      setError('Slug invalide : lettres minuscules, chiffres et tirets uniquement (ex: iphone-14).')
      setSaving(false)
      return
    }

    for (const v of variants) {
      if (v.color_hex && !HEX_RE.test(v.color_hex)) {
        setError(`Couleur invalide pour la variante "${v.color_name || 'sans nom'}" — format attendu : #rrggbb.`)
        setSaving(false)
        return
      }
    }

    try {
      const specsObj = Object.fromEntries(specs.filter(s => s.key).map(s => [s.key, s.value]))

      let productId = product?.id
      if (productId) {
        await supabase.from('products').update({
          name, slug, brand_id: brandId, description, specs: specsObj,
          is_active: isActive, is_new: isNew, is_bestseller: isBestseller, badge: badge || null,
        }).eq('id', productId)
      } else {
        const { data, error: e } = await supabase.from('products').insert({
          name, slug, brand_id: brandId, description, specs: specsObj,
          is_active: isActive, is_new: isNew, is_bestseller: isBestseller, badge: badge || null,
        }).select('id').single()
        if (e) throw e
        productId = data.id
      }

      for (const v of variants) {
        let variantId = v.id
        const variantData = {
          product_id: productId,
          color_name: v.color_name, color_hex: v.color_hex,
          storage: v.storage, sku: v.sku, stock: v.stock,
          is_active: v.is_active, sort_order: v.sort_order,
        }
        if (variantId) {
          await supabase.from('product_variants').update(variantData).eq('id', variantId)
        } else {
          const { data, error: e } = await supabase.from('product_variants').insert(variantData).select('id').single()
          if (e) throw e
          variantId = data.id
        }

        for (const p of v.prices) {
          if (!p.price) continue
          await supabase.from('product_zone_prices').upsert({
            variant_id: variantId, zone_id: p.zone_id,
            price: parseFloat(p.price),
            compare_at_price: p.compare_at_price ? parseFloat(p.compare_at_price) : null,
          }, { onConflict: 'variant_id,zone_id' })
        }
      }

      router.push('/admin/produits')
    } catch (err: any) {
      setError(err.message ?? 'Une erreur est survenue.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-3xl">
      {/* ── INFOS DE BASE ── */}
      <section className="jc-card p-6">
        <h2 className="font-bold text-base mb-5">Informations générales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5">Nom *</label>
            <input className="jc-input" value={name} required maxLength={200}
              onChange={e => { setName(e.target.value); if (!product) setSlug(slugify(e.target.value)) }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5">Slug *</label>
            <input className="jc-input font-mono text-xs" value={slug} required maxLength={120}
              onChange={e => setSlug(slugify(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5">Marque *</label>
            <select className="jc-input" value={brandId} required onChange={e => setBrandId(e.target.value)}>
              <option value="">Sélectionner…</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5">Badge</label>
            <input className="jc-input" value={badge} placeholder="ex: Nouveau, Top vente…" maxLength={50}
              onChange={e => setBadge(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold mb-1.5">Description</label>
            <textarea className="jc-input resize-none" rows={3} value={description}
              onChange={e => setDescription(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-wrap gap-5 mt-5">
          {([['isActive', isActive, setIsActive, 'Actif'],
             ['isNew', isNew, setIsNew, 'Nouveau'],
             ['isBestseller', isBestseller, setIsBestseller, 'Bestseller']] as const).map(([, val, fn, label]) => (
            <label key={String(label)} className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={val} onChange={e => (fn as any)(e.target.checked)}
                className="w-4 h-4 rounded" />
              {label}
            </label>
          ))}
        </div>
      </section>

      {/* ── SPECS ── */}
      <section className="jc-card p-6">
        <h2 className="font-bold text-base mb-5">Caractéristiques techniques</h2>
        <div className="flex flex-col gap-2">
          {specs.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input className="jc-input flex-1" placeholder="Clé (ex: Écran)" value={s.key}
                onChange={e => setSpecs(prev => prev.map((sp, si) => si === i ? { ...sp, key: e.target.value } : sp))} />
              <input className="jc-input flex-1" placeholder="Valeur" value={s.value}
                onChange={e => setSpecs(prev => prev.map((sp, si) => si === i ? { ...sp, value: e.target.value } : sp))} />
              <button type="button" onClick={() => setSpecs(prev => prev.filter((_, si) => si !== i))}
                className="p-2 rounded-lg hover:bg-black/5" style={{ color: 'var(--destructive)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setSpecs(prev => [...prev, { key: '', value: '' }])}
            className="jc-btn-ghost text-xs self-start mt-1">
            <Plus size={13} /> Ajouter une caractéristique
          </button>
        </div>
      </section>

      {/* ── VARIANTES ── */}
      <section className="jc-card p-6">
        <h2 className="font-bold text-base mb-5">Variantes</h2>
        <div className="flex flex-col gap-4">
          {variants.map((v, idx) => (
            <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: '12px' }}>
              <button type="button"
                onClick={() => updateVariant(idx, { expanded: !v.expanded })}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold"
              >
                <span>{v.color_name || 'Variante'} · {v.storage} {v.sku && `(${v.sku})`}</span>
                {v.expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {v.expanded && (
                <div className="px-4 pb-4 flex flex-col gap-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold block mb-1">Couleur</label>
                      <input className="jc-input" placeholder="Minuit" value={v.color_name}
                        onChange={e => updateVariant(idx, { color_name: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">Hex couleur</label>
                      <div className="flex gap-2">
                        <input type="color" value={v.color_hex}
                          onChange={e => updateVariant(idx, { color_hex: e.target.value })}
                          className="w-10 h-10 rounded cursor-pointer border-0 p-0.5"
                          style={{ border: '1.5px solid var(--border)' }} />
                        <input className="jc-input font-mono text-xs flex-1" value={v.color_hex}
                          onChange={e => updateVariant(idx, { color_hex: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">Stockage</label>
                      <input className="jc-input" placeholder="128 GB" value={v.storage}
                        onChange={e => updateVariant(idx, { storage: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">SKU</label>
                      <input className="jc-input font-mono text-xs" value={v.sku}
                        onChange={e => updateVariant(idx, { sku: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">Stock</label>
                      <input type="number" className="jc-input" value={v.stock} min={0}
                        onChange={e => updateVariant(idx, { stock: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={v.is_active}
                          onChange={e => updateVariant(idx, { is_active: e.target.checked })}
                          className="w-4 h-4 rounded" />
                        Active
                      </label>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold mb-2">Prix par zone</p>
                    <div className="flex flex-col gap-2">
                      {v.prices.map((p, pi) => (
                        <div key={pi} className="flex items-center gap-3">
                          <span className="text-xs w-32 shrink-0">{p.zone_label}</span>
                          <input type="number" className="jc-input text-xs" placeholder="Prix" value={p.price} step="0.01"
                            onChange={e => updateVariantPrice(idx, pi, 'price', e.target.value)} />
                          <input type="number" className="jc-input text-xs" placeholder="Prix barré" value={p.compare_at_price} step="0.01"
                            onChange={e => updateVariantPrice(idx, pi, 'compare_at_price', e.target.value)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {!v.id && (
                    <button type="button" onClick={() => setVariants(prev => prev.filter((_, i) => i !== idx))}
                      className="self-start text-xs flex items-center gap-1" style={{ color: 'var(--destructive)' }}>
                      <Trash2 size={12} /> Supprimer cette variante
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button type="button" onClick={() => setVariants(prev => [...prev, makeVariant(zones)])}
          className="jc-btn-ghost text-xs mt-4">
          <Plus size={13} /> Ajouter une variante
        </button>
      </section>

      {error && <p className="text-sm font-medium" style={{ color: 'var(--destructive)' }}>{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="jc-btn-primary">
          {saving ? 'Enregistrement…' : product ? 'Mettre à jour' : 'Créer le produit'}
        </button>
        <button type="button" onClick={() => router.push('/admin/produits')} className="jc-btn-ghost">
          Annuler
        </button>
      </div>
    </form>
  )
}
