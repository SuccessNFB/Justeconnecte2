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
        <svg viewBox="0 0 80 26" height="14" aria-label="Visa">
          <text x="0" y="22" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="26" fill="#1A1F71" letterSpacing="-1">VISA</text>
        </svg>
      </div>

      {/* Mastercard */}
      <div style={card} title="Mastercard">
        <svg viewBox="0 0 38 24" height="24" aria-label="Mastercard">
          <circle cx="14" cy="12" r="10" fill="#EB001B"/>
          <circle cx="24" cy="12" r="10" fill="#F79E1B"/>
          <path d="M19 5.3a10 10 0 0 1 0 13.4A10 10 0 0 1 19 5.3z" fill="#FF5F00"/>
        </svg>
      </div>

      {/* Apple Pay */}
      <div style={{ ...card, background: '#000', borderColor: '#000' }} title="Apple Pay">
        <svg viewBox="0 0 56 22" height="16" aria-label="Apple Pay">
          <path d="M9.1 3.7C8.4 4.5 7.3 5.1 6.2 5c-.1-1.1.4-2.2 1-2.9C7.9 1.3 9.1.7 10 .7c.1 1.1-.3 2.2-1 3zm1 1.6c-1.7-.1-3.1.9-3.9.9-.8 0-2-.9-3.3-.9C1.2 5.4 0 6.5 0 9c0 3.5 2.3 8 4.1 8 .7 0 1.7-.7 3-.7 1.3 0 1.9.7 3.2.7C12 17 14 13 14 10c-.1-.1-2.9-1.3-2.9-4.7zM22.4 1.9h-3.2v8h3.3c2 0 3.2-1.1 3.2-3.1 0-1.9-1.2-4.9-3.3-4.9zm-.1 6.8h-1.8v-5.5h1.8c1.3 0 2 .9 2 2.8 0 1.8-.7 2.7-2 2.7zM28.5 5.3c-1.8 0-3 1.3-3 3.5s1.2 3.5 3 3.5c1 0 1.7-.5 2.1-1.1v1h1.3V5.4h-1.3v1c-.4-.6-1.1-1.1-2.1-1.1zm.4 5.7c-1.1 0-1.8-.8-1.8-2.2s.7-2.2 1.8-2.2c1.1 0 1.8.8 1.8 2.2s-.7 2.2-1.8 2.2zM38 5.3c-1.1 0-1.9.5-2.3 1.3V5.4h-1.3v8h1.4v-3.1c.4.8 1.2 1.2 2.2 1.2 1.8 0 2.9-1.3 2.9-3.5.1-2.1-1-4.7-2.9-4.7zm-.4 5.7c-1.1 0-1.8-.8-1.8-2.2s.7-2.2 1.8-2.2c1.1 0 1.8.8 1.8 2.2s-.7 2.2-1.8 2.2z" fill="white"/>
        </svg>
      </div>

      {/* Google Pay */}
      <div style={card} title="Google Pay">
        <svg viewBox="0 0 54 22" height="18" aria-label="Google Pay">
          <text x="0" y="16" fontFamily="Arial,Helvetica,sans-serif" fontWeight="500" fontSize="15" fill="#3C4043">G</text>
          <text x="11" y="16" fontFamily="Arial,Helvetica,sans-serif" fontWeight="400" fontSize="15" fill="#3C4043"> Pay</text>
          {/* coloured dots on the G */}
          <rect x="0" y="17" width="4" height="2" fill="#4285F4"/>
          <rect x="4" y="17" width="4" height="2" fill="#EA4335"/>
          {/* simplification: just use text */}
        </svg>
      </div>

      {/* Scalapay */}
      <div style={card} title="Scalapay">
        <svg viewBox="0 0 70 22" height="13" aria-label="Scalapay">
          <text x="0" y="17" fontFamily="Arial,Helvetica,sans-serif" fontWeight="800" fontSize="17" fill="#FF4A8D" letterSpacing="-0.5">Scala</text>
          <text x="41" y="17" fontFamily="Arial,Helvetica,sans-serif" fontWeight="800" fontSize="17" fill="#1A1A2E" letterSpacing="-0.5">pay</text>
        </svg>
      </div>

      {/* Revolut */}
      <div style={{ ...card, background: '#191C1F', borderColor: '#191C1F' }} title="Revolut">
        <svg viewBox="0 0 70 22" height="13" aria-label="Revolut">
          <text x="2" y="17" fontFamily="Arial,Helvetica,sans-serif" fontWeight="700" fontSize="16" fill="white" letterSpacing="-0.3">Revolut</text>
        </svg>
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
              Revendeur de smartphones authentiques. Livraison express, garantie constructeur, support réactif.
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
              {['Retours et garantie', 'Suivre ma commande', 'Contact'].map(l => (
                <li key={l}><a href="#" className="hover:opacity-100 transition-opacity">{l}</a></li>
              ))}
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
            <a href="#">Mentions légales</a>
            <a href="#">CGV</a>
            <a href="#">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
