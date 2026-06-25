import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { ZoneProvider } from '@/contexts/ZoneContext'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import SiteShell from '@/components/SiteShell'
import AnalyticsTracker from '@/components/AnalyticsTracker'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Juste Connecté — Smartphones neufs livrés aux Antilles & Guyane',
    template: '%s | Juste Connecté',
  },
  description: 'Achetez votre smartphone neuf — iPhone, Samsung, Xiaomi — livré en Guadeloupe, Martinique et Guyane. Prix compétitifs, garantie constructeur, paiement en 4× sans frais.',
  keywords: ['smartphone neuf', 'iPhone Antilles', 'Samsung Guadeloupe', 'Xiaomi Martinique', 'téléphone Guyane', 'livraison Antilles', 'paiement 4 fois'],
  metadataBase: new URL('https://justeconnecte2.vercel.app'),
  openGraph: {
    siteName: 'Juste Connecté',
    locale: 'fr_FR',
    type: 'website',
    title: 'Juste Connecté — Smartphones neufs livrés aux Antilles & Guyane',
    description: 'iPhone, Samsung, Xiaomi neufs livrés en Guadeloupe, Martinique et Guyane. Garantie constructeur, paiement en 4× sans frais.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Juste Connecté — Smartphones neufs Antilles & Guyane',
    description: 'iPhone, Samsung, Xiaomi neufs. Livraison Antilles & Guyane.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={outfit.variable}>
      <body>
        <ZoneProvider>
          <CartProvider>
            <WishlistProvider>
              <AnalyticsTracker />
              <SiteShell>{children}</SiteShell>
            </WishlistProvider>
          </CartProvider>
        </ZoneProvider>
      </body>
    </html>
  )
}
