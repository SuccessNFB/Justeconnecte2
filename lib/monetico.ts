import crypto from 'crypto'

function usableKey(hexKey: string): Buffer {
  return Buffer.from(hexKey.trim(), 'hex')
}

function hmacSha1(key: Buffer, data: string): string {
  return crypto.createHmac('sha1', key).update(data).digest('hex').toLowerCase()
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function fmtDate(date: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(date.getDate())}/${p(date.getMonth() + 1)}/${date.getFullYear()}`
}

const NOTIFY_MAC_FIELDS = [
  'TPE', 'date', 'montant', 'reference', 'texte-libre', 'code-retour',
  'cvx', 'vld', 'brand', 'status3ds', 'numauto', 'originecb',
  'bincb', 'hpancb', 'ipclient', 'originetr', 'veres', 'pares',
]

export function generateReference(): string {
  return Date.now().toString(36).toUpperCase().slice(-12)
}

export function buildPaymentForm(opts: {
  amountCents:   number
  reference:     string
  description:   string
  zone?:         string
  email?:        string
  successUrl:    string
  cancelUrl:     string
  installments?: 1 | 2 | 3 | 4
}): { action: string; fields: Record<string, string> } {
  const installments = opts.installments ?? 1
  const isFractionne = installments > 1

  const tpe    = isFractionne ? process.env.MONETICO_TPE_FRACTIONNE! : process.env.MONETICO_TPE!
  const hexKey = isFractionne ? process.env.MONETICO_KEY_FRACTIONNE! : process.env.MONETICO_KEY!
  const societe = process.env.MONETICO_SOCIETE ?? 'sfconseil'
  const url     = process.env.MONETICO_URL!

  const now = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  const date = `${p(now.getDate())}/${p(now.getMonth() + 1)}/${now.getFullYear()}:${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`

  const texteLibre = `zone:${opts.zone ?? 'nc'}|${opts.description}`
    .replace(/[*]/g, '')
    .substring(0, 3200)

  const fields: Record<string, string> = {
    TPE:            tpe,
    date,
    montant:        `${(opts.amountCents / 100).toFixed(2)}EUR`,
    reference:      opts.reference,
    'texte-libre':  texteLibre,
    version:        '3.0',
    lgue:           'FR',
    societe,
    url_retour_ok:  opts.successUrl,
    url_retour_err: opts.cancelUrl,
    // Required for Monetico v3.0 (3DS v2). Fields must be non-empty; postal code 5 digits for FR.
    // TODO production: collect real billing address from customer during checkout.
    contexte_commande: Buffer.from(JSON.stringify({
      billing: {
        addressLine1: 'Adresse non renseignee',
        city: 'Non renseignee',
        postalCode: '97200',
        country: 'FR',
      },
    })).toString('base64'),
  }
  if (opts.email) fields.mail = opts.email

  if (isFractionne) {
    fields.nbrech = String(installments)
    const baseAmount = Math.floor(opts.amountCents / installments)
    for (let i = 1; i <= installments; i++) {
      const amount = i === installments
        ? opts.amountCents - baseAmount * (installments - 1)
        : baseAmount
      fields[`dateech${i}`]    = fmtDate(addDays(now, (i - 1) * 30))
      fields[`montantech${i}`] = `${(amount / 100).toFixed(2)}EUR`
    }
  }

  const macStr = Object.keys(fields).sort().map(k => `${k}=${fields[k]}`).join('*')
  console.log('[monetico] tpe=%s montant=%s installments=%d', tpe, fields.montant, installments)
  fields.MAC = hmacSha1(usableKey(hexKey), macStr)

  return { action: url, fields }
}

export function verifyNotifyMac(params: Record<string, string>): boolean {
  const tpe = params['TPE'] ?? ''
  const hexKey = tpe === (process.env.MONETICO_TPE_FRACTIONNE ?? '\0')
    ? process.env.MONETICO_KEY_FRACTIONNE
    : process.env.MONETICO_KEY
  if (!hexKey) return false
  const { MAC, ...rest } = params
  if (!MAC) return false
  const presentFields = NOTIFY_MAC_FIELDS.filter(f => f in rest)
  const macStr = presentFields.map(f => rest[f]).join('*')
  const expected = hmacSha1(usableKey(hexKey), macStr)
  return MAC.toLowerCase() === expected.toLowerCase()
}
