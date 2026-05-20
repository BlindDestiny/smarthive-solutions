/** Catalog of proposal building blocks — ported from leads_ui.py */

export type ProposalKind = "new" | "rebuild"

export const PROPOSAL_KIND_LABEL: Record<ProposalKind, string> = {
  new:     "Site novo",
  rebuild: "Redesign de site existente",
}

export const DEFAULT_PRICES: Record<ProposalKind, number> = {
  rebuild:  799,
  new:     1499,
}

/** Categories → list of features with default-selected flag */
export const FEATURES_CATALOG: Record<string, { label: string; default: boolean }[]> = {
  "Design & UX": [
    { label: "Design moderno e personalizado à vossa marca",     default: true },
    { label: "100% responsivo (mobile, tablet, desktop)",        default: true },
    { label: "Animações subtis e transições polidas",            default: true },
    { label: "Fotografia profissional otimizada para web",       default: false },
    { label: "Modo claro / escuro automático",                   default: false },
  ],
  "Conteúdo": [
    { label: "Página inicial com hero impactante",               default: true },
    { label: "Página \"Sobre\" com história do negócio",          default: true },
    { label: "Página de serviços/produtos detalhada",            default: true },
    { label: "Página de contactos com formulário",               default: true },
    { label: "Galeria de fotos com lightbox",                    default: false },
    { label: "Página de equipa com bios profissionais",          default: false },
    { label: "Blog / secção de notícias",                        default: false },
    { label: "FAQ por categoria/serviço",                        default: false },
  ],
  "Conversão": [
    { label: "Botão WhatsApp flutuante",                         default: true },
    { label: "Mapa Google embebido (com rota)",                  default: true },
    { label: "Sistema de reservas online (calendário)",          default: false },
    { label: "Formulário de pedido de orçamento",                default: true },
    { label: "Pedido de take-away / encomenda online",           default: false },
    { label: "Integração com Cal.com / Calendly",                default: false },
    { label: "Newsletter / captura de email",                    default: false },
    { label: "Testemunhos de clientes destacados",               default: true },
  ],
  "SEO & Performance": [
    { label: "SEO técnico (schema.org, sitemap, robots)",        default: true },
    { label: "Otimização para Core Web Vitals (velocidade)",     default: true },
    { label: "Meta descriptions otimizadas por página",          default: true },
    { label: "Setup Google Business Profile",                    default: false },
    { label: "Integração Google Analytics + Search Console",     default: true },
    { label: "Configuração Google Tag Manager",                  default: false },
  ],
  "Multi-idioma": [
    { label: "Versão Português (PT-PT)",                         default: true },
    { label: "Versão Inglês (EN-GB)",                            default: false },
    { label: "Outras línguas adicionais",                        default: false },
  ],
}

export interface Addon {
  label: string
  price: number
  kind:  "one-time" | "/mês"
}

export const ADDON_CATALOG: Addon[] = [
  { label: "Domínio + email profissional (1º ano)",                  price: 75,  kind: "one-time" },
  { label: "Setup do Google Business Profile",                       price: 150, kind: "one-time" },
  { label: "Copywriting profissional (até 5 páginas)",               price: 350, kind: "one-time" },
  { label: "Sessão fotográfica profissional",                        price: 450, kind: "one-time" },
  { label: "Integração com sistema de reservas externo",             price: 250, kind: "one-time" },
  { label: "Integração com pagamentos online (Stripe / MB Way)",     price: 350, kind: "one-time" },
  { label: "Página de e-commerce (até 30 produtos)",                 price: 850, kind: "one-time" },
  { label: "Tradução para inglês (EN-GB)",                           price: 250, kind: "one-time" },
  { label: "Manutenção mensal (backup, updates, alterações)",        price: 49,  kind: "/mês" },
  { label: "SEO contínuo + reporting mensal",                        price: 149, kind: "/mês" },
  { label: "Gestão de Google Ads (com budget à parte)",              price: 199, kind: "/mês" },
]

/** Default-selected features by category (returns list of labels) */
export function defaultFeatures(): string[] {
  const result: string[] = []
  for (const cat of Object.values(FEATURES_CATALOG)) {
    for (const f of cat) if (f.default) result.push(f.label)
  }
  return result
}
