import { redirect } from 'next/navigation'

export default async function ProductRedirect(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  redirect(`/boutique/${params.slug}`)
}
