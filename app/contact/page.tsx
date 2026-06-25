import { createClient } from '@/lib/supabase'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact' }
export const revalidate = 60

async function getContent() {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('site_content')
      .select('value')
      .eq('page', 'contact')
      .eq('section', 'main')
      .eq('key', 'content')
      .maybeSingle()
    return data?.value ?? ''
  } catch { return '' }
}

export default async function ContactPage() {
  const content = await getContent()
  return (
    <div className="py-16">
      <div className="jc-container max-w-2xl">
        <h1 className="text-3xl font-bold mb-10">Contact</h1>
        {content ? (
          <div className="jc-card p-8">
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'oklch(0.18 0.004 264 / 0.75)' }}>
              {content}
            </p>
          </div>
        ) : (
          <div className="jc-card p-12 text-center" style={{ opacity: 0.4 }}>
            <p className="text-4xl mb-3">📬</p>
            <p className="font-medium">Page en cours de rédaction.</p>
          </div>
        )}
      </div>
    </div>
  )
}
