import { redirect } from 'next/navigation'

export default function ProductRedirect({ params }: { params: { slug: string } }) {
  redirect(`/boutique/${params.slug}`)
}
