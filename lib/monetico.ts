import crypto from 'crypto'

function usableKey(hexKey: string): Buffer {
  return Buffer.from(hexKey, 'hex')
}

function hmacSha1(key: Buffer, data: string): string {
  return crypto.createHmac('sha1', key).update(data).digest('hex').toLowerCase()
}

// Fields included in the payment request MAC (in order)
const PAYMENT_MAC_FIELDS = [
  'TPE', 'date', 'montant', 'reference', 'texte-libre', 'version', 'lgue', 'societe', 'mail',
]

// Fields included in the notification MAC (in order)
const NOTIFY_MAC_FIELDS = [
  'TPE', 'date', 'montant', 'reference', 'texte-libre', 'code-retour',
  'cvx', 'vld', 'brand', 'status3ds', 'numauto', 'originecb',
  'bincb', 'hpancb', 'ipclient', 'originetr', 'veres', 'pares',
]

export function generateReference(): string {
  // Max 12 alphanumeric chars
  return Date.now().toString(36).toUpperCase().slice(-12)
}

export function buildPaymentForm(opts: {
  amountCents: number
  reference:   string
  description: string
  zone?:       string
  email?:      string
  successUrl:  string
  cancelUrl:   string
}): { action: string; fields: Record<string, string> } {
  const tpe     = process.env.MONETICO_TPE!
  const hexKey  = process.env.MONETICO_KEY!
  const societe = process.env.MONETICO_SOCIETE ?? 'sfconseil'
  const url     = process.env.MONETICO_URL!

  const now = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  const date = `${p(now.getDate())}/${p(now.getMonth() + 1)}/${now.getFullYear()}:${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`

  // Embed zone in texte-libre for webhook recovery, strip forbidden chars
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
    mail:           opts.email ?? '',
    url_retour_ok:  opts.successUrl,
    url_retour_err: opts.cancelUrl,
  }

  const macStr = PAYMENT_MAC_FIELDS.map(f => fields[f] ?? '').join('*')
  fields.MAC = hmacSha1(usableKey(hexKey), macStr)

  return { action: url, fields }
}

export function verifyNotifyMac(params: Record<string, string>): boolean {
  const hexKey = process.env.MONETICO_KEY
  if (!hexKey) return false
  const { MAC, ...rest } = params
  if (!MAC) return false
  const presentFields = NOTIFY_MAC_FIELDS.filter(f => f in rest)
  const macStr = presentFields.map(f => rest[f]).join('*')
  const expected = hmacSha1(usableKey(hexKey), macStr)
  return MAC.toLowerCase() === expected.toLowerCase()
}
