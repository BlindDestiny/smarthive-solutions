'use client'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell, PieChart, Pie, Legend
} from 'recharts'
import Header from '@/components/header'
import KpiCard from '@/components/kpi-card'
import PageWrapper from '@/components/page-wrapper'
import { SERIES, CONTACTS } from '@/lib/data'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <div className="text-slate-400 text-xs mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-xs text-white font-semibold">{p.name === 'revenue' ? `€${p.value}` : p.value}</span>
        </div>
      ))}
    </div>
  )
}

const TIER_DATA = [
  { name:'VIP', value:3, color:'#8b5cf6' },
  { name:'Corporate', value:3, color:'#14b8a6' },
  { name:'Regular', value:4, color:'#3b82f6' },
  { name:'Occasional', value:2, color:'#94a3b8' },
]

const SOURCE_DATA = [
  { name:'Walk-in', value:3 }, { name:'Instagram', value:4 },
  { name:'Google', value:2 }, { name:'LinkedIn', value:2 },
  { name:'Referral', value:1 },
]

const ZONE_DATA = [
  { zone:'Mesa 4', bookings:12 }, { zone:'Bar', bookings:8 }, { zone:'Sala Privada', bookings:6 },
  { zone:'Lounge VIP', bookings:5 }, { zone:'Mesa 8', bookings:9 }, { zone:'Terraço', bookings:7 },
  { zone:'Sala VIP', bookings:4 }, { zone:'Mesa 2', bookings:6 },
]

function ChartCard({ title, subtitle, children, delay=0 }: { title:string; subtitle?:string; children:React.ReactNode; delay?:number }) {
  return (
    <motion.div
      initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay, duration:0.35}}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  )
}

export default function AnalyticsPage() {
  const totalRevenue = SERIES.reduce((s,d)=>s+d.revenue, 0)
  const totalRes     = SERIES.reduce((s,d)=>s+d.reservations, 0)
  const avgTicket    = Math.round(totalRevenue / totalRes)
  const topContacts  = [...CONTACTS].sort((a,b)=>b.spend-a.spend).slice(0,5)

  return (
    <>
      <Header title="Analytics" subtitle="The Venue · Últimos 30 dias" breadcrumb={['The Venue','Analytics']}/>
      <PageWrapper>
        {/* KPIs */}
        <div className="grid grid-cols-6 gap-4 mb-6">
          {[
            {label:'Reservas 30d', value:totalRes, delta:'▲ +12% vs mês ant.', accent:'#3b82f6', delay:0},
            {label:'Revenue 30d', value:totalRevenue, prefix:'€', delta:'▲ +8%', accent:'#f59e0b', delay:0.07},
            {label:'Ticket Médio', value:avgTicket, prefix:'€', delta:'▲ +€4', accent:'#8b5cf6', delay:0.14},
            {label:'Novos Leads', value:SERIES.reduce((s,d)=>s+d.leads,0), delta:'▲ +3 esta semana', accent:'#f97316', delay:0.21},
            {label:'Ocupação', value:'74%', delta:'▲ +5pp', accent:'#10b981', delay:0.28},
            {label:'Rating Google', value:'4.8⭐', delta:'▲ +0.1', accent:'#14b8a6', delay:0.35},
          ].map(k=><KpiCard key={k.label} {...k} deltaDir="up"/>)}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-3 gap-5 mb-5">
          <div className="col-span-2">
            <ChartCard title="Revenue & Reservas" subtitle="Tendência dos últimos 30 dias" delay={0.2}>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={SERIES} margin={{top:4,right:4,left:-24,bottom:0}}>
                  <defs>
                    <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="resG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                  <XAxis dataKey="label" tick={{fontSize:10,fill:'#94a3b8'}} tickLine={false} axisLine={false} interval={4}/>
                  <YAxis tick={{fontSize:10,fill:'#94a3b8'}} tickLine={false} axisLine={false}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revG)" dot={false} animationDuration={1500}/>
                  <Area type="monotone" dataKey="reservations" stroke="#8b5cf6" strokeWidth={2} fill="url(#resG)" dot={false} animationDuration={1800}/>
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
          <ChartCard title="Clientes por Tier" delay={0.3}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={TIER_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" animationDuration={1200}>
                  {TIER_DATA.map((entry,i)=><Cell key={i} fill={entry.color}/>)}
                </Pie>
                <Tooltip formatter={(v,n)=>[v,n]}/>
                <Legend iconType="circle" iconSize={8} formatter={(v)=><span style={{fontSize:12,color:'#475569'}}>{v}</span>}/>
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-3 gap-5 mb-5">
          <ChartCard title="Reservas por Zona" delay={0.35}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ZONE_DATA} margin={{top:0,right:4,left:-24,bottom:20}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                <XAxis dataKey="zone" tick={{fontSize:9,fill:'#94a3b8'}} tickLine={false} axisLine={false} angle={-30} textAnchor="end"/>
                <YAxis tick={{fontSize:10,fill:'#94a3b8'}} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{background:'#0f172a',border:'none',borderRadius:8,color:'#f1f5f9',fontSize:12}}/>
                <Bar dataKey="bookings" fill="#10b981" radius={[4,4,0,0]} animationDuration={1200}/>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Origem dos Clientes" delay={0.4}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={SOURCE_DATA} layout="vertical" margin={{top:0,right:16,left:8,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
                <XAxis type="number" tick={{fontSize:10,fill:'#94a3b8'}} tickLine={false} axisLine={false}/>
                <YAxis type="category" dataKey="name" tick={{fontSize:11,fill:'#64748b'}} tickLine={false} axisLine={false} width={70}/>
                <Tooltip contentStyle={{background:'#0f172a',border:'none',borderRadius:8,color:'#f1f5f9',fontSize:12}}/>
                <Bar dataKey="value" fill="#8b5cf6" radius={[0,4,4,0]} animationDuration={1400}/>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top 5 Clientes por LTV" delay={0.45}>
            <div className="space-y-4">
              {topContacts.map((c,i)=>{
                const pct = (c.spend/topContacts[0].spend)*100
                return (
                  <div key={c.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-[10px] font-bold">
                          {c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                        </div>
                        <span className="text-xs font-medium text-slate-700">{c.name}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">€{c.spend.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{width:0}} animate={{width:`${pct}%`}}
                        transition={{delay:0.5+i*0.1, duration:0.7, ease:'easeOut'}}
                        className="h-full rounded-full"
                        style={{background:['#8b5cf6','#3b82f6','#10b981','#f59e0b','#f97316'][i]}}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </ChartCard>
        </div>

        {/* Leads */}
        <ChartCard title="Novos Leads — 30 dias" delay={0.5}>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={SERIES} margin={{top:4,right:4,left:-24,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="label" tick={{fontSize:10,fill:'#94a3b8'}} tickLine={false} axisLine={false} interval={4}/>
              <YAxis tick={{fontSize:10,fill:'#94a3b8'}} tickLine={false} axisLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Line type="monotone" dataKey="leads" stroke="#f97316" strokeWidth={2.5} dot={false} animationDuration={2000}/>
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </PageWrapper>
    </>
  )
}
