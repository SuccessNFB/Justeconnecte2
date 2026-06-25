'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ChevronDown, ChevronUp, X, Image as ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { slugify } from '@/lib/utils'
import type { Brand, Category, Zone, Product, ProductVariant, ProductZonePrice } from '@/lib/types'

const STORAGE_PRESETS = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB', '2 TB']

const COMMON_COLORS = [
  { name: 'Minuit',          hex: '#1c1c1e' },
  { name: 'Noir',            hex: '#000000' },
  { name: 'Blanc stellaire', hex: '#f5f5f0' },
  { name: 'Lumière stellaire', hex: '#f0e6d0' },
  { name: 'Titane',          hex: '#8e8e93' },
  { name: 'Or naturel',      hex: '#c4922a' },
  { name: 'Mauve',           hex: '#c5b8d5' },
  { name: 'Rose',            hex: '#f4a8b0' },
  { name: 'Bleu',            hex: '#3a7bc8' },
  { name: 'Vert',            hex: '#4caf7d' },
  { name: 'Rouge',           hex: '#c0392b' },
  { name: 'Jaune',           hex: '#f7c948' },
  { name: 'Violet',          hex: '#8e44ad' },
  { name: 'Corail',          hex: '#e8705a' },
  { name: 'Gris sidéral',    hex: '#3a3a3c' },
  { name: 'Argent',          hex: '#d1d1d6' },
  { name: 'Bleu Pacifique',  hex: '#4a7d9e' },
  { name: 'Vert forêt',      hex: '#2e7d52' },
  { name: 'Or rose',         hex: '#e8b4a0' },
  { name: 'Cuivre',          hex: '#b87333' },
]

interface VariantDraft {
  id?: string
  color_name: string
  color_hex: string
  storage: string
  sku: string
  stock: number
  is_active: boolean
  out_of_stock: boolean
  sort_order: number
  images: string[]
  prices: { zone_id: string; zone_label: string; price: string; compare_at_price: string }[]
  expanded: boolean
}

interface Props {
  product?: Product & {
    product_variants?: (ProductVariant & { product_zone_prices?: ProductZonePrice[] })[]
  }
}

export default function ProductForm({ product }: Props) {
  const router   = useRouter()
  const supabase = createClient()
  const [brands,     setBrands]     = useState<Brand[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [zones,      setZones]      = useState<Zone[]>([])
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')

  const [name,        setName]        = useState(product?.name        ?? '')
  const [slug,        setSlug]        = useState(product?.slug        ?? '')
  const [brandId,     setBrandId]     = useState(product?.brand_id    ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [specs,       setSpecs]       = useState<{ key: string; value: string }[]>(
    product?.specs
      ? Object.entries(product.specs).map(([key, value]) => ({ key, value: String(value) }))
      : [{ key: '', value: '' }]
  )
  const [isActive,      setIsActive]      = useState(product?.is_active      ?? true)
  const [isNew,         setIsNew]         = useState(product?.is_new         ?? false)
  const [isBestseller,  setIsBestseller]  = useState(product?.is_bestseller  ?? false)
  const [badge,         setBadge]         = useState(product?.badge          ?? '')
  const [categoryId,    setCategoryId]    = useState(product?.category_id    ?? '')
  const [newCategoryMode, setNewCategoryMode]   = useState(false)
  const [newCategoryName, setNewCategoryName]   = useState('')
  const [variants,      setVariants]      = useState<VariantDraft[]>([])

  useEffect(() => {
    Promise.all([
      supabase.from('brands').select('*').order('sort_order'),
      supabase.from('zones').select('*').order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
    ]).then(([b, z, c]) => {
      setBrands(b.data ?? [])
      setCategories((c.data ?? []) as Category[])
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
            out_of_stock: v.out_of_stock ?? false,
            sort_order: v.sort_order,
            images: v.images ?? [],
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

  async function createCategory() {
    if (!newCategoryName.trim()) return
    const catSlug = slugify(newCategoryName)
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: newCategoryName.trim(), slug: catSlug, sort_order: categories.length + 1 })
      .select('id, name, slug, sort_order')
      .single()
    if (!error && data) {
      setCategories(prev => [...prev, data as Category])
      setCategoryId((data as Category).id)
    }
    setNewCategoryMode(false)
    setNewCategoryName('')
  }

  function makeVariant(zonesData: Zone[]): VariantDraft {
    return {
      color_name: '', color_hex: '#1c1c1e', storage: '128 GB',
      sku: '', stock: 0, is_active: true, out_of_stock: false,
      sort_order: 0, images: [], expanded: true,
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

  function updateVariantImage(vIdx: number, imgIdx: number, val: string) {
    setVariants(prev => prev.map((v, i) => {
      if (i !== vIdx) return v
      const images = [...v.images]
      images[imgIdx] = val
      return { ...v, images }
    }))
  }

  function removeVariantImage(vIdx: number, imgIdx: number) {
    setVariants(prev => prev.map((v, i) => {
      if (i !== vIdx) return v
      return { ...v, images: v.images.filter((_, ii) => ii !== imgIdx) }
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
        setError(`Couleur invalide pour "${v.color_name || 'sans nom'}" — format attendu : #rrggbb.`)
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
          is_active: isActive, is_new: isNew, is_bestseller: isBestseller,
          badge: badge || null, category_id: categoryId || null,
        }).eq('id', productId)
      } else {
        const { data, error: e } = await supabase.from('products').insert({
          name, slug, brand_id: brandId, description, specs: specsObj,
          is_active: isActive, is_new: isNew, is_bestseller: isBestseller,
          badge: badge || null, category_id: categoryId || null,
        }).select('id').single()
        if (e) throw e
        productId = data.id
      }

      for (const v of variants) {
        let variantId = v.id
        const variantData = {
          product_id: productId,
          color_name: v.color_name,
          color_hex: v.color_hex,
          storage: v.storage,
          sku: v.sku,
          stock: v.stock,
          is_active: v.is_active,
          out_of_stock: v.out_of_stock,
          sort_order: v.sort_order,
          images: v.images.filter(Boolean),
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

      {/* ── BARRE STICKY ── */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', backdropFilter: 'blur(10px)' }}
      >
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{product ? product.name : 'Nouveau produit'}</p>
          {error && <p className="text-xs mt-0.5" style={{ color: 'var(--destructive)' }}>{error}</p>}
        </div>
        <div className="flex gap-2 shrink-0">
          <button type="button" onClick={() => router.push('/admin/produits')} className="jc-btn-ghost py-2 text-sm">
            Annuler
          </button>
          <button type="submit" disabled={saving} className="jc-btn-primary py-2 text-sm">
            {saving ? 'Enregistrement…' : product ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </div>

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
            <label className="block text-xs font-semibold mb-1.5">Catégorie</label>
            {newCategoryMode ? (
              <div className="flex gap-2">
                <input
                  className="jc-input flex-1"
                  placeholder="Nom de la catégorie"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  onKeyDown={async e => { if (e.key === 'Enter') { e.preventDefault(); await createCategory() } }}
                  autoFocus
                />
                <button type="button" onClick={createCategory} className="jc-btn-primary px-3" disabled={!newCategoryName.trim()}>
                  <Plus size={14} />
                </button>
                <button type="button" onClick={() => { setNewCategoryMode(false); setNewCategoryName('') }} className="jc-btn-ghost px-3">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <select className="jc-input" value={categoryId} onChange={e => {
                if (e.target.value === '__new__') setNewCategoryMode(true)
                else setCategoryId(e.target.value)
              }}>
                <option value="">Sélectionner…</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                <option value="__new__">+ Créer une catégorie…</option>
              </select>
            )}
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
              <input type="checkbox" checked={val} onChange={e => (fn as any)(e.target.checked)} className="w-4 h-4 rounded" />
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
        <h2 className="font-bold text-base mb-5">Variantes de couleur &amp; stockage</h2>
        <div className="flex flex-col gap-4">
          {variants.map((v, idx) => (
            <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: '12px' }}>

              {/* Collapsed header */}
              <button type="button"
                onClick={() => updateVariant(idx, { expanded: !v.expanded })}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {v.color_hex && (
                    <span className="w-4 h-4 rounded-full shrink-0 ring-1 ring-black/10"
                      style={{ background: v.color_hex }} />
                  )}
                  <span className="truncate">
                    {v.color_name || 'Couleur'} · {v.storage || '…'}
                    {v.out_of_stock && <span className="ml-2 text-[10px] opacity-50">Rupture</span>}
                  </span>
                </div>
                {v.expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {v.expanded && (
                <div className="px-4 pb-5 flex flex-col gap-5 border-t" style={{ borderColor: 'var(--border)' }}>

                  {/* ── COULEUR ── */}
                  <div className="pt-4">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">Couleur</p>

                    {/* Quick-pick palette */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {COMMON_COLORS.map(c => (
                        <button
                          type="button"
                          key={c.hex}
                          onClick={() => updateVariant(idx, { color_hex: c.hex, color_name: c.name })}
                          title={c.name}
                          className="w-7 h-7 rounded-full transition-all duration-150"
                          style={{
                            background: c.hex,
                            boxShadow: v.color_hex === c.hex
                              ? `0 0 0 2.5px var(--surface), 0 0 0 4.5px ${c.hex}`
                              : '0 0 0 1.5px rgba(0,0,0,0.14)',
                            transform: v.color_hex === c.hex ? 'scale(1.18)' : 'scale(1)',
                          }}
                        />
                      ))}
                    </div>

                    {/* Manual fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1">Nom de la couleur</label>
                        <input className="jc-input" placeholder="ex: Minuit" value={v.color_name}
                          onChange={e => updateVariant(idx, { color_name: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">Code hex</label>
                        <div className="flex gap-2">
                          <input type="color" value={v.color_hex}
                            onChange={e => updateVariant(idx, { color_hex: e.target.value })}
                            className="w-10 h-10 rounded cursor-pointer p-0.5"
                            style={{ border: '1.5px solid var(--border)' }} />
                          <input className="jc-input font-mono text-xs flex-1" value={v.color_hex}
                            onChange={e => updateVariant(idx, { color_hex: e.target.value })} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── STOCKAGE ── */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2">Stockage</p>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {STORAGE_PRESETS.map(s => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => updateVariant(idx, { storage: s })}
                          className="text-xs font-semibold px-3 py-1 rounded-full transition-all"
                          style={{
                            border: v.storage === s ? '1.5px solid var(--gold)' : '1.5px solid var(--border-strong)',
                            background: v.storage === s ? 'var(--gold-bg)' : 'transparent',
                            color: v.storage === s ? 'var(--gold-deep)' : 'inherit',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => updateVariant(idx, { storage: STORAGE_PRESETS.includes(v.storage) ? '' : v.storage })}
                        className="text-xs font-semibold px-3 py-1 rounded-full transition-all"
                        style={{
                          border: !STORAGE_PRESETS.includes(v.storage) ? '1.5px solid var(--gold)' : '1.5px solid var(--border-strong)',
                          background: !STORAGE_PRESETS.includes(v.storage) ? 'var(--gold-bg)' : 'transparent',
                          color: !STORAGE_PRESETS.includes(v.storage) ? 'var(--gold-deep)' : 'inherit',
                        }}
                      >
                        Autre…
                      </button>
                    </div>
                    {!STORAGE_PRESETS.includes(v.storage) && (
                      <input className="jc-input text-xs" value={v.storage}
                        placeholder="ex: 32 GB, 1,5 TB…"
                        onChange={e => updateVariant(idx, { storage: e.target.value })} />
                    )}
                  </div>

                  {/* ── PHOTOS PAR COULEUR ── */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2">
                      Photos pour cette couleur
                    </p>
                    <div className="flex flex-col gap-2">
                      {v.images.map((url, urlIdx) => (
                        <div key={urlIdx} className="flex items-center gap-2">
                          <div
                            className="w-10 h-10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center"
                            style={{ border: '1px solid var(--border)', background: 'var(--surface-soft)' }}
                          >
                            {url ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img src={url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon size={14} className="opacity-20" />
                            )}
                          </div>
                          <input
                            className="jc-input text-xs flex-1"
                            value={url}
                            placeholder="https://cdn.exemple.com/photo.jpg"
                            onChange={e => updateVariantImage(idx, urlIdx, e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => removeVariantImage(idx, urlIdx)}
                            className="p-1.5 rounded-lg hover:bg-black/5 shrink-0"
                            style={{ color: 'var(--destructive)' }}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => updateVariant(idx, { images: [...v.images, ''] })}
                      className="jc-btn-ghost text-xs mt-2"
                    >
                      <Plus size={13} /> Ajouter une photo
                    </button>
                  </div>

                  {/* ── INFOS VARIANTE ── */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2">Inventaire</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1">SKU</label>
                        <input className="jc-input font-mono text-xs" value={v.sku}
                          onChange={e => updateVariant(idx, { sku: e.target.value })} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">Quantité en stock</label>
                        <input type="number" className="jc-input" value={v.stock} min={0}
                          onChange={e => updateVariant(idx, { stock: parseInt(e.target.value) || 0 })} />
                      </div>
                      <div className="flex flex-col gap-2 justify-end">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" checked={v.is_active}
                            onChange={e => updateVariant(idx, { is_active: e.target.checked })}
                            className="w-4 h-4 rounded" />
                          Variante active
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input type="checkbox" checked={v.out_of_stock}
                            onChange={e => updateVariant(idx, { out_of_stock: e.target.checked })}
                            className="w-4 h-4 rounded" />
                          <span style={{ color: v.out_of_stock ? 'var(--destructive)' : 'inherit' }}>
                            Rupture de stock
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* ── PRIX PAR ZONE ── */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-2">Prix par zone</p>
                    <div className="flex flex-col gap-2">
                      {v.prices.map((p, pi) => (
                        <div key={pi} className="flex items-center gap-3">
                          <span className="text-xs w-32 shrink-0 opacity-60">{p.zone_label}</span>
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

      <div className="flex gap-3 pb-2">
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
