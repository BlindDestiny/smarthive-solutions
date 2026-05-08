'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Calendar, Users, TrendingUp, Megaphone, Target, AlertTriangle, ArrowRight, DollarSign, Plus } from 'lucide-react'
import KpiCard from '@/components/kpi-card'
import Badge from '@/components/badge'
import Header from '@/components/header'
import PageWrapper from '@/components/page-wrapper'
import NewReservationModal from '@/components/new-reservation-modal'
import { useToast } from '@/components/toast-provider'
import { BOOKINGS, EVENTS, STAFF, SERIES, CONTACTS } from '@/lib/data'
import { TODAY, formatCurrency } from '@/lib/utils'
import Link from 'next/link'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <div className="text-slate-400 text-xs mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-xs text-slate-300">{p.name}: </span>
          <span className="text-xs font-semibold text-white">{p.name === 'revenue' ? `€${p.value}` : p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [resModal, setResModal] = useState(false)
  const { toast } = useToast()
  const todayBookings = BOOKINGS.filter(b => b.date === TODAY)
  const covers = todayBookings.reduce((s, b) => s + b.pax, 0)
  const revenue7d = SERIES.slice(-7).reduce((s, d) => s + d.revenue, 0)
  const leads = CONTACTS.filter(c => c.status === 'Lead').length
  const pending = todayBookings.filter(b => b.status === 'Pending')

  const kpis = [
    { label:'Reservas Hoje', value:todayBookings.length, delta:`${covers} covers`, deltaDir:'up' as const, accent:'#3b82f6', suffix:'', icon:Calendar, delay:0 },
    { label:'Revenue 7 dias', value:revenue7d, delta:'▲ +12% vs sem. ant.', deltaDir:'up' as const, accent:'#f59e0b', prefix:'€', icon:TrendingUp, delay:0.08 },
    { label:'Total Clientes', value:CONTACTS.filter(c=>c.status==='Customer').length, delta:'▲ +3 este mês', deltaDir:'up' as const, accent:'#10b981', icon:Users, delay:0.16 },
    { label:'Leads Ativos', value:leads, delta:'Follow up pendente', deltaDir:'neutral' as const, accent:'#f97316', icon:Target, delay:0.24 },
    { label:'Campanhas Ativas', value:1, delta:'183 enviadas', deltaDir:'neutral' as const, accent:'#8b5cf6', icon:Megaphone, delay:0.32 },
    { label:'Pipeline Eventos', value:5, delta:'€20.300 em aberto', deltaDir:'up' as const, accent:'#14b8a6', icon:DollarSign, delay:0.4 },
  ]

  return (
    <>
      <Header
        title="Dashboard"
        subtitle={`The Venue · ${new Date().toLocaleDateString('pt-PT', { weekday:'long', day:'2-digit', month:'long', year:'numeric' })}`}
        breadcrumb={['The Venue', 'Dashboard']}
        actions={
          <button
            onClick={() => setResModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova Reserva</span>
          </button>
        }
      />
      <PageWrapper>

        {/* Alerts */}
        {pending.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="text-sm text-amber-800 font-medium">
              {pending.length} reserva{pending.length > 1 ? 's' : ''} pendente{pending.length > 1 ? 's' : ''} aguardam confirmação hoje
            </span>
            <Link href="/reservations" className="ml-auto flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors">
              Ver <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>
        )}

        {/* KPIs */}
        <motion.div
          variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
        >
          {kpis.map(k => (
            <motion.div key={k.label} variants={fadeUp}>
              <KpiCard {...k} />
            </motion.div>
          ))}
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Today's bookings */}
          <motion.div
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.3, duration:0.35 }}
            className="col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-semibold text-slate-900">Reservas de Hoje</h2>
                <p className="text-xs text-slate-400 mt-0.5">{todayBookings.length} reservas · {covers} covers</p>
              </div>
              <Link href="/reservations" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                Ver todas <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {todayBookings.sort((a,b) => a.time.localeCompare(b.time)).map((b, i) => {
                const contact = CONTACTS.find(c => c.name === b.customer)
                const isVip = contact?.tier === 'VIP'
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity:0, x:-12 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ delay: 0.35 + i * 0.07 }}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/80 transition-colors group"
                  >
                    <div className="w-14 text-center">
                      <span className="text-sm font-bold text-slate-800">{b.time}</span>
                    </div>
                    <div className={`w-1 h-8 rounded-full flex-shrink-0 ${
                      b.status === 'Confirmed' ? (isVip ? 'bg-violet-400' : 'bg-emerald-400') : 'bg-amber-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800 truncate">{b.customer}</span>
                        {isVip && <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded-full ring-1 ring-violet-200">VIP</span>}
                        {b.paid && <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full ring-1 ring-teal-200">Pago</span>}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>👥 {b.pax} pax</span>
                        <span>·</span>
                        <span>{b.zone}</span>
                        {b.occasion && <><span>·</span><span className="text-slate-500">{b.occasion}</span></>}
                      </div>
                    </div>
                    {b.note && (
                      <div className="hidden group-hover:flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg max-w-[200px]">
                        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{b.note}</span>
                      </div>
                    )}
                    <Badge label={b.status} />
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Events */}
            <motion.div
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.35, duration:0.35 }}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900 text-sm">Próximos Eventos</h2>
              </div>
              <div className="p-4 space-y-3">
                {EVENTS.map((ev, i) => {
                  const pct = (ev.sold / ev.capacity) * 100
                  return (
                    <motion.div
                      key={ev.name}
                      initial={{ opacity:0 }} animate={{ opacity:1 }}
                      transition={{ delay: 0.45 + i * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-700">{ev.emoji} {ev.name}</span>
                        <span className="text-xs text-slate-400">{ev.capacity - ev.sold} lugares</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                        />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{ev.date} · €{ev.price}/pessoa</div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Staff */}
            <motion.div
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.45, duration:0.35 }}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900 text-sm">Equipa Hoje</h2>
              </div>
              <div className="p-4 space-y-2.5">
                {STAFF.map(s => (
                  <div key={s.id} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${s.status === 'Active' ? 'bg-slate-700' : 'bg-slate-300'}`}>
                      {s.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-700 truncate">{s.name}</div>
                      <div className="text-[10px] text-slate-400">{s.role}</div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${s.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Revenue chart */}
        <motion.div
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.5, duration:0.35 }}
          className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-semibold text-slate-900">Revenue & Reservas</h2>
              <p className="text-xs text-slate-400 mt-0.5">Últimos 30 dias</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 inline-block rounded" />Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-violet-400 inline-block rounded" />Reservas</span>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={SERIES} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" dot={false} animationDuration={1500} />
                <Area type="monotone" dataKey="reservations" stroke="#8b5cf6" strokeWidth={2} fill="url(#resGrad)" dot={false} animationDuration={1800} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </PageWrapper>

      <NewReservationModal
        open={resModal}
        onClose={() => setResModal(false)}
        onCreated={() => toast('success', 'Reserva criada!', 'Visível em Reservas → Hoje')}
      />
    </>
  )
}
