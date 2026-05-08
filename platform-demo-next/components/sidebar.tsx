'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Calendar, Megaphone,
  BarChart3, Settings, Globe, ChevronRight, Hexagon
} from 'lucide-react'

const NAV = [
  { href:'/dashboard',    label:'Dashboard',   icon:LayoutDashboard, color:'#3b82f6' },
  { href:'/crm',          label:'CRM',          icon:Users,           color:'#8b5cf6' },
  { href:'/reservations', label:'Reservas',     icon:Calendar,        color:'#10b981' },
  { href:'/marketing',    label:'Marketing',    icon:Megaphone,       color:'#f43f5e' },
  { href:'/website',      label:'Website',      icon:Globe,           color:'#06b6d4' },
  { href:'/analytics',    label:'Analytics',    icon:BarChart3,       color:'#f59e0b' },
  { href:'/settings',     label:'Definições',   icon:Settings,        color:'#64748b' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, x: -16 },
  show:   { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 28 } },
}

export default function Sidebar({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -240, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className="fixed left-0 top-0 h-screen w-60 bg-slate-900 border-r border-slate-800/80 flex flex-col z-50 select-none"
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-5 py-5 border-b border-slate-800/80"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Hexagon className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight tracking-tight">SmartHive</div>
            <div className="text-slate-500 text-xs">Platform</div>
          </div>
        </div>
      </motion.div>

      {/* Tenant badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="px-5 py-3 border-b border-slate-800/80"
      >
        <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-3 py-2">
          <span className="text-base">🍽️</span>
          <div className="flex-1 min-w-0">
            <div className="text-slate-200 text-xs font-medium truncate">The Venue</div>
            <div className="text-slate-500 text-[10px]">Restaurant · Lisboa</div>
          </div>
          <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
        </div>
      </motion.div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-0.5">
          {NAV.map((n) => {
            const isActive = pathname.startsWith(n.href)
            return (
              <motion.div key={n.href} variants={item}>
                <Link href={n.href} onClick={onNavClick} className="group relative block">
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-slate-800"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="nav-accent"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                      style={{ background: n.color }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800/50'
                  }`}>
                    <n.icon
                      className="w-4 h-4 flex-shrink-0 transition-colors duration-150"
                      style={isActive ? { color: n.color } : {}}
                    />
                    <span className="text-sm font-medium">{n.label}</span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </nav>

      {/* User */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="px-4 py-4 border-t border-slate-800/80"
      >
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            RS
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-slate-200 text-sm font-medium truncate">Ricardo Sousa</div>
            <div className="text-slate-500 text-xs">Owner</div>
          </div>
          <Settings className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
        </div>
      </motion.div>
    </motion.aside>
  )
}
