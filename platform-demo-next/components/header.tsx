'use client'
import { motion } from 'framer-motion'
import { Bell, Search, ChevronRight, Command } from 'lucide-react'
import { useState, useEffect } from 'react'

interface HeaderProps {
  title: string
  subtitle?: string
  breadcrumb?: string[]
  actions?: React.ReactNode
}

export default function Header({ title, subtitle, breadcrumb, actions }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false)

  const NOTIFS = [
    { icon:'📅', text:'Nova reserva — Marta Costa, amanhã 20:00', time:'há 2 min', unread:true },
    { icon:'⚠️', text:'Reserva pendente — Ana Ferreira aguarda confirmação', time:'há 15 min', unread:true },
    { icon:'🎂', text:'Aniversário hoje — Raquel Nunes (Occasional)', time:'hoje', unread:false },
    { icon:'📣', text:'Campanha "Jazz Night" atingiu 51% de abertura', time:'há 1h', unread:false },
  ]

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          {breadcrumb && (
            <div className="hidden sm:flex items-center gap-1.5 mb-1">
              {breadcrumb.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />}
                  <span className={`text-xs font-medium ${
                    i === breadcrumb.length - 1 ? 'text-slate-500' : 'text-slate-400'
                  }`}>{crumb}</span>
                </span>
              ))}
            </div>
          )}
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5 hidden sm:block">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {actions}

          {/* Cmd+K trigger */}
          <button
            className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-400 text-sm transition-colors group"
            onClick={() => {
              const e = new KeyboardEvent('keydown', { key:'k', metaKey:true, bubbles:true })
              window.dispatchEvent(e)
            }}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="text-xs hidden lg:block">Pesquisar…</span>
            <div className="hidden lg:flex items-center gap-0.5 ml-1">
              <kbd className="text-[10px] bg-white border border-slate-200 px-1 py-0.5 rounded">⌘</kbd>
              <kbd className="text-[10px] bg-white border border-slate-200 px-1 py-0.5 rounded">K</kbd>
            </div>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(o => !o)}
              className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors group"
            >
              <Bell className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.4 }}
                className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"
              />
            </button>

            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <span className="font-semibold text-slate-900 text-sm">Notificações</span>
                    <span className="text-xs font-medium text-blue-600 cursor-pointer hover:text-blue-700">Marcar todas lidas</span>
                  </div>
                  <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
                    {NOTIFS.map((n, i) => (
                      <div key={i} className={`flex gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${n.unread ? 'bg-blue-50/30' : ''}`}>
                        <span className="text-lg flex-shrink-0 mt-0.5">{n.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-700 leading-snug">{n.text}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                        </div>
                        {n.unread && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
