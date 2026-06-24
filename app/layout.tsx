import type { Metadata } from 'next'
import './globals.css'
import { ZoneProvider } from '@/contexts/ZoneContext'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import SiteShell from '@/components/SiteShell'
import AnalyticsTracker from '@/components/AnalyticsTracker'

export const metadata: Metadata = {
  title: { default: 'Juste Connecté — Smartphones Reconditionnés Antilles & Guyane', template: '%s | Juste Connecté' },
  description: 'Smartphones reconditionnés certifiés, livrés aux Antilles et en Guyane. Qualité premium, prix juste, garantie 12 mois.',
  keywords: ['smartphone reconditionné', 'Antilles', 'Guyane', 'Martinique', 'Guadeloupe', 'iPhone', 'Samsung'],
  openGraph: {
    siteName: 'Juste Connecté',
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
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
