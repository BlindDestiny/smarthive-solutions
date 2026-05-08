'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Plus, X, MessageCircle, Mail, Phone, Calendar, Star, Tag, MapPin, ExternalLink, Users } from 'lucide-react'
import Header from '@/components/header'
import Badge from '@/components/badge'
import PageWrapper from '@/components/page-wrapper'
import KpiCard from '@/components/kpi-card'
import { CONTACTS, CONTACT_ACTIVITY, type Contact } from '@/lib/data'
import { cn } from '@/lib/utils'

const TIER_COLORS: Record<string, string> = {
  VIP: 'bg-violet-100 text-violet-700 ring-violet-200',
  Corporate: 'bg-teal-100 text-teal-700 ring-teal-200',
  Regular: 'bg-blue-100 text-blue-700 ring-blue-200',
  Occasional: 'bg-slate-100 text-slate-600 ring-slate-200',
}

const TIER_ICONS: Record<string, string> = {
  VIP: '🥇', Corporate: '🏢', Regular: '🥈', Occasional: '👤'
}

const ACT_COLORS: Record<string, string> = {
  booking: 'bg-blue-500', whatsapp: 'bg-emerald-500',
  note: 'bg-slate-400', campaign: 'bg-violet-500', loyalty: 'bg-amber-500',
}

function ContactDrawer({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  const activities = CONTACT_ACTIVITY[contact.id] || []

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        key="drawer"
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        className="fixed right-0 top-0 h-screen w-[420px] bg-white shadow-drawer z-50 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
              {contact.name.split(' ').map(n => n[0]).join('').slice(0,2)}
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg leading-tight">{contact.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ring-1', TIER_COLORS[contact.tier])}>
                  {TIER_ICONS[contact.tier]} {contact.tier}
                </span>
                <Badge label={contact.status} />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 p-6 bg-slate-50 border-b border-slate-100">
            {[
              { label:'Visitas', value:contact.visits },
              { label:'Gasto total', value:`€${contact.spend.toLocaleString()}` },
              { label:'Loyalty pts', value:`⭐ ${contact.loyaltyPts}` },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-lg font-bold text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Contact info */}
          <div className="p-6 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Contacto</h3>
            {[
              { icon:Phone, text:contact.phone },
              { icon:Mail, text:contact.email },
              { icon:MapPin, text:contact.city },
              { icon:Calendar, text:`Última visita: ${contact.lastVisit}` },
              { icon:Star, text:`Origem: ${contact.source}` },
            ].map(({ icon:Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <Icon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="text-sm text-slate-700">{text}</span>
              </div>
            ))}
          </div>

          {/* Preferences */}
          <div className="px-6 pb-6 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Perfil</h3>
            {contact.preferences !== '—' && (
              <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700">
                🪑 {contact.preferences}
              </div>
            )}
            {contact.allergies !== '—' && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-sm text-rose-700 font-medium">
                ⚠️ Alergias: {contact.allergies}
              </div>
            )}
            {contact.birthday !== '—' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                🎂 Aniversário: {contact.birthday}
              </div>
            )}
            {contact.note && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                📝 {contact.note}
              </div>
            )}
            {/* Tags */}
            {contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {contact.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                    <Tag className="w-2.5 h-2.5" />{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Activity timeline */}
          {activities.length > 0 && (
            <div className="px-6 pb-6">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Histórico</h3>
              <div className="space-y-0">
                {activities.map((act, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex gap-3 pb-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className={cn('w-2 h-2 rounded-full flex-shrink-0 mt-1.5', ACT_COLORS[act.type] || 'bg-slate-300')} />
                      {i < activities.length - 1 && <div className="w-px flex-1 bg-slate-100 mt-1" />}
                    </div>
                    <div className="flex-1 pb-1">
                      <p className="text-sm text-slate-700">{act.icon} {act.text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">{act.date}</span>
                        <span className="text-xs text-slate-300">·</span>
                        <span className="text-xs text-slate-400">{act.channel}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 grid grid-cols-3 gap-2">
          {[
            { icon:MessageCircle, label:'WhatsApp', color:'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-200' },
            { icon:Mail, label:'Email', color:'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200' },
            { icon:Calendar, label:'Reservar', color:'text-violet-600 bg-violet-50 hover:bg-violet-100 border-violet-200' },
          ].map(({ icon:Icon, label, color }) => (
            <button key={label} className={cn('flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-medium transition-colors', color)}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function CrmPage() {
  const [selected, setSelected] = useState<Contact | null>(null)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'all'|'customers'|'leads'|'vip'>('all')

  const tabs = [
    { key:'all', label:`Todos (${CONTACTS.length})` },
    { key:'customers', label:`Clientes (${CONTACTS.filter(c=>c.status==='Customer').length})` },
    { key:'leads', label:`Leads (${CONTACTS.filter(c=>c.status==='Lead').length})` },
    { key:'vip', label:`VIP (${CONTACTS.filter(c=>c.tier==='VIP').length})` },
  ] as const

  const filtered = CONTACTS.filter(c => {
    if (search && !`${c.name} ${c.email} ${c.phone} ${c.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase())) return false
    if (activeTab === 'customers' && c.status !== 'Customer') return false
    if (activeTab === 'leads' && c.status !== 'Lead') return false
    if (activeTab === 'vip' && c.tier !== 'VIP') return false
    return true
  })

  return (
    <>
      <Header
        title="CRM"
        subtitle="Gestão de clientes e leads"
        breadcrumb={['The Venue', 'CRM']}
        actions={
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" /> Novo Contacto
          </button>
        }
      />
      <PageWrapper>
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label:'Total Contactos', value:CONTACTS.length, accent:'#8b5cf6', delay:0 },
            { label:'Clientes', value:CONTACTS.filter(c=>c.status==='Customer').length, accent:'#10b981', delay:0.08 },
            { label:'Leads Ativos', value:CONTACTS.filter(c=>c.status==='Lead').length, accent:'#f97316', delay:0.16 },
            { label:'Clientes VIP', value:CONTACTS.filter(c=>c.tier==='VIP').length, accent:'#7c3aed', delay:0.24 },
          ].map(k => <KpiCard key={k.label} {...k} />)}
        </div>

        {/* Search + Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-100">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Pesquisar por nome, email, tag…"
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    activeTab === t.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">
            <div className="col-span-4">Cliente</div>
            <div className="col-span-2">Tier</div>
            <div className="col-span-2">Visitas</div>
            <div className="col-span-2">Gasto Total</div>
            <div className="col-span-2">Estado</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-50">
            {filtered.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelected(c)}
                className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{c.name}</div>
                    <div className="text-xs text-slate-400 truncate">{c.email}</div>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ring-1', TIER_COLORS[c.tier])}>
                    {TIER_ICONS[c.tier]} {c.tier}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-slate-700 font-medium">{c.visits}</div>
                <div className="col-span-2 text-sm font-semibold text-slate-800">€{c.spend.toLocaleString()}</div>
                <div className="col-span-2 flex items-center justify-between">
                  <Badge label={c.status} />
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <Users className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhum contacto encontrado</p>
            </div>
          )}
        </div>
      </PageWrapper>

      {selected && <ContactDrawer contact={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
