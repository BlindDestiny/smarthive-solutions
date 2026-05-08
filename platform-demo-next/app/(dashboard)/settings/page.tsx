'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Check, Building2, Palette, Globe, Bell, Plug, Users, CreditCard } from 'lucide-react'
import Header from '@/components/header'
import PageWrapper from '@/components/page-wrapper'
import Badge from '@/components/badge'
import { cn } from '@/lib/utils'

const TABS = [
  { key:'company',  label:'Empresa',        icon:Building2 },
  { key:'brand',    label:'Branding',        icon:Palette },
  { key:'website',  label:'Website & SEO',   icon:Globe },
  { key:'notifs',   label:'Notificações',    icon:Bell },
  { key:'integs',   label:'Integrações',     icon:Plug },
  { key:'users',    label:'Utilizadores',    icon:Users },
  { key:'billing',  label:'Plano & Faturação', icon:CreditCard },
]

const USERS_BO = [
  { name:'Ricardo Sousa', email:'ricardo@thevenue.pt', role:'Owner', lastLogin:'Hoje, 14:23', status:'Active', avatar:'RS' },
  { name:'Ana Lima', email:'ana@thevenue.pt', role:'Receptionist', lastLogin:'Hoje, 09:15', status:'Active', avatar:'AL' },
  { name:'Sofia Costa', email:'sofia.costa@thevenue.pt', role:'Marketing Manager', lastLogin:'Ontem, 18:40', status:'Active', avatar:'SC' },
  { name:'João Pinto', email:'joao.pinto@thevenue.pt', role:'Staff', lastLogin:'Há 3 dias', status:'Inactive', avatar:'JP' },
]

const INTEGRATIONS = [
  { name:'Stripe', icon:'💳', desc:'Pagamentos e taxa de reserva', status:'Connected', color:'#635bff' },
  { name:'WhatsApp Business', icon:'💬', desc:'Mensagens automáticas', status:'Not connected', color:'#25d366' },
  { name:'Google Analytics', icon:'📊', desc:'Tracking de visitas', status:'Connected', color:'#e37400' },
  { name:'Instagram', icon:'📸', desc:'Publicação automática', status:'Not connected', color:'#e1306c' },
  { name:'Resend', icon:'📧', desc:'Email marketing', status:'Connected', color:'#3b82f6' },
  { name:'Google Maps', icon:'🗺️', desc:'Localização e reviews', status:'Connected', color:'#4285f4' },
  { name:'Google Calendar', icon:'📅', desc:'Sincronização reservas', status:'Not connected', color:'#0f9d58' },
  { name:'Twilio', icon:'📱', desc:'SMS API', status:'Not connected', color:'#f22f46' },
]

function SaveButton() {
  const [saved, setSaved] = useState(false)
  const handle = () => { setSaved(true); setTimeout(()=>setSaved(false), 2000) }
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={handle}
      className={cn(
        'flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all',
        saved ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
      )}
    >
      {saved ? <><Check className="w-4 h-4"/> Guardado!</> : <><Save className="w-4 h-4"/> Guardar alterações</>}
    </motion.button>
  )
}

function Field({ label, defaultValue, type='text', placeholder='' }: { label:string; defaultValue?:string; type?:string; placeholder?:string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
      />
    </div>
  )
}

function Toggle({ label, defaultChecked=true, desc='' }: { label:string; defaultChecked?:boolean; desc?:string }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <div className="flex items-start justify-between py-3.5 border-b border-slate-50 last:border-0">
      <div>
        <div className="text-sm font-medium text-slate-800">{label}</div>
        {desc && <div className="text-xs text-slate-400 mt-0.5">{desc}</div>}
      </div>
      <button
        onClick={()=>setOn(!on)}
        className={cn('relative inline-flex h-5 w-9 rounded-full transition-colors flex-shrink-0 mt-0.5', on?'bg-blue-600':'bg-slate-200')}
      >
        <motion.span
          animate={{ x: on ? 16 : 2 }}
          transition={{ type:'spring', stiffness:500, damping:30 }}
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState('company')

  return (
    <>
      <Header title="Definições" subtitle="The Venue · Configurações da conta" breadcrumb={['The Venue','Definições']}/>
      <PageWrapper>
        <div className="flex gap-6">
          {/* Sidebar tabs */}
          <motion.div
            initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{duration:0.3}}
            className="w-52 flex-shrink-0"
          >
            <nav className="bg-white rounded-xl border border-slate-200 overflow-hidden p-2 space-y-0.5">
              {TABS.map((t,i) => (
                <motion.button
                  key={t.key}
                  initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                  onClick={()=>setTab(t.key)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left',
                    tab===t.key ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <t.icon className={cn('w-4 h-4', tab===t.key?'text-blue-600':'text-slate-400')}/>
                  {t.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>

          {/* Content */}
          <motion.div
            key={tab}
            initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.25}}
            className="flex-1"
          >
            {tab==='company' && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-6">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">Informações da Empresa</h2>
                  <p className="text-sm text-slate-400 mt-1">Dados públicos que aparecem no site e comunicações.</p>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <Field label="Nome do negócio" defaultValue="The Venue"/>
                  <Field label="Tipo de negócio" defaultValue="Restaurant"/>
                  <Field label="Email" defaultValue="info@thevenue.pt"/>
                  <Field label="Telefone" defaultValue="+351 21 123 4567"/>
                  <div className="col-span-2"><Field label="Morada" defaultValue="Rua Augusta 142, 1100-053 Lisboa"/></div>
                  <Field label="Horário" defaultValue="Ter-Dom 18h-02h"/>
                  <Field label="Google Maps Link" placeholder="https://maps.google.com/..."/>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 text-sm mb-4">Redes Sociais</h3>
                  <div className="grid grid-cols-3 gap-5">
                    <Field label="Instagram" defaultValue="@thevenue_lisboa"/>
                    <Field label="Facebook" defaultValue="The Venue Lisboa"/>
                    <Field label="Google Business" placeholder="URL"/>
                  </div>
                </div>
                <div className="flex justify-end pt-2"><SaveButton/></div>
              </div>
            )}

            {tab==='brand' && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-6">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">Identidade Visual</h2>
                  <p className="text-sm text-slate-400 mt-1">Define a aparência do teu site e comunicações.</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Logo</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-pointer">
                      <div className="text-3xl mb-2">🍽️</div>
                      <div className="text-sm font-medium text-slate-700">The Venue</div>
                      <div className="text-xs text-slate-400 mt-1">Clique para substituir</div>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Cores da Marca</label>
                      <div className="space-y-3">
                        {[
                          { label:'Cor Principal', value:'#d4af37' },
                          { label:'Cor Secundária', value:'#0f172a' },
                          { label:'Cor de Fundo', value:'#ffffff' },
                        ].map(c => (
                          <div key={c.label} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg border border-slate-200 flex-shrink-0" style={{background:c.value}}/>
                            <div className="flex-1">
                              <div className="text-xs font-medium text-slate-700">{c.label}</div>
                              <div className="text-xs text-slate-400">{c.value}</div>
                            </div>
                            <input type="color" defaultValue={c.value} className="w-8 h-8 rounded cursor-pointer border-0"/>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Fonte Títulos</label>
                    <select className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option>Playfair Display</option>
                      <option>Montserrat</option>
                      <option>Inter</option>
                      <option>Poppins</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Fonte Corpo</label>
                    <select className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option>Inter</option>
                      <option>Roboto</option>
                      <option>Open Sans</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-2"><SaveButton/></div>
              </div>
            )}

            {tab==='integs' && (
              <div className="bg-white rounded-xl border border-slate-200 p-8">
                <div className="mb-6">
                  <h2 className="font-bold text-slate-900 text-lg">Integrações</h2>
                  <p className="text-sm text-slate-400 mt-1">Conecta as tuas ferramentas favoritas.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {INTEGRATIONS.map((intg,i)=>(
                    <motion.div
                      key={intg.name}
                      initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                      className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 bg-slate-50 border border-slate-200">
                        {intg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 text-sm">{intg.name}</div>
                        <div className="text-xs text-slate-400">{intg.desc}</div>
                        <Badge label={intg.status} className="mt-1.5"/>
                      </div>
                      <button className={cn(
                        'text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex-shrink-0',
                        intg.status==='Connected'
                          ? 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                          : 'text-white hover:opacity-90'
                      )} style={intg.status!=='Connected'?{background:intg.color}:{}}>
                        {intg.status==='Connected' ? 'Configurar' : 'Ligar'}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {tab==='users' && (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                  <div>
                    <h2 className="font-bold text-slate-900">Utilizadores e Permissões</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{USERS_BO.length} membros da equipa</p>
                  </div>
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    + Convidar
                  </button>
                </div>
                <div className="divide-y divide-slate-50">
                  {USERS_BO.map((u,i)=>(
                    <motion.div
                      key={u.email}
                      initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-800">{u.name}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">{u.role}</span>
                      <div className="text-xs text-slate-400 w-28 text-right">{u.lastLogin}</div>
                      <Badge label={u.status}/>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {tab==='billing' && (
              <div className="space-y-5">
                <div className="bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-blue-200 mb-1">Plano Atual</div>
                      <div className="text-3xl font-black">Pro</div>
                      <div className="text-blue-200 mt-1">€99/mês · Renovação: 1 Jun 2026</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-blue-200">93% uptime</div>
                      <div className="text-sm font-medium mt-1">✅ Todos os serviços operacionais</div>
                    </div>
                  </div>
                  <button className="mt-4 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    Upgrade para Business →
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="font-semibold text-slate-900">Faturas</h2>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {[
                      {month:'Maio 2026', val:'€99', status:'Pago', date:'2026-05-01'},
                      {month:'Abril 2026', val:'€99', status:'Pago', date:'2026-04-01'},
                      {month:'Março 2026', val:'€99', status:'Pago', date:'2026-03-01'},
                      {month:'Fevereiro 2026', val:'€49', status:'Pago', date:'2026-02-01'},
                    ].map((inv,i)=>(
                      <motion.div
                        key={inv.month}
                        initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.08}}
                        className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/80 transition-colors"
                      >
                        <span className="font-medium text-slate-800 text-sm">Fatura {inv.month}</span>
                        <span className="font-bold text-slate-900">{inv.val}</span>
                        <Badge label={inv.status}/>
                        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">⬇ Download</button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab==='notifs' && (
              <div className="bg-white rounded-xl border border-slate-200 p-8">
                <div className="mb-6">
                  <h2 className="font-bold text-slate-900 text-lg">Notificações</h2>
                  <p className="text-sm text-slate-400 mt-1">Configura quais notificações automáticas queres receber.</p>
                </div>
                <div className="divide-y divide-slate-50">
                  {[
                    {label:'Email de confirmação de reserva', desc:'Enviado automaticamente ao cliente', on:true},
                    {label:'Lembrete 24h antes (SMS)', desc:'Reduz no-shows em até 40%', on:true},
                    {label:'WhatsApp de confirmação', desc:'Requer integração WhatsApp Business', on:false},
                    {label:'Alerta novo lead', desc:'Email ao manager quando há novo contacto', on:true},
                    {label:'Relatório semanal', desc:'Resumo de segunda-feira às 08:00', on:true},
                    {label:'Aniversário VIP (WhatsApp)', desc:'Automático no dia do aniversário', on:true},
                    {label:'Cancelamento de reserva', desc:'Notificação imediata ao manager', on:true},
                  ].map(n=><Toggle key={n.label} label={n.label} defaultChecked={n.on} desc={n.desc}/>)}
                </div>
                <div className="flex justify-end mt-6"><SaveButton/></div>
              </div>
            )}

            {tab==='website' && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-6">
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">Website & SEO</h2>
                  <p className="text-sm text-slate-400 mt-1">Configurações do teu site público.</p>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <Field label="Subdomínio SmartHive" defaultValue="thevenue.smarthive.pt"/>
                  <Field label="Domínio próprio (CNAME)" defaultValue="www.thevenue.pt"/>
                </div>
                <div className="space-y-5">
                  <Field label="SEO Title" defaultValue="The Venue Lisboa | Fine Dining & Cocktails"/>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">SEO Description</label>
                    <textarea
                      defaultValue="Restaurante premium em Lisboa. Fine dining, cocktails artesanais e música ao vivo. Reserve a sua mesa online."
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none h-20"
                    />
                  </div>
                  <Field label="Google Analytics ID" placeholder="G-XXXXXXXXXX"/>
                </div>
                <div className="flex justify-end pt-2"><SaveButton/></div>
              </div>
            )}
          </motion.div>
        </div>
      </PageWrapper>
    </>
  )
}
