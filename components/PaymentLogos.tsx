/** Vrais logos vectoriels des moyens de paiement acceptés — réutilisés partout (footer, accueil, fiche produit). */

const card = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 6,
  border: '1px solid var(--border-strong)',
  overflow: 'hidden' as const,
  flexShrink: 0 as const,
}

export function VisaLogo({ width = 52, height = 34 }: { width?: number; height?: number }) {
  return (
    <div style={{ ...card, width, height, background: 'var(--background)' }} title="Visa">
      <svg viewBox="0 0 52 20" width={width * 0.8} height={height * 0.45} aria-label="Visa">
        <text x="26" y="10" textAnchor="middle" dominantBaseline="central" fontFamily="Arial,Helvetica,sans-serif" fontWeight="900" fontSize="17" fill="#1A1F71" letterSpacing="-1">VISA</text>
      </svg>
    </div>
  )
}

export function MastercardLogo({ width = 52, height = 34 }: { width?: number; height?: number }) {
  return (
    <div style={{ ...card, width, height, background: 'var(--background)' }} title="Mastercard">
      <svg viewBox="0 0 38 24" height={height * 0.9} aria-label="Mastercard">
        <circle cx="14" cy="12" r="10" fill="#EB001B"/>
        <circle cx="24" cy="12" r="10" fill="#F79E1B"/>
        <path d="M19 5.3a10 10 0 0 1 0 13.4A10 10 0 0 1 19 5.3z" fill="#FF5F00"/>
      </svg>
    </div>
  )
}

export function ApplePayLogo({ width = 52, height = 34 }: { width?: number; height?: number }) {
  return (
    <div style={{ ...card, width, height, background: '#000', border: '1px solid #000' }} title="Apple Pay">
      <span style={{ color: 'white', fontSize: 9, fontWeight: 700, fontFamily: '-apple-system,BlinkMacSystemFont,Helvetica,sans-serif', letterSpacing: '-0.2px', lineHeight: 1 }}>
        Apple Pay
      </span>
    </div>
  )
}

export function GooglePayLogo({ width = 52, height = 34 }: { width?: number; height?: number }) {
  return (
    <div style={{ ...card, width, height, background: 'var(--background)' }} title="Google Pay">
      <span style={{ fontSize: 9, fontWeight: 600, fontFamily: 'Arial,Helvetica,sans-serif', color: '#3C4043', letterSpacing: '-0.2px', lineHeight: 1 }}>
        Google Pay
      </span>
    </div>
  )
}

export function ScalapayLogo({ width = 52, height = 34 }: { width?: number; height?: number }) {
  return (
    <div style={{ ...card, width, height, background: 'var(--background)' }} title="Scalapay">
      <span style={{ fontSize: 9, fontWeight: 700, fontFamily: 'Arial,Helvetica,sans-serif', color: '#1A1A2E', letterSpacing: '-0.2px', lineHeight: 1 }}>
        Scalapay
      </span>
    </div>
  )
}

export function PayPalLogo({ width = 52, height = 34 }: { width?: number; height?: number }) {
  return (
    <div style={{ ...card, width, height, background: 'var(--background)' }} title="PayPal">
      <svg viewBox="0 0 72 20" width={width * 0.8} height={height * 0.45} aria-label="PayPal">
        <text x="0" y="10" dominantBaseline="central" fontFamily="Arial,Helvetica,sans-serif" fontWeight="800" fontStyle="italic" fontSize="15" fill="#003087">Pay</text>
        <text x="26" y="10" dominantBaseline="central" fontFamily="Arial,Helvetica,sans-serif" fontWeight="800" fontStyle="italic" fontSize="15" fill="#009cde">Pal</text>
      </svg>
    </div>
  )
}

export function PaymentLogosRow({ width = 52, height = 34, gap = 8, className = '' }: { width?: number; height?: number; gap?: number; className?: string }) {
  return (
    <div className={`flex flex-wrap ${className}`} style={{ gap }}>
      <VisaLogo width={width} height={height} />
      <MastercardLogo width={width} height={height} />
      <ApplePayLogo width={width} height={height} />
      <GooglePayLogo width={width} height={height} />
      <ScalapayLogo width={width} height={height} />
      <PayPalLogo width={width} height={height} />
    </div>
  )
}
