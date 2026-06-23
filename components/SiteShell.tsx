'use client'
import { usePathname } from 'next/navigation'
import AnnouncementBar from './AnnouncementBar'
import Header from './Header'
import Footer from './Footer'
import ZoneSelector from './ZoneSelector'

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header />
      <ZoneSelector />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
