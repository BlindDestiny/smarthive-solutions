'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Send, Pause, Edit2, Copy, ChevronRight, Zap, Mail, MessageCircle, Smartphone } from 'lucide-react'
import Header from '@/components/header'
import Badge from '@/components/badge'
import PageWrapper from '@/components/page-wrapper'
import KpiCard from '@/components/kpi-card'
import { CAMPAIGNS } from '@/lib/data'

const TABS = ['Campanhas','Automações','Templates'] as const

const AUTOMATIONS = [
  { name:'Confirmação de Reserva', trigger:'Reserva criada', action:'Email + WhatsApp', delay:'Imediato', status:'Active', runs:183, color:'#10b981' },
  { name:'Lembrete D-1', trigger:'Reserva amanhã', action:'SMS', delay:'D-1 às 10h', status:'Active', runs:156, color:'#3b82f6' },
  { name:'Pós-visita — Feedback', trigger:'Reserva concluída', action:'Email', delay:'D+1 às 14h', status:'Active', runs:142, color:'#8b5cf6' },
  { name:'Aniversário VIP', trigger:'Aniversário (VIP)', action:'WhatsApp', delay:'Dia do aniversário', status:'Active', runs:12, color:'#f59e0b' },
  { name:'Re-engajamento', trigger:'Sem visita há 60 dias', action:'Email com desconto', delay:'Automático', status:'Paused', runs:28, color:'#f97316' },
  { name:'Alerta Novo Lead', trigger:'Form de contacto', action:'Email + notificação', delay:'Imediato', status:'Active', runs:34, color:'#14b8a6' },
]

const CHANNEL_ICONS: Record<string, React.ComponentType<any>> = {
  'Email': Mail,
  'WhatsApp': MessageCircle,
  'SMS': Smartphone,
  'Email + WhatsApp': Mail,
  'Email + SMS': Mail,
}

function StatBar({ label, value, max, color }: { label:string; value:number; max:number; color:string }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-500">{label}</span>
        <span className="font-semibold text-slate-700">{value} <span className="text-slate-400 font-normal">({Math.round(pct)}%)</span></span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <motion.div
          initial={{ width:0 }} animate={{ width:`${pct}%` }}
          transition={{ delay:0.3, duration:0.8, ease:'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  )
}

export default function MarketingPage() {
  const [tab, setTab] = useState<typeof TABS[number]>('Campanhas')

  const totalSent = CAMPAIGNS.reduce((s,c)=>s+c.sent,0)
  const totalOpen = CAMPAIGNS.reduce((s,c)=>s+c.opened,0)
  const totalConv = CAMPAIGNS.reduce((s,c)=>s+c.converted,0)
  const totalRev  = CAMPAIGNS.reduce((s,c)=>s+c.revenue,0)

  return (
    <>
      <Header
        title="Marketing"
        subtitle="Campanhas, automações e templates"
        breadcrumb={['The Venue','Marketing']}
        actions={
          <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4"/> Nova Campanha
          </button>
        }
      />
      <PageWrapper>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <KpiCard label="Enviadas Total" value={totalSent} delta="Todas as campanhas" accent="#f43f5e" delay={0}/>
          <KpiCard label="Taxa Abertura" value="51%" delta="▲ +4pp vs mês ant." accent="#f59e0b" delay={0.08}/>
          <KpiCard label="Conversões" value={totalConv} delta={`€${totalRev.toLocaleString()} revenue`} accent="#10b981" delay={0.16}/>
          <KpiCard label="Automações Ativas" value={AUTOMATIONS.filter(a=>a.status==='Active').length} delta="A correr agora" accent="#8b5cf6" delay={0.24}/>
        </div>

        {/* Tab nav */}
        <div className="flex items-center gap-1 mb-5 bg-slate-100 p-1 rounded-xl w-fit">
          {TABS.map(t => (
            <button key={t} onClick={()=>setTab(t)} className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all">
              {tab===t && <motion.div layoutId="mkt-tab" className="absolute inset-0 bg-white rounded-lg shadow-sm" transition={{type:'spring',stiffness:400,damping:30}}/>}
              <span className={`relative ${tab===t?'text-slate-900':'text-slate-500 hover:text-slate-700'}`}>{t}</span>
            </button>
          ))}
        </div>

        {tab==='Campanhas' && (
          <div className="space-y-4">
            {CAMPAIGNS.map((cp,i) => {
              const Icon = CHANNEL_ICONS[cp.type] || Mail
              return (
                <motion.div
                  key={cp.id}
                  initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between p-6 border-b border-slate-50">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-rose-500"/>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-900">{cp.name}</h3>
                          <Badge label={cp.status}/>
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{cp.type}</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1 italic">"{cp.subject}"</p>
                        <div className="text-xs text-slate-400 mt-1">{cp.start} → {cp.end} · Audiência: {cp.audience}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><Edit2 className="w-3.5 h-3.5 text-slate-500"/></button>
                      <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><Copy className="w-3.5 h-3.5 text-slate-500"/></button>
                      {cp.status==='Draft' && (
                        <button className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                          <Send className="w-3 h-3"/> Publicar
                        </button>
                      )}
                      {cp.status==='Active' && (
                        <button className="flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
                          <Pause className="w-3 h-3"/> Pausar
                        </button>
                      )}
                    </div>
                  </div>
                  {cp.sent > 0 && (
                    <div className="px-6 py-4 grid grid-cols-4 gap-6">
                      <div>
                        <div className="text-xs text-slate-400 mb-1">Enviadas</div>
                        <div className="text-lg font-bold text-slate-900">{cp.sent}</div>
                        <div className="text-xs text-slate-400">{cp.delivered} entregues</div>
                      </div>
                      <div className="col-span-3 grid grid-cols-3 gap-4">
                        <StatBar label="Abertura" value={cp.opened} max={cp.sent} color="#3b82f6"/>
                        <StatBar label="Cliques" value={cp.clicked} max={cp.sent} color="#8b5cf6"/>
                        <StatBar label="Conversões" value={cp.converted} max={cp.sent} color="#10b981"/>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}

        {tab==='Automações' && (
          <div className="space-y-3">
            {AUTOMATIONS.map((auto,i) => (
              <motion.div
                key={auto.name}
                initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:auto.color+'18',border:`1px solid ${auto.color}30`}}>
                      <Zap className="w-4 h-4" style={{color:auto.color}}/>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{auto.name}</h3>
                        <Badge label={auto.status}/>
                        <span className="text-xs text-slate-400">{auto.runs} execuções</span>
                      </div>
                      {/* Flow */}
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        {[
                          {label:'Trigger', value:auto.trigger, bg:'bg-blue-50', text:'text-blue-700', border:'border-blue-200'},
                          null,
                          {label:'Delay', value:auto.delay, bg:'bg-slate-50', text:'text-slate-600', border:'border-slate-200'},
                          null,
                          {label:'Ação', value:auto.action, bg:'bg-violet-50', text:'text-violet-700', border:'border-violet-200'},
                        ].map((step,j) =>
                          step === null
                            ? <ChevronRight key={j} className="w-3.5 h-3.5 text-slate-300"/>
                            : (
                              <div key={j} className={`flex flex-col px-3 py-2 rounded-lg border text-xs ${step.bg} ${step.border}`}>
                                <span className={`font-bold uppercase tracking-wide text-[10px] opacity-60 ${step.text}`}>{step.label}</span>
                                <span className={`font-medium mt-0.5 ${step.text}`}>{step.value}</span>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><Edit2 className="w-3.5 h-3.5 text-slate-500"/></button>
                    <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      auto.status==='Active'
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                    }`}>
                      {auto.status==='Active' ? 'Pausar' : 'Ativar'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab==='Templates' && (
          <div className="grid grid-cols-2 gap-4">
            {[
              {name:'Confirmação de Reserva',channel:'Email',tags:['automático'],preview:'A sua reserva em The Venue foi confirmada para {data} às {hora}. Esperamos vê-lo em breve!'},
              {name:'Lembrete 24h',channel:'SMS',tags:['automático'],preview:'Lembrete: reserva amanhã às {hora} em The Venue. Responda SIM para confirmar ou NÃO para cancelar.'},
              {name:'Boas-vindas WhatsApp',channel:'WhatsApp',tags:['onboarding'],preview:'Olá {nome}! Bem-vindo ao The Venue 🍽️ Estamos aqui para qualquer dúvida ou pedido especial.'},
              {name:'Aniversário VIP',channel:'WhatsApp',tags:['loyalty'],preview:'🎂 Feliz aniversário, {nome}! Como VIP do The Venue, temos uma surpresa especial para si este mês...'},
              {name:'Re-activação',channel:'Email',tags:['retenção'],preview:'Temos saudades, {nome}! Há 60 dias que não nos visita. Venha jantar connosco com 10% off na próxima visita.'},
              {name:'Promoção Evento',channel:'Email',tags:['eventos'],preview:'🎵 {evento} está quase a esgotar! Restam apenas {lugares} lugares. Garanta o seu agora!'},
            ].map((t,i) => (
              <motion.div
                key={t.name}
                initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 transition-colors group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{t.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{t.channel}</span>
                      {t.tags.map(tag=>(
                        <span key={tag} className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-md">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200"><Edit2 className="w-3 h-3 text-slate-600"/></button>
                    <button className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700"><Copy className="w-3 h-3 text-white"/></button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 italic bg-slate-50 rounded-lg p-3 border border-slate-100">"{t.preview}"</p>
              </motion.div>
            ))}
          </div>
        )}
      </PageWrapper>
    </>
  )
}
