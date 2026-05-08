'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, AlertTriangle, CheckCircle2, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import Header from '@/components/header'
import Badge from '@/components/badge'
import PageWrapper from '@/components/page-wrapper'
import KpiCard from '@/components/kpi-card'
import NewReservationModal from '@/components/new-reservation-modal'
import { useToast } from '@/components/toast-provider'
import { BOOKINGS, CONTACTS, type Booking } from '@/lib/data'
import { TODAY, addDays, toDateStr, cn } from '@/lib/utils'

const ZONES = ['Mesa 2','Mesa 4','Mesa 8','Mesa Grande','Bar','Terraço','Lounge VIP','Sala Privada','Sala VIP']

const TABS = ['Hoje','Semana','Futuras','Pendentes'] as const

export default function ReservationsPage() {
  const [tab, setTab] = useState<typeof TABS[number]>('Hoje')
  const [weekOffset, setWeekOffset] = useState(0)
  const [resModal, setResModal] = useState(false)
  const { toast } = useToast()

  const todayBks    = BOOKINGS.filter(b => b.date === TODAY)
  const futureBks   = BOOKINGS.filter(b => b.date > TODAY).sort((a,b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  const pendingBks  = BOOKINGS.filter(b => b.status === 'Pending')
  const covers      = todayBks.reduce((s,b) => s+b.pax, 0)
  const deposits    = todayBks.reduce((s,b) => s+b.deposit, 0)

  // Week view
  const weekStart = addDays(new Date(), weekOffset * 7)
  const weekDays  = Array.from({length:7}, (_,i) => addDays(weekStart, i))

  function BookingRow({ b, delay=0 }: { b: Booking; delay?: number }) {
    const isVip = CONTACTS.find(c=>c.name===b.customer)?.tier === 'VIP'
    return (
      <motion.div
        initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay}}
        className="group flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/80 transition-colors border-b border-slate-50 last:border-0"
      >
        <div className="w-14 text-center flex-shrink-0">
          <span className="text-sm font-bold text-slate-800">{b.time}</span>
        </div>
        <div className={cn(
          'w-1 h-8 rounded-full flex-shrink-0',
          b.status==='Confirmed' ? (isVip ? 'bg-violet-400' : 'bg-emerald-400') :
          b.status==='Pending'   ? 'bg-amber-400' : 'bg-slate-300'
        )}/>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800">{b.customer}</span>
            {isVip && <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded-full ring-1 ring-violet-200">VIP</span>}
            {b.paid && <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-full ring-1 ring-teal-200">Pago {b.deposit>0 ? `€${b.deposit}` : ''}</span>}
          </div>
          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
            <span>👥 {b.pax} pax</span><span>·</span>
            <span>{b.zone}</span>
            {b.occasion && <><span>·</span><span>{b.occasion}</span></>}
            {b.staff !== '—' && <><span>·</span><span>👤 {b.staff}</span></>}
          </div>
        </div>
        {b.note && (
          <div className="hidden group-hover:flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-lg max-w-[180px] border border-rose-100">
            <AlertTriangle className="w-3 h-3 flex-shrink-0"/>
            <span className="truncate">{b.note}</span>
          </div>
        )}
        <Badge label={b.status}/>
      </motion.div>
    )
  }

  return (
    <>
      <Header
        title="Reservas"
        subtitle="Gestão de reservas e ocupação"
        breadcrumb={['The Venue','Reservas']}
        actions={
          <button
            onClick={() => setResModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4"/> <span className="hidden sm:inline">Nova Reserva</span>
          </button>
        }
      />
      <PageWrapper>
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <KpiCard label="Reservas Hoje"  value={todayBks.length}  delta={`${covers} covers`}            accent="#10b981" delay={0}    />
          <KpiCard label="Confirmadas"    value={todayBks.filter(b=>b.status==='Confirmed').length}  delta="Hoje"    accent="#3b82f6" delay={0.08} />
          <KpiCard label="Pendentes"      value={pendingBks.length} delta="Aguardam confirmação"         accent="#f59e0b" delay={0.16} />
          <KpiCard label="Depósitos hoje" value={deposits} prefix="€" delta="Pagamentos recebidos"       accent="#8b5cf6" delay={0.24} />
        </div>

        {/* Tab nav */}
        <div className="flex items-center gap-1 mb-5 bg-slate-100 p-1 rounded-xl w-fit">
          {TABS.map(t => (
            <button
              key={t}
              onClick={()=>setTab(t)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all relative',
                tab===t ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {tab===t && (
                <motion.div layoutId="res-tab" className="absolute inset-0 bg-white rounded-lg shadow-sm" transition={{type:'spring',stiffness:400,damping:30}}/>
              )}
              <span className="relative">
                {t}
                {t==='Pendentes' && pendingBks.length>0 && (
                  <span className="ml-1.5 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{pendingBks.length}</span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Today */}
        {tab==='Hoje' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-semibold text-slate-900">Reservas de Hoje</h2>
                <p className="text-xs text-slate-400 mt-0.5">{todayBks.length} reservas · {covers} covers</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"/>Confirmada</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/>Pendente</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-400 inline-block"/>VIP</span>
              </div>
            </div>
            {todayBks.sort((a,b)=>a.time.localeCompare(b.time)).map((b,i)=>(
              <BookingRow key={b.id} b={b} delay={i*0.07}/>
            ))}
          </div>
        )}

        {/* Week */}
        {tab==='Semana' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">
                Semana de {weekDays[0].toLocaleDateString('pt-PT',{day:'2-digit',month:'short'})} a {weekDays[6].toLocaleDateString('pt-PT',{day:'2-digit',month:'short'})}
              </h2>
              <div className="flex items-center gap-2">
                <button onClick={()=>setWeekOffset(w=>w-1)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                  <ChevronLeft className="w-4 h-4 text-slate-600"/>
                </button>
                <button onClick={()=>setWeekOffset(0)} className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Hoje</button>
                <button onClick={()=>setWeekOffset(w=>w+1)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                  <ChevronRight className="w-4 h-4 text-slate-600"/>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-3">
              {weekDays.map((day,i)=>{
                const dstr = toDateStr(day)
                const dayBks = BOOKINGS.filter(b=>b.date===dstr)
                const isToday = dstr===TODAY
                return (
                  <motion.div
                    key={dstr}
                    initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                    className={cn('bg-white rounded-xl border overflow-hidden',isToday?'border-blue-300 ring-2 ring-blue-100':'border-slate-200')}
                  >
                    <div className={cn('px-3 py-2.5 border-b', isToday?'bg-blue-600 border-blue-500':'bg-slate-50 border-slate-100')}>
                      <div className={cn('font-bold text-xs',isToday?'text-blue-100':'text-slate-500')}>
                        {day.toLocaleDateString('pt-PT',{weekday:'short'}).toUpperCase()}
                      </div>
                      <div className={cn('font-black text-lg leading-tight',isToday?'text-white':'text-slate-900')}>
                        {day.getDate()}
                      </div>
                      <div className={cn('text-[10px]',isToday?'text-blue-200':'text-slate-400')}>
                        {dayBks.length} res · {dayBks.reduce((s,b)=>s+b.pax,0)} pax
                      </div>
                    </div>
                    <div className="p-2 space-y-1 min-h-[100px]">
                      {dayBks.sort((a,b)=>a.time.localeCompare(b.time)).slice(0,4).map(b=>{
                        const isVip = CONTACTS.find(c=>c.name===b.customer)?.tier==='VIP'
                        return (
                          <div key={b.id} className={cn(
                            'rounded-md px-2 py-1 text-[11px] border-l-2 leading-tight',
                            b.status==='Confirmed'
                              ? (isVip?'border-violet-400 bg-violet-50 text-violet-700':'border-emerald-400 bg-emerald-50 text-emerald-700')
                              : 'border-amber-400 bg-amber-50 text-amber-700'
                          )}>
                            <div className="font-bold">{b.time}</div>
                            <div className="truncate opacity-80">{b.customer.split(' ')[0]}</div>
                            <div className="opacity-60">👥{b.pax}</div>
                          </div>
                        )
                      })}
                      {dayBks.length>4 && <div className="text-[10px] text-slate-400 text-center">+{dayBks.length-4} mais</div>}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Future */}
        {tab==='Futuras' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Reservas Futuras</h2>
              <p className="text-xs text-slate-400 mt-0.5">{futureBks.length} reservas agendadas</p>
            </div>
            {futureBks.map((b,i)=>(
              <BookingRow key={b.id} b={b} delay={i*0.05}/>
            ))}
          </div>
        )}

        {/* Pending */}
        {tab==='Pendentes' && (
          <div className="space-y-3">
            {pendingBks.length===0 ? (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-6 py-5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600"/>
                <span className="text-sm font-medium text-emerald-800">Sem reservas pendentes! Tudo confirmado.</span>
              </div>
            ) : (
              pendingBks.map((b,i)=>(
                <motion.div
                  key={b.id}
                  initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                  className="bg-white rounded-xl border border-amber-200 overflow-hidden"
                >
                  <div className="flex items-center gap-4 px-6 py-4">
                    <Clock className="w-5 h-5 text-amber-500 flex-shrink-0"/>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{b.customer}</div>
                      <div className="text-sm text-slate-500">{b.date} às {b.time} · {b.pax} pax · {b.zone}</div>
                      {b.note && <div className="text-xs text-rose-600 mt-1">{b.note}</div>}
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors">
                        ✓ Confirmar
                      </button>
                      <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors">
                        ✕ Cancelar
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </PageWrapper>

      <NewReservationModal
        open={resModal}
        onClose={() => setResModal(false)}
        onCreated={(b) => toast('success', 'Reserva criada!', `${b.customer} · ${b.date} às ${b.time}`)}
      />
    </>
  )
}
