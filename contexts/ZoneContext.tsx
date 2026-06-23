'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import type { Zone } from '@/lib/types'

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
      try { setZoneState(JSON.parse(stored)) } catch {}
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
