'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import {
  Upload, Check, ImageIcon, Trash2,
  ChevronLeft, ChevronRight, ChevronDown,
} from 'lucide-react'

const BUCKET = 'products'

type VariantRow = {
  id: string
  color_name: string
  color_hex: string
  images: string[] | null
}

type ProductRow = {
  id: string
  slug: string
  name: string
  image_url: string | null
  images: string[] | null
  brands: { name: string } | { name: string }[] | null
  product_variants: VariantRow[]
}

type UploadState = 'idle' | 'uploading' | 'done' | 'error'

export default function AdminImagesPage() {
  const supabase = createClient()
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadProducts() }, [])

  async function loadProducts() {
    const { data } = await supabase
      .from('products')
      .select('id, slug, name, image_url, images, brands(name), product_variants(id, color_name, color_hex, images)')
      .order('created_at', { ascending: false })
    setProducts((data as unknown as ProductRow[]) ?? [])
    setLoading(false)
  }

  function updateProduct(updated: ProductRow) {
    setProducts(ps => ps.map(p => p.id === updated.id ? updated : p))
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold)' }} />
    </div>
  )

  const withImages    = products.filter(p => p.image_url || (p.images?.length ?? 0) > 0)
  const withoutImages = products.filter(p => !p.image_url && !(p.images?.length ?? 0))

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bold text-2xl mb-1">Images produits</h1>
        <p className="text-sm opacity-50">
          {withImages.length}/{products.length} produits avec image · Gérez les photos par couleur
        </p>
      </div>

      {withoutImages.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4">
            Sans image ({withoutImages.length})
          </p>
          <div className="flex flex-col gap-3">
            {withoutImages.map(p => (
              <ProductImageSection key={p.id} product={p} supabase={supabase} onUpdate={updateProduct} />
            ))}
          </div>
        </div>
      )}

      {withImages.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4">
            Avec image ({withImages.length})
          </p>
          <div className="flex flex-col gap-3">
            {withImages.map(p => (
              <ProductImageSection key={p.id} product={p} supabase={supabase} onUpdate={updateProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── ProductImageSection ────────────────────────────────────────────────────

function ProductImageSection({
  product,
  supabase,
  onUpdate,
}: {
  product: ProductRow
  supabase: ReturnType<typeof createClient>
  onUpdate: (p: ProductRow) => void
}) {
  const [expanded, setExpanded]     = useState(false)
  const [uploadState, setUploadState] = useState<Record<string, UploadState>>({})
  const [errors, setErrors]         = useState<Record<string, string>>({})

  const totalImages =
    (product.images?.length ?? 0) +
    product.product_variants.reduce((s, v) => s + (v.images?.length ?? 0), 0)

  const brandName: string =
    !product.brands ? '' :
    Array.isArray(product.brands) ? (product.brands[0]?.name ?? '') :
    product.brands.name

  async function handleUpload(
    key: string,
    storagePath: string,
    files: FileList | null,
    save: (urls: string[]) => Promise<void>
  ) {
    if (!files || files.length === 0) return
    setUploadState(s => ({ ...s, [key]: 'uploading' }))
    setErrors(e => ({ ...e, [key]: '' }))
    try {
      const urls: string[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const ext  = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const path = `${storagePath}/${Date.now()}-${i}.${ext}`
        const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, contentType: file.type })
        if (error) throw new Error(error.message)
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
        urls.push(data.publicUrl)
      }
      await save(urls)
      setUploadState(s => ({ ...s, [key]: 'done' }))
      setTimeout(() => setUploadState(s => ({ ...s, [key]: 'idle' })), 2500)
    } catch (err: any) {
      setErrors(e => ({ ...e, [key]: err.message ?? 'Erreur' }))
      setUploadState(s => ({ ...s, [key]: 'error' }))
    }
  }

  // ── Product-level helpers ──
  async function saveProductImages(newUrls: string[]) {
    const all = [...(product.images ?? []), ...newUrls]
    const primaryUrl = product.image_url ?? newUrls[0]
    const { error } = await supabase.from('products').update({ image_url: primaryUrl, images: all }).eq('id', product.id)
    if (error) throw new Error(error.message)
    onUpdate({ ...product, image_url: primaryUrl, images: all })
  }

  async function reorderProductImages(images: string[]) {
    const { error } = await supabase.from('products').update({ image_url: images[0] ?? null, images }).eq('id', product.id)
    if (!error) onUpdate({ ...product, image_url: images[0] ?? null, images })
  }

  async function deleteProductImage(url: string) {
    const images = (product.images ?? []).filter(u => u !== url)
    const image_url = images[0] ?? null
    const { error } = await supabase.from('products').update({ image_url, images }).eq('id', product.id)
    if (!error) onUpdate({ ...product, image_url, images })
  }

  // ── Variant-level helpers ──
  function patchVariant(id: string, images: string[]) {
    return {
      ...product,
      product_variants: product.product_variants.map(v => v.id === id ? { ...v, images } : v),
    }
  }

  async function saveVariantImages(variant: VariantRow, newUrls: string[]) {
    const all = [...(variant.images ?? []), ...newUrls]
    const { error } = await supabase.from('product_variants').update({ images: all }).eq('id', variant.id)
    if (error) throw new Error(error.message)
    onUpdate(patchVariant(variant.id, all))
  }

  async function reorderVariantImages(variant: VariantRow, images: string[]) {
    const { error } = await supabase.from('product_variants').update({ images }).eq('id', variant.id)
    if (!error) onUpdate(patchVariant(variant.id, images))
  }

  async function deleteVariantImage(variant: VariantRow, url: string) {
    const images = (variant.images ?? []).filter(u => u !== url)
    const { error } = await supabase.from('product_variants').update({ images }).eq('id', variant.id)
    if (!error) onUpdate(patchVariant(variant.id, images))
  }

  return (
    <div className="jc-card overflow-hidden">
      {/* ── Header (always visible) ── */}
      <button
        className="w-full flex items-center gap-4 p-4 text-left transition-colors hover:bg-black/[0.03]"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden" style={{ background: 'var(--surface)' }}>
          {product.image_url
            ? <img src={product.image_url} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center opacity-20"><ImageIcon size={24} /></div>
          }
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">{brandName}</p>
          <p className="font-semibold text-sm leading-snug">{product.name}</p>
          <p className="text-xs opacity-40 mt-0.5">
            {totalImages} photo{totalImages !== 1 ? 's' : ''} · {product.product_variants.length} couleur{product.product_variants.length !== 1 ? 's' : ''}
          </p>
        </div>

        <ChevronDown
          size={16}
          className="shrink-0 opacity-40 transition-transform duration-200"
          style={{ transform: expanded ? 'rotate(180deg)' : 'none' }}
        />
      </button>

      {/* ── Expanded content ── */}
      {expanded && (
        <div className="border-t p-4 flex flex-col gap-6" style={{ borderColor: 'var(--border)' }}>
          {/* Product-level photos */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-3">
              Photos générales du produit
            </p>
            <ImageGallery
              images={product.images ?? []}
              uploadState={uploadState['main'] ?? 'idle'}
              error={errors['main'] ?? ''}
              onUpload={files => handleUpload('main', `${product.slug}/main`, files, saveProductImages)}
              onReorder={reorderProductImages}
              onDelete={deleteProductImage}
            />
          </div>

          {/* Per-variant photos */}
          {product.product_variants.length > 0 && (
            <div className="flex flex-col gap-5">
              <p className="text-xs font-bold uppercase tracking-widest opacity-40">
                Photos par couleur
              </p>
              {product.product_variants.map(variant => (
                <div key={variant.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-4 h-4 rounded-full border-2 shrink-0"
                      style={{ background: variant.color_hex, borderColor: 'var(--border-strong)' }}
                    />
                    <p className="text-sm font-semibold">{variant.color_name}</p>
                    <span className="text-xs opacity-40">
                      {variant.images?.length ?? 0} photo{(variant.images?.length ?? 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <ImageGallery
                    images={variant.images ?? []}
                    uploadState={uploadState[variant.id] ?? 'idle'}
                    error={errors[variant.id] ?? ''}
                    onUpload={files => handleUpload(variant.id, `${product.slug}/${variant.id}`, files, urls => saveVariantImages(variant, urls))}
                    onReorder={imgs => reorderVariantImages(variant, imgs)}
                    onDelete={url => deleteVariantImage(variant, url)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── ImageGallery ───────────────────────────────────────────────────────────

function ImageGallery({
  images,
  uploadState,
  error,
  onUpload,
  onReorder,
  onDelete,
}: {
  images: string[]
  uploadState: UploadState
  error: string
  onUpload: (files: FileList | null) => void
  onReorder: (images: string[]) => void
  onDelete: (url: string) => void
}) {
  const [idx, setIdx] = useState(0)
  const current = Math.min(idx, Math.max(0, images.length - 1))

  function move(i: number, dir: -1 | 1) {
    const next = [...images]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    onReorder(next)
    setIdx(j)
  }

  // Empty state
  if (images.length === 0) {
    return (
      <div>
        <label className="block cursor-pointer">
          <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple className="hidden"
            disabled={uploadState === 'uploading'} onChange={e => onUpload(e.target.files)} />
          <div
            className="flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed opacity-40 hover:opacity-60 transition-opacity text-sm"
            style={{ borderColor: 'var(--border-strong)' }}
          >
            {uploadState === 'uploading'
              ? <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)' }} />
              : <Upload size={20} />
            }
            <span>{uploadState === 'uploading' ? 'Envoi…' : 'Cliquer pour ajouter des photos'}</span>
          </div>
        </label>
        {error && <p className="text-[11px] mt-2" style={{ color: 'var(--destructive)' }}>{error}</p>}
      </div>
    )
  }

  return (
    <div>
      {/* Main preview */}
      <div className="relative rounded-xl overflow-hidden mb-3" style={{ background: 'var(--surface)' }}>
        <div className="aspect-[4/3] relative flex items-center justify-center">
          <img src={images[current]} alt="" className="max-w-full max-h-full object-contain" />
        </div>

        {images.length > 1 && (
          <>
            <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={current === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center disabled:opacity-20 hover:bg-black/70 transition-colors">
              <ChevronLeft size={16} className="text-white" />
            </button>
            <button onClick={() => setIdx(i => Math.min(images.length - 1, i + 1))} disabled={current === images.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center disabled:opacity-20 hover:bg-black/70 transition-colors">
              <ChevronRight size={16} className="text-white" />
            </button>
          </>
        )}

        <span className="absolute bottom-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white bg-black/60">
          {current + 1}/{images.length}
          {current === 0 && ' · principale'}
        </span>
      </div>

      {/* Thumbnails row */}
      <div className="flex gap-2 flex-wrap items-center">
        {images.map((url, i) => (
          <div key={url} className="relative group">
            <button onClick={() => setIdx(i)}
              className="block w-14 h-14 rounded-lg overflow-hidden border-2 transition-all"
              style={{ borderColor: i === current ? 'var(--primary)' : 'transparent', background: 'var(--surface)' }}>
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
            <button
              onClick={() => { onDelete(url); setIdx(0) }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              <Trash2 size={9} />
            </button>
          </div>
        ))}

        {/* Add more photos */}
        <label className="block cursor-pointer shrink-0">
          <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple className="hidden"
            disabled={uploadState === 'uploading'} onChange={e => onUpload(e.target.files)} />
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center border-2 border-dashed opacity-40 hover:opacity-70 transition-opacity"
            style={{ borderColor: 'var(--border-strong)' }}
          >
            {uploadState === 'uploading'
              ? <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)' }} />
              : uploadState === 'done'
                ? <Check size={16} className="text-green-500" />
                : <Upload size={14} />
            }
          </div>
        </label>
      </div>

      {/* Reorder controls */}
      {images.length > 1 && (
        <div className="flex items-center gap-1 mt-3 text-xs opacity-60">
          <span className="mr-1">Réordonner :</span>
          <button onClick={() => move(current, -1)} disabled={current === 0}
            className="px-2 py-1 rounded-lg hover:bg-black/5 disabled:opacity-30 transition-colors flex items-center gap-1">
            <ChevronLeft size={12} /> Gauche
          </button>
          <button onClick={() => move(current, 1)} disabled={current === images.length - 1}
            className="px-2 py-1 rounded-lg hover:bg-black/5 disabled:opacity-30 transition-colors flex items-center gap-1">
            Droite <ChevronRight size={12} />
          </button>
          {current === 0 && <span className="ml-1 opacity-50">(photo principale)</span>}
        </div>
      )}

      {error && <p className="text-[11px] mt-2" style={{ color: 'var(--destructive)' }}>{error}</p>}
    </div>
  )
}
