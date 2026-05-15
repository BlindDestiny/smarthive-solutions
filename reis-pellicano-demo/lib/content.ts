import {
  Building2,
  Globe2,
  Plane,
  Scale,
  Briefcase,
  FileCheck,
  type LucideIcon,
} from 'lucide-react'

export const firm = {
  name: 'Reis & Pellicano',
  fullName: 'Reis & Pellicano — International Lawyers',
  tagline: 'Advocacia internacional com proximidade portuguesa.',
  philosophy:
    'Comprometemo-nos a prestar serviços jurídicos de excelência nas várias áreas em que operamos, assegurando sempre uma abordagem empática e personalizada a cada caso.',
  differentiator:
    'Distinguimo-nos pela capacidade de fornecer soluções precisas, céleres e com uma transparência total — garantindo uma experiência de confiança e proximidade.',
  preventive:
    'A due diligence e a advocacia preventiva são essenciais para evitar futuros litígios.',
  founded: 2019,
  phone: '+351 21 130 4110',
  phoneDisplay: '(+351) 21 130 4110',
  phoneTel: '+351211304110',
  whatsapp: '351912345678', // placeholder — substituir pelo número real WhatsApp Business
  whatsappMessage: 'Olá, gostaria de marcar uma consulta com a Reis & Pellicano.',
  email: 'contacto@reispellicano.com',
  hours: 'Segunda a Sexta · 9h00 — 18h00 · Requer marcação prévia',
}

export type PracticeArea = {
  slug: string
  title: string
  short: string
  full: string
  services: string[]
  forWhom: string
  icon: LucideIcon
  metaTitle: string
  metaDescription: string
}

export const practiceAreas: PracticeArea[] = [
  {
    slug: 'direito-imobiliario',
    title: 'Direito Imobiliário',
    short: 'Acompanhamento jurídico em todas as fases de uma transação imobiliária em Portugal.',
    full:
      'Assistência completa em transações imobiliárias, incluindo arrendamentos, compras, vendas, contratos de promessa compra e venda (CPCV), representação em escrituras, licenciamento e gestão de hipotecas. Apoiamos compradores nacionais e internacionais em todo o ciclo da operação — desde a primeira diligência até à entrega das chaves.',
    services: [
      'Análise prévia de viabilidade e due diligence registal',
      'Negociação e elaboração de Contrato Promessa de Compra e Venda (CPCV)',
      'Representação em escrituras públicas',
      'Contratos de arrendamento habitacional e comercial',
      'Licenciamento urbanístico e regularização de imóveis',
      'Gestão de hipotecas e financiamento bancário',
      'Resolução extrajudicial de litígios imobiliários',
    ],
    forWhom:
      'Compradores nacionais e internacionais, investidores institucionais, promotores imobiliários, senhorios e arrendatários.',
    icon: Building2,
    metaTitle: 'Direito Imobiliário em Portugal — Reis & Pellicano',
    metaDescription:
      'Acompanhamento jurídico em compra, venda, CPCV, arrendamentos e licenciamento imobiliário em Portugal. Apoio a clientes nacionais e internacionais.',
  },
  {
    slug: 'nacionalidade-portuguesa',
    title: 'Nacionalidade Portuguesa',
    short: 'Suporte integral no processo de aquisição da nacionalidade portuguesa.',
    full:
      'Suporte jurídico em todas as fases do processo de aquisição da nacionalidade portuguesa, desde a preparação e legalização documental até à aprovação final pelo IRN. Acompanhamos casos por descendência, casamento, naturalização ordinária, e através da via judaica sefardita — com rigor documental e contacto direto entre escritórios e conservatórias.',
    services: [
      'Nacionalidade por descendência (filhos e netos de portugueses)',
      'Nacionalidade por casamento ou união de facto',
      'Naturalização ordinária por residência legal',
      'Nacionalidade para descendentes de judeus sefarditas',
      'Legalização e apostilamento de documentos estrangeiros',
      'Tradução juramentada com colocação de apostila',
      'Acompanhamento de pedidos no IRN e Conservatória dos Registos Centrais',
    ],
    forWhom:
      'Descendentes de portugueses, cônjuges de cidadãos nacionais, residentes há mais de 5 anos e descendentes de judeus sefarditas.',
    icon: Globe2,
    metaTitle: 'Nacionalidade Portuguesa — Advogados em Lisboa, Porto e Faro',
    metaDescription:
      'Acompanhamento jurídico no processo de aquisição da nacionalidade portuguesa por descendência, casamento, naturalização ou via sefardita.',
  },
  {
    slug: 'vistos-gold',
    title: 'Vistos Gold',
    short: 'Acompanhamento transversal ao programa de residência por investimento.',
    full:
      'Acompanhamento transversal ao processo de Visto Gold, desde a definição da estratégia de investimento e submissão do pedido, passando pela pré-aprovação, recolha de dados biométricos, até às renovações subsequentes e eventual pedido de nacionalidade. Trabalhamos com todos os modelos de investimento atualmente elegíveis.',
    services: [
      'Análise de elegibilidade e definição da via de investimento',
      'Investimento em fundos de capital de risco regulamentados',
      'Transferência de capital ou criação de emprego',
      'Submissão de pedido junto da AIMA',
      'Acompanhamento da pré-aprovação e biometria',
      'Renovações periódicas e cumprimento dos prazos de permanência',
      'Transição de Visto Gold para nacionalidade portuguesa',
    ],
    forWhom:
      'Investidores estrangeiros que pretendam obter autorização de residência em Portugal através de investimento qualificado.',
    icon: Plane,
    metaTitle: 'Visto Gold Portugal — Advogados especialistas em ARI',
    metaDescription:
      'Acompanhamento jurídico completo do processo de Visto Gold (ARI) em Portugal. Submissão, biometria, renovações e transição para nacionalidade.',
  },
  {
    slug: 'direito-fiscal',
    title: 'Direito Fiscal',
    short: 'Planeamento fiscal internacional e otimização tributária.',
    full:
      'Consultoria fiscal completa para clientes individuais e corporativos, com foco em planeamento internacional. Abordamos programas de benefícios fiscais portugueses, convenções internacionais para evitar a dupla tributação, residência fiscal e estratégias de eficiência fiscal de longo prazo.',
    services: [
      'Regime do Residente Não Habitual (RNH) e novo Regime Fiscal de IFICI',
      'Análise e aplicação de convenções de dupla tributação',
      'Pedidos de NIF e residência fiscal em Portugal',
      'Declarações de IRS para residentes e não residentes',
      'Estruturação fiscal de investimentos e heranças transfronteiriças',
      'Planeamento fiscal para profissionais qualificados',
      'Representação em processos de inspeção da Autoridade Tributária',
    ],
    forWhom:
      'Expatriados, profissionais qualificados, investidores, herdeiros transfronteiriços e empresas com operações internacionais.',
    icon: Scale,
    metaTitle: 'Direito Fiscal Portugal — RNH, dupla tributação, IRS',
    metaDescription:
      'Consultoria fiscal para residentes, expatriados e empresas. Regime RNH, convenções de dupla tributação, IRS e planeamento internacional.',
  },
  {
    slug: 'direito-do-trabalho-e-empresarial',
    title: 'Direito do Trabalho e Empresarial',
    short: 'Constituição de empresas, gestão contratual e relações laborais.',
    full:
      'Orientação jurídica na gestão contratual e laboral em Portugal — desde a elaboração de contratos individuais até à constituição de sociedades comerciais. Apoiamos empresas estrangeiras em fase de implementação no mercado português e a sua relação com colaboradores nacionais.',
    services: [
      'Constituição de sociedades comerciais (Lda., S.A., sucursais)',
      'Elaboração de contratos de trabalho individuais e coletivos',
      'Cessação contratual e cálculo de compensações',
      'Cumprimento da legislação laboral portuguesa para empresas estrangeiras',
      'Due diligence corporativa em M&A',
      'Acordos parassociais e governance societária',
      'Representação em processos junto da ACT e tribunais do trabalho',
    ],
    forWhom:
      'Empresas estrangeiras a iniciar operação em Portugal, startups, PMEs e empregadores com colaboradores em território nacional.',
    icon: Briefcase,
    metaTitle: 'Direito do Trabalho e Empresarial em Portugal',
    metaDescription:
      'Constituição de empresas, contratos de trabalho, governance societária e apoio jurídico a empresas estrangeiras a operar em Portugal.',
  },
  {
    slug: 'compliance-e-contratos',
    title: 'Compliance e Contratos',
    short: 'Revisão contratual e conformidade regulatória.',
    full:
      'Revisão e elaboração de contratos com foco em conformidade legislativa e mitigação de riscos. Implementamos políticas internas de compliance, programas de RGPD, prevenção de branqueamento de capitais (PBC) e códigos de conduta corporativos adaptados à realidade de cada cliente.',
    services: [
      'Elaboração e revisão de contratos comerciais',
      'Conformidade com o Regulamento Geral de Proteção de Dados (RGPD)',
      'Programas de prevenção de branqueamento de capitais (PBC/FT)',
      'Códigos de conduta e políticas internas corporativas',
      'Cláusulas contratuais internacionais e jurisdição aplicável',
      'Auditoria contratual e identificação de riscos legais',
      'Formação de equipas em matéria de compliance',
    ],
    forWhom:
      'PMEs, multinacionais com filiais em Portugal, instituições financeiras, escritórios de advogados parceiros e organizações sem fins lucrativos.',
    icon: FileCheck,
    metaTitle: 'Compliance e Contratos — Reis & Pellicano',
    metaDescription:
      'Revisão contratual, RGPD, prevenção de branqueamento de capitais e implementação de políticas de compliance corporativo em Portugal.',
  },
]

export type TeamMember = {
  name: string
  role: string
  bio?: string
}

export const team: TeamMember[] = [
  {
    name: 'Daniel dos Reis',
    role: 'Advogado · Sócio Fundador',
    bio: 'Especializado em direito imobiliário e nacionalidade portuguesa, com experiência em clientes internacionais.',
  },
  {
    name: 'Rodolfo Pellicano',
    role: 'Advogado · Sócio Fundador',
    bio: 'Especializado em direito fiscal e empresarial, com forte presença em estruturação de investimento estrangeiro.',
  },
  {
    name: 'Andreia F. Gonçalves',
    role: 'Advogada',
    bio: 'Foco em vistos gold, autorização de residência e regimes de investimento.',
  },
  {
    name: 'Carina Bexiga',
    role: 'Advogada',
    bio: 'Compliance, contratos e direito do trabalho. Apoia empresas em implementação no mercado português.',
  },
  {
    name: 'Patrícia Brandão',
    role: 'Advogada',
    bio: 'Direito imobiliário e civil. Acompanha transações nacionais e transfronteiriças.',
  },
]

export type Office = {
  city: string
  street: string
  postal: string
  region: string
  mapsQuery: string
}

export const offices: Office[] = [
  {
    city: 'Lisboa',
    street: 'Avenida Fontes Pereira de Melo, nº 35, 19A',
    postal: '1050-118 Lisboa',
    region: 'Avenidas Novas',
    mapsQuery: 'Avenida+Fontes+Pereira+de+Melo+35+Lisboa',
  },
  {
    city: 'Porto',
    street: 'Rua Feliciano de Castilho, nº 66',
    postal: '4150-311 Porto',
    region: 'Foz do Douro',
    mapsQuery: 'Rua+Feliciano+de+Castilho+66+Porto',
  },
  {
    city: 'Faro',
    street: 'Avenida 5 de Outubro, nº 82-A',
    postal: '8000-076 Faro',
    region: 'Centro',
    mapsQuery: 'Avenida+5+de+Outubro+82A+Faro',
  },
]

export const navigation = [
  { href: '/', label: 'Início' },
  { href: '/areas-de-pratica', label: 'Áreas de Prática' },
  { href: '/equipa', label: 'Equipa' },
  { href: '/contactos', label: 'Contactos' },
]

export type Stat = {
  value: string
  suffix?: string
  label: string
  sub?: string
}

export const stats: Stat[] = [
  { value: '4.9',  suffix: '★', label: 'Avaliação no Google', sub: 'Média de 56 críticas verificadas' },
  { value: '56',   suffix: '+', label: 'Críticas no Google',  sub: 'Clientes satisfeitos publicamente' },
  { value: '3',                  label: 'Escritórios',         sub: 'Lisboa · Porto · Faro' },
  { value: '7',    suffix: '+', label: 'Anos de prática',     sub: 'Desde 2019, com foco internacional' },
]

export type Testimonial = {
  name: string
  meta: string
  date: string
  rating: number
  quote: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Xavier D.',
    meta: 'Compra de imóvel · Lisboa',
    date: 'Há 2 meses',
    rating: 5,
    quote:
      'I had an excellent experience with Reis & Pellicano supporting the purchase of my apartment in Lisbon. Their team was responsive and thorough, which really made the difference in navigating the Portuguese property process.',
  },
  {
    name: 'Chris R.',
    meta: 'Cliente recorrente · 3+ anos',
    date: 'Há 2 meses',
    rating: 5,
    quote:
      'I have been working with Reis & Pellicano for more than three years and every lawyer at the firm I have worked with has been prompt, professional and pleasant. They handle complex matters with consistent attention to detail.',
  },
  {
    name: 'Kris P.',
    meta: 'Aquisição imobiliária · Portugal',
    date: 'Há 5 meses',
    rating: 5,
    quote:
      'We recently worked with Reis & Pellicano International Lawyers to purchase property in Portugal, and we had an excellent experience from start to finish. The team guided us through every step with clarity and patience.',
  },
]

export type FAQ = { q: string; a: string }

export const faqsByArea: Record<string, FAQ[]> = {
  'nacionalidade-portuguesa': [
    {
      q: 'Quanto tempo demora o processo de nacionalidade portuguesa?',
      a: 'O prazo médio atual ronda os 18 a 30 meses, dependendo da via escolhida e da carga de trabalho do IRN/Conservatória dos Registos Centrais. Processos por descendência tendem a ser mais rápidos do que por naturalização ordinária. Apresentamos sempre uma estimativa realista com base no caso concreto.',
    },
    {
      q: 'Preciso de viver em Portugal durante o processo?',
      a: 'Depende da via. A nacionalidade por descendência ou por casamento não exige residência em Portugal. A naturalização ordinária exige 5 anos de residência legal. A via sefardita também não exige residência. Avaliamos a sua situação para confirmar a via mais célere.',
    },
    {
      q: 'Posso manter a minha nacionalidade de origem?',
      a: 'Sim. Portugal permite a dupla nacionalidade. Contudo, deve verificar se o seu país de origem também permite — alguns países (ex: Japão, China) exigem renúncia. Aconselhamos sempre verificação prévia.',
    },
    {
      q: 'Quais os custos envolvidos?',
      a: 'Os custos dividem-se em três blocos: (1) taxas oficiais do IRN, atualmente €250 para o pedido inicial; (2) custos de legalização documental, tradução juramentada e apostila — variável conforme o país de origem; (3) honorários do escritório, transparentes desde a primeira consulta. Apresentamos sempre um orçamento fechado.',
    },
    {
      q: 'O programa de nacionalidade sefardita continua aberto?',
      a: 'Sim, embora com critérios mais exigentes desde a alteração legislativa de 2022. Hoje é necessário comprovar uma ligação efetiva e duradoura a Portugal, além da ascendência sefardita. Avaliamos a documentação disponível para confirmar elegibilidade antes de avançar.',
    },
    {
      q: 'Posso pedir nacionalidade para os meus filhos menores?',
      a: 'Sim. Quando o pai ou mãe adquire a nacionalidade portuguesa, os filhos menores podem ser incluídos no mesmo processo ou em pedido subsequente. Para filhos nascidos de pais portugueses, o pedido é por descendência direta.',
    },
  ],
}
