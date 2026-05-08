'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  Search, LayoutDashboard, Users, Calendar, Megaphone,
  BarChart3, Settings, Plus, Target, ArrowRight, Hash
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CONTACTS } from '@/lib/data'

interface Command {
  id: string
  label: string
  description?: string
  category: string
  icon: React.ComponentType<any>
  iconColor?: string
  action: () => void
  shortcut?: string
}

interface Props {
  onNewReservation?: () => void
}

export default function CommandPalette({ onNewReservation }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const close = useCallback(() => { setOpen(false); setQuery(''); setSelected(0) }, [])

  const COMMANDS: Command[] = [
    { id:'nav-dash',    label:'Dashboard',     category:'Navegação', icon:LayoutDashboard, iconColor:'#3b82f6', action:()=>{ router.push('/dashboard'); close() } },
    { id:'nav-crm',     label:'CRM',           category:'Navegação', icon:Users,           iconColor:'#8b5cf6', action:()=>{ router.push('/crm'); close() } },
    { id:'nav-res',     label:'Reservas',      category:'Navegação', icon:Calendar,        iconColor:'#10b981', action:()=>{ router.push('/reservations'); close() } },
    { id:'nav-mkt',     label:'Marketing',     category:'Navegação', icon:Megaphone,       iconColor:'#f43f5e', action:()=>{ router.push('/marketing'); close() } },
    { id:'nav-ana',     label:'Analytics',     category:'Navegação', icon:BarChart3,       iconColor:'#f59e0b', action:()=>{ router.push('/analytics'); close() } },
    { id:'nav-set',     label:'Definições',    category:'Navegação', icon:Settings,        iconColor:'#64748b', action:()=>{ router.push('/settings'); close() } },
    { id:'new-res',     label:'Nova Reserva',  description:'Criar uma nova reserva para um cliente', category:'Ações', icon:Plus, iconColor:'#10b981', action:()=>{ onNewReservation?.(); close() }, shortcut:'N' },
    { id:'new-contact', label:'Novo Contacto', description:'Adicionar cliente ao CRM', category:'Ações', icon:Plus, iconColor:'#8b5cf6', action:()=>{ router.push('/crm'); close() } },
    { id:'new-camp',    label:'Nova Campanha', description:'Criar campanha de marketing', category:'Ações', icon:Plus, iconColor:'#f43f5e', action:()=>{ router.push('/marketing'); close() } },
    { id:'pipeline',    label:'Ver Pipeline',  description:'Eventos e grupos corporativos', category:'Ações', icon:Target, iconColor:'#14b8a6', action:()=>{ router.push('/dashboard'); close() } },
  ]

  const filtered = query.trim()
    ? COMMANDS.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description?.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      )
    : COMMANDS

  // Group by category
  const groups = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, Command[]>)

  const flatList = filtered

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (!open) return
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, flatList.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
      if (e.key === 'Enter')     { e.preventDefault(); flatList[selected]?.action() }
      if (e.key === 'Escape')    close()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, flatList, selected, close])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  useEffect(() => { setSelected(0) }, [query])

  let cmdIndex = 0

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="cp-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
              onClick={close}
            />
            <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4">
              <motion.div
                key="cp-panel"
                initial={{ opacity: 0, scale: 0.95, y: -16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -8 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80"
              >
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
                  <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Pesquisar ações, páginas..."
                    className="flex-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                  <kbd className="hidden sm:block text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto py-2">
                  {flatList.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 text-sm">Nenhum resultado para "{query}"</div>
                  ) : (
                    Object.entries(groups).map(([category, cmds]) => (
                      <div key={category} className="mb-1">
                        <div className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {category}
                        </div>
                        {cmds.map(cmd => {
                          const isSelected = cmdIndex++ === selected
                          return (
                            <button
                              key={cmd.id}
                              onClick={cmd.action}
                              onMouseEnter={() => setSelected(flatList.findIndex(c => c.id === cmd.id))}
                              className={cn(
                                'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                                isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
                              )}
                            >
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ background: (cmd.iconColor || '#64748b') + '18', border: `1px solid ${cmd.iconColor || '#64748b'}30` }}
                              >
                                <cmd.icon className="w-3.5 h-3.5" style={{ color: cmd.iconColor || '#64748b' }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className={cn('text-sm font-medium', isSelected ? 'text-blue-700' : 'text-slate-800')}>
                                  {cmd.label}
                                </div>
                                {cmd.description && (
                                  <div className="text-xs text-slate-400 truncate">{cmd.description}</div>
                                )}
                              </div>
                              {isSelected && <ArrowRight className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
                              {cmd.shortcut && (
                                <kbd className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                  {cmd.shortcut}
                                </kbd>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><kbd className="bg-white border border-slate-200 px-1 py-0.5 rounded text-[10px]">↑↓</kbd> navegar</span>
                    <span className="flex items-center gap-1"><kbd className="bg-white border border-slate-200 px-1 py-0.5 rounded text-[10px]">↵</kbd> selecionar</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    <kbd className="bg-white border border-slate-200 px-1 py-0.5 rounded">⌘K</kbd> para abrir
                  </span>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
