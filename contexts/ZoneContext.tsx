'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import type { Zone } from '@/lib/types'

const ALLOWED_ZONE_NAMES = ['martinique-guadeloupe', 'guyane']

function parseStoredZone(raw: string): Zone | null {
  try {
    const v = JSON.parse(raw)
    if (
      v !== null &&
      typeof v === 'object' &&
      typeof v.id === 'string' && v.id.length < 64 &&
      typeof v.name === 'string' && ALLOWED_ZONE_NAMES.includes(v.name) &&
      typeof v.label === 'string' && v.label.length < 128 &&
      typeof v.tax_rate === 'number' && v.tax_rate >= 0 && v.tax_rate <= 1 &&
      typeof v.sort_order === 'number'
    ) {
      return v as Zone
    }
  } catch { /* ignore malformed data */ }
  return null
}

interface ZoneContextValue {
  zone: Zone | null
  setZone: (zone: Zone) => void
  showSelector: boolean
  setShowSelector: (v: boolean) => void
}

const ZoneContext = createContext<ZoneContextValue>({
  zone: null,
  setZone: () => {},
  showSelector: false,
  setShowSelector: () => {},
})

export function ZoneProvider({ children }: { children: React.ReactNode }) {
  const [zone, setZoneState] = useState<Zone | null>(null)
  const [showSelector, setShowSelector] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('jc-zone')
    if (stored) {
      const parsed = parseStoredZone(stored)
      if (parsed) {
        setZoneState(parsed)
      } else {
        // Discard invalid/tampered data
        localStorage.removeItem('jc-zone')
        setShowSelector(true)
      }
    } else {
      setShowSelector(true)
    }
  }, [])

  function setZone(z: Zone) {
    setZoneState(z)
    localStorage.setItem('jc-zone', JSON.stringify(z))
    setShowSelector(false)
  }

  return (
    <ZoneContext.Provider value={{ zone, setZone, showSelector, setShowSelector }}>
      {children}
    </ZoneContext.Provider>
  )
}

export const useZone = () => useContext(ZoneContext)
