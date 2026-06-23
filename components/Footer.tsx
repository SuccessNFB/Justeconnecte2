import Link from 'next/link'

const PAYMENT_LOGOS = ['Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'Scalapay', 'Revolut']

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
              Revendeur de smartphones authentiques en Guadeloupe, Martinique et Guyane. Livraison express, garantie constructeur, support réactif.
            </p>
          </div>

          {/* Boutique */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40">Boutique</p>
            <ul className="flex flex-col gap-2 text-sm opacity-60">
              {['Apple', 'Samsung', 'Xiaomi', 'Google Pixel', 'Tout le catalogue'].map(l => (
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
              {['Livraison Guadeloupe et Martinique', 'Retours et garantie', 'Suivre ma commande', 'Contact'].map(l => (
                <li key={l}><a href="#" className="hover:opacity-100 transition-opacity">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Paiement */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-4 opacity-40">Paiement</p>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_LOGOS.map(p => (
                <span key={p}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-md border"
                  style={{ borderColor: 'var(--border-strong)', opacity: 0.6 }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs opacity-35"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p>&copy; {year} Juste Connecté · Tous droits réservés</p>
          <div className="flex gap-4">
            <a href="#">Mentions légales</a>
            <a href="#">CGV</a>
            <a href="#">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
