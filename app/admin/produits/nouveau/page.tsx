import ProductForm from '@/components/ui/ProductForm'

export const dynamic = 'force-dynamic'

export default function NouveauProduit() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Nouveau produit</h1>
      <ProductForm />
    </div>
  )
}
