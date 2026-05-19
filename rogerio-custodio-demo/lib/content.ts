import {
  ChefHat,
  Layers,
  Sofa,
  Hammer,
  Building2,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

export const company = {
  name: 'Rogério Custódio',
  legal: 'Rogério Custódio, Lda.',
  tagline: 'Carpintaria de precisão. Projetos à medida que valorizam cada espaço.',
  short: 'Carpintaria e marcenaria por medida, desde 2006. Em Estoi, ao serviço do Algarve e além.',
  founded: 2006,
  phone:        '+351 289 997 819',
  phoneDisplay: '(+351) 289 997 819',
  phoneTel:     '+351289997819',
  whatsapp:     '351966692697',
  whatsappDisplay: '966 692 697',
  whatsappMessage: 'Olá! Gostaria de pedir um orçamento à Rogério Custódio.',
  emails: [
    { label: 'Geral',         address: 'geral@rogeriocustodio.pt' },
    { label: 'Orçamentos',    address: 'orcamentos@rogeriocustodio.pt' },
    { label: 'Comercial',     address: 'comercial@rogeriocustodio.pt' },
    { label: 'Administração', address: 'admin@rogeriocustodio.pt' },
  ],
  address:      'Estoi · 8005-465 Faro',
  fullAddress:  'Rua Principal, Estoi, 8005-465 Faro',
  mapsQuery:    'Rogério+Custódio+Estoi+Faro',
  hours: [
    { day: 'Seg – Sex', morning: '08:30 – 13:00', afternoon: '14:00 – 16:30' },
    { day: 'Sábado',    morning: 'Mediante marcação', afternoon: '' },
    { day: 'Domingo',   morning: 'Fechado', afternoon: '', closed: true },
  ],
}

export const navigation = [
  { href: '/',           label: 'Início' },
  { href: '/servicos',   label: 'Serviços' },
  { href: '/portefolio', label: 'Portefólio' },
  { href: '/sobre',      label: 'Sobre' },
  { href: '/contactos',  label: 'Contactos' },
]

export type Service = {
  slug: string
  title: string
  short: string
  full: string
  icon: LucideIcon
  image: string
  bullets: string[]
}

export const services: Service[] = [
  {
    slug: 'cozinhas',
    title: 'Cozinhas por Medida',
    short: 'Projetadas de raiz para o seu espaço — função, forma e materiais escolhidos a dedo.',
    full:
      'Concebemos cozinhas que respondem ao fluxo real de quem cozinha. Cada centímetro é otimizado, cada material é selecionado pelo desempenho ao uso diário, e cada acabamento é executado para durar décadas. Trabalhamos lacados, folheados naturais, MDF hidrófugo e composições mistas.',
    icon: ChefHat,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=80',
    bullets: [
      'Levantamento técnico no local',
      'Projeto 3D com várias propostas',
      'Materiais premium (MDF hidrófugo, lacados, folheados)',
      'Ferragens Blum / Hettich de referência',
      'Instalação por equipa própria',
    ],
  },
  {
    slug: 'roupeiros',
    title: 'Roupeiros & Closets',
    short: 'Armazenamento pensado ao detalhe — interiores que organizam, exteriores que valorizam.',
    full:
      'Do roupeiro de quarto ao walk-in closet, projetamos a divisão interior para o que realmente lá vai estar — não para fotografia de catálogo. Resultado: espaço útil máximo, acesso confortável, e um exterior que se integra no quarto.',
    icon: Layers,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
    bullets: [
      'Sliding doors, abrir, ou modular',
      'Interiores com cabides, gavetas, calceiras, joalheiros',
      'Iluminação LED integrada',
      'Acabamentos em lacado, folha de madeira ou tela',
      'Espelhos e bandejas adicionais sob pedido',
    ],
  },
  {
    slug: 'mobiliario',
    title: 'Mobiliário Personalizado',
    short: 'Peças únicas — estantes, mesas, aparadores, móveis de TV — desenhadas para si.',
    full:
      'Quando o mobiliário standard não responde às proporções do espaço ou ao estilo da casa, fazemos peças únicas. Cada projeto começa com desenho técnico e termina com a peça instalada e ajustada.',
    icon: Sofa,
    image: 'https://images.unsplash.com/photo-1567016526105-22da7c13161a?auto=format&fit=crop&w=1400&q=80',
    bullets: [
      'Estantes integradas do chão ao tecto',
      'Móveis de apoio, aparadores, mesas',
      'Camas com cabeceiras integradas',
      'Bancadas e secretárias técnicas',
      'Combinações com metal, vidro ou pedra',
    ],
  },
  {
    slug: 'carpintaria-interior',
    title: 'Carpintaria Interior',
    short: 'Portas, rodapés, lambris, tetos falsos — o detalhe arquitetónico que define um espaço.',
    full:
      'Trabalhamos com arquitetos e decoradores na execução dos elementos fixos que dão carácter a um espaço. Portas em folheado natural ou lacado, rodapés escondidos, lambris decorativos, painéis acústicos e tetos falsos modelados.',
    icon: Hammer,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=80',
    bullets: [
      'Portas interiores até 3 metros',
      'Rodapés escondidos e visíveis',
      'Lambris decorativos',
      'Painéis acústicos e ripados',
      'Tetos falsos com vigas aparentes',
    ],
  },
  {
    slug: 'projetos-comerciais',
    title: 'Projetos Comerciais',
    short: 'Restaurantes, lojas, escritórios — onde o mobiliário tem de comunicar marca e resistir ao uso.',
    full:
      'Para espaços comerciais, o mobiliário tem de cumprir simultaneamente duas funções: comunicar a identidade da marca e aguentar uso intensivo durante anos. Trabalhamos com cadeias e proprietários independentes em todo o Algarve.',
    icon: Building2,
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1400&q=80',
    bullets: [
      'Balcões e bancadas para restauração',
      'Mobiliário de loja e display retail',
      'Postos de trabalho e divisórias acústicas',
      'Materiais certificados para uso intensivo',
      'Cumprimento de cronograma de abertura',
    ],
  },
  {
    slug: 'restauro',
    title: 'Restauro & Soluções Especiais',
    short: 'Reabilitação de peças antigas e projetos fora do comum onde a carpintaria standard não chega.',
    full:
      'Recuperamos peças de família, mobiliário antigo e elementos arquitetónicos com valor sentimental ou histórico. Para projetos especiais — quando as soluções de mercado não respondem — fazemos a peça que falta.',
    icon: Wrench,
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1400&q=80',
    bullets: [
      'Restauro de mobiliário de família',
      'Reabilitação de elementos arquitetónicos',
      'Peças únicas sob desenho',
      'Réplicas e reproduções',
      'Avaliação prévia de viabilidade',
    ],
  },
]

export type Differentiator = {
  number: string
  title: string
  body: string
}

export const differentiators: Differentiator[] = [
  {
    number: '01',
    title: 'Materiais premium',
    body: 'Trabalhamos apenas com fornecedores certificados. MDF hidrófugo, folheados naturais europeus, lacados de alta resistência e ferragens Blum/Hettich. Sem atalhos.',
  },
  {
    number: '02',
    title: 'Acabamento de excelência',
    body: 'Cada peça é inspecionada três vezes antes de sair da oficina. Esquinas, juntas, alinhamentos, pintura — o que custa tempo a fazer bem, dura uma vida.',
  },
  {
    number: '03',
    title: 'Execução personalizada',
    body: 'Nada do que fazemos é catálogo. Cada projeto começa com um levantamento técnico no espaço e termina com instalação ajustada pelo nosso mestre carpinteiro.',
  },
  {
    number: '04',
    title: 'Cumprimento de prazos',
    body: 'Comprometemos uma data de instalação no início. Se a obra exige antecipar, fazemos. Se exige atrasar, comunicamos com 2 semanas de avanço — não no dia.',
  },
]

export type ProcessStep = {
  number: string
  title: string
  body: string
  duration: string
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Consulta',
    body: 'Visita ao local ou reunião na oficina. Conhecemos o espaço, ouvimos as ideias, percebemos restrições técnicas e orçamento disponível.',
    duration: '1 reunião',
  },
  {
    number: '02',
    title: 'Projeto',
    body: 'Apresentamos desenhos técnicos 3D, propostas de materiais e acabamentos, e orçamento detalhado. Duas rondas de revisão incluídas.',
    duration: '5–10 dias',
  },
  {
    number: '03',
    title: 'Produção',
    body: 'Execução em oficina por mestres carpinteiros. Acompanhamento fotográfico semanal disponível mediante pedido.',
    duration: '3–8 semanas',
  },
  {
    number: '04',
    title: 'Instalação',
    body: 'Equipa própria desloca-se ao local. Acabamentos finos in-situ — ajustes a paredes irregulares, cantos vivos, e ligação a outros materiais.',
    duration: '1–5 dias',
  },
  {
    number: '05',
    title: 'Acompanhamento',
    body: 'Garantia de 2 anos em fabrico e 5 anos em ferragens. Visita de revisão grátis aos 12 meses para confirmar tudo em ordem.',
    duration: 'Anos de garantia',
  },
]

export type PortfolioItem = {
  id: string
  title: string
  category: 'residencial' | 'comercial' | 'cozinhas' | 'roupeiros' | 'interiores'
  image: string
  location: string
  year: number
}

export const portfolio: PortfolioItem[] = [
  { id: 'p1', title: 'Cozinha lacada com ilha central',         category: 'cozinhas',    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=80', location: 'Faro',         year: 2025 },
  { id: 'p2', title: 'Walk-in closet em folha de carvalho',      category: 'roupeiros',   image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80', location: 'Vilamoura',    year: 2025 },
  { id: 'p3', title: 'Vivenda — carpintaria interior completa',  category: 'residencial', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=80', location: 'Loulé',        year: 2024 },
  { id: 'p4', title: 'Restaurante — balcão e mobiliário',         category: 'comercial',   image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1400&q=80', location: 'Tavira',       year: 2024 },
  { id: 'p5', title: 'Cozinha em "U" com bancada em pedra',       category: 'cozinhas',    image: 'https://images.unsplash.com/photo-1567016526105-22da7c13161a?auto=format&fit=crop&w=1400&q=80', location: 'Olhão',        year: 2025 },
  { id: 'p6', title: 'Estante de chão ao tecto',                  category: 'interiores',  image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1400&q=80', location: 'Faro',         year: 2025 },
  { id: 'p7', title: 'Roupeiro sliding com espelho',              category: 'roupeiros',   image: 'https://images.unsplash.com/photo-1597211833712-5e41faa202ea?auto=format&fit=crop&w=1400&q=80', location: 'Quinta do Lago', year: 2024 },
  { id: 'p8', title: 'Apartamento — móveis personalizados',       category: 'residencial', image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1400&q=80', location: 'Albufeira',    year: 2024 },
  { id: 'p9', title: 'Loja — display retail em madeira maciça',   category: 'comercial',   image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80', location: 'Faro',         year: 2025 },
  { id: 'p10', title: 'Painéis ripados acústicos',                category: 'interiores',  image: 'https://images.unsplash.com/photo-1551298370-9d3d53740c72?auto=format&fit=crop&w=1400&q=80', location: 'Lagoa',        year: 2024 },
  { id: 'p11', title: 'Cozinha aberta para sala',                 category: 'cozinhas',    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1400&q=80', location: 'Quarteira',    year: 2025 },
  { id: 'p12', title: 'Lambris e portas em folheado',             category: 'interiores',  image: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1400&q=80', location: 'Almancil',     year: 2024 },
]

export const portfolioCategories: { value: PortfolioItem['category'] | 'all'; label: string }[] = [
  { value: 'all',         label: 'Todos' },
  { value: 'cozinhas',    label: 'Cozinhas' },
  { value: 'roupeiros',   label: 'Roupeiros' },
  { value: 'residencial', label: 'Residencial' },
  { value: 'comercial',   label: 'Comercial' },
  { value: 'interiores',  label: 'Interiores' },
]

export type Testimonial = {
  name: string
  role: string
  quote: string
  project: string
  location: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'João Pereira',
    role: 'Cliente residencial',
    project: 'Cozinha + ilha central',
    location: 'Vilamoura',
    quote:
      'Procurámos quatro carpintarias antes de decidirmos. A diferença com o Rogério ficou evidente já na primeira visita: levantou medidas com rigor, fez observações que ninguém tinha feito, e o projeto 3D era exatamente o que descreveu. Recomendo sem hesitar.',
  },
  {
    name: 'Sofia Antunes',
    role: 'Arquiteta',
    project: 'Carpintaria interior — vivenda',
    location: 'Loulé',
    quote:
      'Trabalho com a Rogério Custódio há cinco anos em projetos de clientes meus. Aguentam prazos exigentes, comunicam contra-tempos com antecedência, e o acabamento está sempre acima das expectativas. É raro.',
  },
  {
    name: 'Pedro & Inês Costa',
    role: 'Clientes residenciais',
    project: 'Roupeiro walk-in',
    location: 'Quinta do Lago',
    quote:
      'O nosso closet ficou exatamente como o queríamos — só que melhor. Pequenos detalhes que não tínhamos pedido (iluminação LED nas gavetas, fundo aveludado, espelho interno) elevaram tudo. É evidente o gosto pelo ofício.',
  },
]

export type FAQ = { q: string; a: string }

export const faqs: FAQ[] = [
  {
    q: 'Quanto tempo demora um projeto de cozinha por medida?',
    a: 'Desde a primeira visita até à instalação completa, normalmente entre 6 e 10 semanas. O tempo de projeto e aprovação leva 1–2 semanas, e a produção em oficina ocupa cerca de 4–8 semanas conforme a complexidade. A instalação leva 1–3 dias.',
  },
  {
    q: 'Trabalham fora de Estoi e do Algarve?',
    a: 'A nossa atividade base é Estoi e todo o Algarve (Faro, Loulé, Albufeira, Lagos, Tavira, Vilamoura, Quinta do Lago e zonas envolventes). Para projetos especiais aceitamos deslocações ao Alentejo e Lisboa — fale connosco para confirmar viabilidade.',
  },
  {
    q: 'Qual o investimento médio de uma cozinha?',
    a: 'O valor varia substancialmente com o tamanho, materiais e ferragens escolhidas. Uma cozinha simples começa nos 4.500€; projetos de média complexidade situam-se entre 8.000€ e 15.000€; projetos com materiais nobres e acabamentos especiais ultrapassam os 20.000€. Apresentamos sempre orçamento detalhado e fechado antes de avançar.',
  },
  {
    q: 'Que garantia oferecem?',
    a: '2 anos em fabrico (estrutura, montagem, acabamentos) e 5 anos em ferragens Blum e Hettich (mecanismos de gaveta, dobradiças, sliding). Aos 12 meses fazemos uma visita gratuita de revisão para confirmar que tudo continua perfeito.',
  },
  {
    q: 'Posso ver projetos anteriores antes de avançar?',
    a: 'Sim. A nossa oficina em Estoi tem peças em produção que pode visitar com marcação. Adicionalmente, organizamos visitas a projetos concluídos quando os clientes o autorizam — particularmente úteis para perceber acabamentos e qualidade ao vivo.',
  },
  {
    q: 'Trabalham com arquitetos e decoradores?',
    a: 'Sim — uma parte significativa do nosso trabalho vem por essa via. Temos protocolos com diversos ateliers do Algarve. Se já tem arquiteto, basta enviar os desenhos para análise e produzimos orçamento técnico.',
  },
]
