import Link from 'next/link'
import { Zap } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer
      className="mt-auto pt-16 pb-8"
      style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}
    >
      <div className="jc-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-base mb-3">
              <span
                className="flex items-center justify-center w-7 h-7 rounded-lg text-white"
                style={{ background: 'var(--primary)' }}
              >
                <Zap size={14} fill="currentColor" />
              </span>
              Juste Connecté
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'oklch(0.18 0.004 264 / 0.5)' }}>
              Smartphones reconditionnés certifiés pour les Antilles &amp; la Guyane françaises.
            </p>
          </div>

          {/* Boutique */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Boutique</h3>
            <ul className="flex flex-col gap-2 text-sm" style={{ color: 'oklch(0.18 0.004 264 / 0.55)' }}>
              <li><Link href="/boutique" className="hover:opacity-100 transition-opacity">Tous les produits</Link></li>
              <li><Link href="/boutique?marque=apple" className="hover:opacity-100 transition-opacity">Apple</Link></li>
              <li><Link href="/boutique?marque=samsung" className="hover:opacity-100 transition-opacity">Samsung</Link></li>
              <li><Link href="/boutique?marque=google" className="hover:opacity-100 transition-opacity">Google</Link></li>
            </ul>
          </div>

          {/* Infos */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Informations</h3>
            <ul className="flex flex-col gap-2 text-sm" style={{ color: 'oklch(0.18 0.004 264 / 0.55)' }}>
              <li><a href="#" className="hover:opacity-100 transition-opacity">À propos</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Garantie &amp; SAV</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Livraison</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Contact</a></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Légal</h3>
            <ul className="flex flex-col gap-2 text-sm" style={{ color: 'oklch(0.18 0.004 264 / 0.55)' }}>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Mentions légales</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">CGV</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs"
          style={{ borderTop: '1px solid var(--border)', color: 'oklch(0.18 0.004 264 / 0.4)' }}
        >
          <p>&copy; {year} Juste Connecté. Tous droits réservés.</p>
          <p>Smartphones reconditionnés — Antilles &amp; Guyane françaises</p>
        </div>
      </div>
    </footer>
  )
}
