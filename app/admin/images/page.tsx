'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import { Upload, Check, ImageIcon, Trash2 } from 'lucide-react'

const BUCKET = 'products'

type ProductRow = {
  id: string
  slug: string
  name: string
  image_url: string | null
  images: string[] | null
  brands: { name: string }[] | null
}

type UploadState = 'idle' | 'uploading' | 'done' | 'error'

export default function AdminImagesPage() {
  const supabase = createClient()
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState<Record<string, UploadState>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => { loadProducts() }, [])

  async function loadProducts() {
    const { data } = await supabase
      .from('products')
      .select('id, slug, name, image_url, images, brands(name)')
      .order('created_at', { ascending: false })
    setProducts((data as ProductRow[]) ?? [])
    setLoading(false)
  }

  async function handleUpload(product: ProductRow, files: FileList | null) {
    if (!files || files.length === 0) return
    setState(s => ({ ...s, [product.id]: 'uploading' }))
    setErrors(e => ({ ...e, [product.id]: '' }))

    try {
      const existingImages: string[] = product.images ?? []
      const newUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const path = `${product.slug}/${Date.now()}-${i}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { upsert: true, contentType: file.type })

        if (uploadError) throw new Error(uploadError.message)

        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
        newUrls.push(urlData.publicUrl)
      }

      const allImages = [...existingImages, ...newUrls]
      const primaryUrl = product.image_url ?? newUrls[0]

      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: primaryUrl, images: allImages })
        .eq('id', product.id)

      if (updateError) throw new Error(updateError.message)

      setProducts(ps => ps.map(p =>
        p.id === product.id
          ? { ...p, image_url: primaryUrl, images: allImages }
          : p
      ))
      setState(s => ({ ...s, [product.id]: 'done' }))
      setTimeout(() => setState(s => ({ ...s, [product.id]: 'idle' })), 2500)
    } catch (err: any) {
      setErrors(e => ({ ...e, [product.id]: err.message ?? 'Erreur lors de l\'upload' }))
      setState(s => ({ ...s, [product.id]: 'error' }))
    }
  }

  async function handleRemoveImages(product: ProductRow) {
    if (!confirm(`Supprimer toutes les images de ${product.name} ?`)) return
    const { error } = await supabase
      .from('products')
      .update({ image_url: null, images: [] })
      .eq('id', product.id)
    if (!error) {
      setProducts(ps => ps.map(p =>
        p.id === product.id ? { ...p, image_url: null, images: [] } : p
      ))
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold)' }} />
    </div>
  )

  const withImages = products.filter(p => p.image_url)
  const withoutImages = products.filter(p => !p.image_url)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-bold text-2xl mb-1">Images produits</h1>
          <p className="text-sm opacity-50">
            {withImages.length}/{products.length} produits avec image
          </p>
        </div>
      </div>

      {/* Products missing images first */}
      {withoutImages.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4">
            Sans image ({withoutImages.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {withoutImages.map(p => (
              <ProductImageCard
                key={p.id}
                product={p}
                uploadState={state[p.id] ?? 'idle'}
                error={errors[p.id] ?? ''}
                fileRef={el => { fileRefs.current[p.id] = el }}
                onUpload={files => handleUpload(p, files)}
                onRemove={() => handleRemoveImages(p)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Products with images */}
      {withImages.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4">
            Avec image ({withImages.length})
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {withImages.map(p => (
              <ProductImageCard
                key={p.id}
                product={p}
                uploadState={state[p.id] ?? 'idle'}
                error={errors[p.id] ?? ''}
                fileRef={el => { fileRefs.current[p.id] = el }}
                onUpload={files => handleUpload(p, files)}
                onRemove={() => handleRemoveImages(p)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ProductImageCard({
  product,
  uploadState,
  error,
  fileRef,
  onUpload,
  onRemove,
}: {
  product: ProductRow
  uploadState: UploadState
  error: string
  fileRef: (el: HTMLInputElement | null) => void
  onUpload: (files: FileList | null) => void
  onRemove: () => void
}) {
  const imgCount = product.images?.length ?? 0

  return (
    <div className="jc-card overflow-hidden">
      {/* Image preview */}
      <div className="relative w-full aspect-[4/3] overflow-hidden"
        style={{ background: 'var(--surface)' }}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 300px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20">
            <ImageIcon size={40} />
          </div>
        )}

        {/* Remove button */}
        {product.image_url && (
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 hover:bg-red-600 transition-colors z-10"
          >
            <Trash2 size={12} className="text-white" />
          </button>
        )}

        {/* Image count badge */}
        {imgCount > 0 && (
          <span className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full text-white bg-black/60">
            {imgCount} photo{imgCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Info + upload */}
      <div className="p-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest opacity-40 mb-0.5">
          {product.brands?.[0]?.name}
        </p>
        <p className="font-semibold text-sm leading-snug mb-3">{product.name}</p>

        <label className="block w-full cursor-pointer">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="hidden"
            ref={fileRef}
            disabled={uploadState === 'uploading'}
            onChange={e => onUpload(e.target.files)}
          />
          <span className={`flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-sm font-semibold transition-all
            ${uploadState === 'uploading' ? 'opacity-60 cursor-wait' : 'cursor-pointer'}
            ${uploadState === 'done' ? 'text-green-600' : ''}
            ${uploadState === 'error' ? 'text-red-600' : ''}`}
            style={{
              background: uploadState === 'done'
                ? 'var(--surface)'
                : uploadState === 'error'
                  ? 'var(--surface)'
                  : 'var(--primary)',
              color: uploadState === 'idle' || uploadState === 'uploading' ? 'white' : undefined,
            }}
          >
            {uploadState === 'uploading' && (
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin border-white" />
            )}
            {uploadState === 'done' && <Check size={14} />}
            {uploadState === 'idle' && <Upload size={14} />}
            {uploadState === 'error' && <Upload size={14} />}
            {uploadState === 'uploading' ? 'Envoi…' :
             uploadState === 'done' ? 'Envoyé !' :
             uploadState === 'error' ? 'Réessayer' :
             product.image_url ? 'Ajouter des photos' : 'Envoyer des photos'}
          </span>
        </label>

        {error && (
          <p className="text-[11px] mt-2 leading-snug" style={{ color: 'var(--destructive)' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
