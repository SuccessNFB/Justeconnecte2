import Link from 'next/link'

function PaymentLogos() {
  const card = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 52, height: 34, borderRadius: 6,
    border: '1px solid var(--border-strong)',
    background: 'var(--background)',
    overflow: 'hidden' as const,
    flexShrink: 0 as const,
  }
  return (
    <div className="flex flex-wrap gap-2">

      {/* Visa */}
      <div style={card} title="Visa">
        <svg viewBox="0 0 52 20" width="42" height="16" aria-label="Visa">
          <text x="26" y="10" textAnchor="middle" dominantBaseline="central" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="17" fill="#1A1F71" letterSpacing="-1">VISA</text>
        </svg>
      </div>

      {/* Mastercard */}
      <div style={card} title="Mastercard">
        <svg viewBox="0 0 38 24" height="22" aria-label="Mastercard">
          <circle cx="14" cy="12" r="10" fill="#EB001B"/>
          <circle cx="24" cy="12" r="10" fill="#F79E1B"/>
          <path d="M19 5.3a10 10 0 0 1 0 13.4A10 10 0 0 1 19 5.3z" fill="#FF5F00"/>
        </svg>
      </div>

      {/* Apple Pay */}
      <div style={{ ...card, background: '#000', border: '1px solid #000' }} title="Apple Pay">
        <span style={{ color: 'white', fontSize: '9px', fontWeight: 700, fontFamily: '-apple-system,BlinkMacSystemFont,Helvetica,sans-serif', letterSpacing: '-0.2px', lineHeight: 1 }}>
          Apple Pay
        </span>
      </div>

      {/* Google Pay */}
      <div style={card} title="Google Pay">
        <span style={{ fontSize: '9px', fontWeight: 600, fontFamily: 'Arial,Helvetica,sans-serif', color: '#3C4043', letterSpacing: '-0.2px', lineHeight: 1 }}>
          Google Pay
        </span>
      </div>

      {/* PayPal */}
      <div style={card} title="PayPal">
        <svg viewBox="0 0 72 20" width="58" height="16" aria-label="PayPal">
          <text x="0" y="10" dominantBaseline="central" fontFamily="Arial,Helvetica,sans-serif" fontWeight="800" fontStyle="italic" fontSize="15" fill="#003087">Pay</text>
          <text x="26" y="10" dominantBaseline="central" fontFamily="Arial,Helvetica,sans-serif" fontWeight="800" fontStyle="italic" fontSize="15" fill="#009cde">Pal</text>
        </svg>
      </div>

      {/* Revolut */}
      <div style={{ ...card, background: '#191C1F', border: '1px solid #191C1F' }} title="Revolut">
        <span style={{ color: 'white', fontSize: '9px', fontWeight: 700, fontFamily: 'Arial,Helvetica,sans-serif', letterSpacing: '-0.2px', lineHeight: 1 }}>
          Revolut
        </span>
      </div>

    </div>
  )
}

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
            <PaymentLogos />
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
