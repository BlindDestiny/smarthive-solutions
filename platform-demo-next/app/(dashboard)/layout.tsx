'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu } from 'lucide-react'
import Sidebar from '@/components/sidebar'
import CommandPalette from '@/components/command-palette'
import NewReservationModal from '@/components/new-reservation-modal'
import { ToastProvider, useToast } from '@/components/toast-provider'

function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [resModalOpen, setResModalOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mob-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar — hidden on mobile unless open */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onNavClick={() => setMobileOpen(false)} />
      </div>

      {/* Main */}
      <main className="flex-1 lg:ml-60 min-h-screen overflow-x-hidden">
        {/* Mobile header bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">SH</span>
            </div>
            <span className="font-semibold text-slate-900 text-sm">SmartHive</span>
          </div>
          <div className="w-9" />
        </div>

        {children}
      </main>

      {/* Global: Command Palette */}
      <CommandPalette onNewReservation={() => setResModalOpen(true)} />

      {/* Global: New Reservation Modal */}
      <NewReservationModal
        open={resModalOpen}
        onClose={() => setResModalOpen(false)}
      />

      {/* Cmd+K hint — bottom left on desktop */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 left-[268px] hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400 pointer-events-none"
      >
        <kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] shadow-sm">⌘</kbd>
        <kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] shadow-sm">K</kbd>
        <span>para abrir o command menu</span>
      </motion.div>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <DashboardShell>{children}</DashboardShell>
    </ToastProvider>
  )
}
