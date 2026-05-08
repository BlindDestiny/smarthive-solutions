'use client'
import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
  Monitor, Tablet, Smartphone, Eye, Globe, Plus, Trash2,
  GripVertical, ChevronDown, ChevronUp, X, Check,
  Type, Image, Layout, MessageSquare, Star, Mail, Map,
  Users, HelpCircle, Zap, Minus, Play,
  ArrowRight, Settings, FileText, Hash,
  Video, DollarSign, Bell, Clock,
  Palette, Navigation, Layers, Link, AlignCenter
} from 'lucide-react'
import Header from '@/components/header'
import { useToast } from '@/components/toast-provider'
import { cn } from '@/lib/utils'

// ── TYPES ──────────────────────────────────────────────────────
type Device = 'desktop' | 'tablet' | 'mobile'
type HeroVariant = 'classic' | 'split' | 'minimal' | 'fullscreen' | 'booking'
type BlockType =
  | 'hero' | 'features' | 'gallery' | 'carousel' | 'testimonials'
  | 'contact' | 'text' | 'text_image' | 'events' | 'cta' | 'map'
  | 'team' | 'faq' | 'spacer'
  | 'stats' | 'logo_bar' | 'video' | 'pricing' | 'newsletter' | 'timeline' | 'divider'

interface Block { id: string; type: BlockType; data: Record<string, any> }

interface NavbarConfig {
  style: 'transparent' | 'white' | 'dark' | 'glass'
  logoText: string
  links: { label: string; href: string }[]
  ctaText: string
  sticky: boolean
}

interface DesignSystem {
  preset: 'modern' | 'elegant' | 'bold' | 'minimal'
  primaryColor: string
  accentColor: string
  headingFont: string
  bodyFont: string
  spacing: 'compact' | 'normal' | 'spacious'
}

interface Page {
  id: string; name: string; slug: string; published: boolean
  navbar: NavbarConfig; blocks: Block[]
}

// ── CATALOG ────────────────────────────────────────────────────
const CATALOG: Record<BlockType, { label: string; icon: React.ComponentType<any>; category: string; desc: string; color: string }> = {
  hero:         { label:'Hero',           icon:Layout,      category:'Conteúdo',    desc:'Banner principal com variantes', color:'#3b82f6' },
  features:     { label:'Features',       icon:Layers,      category:'Conteúdo',    desc:'Funcionalidades em colunas',     color:'#8b5cf6' },
  text:         { label:'Texto',          icon:Type,        category:'Conteúdo',    desc:'Bloco de texto rico',            color:'#64748b' },
  text_image:   { label:'Texto + Imagem', icon:Image,       category:'Conteúdo',    desc:'Texto e imagem lado a lado',     color:'#0ea5e9' },
  stats:        { label:'Estatísticas',   icon:Hash,        category:'Conteúdo',    desc:'Contadores animados de impacto', color:'#06b6d4' },
  timeline:     { label:'Timeline',       icon:Clock,       category:'Conteúdo',    desc:'Linha cronológica de eventos',   color:'#a855f7' },
  faq:          { label:'FAQ',            icon:HelpCircle,  category:'Conteúdo',    desc:'Perguntas frequentes acordeão',  color:'#14b8a6' },
  gallery:      { label:'Galeria',        icon:Image,       category:'Media',       desc:'Grelha de imagens configurável', color:'#f59e0b' },
  carousel:     { label:'Carousel',       icon:Play,        category:'Media',       desc:'Slideshow de imagens',           color:'#f97316' },
  video:        { label:'Vídeo',          icon:Video,       category:'Media',       desc:'Embed de YouTube / Vimeo',       color:'#ef4444' },
  logo_bar:     { label:'Logo Bar',       icon:Star,        category:'Media',       desc:'Logos de parceiros / imprensa',  color:'#d4af37' },
  events:       { label:'Eventos',        icon:Zap,         category:'Conteúdo',    desc:'Lista de próximos eventos',      color:'#10b981' },
  testimonials: { label:'Testemunhos',    icon:MessageSquare,category:'Social',     desc:'Avaliações e quotes',            color:'#f59e0b' },
  team:         { label:'Equipa',         icon:Users,       category:'Social',      desc:'Cards da equipa',                color:'#6366f1' },
  contact:      { label:'Formulário',     icon:Mail,        category:'Conversão',   desc:'Formulário de contacto',         color:'#f43f5e' },
  cta:          { label:'CTA Banner',     icon:ArrowRight,  category:'Conversão',   desc:'Faixa call-to-action',           color:'#ec4899' },
  newsletter:   { label:'Newsletter',     icon:Bell,        category:'Conversão',   desc:'Subscrição de email',            color:'#8b5cf6' },
  pricing:      { label:'Preços',         icon:DollarSign,  category:'Conversão',   desc:'Tabela de planos / preços',      color:'#22c55e' },
  map:          { label:'Mapa',           icon:Map,         category:'Localização', desc:'Google Maps com info',           color:'#22c55e' },
  spacer:       { label:'Espaço',         icon:Minus,       category:'Layout',      desc:'Espaçamento entre blocos',       color:'#94a3b8' },
  divider:      { label:'Divisor',        icon:Minus,       category:'Layout',      desc:'Linha separadora decorativa',    color:'#cbd5e1' },
}

const CATEGORIES = ['Conteúdo','Media','Social','Conversão','Localização','Layout']

// ── DEFAULT DATA ───────────────────────────────────────────────
const DEFAULT_DATA: Record<BlockType, Record<string, any>> = {
  hero:         { variant:'classic', title:'The Venue', subtitle:'Fine dining · Craft cocktails · Live music', ctaText:'Reservar Mesa', ctaSecondary:'Ver Menu', bg:'dark', align:'center', overlay:true },
  features:     { title:'O que nos distingue', columns:3, items:[
    { icon:'👨‍🍳', title:'Fine Dining', desc:'Menu de degustação pelo Chef Miguel Santos' },
    { icon:'🍷', title:'Carta de Vinhos', desc:'Seleção exclusiva com harmonização' },
    { icon:'🎵', title:'Música Ao Vivo', desc:'Todas as sextas e sábados' },
  ]},
  text:         { title:'Sobre nós', body:'The Venue é um restaurante premium em Lisboa, fundado em 2018.', align:'center' },
  text_image:   { title:'A Nossa História', body:'Desde 2018 criamos memórias inesquecíveis. O Chef Miguel Santos traz uma fusão da cozinha portuguesa com técnicas contemporâneas.', imgPosition:'right', ctaText:'Saber mais' },
  stats:        { title:'The Venue em números', items:[
    { value:'2.400', label:'Clientes por mês', suffix:'+' },
    { value:'4.9', label:'Avaliação Google', suffix:'★' },
    { value:'6', label:'Anos de experiência', suffix:'' },
    { value:'98', label:'Taxa de satisfação', suffix:'%' },
  ]},
  timeline:     { title:'A Nossa História', items:[
    { year:'2018', title:'Abertura', desc:'The Venue abre portas na Rua Augusta' },
    { year:'2020', title:'Expansão', desc:'Novo espaço para eventos privados' },
    { year:'2022', title:'Prémio', desc:'Melhor restaurante de Lisboa — Time Out' },
    { year:'2024', title:'Terraço', desc:'Inauguração do rooftop bar' },
  ]},
  gallery:      { title:'Momentos', columns:3, showCaptions:false },
  carousel:     { title:'A Nossa Cozinha', autoplay:true, interval:4 },
  video:        { title:'A experiência The Venue', url:'https://www.youtube.com/embed/dQw4w9WgXcQ', aspect:'16/9' },
  logo_bar:     { title:'Como nos conhecem', logos:['TimeOut','Expresso','Público','Forbes','NIT','Vogue'] },
  events:       { title:'Próximos Eventos', maxItems:3, showPrice:true },
  testimonials: { title:'O que dizem os clientes', columns:3, items:[
    { quote:'Uma experiência gastronómica incrível. Superou todas as expectativas.', name:'Ana F.', role:'Cliente VIP' },
    { quote:'Perfeito para jantares de negócios. Ambiente premium, serviço impecável.', name:'Bruno A.', role:'Cliente' },
    { quote:'Organizamos o jantar de equipa aqui. Perfeito do início ao fim!', name:'TechStart Lda', role:'Corporate' },
  ]},
  team:         { title:'A Nossa Equipa', columns:4 },
  contact:      { title:'Fale Connosco', fields:['name','email','phone','message'], submitText:'Enviar mensagem', sendTo:'info@thevenue.pt' },
  cta:          { title:'Reserve a sua mesa', subtitle:'Disponível Terça a Domingo, 18h–02h', ctaText:'Reservar agora', bg:'#1a1a2e' },
  newsletter:   { title:'Fique a par de tudo', subtitle:'Eventos, menus especiais e promoções exclusivas.', placeholder:'o seu email...', ctaText:'Subscrever', bg:'light' },
  pricing:      { title:'Experiências', items:[
    { name:'A La Carte', price:'55', period:'por pessoa', features:['Menu completo','Carta de vinhos','Sobremesa'], highlight:false },
    { name:'Degustação', price:'95', period:'por pessoa', features:['7 pratos','Harmonização incluída','Champagne de boas-vindas'], highlight:true },
    { name:'Grupo / Evento', price:'Sob consulta', period:'', features:['Menu personalizado','Espaço reservado','Coordenador dedicado'], highlight:false },
  ]},
  map:          { address:'Rua Augusta 142, 1100-053 Lisboa', hours:'Ter–Dom: 18h–02h', phone:'+351 21 123 4567' },
  faq:          { title:'Perguntas frequentes', items:[
    { q:'Aceitam reservas online?', a:'Sim, pode reservar diretamente no nosso site ou ligar.' },
    { q:'Têm menu vegetariano?', a:'Sim, temos opções vegetarianas e veganas. Informe na reserva.' },
    { q:'Qual a política de cancelamento?', a:'Cancelamentos até 24h antes sem custo.' },
  ]},
  spacer:       { height:48 },
  divider:      { style:'line', color:'#e2e8f0', thickness:1, margin:32 },
}

const DEFAULT_NAVBAR: NavbarConfig = {
  style: 'dark', logoText: 'The Venue',
  links: [{ label:'Menu', href:'/menu' }, { label:'Eventos', href:'/eventos' }, { label:'Sobre', href:'/sobre' }],
  ctaText: 'Reservar', sticky: true,
}

const DEFAULT_DESIGN: DesignSystem = {
  preset: 'elegant', primaryColor: '#1a1a2e', accentColor: '#d4af37',
  headingFont: 'Playfair Display', bodyFont: 'Inter',
  spacing: 'normal',
}

// ── INITIAL PAGES ──────────────────────────────────────────────
const mkId = () => Math.random().toString(36).slice(2)

const INITIAL_PAGES: Page[] = [
  {
    id:'pg-home', name:'Início', slug:'/', published:true, navbar: DEFAULT_NAVBAR,
    blocks:[
      { id:'b1', type:'hero',         data:{ ...DEFAULT_DATA.hero } },
      { id:'b2', type:'stats',        data:{ ...DEFAULT_DATA.stats } },
      { id:'b3', type:'features',     data:{ ...DEFAULT_DATA.features } },
      { id:'b4', type:'events',       data:{ ...DEFAULT_DATA.events } },
      { id:'b5', type:'testimonials', data:{ ...DEFAULT_DATA.testimonials } },
      { id:'b6', type:'logo_bar',     data:{ ...DEFAULT_DATA.logo_bar } },
      { id:'b7', type:'cta',          data:{ ...DEFAULT_DATA.cta } },
      { id:'b8', type:'map',          data:{ ...DEFAULT_DATA.map } },
    ],
  },
  { id:'pg-menu',     name:'Menu',     slug:'/menu',     published:true,  navbar:DEFAULT_NAVBAR, blocks:[{ id:'bm1', type:'hero', data:{...DEFAULT_DATA.hero, title:'A Nossa Carta', subtitle:'Menu de degustação e à la carte', variant:'minimal'} }, { id:'bm2', type:'pricing', data:{...DEFAULT_DATA.pricing} }, { id:'bm3', type:'features', data:{...DEFAULT_DATA.features, title:'As nossas especialidades'} }] },
  { id:'pg-events',   name:'Eventos',  slug:'/eventos',  published:true,  navbar:DEFAULT_NAVBAR, blocks:[{ id:'be1', type:'hero', data:{...DEFAULT_DATA.hero, title:'Eventos', subtitle:'Jazz, degustações e masterclasses', variant:'fullscreen'} }, { id:'be2', type:'timeline', data:{...DEFAULT_DATA.timeline} }, { id:'be3', type:'events', data:{...DEFAULT_DATA.events, maxItems:6} }] },
  { id:'pg-reservar', name:'Reservar', slug:'/reservar', published:true,  navbar:DEFAULT_NAVBAR, blocks:[{ id:'br1', type:'hero', data:{...DEFAULT_DATA.hero, title:'Reservar Mesa', subtitle:'Taxa de €5/pessoa devolvida no jantar', variant:'booking', bg:'light'} }, { id:'br2', type:'contact', data:{...DEFAULT_DATA.contact, title:'Formulário de Reserva'} }] },
  { id:'pg-sobre',    name:'Sobre',    slug:'/sobre',    published:false, navbar:DEFAULT_NAVBAR, blocks:[{ id:'bs1', type:'hero', data:{...DEFAULT_DATA.hero, title:'A Nossa História', subtitle:'The Venue desde 2018', variant:'split'} }, { id:'bs2', type:'timeline', data:{...DEFAULT_DATA.timeline} }, { id:'bs3', type:'team', data:{...DEFAULT_DATA.team} }] },
]

// ── NAVBAR PREVIEW (canvas top) ────────────────────────────────
function NavbarPreview({ config, onClick, isSelected }: { config: NavbarConfig; onClick: () => void; isSelected: boolean }) {
  const dark = config.style === 'dark'
  const glass = config.style === 'glass'
  const bg = config.style === 'dark' ? 'bg-slate-900' : config.style === 'glass' ? 'bg-white/20 backdrop-blur-sm' : config.style === 'transparent' ? 'bg-transparent' : 'bg-white'
  const text = dark ? 'text-white' : glass ? 'text-white' : 'text-slate-800'
  const border = dark ? 'border-white/10' : 'border-slate-200'

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative cursor-pointer transition-all group',
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-1'
      )}
    >
      <div className={cn('flex items-center justify-between px-6 py-3 border-b', bg, border)}>
        <div className={cn('font-bold text-sm tracking-wider', text)}>
          ✦ {config.logoText}
        </div>
        <div className="flex items-center gap-5">
          {config.links.slice(0, 3).map((l, i) => (
            <span key={i} className={cn('text-xs font-medium', dark || glass ? 'text-slate-300' : 'text-slate-500')}>{l.label}</span>
          ))}
        </div>
        <div className={cn('text-xs font-bold px-3 py-1.5 rounded-full', dark ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white')}>
          {config.ctaText}
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg">Editar Navbar</div>
      </div>
    </div>
  )
}

// ── BLOCK PREVIEWS ─────────────────────────────────────────────
function BlockPreviewContent({ block }: { block: Block }) {
  const { type, data } = block

  if (type === 'hero') {
    const variant: HeroVariant = data.variant || 'classic'

    if (variant === 'split') return (
      <div className="relative overflow-hidden rounded-lg h-40 flex bg-slate-900">
        <div className="flex-1 flex flex-col justify-center p-5">
          <div className="text-[10px] font-bold text-amber-400 tracking-widest uppercase mb-2">Lisboa · Est. 2018</div>
          <div className="text-lg font-black text-white leading-tight mb-2">{data.title}</div>
          <div className="text-[11px] text-slate-400 mb-3">{data.subtitle}</div>
          <div className="flex gap-2">
            {data.ctaText && <div className="bg-amber-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">{data.ctaText}</div>}
            {data.ctaSecondary && <div className="border border-white/30 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">{data.ctaSecondary}</div>}
          </div>
        </div>
        <div className="w-36 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center flex-shrink-0">
          <Image className="w-8 h-8 text-slate-500"/>
        </div>
      </div>
    )

    if (variant === 'minimal') return (
      <div className="relative overflow-hidden rounded-lg h-40 bg-white flex flex-col items-center justify-center text-center p-6 border border-slate-100">
        <div className="text-[10px] font-medium text-slate-400 tracking-widest uppercase mb-2">Lisboa · Est. 2018</div>
        <div className="text-2xl font-black text-slate-900 tracking-tight mb-2">{data.title}</div>
        <div className="text-[11px] text-slate-500 mb-4">{data.subtitle}</div>
        {data.ctaText && <div className="inline-block border-2 border-slate-900 text-slate-900 text-[10px] font-bold px-4 py-1.5 rounded-full">{data.ctaText}</div>}
      </div>
    )

    if (variant === 'fullscreen') return (
      <div className="relative overflow-hidden rounded-lg h-44 bg-gradient-to-b from-black via-slate-900 to-slate-900 flex flex-col items-center justify-center text-center p-6">
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.2) 0%, transparent 60%)'}}/>
        <div className="relative">
          <div className="text-[10px] font-bold text-amber-400/80 tracking-[0.3em] uppercase mb-3">— Lisboa · Est. 2018 —</div>
          <div className="text-2xl font-black text-white tracking-tight mb-2">{data.title}</div>
          <div className="text-[11px] text-slate-400 mb-5">{data.subtitle}</div>
          <div className="flex items-center justify-center gap-3">
            {data.ctaText && <div className="bg-amber-500 text-white text-[10px] font-bold px-4 py-2 rounded-full">{data.ctaText}</div>}
            {data.ctaSecondary && <div className="text-slate-400 text-[10px] flex items-center gap-1">{data.ctaSecondary} <ArrowRight className="w-3 h-3"/></div>}
          </div>
        </div>
      </div>
    )

    if (variant === 'booking') return (
      <div className={cn('relative overflow-hidden rounded-lg h-44', data.bg==='light'?'bg-slate-50 border border-slate-100':'bg-slate-900')}>
        <div className="flex h-full">
          <div className="flex-1 flex flex-col justify-center p-4">
            <div className={cn('text-base font-black mb-1', data.bg==='light'?'text-slate-900':'text-white')}>{data.title}</div>
            <div className={cn('text-[10px] mb-3', data.bg==='light'?'text-slate-500':'text-slate-400')}>{data.subtitle}</div>
          </div>
          <div className="w-36 bg-white shadow-lg m-3 rounded-xl p-3 flex flex-col gap-2">
            <div className="text-[9px] font-bold text-slate-700">Reservar</div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] text-slate-400">📅 Data</div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] text-slate-400">🕗 Hora</div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[9px] text-slate-400">👥 Pessoas</div>
            <div className="bg-slate-900 text-white text-[9px] font-bold text-center rounded-lg py-1.5">Confirmar</div>
          </div>
        </div>
      </div>
    )

    // classic (default)
    return (
      <div className={cn('relative overflow-hidden rounded-lg h-44 flex flex-col items-center justify-center text-center p-6', data.bg==='dark'?'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900':data.bg==='light'?'bg-gradient-to-br from-slate-100 to-slate-200':'bg-gradient-to-br from-blue-900 to-blue-700')}>
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 30% 50%, rgba(212,175,55,0.3) 0%, transparent 60%)'}}/>
        <div className="relative">
          <div className={cn('text-xs font-bold tracking-widest uppercase mb-2', data.bg==='light'?'text-slate-400':'text-amber-400/70')}>Lisboa · Est. 2018</div>
          <div className={cn('text-xl font-black tracking-tight mb-1', data.bg==='light'?'text-slate-900':'text-white')}>{data.title}</div>
          <div className={cn('text-xs mb-3', data.bg==='light'?'text-slate-500':'text-slate-300')}>{data.subtitle}</div>
          <div className="flex gap-2 justify-center">
            {data.ctaText && <div className="inline-block bg-white text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-full">{data.ctaText}</div>}
            {data.ctaSecondary && <div className="inline-block border border-white/40 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">{data.ctaSecondary}</div>}
          </div>
        </div>
      </div>
    )
  }

  if (type === 'stats') return (
    <div className="p-4 bg-slate-900 rounded-lg">
      <div className="text-xs font-bold text-center text-white mb-4">{data.title}</div>
      <div className="grid grid-cols-4 gap-3">
        {(data.items||[]).map((item: any, i: number) => (
          <div key={i} className="text-center">
            <div className="text-xl font-black text-amber-400">{item.value}<span className="text-base">{item.suffix}</span></div>
            <div className="text-[9px] text-slate-400 mt-0.5 leading-tight">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  )

  if (type === 'timeline') return (
    <div className="p-4 bg-white rounded-lg border border-slate-100">
      <div className="text-xs font-bold text-slate-700 mb-3">{data.title}</div>
      <div className="relative ml-4">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200"/>
        {(data.items||[]).slice(0,3).map((item: any, i: number) => (
          <div key={i} className="relative pl-5 pb-3 last:pb-0">
            <div className="absolute left-[-4px] top-0.5 w-2 h-2 rounded-full bg-amber-400 border-2 border-white"/>
            <div className="text-[10px] font-bold text-amber-600">{item.year}</div>
            <div className="text-[11px] font-semibold text-slate-800 leading-tight">{item.title}</div>
            <div className="text-[9px] text-slate-400 leading-snug">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )

  if (type === 'video') return (
    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
      <div className="text-xs font-bold text-center text-white mb-2">{data.title}</div>
      <div className="relative bg-black rounded-lg h-24 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-40" style={{background:'linear-gradient(135deg, #1e293b 25%, #0f172a 75%)'}}/>
        <div className="relative w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
          <Play className="w-5 h-5 text-white ml-0.5"/>
        </div>
        <div className="absolute bottom-2 left-3 text-[9px] text-slate-400 font-mono">YouTube</div>
      </div>
    </div>
  )

  if (type === 'logo_bar') return (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
      <div className="text-[10px] font-bold text-center text-slate-400 uppercase tracking-widest mb-3">{data.title}</div>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {(data.logos||[]).map((logo: string, i: number) => (
          <div key={i} className="text-[11px] font-bold text-slate-400 opacity-60 tracking-wide">{logo}</div>
        ))}
      </div>
    </div>
  )

  if (type === 'newsletter') return (
    <div className={cn('p-5 rounded-lg border text-center', data.bg==='dark'?'bg-slate-900 border-slate-800':'bg-slate-50 border-slate-100')}>
      <div className={cn('text-sm font-bold mb-1', data.bg==='dark'?'text-white':'text-slate-900')}>{data.title}</div>
      <div className={cn('text-[11px] mb-3', data.bg==='dark'?'text-slate-400':'text-slate-500')}>{data.subtitle}</div>
      <div className="flex gap-2 max-w-xs mx-auto">
        <div className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] text-slate-400">{data.placeholder}</div>
        <div className="bg-slate-900 text-white text-[10px] font-bold px-3 py-2 rounded-lg whitespace-nowrap">{data.ctaText}</div>
      </div>
    </div>
  )

  if (type === 'pricing') return (
    <div className="p-3 bg-white rounded-lg border border-slate-100">
      <div className="text-xs font-bold text-center text-slate-700 mb-3">{data.title}</div>
      <div className="grid grid-cols-3 gap-2">
        {(data.items||[]).map((plan: any, i: number) => (
          <div key={i} className={cn('rounded-xl p-3 border text-center', plan.highlight?'bg-slate-900 border-slate-700':'bg-slate-50 border-slate-100')}>
            <div className={cn('text-[10px] font-bold mb-1', plan.highlight?'text-amber-400':'text-slate-700')}>{plan.name}</div>
            <div className={cn('text-base font-black leading-tight', plan.highlight?'text-white':'text-slate-900')}>
              {plan.price.startsWith('Sob')?<span className="text-xs">Sob consulta</span>:<><span className="text-[9px]">€</span>{plan.price}</>}
            </div>
            <div className={cn('text-[8px] mt-0.5 mb-2', plan.highlight?'text-slate-400':'text-slate-400')}>{plan.period}</div>
            {(plan.features||[]).slice(0,2).map((f: string, j: number) => (
              <div key={j} className={cn('text-[8px] py-0.5', plan.highlight?'text-slate-300':'text-slate-500')}>✓ {f}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )

  if (type === 'features') return (
    <div className="p-4 bg-white rounded-lg border border-slate-100">
      <div className="text-xs font-bold text-center text-slate-700 mb-3">{data.title}</div>
      <div className={cn('grid gap-2', data.columns===2?'grid-cols-2':data.columns===4?'grid-cols-4':'grid-cols-3')}>
        {(data.items||[]).slice(0,data.columns||3).map((item: any, i: number) => (
          <div key={i} className="bg-slate-50 rounded-lg p-2 text-center border border-slate-100">
            <div className="text-lg mb-1">{item.icon}</div>
            <div className="text-[10px] font-semibold text-slate-700 leading-tight">{item.title}</div>
            <div className="text-[9px] text-slate-400 mt-0.5 leading-tight line-clamp-2">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )

  if (type === 'gallery') return (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
      <div className="text-xs font-bold text-center text-slate-700 mb-2">{data.title}</div>
      <div className={cn('grid gap-1.5', data.columns===2?'grid-cols-2':data.columns===4?'grid-cols-4':'grid-cols-3')}>
        {Array.from({length:data.columns||3}).map((_,i)=>(
          <div key={i} className="bg-gradient-to-br from-slate-200 to-slate-300 rounded aspect-square flex items-center justify-center">
            <Image className="w-4 h-4 text-slate-400"/>
          </div>
        ))}
      </div>
    </div>
  )

  if (type === 'carousel') return (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
      <div className="text-xs font-bold text-center text-slate-700 mb-2">{data.title}</div>
      <div className="relative bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg h-20 flex items-center justify-center">
        <Play className="w-5 h-5 text-slate-400"/>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {[0,1,2].map(i=><div key={i} className={cn('w-1.5 h-1.5 rounded-full',i===0?'bg-white':'bg-white/40')}/>)}
        </div>
      </div>
    </div>
  )

  if (type === 'testimonials') return (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
      <div className="text-xs font-bold text-center text-slate-700 mb-2">{data.title}</div>
      <div className={cn('grid gap-2', data.columns===2?'grid-cols-2':'grid-cols-3')}>
        {(data.items||[]).slice(0,data.columns||3).map((t:any,i:number)=>(
          <div key={i} className="bg-white rounded-lg p-2 border border-slate-100 shadow-sm">
            <div className="text-amber-400 text-[10px] mb-1">★★★★★</div>
            <div className="text-[9px] text-slate-500 italic leading-snug line-clamp-2">"{t.quote}"</div>
            <div className="text-[9px] font-semibold text-slate-700 mt-1">— {t.name}</div>
          </div>
        ))}
      </div>
    </div>
  )

  if (type === 'contact') return (
    <div className="p-4 bg-white rounded-lg border border-slate-100">
      <div className="text-xs font-bold text-slate-700 mb-3 text-center">{data.title}</div>
      <div className="space-y-2 max-w-xs mx-auto">
        {(data.fields||['name','email','message']).slice(0,3).map((f:string)=>(
          <div key={f} className={cn('border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-[10px] text-slate-400',f==='message'?'h-10 flex items-start pt-2':'')}>
            {f==='name'?'Nome':f==='email'?'Email':f==='phone'?'Telefone':'Mensagem...'}
          </div>
        ))}
        <div className="bg-slate-900 text-white text-[10px] font-semibold text-center rounded-lg py-2">{data.submitText||'Enviar'}</div>
      </div>
    </div>
  )

  if (type === 'cta') return (
    <div className="rounded-lg overflow-hidden h-20 flex items-center justify-center text-center px-6" style={{background:data.bg||'#1a1a2e'}}>
      <div>
        <div className="text-white font-bold text-sm">{data.title}</div>
        {data.subtitle && <div className="text-slate-300 text-[10px] mt-0.5">{data.subtitle}</div>}
        <div className="inline-block bg-white text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full mt-2">{data.ctaText}</div>
      </div>
    </div>
  )

  if (type === 'map') return (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
      <div className="bg-gradient-to-br from-green-100 to-emerald-200 rounded-lg h-20 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:'repeating-linear-gradient(0deg,#86efac 0,#86efac 1px,transparent 1px,transparent 20px),repeating-linear-gradient(90deg,#86efac 0,#86efac 1px,transparent 1px,transparent 20px)'}}/>
        <div className="relative flex flex-col items-center">
          <div className="text-2xl">📍</div>
          <div className="text-[10px] font-semibold text-emerald-800 bg-white/80 px-2 py-0.5 rounded-full mt-1">{data.address?.split(',')[0]}</div>
        </div>
      </div>
      <div className="flex gap-3 mt-2 text-[10px] text-slate-500">
        <span>🕒 {data.hours}</span><span>📞 {data.phone}</span>
      </div>
    </div>
  )

  if (type === 'text') return (
    <div className={cn('p-4 bg-white rounded-lg border border-slate-100',data.align==='center'?'text-center':'')}>
      <div className="text-sm font-bold text-slate-800 mb-1">{data.title}</div>
      <div className="text-xs text-slate-500 leading-relaxed line-clamp-3">{data.body}</div>
    </div>
  )

  if (type === 'text_image') return (
    <div className="p-3 bg-white rounded-lg border border-slate-100">
      <div className={cn('flex gap-3 items-center',data.imgPosition==='left'?'flex-row-reverse':'flex-row')}>
        <div className="flex-1">
          <div className="text-xs font-bold text-slate-800 mb-1">{data.title}</div>
          <div className="text-[10px] text-slate-500 leading-relaxed line-clamp-3">{data.body}</div>
          {data.ctaText && <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 mt-2">{data.ctaText} <ArrowRight className="w-2.5 h-2.5"/></div>}
        </div>
        <div className="w-24 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex-shrink-0 flex items-center justify-center">
          <Image className="w-4 h-4 text-slate-400"/>
        </div>
      </div>
    </div>
  )

  if (type === 'events') return (
    <div className="p-3 bg-white rounded-lg border border-slate-100">
      <div className="text-xs font-bold text-slate-700 mb-2">{data.title}</div>
      {[{n:'Jazz Night',d:'15 Mai',p:15},{n:'Jantar Degustação',d:'22 Mai',p:85},{n:'Cocktail Masterclass',d:'05 Jun',p:35}].slice(0,data.maxItems||3).map((e,i)=>(
        <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-50 rounded text-center leading-6 text-[10px] font-bold text-blue-600">{e.d.split(' ')[0]}</div>
            <span className="text-[11px] font-medium text-slate-700">{e.n}</span>
          </div>
          {data.showPrice && <span className="text-[10px] text-slate-500">€{e.p}</span>}
        </div>
      ))}
    </div>
  )

  if (type === 'team') return (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
      <div className="text-xs font-bold text-center text-slate-700 mb-2">{data.title}</div>
      <div className={cn('grid gap-2',data.columns===3?'grid-cols-3':data.columns===2?'grid-cols-2':'grid-cols-4')}>
        {['MS','IC','RF','AL'].slice(0,data.columns||4).map((av,i)=>(
          <div key={i} className="text-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 text-white text-[10px] font-bold flex items-center justify-center mx-auto mb-1">{av}</div>
            <div className="text-[9px] font-semibold text-slate-600">Staff {i+1}</div>
          </div>
        ))}
      </div>
    </div>
  )

  if (type === 'faq') return (
    <div className="p-3 bg-white rounded-lg border border-slate-100">
      <div className="text-xs font-bold text-slate-700 mb-2">{data.title}</div>
      {(data.items||[]).slice(0,3).map((item:any,i:number)=>(
        <div key={i} className="py-1.5 border-b border-slate-50 last:border-0 flex items-start justify-between gap-2">
          <div className="text-[10px] font-medium text-slate-700 leading-snug">{item.q}</div>
          <ChevronDown className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5"/>
        </div>
      ))}
    </div>
  )

  if (type === 'divider') return (
    <div className="py-3 flex items-center justify-center">
      <div className="flex-1 h-px" style={{background: data.color||'#e2e8f0'}}/>
      {data.style === 'ornament' && <div className="mx-3 text-slate-300">✦</div>}
      {data.style === 'ornament' && <div className="flex-1 h-px" style={{background: data.color||'#e2e8f0'}}/>}
    </div>
  )

  if (type === 'spacer') return (
    <div className="flex items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200 py-2">
      <span className="text-[10px] text-slate-400 font-mono">Espaço · {data.height}px</span>
    </div>
  )

  return <div className="bg-slate-100 rounded-lg h-12 flex items-center justify-center text-xs text-slate-400">{type}</div>
}

// ── NAVBAR EDITOR ──────────────────────────────────────────────
function NavbarEditor({ config, onUpdate, onClose }: { config: NavbarConfig; onUpdate: (c: NavbarConfig) => void; onClose: () => void }) {
  const { toast } = useToast()
  const set = (k: keyof NavbarConfig, v: any) => onUpdate({ ...config, [k]: v })

  return (
    <motion.div
      initial={{ x:'100%', opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:'100%', opacity:0 }}
      transition={{ type:'spring', stiffness:360, damping:32 }}
      className="absolute right-0 top-0 h-full w-80 bg-white border-l border-slate-200 shadow-xl z-10 flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-900/10 flex items-center justify-center">
            <Navigation className="w-3.5 h-3.5 text-slate-700"/>
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm">Navbar</div>
            <div className="text-[10px] text-slate-400">Barra de navegação</div>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"><X className="w-4 h-4 text-slate-500"/></button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Nome do site / Logo</label>
          <input value={config.logoText} onChange={e=>set('logoText',e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"/>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Estilo</label>
          <div className="grid grid-cols-2 gap-2">
            {(['white','dark','glass','transparent'] as const).map(s=>(
              <button key={s} onClick={()=>set('style',s)}
                className={cn('py-2 rounded-lg border text-xs font-medium transition-all',
                  config.style===s?'bg-slate-900 text-white border-slate-900':'bg-white text-slate-600 border-slate-200 hover:border-slate-300')}>
                {s==='white'?'Branco':s==='dark'?'Escuro':s==='glass'?'Glass':'Transparente'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Links de navegação</label>
          {config.links.map((link, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={link.label} onChange={e=>{const links=[...config.links];links[i]={...links[i],label:e.target.value};set('links',links)}}
                placeholder="Label" className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"/>
              <input value={link.href} onChange={e=>{const links=[...config.links];links[i]={...links[i],href:e.target.value};set('links',links)}}
                placeholder="/pagina" className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"/>
              <button onClick={()=>set('links',config.links.filter((_,j)=>j!==i))} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-400">
                <X className="w-3 h-3"/>
              </button>
            </div>
          ))}
          <button onClick={()=>set('links',[...config.links,{label:'Novo',href:'/novo'}])}
            className="flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:text-blue-700 mt-1">
            <Plus className="w-3 h-3"/>Adicionar link
          </button>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Texto do botão CTA</label>
          <input value={config.ctaText} onChange={e=>set('ctaText',e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"/>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <div onClick={()=>set('sticky',!config.sticky)}
            className={cn('w-4 h-4 rounded border-2 flex items-center justify-center transition-colors',config.sticky?'bg-blue-600 border-blue-600':'border-slate-300 bg-white')}>
            {config.sticky && <Check className="w-2.5 h-2.5 text-white"/>}
          </div>
          <span className="text-sm text-slate-700">Navbar fixa ao scroll</span>
        </label>
      </div>

      <div className="p-4 border-t border-slate-100">
        <button onClick={()=>{toast('success','Navbar actualizada!');onClose()}}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
          Aplicar alterações
        </button>
      </div>
    </motion.div>
  )
}

// ── PROPERTIES PANEL ──────────────────────────────────────────
function PropertiesPanel({ block, onUpdate, onClose }: { block: Block; onUpdate: (data: Record<string, any>) => void; onClose: () => void }) {
  const { type, data } = block
  const { toast } = useToast()
  const info = CATALOG[type]
  const set = (k: string, v: any) => onUpdate({ ...data, [k]: v })

  const Field = ({ label, k, type='text', placeholder='' }: { label:string; k:string; type?:string; placeholder?:string }) => (
    <div>
      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</label>
      <input type={type} value={data[k]||''} onChange={e=>set(k,e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"/>
    </div>
  )

  const Select = ({ label, k, options }: { label:string; k:string; options:{value:any;label:string}[] }) => (
    <div>
      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">{label}</label>
      <select value={data[k]||options[0].value} onChange={e=>set(k,isNaN(Number(e.target.value))?e.target.value:Number(e.target.value))}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )

  return (
    <motion.div
      initial={{ x:'100%', opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:'100%', opacity:0 }}
      transition={{ type:'spring', stiffness:360, damping:32 }}
      className="absolute right-0 top-0 h-full w-80 bg-white border-l border-slate-200 shadow-xl z-10 flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:info.color+'18',border:`1px solid ${info.color}30`}}>
            <info.icon className="w-3.5 h-3.5" style={{color:info.color}}/>
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm">{info.label}</div>
            <div className="text-[10px] text-slate-400">{info.category}</div>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors"><X className="w-4 h-4 text-slate-500"/></button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {type === 'hero' && <>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Variante</label>
            <div className="grid grid-cols-1 gap-1.5">
              {(['classic','split','minimal','fullscreen','booking'] as HeroVariant[]).map(v=>(
                <button key={v} onClick={()=>set('variant',v)}
                  className={cn('px-3 py-2 rounded-lg border text-xs font-medium text-left transition-all flex items-center justify-between',
                    data.variant===v||(!data.variant&&v==='classic')?'bg-blue-50 border-blue-300 text-blue-700':'bg-white border-slate-200 text-slate-600 hover:border-slate-300')}>
                  <span>{v==='classic'?'Clássico':v==='split'?'Split (50/50)':v==='minimal'?'Minimal':v==='fullscreen'?'Fullscreen':'Booking Form'}</span>
                  {(data.variant===v||(!data.variant&&v==='classic'))&&<Check className="w-3.5 h-3.5"/>}
                </button>
              ))}
            </div>
          </div>
          <Field label="Título principal" k="title"/>
          <Field label="Subtítulo" k="subtitle"/>
          <div className="grid grid-cols-2 gap-3">
            <Field label="CTA Principal" k="ctaText"/>
            <Field label="CTA Secundário" k="ctaSecondary"/>
          </div>
          <Select label="Fundo" k="bg" options={[{value:'dark',label:'Escuro'},{value:'light',label:'Claro'},{value:'gradient',label:'Gradiente'}]}/>
          <Select label="Alinhamento" k="align" options={[{value:'center',label:'Centro'},{value:'left',label:'Esquerda'},{value:'right',label:'Direita'}]}/>
        </>}

        {type === 'stats' && <>
          <Field label="Título da secção" k="title"/>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Estatísticas</label>
            {(data.items||[]).map((item:any,i:number)=>(
              <div key={i} className="bg-slate-50 rounded-lg p-3 mb-2 border border-slate-100 grid grid-cols-3 gap-2">
                <input value={item.value} onChange={e=>{const items=[...data.items];items[i]={...items[i],value:e.target.value};set('items',items)}}
                  placeholder="Valor" className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white col-span-1"/>
                <input value={item.suffix} onChange={e=>{const items=[...data.items];items[i]={...items[i],suffix:e.target.value};set('items',items)}}
                  placeholder="%" className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white col-span-1"/>
                <input value={item.label} onChange={e=>{const items=[...data.items];items[i]={...items[i],label:e.target.value};set('items',items)}}
                  placeholder="Label" className="px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white col-span-3"/>
              </div>
            ))}
          </div>
        </>}

        {type === 'features' && <>
          <Field label="Título da secção" k="title"/>
          <Select label="Colunas" k="columns" options={[{value:2,label:'2 colunas'},{value:3,label:'3 colunas'},{value:4,label:'4 colunas'}]}/>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Items</label>
            {(data.items||[]).map((item:any,i:number)=>(
              <div key={i} className="bg-slate-50 rounded-lg p-3 mb-2 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-base">{item.icon}</div>
                  <input value={item.title} onChange={e=>{const items=[...data.items];items[i]={...items[i],title:e.target.value};set('items',items)}}
                    className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white"/>
                </div>
                <input value={item.desc} onChange={e=>{const items=[...data.items];items[i]={...items[i],desc:e.target.value};set('items',items)}}
                  placeholder="Descrição..." className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white"/>
              </div>
            ))}
          </div>
        </>}

        {type === 'text' && <>
          <Field label="Título" k="title"/>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Conteúdo</label>
            <textarea value={data.body||''} onChange={e=>set('body',e.target.value)} rows={5}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"/>
          </div>
          <Select label="Alinhamento" k="align" options={[{value:'left',label:'Esquerda'},{value:'center',label:'Centro'},{value:'right',label:'Direita'}]}/>
        </>}

        {type === 'text_image' && <>
          <Field label="Título" k="title"/>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Texto</label>
            <textarea value={data.body||''} onChange={e=>set('body',e.target.value)} rows={4}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"/>
          </div>
          <Field label="Texto do botão" k="ctaText"/>
          <Select label="Posição da imagem" k="imgPosition" options={[{value:'right',label:'Direita'},{value:'left',label:'Esquerda'}]}/>
        </>}

        {type === 'gallery' && <>
          <Field label="Título" k="title"/>
          <Select label="Colunas" k="columns" options={[{value:2,label:'2 colunas'},{value:3,label:'3 colunas'},{value:4,label:'4 colunas'}]}/>
        </>}

        {type === 'video' && <>
          <Field label="Título" k="title"/>
          <Field label="URL do vídeo (embed)" k="url" placeholder="https://www.youtube.com/embed/..."/>
        </>}

        {type === 'logo_bar' && <>
          <Field label="Título" k="title"/>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Logos / Marcas</label>
            {(data.logos||[]).map((logo:string,i:number)=>(
              <div key={i} className="flex gap-2 mb-1.5">
                <input value={logo} onChange={e=>{const logos=[...data.logos];logos[i]=e.target.value;set('logos',logos)}}
                  className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"/>
                <button onClick={()=>set('logos',data.logos.filter((_:any,j:number)=>j!==i))} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-400"><X className="w-3 h-3"/></button>
              </div>
            ))}
            <button onClick={()=>set('logos',[...(data.logos||[]),'Nova Marca'])}
              className="flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:text-blue-700 mt-1"><Plus className="w-3 h-3"/>Adicionar</button>
          </div>
        </>}

        {type === 'newsletter' && <>
          <Field label="Título" k="title"/>
          <Field label="Subtítulo" k="subtitle"/>
          <Field label="Placeholder" k="placeholder"/>
          <Field label="Texto do botão" k="ctaText"/>
          <Select label="Fundo" k="bg" options={[{value:'light',label:'Claro'},{value:'dark',label:'Escuro'}]}/>
        </>}

        {type === 'pricing' && <>
          <Field label="Título" k="title"/>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Planos</label>
            {(data.items||[]).map((plan:any,i:number)=>(
              <div key={i} className="bg-slate-50 rounded-lg p-3 mb-2 border border-slate-100 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input value={plan.name} onChange={e=>{const items=[...data.items];items[i]={...items[i],name:e.target.value};set('items',items)}}
                    placeholder="Nome" className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"/>
                  <input value={plan.price} onChange={e=>{const items=[...data.items];items[i]={...items[i],price:e.target.value};set('items',items)}}
                    placeholder="Preço" className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"/>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div onClick={()=>{const items=[...data.items];items[i]={...items[i],highlight:!items[i].highlight};set('items',items)}}
                    className={cn('w-4 h-4 rounded border-2 flex items-center justify-center',plan.highlight?'bg-blue-600 border-blue-600':'border-slate-300 bg-white')}>
                    {plan.highlight&&<Check className="w-2.5 h-2.5 text-white"/>}
                  </div>
                  <span className="text-xs text-slate-600">Destaque</span>
                </label>
              </div>
            ))}
          </div>
        </>}

        {type === 'testimonials' && <>
          <Field label="Título da secção" k="title"/>
          <Select label="Colunas" k="columns" options={[{value:1,label:'1 coluna'},{value:2,label:'2 colunas'},{value:3,label:'3 colunas'}]}/>
        </>}

        {type === 'contact' && <>
          <Field label="Título" k="title"/>
          <Field label="Email de destino" k="sendTo"/>
          <Field label="Texto do botão" k="submitText"/>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Campos</label>
            {['name','email','phone','message'].map(f=>(
              <label key={f} className="flex items-center gap-2.5 py-2 border-b border-slate-50 last:border-0 cursor-pointer">
                <div onClick={()=>{const fields=data.fields||['name','email','message'];const next=fields.includes(f)?fields.filter((x:string)=>x!==f):[...fields,f];set('fields',next)}}
                  className={cn('w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0',(data.fields||['name','email','message']).includes(f)?'bg-blue-600 border-blue-600':'border-slate-300 bg-white')}>
                  {(data.fields||['name','email','message']).includes(f)&&<Check className="w-2.5 h-2.5 text-white"/>}
                </div>
                <span className="text-sm text-slate-700">{f==='name'?'Nome':f==='email'?'Email':f==='phone'?'Telefone':'Mensagem'}</span>
              </label>
            ))}
          </div>
        </>}

        {type === 'cta' && <>
          <Field label="Título" k="title"/>
          <Field label="Subtítulo" k="subtitle"/>
          <Field label="Texto do botão" k="ctaText"/>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Cor de fundo</label>
            <div className="flex items-center gap-3">
              <input type="color" value={data.bg||'#1a1a2e'} onChange={e=>set('bg',e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200"/>
              <span className="text-sm text-slate-500 font-mono">{data.bg||'#1a1a2e'}</span>
            </div>
            <div className="flex gap-2 mt-2">
              {['#1a1a2e','#0f172a','#1e40af','#7c3aed','#be185d','#b45309'].map(c=>(
                <button key={c} onClick={()=>set('bg',c)} className={cn('w-6 h-6 rounded-md border-2 transition-all',data.bg===c?'border-blue-500 scale-110':'border-transparent')} style={{background:c}}/>
              ))}
            </div>
          </div>
        </>}

        {type === 'faq' && <>
          <Field label="Título" k="title"/>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Perguntas</label>
            {(data.items||[]).map((item:any,i:number)=>(
              <div key={i} className="bg-slate-50 rounded-lg p-3 mb-2 border border-slate-100 space-y-2">
                <input value={item.q} onChange={e=>{const items=[...data.items];items[i]={...items[i],q:e.target.value};set('items',items)}}
                  placeholder="Pergunta..." className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"/>
                <textarea value={item.a} onChange={e=>{const items=[...data.items];items[i]={...items[i],a:e.target.value};set('items',items)}}
                  rows={2} placeholder="Resposta..." className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white resize-none focus:outline-none"/>
              </div>
            ))}
          </div>
        </>}

        {type === 'map' && <>
          <Field label="Morada" k="address"/>
          <Field label="Horários" k="hours"/>
          <Field label="Telefone" k="phone"/>
        </>}

        {type === 'timeline' && <>
          <Field label="Título" k="title"/>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Marcos</label>
            {(data.items||[]).map((item:any,i:number)=>(
              <div key={i} className="bg-slate-50 rounded-lg p-3 mb-2 border border-slate-100 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <input value={item.year} onChange={e=>{const items=[...data.items];items[i]={...items[i],year:e.target.value};set('items',items)}}
                    placeholder="2024" className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"/>
                  <input value={item.title} onChange={e=>{const items=[...data.items];items[i]={...items[i],title:e.target.value};set('items',items)}}
                    placeholder="Título" className="px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white col-span-2 focus:outline-none"/>
                </div>
                <input value={item.desc} onChange={e=>{const items=[...data.items];items[i]={...items[i],desc:e.target.value};set('items',items)}}
                  placeholder="Descrição..." className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"/>
              </div>
            ))}
          </div>
        </>}

        {type === 'events' && <>
          <Field label="Título" k="title"/>
          <Select label="Nº de eventos" k="maxItems" options={[{value:3,label:'3 eventos'},{value:6,label:'6 eventos'},{value:9,label:'9 eventos'}]}/>
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={()=>set('showPrice',!data.showPrice)} className={cn('w-4 h-4 rounded border-2 flex items-center justify-center',data.showPrice?'bg-blue-600 border-blue-600':'border-slate-300 bg-white')}>
              {data.showPrice&&<Check className="w-2.5 h-2.5 text-white"/>}
            </div>
            <span className="text-sm text-slate-700">Mostrar preços</span>
          </label>
        </>}

        {type === 'team' && <>
          <Field label="Título" k="title"/>
          <Select label="Colunas" k="columns" options={[{value:2,label:'2 colunas'},{value:3,label:'3 colunas'},{value:4,label:'4 colunas'}]}/>
        </>}

        {type === 'carousel' && <>
          <Field label="Título" k="title"/>
          <label className="flex items-center gap-2 cursor-pointer">
            <div onClick={()=>set('autoplay',!data.autoplay)} className={cn('w-4 h-4 rounded border-2 flex items-center justify-center',data.autoplay?'bg-blue-600 border-blue-600':'border-slate-300 bg-white')}>
              {data.autoplay&&<Check className="w-2.5 h-2.5 text-white"/>}
            </div>
            <span className="text-sm text-slate-700">Autoplay</span>
          </label>
          {data.autoplay&&<Select label="Intervalo" k="interval" options={[{value:3,label:'3 segundos'},{value:4,label:'4 segundos'},{value:6,label:'6 segundos'}]}/>}
        </>}

        {type === 'divider' && <>
          <Select label="Estilo" k="style" options={[{value:'line',label:'Linha simples'},{value:'ornament',label:'Com ornamento'},{value:'double',label:'Linha dupla'}]}/>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Cor</label>
            <input type="color" value={data.color||'#e2e8f0'} onChange={e=>set('color',e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200"/>
          </div>
        </>}

        {type === 'spacer' && <>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Altura (px)</label>
            <input type="range" min={16} max={200} step={8} value={data.height||48} onChange={e=>set('height',Number(e.target.value))} className="w-full accent-blue-600"/>
            <div className="text-xs text-slate-400 mt-1 text-center">{data.height||48}px</div>
          </div>
        </>}

      </div>

      <div className="p-4 border-t border-slate-100">
        <button onClick={()=>{toast('success','Bloco actualizado!');onClose()}}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
          Aplicar alterações
        </button>
      </div>
    </motion.div>
  )
}

// ── DESIGN PANEL ───────────────────────────────────────────────
const PRESETS: Record<string, Partial<DesignSystem>> = {
  modern:  { primaryColor:'#0f172a', accentColor:'#3b82f6', headingFont:'Inter',            bodyFont:'Inter',     spacing:'compact' },
  elegant: { primaryColor:'#1a1a2e', accentColor:'#d4af37', headingFont:'Playfair Display',  bodyFont:'Inter',     spacing:'normal' },
  bold:    { primaryColor:'#111827', accentColor:'#f43f5e', headingFont:'Syne',              bodyFont:'DM Sans',   spacing:'spacious' },
  minimal: { primaryColor:'#374151', accentColor:'#6b7280', headingFont:'Geist',             bodyFont:'Geist',     spacing:'normal' },
}

function DesignPanel({ design, onUpdate }: { design: DesignSystem; onUpdate: (d: DesignSystem) => void }) {
  const set = (k: keyof DesignSystem, v: any) => onUpdate({ ...design, [k]: v })

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-3">Estilo Pré-definido</label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(PRESETS) as (keyof typeof PRESETS)[]).map(p=>(
            <button key={p} onClick={()=>onUpdate({...design,...PRESETS[p],preset:p as any})}
              className={cn('p-3 rounded-xl border-2 text-left transition-all',
                design.preset===p?'border-blue-500 bg-blue-50':'border-slate-200 bg-white hover:border-slate-300')}>
              <div className={cn('text-xs font-bold mb-0.5',design.preset===p?'text-blue-700':'text-slate-800')}>
                {p==='modern'?'Modern':p==='elegant'?'Elegant':p==='bold'?'Bold':'Minimal'}
              </div>
              <div className="flex gap-1 mt-1.5">
                <div className="w-4 h-4 rounded-full border border-slate-200" style={{background:PRESETS[p].primaryColor}}/>
                <div className="w-4 h-4 rounded-full border border-slate-200" style={{background:PRESETS[p].accentColor}}/>
              </div>
              <div className="text-[9px] text-slate-400 mt-1">{PRESETS[p].headingFont}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Cores</label>
        <div className="space-y-3">
          {([['primaryColor','Cor Principal'],['accentColor','Cor de Destaque']] as const).map(([k,label])=>(
            <div key={k} className="flex items-center gap-3">
              <input type="color" value={design[k]} onChange={e=>set(k,e.target.value)} className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 flex-shrink-0"/>
              <div>
                <div className="text-xs font-medium text-slate-700">{label}</div>
                <div className="text-[10px] text-slate-400 font-mono">{design[k]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Tipografia</label>
        {([['headingFont','Títulos'],['bodyFont','Corpo de texto']] as const).map(([k,label])=>(
          <div key={k} className="mb-2">
            <div className="text-xs text-slate-500 mb-1">{label}</div>
            <select value={design[k]} onChange={e=>set(k,e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none">
              {['Inter','Playfair Display','Syne','DM Sans','Geist','Lato','Poppins','Merriweather'].map(f=>(
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Espaçamento</label>
        <div className="flex gap-2">
          {(['compact','normal','spacious'] as const).map(s=>(
            <button key={s} onClick={()=>set('spacing',s)}
              className={cn('flex-1 py-2 rounded-lg border text-xs font-medium transition-all',
                design.spacing===s?'bg-slate-900 text-white border-slate-900':'bg-white text-slate-600 border-slate-200 hover:border-slate-300')}>
              {s==='compact'?'Compacto':s==='normal'?'Normal':'Espaçoso'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── DRAGGABLE BLOCK ROW ────────────────────────────────────────
function BlockRow({ block, isSelected, onSelect, onDelete, onMoveUp, onMoveDown, isFirst, isLast }:
  { block:Block; isSelected:boolean; onSelect:()=>void; onDelete:()=>void; onMoveUp:()=>void; onMoveDown:()=>void; isFirst:boolean; isLast:boolean }) {
  const info = CATALOG[block.type]
  return (
    <Reorder.Item value={block} dragListener={false} className="relative">
      <motion.div layout onClick={onSelect}
        className={cn('group relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all mb-3',
          isSelected?'border-blue-500 shadow-lg shadow-blue-100':'border-slate-200 hover:border-slate-300 hover:shadow-md')}>
        <div className={cn('flex items-center justify-between px-3 py-2 border-b',isSelected?'bg-blue-50 border-blue-200':'bg-slate-50 border-slate-100')}>
          <div className="flex items-center gap-2">
            <GripVertical className="w-3.5 h-3.5 text-slate-300 cursor-grab active:cursor-grabbing"/>
            <div className="w-5 h-5 rounded flex items-center justify-center" style={{background:info.color+'18'}}>
              <info.icon className="w-3 h-3" style={{color:info.color}}/>
            </div>
            <span className={cn('text-xs font-semibold',isSelected?'text-blue-700':'text-slate-500')}>{info.label}</span>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={e=>{e.stopPropagation();onMoveUp()}} disabled={isFirst} className="p-1 rounded hover:bg-slate-200 transition-colors disabled:opacity-30"><ChevronUp className="w-3 h-3 text-slate-500"/></button>
            <button onClick={e=>{e.stopPropagation();onMoveDown()}} disabled={isLast} className="p-1 rounded hover:bg-slate-200 transition-colors disabled:opacity-30"><ChevronDown className="w-3 h-3 text-slate-500"/></button>
            <button onClick={e=>{e.stopPropagation();onDelete()}} className="p-1 rounded hover:bg-rose-100 transition-colors"><Trash2 className="w-3 h-3 text-rose-400"/></button>
          </div>
        </div>
        <div className="p-3 bg-white"><BlockPreviewContent block={block}/></div>
        {isSelected && <div className="absolute inset-0 ring-2 ring-inset ring-blue-400 rounded-xl pointer-events-none"/>}
      </motion.div>
    </Reorder.Item>
  )
}

// ── BLOCK PICKER ──────────────────────────────────────────────
function BlockPicker({ onAdd, onClose }: { onAdd:(type:BlockType)=>void; onClose:()=>void }) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState(CATEGORIES[0])
  const filtered = Object.entries(CATALOG).filter(([,info])=>
    info.category===cat && (search===''||info.label.toLowerCase().includes(search.toLowerCase())||info.desc.toLowerCase().includes(search.toLowerCase()))
  )
  return (
    <motion.div initial={{opacity:0,y:16,scale:0.97}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:8,scale:0.98}}
      transition={{type:'spring',stiffness:400,damping:30}}
      className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden" style={{maxHeight:'440px'}}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
        <input value={search} onChange={e=>setSearch(e.target.value)} autoFocus
          placeholder="Pesquisar blocos..." className="flex-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"/>
        <button onClick={onClose}><X className="w-4 h-4 text-slate-400 hover:text-slate-600"/></button>
      </div>
      <div className="flex">
        <div className="w-36 border-r border-slate-100 p-2 space-y-0.5 flex-shrink-0">
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCat(c)}
              className={cn('w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                cat===c?'bg-blue-600 text-white':'text-slate-500 hover:bg-slate-100 hover:text-slate-700')}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex-1 p-3 overflow-y-auto" style={{maxHeight:'380px'}}>
          <div className="grid grid-cols-2 gap-2">
            {filtered.map(([type,info])=>(
              <motion.button key={type} whileHover={{y:-2,boxShadow:'0 4px 12px rgb(0 0 0 / 0.08)'}} whileTap={{scale:0.98}}
                onClick={()=>{onAdd(type as BlockType);onClose()}}
                className="flex items-start gap-2.5 p-3 bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-left transition-all">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{background:info.color+'18',border:`1px solid ${info.color}30`}}>
                  <info.icon className="w-4 h-4" style={{color:info.color}}/>
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800">{info.label}</div>
                  <div className="text-[10px] text-slate-400 leading-snug mt-0.5">{info.desc}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────
type LeftTab = 'pages' | 'blocks' | 'design'
const DEVICE_WIDTHS = { desktop:'100%', tablet:'768px', mobile:'375px' }

export default function WebsitePage() {
  const { toast } = useToast()
  const [pages, setPages] = useState<Page[]>(INITIAL_PAGES)
  const [activePageId, setActivePageId] = useState(INITIAL_PAGES[0].id)
  const [selectedBlockId, setSelectedBlockId] = useState<string|null>(null)
  const [navbarSelected, setNavbarSelected] = useState(false)
  const [device, setDevice] = useState<Device>('desktop')
  const [showPicker, setShowPicker] = useState(false)
  const [leftTab, setLeftTab] = useState<LeftTab>('pages')
  const [addingPageName, setAddingPageName] = useState('')
  const [showAddPage, setShowAddPage] = useState(false)
  const [design, setDesign] = useState<DesignSystem>(DEFAULT_DESIGN)

  const activePage = pages.find(p=>p.id===activePageId)!
  const selectedBlock = activePage?.blocks.find(b=>b.id===selectedBlockId)||null

  const updatePage = (updated: Page) => setPages(ps=>ps.map(p=>p.id===updated.id?updated:p))

  const addBlock = (type: BlockType) => {
    const newBlock: Block = { id:mkId(), type, data:{...DEFAULT_DATA[type]} }
    updatePage({...activePage, blocks:[...activePage.blocks, newBlock]})
    setSelectedBlockId(newBlock.id)
    setNavbarSelected(false)
    toast('success',`${CATALOG[type].label} adicionado!`)
  }

  const deleteBlock = (id: string) => {
    updatePage({...activePage, blocks:activePage.blocks.filter(b=>b.id!==id)})
    if (selectedBlockId===id) setSelectedBlockId(null)
    toast('info','Bloco removido')
  }

  const updateBlockData = (id: string, data: Record<string,any>) =>
    updatePage({...activePage, blocks:activePage.blocks.map(b=>b.id===id?{...b,data}:b)})

  const updateNavbar = (navbar: NavbarConfig) => updatePage({...activePage, navbar})

  const moveBlock = (id: string, dir: 1|-1) => {
    const blocks=[...activePage.blocks]
    const idx=blocks.findIndex(b=>b.id===id)
    if (idx+dir<0||idx+dir>=blocks.length) return
    ;[blocks[idx],blocks[idx+dir]]=[blocks[idx+dir],blocks[idx]]
    updatePage({...activePage,blocks})
  }

  const addPage = () => {
    if (!addingPageName.trim()) return
    const newPage: Page = {
      id:mkId(), name:addingPageName, slug:'/'+addingPageName.toLowerCase().replace(/\s+/g,'-'),
      published:false, navbar:DEFAULT_NAVBAR,
      blocks:[{id:mkId(),type:'hero',data:{...DEFAULT_DATA.hero,title:addingPageName}}]
    }
    setPages(ps=>[...ps,newPage])
    setActivePageId(newPage.id)
    setAddingPageName('')
    setShowAddPage(false)
    toast('success',`Página "${addingPageName}" criada!`)
  }

  const togglePublish = (id: string) => {
    setPages(ps=>ps.map(p=>p.id===id?{...p,published:!p.published}:p))
    const page=pages.find(p=>p.id===id)!
    toast('success',page.published?'Página retirada do ar':'Página publicada!',page.slug)
  }

  const selectBlock = (id: string) => {
    setNavbarSelected(false)
    setSelectedBlockId(selectedBlockId===id?null:id)
  }

  const selectNavbar = () => {
    setSelectedBlockId(null)
    setNavbarSelected(v=>!v)
  }

  return (
    <>
      <Header
        title="Website Builder"
        subtitle="The Venue · Edita o teu site em tempo real"
        breadcrumb={['The Venue','Website']}
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
              <Eye className="w-4 h-4"/>Preview
            </button>
            <button onClick={()=>togglePublish(activePageId)}
              className={cn('flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-colors',
                activePage?.published?'bg-emerald-100 text-emerald-700 hover:bg-emerald-200':'bg-blue-600 hover:bg-blue-700 text-white')}>
              <Globe className="w-4 h-4"/>
              {activePage?.published?'Publicado ✓':'Publicar'}
            </button>
          </div>
        }
      />

      <div className="flex h-[calc(100vh-73px)] overflow-hidden">

        {/* ── LEFT PANEL ─────────────────────────────── */}
        <motion.aside initial={{x:-16,opacity:0}} animate={{x:0,opacity:1}}
          className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden">

          {/* Tab switcher */}
          <div className="flex border-b border-slate-100 px-2 pt-2 gap-1">
            {([['pages','Páginas'],['blocks','Blocos'],['design','Design']] as [LeftTab,string][]).map(([t,label])=>(
              <button key={t} onClick={()=>setLeftTab(t)}
                className={cn('flex-1 py-2 text-xs font-semibold rounded-t-lg transition-colors',
                  leftTab===t?'bg-slate-100 text-slate-900':'text-slate-400 hover:text-slate-600')}>
                {label}
              </button>
            ))}
          </div>

          {/* Pages tab */}
          {leftTab==='pages' && (
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 pt-3 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Páginas</span>
                  <button onClick={()=>setShowAddPage(true)} className="p-1 rounded hover:bg-slate-100 transition-colors">
                    <Plus className="w-3.5 h-3.5 text-slate-500"/>
                  </button>
                </div>
                {showAddPage && (
                  <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} className="flex gap-1.5 mb-2">
                    <input value={addingPageName} onChange={e=>setAddingPageName(e.target.value)}
                      onKeyDown={e=>e.key==='Enter'&&addPage()} autoFocus placeholder="Nome da página..."
                      className="flex-1 text-xs px-2 py-1.5 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"/>
                    <button onClick={addPage} className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Check className="w-3 h-3"/></button>
                    <button onClick={()=>{setShowAddPage(false);setAddingPageName('')}} className="p-1.5 bg-slate-100 rounded-lg hover:bg-slate-200"><X className="w-3 h-3 text-slate-500"/></button>
                  </motion.div>
                )}
                <div className="space-y-0.5">
                  {pages.map(pg=>(
                    <button key={pg.id} onClick={()=>{setActivePageId(pg.id);setSelectedBlockId(null);setNavbarSelected(false)}}
                      className={cn('w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all text-sm',
                        activePageId===pg.id?'bg-blue-50 text-blue-700 font-semibold':'text-slate-600 hover:bg-slate-50 hover:text-slate-800')}>
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-3.5 h-3.5 flex-shrink-0"/>
                        <span className="truncate">{pg.name}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className={cn('w-1.5 h-1.5 rounded-full',pg.published?'bg-emerald-400':'bg-slate-300')}/>
                        <span className="text-[10px] text-slate-400">{pg.blocks.length}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Blocks tab */}
          {leftTab==='blocks' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="px-4 pt-3 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Blocos · {activePage?.name}</span>
                </div>
                <button onClick={()=>setShowPicker(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all text-sm font-medium">
                  <Plus className="w-4 h-4"/>Adicionar bloco
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 pb-4">
                {/* Navbar item */}
                <button onClick={selectNavbar}
                  className={cn('w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all mb-1',
                    navbarSelected?'bg-blue-50 text-blue-700':'hover:bg-slate-50 text-slate-600')}>
                  <div className="w-5 h-5 rounded bg-slate-900/10 flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-3 h-3 text-slate-700"/>
                  </div>
                  <span className="text-xs font-medium truncate">Navbar</span>
                  <span className="ml-auto text-[10px] text-slate-300 flex-shrink-0">fixo</span>
                </button>
                <div className="space-y-1">
                  {activePage?.blocks.map((b,i)=>{
                    const info=CATALOG[b.type]
                    return (
                      <button key={b.id} onClick={()=>selectBlock(b.id)}
                        className={cn('w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all',
                          selectedBlockId===b.id?'bg-blue-50 text-blue-700':'hover:bg-slate-50 text-slate-600')}>
                        <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{background:info.color+'18'}}>
                          <info.icon className="w-3 h-3" style={{color:info.color}}/>
                        </div>
                        <span className="text-xs font-medium truncate">{info.label}</span>
                        <span className="ml-auto text-[10px] text-slate-300 flex-shrink-0">{i+1}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Design tab */}
          {leftTab==='design' && (
            <DesignPanel design={design} onUpdate={setDesign}/>
          )}
        </motion.aside>

        {/* ── CANVAS ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-white border-b border-slate-200">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              {(['desktop','tablet','mobile'] as Device[]).map(d=>{
                const icons={desktop:Monitor,tablet:Tablet,mobile:Smartphone}
                const Icon=icons[d]
                return (
                  <button key={d} onClick={()=>setDevice(d)}
                    className={cn('p-1.5 rounded-md transition-all',device===d?'bg-white shadow-sm text-slate-800':'text-slate-400 hover:text-slate-600')}>
                    <Icon className="w-4 h-4"/>
                  </button>
                )
              })}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className={cn('w-2 h-2 rounded-full',activePage?.published?'bg-emerald-400 animate-pulse':'bg-slate-300')}/>
              {activePage?.published?'Online':'Rascunho'}
              <span className="text-slate-300">·</span>
              <span className="font-mono">{activePage?.slug}</span>
            </div>
            <div className="text-xs text-slate-400">
              {device==='desktop'?'1280px':device==='tablet'?'768px':'375px'}
            </div>
          </div>

          {/* Canvas area */}
          <div className="flex-1 overflow-y-auto p-6">
            <motion.div animate={{width:DEVICE_WIDTHS[device]}} transition={{type:'spring',stiffness:300,damping:28}}
              className="mx-auto relative" style={{minHeight:'600px'}}>

              {device!=='desktop' && (
                <div className="bg-slate-700 rounded-t-xl px-4 py-2.5 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {['bg-rose-400','bg-amber-400','bg-emerald-400'].map(c=><div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`}/>)}
                  </div>
                  <div className="flex-1 bg-slate-600 rounded-full py-1 px-3 text-[10px] text-slate-300 font-mono text-center">
                    thevenue.smarthive.pt{activePage?.slug}
                  </div>
                </div>
              )}

              <div className={cn('bg-white shadow-2xl overflow-hidden',device==='desktop'?'rounded-xl':device==='tablet'?'':'rounded-b-xl')}>
                {/* Navbar pinned at top */}
                {activePage?.navbar && (
                  <NavbarPreview
                    config={activePage.navbar}
                    onClick={selectNavbar}
                    isSelected={navbarSelected}
                  />
                )}

                {/* Page blocks */}
                <div className="p-4">
                  <Reorder.Group axis="y" values={activePage?.blocks||[]} onReorder={blocks=>updatePage({...activePage,blocks})}>
                    {(activePage?.blocks||[]).map((block,i)=>(
                      <BlockRow
                        key={block.id} block={block}
                        isSelected={selectedBlockId===block.id}
                        onSelect={()=>selectBlock(block.id)}
                        onDelete={()=>deleteBlock(block.id)}
                        onMoveUp={()=>moveBlock(block.id,-1)}
                        onMoveDown={()=>moveBlock(block.id,1)}
                        isFirst={i===0} isLast={i===(activePage?.blocks.length||0)-1}
                      />
                    ))}
                  </Reorder.Group>

                  {!activePage?.blocks.length && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}}
                      className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                        <Layout className="w-8 h-8 text-slate-300"/>
                      </div>
                      <div className="font-semibold text-slate-700 mb-1">Página sem blocos</div>
                      <div className="text-sm text-slate-400 mb-4">Adiciona o primeiro bloco para começar</div>
                      <button onClick={()=>setShowPicker(true)} className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4"/>Adicionar bloco
                      </button>
                    </motion.div>
                  )}

                  {(activePage?.blocks.length||0)>0 && (
                    <button onClick={()=>setShowPicker(true)}
                      className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 rounded-xl text-slate-300 hover:text-blue-500 transition-all text-sm mt-1">
                      <Plus className="w-4 h-4"/>Adicionar bloco
                    </button>
                  )}
                </div>

                {/* Footer strip */}
                <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                  <div className="text-white text-xs font-bold">✦ {activePage?.navbar.logoText||'The Venue'}</div>
                  <div className="flex gap-4">
                    {activePage?.navbar.links.slice(0,3).map((l,i)=>(
                      <span key={i} className="text-slate-500 text-[10px]">{l.label}</span>
                    ))}
                  </div>
                  <div className="text-slate-600 text-[10px]">© 2025 SmartHive</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── RIGHT PROPERTIES PANEL ────────────────── */}
        <div className="relative w-0">
          <AnimatePresence>
            {navbarSelected && activePage?.navbar && (
              <NavbarEditor
                key="navbar-editor"
                config={activePage.navbar}
                onUpdate={updateNavbar}
                onClose={()=>setNavbarSelected(false)}
              />
            )}
            {selectedBlock && !navbarSelected && (
              <PropertiesPanel
                key={selectedBlock.id}
                block={selectedBlock}
                onUpdate={(data)=>updateBlockData(selectedBlock.id,data)}
                onClose={()=>setSelectedBlockId(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Block Picker overlay */}
      <AnimatePresence>
        {showPicker && (
          <>
            <motion.div key="picker-bg" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 z-40" onClick={()=>setShowPicker(false)}/>
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[580px] max-w-[90vw]">
              <BlockPicker onAdd={addBlock} onClose={()=>setShowPicker(false)}/>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
