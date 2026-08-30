import Link from 'next/link'
import { PaymentLogosRow } from '@/components/PaymentLogos'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-auto pt-14 pb-8" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div className="jc-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-semibold text-sm mb-3">Juste Connecté</p>
            <p className="text-xs leading-relaxed opacity-50 mb-4">
              Revendeur de smartphones authentiques. Livraison gratuite, Taxes et octroi de mer inclus, garantie constructeur.
            </p>
          </div>

          {/* Boutique */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40">Boutique</p>
            <ul className="flex flex-col gap-2 text-sm opacity-60">
              {['Apple', 'Samsung', 'Xiaomi', 'GoPro', 'Tout le catalogue'].map(l => (
                <li key={l}>
                  <Link href={`/boutique${l !== 'Tout le catalogue' ? `?marque=${l.toLowerCase()}` : ''}`}
                    className="hover:opacity-100 transition-opacity">{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aide */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40">Aide</p>
            <ul className="flex flex-col gap-2 text-sm opacity-60">
              <li><Link href="/retours-garantie" className="hover:opacity-100 transition-opacity">Retours et garantie</Link></li>
              <li><Link href="/contact" className="hover:opacity-100 transition-opacity">Contact</Link></li>
            </ul>
          </div>

          {/* Paiement */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40">Paiement</p>
            <PaymentLogosRow />
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs opacity-35"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p>&copy; {year} Juste Connecté · Tous droits réservés</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/cgv">CGV</Link>
            <Link href="/confidentialite">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
