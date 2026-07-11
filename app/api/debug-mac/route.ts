import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET() {
  const hexKey  = (process.env.MONETICO_KEY ?? '').trim()
  const tpe     = process.env.MONETICO_TPE ?? 'non défini'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'non défini'
  const moneticoUrl = process.env.MONETICO_URL ?? 'non défini'

  // Test HMAC avec chaîne fixe
  let testMac = 'erreur'
  try {
    const keyBuf = Buffer.from(hexKey, 'hex')
    testMac = crypto.createHmac('sha1', keyBuf).update('test').digest('hex')
  } catch (e) {
    testMac = String(e)
  }

  return NextResponse.json({
    keyLength:   hexKey.length,
    keyIsHex:    /^[0-9a-fA-F]+$/.test(hexKey),
    keyFirst4:   hexKey.substring(0, 4),
    keyLast4:    hexKey.substring(hexKey.length - 4),
    tpe,
    siteUrl,
    moneticoUrl: moneticoUrl.substring(0, 50),
    testMac,     // HMAC-SHA1 de "test" avec la clé configurée
  })
}
