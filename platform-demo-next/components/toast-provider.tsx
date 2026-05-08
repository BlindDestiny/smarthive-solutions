'use client'
import { createContext, useContext, useState, useCallback, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'
interface ToastItem { id: string; type: ToastType; title: string; message?: string }

interface ToastCtx { toast: (type: ToastType, title: string, message?: string) => void }
const ToastContext = createContext<ToastCtx>({ toast: () => {} })

export function useToast() { return useContext(ToastContext) }

const ICONS = {
  success: CheckCircle2,
  error:   AlertCircle,
  info:    Info,
}
const STYLES = {
  success: 'bg-white border-emerald-200 text-emerald-700',
  error:   'bg-white border-rose-200 text-rose-700',
  info:    'bg-white border-blue-200 text-blue-600',
}
const ICON_STYLES = {
  success: 'text-emerald-500',
  error:   'text-rose-500',
  info:    'text-blue-500',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, type, title, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => {
            const Icon = ICONS[t.type]
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 48, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={cn(
                  'pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-xl border shadow-lg min-w-[280px] max-w-sm',
                  STYLES[t.type]
                )}
              >
                <Icon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', ICON_STYLES[t.type])} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900">{t.title}</div>
                  {t.message && <div className="text-xs text-slate-500 mt-0.5">{t.message}</div>}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="flex-shrink-0 p-0.5 rounded hover:bg-slate-100 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
