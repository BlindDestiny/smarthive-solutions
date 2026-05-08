import { addDays, toDateStr, seededRandom } from './utils'

const rand = seededRandom(42)
const TODAY = toDateStr(new Date())

// ── TYPES ──────────────────────────────────────────────────────
export type Tier = 'VIP' | 'Corporate' | 'Regular' | 'Occasional'
export type ContactStatus = 'Customer' | 'Lead'
export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed' | 'No Show'
export type CampaignStatus = 'Active' | 'Completed' | 'Draft' | 'Scheduled' | 'Paused'

export interface Contact {
  id: string; name: string; email: string; phone: string
  tier: Tier; visits: number; spend: number; lastVisit: string
  status: ContactStatus; preferences: string; allergies: string
  birthday: string; tags: string[]; loyaltyPts: number
  source: string; city: string; note: string
}

export interface ActivityItem {
  type: string; icon: string; text: string; date: string; channel: string
}

export interface Booking {
  id: string; customer: string; date: string; time: string
  pax: number; zone: string; occasion: string; status: BookingStatus
  note: string; paid: boolean; staff: string; deposit: number
}

export interface Campaign {
  id: string; name: string; type: string; status: CampaignStatus
  audience: string; sent: number; delivered: number; opened: number
  clicked: number; converted: number; revenue: number
  start: string; end: string; subject: string
}

export interface StaffMember {
  id: string; name: string; role: string; schedule: string
  status: 'Active' | 'On Leave'; email: string; hired: string
  bookable: boolean; daysOff: number; avatar: string
}

export interface Event {
  name: string; date: string; time: string
  price: number; capacity: number; sold: number
  description: string; emoji: string
}

// ── CONTACTS ──────────────────────────────────────────────────
export const CONTACTS: Contact[] = [
  { id:'C001', name:'Ana Ferreira', email:'ana@email.com', phone:'912 345 678', tier:'VIP', visits:24, spend:1840, lastVisit:'2026-05-05', status:'Customer', preferences:'Mesa junto à janela, vinho tinto', allergies:'Glúten', birthday:'1985-03-12', tags:['vip','regular-fri','wine-lover'], loyaltyPts:920, source:'Walk-in', city:'Lisboa', note:'Vem às sextas com o marido. Alergia: glúten.' },
  { id:'C002', name:'João Silva', email:'joao@gmail.com', phone:'963 456 789', tier:'Regular', visits:11, spend:620, lastVisit:'2026-04-28', status:'Customer', preferences:'Zona bar, cerveja artesanal', allergies:'—', birthday:'1990-07-22', tags:['music-events','bar-regular'], loyaltyPts:310, source:'Instagram', city:'Lisboa', note:'Fã de jazz e música ao vivo.' },
  { id:'C003', name:'TechStart Lda', email:'eventos@techstart.pt', phone:'21 123 4567', tier:'Corporate', visits:5, spend:3200, lastVisit:'2026-03-15', status:'Customer', preferences:'Sala privada, menu fixo', allergies:'Vários (confirmar)', birthday:'—', tags:['corporate','quarterly'], loyaltyPts:0, source:'LinkedIn', city:'Lisboa', note:'Jantares trimestrais de equipa.' },
  { id:'C004', name:'Marta Costa', email:'marta@hotmail.com', phone:'936 789 012', tier:'VIP', visits:38, spend:2950, lastVisit:'2026-05-06', status:'Customer', preferences:'Mesa 4, rosé e cocktails', allergies:'Marisco', birthday:'1978-11-30', tags:['vip','anniversary'], loyaltyPts:1475, source:'Referral', city:'Lisboa', note:'ALERGIA GRAVE: marisco. Aniversário 30 Nov.' },
  { id:'C005', name:'Bruno Alves', email:'bruno@sapo.pt', phone:'913 456 789', tier:'VIP', visits:19, spend:1620, lastVisit:'2026-05-03', status:'Customer', preferences:'Lounge VIP, whisky premium', allergies:'—', birthday:'1982-12-25', tags:['vip','whisky','business'], loyaltyPts:810, source:'Walk-in', city:'Cascais', note:'Traz frequentemente clientes de negócios.' },
  { id:'C006', name:'Sofia Lopes', email:'sofia@email.com', phone:'926 781 234', tier:'Regular', visits:9, spend:510, lastVisit:'2026-05-01', status:'Customer', preferences:'Bar, cocktails especiais', allergies:'Lactose', birthday:'1992-08-03', tags:['social-media','cocktails'], loyaltyPts:255, source:'Instagram', city:'Lisboa', note:'Partilha stories no Instagram.' },
  { id:'C007', name:'Pedro Mendes', email:'pedro@outlook.com', phone:'916 543 210', tier:'Regular', visits:6, spend:340, lastVisit:'2026-04-10', status:'Customer', preferences:'Terraço', allergies:'—', birthday:'1995-02-14', tags:['terrace'], loyaltyPts:170, source:'Google', city:'Amadora', note:'' },
  { id:'C008', name:'Carla Rodrigues', email:'carla@email.com', phone:'927 890 123', tier:'Regular', visits:7, spend:430, lastVisit:'2026-04-15', status:'Lead', preferences:'Interior tranquilo', allergies:'Frutos secos', birthday:'1994-06-18', tags:['instagram-lead'], loyaltyPts:215, source:'Instagram', city:'Lisboa', note:'Alergia: frutos secos.' },
  { id:'C009', name:'NovoBanco RH', email:'rh@novobanco.pt', phone:'21 345 6789', tier:'Corporate', visits:8, spend:5600, lastVisit:'2026-04-22', status:'Customer', preferences:'Sala VIP, menu degustação', allergies:'Confirmar antecipadamente', birthday:'—', tags:['corporate','high-value'], loyaltyPts:0, source:'Cold outreach', city:'Lisboa', note:'Alto valor. Sempre com reserva antecipada.' },
  { id:'C010', name:'Raquel Nunes', email:'raquel@gmail.com', phone:'962 345 678', tier:'Occasional', visits:3, spend:150, lastVisit:'2026-01-20', status:'Lead', preferences:'—', allergies:'—', birthday:'1988-05-08', tags:['instagram-lead','follow-up'], loyaltyPts:75, source:'Instagram', city:'Porto', note:'Follow up pendente.' },
  { id:'C011', name:'Henrique Faria', email:'henrique@gmail.com', phone:'918 765 432', tier:'Occasional', visits:2, spend:280, lastVisit:'2026-02-14', status:'Customer', preferences:'Mesa grande (grupos)', allergies:'—', birthday:'1987-09-15', tags:['groups'], loyaltyPts:140, source:'Google', city:'Lisboa', note:'Grupos para aniversários.' },
  { id:'C012', name:'Deloitte Portugal', email:'eventos@deloitte.pt', phone:'21 999 8888', tier:'Corporate', visits:2, spend:1200, lastVisit:'2026-03-05', status:'Lead', preferences:'Sala privada, AV setup', allergies:'—', birthday:'—', tags:['corporate','prospect'], loyaltyPts:0, source:'LinkedIn', city:'Lisboa', note:'' },
]

export const CONTACT_ACTIVITY: Record<string, ActivityItem[]> = {
  C001: [
    { type:'booking', icon:'📅', text:'Reserva confirmada — Mesa 4, 20:00, 2 pax', date:'2026-05-05', channel:'website' },
    { type:'whatsapp', icon:'💬', text:'Confirmação enviada via WhatsApp', date:'2026-05-04', channel:'whatsapp' },
    { type:'note', icon:'📝', text:'Pediu decoração especial para aniversário do marido', date:'2026-04-30', channel:'backoffice' },
    { type:'campaign', icon:'📣', text:'Abriu campanha "Menu Especial Dia da Mãe"', date:'2026-04-29', channel:'email' },
    { type:'booking', icon:'📅', text:'Reserva concluída — jantar de aniversário', date:'2026-04-15', channel:'website' },
    { type:'loyalty', icon:'⭐', text:'Atingiu 900 pontos — nível VIP mantido', date:'2026-04-15', channel:'system' },
  ],
  C004: [
    { type:'booking', icon:'📅', text:'Reserva confirmada — Mesa 4, 20:00, 2 pax', date:'2026-05-06', channel:'website' },
    { type:'whatsapp', icon:'💬', text:'Confirmou alergia a marisco via WhatsApp', date:'2026-05-05', channel:'whatsapp' },
    { type:'note', icon:'📝', text:'ATENÇÃO: alergia grave a marisco — sempre avisar cozinha', date:'2026-05-01', channel:'backoffice' },
    { type:'loyalty', icon:'⭐', text:'Ganhou 50 pontos — total: 1475 pts', date:'2026-04-22', channel:'system' },
  ],
}

// ── BOOKINGS ──────────────────────────────────────────────────
export const BOOKINGS: Booking[] = [
  { id:'R001', customer:'Marta Costa', date:TODAY, time:'20:00', pax:2, zone:'Mesa 4', occasion:'Jantar', status:'Confirmed', note:'⚠️ Alergia marisco — avisar cozinha', paid:false, staff:'Ana Lima', deposit:0 },
  { id:'R002', customer:'João Silva', date:TODAY, time:'21:30', pax:4, zone:'Bar', occasion:'', status:'Confirmed', note:'', paid:false, staff:'Rui Ferreira', deposit:0 },
  { id:'R003', customer:'TechStart Lda', date:TODAY, time:'19:30', pax:12, zone:'Sala Privada', occasion:'Jantar de equipa', status:'Confirmed', note:'Menu fixo 35€/pax', paid:true, staff:'Ana Lima', deposit:420 },
  { id:'R004', customer:'Raquel Nunes', date:TODAY, time:'20:30', pax:6, zone:'Mesa 8', occasion:'Aniversário', status:'Confirmed', note:'Preparar bolo surpresa 🎂', paid:true, staff:'Ana Lima', deposit:30 },
  { id:'R005', customer:'Bruno Alves', date:toDateStr(addDays(new Date(), 1)), time:'21:00', pax:3, zone:'Lounge VIP', occasion:'Reunião negócios', status:'Confirmed', note:'Macallan 18 na mesa', paid:false, staff:'Rui Ferreira', deposit:0 },
  { id:'R006', customer:'Ana Ferreira', date:toDateStr(addDays(new Date(), 2)), time:'20:00', pax:2, zone:'Mesa 2', occasion:'Aniversário marido', status:'Pending', note:'Decorar mesa com flores', paid:false, staff:'—', deposit:0 },
  { id:'R007', customer:'Sofia Lopes', date:toDateStr(addDays(new Date(), 3)), time:'20:30', pax:4, zone:'Terraço', occasion:'', status:'Pending', note:'', paid:false, staff:'—', deposit:0 },
  { id:'R008', customer:'NovoBanco RH', date:toDateStr(addDays(new Date(), 8)), time:'19:00', pax:20, zone:'Sala VIP', occasion:'Jantar corporativo', status:'Confirmed', note:'65€/pax vinho incluído', paid:true, staff:'Inês Carvalho', deposit:400 },
  { id:'R009', customer:'Henrique Faria', date:toDateStr(addDays(new Date(), 4)), time:'21:00', pax:10, zone:'Mesa Grande', occasion:'Aniversário', status:'Pending', note:'Confirmar menu', paid:false, staff:'—', deposit:0 },
  { id:'R010', customer:'Pedro Mendes', date:toDateStr(addDays(new Date(), -3)), time:'20:00', pax:2, zone:'Terraço', occasion:'', status:'Completed', note:'', paid:true, staff:'Ana Lima', deposit:0 },
]

// ── CAMPAIGNS ──────────────────────────────────────────────────
export const CAMPAIGNS: Campaign[] = [
  { id:'CP001', name:'Noite de Jazz — Maio', type:'Email + WhatsApp', status:'Active', audience:'Todos', sent:183, delivered:178, opened:94, clicked:31, converted:8, revenue:960, start:'2026-05-01', end:'2026-05-15', subject:'🎵 Jazz Night está de volta — garanta o seu lugar' },
  { id:'CP002', name:'Menu Especial Dia da Mãe', type:'WhatsApp', status:'Completed', audience:'VIP + Regular', sent:247, delivered:244, opened:198, clicked:87, converted:42, revenue:3780, start:'2026-04-28', end:'2026-05-04', subject:'💐 Surpreenda a sua mãe num jantar especial' },
  { id:'CP003', name:'Happy Hour 2ª Feira', type:'Email', status:'Draft', audience:'Regular', sent:0, delivered:0, opened:0, clicked:0, converted:0, revenue:0, start:'2026-05-12', end:'2026-06-30', subject:'🍸 Segunda tem mais sabor — Happy Hour exclusivo' },
  { id:'CP004', name:'Jantar Degustação Junho', type:'Email + SMS', status:'Scheduled', audience:'VIP + Corporate', sent:0, delivered:0, opened:0, clicked:0, converted:0, revenue:0, start:'2026-05-20', end:'2026-06-30', subject:'🍷 Uma experiência gastronómica única — Junho' },
]

// ── STAFF ──────────────────────────────────────────────────────
export const STAFF: StaffMember[] = [
  { id:'S001', name:'Miguel Santos', role:'Chef Executivo', schedule:'Ter–Dom', status:'Active', email:'miguel@thevenue.pt', hired:'2018-01-01', bookable:false, daysOff:12, avatar:'MS' },
  { id:'S002', name:'Inês Carvalho', role:'Sommelier', schedule:'Qui–Dom', status:'Active', email:'ines@thevenue.pt', hired:'2020-03-15', bookable:true, daysOff:8, avatar:'IC' },
  { id:'S003', name:'Rui Ferreira', role:'Barman', schedule:'Seg–Sáb', status:'Active', email:'rui@thevenue.pt', hired:'2019-06-01', bookable:true, daysOff:10, avatar:'RF' },
  { id:'S004', name:'Ana Lima', role:'Rececionista', schedule:'Ter–Dom', status:'Active', email:'ana@thevenue.pt', hired:'2021-09-01', bookable:true, daysOff:14, avatar:'AL' },
  { id:'S005', name:'Carlos Duarte', role:'Cozinheiro', schedule:'Ter–Dom', status:'On Leave', email:'carlos@thevenue.pt', hired:'2022-01-10', bookable:false, daysOff:2, avatar:'CD' },
]

// ── EVENTS ──────────────────────────────────────────────────────
export const EVENTS: Event[] = [
  { name:'Jazz Night', date:'2026-05-15', time:'21:00', price:15, capacity:60, sold:42, description:'Noite de jazz ao vivo com o Quarteto Pedro Santos. Inclui welcome drink.', emoji:'🎵' },
  { name:'Jantar Degustação', date:'2026-05-22', time:'20:00', price:85, capacity:30, sold:18, description:'Menu de 7 pratos com harmonização de vinhos pelo Sommelier.', emoji:'🍷' },
  { name:'Cocktail Masterclass', date:'2026-06-05', time:'18:00', price:35, capacity:20, sold:8, description:'Aprenda a criar cocktails clássicos e modernos com o nosso barman.', emoji:'🍸' },
]

// ── ANALYTICS SERIES ──────────────────────────────────────────
export function generateSeries(days = 30, base = 6, variance = 2) {
  const r = seededRandom(42)
  return Array.from({ length: days }, (_, i) => ({
    date: toDateStr(addDays(new Date(), i - days + 1)),
    label: addDays(new Date(), i - days + 1).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
    reservations: Math.max(1, Math.round(base + (r() - 0.5) * variance * 2)),
    revenue: Math.round((base + (r() - 0.5) * variance * 2) * (40 + r() * 30)),
    leads: Math.max(0, Math.round(2 + (r() - 0.5) * 2)),
  }))
}

export const SERIES = generateSeries(30)

export const PIPELINE = [
  { client:'StartupX Lda', event:'Lançamento Produto', date:'2026-05-20', pax:40, value:3200, status:'Proposta Enviada', prob:70, contact:'Carlos M.' },
  { client:'Associação AICEP', event:'Cocktail Networking', date:'2026-06-05', pax:80, value:6000, status:'Reunião Marcada', prob:50, contact:'Dra. Fonseca' },
  { client:'Deloitte Portugal', event:'Jantar Anual', date:'2026-06-20', pax:60, value:8500, status:'Contactado', prob:30, contact:'Ricardo A.' },
  { client:'Casamento Silva & Costa', event:'Cocktail Pré-casamento', date:'2026-07-01', pax:30, value:2100, status:'Fechado', prob:100, contact:'Maria Silva' },
  { client:'Microsoft Portugal', event:'Team Building', date:'2026-07-15', pax:25, value:3500, status:'Novo Lead', prob:20, contact:'Ana T.' },
]
