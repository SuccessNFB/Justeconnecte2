'use client'
import { createContext, useContext, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { ShoppingBag, X } from 'lucide-react'

export interface ToastPayload {
  title:    string
  subtitle?: string
  image?:   string
}

interface Toast extends ToastPayload { id: number }

interface ToastCtx {
  showToast: (p: ToastPayload) => void
}

const ToastContext = createContext<ToastCtx>({ showToast: () => {} })

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  return (
    <div
      className="animate-scale-in flex items-start gap-3 rounded-2xl px-4 py-3.5 shadow-xl"
      style={{
        background: 'var(--surface)',
        border:     '1px solid var(--border)',
        borderLeft: '3.5px solid var(--gold)',
        minWidth:   '280px',
        maxWidth:   '340px',
        boxShadow:  '0 12px 40px rgba(0,0,0,0.14)',
      }}
    >
      {/* Thumbnail */}
      <div
        className="shrink-0 w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center"
        style={{ background: 'var(--surface-soft)', border: '1px solid var(--border)' }}
      >
        {toast.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={toast.image} alt="" className="w-full h-full object-contain p-1" />
        ) : (
          <ShoppingBag size={16} style={{ color: 'var(--gold)', opacity: 0.7 }} />
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--gold)' }}>
          Article ajouté
        </p>
        <p className="text-sm font-semibold leading-tight truncate">{toast.title}</p>
        {toast.subtitle && (
          <p className="text-xs mt-0.5 opacity-45 truncate">{toast.subtitle}</p>
        )}
        <Link
          href="/panier"
          onClick={onDismiss}
          className="inline-block text-xs font-semibold mt-2 hover:underline"
          style={{ color: 'var(--gold-deep)' }}
        >
          Voir le panier →
        </Link>
      </div>

      {/* Close */}
      <button
        onClick={onDismiss}
        className="shrink-0 p-0.5 rounded-full opacity-30 hover:opacity-70 transition-opacity"
      >
        <X size={13} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  const showToast = useCallback((payload: ToastPayload) => {
    const id = ++counter.current
    setToasts(prev => [...prev.slice(-2), { id, ...payload }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3800)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast stack — fixed bottom-right */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-[200] flex flex-col gap-2 items-end">
          {toasts.map(t => (
            <ToastItem
              key={t.id}
              toast={t}
              onDismiss={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
