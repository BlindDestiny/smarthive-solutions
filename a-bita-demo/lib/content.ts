export const restaurant = {
  name: 'A Bita',
  tagline: 'Refeições caseiras & sobremesas no País das Maravilhas.',
  short: 'Refeições caseiras para terminar no forno de casa e saborosas sobremesas.',
  story:
    'Mais do que um café, A Bita é um pequeno País das Maravilhas em Vila Nova de Gaia — feito por uma família que cozinha com amor, recebe com calma, e trata cada cliente como se viesse a casa.',
  founded: 'Vila Nova de Gaia',
  phone: '+351 912 187 658',
  phoneDisplay: '912 187 658',
  phoneTel: '+351912187658',
  whatsapp: '351912187658',
  whatsappMessage: 'Olá! Gostaria de reservar uma mesa n’a Bita.',
  email: 'reservas@abita.pt',
  address: 'R. Manuel Salgueiral 284, 4400-213 Vila Nova de Gaia',
  addressShort: 'R. Manuel Salgueiral 284',
  postal: '4400-213 Vila Nova de Gaia',
  mapsQuery: 'A+Bita+R.+Manuel+Salgueiral+284+Vila+Nova+de+Gaia',
  pricePerPerson: '10–15 €',
}

export const hours = [
  { day: 'Segunda',  open: 'Fechado',  closed: true  },
  { day: 'Terça',    open: '11:00 — 19:00' },
  { day: 'Quarta',   open: '11:00 — 19:00' },
  { day: 'Quinta',   open: '11:00 — 19:00' },
  { day: 'Sexta',    open: '11:00 — 19:00' },
  { day: 'Sábado',   open: '11:00 — 19:00' },
  { day: 'Domingo',  open: '11:00 — 18:00' },
]

export const services = [
  { label: 'Comida à discrição', icon: 'utensils' },
  { label: 'Esplanada',           icon: 'sun' },
  { label: 'Opções vegetarianas', icon: 'leaf' },
  { label: 'Take-away',           icon: 'box' },
  { label: 'Entrega ao domicílio',icon: 'truck' },
]

export type Stat = {
  value: string
  suffix?: string
  label: string
  sub?: string
}

export const stats: Stat[] = [
  { value: '4.7',  suffix: '★', label: 'Avaliação no Google', sub: 'Média de 250 críticas verificadas' },
  { value: '250',  suffix: '+', label: 'Críticas no Google',  sub: 'Clientes que partilharam a sua opinião' },
  { value: '10',   suffix: '–15€', label: 'Preço por pessoa',  sub: 'Refeições generosas, preço honesto' },
  { value: '7',                  label: 'Dias por semana',      sub: 'À excepção de Segunda-feira' },
]

export type MenuItem = {
  name: string
  description: string
  price: string
  featured?: boolean
  veg?: boolean
  highlight?: string // ex: "do País das Maravilhas"
}

export type MenuCategory = {
  slug: string
  title: string
  subtitle: string
  items: MenuItem[]
}

export const menu: MenuCategory[] = [
  {
    slug: 'pequeno-almoco',
    title: 'Pequeno-Almoço',
    subtitle: 'Para começar o dia com calma',
    items: [
      { name: 'Tostas Mistas d’a Bita',  description: 'Pão caseiro, queijo da serra fundido, fiambre artesanal.', price: '4,50' },
      { name: 'Pão & Compota',                description: 'Pão acabado de fazer, manteiga, compota da casa.',        price: '3,80', veg: true },
      { name: 'Granola d’a Bita',        description: 'Aveia tostada, frutos secos, iogurte natural, mel.',      price: '5,20', veg: true, featured: true },
      { name: 'Iogurte com Frutos Vermelhos', description: 'Iogurte grego, frutos vermelhos da época, granola.',     price: '4,90', veg: true },
    ],
  },
  {
    slug: 'brunch',
    title: 'Brunch',
    subtitle: 'A nossa especialidade do País das Maravilhas',
    items: [
      { name: 'Ovos Rotos d’a Bita',     description: 'Ovos a baixa temperatura sobre batata corada, chouriço de Vinhais, pimenta-rosa.', price: '9,50', featured: true, highlight: 'O nosso favorito' },
      { name: 'Eggs Benedict',                description: 'Muffin caseiro, ovo escalfado, lombo fumado, molho holandês.', price: '10,20' },
      { name: 'Avocado Toast',                description: 'Pão de massa-mãe, abacate esmagado, ovo, cogumelos salteados, rúcula.', price: '8,90', veg: true },
      { name: 'Açaí Bowl',                    description: 'Açaí natural, banana, granola, mirtilos, manteiga de amendoim.', price: '8,50', veg: true },
      { name: 'Panquecas Americanas',         description: 'Panquecas fofas, fruta da época, xarope de ácer, manteiga.', price: '7,80', veg: true },
    ],
  },
  {
    slug: 'almoco',
    title: 'Almoço Caseiro',
    subtitle: 'Para levar para casa ou ficar na esplanada',
    items: [
      { name: 'Prato do Dia',                 description: 'Receita caseira, varia diariamente — consulte no balcão.', price: '8,50', featured: true },
      { name: 'Sopa do Dia',                  description: 'Sempre quente, sempre da estação. Pergunte ao nosso chef.', price: '3,50', veg: true },
      { name: 'Sandes Caseira',               description: 'Pão de massa-mãe, escolha o recheio — fiambre, atum, vegetariana.', price: '6,50' },
      { name: 'Quiche do Dia',                description: 'Massa quebrada caseira, recheio diferente cada dia.', price: '6,80' },
      { name: 'Tábua de Queijos & Enchidos',  description: 'Seleção de produtos regionais, compota, frutos secos.', price: '12,90' },
    ],
  },
  {
    slug: 'sobremesas',
    title: 'Sobremesas',
    subtitle: 'O coração doce da Bita',
    items: [
      { name: 'Carrot Cake com Ganache',      description: 'O nosso clássico — bolo de cenoura húmido, ganache de chocolate.', price: '4,50', featured: true, veg: true, highlight: 'Premiado pelos clientes' },
      { name: 'Cheesecake do Bosque',         description: 'Cheesecake cremoso, geleia de frutos vermelhos, biscoito.', price: '4,80', veg: true },
      { name: 'Tarte de Limão Merengada',     description: 'Massa quebrada, creme de limão, merengue tostado.', price: '4,20', veg: true },
      { name: 'Bolo de Chocolate Negro',      description: 'Chocolate 70%, mousse, flor de sal.', price: '4,90', veg: true },
      { name: 'Pastel de Nata Caseiro',       description: 'Massa folhada estaladiça, creme aveludado, canela.', price: '2,20', veg: true },
    ],
  },
  {
    slug: 'bebidas',
    title: 'Bebidas',
    subtitle: 'Cafés, chás e infusões',
    items: [
      { name: 'Café Expresso',         description: 'Blend artesanal, torra média.', price: '1,20', veg: true },
      { name: 'Cappuccino',            description: 'Café, leite vaporizado, cacau.', price: '2,50', veg: true },
      { name: 'Iced Latte',            description: 'Café gelado, leite, gelo, opção de xaropes.', price: '3,20', veg: true },
      { name: 'Chá d’a Bita',      description: 'Mistura especial da casa — bergamota, canela, baunilha.', price: '2,80', veg: true },
      { name: 'Limonada Caseira',      description: 'Limão fresco, hortelã do jardim, açúcar mascavado.', price: '3,50', veg: true },
      { name: 'Sumo Natural',          description: 'Frutas da época, espremidas no momento.', price: '3,90', veg: true },
    ],
  },
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
    name: 'Jonathan Pinto',
    meta: 'Cliente · Café & Brunch',
    date: 'Há 3 meses',
    rating: 5,
    quote:
      'Absolutely cosy, and quaint little cafe. Run by a wonderful family. Simple meals made with love. Highly recommend if you\'re looking for something authentic in Gaia.',
  },
  {
    name: 'Wissem Souci',
    meta: 'Cliente · Sobremesas',
    date: 'Há 3 anos',
    rating: 5,
    quote:
      'I had a really yummy carrot cake with a chocolate ganache glaze and a cappuccino. Wish I had better pictures but I absolutely devoured the cake. One of the best in town.',
  },
  {
    name: 'Kati Carrapa',
    meta: 'Cliente recorrente · Brunch',
    date: 'Visitou várias vezes',
    rating: 5,
    quote:
      'I was there two times so far (and want to go again) and tried different brunch items. Everything was delicious!!! The carrot cake is a must-try.',
  },
]

export const navigation = [
  { href: '/',          label: 'Início' },
  { href: '/menu',      label: 'Menu' },
  { href: '/sobre',     label: 'Sobre' },
  { href: '/contactos', label: 'Contactos' },
]

export type FAQ = { q: string; a: string }

export const faqs: FAQ[] = [
  {
    q: 'Preciso de reservar mesa?',
    a: 'Recomendamos reservar para o brunch ao fim-de-semana, sobretudo entre as 11h e as 14h. Para almoços durante a semana, normalmente conseguimos acomodar walk-ins.',
  },
  {
    q: 'Fazem take-away e entregas?',
    a: 'Sim. Pode encomendar take-away ao balcão ou por telefone (912 187 658) com antecedência de 30 minutos. Para entregas ao domicílio em Gaia e Porto, utilizamos parceiros locais.',
  },
  {
    q: 'Têm opções vegetarianas?',
    a: 'Várias — desde os ovos rotos vegetarianos (sem chouriço), avocado toast, granola, panquecas, e a maioria das nossas sobremesas. Avise no momento do pedido se tiver alguma restrição específica.',
  },
  {
    q: 'A esplanada está aberta o ano todo?',
    a: 'A esplanada está disponível na primavera, verão e início do outono, mediante o tempo. No inverno, o nosso interior aconchegante continua aberto com lareira nos dias mais frios.',
  },
  {
    q: 'Posso encomendar bolos para festas?',
    a: 'Com certeza. Aceitamos encomendas para celebrações, com 48 horas de antecedência. Contacte-nos por telefone ou WhatsApp para personalizar o seu bolo.',
  },
  {
    q: 'Têm estacionamento?',
    a: 'Existe estacionamento gratuito na rua à frente do café. Aos sábados pode ser mais difícil — recomendamos chegar antes das 12h ou usar transportes públicos.',
  },
]
