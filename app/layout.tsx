import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { ZoneProvider } from '@/contexts/ZoneContext'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { ToastProvider } from '@/contexts/ToastContext'
import SiteShell from '@/components/SiteShell'
import AnalyticsTracker from '@/components/AnalyticsTracker'

const META_PIXEL_ID  = process.env.NEXT_PUBLIC_META_PIXEL_ID
const GTM_ID         = process.env.NEXT_PUBLIC_GTM_ID

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
  metadataBase: new URL('https://justeconnecte.fr'),
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
      {GTM_ID && (
        <head>
          {/* ── Google Tag Manager — script in <head> ── */}
          <script dangerouslySetInnerHTML={{ __html:
            `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':` +
            `new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],` +
            `j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=` +
            `'https://www.googletagmanager.com/gtm.js?id='+i+dl;` +
            `f.parentNode.insertBefore(j,f);` +
            `})(window,document,'script','dataLayer','${GTM_ID}');`
          }} />
        </head>
      )}
      <body>
        {/* ── Google Tag Manager — noscript immediately after <body> ── */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0" width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {/* ── Meta Pixel ── */}
        {META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}</Script>
        )}

        <ZoneProvider>
          <CartProvider>
            <WishlistProvider>
              <ToastProvider>
                <AnalyticsTracker />
                <SiteShell>{children}</SiteShell>
              </ToastProvider>
            </WishlistProvider>
          </CartProvider>
        </ZoneProvider>
      </body>
    </html>
  )
}
