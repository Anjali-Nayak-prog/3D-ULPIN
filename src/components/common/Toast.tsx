import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '../../utils/helpers'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: number
  type: ToastType
  title: string
  description?: string
}

interface ToastContextValue {
  toast: (t: Omit<ToastItem, 'id'>) => void
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const toastStyles: Record<ToastType, { icon: ReactNode; ring: string }> = {
  success: {
    icon: <CheckCircle2 size={18} className="text-emerald-400" />,
    ring: 'border-emerald-500/30',
  },
  error: {
    icon: <AlertTriangle size={18} className="text-red-400" />,
    ring: 'border-red-500/30',
  },
  warning: {
    icon: <AlertTriangle size={18} className="text-amber-400" />,
    ring: 'border-amber-500/30',
  },
  info: {
    icon: <Info size={18} className="text-sky-400" />,
    ring: 'border-sky-500/30',
  },
}

let toastCounter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (t: Omit<ToastItem, 'id'>) => {
      toastCounter += 1
      const id = toastCounter
      setToasts((prev) => [...prev, { ...t, id }])
      setTimeout(() => dismiss(id), 4500)
    },
    [dismiss],
  )

  const value: ToastContextValue = {
    toast,
    success: (title, description) => toast({ type: 'success', title, description }),
    error: (title, description) => toast({ type: 'error', title, description }),
    warning: (title, description) => toast({ type: 'warning', title, description }),
    info: (title, description) => toast({ type: 'info', title, description }),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[120] flex w-80 flex-col gap-2">
        {toasts.map((t) => {
          const style = toastStyles[t.type]
          return (
            <div
              key={t.id}
              className={cn(
                'pointer-events-auto flex items-start gap-3 rounded-xl border bg-navy-900/95 p-3.5 shadow-2xl animate-slide-in',
                style.ring,
              )}
            >
              <div className="mt-0.5 shrink-0">{style.icon}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-xs leading-4 text-slate-400">
                    {t.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="shrink-0 rounded p-0.5 text-slate-500 transition-colors hover:text-white"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}