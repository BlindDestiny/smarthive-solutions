import type { Locale } from "@/i18n/routing";

export type ServiceContent = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Lead paragraph — answers "what is this" directly, for SEO + LLMs. */
  intro: string;
  benefits: { title: string; desc: string }[];
  deliverables: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
};

export type Service = {
  slug: string;
  iconKey: string;
  order: number;
  /** Accent used on the hero glyph. */
  keywords: string[];
  content: Partial<Record<Locale, ServiceContent>>;
};

export const services: Service[] = [
  {
    slug: "website-development",
    iconKey: "Code2",
    order: 1,
    keywords: [
      "desenvolvimento web",
      "criação de websites",
      "Next.js",
      "website performance",
      "web development Portugal",
    ],
    content: {
      pt: {
        metaTitle: "Desenvolvimento Web — Websites de Alta Performance",
        metaDescription:
          "Criamos websites ultra-rápidos em Next.js, acessíveis e feitos para converter. Core Web Vitals no verde, SEO de raiz e design premium.",
        eyebrow: "Desenvolvimento Web",
        title: "Websites de alta performance, feitos para converter.",
        subtitle:
          "A fundação de todo o sistema de crescimento: um website rápido, acessível e tecnicamente impecável, construído para atrair e transformar visitantes em clientes.",
        intro:
          "O desenvolvimento web na Byte & Brain não se trata de fazer um site bonito — trata-se de construir a base sobre a qual todo o crescimento digital acontece. Usamos Next.js, React e edge rendering para entregar páginas que carregam num instante, rankeiam no Google e convertem visitantes em leads.",
        benefits: [
          {
            title: "Velocidade que retém",
            desc: "Cada segundo de carregamento perde visitantes. Otimizamos para Core Web Vitals no verde e Lighthouse acima de 95.",
          },
          {
            title: "Conversão desenhada",
            desc: "Cada página tem um objetivo claro e CTAs pensados para transformar tráfego em contactos reais.",
          },
          {
            title: "SEO desde o primeiro dia",
            desc: "Estrutura semântica, dados estruturados e metadata corretos — o site nasce pronto para rankear.",
          },
        ],
        deliverables: [
          {
            title: "Design premium responsivo",
            desc: "Interfaces limpas e modernas, perfeitas em qualquer ecrã, com dark e light mode nativos.",
          },
          {
            title: "Server-side rendering e edge",
            desc: "Renderização no servidor e na edge para máxima velocidade e SEO.",
          },
          {
            title: "Acessibilidade WCAG AA",
            desc: "Sites utilizáveis por todos e conformes com as boas práticas de acessibilidade.",
          },
          {
            title: "Código limpo e escalável",
            desc: "Componentizado e reutilizável, preparado para crescer com o seu negócio.",
          },
        ],
        faqs: [
          {
            q: "Quanto tempo demora a construir um website?",
            a: "Depende do âmbito, mas um website institucional bem estruturado leva tipicamente de 3 a 6 semanas, do diagnóstico ao lançamento. Projetos maiores com integrações e automação podem levar mais.",
          },
          {
            q: "Que tecnologias utilizam?",
            a: "Construímos com Next.js, TypeScript, React Server Components e Tailwind CSS — o mesmo stack que suporta produtos de escala mundial. Isto garante velocidade, segurança e escalabilidade.",
          },
          {
            q: "O website vem preparado para SEO?",
            a: "Sim. Todos os nossos websites nascem com estrutura semântica, dados estruturados (Schema.org), metadata otimizada e performance no verde — a base essencial para rankear no Google e nos motores de IA.",
          },
        ],
      },
      en: {
        metaTitle: "Website Development — High-Performance Websites",
        metaDescription:
          "We build ultra-fast Next.js websites, accessible and built to convert. Green Core Web Vitals, SEO from the ground up and premium design.",
        eyebrow: "Website Development",
        title: "High-performance websites, built to convert.",
        subtitle:
          "The foundation of every growth system: a fast, accessible and technically flawless website, built to attract and turn visitors into customers.",
        intro:
          "Website development at Byte & Brain isn't about making a pretty site — it's about building the base every bit of digital growth stands on. We use Next.js, React and edge rendering to deliver pages that load instantly, rank on Google and convert visitors into leads.",
        benefits: [
          {
            title: "Speed that retains",
            desc: "Every second of load time loses visitors. We optimize for green Core Web Vitals and a Lighthouse score above 95.",
          },
          {
            title: "Conversion by design",
            desc: "Every page has a clear goal and CTAs designed to turn traffic into real contacts.",
          },
          {
            title: "SEO from day one",
            desc: "Semantic structure, structured data and correct metadata — the site is born ready to rank.",
          },
        ],
        deliverables: [
          {
            title: "Premium responsive design",
            desc: "Clean, modern interfaces, perfect on any screen, with native dark and light modes.",
          },
          {
            title: "Server-side rendering and edge",
            desc: "Server and edge rendering for maximum speed and SEO.",
          },
          {
            title: "WCAG AA accessibility",
            desc: "Sites usable by everyone and compliant with accessibility best practices.",
          },
          {
            title: "Clean, scalable code",
            desc: "Componentized and reusable, ready to grow with your business.",
          },
        ],
        faqs: [
          {
            q: "How long does it take to build a website?",
            a: "It depends on scope, but a well-structured business website typically takes 3 to 6 weeks, from diagnosis to launch. Larger projects with integrations and automation can take longer.",
          },
          {
            q: "What technologies do you use?",
            a: "We build with Next.js, TypeScript, React Server Components and Tailwind CSS — the same stack that powers world-scale products. This ensures speed, security and scalability.",
          },
          {
            q: "Does the website come ready for SEO?",
            a: "Yes. All our websites are born with semantic structure, structured data (Schema.org), optimized metadata and green performance — the essential base to rank on Google and AI engines.",
          },
        ],
      },
      es: {
        metaTitle: "Desarrollo Web — Sitios Web de Alto Rendimiento",
        metaDescription:
          "Creamos sitios web ultrarrápidos en Next.js, accesibles y diseñados para convertir. Core Web Vitals en verde, SEO desde la base y diseño premium.",
        eyebrow: "Desarrollo Web",
        title: "Sitios web de alto rendimiento, diseñados para convertir.",
        subtitle:
          "La base de todo sistema de crecimiento: un sitio web rápido, accesible y técnicamente impecable, creado para atraer y convertir visitantes en clientes.",
        intro:
          "El desarrollo web en Byte & Brain no consiste en hacer un sitio bonito, sino en construir la base sobre la que se sostiene todo el crecimiento digital. Usamos Next.js, React y edge rendering para entregar páginas que cargan al instante, posicionan en Google y convierten visitantes en leads.",
        benefits: [
          {
            title: "Velocidad que retiene",
            desc: "Cada segundo de carga pierde visitantes. Optimizamos para Core Web Vitals en verde y una puntuación de Lighthouse superior a 95.",
          },
          {
            title: "Conversión por diseño",
            desc: "Cada página tiene un objetivo claro y CTAs diseñados para convertir el tráfico en contactos reales.",
          },
          {
            title: "SEO desde el primer día",
            desc: "Estructura semántica, datos estructurados y metadatos correctos: el sitio nace listo para posicionar.",
          },
        ],
        deliverables: [
          {
            title: "Diseño premium responsive",
            desc: "Interfaces limpias y modernas, perfectas en cualquier pantalla, con modo oscuro y claro nativos.",
          },
          {
            title: "Server-side rendering y edge",
            desc: "Renderizado en servidor y en el edge para máxima velocidad y SEO.",
          },
          {
            title: "Accesibilidad WCAG AA",
            desc: "Sitios utilizables por todos y conformes con las buenas prácticas de accesibilidad.",
          },
          {
            title: "Código limpio y escalable",
            desc: "Componentizado y reutilizable, preparado para crecer con su negocio.",
          },
        ],
        faqs: [
          {
            q: "¿Cuánto tarda en construirse un sitio web?",
            a: "Depende del alcance, pero un sitio web corporativo bien estructurado suele tardar de 3 a 6 semanas, desde el diagnóstico hasta el lanzamiento. Los proyectos mayores con integraciones y automatización pueden llevar más tiempo.",
          },
          {
            q: "¿Qué tecnologías utilizáis?",
            a: "Construimos con Next.js, TypeScript, React Server Components y Tailwind CSS, el mismo stack que impulsa productos a escala mundial. Esto garantiza velocidad, seguridad y escalabilidad.",
          },
          {
            q: "¿El sitio web viene preparado para SEO?",
            a: "Sí. Todos nuestros sitios web nacen con estructura semántica, datos estructurados (Schema.org), metadatos optimizados y rendimiento en verde: la base esencial para posicionar en Google y en los motores de IA.",
          },
        ],
      },
      fr: {
        metaTitle: "Développement Web — Sites Web Haute Performance",
        metaDescription:
          "Nous créons des sites web ultra-rapides en Next.js, accessibles et conçus pour convertir. Core Web Vitals au vert, SEO dès la base et design premium.",
        eyebrow: "Développement Web",
        title: "Des sites web haute performance, conçus pour convertir.",
        subtitle:
          "La fondation de tout système de croissance : un site web rapide, accessible et techniquement irréprochable, conçu pour attirer et transformer les visiteurs en clients.",
        intro:
          "Le développement web chez Byte & Brain ne consiste pas à faire un joli site, mais à construire la base sur laquelle repose toute la croissance digitale. Nous utilisons Next.js, React et l'edge rendering pour livrer des pages qui se chargent en un instant, se positionnent sur Google et convertissent les visiteurs en leads.",
        benefits: [
          {
            title: "Une vitesse qui retient",
            desc: "Chaque seconde de chargement perd des visiteurs. Nous optimisons pour des Core Web Vitals au vert et un score Lighthouse supérieur à 95.",
          },
          {
            title: "La conversion par le design",
            desc: "Chaque page a un objectif clair et des CTA pensés pour transformer le trafic en contacts réels.",
          },
          {
            title: "Le SEO dès le premier jour",
            desc: "Structure sémantique, données structurées et métadonnées correctes : le site naît prêt à se positionner.",
          },
        ],
        deliverables: [
          {
            title: "Design premium responsive",
            desc: "Des interfaces épurées et modernes, parfaites sur tout écran, avec modes sombre et clair natifs.",
          },
          {
            title: "Server-side rendering et edge",
            desc: "Rendu côté serveur et à l'edge pour une vitesse et un SEO maximaux.",
          },
          {
            title: "Accessibilité WCAG AA",
            desc: "Des sites utilisables par tous et conformes aux bonnes pratiques d'accessibilité.",
          },
          {
            title: "Code propre et évolutif",
            desc: "Composantisé et réutilisable, prêt à grandir avec votre entreprise.",
          },
        ],
        faqs: [
          {
            q: "Combien de temps faut-il pour construire un site web ?",
            a: "Cela dépend du périmètre, mais un site web professionnel bien structuré prend généralement de 3 à 6 semaines, du diagnostic au lancement. Les projets plus importants avec intégrations et automatisation peuvent prendre plus de temps.",
          },
          {
            q: "Quelles technologies utilisez-vous ?",
            a: "Nous construisons avec Next.js, TypeScript, React Server Components et Tailwind CSS, le même stack qui propulse des produits à l'échelle mondiale. Cela garantit vitesse, sécurité et évolutivité.",
          },
          {
            q: "Le site web est-il prêt pour le SEO ?",
            a: "Oui. Tous nos sites web naissent avec une structure sémantique, des données structurées (Schema.org), des métadonnées optimisées et des performances au vert : la base essentielle pour se positionner sur Google et sur les moteurs d'IA.",
          },
        ],
      },
    },
  },
  {
    slug: "seo",
    iconKey: "Search",
    order: 2,
    keywords: [
      "SEO",
      "otimização para motores de busca",
      "SEO técnico",
      "rankear no Google",
      "SEO Portugal",
    ],
    content: {
      pt: {
        metaTitle: "SEO — Rankear no Google de Forma Sustentável",
        metaDescription:
          "SEO técnico e de conteúdo com estrutura semântica perfeita. Colocamos o seu negócio no topo das pesquisas de forma sustentável e duradoura.",
        eyebrow: "SEO",
        title: "Seja encontrado quando os clientes procuram.",
        subtitle:
          "SEO técnico e de conteúdo que coloca o seu negócio no topo do Google — de forma sustentável, para gerar tráfego orgânico durante anos.",
        intro:
          "SEO (Search Engine Optimization) é o conjunto de práticas que faz o seu website aparecer nas primeiras posições do Google quando alguém procura o que oferece. Na Byte & Brain, combinamos SEO técnico, conteúdo de autoridade e estrutura semântica para construir ranking que dura e continua a crescer.",
        benefits: [
          {
            title: "Tráfego que não se paga",
            desc: "Ao contrário dos anúncios, o tráfego orgânico não para quando o orçamento acaba — acumula ao longo do tempo.",
          },
          {
            title: "Autoridade e confiança",
            desc: "Aparecer no topo do Google transmite credibilidade e posiciona o seu negócio como referência.",
          },
          {
            title: "Resultados mensuráveis",
            desc: "Medimos posições, tráfego e conversões para que saiba exatamente o retorno do investimento.",
          },
        ],
        deliverables: [
          {
            title: "Auditoria SEO técnica",
            desc: "Análise completa de velocidade, indexação, estrutura e erros que travam o ranking.",
          },
          {
            title: "Otimização on-page",
            desc: "Estrutura semântica, títulos, meta descrições, internal linking e dados estruturados.",
          },
          {
            title: "Estratégia de conteúdo",
            desc: "Palavras-chave certas e conteúdo que responde à intenção de pesquisa dos seus clientes.",
          },
          {
            title: "Monitorização contínua",
            desc: "Acompanhamento de posições e otimização com base em dados reais.",
          },
        ],
        faqs: [
          {
            q: "Quanto tempo demora a ver resultados de SEO?",
            a: "O SEO é um investimento de médio prazo. Os primeiros sinais surgem em 2 a 3 meses, com resultados sólidos a acumular entre 3 e 6 meses — e a crescer continuamente a partir daí.",
          },
          {
            q: "Qual a diferença entre SEO e anúncios pagos?",
            a: "Os anúncios geram tráfego imediato mas param quando deixa de pagar. O SEO constrói um ativo duradouro: tráfego orgânico que continua a chegar sem custo por clique, durante anos.",
          },
          {
            q: "Garantem a primeira posição no Google?",
            a: "Ninguém sério garante a primeira posição — o Google usa centenas de fatores. O que garantimos é um trabalho técnico e de conteúdo sólido que maximiza as suas hipóteses de rankear e gera crescimento real e mensurável.",
          },
        ],
      },
      en: {
        metaTitle: "SEO — Rank on Google Sustainably",
        metaDescription:
          "Technical and content SEO with perfect semantic structure. We put your business at the top of search, sustainably and for the long term.",
        eyebrow: "SEO",
        title: "Get found when customers are searching.",
        subtitle:
          "Technical and content SEO that puts your business at the top of Google — sustainably, to generate organic traffic for years.",
        intro:
          "SEO (Search Engine Optimization) is the set of practices that makes your website appear in the top positions of Google when someone searches for what you offer. At Byte & Brain, we combine technical SEO, authority content and semantic structure to build ranking that lasts and keeps growing.",
        benefits: [
          {
            title: "Traffic you don't pay for",
            desc: "Unlike ads, organic traffic doesn't stop when the budget runs out — it compounds over time.",
          },
          {
            title: "Authority and trust",
            desc: "Appearing at the top of Google signals credibility and positions your business as a reference.",
          },
          {
            title: "Measurable results",
            desc: "We track positions, traffic and conversions so you know exactly the return on investment.",
          },
        ],
        deliverables: [
          {
            title: "Technical SEO audit",
            desc: "Full analysis of speed, indexing, structure and errors that hold back ranking.",
          },
          {
            title: "On-page optimization",
            desc: "Semantic structure, titles, meta descriptions, internal linking and structured data.",
          },
          {
            title: "Content strategy",
            desc: "The right keywords and content that answers your customers' search intent.",
          },
          {
            title: "Continuous monitoring",
            desc: "Position tracking and optimization based on real data.",
          },
        ],
        faqs: [
          {
            q: "How long until I see SEO results?",
            a: "SEO is a medium-term investment. First signs appear in 2 to 3 months, with solid results compounding between 3 and 6 months — and growing continuously from there.",
          },
          {
            q: "What's the difference between SEO and paid ads?",
            a: "Ads generate immediate traffic but stop when you stop paying. SEO builds a lasting asset: organic traffic that keeps coming with no cost per click, for years.",
          },
          {
            q: "Do you guarantee the first position on Google?",
            a: "No serious provider guarantees the first position — Google uses hundreds of factors. What we guarantee is solid technical and content work that maximizes your chances of ranking and drives real, measurable growth.",
          },
        ],
      },
      es: {
        metaTitle: "SEO — Posiciona en Google de Forma Sostenible",
        metaDescription:
          "SEO técnico y de contenido con una estructura semántica perfecta. Colocamos su negocio en lo más alto de las búsquedas, de forma sostenible y duradera.",
        eyebrow: "SEO",
        title: "Que le encuentren cuando los clientes buscan.",
        subtitle:
          "SEO técnico y de contenido que sitúa su negocio en lo más alto de Google, de forma sostenible, para generar tráfico orgánico durante años.",
        intro:
          "El SEO (Search Engine Optimization) es el conjunto de prácticas que hace que su sitio web aparezca en las primeras posiciones de Google cuando alguien busca lo que ofrece. En Byte & Brain combinamos SEO técnico, contenido de autoridad y estructura semántica para construir un posicionamiento que perdura y sigue creciendo.",
        benefits: [
          {
            title: "Tráfico que no se paga",
            desc: "A diferencia de los anuncios, el tráfico orgánico no se detiene cuando se acaba el presupuesto: se acumula con el tiempo.",
          },
          {
            title: "Autoridad y confianza",
            desc: "Aparecer en lo más alto de Google transmite credibilidad y posiciona su negocio como referencia.",
          },
          {
            title: "Resultados medibles",
            desc: "Medimos posiciones, tráfico y conversiones para que sepa exactamente el retorno de la inversión.",
          },
        ],
        deliverables: [
          {
            title: "Auditoría SEO técnica",
            desc: "Análisis completo de velocidad, indexación, estructura y errores que frenan el posicionamiento.",
          },
          {
            title: "Optimización on-page",
            desc: "Estructura semántica, títulos, meta descripciones, enlazado interno y datos estructurados.",
          },
          {
            title: "Estrategia de contenido",
            desc: "Las palabras clave adecuadas y contenido que responde a la intención de búsqueda de sus clientes.",
          },
          {
            title: "Monitorización continua",
            desc: "Seguimiento de posiciones y optimización basada en datos reales.",
          },
        ],
        faqs: [
          {
            q: "¿Cuánto tarda en verse resultados de SEO?",
            a: "El SEO es una inversión a medio plazo. Las primeras señales aparecen en 2 o 3 meses, con resultados sólidos que se acumulan entre 3 y 6 meses, y que crecen de forma continua a partir de ahí.",
          },
          {
            q: "¿Cuál es la diferencia entre SEO y anuncios de pago?",
            a: "Los anuncios generan tráfico inmediato pero se detienen cuando deja de pagar. El SEO construye un activo duradero: tráfico orgánico que sigue llegando sin coste por clic, durante años.",
          },
          {
            q: "¿Garantizáis la primera posición en Google?",
            a: "Ningún proveedor serio garantiza la primera posición: Google usa cientos de factores. Lo que garantizamos es un trabajo técnico y de contenido sólido que maximiza sus posibilidades de posicionar y genera un crecimiento real y medible.",
          },
        ],
      },
      fr: {
        metaTitle: "SEO — Se Positionner sur Google Durablement",
        metaDescription:
          "SEO technique et de contenu avec une structure sémantique parfaite. Nous plaçons votre entreprise en tête des recherches, de façon durable et pérenne.",
        eyebrow: "SEO",
        title: "Soyez trouvé quand les clients recherchent.",
        subtitle:
          "Un SEO technique et de contenu qui place votre entreprise en tête de Google, durablement, pour générer du trafic organique pendant des années.",
        intro:
          "Le SEO (Search Engine Optimization) est l'ensemble des pratiques qui font apparaître votre site web dans les premières positions de Google lorsqu'on recherche ce que vous proposez. Chez Byte & Brain, nous combinons SEO technique, contenu d'autorité et structure sémantique pour construire un positionnement qui dure et qui continue de croître.",
        benefits: [
          {
            title: "Un trafic qui ne se paie pas",
            desc: "Contrairement aux annonces, le trafic organique ne s'arrête pas quand le budget s'épuise : il s'accumule avec le temps.",
          },
          {
            title: "Autorité et confiance",
            desc: "Apparaître en tête de Google transmet de la crédibilité et positionne votre entreprise comme une référence.",
          },
          {
            title: "Des résultats mesurables",
            desc: "Nous mesurons les positions, le trafic et les conversions pour que vous connaissiez précisément le retour sur investissement.",
          },
        ],
        deliverables: [
          {
            title: "Audit SEO technique",
            desc: "Analyse complète de la vitesse, de l'indexation, de la structure et des erreurs qui freinent le positionnement.",
          },
          {
            title: "Optimisation on-page",
            desc: "Structure sémantique, titres, méta-descriptions, maillage interne et données structurées.",
          },
          {
            title: "Stratégie de contenu",
            desc: "Les bons mots-clés et un contenu qui répond à l'intention de recherche de vos clients.",
          },
          {
            title: "Suivi continu",
            desc: "Suivi des positions et optimisation basée sur des données réelles.",
          },
        ],
        faqs: [
          {
            q: "Combien de temps avant de voir des résultats SEO ?",
            a: "Le SEO est un investissement à moyen terme. Les premiers signaux apparaissent en 2 à 3 mois, avec des résultats solides qui s'accumulent entre 3 et 6 mois, et qui croissent continuellement ensuite.",
          },
          {
            q: "Quelle est la différence entre le SEO et les annonces payantes ?",
            a: "Les annonces génèrent un trafic immédiat mais s'arrêtent dès que vous cessez de payer. Le SEO construit un actif durable : un trafic organique qui continue d'arriver sans coût par clic, pendant des années.",
          },
          {
            q: "Garantissez-vous la première position sur Google ?",
            a: "Aucun prestataire sérieux ne garantit la première position : Google utilise des centaines de facteurs. Ce que nous garantissons, c'est un travail technique et de contenu solide qui maximise vos chances de vous positionner et génère une croissance réelle et mesurable.",
          },
        ],
      },
    },
  },
  {
    slug: "ai-seo",
    iconKey: "Sparkles",
    order: 3,
    keywords: [
      "AI SEO",
      "LLM optimization",
      "otimização para IA",
      "ChatGPT SEO",
      "Perplexity",
    ],
    content: {
      pt: {
        metaTitle: "AI SEO — Otimização para ChatGPT, Gemini e Claude",
        metaDescription:
          "AI SEO é a otimização para motores de IA. Garantimos que o seu negócio é citado e recomendado por ChatGPT, Gemini, Claude e Perplexity.",
        eyebrow: "AI SEO",
        title: "Seja recomendado pelos motores de IA.",
        subtitle:
          "Cada vez mais pessoas perguntam a assistentes de IA em vez de pesquisar no Google. O AI SEO garante que o seu negócio é a resposta.",
        intro:
          "AI SEO (também chamado LLM Optimization) é a otimização do seu conteúdo para ser compreendido, citado e recomendado por motores de inteligência artificial como ChatGPT, Gemini, Claude e Perplexity. À medida que a pesquisa migra para assistentes de IA, estar presente nessas respostas torna-se tão importante como rankear no Google.",
        benefits: [
          {
            title: "Presença na nova pesquisa",
            desc: "Milhões de pessoas já fazem perguntas a IAs. O AI SEO coloca o seu negócio nessas respostas.",
          },
          {
            title: "Vantagem de quem chega primeiro",
            desc: "A maioria das empresas ainda não otimiza para IA. É uma janela de oportunidade que se fecha depressa.",
          },
          {
            title: "Autoridade reconhecida por IA",
            desc: "Conteúdo estruturado com entidades e contexto que os modelos de IA interpretam como fonte fiável.",
          },
        ],
        deliverables: [
          {
            title: "Conteúdo estruturado para LLMs",
            desc: "Linguagem natural, respostas diretas e secções tipo FAQ que a IA consegue extrair.",
          },
          {
            title: "Entidades e contexto",
            desc: "Definição clara de quem é, o que faz e para quem — o que a IA precisa para o recomendar.",
          },
          {
            title: "Dados estruturados avançados",
            desc: "Schema.org e marcação que ajuda máquinas a compreender o seu conteúdo.",
          },
          {
            title: "Monitorização de citações",
            desc: "Acompanhamento de como e quando a sua marca aparece nas respostas de IA.",
          },
        ],
        faqs: [
          {
            q: "O que é AI SEO e porque é importante agora?",
            a: "AI SEO é a otimização para motores de IA como ChatGPT, Gemini, Claude e Perplexity. É importante agora porque a pesquisa está a mudar: cada vez mais pessoas fazem perguntas a assistentes de IA em vez de usarem o Google, e quem otimizar primeiro ganha visibilidade nessa nova camada.",
          },
          {
            q: "É diferente do SEO tradicional?",
            a: "Complementa-o. O SEO tradicional otimiza para os resultados do Google; o AI SEO otimiza para ser citado nas respostas geradas por IA. Ambos partilham fundamentos — conteúdo claro e estruturado — mas o AI SEO foca-se em linguagem natural, entidades e contexto que os modelos interpretam.",
          },
          {
            q: "Como sabem se está a funcionar?",
            a: "Testamos regularmente as perguntas relevantes do seu setor nos principais motores de IA e monitorizamos se e como a sua marca é mencionada, ajustando a estratégia com base nesses resultados.",
          },
        ],
      },
      en: {
        metaTitle: "AI SEO — Optimization for ChatGPT, Gemini and Claude",
        metaDescription:
          "AI SEO is optimization for AI engines. We ensure your business is cited and recommended by ChatGPT, Gemini, Claude and Perplexity.",
        eyebrow: "AI SEO",
        title: "Get recommended by AI engines.",
        subtitle:
          "More and more people ask AI assistants instead of searching Google. AI SEO makes sure your business is the answer.",
        intro:
          "AI SEO (also called LLM Optimization) is the optimization of your content to be understood, cited and recommended by artificial intelligence engines like ChatGPT, Gemini, Claude and Perplexity. As search migrates to AI assistants, being present in those answers becomes as important as ranking on Google.",
        benefits: [
          {
            title: "Presence in the new search",
            desc: "Millions already ask AIs questions. AI SEO puts your business in those answers.",
          },
          {
            title: "First-mover advantage",
            desc: "Most companies don't yet optimize for AI. It's a window of opportunity that closes fast.",
          },
          {
            title: "Authority recognized by AI",
            desc: "Structured content with entities and context that AI models read as a reliable source.",
          },
        ],
        deliverables: [
          {
            title: "Content structured for LLMs",
            desc: "Natural language, direct answers and FAQ-style sections that AI can extract.",
          },
          {
            title: "Entities and context",
            desc: "A clear definition of who you are, what you do and for whom — what AI needs to recommend you.",
          },
          {
            title: "Advanced structured data",
            desc: "Schema.org and markup that helps machines understand your content.",
          },
          {
            title: "Citation monitoring",
            desc: "Tracking how and when your brand appears in AI answers.",
          },
        ],
        faqs: [
          {
            q: "What is AI SEO and why does it matter now?",
            a: "AI SEO is optimization for AI engines like ChatGPT, Gemini, Claude and Perplexity. It matters now because search is changing: more and more people ask AI assistants instead of using Google, and whoever optimizes first gains visibility in that new layer.",
          },
          {
            q: "Is it different from traditional SEO?",
            a: "It complements it. Traditional SEO optimizes for Google results; AI SEO optimizes to be cited in AI-generated answers. Both share fundamentals — clear, structured content — but AI SEO focuses on natural language, entities and context that models interpret.",
          },
          {
            q: "How do you know it's working?",
            a: "We regularly test the relevant questions in your industry across the main AI engines and monitor whether and how your brand is mentioned, adjusting the strategy based on those results.",
          },
        ],
      },
      es: {
        metaTitle: "AI SEO — Optimización para ChatGPT, Gemini y Claude",
        metaDescription:
          "El AI SEO es la optimización para motores de IA. Garantizamos que su negocio sea citado y recomendado por ChatGPT, Gemini, Claude y Perplexity.",
        eyebrow: "AI SEO",
        title: "Sea recomendado por los motores de IA.",
        subtitle:
          "Cada vez más personas preguntan a los asistentes de IA en lugar de buscar en Google. El AI SEO garantiza que su negocio sea la respuesta.",
        intro:
          "El AI SEO (también llamado LLM Optimization) es la optimización de su contenido para que sea comprendido, citado y recomendado por motores de inteligencia artificial como ChatGPT, Gemini, Claude y Perplexity. A medida que la búsqueda migra hacia los asistentes de IA, estar presente en esas respuestas se vuelve tan importante como posicionar en Google.",
        benefits: [
          {
            title: "Presencia en la nueva búsqueda",
            desc: "Millones de personas ya hacen preguntas a las IA. El AI SEO coloca su negocio en esas respuestas.",
          },
          {
            title: "Ventaja del primero en llegar",
            desc: "La mayoría de las empresas todavía no optimiza para IA. Es una ventana de oportunidad que se cierra rápido.",
          },
          {
            title: "Autoridad reconocida por la IA",
            desc: "Contenido estructurado con entidades y contexto que los modelos de IA interpretan como fuente fiable.",
          },
        ],
        deliverables: [
          {
            title: "Contenido estructurado para LLMs",
            desc: "Lenguaje natural, respuestas directas y secciones tipo FAQ que la IA puede extraer.",
          },
          {
            title: "Entidades y contexto",
            desc: "Una definición clara de quién es, qué hace y para quién: lo que la IA necesita para recomendarle.",
          },
          {
            title: "Datos estructurados avanzados",
            desc: "Schema.org y marcado que ayuda a las máquinas a comprender su contenido.",
          },
          {
            title: "Monitorización de citas",
            desc: "Seguimiento de cómo y cuándo aparece su marca en las respuestas de IA.",
          },
        ],
        faqs: [
          {
            q: "¿Qué es el AI SEO y por qué importa ahora?",
            a: "El AI SEO es la optimización para motores de IA como ChatGPT, Gemini, Claude y Perplexity. Importa ahora porque la búsqueda está cambiando: cada vez más personas preguntan a asistentes de IA en lugar de usar Google, y quien optimiza primero gana visibilidad en esa nueva capa.",
          },
          {
            q: "¿Es diferente del SEO tradicional?",
            a: "Lo complementa. El SEO tradicional optimiza para los resultados de Google; el AI SEO optimiza para ser citado en las respuestas generadas por IA. Ambos comparten fundamentos —contenido claro y estructurado— pero el AI SEO se centra en el lenguaje natural, las entidades y el contexto que los modelos interpretan.",
          },
          {
            q: "¿Cómo sabéis si está funcionando?",
            a: "Probamos regularmente las preguntas relevantes de su sector en los principales motores de IA y monitorizamos si su marca se menciona y cómo, ajustando la estrategia en función de esos resultados.",
          },
        ],
      },
      fr: {
        metaTitle: "AI SEO — Optimisation pour ChatGPT, Gemini et Claude",
        metaDescription:
          "L'AI SEO est l'optimisation pour les moteurs d'IA. Nous garantissons que votre entreprise soit citée et recommandée par ChatGPT, Gemini, Claude et Perplexity.",
        eyebrow: "AI SEO",
        title: "Soyez recommandé par les moteurs d'IA.",
        subtitle:
          "De plus en plus de personnes interrogent les assistants d'IA au lieu de chercher sur Google. L'AI SEO garantit que votre entreprise soit la réponse.",
        intro:
          "L'AI SEO (aussi appelé LLM Optimization) est l'optimisation de votre contenu pour qu'il soit compris, cité et recommandé par les moteurs d'intelligence artificielle comme ChatGPT, Gemini, Claude et Perplexity. À mesure que la recherche migre vers les assistants d'IA, être présent dans ces réponses devient aussi important que se positionner sur Google.",
        benefits: [
          {
            title: "Une présence dans la nouvelle recherche",
            desc: "Des millions de personnes posent déjà des questions aux IA. L'AI SEO place votre entreprise dans ces réponses.",
          },
          {
            title: "L'avantage du premier arrivé",
            desc: "La plupart des entreprises n'optimisent pas encore pour l'IA. C'est une fenêtre d'opportunité qui se referme vite.",
          },
          {
            title: "Une autorité reconnue par l'IA",
            desc: "Un contenu structuré avec entités et contexte que les modèles d'IA interprètent comme une source fiable.",
          },
        ],
        deliverables: [
          {
            title: "Contenu structuré pour les LLM",
            desc: "Langage naturel, réponses directes et sections de type FAQ que l'IA peut extraire.",
          },
          {
            title: "Entités et contexte",
            desc: "Une définition claire de qui vous êtes, ce que vous faites et pour qui : ce dont l'IA a besoin pour vous recommander.",
          },
          {
            title: "Données structurées avancées",
            desc: "Schema.org et balisage qui aident les machines à comprendre votre contenu.",
          },
          {
            title: "Suivi des citations",
            desc: "Suivi de comment et quand votre marque apparaît dans les réponses d'IA.",
          },
        ],
        faqs: [
          {
            q: "Qu'est-ce que l'AI SEO et pourquoi est-ce important maintenant ?",
            a: "L'AI SEO est l'optimisation pour les moteurs d'IA comme ChatGPT, Gemini, Claude et Perplexity. C'est important maintenant car la recherche change : de plus en plus de personnes interrogent des assistants d'IA au lieu d'utiliser Google, et celui qui optimise en premier gagne en visibilité dans cette nouvelle couche.",
          },
          {
            q: "Est-ce différent du SEO traditionnel ?",
            a: "Il le complète. Le SEO traditionnel optimise pour les résultats de Google ; l'AI SEO optimise pour être cité dans les réponses générées par l'IA. Les deux partagent des fondamentaux — un contenu clair et structuré — mais l'AI SEO se concentre sur le langage naturel, les entités et le contexte que les modèles interprètent.",
          },
          {
            q: "Comment savez-vous que ça fonctionne ?",
            a: "Nous testons régulièrement les questions pertinentes de votre secteur sur les principaux moteurs d'IA et surveillons si et comment votre marque est mentionnée, en ajustant la stratégie en fonction de ces résultats.",
          },
        ],
      },
    },
  },
  {
    slug: "local-seo",
    iconKey: "MapPin",
    order: 4,
    keywords: [
      "SEO local",
      "Google Business Profile",
      "SEO de proximidade",
      "pesquisa local",
    ],
    content: {
      pt: {
        metaTitle: "SEO Local — Apareça Primeiro na Sua Zona",
        metaDescription:
          "Apareça primeiro quando procuram perto de si. Otimização de Google Business Profile, mapas e LocalBusiness Schema para negócios locais.",
        eyebrow: "SEO Local",
        title: "Seja o primeiro quando procuram perto de si.",
        subtitle:
          "Para negócios com clientes na sua zona, o SEO local é o canal com maior retorno. Colocamos a sua empresa no topo dos resultados de proximidade.",
        intro:
          "SEO Local é a otimização que faz o seu negócio aparecer quando alguém procura por um serviço perto da sua localização — no Google, no Google Maps e no pacote de resultados locais. É essencial para clínicas, restaurantes, construção, comércio e qualquer negócio que sirva uma área geográfica.",
        benefits: [
          {
            title: "Clientes com intenção de comprar",
            desc: "Quem procura 'perto de mim' está pronto a agir. O SEO local capta essa intenção no momento certo.",
          },
          {
            title: "Destaque no Google Maps",
            desc: "Aparecer no pacote local e no mapa gera chamadas, direções e visitas físicas.",
          },
          {
            title: "Vantagem sobre a concorrência local",
            desc: "Muitos concorrentes negligenciam o SEO local — uma oportunidade clara de os ultrapassar.",
          },
        ],
        deliverables: [
          {
            title: "Otimização Google Business Profile",
            desc: "Perfil completo e otimizado que maximiza a visibilidade no mapa e nas pesquisas locais.",
          },
          {
            title: "LocalBusiness Schema",
            desc: "Dados estruturados que comunicam morada, horário e serviços aos motores de busca.",
          },
          {
            title: "Gestão de avaliações",
            desc: "Estratégia para gerar e responder a avaliações — um fator-chave de ranking local.",
          },
          {
            title: "Páginas por localização",
            desc: "Conteúdo otimizado para cada zona ou serviço que quer dominar.",
          },
        ],
        faqs: [
          {
            q: "O SEO local serve para o meu negócio?",
            a: "Se serve clientes numa área geográfica — uma clínica, um restaurante, uma empresa de construção, um escritório — o SEO local é provavelmente o seu canal com maior retorno, porque capta pessoas prontas a contactar ou visitar.",
          },
          {
            q: "As avaliações do Google influenciam o ranking?",
            a: "Sim, muito. A quantidade, a qualidade e a frequência das avaliações são fatores importantes no ranking local. Ajudamos a criar um processo para gerar avaliações genuínas e a responder-lhes de forma profissional.",
          },
          {
            q: "Preciso de uma loja física para fazer SEO local?",
            a: "Não necessariamente. Negócios que se deslocam ao cliente (service-area businesses) também podem otimizar para SEO local, definindo as zonas que servem no Google Business Profile.",
          },
        ],
      },
      en: {
        metaTitle: "Local SEO — Show Up First in Your Area",
        metaDescription:
          "Show up first when people search near you. Google Business Profile optimization, maps and LocalBusiness Schema for local businesses.",
        eyebrow: "Local SEO",
        title: "Be first when people search near you.",
        subtitle:
          "For businesses with customers in their area, local SEO is the highest-return channel. We put your company at the top of proximity results.",
        intro:
          "Local SEO is the optimization that makes your business appear when someone searches for a service near your location — on Google, Google Maps and the local results pack. It's essential for clinics, restaurants, construction, retail and any business serving a geographic area.",
        benefits: [
          {
            title: "Customers ready to buy",
            desc: "People searching 'near me' are ready to act. Local SEO captures that intent at the right moment.",
          },
          {
            title: "Google Maps visibility",
            desc: "Appearing in the local pack and on the map drives calls, directions and in-person visits.",
          },
          {
            title: "Edge over local competitors",
            desc: "Many competitors neglect local SEO — a clear opportunity to get ahead.",
          },
        ],
        deliverables: [
          {
            title: "Google Business Profile optimization",
            desc: "A complete, optimized profile that maximizes visibility on the map and in local searches.",
          },
          {
            title: "LocalBusiness Schema",
            desc: "Structured data that communicates address, hours and services to search engines.",
          },
          {
            title: "Review management",
            desc: "A strategy to generate and respond to reviews — a key local ranking factor.",
          },
          {
            title: "Location pages",
            desc: "Optimized content for each area or service you want to dominate.",
          },
        ],
        faqs: [
          {
            q: "Is local SEO right for my business?",
            a: "If you serve customers in a geographic area — a clinic, a restaurant, a construction company, an office — local SEO is likely your highest-return channel, because it captures people ready to contact or visit.",
          },
          {
            q: "Do Google reviews influence ranking?",
            a: "Yes, a lot. The quantity, quality and frequency of reviews are important local ranking factors. We help create a process to generate genuine reviews and respond to them professionally.",
          },
          {
            q: "Do I need a physical store to do local SEO?",
            a: "Not necessarily. Businesses that travel to the customer (service-area businesses) can also optimize for local SEO by defining the areas they serve in Google Business Profile.",
          },
        ],
      },
      es: {
        metaTitle: "SEO Local — Aparezca Primero en Su Zona",
        metaDescription:
          "Aparezca primero cuando buscan cerca de usted. Optimización de Google Business Profile, mapas y LocalBusiness Schema para negocios locales.",
        eyebrow: "SEO Local",
        title: "Sea el primero cuando buscan cerca de usted.",
        subtitle:
          "Para negocios con clientes en su zona, el SEO local es el canal con mayor retorno. Colocamos su empresa en lo más alto de los resultados de proximidad.",
        intro:
          "El SEO Local es la optimización que hace que su negocio aparezca cuando alguien busca un servicio cerca de su ubicación: en Google, en Google Maps y en el paquete de resultados locales. Es esencial para clínicas, restaurantes, construcción, comercio y cualquier negocio que sirva a un área geográfica.",
        benefits: [
          {
            title: "Clientes con intención de comprar",
            desc: "Quien busca 'cerca de mí' está listo para actuar. El SEO local capta esa intención en el momento adecuado.",
          },
          {
            title: "Visibilidad en Google Maps",
            desc: "Aparecer en el paquete local y en el mapa genera llamadas, indicaciones y visitas físicas.",
          },
          {
            title: "Ventaja sobre la competencia local",
            desc: "Muchos competidores descuidan el SEO local: una clara oportunidad para adelantarles.",
          },
        ],
        deliverables: [
          {
            title: "Optimización de Google Business Profile",
            desc: "Un perfil completo y optimizado que maximiza la visibilidad en el mapa y en las búsquedas locales.",
          },
          {
            title: "LocalBusiness Schema",
            desc: "Datos estructurados que comunican dirección, horario y servicios a los motores de búsqueda.",
          },
          {
            title: "Gestión de reseñas",
            desc: "Una estrategia para generar y responder a reseñas: un factor clave de posicionamiento local.",
          },
          {
            title: "Páginas por ubicación",
            desc: "Contenido optimizado para cada zona o servicio que quiera dominar.",
          },
        ],
        faqs: [
          {
            q: "¿El SEO local sirve para mi negocio?",
            a: "Si sirve a clientes en un área geográfica —una clínica, un restaurante, una empresa de construcción, una oficina—, el SEO local es probablemente su canal con mayor retorno, porque capta a personas listas para contactar o visitar.",
          },
          {
            q: "¿Las reseñas de Google influyen en el posicionamiento?",
            a: "Sí, mucho. La cantidad, la calidad y la frecuencia de las reseñas son factores importantes en el posicionamiento local. Ayudamos a crear un proceso para generar reseñas genuinas y a responderlas de forma profesional.",
          },
          {
            q: "¿Necesito una tienda física para hacer SEO local?",
            a: "No necesariamente. Los negocios que se desplazan al cliente (service-area businesses) también pueden optimizar para SEO local definiendo las zonas que sirven en Google Business Profile.",
          },
        ],
      },
      fr: {
        metaTitle: "SEO Local — Apparaissez en Premier dans Votre Zone",
        metaDescription:
          "Apparaissez en premier quand on recherche près de chez vous. Optimisation de Google Business Profile, cartes et LocalBusiness Schema pour les commerces locaux.",
        eyebrow: "SEO Local",
        title: "Soyez le premier quand on recherche près de chez vous.",
        subtitle:
          "Pour les entreprises avec des clients dans leur zone, le SEO local est le canal au meilleur retour. Nous plaçons votre entreprise en tête des résultats de proximité.",
        intro:
          "Le SEO Local est l'optimisation qui fait apparaître votre entreprise lorsqu'on recherche un service près de votre emplacement : sur Google, sur Google Maps et dans le pack de résultats locaux. Il est essentiel pour les cliniques, les restaurants, la construction, le commerce et toute entreprise desservant une zone géographique.",
        benefits: [
          {
            title: "Des clients avec intention d'achat",
            desc: "Celui qui recherche « près de moi » est prêt à agir. Le SEO local capte cette intention au bon moment.",
          },
          {
            title: "Visibilité sur Google Maps",
            desc: "Apparaître dans le pack local et sur la carte génère des appels, des itinéraires et des visites physiques.",
          },
          {
            title: "Un avantage sur la concurrence locale",
            desc: "Beaucoup de concurrents négligent le SEO local : une opportunité claire de les devancer.",
          },
        ],
        deliverables: [
          {
            title: "Optimisation de Google Business Profile",
            desc: "Un profil complet et optimisé qui maximise la visibilité sur la carte et dans les recherches locales.",
          },
          {
            title: "LocalBusiness Schema",
            desc: "Des données structurées qui communiquent l'adresse, les horaires et les services aux moteurs de recherche.",
          },
          {
            title: "Gestion des avis",
            desc: "Une stratégie pour générer et répondre aux avis : un facteur clé du positionnement local.",
          },
          {
            title: "Pages par emplacement",
            desc: "Un contenu optimisé pour chaque zone ou service que vous souhaitez dominer.",
          },
        ],
        faqs: [
          {
            q: "Le SEO local convient-il à mon entreprise ?",
            a: "Si vous servez des clients dans une zone géographique — une clinique, un restaurant, une entreprise de construction, un bureau —, le SEO local est probablement votre canal au meilleur retour, car il capte des personnes prêtes à contacter ou à visiter.",
          },
          {
            q: "Les avis Google influencent-ils le positionnement ?",
            a: "Oui, beaucoup. La quantité, la qualité et la fréquence des avis sont des facteurs importants du positionnement local. Nous aidons à créer un processus pour générer des avis authentiques et à y répondre de façon professionnelle.",
          },
          {
            q: "Ai-je besoin d'un magasin physique pour faire du SEO local ?",
            a: "Pas nécessairement. Les entreprises qui se déplacent chez le client (service-area businesses) peuvent aussi optimiser leur SEO local en définissant les zones qu'elles desservent dans Google Business Profile.",
          },
        ],
      },
    },
  },
  {
    slug: "automation",
    iconKey: "Workflow",
    order: 5,
    keywords: [
      "automação",
      "automação de marketing",
      "automação de leads",
      "workflows",
    ],
    content: {
      pt: {
        metaTitle: "Automação — O Seu Negócio a Trabalhar 24/7",
        metaDescription:
          "Automatizamos leads, respostas, follow-ups e operações. Menos trabalho manual, mais resultados — o seu negócio a trabalhar enquanto dorme.",
        eyebrow: "Automação",
        title: "Menos trabalho manual, mais resultados.",
        subtitle:
          "Automatizamos os fluxos que consomem o seu tempo — captação, qualificação, respostas e follow-up de leads — para o negócio trabalhar 24 horas por dia.",
        intro:
          "A automação liga as ferramentas do seu negócio e executa tarefas repetitivas sem intervenção manual: responder a novos contactos, qualificar leads, enviar follow-ups, atualizar o CRM e muito mais. O resultado é mais tempo para o que importa e nenhuma oportunidade perdida por falta de resposta.",
        benefits: [
          {
            title: "Nenhuma lead perdida",
            desc: "Respostas e seguimentos automáticos garantem que nenhum contacto fica esquecido.",
          },
          {
            title: "Tempo devolvido à equipa",
            desc: "Tarefas repetitivas passam a correr sozinhas, libertando horas todas as semanas.",
          },
          {
            title: "Consistência total",
            desc: "Cada lead recebe o mesmo processo impecável, sem depender de quem está disponível.",
          },
        ],
        deliverables: [
          {
            title: "Automação de captação de leads",
            desc: "Formulários, chatbots e integrações que capturam e encaminham contactos automaticamente.",
          },
          {
            title: "Follow-up automático",
            desc: "Sequências de email e mensagens que nutrem leads até estarem prontas a comprar.",
          },
          {
            title: "Integração de ferramentas",
            desc: "Ligamos CRM, email, calendário e outras ferramentas num fluxo único e coerente.",
          },
          {
            title: "Notificações e relatórios",
            desc: "Alertas em tempo real e relatórios automáticos para acompanhar tudo sem esforço.",
          },
        ],
        faqs: [
          {
            q: "Que tarefas posso automatizar no meu negócio?",
            a: "Praticamente qualquer tarefa repetitiva e baseada em regras: resposta a novos contactos, qualificação de leads, envio de follow-ups, agendamento de reuniões, atualização do CRM, faturação e notificações internas, entre outras.",
          },
          {
            q: "A automação substitui a minha equipa?",
            a: "Não — liberta-a. A automação trata do trabalho repetitivo para que a sua equipa se foque no que exige julgamento humano: relação com clientes, estratégia e fecho de negócios.",
          },
          {
            q: "Preciso de ferramentas caras para automatizar?",
            a: "Nem sempre. Desenhamos a solução com base nas ferramentas que já usa e recomendamos apenas o necessário. O objetivo é retorno claro, não custo acrescido.",
          },
        ],
      },
      en: {
        metaTitle: "Automation — Your Business Working 24/7",
        metaDescription:
          "We automate leads, replies, follow-ups and operations. Less manual work, more results — your business working while you sleep.",
        eyebrow: "Automation",
        title: "Less manual work, more results.",
        subtitle:
          "We automate the flows that eat your time — capturing, qualifying, answering and following up leads — so your business works 24 hours a day.",
        intro:
          "Automation connects your business tools and runs repetitive tasks with no manual intervention: replying to new contacts, qualifying leads, sending follow-ups, updating the CRM and much more. The result is more time for what matters and no opportunity lost to a missed reply.",
        benefits: [
          {
            title: "No lost leads",
            desc: "Automatic replies and follow-ups ensure no contact is forgotten.",
          },
          {
            title: "Time given back to the team",
            desc: "Repetitive tasks run on their own, freeing hours every week.",
          },
          {
            title: "Total consistency",
            desc: "Every lead gets the same flawless process, regardless of who's available.",
          },
        ],
        deliverables: [
          {
            title: "Lead capture automation",
            desc: "Forms, chatbots and integrations that capture and route contacts automatically.",
          },
          {
            title: "Automatic follow-up",
            desc: "Email and message sequences that nurture leads until they're ready to buy.",
          },
          {
            title: "Tool integration",
            desc: "We connect CRM, email, calendar and other tools into one coherent flow.",
          },
          {
            title: "Notifications and reports",
            desc: "Real-time alerts and automatic reports to track everything effortlessly.",
          },
        ],
        faqs: [
          {
            q: "What tasks can I automate in my business?",
            a: "Almost any repetitive, rule-based task: replying to new contacts, qualifying leads, sending follow-ups, scheduling meetings, updating the CRM, invoicing and internal notifications, among others.",
          },
          {
            q: "Does automation replace my team?",
            a: "No — it frees it. Automation handles the repetitive work so your team focuses on what requires human judgment: customer relationships, strategy and closing deals.",
          },
          {
            q: "Do I need expensive tools to automate?",
            a: "Not always. We design the solution based on the tools you already use and recommend only what's needed. The goal is clear return, not added cost.",
          },
        ],
      },
      es: {
        metaTitle: "Automatización — Su Negocio Trabajando 24/7",
        metaDescription:
          "Automatizamos leads, respuestas, seguimientos y operaciones. Menos trabajo manual, más resultados: su negocio trabajando mientras usted duerme.",
        eyebrow: "Automatización",
        title: "Menos trabajo manual, más resultados.",
        subtitle:
          "Automatizamos los flujos que le consumen tiempo —captación, cualificación, respuestas y seguimiento de leads— para que su negocio trabaje 24 horas al día.",
        intro:
          "La automatización conecta las herramientas de su negocio y ejecuta tareas repetitivas sin intervención manual: responder a nuevos contactos, cualificar leads, enviar seguimientos, actualizar el CRM y mucho más. El resultado es más tiempo para lo que importa y ninguna oportunidad perdida por una respuesta olvidada.",
        benefits: [
          {
            title: "Ninguna lead perdida",
            desc: "Las respuestas y los seguimientos automáticos garantizan que ningún contacto quede olvidado.",
          },
          {
            title: "Tiempo devuelto al equipo",
            desc: "Las tareas repetitivas pasan a ejecutarse solas, liberando horas cada semana.",
          },
          {
            title: "Consistencia total",
            desc: "Cada lead recibe el mismo proceso impecable, sin depender de quién esté disponible.",
          },
        ],
        deliverables: [
          {
            title: "Automatización de captación de leads",
            desc: "Formularios, chatbots e integraciones que capturan y encaminan contactos automáticamente.",
          },
          {
            title: "Seguimiento automático",
            desc: "Secuencias de email y mensajes que nutren a los leads hasta que están listos para comprar.",
          },
          {
            title: "Integración de herramientas",
            desc: "Conectamos CRM, email, calendario y otras herramientas en un flujo único y coherente.",
          },
          {
            title: "Notificaciones e informes",
            desc: "Alertas en tiempo real e informes automáticos para seguirlo todo sin esfuerzo.",
          },
        ],
        faqs: [
          {
            q: "¿Qué tareas puedo automatizar en mi negocio?",
            a: "Prácticamente cualquier tarea repetitiva y basada en reglas: responder a nuevos contactos, cualificar leads, enviar seguimientos, agendar reuniones, actualizar el CRM, facturación y notificaciones internas, entre otras.",
          },
          {
            q: "¿La automatización sustituye a mi equipo?",
            a: "No, lo libera. La automatización se encarga del trabajo repetitivo para que su equipo se centre en lo que exige juicio humano: la relación con los clientes, la estrategia y el cierre de negocios.",
          },
          {
            q: "¿Necesito herramientas caras para automatizar?",
            a: "No siempre. Diseñamos la solución a partir de las herramientas que ya usa y recomendamos solo lo necesario. El objetivo es un retorno claro, no un coste añadido.",
          },
        ],
      },
      fr: {
        metaTitle: "Automatisation — Votre Entreprise au Travail 24/7",
        metaDescription:
          "Nous automatisons les leads, les réponses, les relances et les opérations. Moins de travail manuel, plus de résultats : votre entreprise travaille pendant que vous dormez.",
        eyebrow: "Automatisation",
        title: "Moins de travail manuel, plus de résultats.",
        subtitle:
          "Nous automatisons les flux qui vous prennent du temps — captation, qualification, réponses et relance des leads — pour que votre entreprise travaille 24 heures sur 24.",
        intro:
          "L'automatisation relie les outils de votre entreprise et exécute les tâches répétitives sans intervention manuelle : répondre aux nouveaux contacts, qualifier les leads, envoyer des relances, mettre à jour le CRM et bien plus. Le résultat : plus de temps pour l'essentiel et aucune opportunité perdue faute de réponse.",
        benefits: [
          {
            title: "Aucun lead perdu",
            desc: "Les réponses et relances automatiques garantissent qu'aucun contact n'est oublié.",
          },
          {
            title: "Du temps rendu à l'équipe",
            desc: "Les tâches répétitives s'exécutent d'elles-mêmes, libérant des heures chaque semaine.",
          },
          {
            title: "Une consistance totale",
            desc: "Chaque lead reçoit le même processus irréprochable, indépendamment de qui est disponible.",
          },
        ],
        deliverables: [
          {
            title: "Automatisation de la captation de leads",
            desc: "Formulaires, chatbots et intégrations qui capturent et acheminent les contacts automatiquement.",
          },
          {
            title: "Relance automatique",
            desc: "Séquences d'emails et de messages qui nourrissent les leads jusqu'à ce qu'ils soient prêts à acheter.",
          },
          {
            title: "Intégration des outils",
            desc: "Nous connectons CRM, email, calendrier et autres outils en un flux unique et cohérent.",
          },
          {
            title: "Notifications et rapports",
            desc: "Alertes en temps réel et rapports automatiques pour tout suivre sans effort.",
          },
        ],
        faqs: [
          {
            q: "Quelles tâches puis-je automatiser dans mon entreprise ?",
            a: "Presque toute tâche répétitive et basée sur des règles : répondre aux nouveaux contacts, qualifier les leads, envoyer des relances, planifier des réunions, mettre à jour le CRM, la facturation et les notifications internes, entre autres.",
          },
          {
            q: "L'automatisation remplace-t-elle mon équipe ?",
            a: "Non, elle la libère. L'automatisation prend en charge le travail répétitif pour que votre équipe se concentre sur ce qui exige un jugement humain : la relation client, la stratégie et la conclusion des affaires.",
          },
          {
            q: "Ai-je besoin d'outils coûteux pour automatiser ?",
            a: "Pas toujours. Nous concevons la solution à partir des outils que vous utilisez déjà et ne recommandons que le nécessaire. L'objectif est un retour clair, pas un coût supplémentaire.",
          },
        ],
      },
    },
  },
  {
    slug: "artificial-intelligence",
    iconKey: "BrainCircuit",
    order: 6,
    keywords: [
      "inteligência artificial",
      "IA para empresas",
      "assistentes de IA",
      "integração de IA",
    ],
    content: {
      pt: {
        metaTitle: "Inteligência Artificial — IA à Medida do Seu Negócio",
        metaDescription:
          "Assistentes, qualificação de leads e integrações de IA à medida. Colocamos a inteligência artificial a trabalhar por resultados no seu negócio.",
        eyebrow: "Inteligência Artificial",
        title: "IA a trabalhar por resultados, não por moda.",
        subtitle:
          "Integramos inteligência artificial de forma prática e mensurável — assistentes, qualificação automática e soluções à medida do seu negócio.",
        intro:
          "Inteligência artificial não é uma buzzword na Byte & Brain — é uma ferramenta para resolver problemas concretos. Construímos assistentes que respondem a clientes, sistemas que qualificam leads automaticamente e integrações de IA que poupam tempo e aumentam conversões, sempre focados em retorno real.",
        benefits: [
          {
            title: "Atendimento sempre disponível",
            desc: "Assistentes de IA respondem a perguntas comuns a qualquer hora, sem fazer o cliente esperar.",
          },
          {
            title: "Qualificação inteligente",
            desc: "A IA identifica as leads mais quentes para a sua equipa focar onde há mais oportunidade.",
          },
          {
            title: "Escala sem aumentar custos",
            desc: "Faça mais com a mesma equipa, delegando tarefas cognitivas à inteligência artificial.",
          },
        ],
        deliverables: [
          {
            title: "Assistentes e chatbots de IA",
            desc: "Agentes treinados no seu negócio que respondem, orientam e captam contactos.",
          },
          {
            title: "Qualificação automática de leads",
            desc: "Sistemas que analisam e classificam leads segundo o potencial de conversão.",
          },
          {
            title: "Integrações à medida",
            desc: "Ligação da IA às suas ferramentas e processos, adaptada ao seu caso concreto.",
          },
          {
            title: "Geração de conteúdo assistida",
            desc: "Fluxos de IA para acelerar a produção de conteúdo com qualidade e consistência.",
          },
        ],
        faqs: [
          {
            q: "A IA faz sentido para uma PME?",
            a: "Sim. As PMEs são, muitas vezes, quem mais beneficia: com equipas pequenas, delegar tarefas repetitivas e de atendimento à IA permite competir com empresas maiores sem aumentar custos de estrutura.",
          },
          {
            q: "Os meus dados ficam seguros?",
            a: "A segurança e a privacidade dos dados são uma prioridade. Desenhamos as soluções com boas práticas de proteção de dados e escolhemos fornecedores e configurações que respeitam a confidencialidade do seu negócio.",
          },
          {
            q: "Por onde se começa a usar IA no negócio?",
            a: "Começamos por identificar um problema concreto com retorno claro — por exemplo, responder a perguntas frequentes ou qualificar leads — e implementamos uma solução focada nesse ponto, para provar valor antes de escalar.",
          },
        ],
      },
      en: {
        metaTitle: "Artificial Intelligence — AI Tailored to Your Business",
        metaDescription:
          "Assistants, lead qualification and tailored AI integrations. We put artificial intelligence to work for results in your business.",
        eyebrow: "Artificial Intelligence",
        title: "AI working for results, not for hype.",
        subtitle:
          "We integrate artificial intelligence in a practical, measurable way — assistants, automatic qualification and solutions tailored to your business.",
        intro:
          "Artificial intelligence isn't a buzzword at Byte & Brain — it's a tool to solve concrete problems. We build assistants that answer customers, systems that qualify leads automatically and AI integrations that save time and increase conversions, always focused on real return.",
        benefits: [
          {
            title: "Always-on service",
            desc: "AI assistants answer common questions at any hour, without making the customer wait.",
          },
          {
            title: "Smart qualification",
            desc: "AI identifies the hottest leads so your team focuses where there's most opportunity.",
          },
          {
            title: "Scale without raising costs",
            desc: "Do more with the same team by delegating cognitive tasks to artificial intelligence.",
          },
        ],
        deliverables: [
          {
            title: "AI assistants and chatbots",
            desc: "Agents trained on your business that answer, guide and capture contacts.",
          },
          {
            title: "Automatic lead qualification",
            desc: "Systems that analyze and score leads by conversion potential.",
          },
          {
            title: "Tailored integrations",
            desc: "Connecting AI to your tools and processes, adapted to your specific case.",
          },
          {
            title: "Assisted content generation",
            desc: "AI flows to speed up content production with quality and consistency.",
          },
        ],
        faqs: [
          {
            q: "Does AI make sense for an SME?",
            a: "Yes. SMEs often benefit the most: with small teams, delegating repetitive and service tasks to AI lets you compete with larger companies without raising structural costs.",
          },
          {
            q: "Is my data safe?",
            a: "Data security and privacy are a priority. We design solutions with data protection best practices and choose providers and configurations that respect your business's confidentiality.",
          },
          {
            q: "Where do you start using AI in a business?",
            a: "We start by identifying a concrete problem with clear return — for example, answering frequent questions or qualifying leads — and implement a focused solution to prove value before scaling.",
          },
        ],
      },
      es: {
        metaTitle: "Inteligencia Artificial — IA a la Medida de Su Negocio",
        metaDescription:
          "Asistentes, cualificación de leads e integraciones de IA a medida. Ponemos la inteligencia artificial a trabajar por resultados en su negocio.",
        eyebrow: "Inteligencia Artificial",
        title: "IA trabajando por resultados, no por moda.",
        subtitle:
          "Integramos inteligencia artificial de forma práctica y medible: asistentes, cualificación automática y soluciones a la medida de su negocio.",
        intro:
          "La inteligencia artificial no es una palabra de moda en Byte & Brain: es una herramienta para resolver problemas concretos. Construimos asistentes que responden a clientes, sistemas que cualifican leads automáticamente e integraciones de IA que ahorran tiempo y aumentan las conversiones, siempre enfocados en un retorno real.",
        benefits: [
          {
            title: "Atención siempre disponible",
            desc: "Los asistentes de IA responden a preguntas comunes a cualquier hora, sin hacer esperar al cliente.",
          },
          {
            title: "Cualificación inteligente",
            desc: "La IA identifica los leads más calientes para que su equipo se centre donde hay más oportunidad.",
          },
          {
            title: "Escale sin aumentar costes",
            desc: "Haga más con el mismo equipo, delegando tareas cognitivas a la inteligencia artificial.",
          },
        ],
        deliverables: [
          {
            title: "Asistentes y chatbots de IA",
            desc: "Agentes entrenados en su negocio que responden, orientan y captan contactos.",
          },
          {
            title: "Cualificación automática de leads",
            desc: "Sistemas que analizan y clasifican leads según su potencial de conversión.",
          },
          {
            title: "Integraciones a medida",
            desc: "Conexión de la IA con sus herramientas y procesos, adaptada a su caso concreto.",
          },
          {
            title: "Generación de contenido asistida",
            desc: "Flujos de IA para acelerar la producción de contenido con calidad y consistencia.",
          },
        ],
        faqs: [
          {
            q: "¿La IA tiene sentido para una pyme?",
            a: "Sí. Las pymes suelen ser quienes más se benefician: con equipos pequeños, delegar tareas repetitivas y de atención a la IA permite competir con empresas mayores sin aumentar los costes de estructura.",
          },
          {
            q: "¿Mis datos están seguros?",
            a: "La seguridad y la privacidad de los datos son una prioridad. Diseñamos las soluciones con buenas prácticas de protección de datos y elegimos proveedores y configuraciones que respetan la confidencialidad de su negocio.",
          },
          {
            q: "¿Por dónde se empieza a usar IA en el negocio?",
            a: "Empezamos por identificar un problema concreto con retorno claro —por ejemplo, responder a preguntas frecuentes o cualificar leads— e implementamos una solución enfocada en ese punto, para demostrar valor antes de escalar.",
          },
        ],
      },
      fr: {
        metaTitle: "Intelligence Artificielle — L'IA Sur Mesure pour Votre Entreprise",
        metaDescription:
          "Assistants, qualification des leads et intégrations d'IA sur mesure. Nous mettons l'intelligence artificielle au service des résultats de votre entreprise.",
        eyebrow: "Intelligence Artificielle",
        title: "L'IA au service des résultats, pas de la mode.",
        subtitle:
          "Nous intégrons l'intelligence artificielle de façon pratique et mesurable : assistants, qualification automatique et solutions sur mesure pour votre entreprise.",
        intro:
          "L'intelligence artificielle n'est pas un mot à la mode chez Byte & Brain : c'est un outil pour résoudre des problèmes concrets. Nous construisons des assistants qui répondent aux clients, des systèmes qui qualifient les leads automatiquement et des intégrations d'IA qui font gagner du temps et augmentent les conversions, toujours axés sur un retour réel.",
        benefits: [
          {
            title: "Un service toujours disponible",
            desc: "Les assistants d'IA répondent aux questions courantes à toute heure, sans faire attendre le client.",
          },
          {
            title: "Une qualification intelligente",
            desc: "L'IA identifie les leads les plus chauds pour que votre équipe se concentre là où il y a le plus d'opportunités.",
          },
          {
            title: "Passez à l'échelle sans augmenter les coûts",
            desc: "Faites plus avec la même équipe en déléguant les tâches cognitives à l'intelligence artificielle.",
          },
        ],
        deliverables: [
          {
            title: "Assistants et chatbots d'IA",
            desc: "Des agents entraînés sur votre entreprise qui répondent, orientent et captent des contacts.",
          },
          {
            title: "Qualification automatique des leads",
            desc: "Des systèmes qui analysent et classent les leads selon leur potentiel de conversion.",
          },
          {
            title: "Intégrations sur mesure",
            desc: "Connexion de l'IA à vos outils et processus, adaptée à votre cas concret.",
          },
          {
            title: "Génération de contenu assistée",
            desc: "Des flux d'IA pour accélérer la production de contenu avec qualité et consistance.",
          },
        ],
        faqs: [
          {
            q: "L'IA a-t-elle du sens pour une PME ?",
            a: "Oui. Les PME sont souvent celles qui en profitent le plus : avec de petites équipes, déléguer les tâches répétitives et de service à l'IA permet de rivaliser avec de plus grandes entreprises sans augmenter les coûts de structure.",
          },
          {
            q: "Mes données sont-elles en sécurité ?",
            a: "La sécurité et la confidentialité des données sont une priorité. Nous concevons les solutions avec les bonnes pratiques de protection des données et choisissons des fournisseurs et configurations qui respectent la confidentialité de votre entreprise.",
          },
          {
            q: "Par où commence-t-on à utiliser l'IA dans l'entreprise ?",
            a: "Nous commençons par identifier un problème concret au retour clair — par exemple répondre aux questions fréquentes ou qualifier les leads — et mettons en place une solution ciblée sur ce point, pour prouver la valeur avant de passer à l'échelle.",
          },
        ],
      },
    },
  },
  {
    slug: "analytics",
    iconKey: "BarChart3",
    order: 7,
    keywords: [
      "analytics",
      "web analytics",
      "análise de dados",
      "dashboards",
      "medição de conversões",
    ],
    content: {
      pt: {
        metaTitle: "Analytics — Decisões Baseadas em Dados Reais",
        metaDescription:
          "Medição fiável de tudo o que importa, com dashboards que transformam dados em decisões. Saiba o que funciona e onde investir.",
        eyebrow: "Analytics",
        title: "Decida com dados, não com adivinhação.",
        subtitle:
          "Medimos tudo o que importa e transformamos os números em dashboards claros, para saber exatamente o que funciona e onde investir.",
        intro:
          "Analytics é a base de qualquer decisão de marketing inteligente. Implementamos medição fiável de tráfego, conversões e comportamento, e construímos dashboards que traduzem os dados em respostas claras: o que gera resultados, o que não gera, e para onde direcionar o próximo investimento.",
        benefits: [
          {
            title: "Fim da adivinhação",
            desc: "Saiba com certeza que canais e páginas geram clientes — e quais estão apenas a gastar recursos.",
          },
          {
            title: "Otimização contínua",
            desc: "Com dados fiáveis, cada decisão melhora a anterior e o retorno cresce ao longo do tempo.",
          },
          {
            title: "Visão clara do funil",
            desc: "Perceba onde os visitantes desistem e onde há oportunidade de aumentar conversões.",
          },
        ],
        deliverables: [
          {
            title: "Implementação de medição",
            desc: "Configuração correta de analytics e eventos de conversão, sem lacunas nem dados duplicados.",
          },
          {
            title: "Dashboards à medida",
            desc: "Painéis claros com as métricas que realmente importam para o seu negócio.",
          },
          {
            title: "Acompanhamento de conversões",
            desc: "Medição de leads, vendas e outros objetivos para calcular o retorno real.",
          },
          {
            title: "Relatórios e insights",
            desc: "Leitura dos dados em recomendações concretas de otimização.",
          },
        ],
        faqs: [
          {
            q: "Que métricas devo acompanhar no meu negócio?",
            a: "Depende dos seus objetivos, mas normalmente as que mais importam são as ligadas a resultados: leads geradas, custo por lead, taxa de conversão e origem do tráfego que converte. Ajudamos a definir e a medir as certas para o seu caso.",
          },
          {
            q: "A medição respeita a privacidade e o RGPD?",
            a: "Sim. Implementamos analytics com respeito pela privacidade dos utilizadores e em conformidade com o RGPD, incluindo consentimento de cookies quando aplicável.",
          },
          {
            q: "Já tenho Google Analytics. Preciso de mais?",
            a: "Ter a ferramenta instalada não é o mesmo que medir bem. Muitas configurações têm eventos em falta ou dados incorretos. Auditamos o que tem, corrigimos as lacunas e transformamos os dados em dashboards úteis para decidir.",
          },
        ],
      },
      en: {
        metaTitle: "Analytics — Decisions Based on Real Data",
        metaDescription:
          "Reliable measurement of everything that matters, with dashboards that turn data into decisions. Know what works and where to invest.",
        eyebrow: "Analytics",
        title: "Decide with data, not guesswork.",
        subtitle:
          "We measure everything that matters and turn the numbers into clear dashboards, so you know exactly what works and where to invest.",
        intro:
          "Analytics is the base of any smart marketing decision. We implement reliable measurement of traffic, conversions and behavior, and build dashboards that translate data into clear answers: what drives results, what doesn't, and where to direct the next investment.",
        benefits: [
          {
            title: "End of guesswork",
            desc: "Know for sure which channels and pages generate customers — and which just spend resources.",
          },
          {
            title: "Continuous optimization",
            desc: "With reliable data, each decision improves on the last and return grows over time.",
          },
          {
            title: "Clear view of the funnel",
            desc: "See where visitors drop off and where there's opportunity to raise conversions.",
          },
        ],
        deliverables: [
          {
            title: "Measurement implementation",
            desc: "Correct setup of analytics and conversion events, with no gaps or duplicate data.",
          },
          {
            title: "Custom dashboards",
            desc: "Clear panels with the metrics that truly matter to your business.",
          },
          {
            title: "Conversion tracking",
            desc: "Measuring leads, sales and other goals to calculate real return.",
          },
          {
            title: "Reports and insights",
            desc: "Reading the data into concrete optimization recommendations.",
          },
        ],
        faqs: [
          {
            q: "Which metrics should I track in my business?",
            a: "It depends on your goals, but usually the ones that matter most are tied to results: leads generated, cost per lead, conversion rate and the source of converting traffic. We help define and measure the right ones for your case.",
          },
          {
            q: "Does measurement respect privacy and GDPR?",
            a: "Yes. We implement analytics respecting user privacy and in compliance with GDPR, including cookie consent where applicable.",
          },
          {
            q: "I already have Google Analytics. Do I need more?",
            a: "Having the tool installed isn't the same as measuring well. Many setups have missing events or incorrect data. We audit what you have, fix the gaps and turn data into dashboards useful for decisions.",
          },
        ],
      },
      es: {
        metaTitle: "Analytics — Decisiones Basadas en Datos Reales",
        metaDescription:
          "Medición fiable de todo lo que importa, con dashboards que transforman los datos en decisiones. Sepa qué funciona y dónde invertir.",
        eyebrow: "Analytics",
        title: "Decida con datos, no con suposiciones.",
        subtitle:
          "Medimos todo lo que importa y transformamos los números en dashboards claros, para que sepa exactamente qué funciona y dónde invertir.",
        intro:
          "Analytics es la base de cualquier decisión de marketing inteligente. Implementamos una medición fiable de tráfico, conversiones y comportamiento, y construimos dashboards que traducen los datos en respuestas claras: qué genera resultados, qué no, y hacia dónde dirigir la próxima inversión.",
        benefits: [
          {
            title: "Fin de las suposiciones",
            desc: "Sepa con certeza qué canales y páginas generan clientes, y cuáles solo consumen recursos.",
          },
          {
            title: "Optimización continua",
            desc: "Con datos fiables, cada decisión mejora la anterior y el retorno crece con el tiempo.",
          },
          {
            title: "Visión clara del embudo",
            desc: "Comprenda dónde abandonan los visitantes y dónde hay oportunidad de aumentar las conversiones.",
          },
        ],
        deliverables: [
          {
            title: "Implementación de medición",
            desc: "Configuración correcta de analytics y eventos de conversión, sin lagunas ni datos duplicados.",
          },
          {
            title: "Dashboards a medida",
            desc: "Paneles claros con las métricas que realmente importan para su negocio.",
          },
          {
            title: "Seguimiento de conversiones",
            desc: "Medición de leads, ventas y otros objetivos para calcular el retorno real.",
          },
          {
            title: "Informes e insights",
            desc: "Lectura de los datos en recomendaciones concretas de optimización.",
          },
        ],
        faqs: [
          {
            q: "¿Qué métricas debo seguir en mi negocio?",
            a: "Depende de sus objetivos, pero normalmente las que más importan son las ligadas a resultados: leads generadas, coste por lead, tasa de conversión y origen del tráfico que convierte. Ayudamos a definir y medir las adecuadas para su caso.",
          },
          {
            q: "¿La medición respeta la privacidad y el RGPD?",
            a: "Sí. Implementamos analytics respetando la privacidad de los usuarios y en conformidad con el RGPD, incluyendo el consentimiento de cookies cuando corresponde.",
          },
          {
            q: "Ya tengo Google Analytics. ¿Necesito más?",
            a: "Tener la herramienta instalada no es lo mismo que medir bien. Muchas configuraciones tienen eventos ausentes o datos incorrectos. Auditamos lo que tiene, corregimos las lagunas y transformamos los datos en dashboards útiles para decidir.",
          },
        ],
      },
      fr: {
        metaTitle: "Analytics — Des Décisions Fondées sur des Données Réelles",
        metaDescription:
          "Une mesure fiable de tout ce qui compte, avec des dashboards qui transforment les données en décisions. Sachez ce qui fonctionne et où investir.",
        eyebrow: "Analytics",
        title: "Décidez avec des données, pas au hasard.",
        subtitle:
          "Nous mesurons tout ce qui compte et transformons les chiffres en dashboards clairs, pour que vous sachiez exactement ce qui fonctionne et où investir.",
        intro:
          "L'analytics est la base de toute décision marketing intelligente. Nous mettons en place une mesure fiable du trafic, des conversions et du comportement, et construisons des dashboards qui traduisent les données en réponses claires : ce qui génère des résultats, ce qui n'en génère pas, et où orienter le prochain investissement.",
        benefits: [
          {
            title: "Fini de deviner",
            desc: "Sachez avec certitude quels canaux et quelles pages génèrent des clients, et lesquels ne font que consommer des ressources.",
          },
          {
            title: "Optimisation continue",
            desc: "Avec des données fiables, chaque décision améliore la précédente et le retour croît avec le temps.",
          },
          {
            title: "Une vision claire du tunnel",
            desc: "Comprenez où les visiteurs abandonnent et où se trouve l'opportunité d'augmenter les conversions.",
          },
        ],
        deliverables: [
          {
            title: "Mise en place de la mesure",
            desc: "Configuration correcte de l'analytics et des événements de conversion, sans lacunes ni données dupliquées.",
          },
          {
            title: "Dashboards sur mesure",
            desc: "Des tableaux de bord clairs avec les métriques qui comptent vraiment pour votre entreprise.",
          },
          {
            title: "Suivi des conversions",
            desc: "Mesure des leads, des ventes et d'autres objectifs pour calculer le retour réel.",
          },
          {
            title: "Rapports et insights",
            desc: "Lecture des données en recommandations concrètes d'optimisation.",
          },
        ],
        faqs: [
          {
            q: "Quelles métriques dois-je suivre dans mon entreprise ?",
            a: "Cela dépend de vos objectifs, mais celles qui comptent le plus sont généralement liées aux résultats : leads générés, coût par lead, taux de conversion et origine du trafic qui convertit. Nous aidons à définir et à mesurer les bonnes pour votre cas.",
          },
          {
            q: "La mesure respecte-t-elle la vie privée et le RGPD ?",
            a: "Oui. Nous mettons en place l'analytics dans le respect de la vie privée des utilisateurs et en conformité avec le RGPD, y compris le consentement aux cookies le cas échéant.",
          },
          {
            q: "J'ai déjà Google Analytics. En ai-je besoin de plus ?",
            a: "Avoir l'outil installé n'est pas la même chose que bien mesurer. Beaucoup de configurations ont des événements manquants ou des données incorrectes. Nous auditons ce que vous avez, corrigeons les lacunes et transformons les données en dashboards utiles à la décision.",
          },
        ],
      },
    },
  },
  {
    slug: "maintenance",
    iconKey: "ShieldCheck",
    order: 8,
    keywords: [
      "manutenção de websites",
      "suporte web",
      "monitorização",
      "segurança web",
    ],
    content: {
      pt: {
        metaTitle: "Manutenção — O Seu Sistema Sempre Rápido e Seguro",
        metaDescription:
          "Monitorização, atualizações e melhoria contínua. Mantemos o seu website e sistema rápidos, seguros e sempre a funcionar.",
        eyebrow: "Manutenção",
        title: "Rápido, seguro e sempre a funcionar.",
        subtitle:
          "Um sistema de crescimento precisa de cuidado contínuo. Monitorizamos, atualizamos e melhoramos para o seu website nunca ficar para trás.",
        intro:
          "A manutenção garante que o investimento no seu website continua a dar retorno ao longo do tempo. Monitorizamos disponibilidade e performance, aplicamos atualizações de segurança, corrigimos problemas antes que afetem os clientes e melhoramos continuamente — para que o seu sistema esteja sempre no seu melhor.",
        benefits: [
          {
            title: "Tranquilidade total",
            desc: "Dorme descansado sabendo que alguém monitoriza e cuida do seu sistema todos os dias.",
          },
          {
            title: "Segurança em dia",
            desc: "Atualizações e boas práticas que protegem o site contra vulnerabilidades e ataques.",
          },
          {
            title: "Performance mantida",
            desc: "Garantimos que a velocidade e os Core Web Vitals se mantêm no verde ao longo do tempo.",
          },
        ],
        deliverables: [
          {
            title: "Monitorização 24/7",
            desc: "Vigilância de disponibilidade e performance, com alertas imediatos em caso de problema.",
          },
          {
            title: "Atualizações e backups",
            desc: "Atualizações de segurança regulares e cópias de segurança para dormir descansado.",
          },
          {
            title: "Correções e melhorias",
            desc: "Resolução rápida de problemas e melhorias contínuas com base em dados de utilização.",
          },
          {
            title: "Suporte prioritário",
            desc: "Um parceiro técnico disponível quando precisa, sem esperas nem incertezas.",
          },
        ],
        faqs: [
          {
            q: "Porque preciso de manutenção se o site já está feito?",
            a: "Um website é software vivo: a tecnologia atualiza-se, surgem vulnerabilidades de segurança e o desempenho pode degradar-se. A manutenção protege o seu investimento e garante que o site continua rápido, seguro e a converter.",
          },
          {
            q: "O que acontece se o site tiver um problema?",
            a: "Com monitorização ativa, muitas vezes detetamos e resolvemos o problema antes de o notar. Se surgir algo, o suporte prioritário garante uma resposta rápida para minimizar qualquer impacto no negócio.",
          },
          {
            q: "A manutenção é um custo fixo mensal?",
            a: "Trabalhamos normalmente em planos mensais adaptados às necessidades de cada sistema, para ter um custo previsível e a certeza de que está sempre acompanhado — sem surpresas.",
          },
        ],
      },
      en: {
        metaTitle: "Maintenance — Your System Always Fast and Secure",
        metaDescription:
          "Monitoring, updates and continuous improvement. We keep your website and system fast, secure and always running.",
        eyebrow: "Maintenance",
        title: "Fast, secure and always running.",
        subtitle:
          "A growth system needs continuous care. We monitor, update and improve so your website never falls behind.",
        intro:
          "Maintenance ensures the investment in your website keeps paying off over time. We monitor availability and performance, apply security updates, fix issues before they affect customers and continuously improve — so your system is always at its best.",
        benefits: [
          {
            title: "Complete peace of mind",
            desc: "Sleep easy knowing someone monitors and cares for your system every day.",
          },
          {
            title: "Security up to date",
            desc: "Updates and best practices that protect the site against vulnerabilities and attacks.",
          },
          {
            title: "Performance maintained",
            desc: "We ensure speed and Core Web Vitals stay green over time.",
          },
        ],
        deliverables: [
          {
            title: "24/7 monitoring",
            desc: "Availability and performance monitoring, with immediate alerts if something breaks.",
          },
          {
            title: "Updates and backups",
            desc: "Regular security updates and backups so you can rest easy.",
          },
          {
            title: "Fixes and improvements",
            desc: "Fast issue resolution and continuous improvements based on usage data.",
          },
          {
            title: "Priority support",
            desc: "A technical partner available when you need one, with no waiting or uncertainty.",
          },
        ],
        faqs: [
          {
            q: "Why do I need maintenance if the site is already built?",
            a: "A website is living software: technology updates, security vulnerabilities appear and performance can degrade. Maintenance protects your investment and keeps the site fast, secure and converting.",
          },
          {
            q: "What happens if the site has a problem?",
            a: "With active monitoring, we often detect and resolve issues before you notice. If something comes up, priority support ensures a fast response to minimize any impact on the business.",
          },
          {
            q: "Is maintenance a fixed monthly cost?",
            a: "We usually work in monthly plans adapted to each system's needs, so you have a predictable cost and the certainty of always being supported — with no surprises.",
          },
        ],
      },
      es: {
        metaTitle: "Mantenimiento — Su Sistema Siempre Rápido y Seguro",
        metaDescription:
          "Monitorización, actualizaciones y mejora continua. Mantenemos su sitio web y sistema rápidos, seguros y siempre en funcionamiento.",
        eyebrow: "Mantenimiento",
        title: "Rápido, seguro y siempre en funcionamiento.",
        subtitle:
          "Un sistema de crecimiento necesita cuidado continuo. Monitorizamos, actualizamos y mejoramos para que su sitio web nunca se quede atrás.",
        intro:
          "El mantenimiento garantiza que la inversión en su sitio web siga dando retorno a lo largo del tiempo. Monitorizamos disponibilidad y rendimiento, aplicamos actualizaciones de seguridad, corregimos problemas antes de que afecten a los clientes y mejoramos de forma continua, para que su sistema esté siempre en su mejor momento.",
        benefits: [
          {
            title: "Tranquilidad total",
            desc: "Duerma tranquilo sabiendo que alguien monitoriza y cuida su sistema todos los días.",
          },
          {
            title: "Seguridad al día",
            desc: "Actualizaciones y buenas prácticas que protegen el sitio contra vulnerabilidades y ataques.",
          },
          {
            title: "Rendimiento mantenido",
            desc: "Garantizamos que la velocidad y los Core Web Vitals se mantienen en verde a lo largo del tiempo.",
          },
        ],
        deliverables: [
          {
            title: "Monitorización 24/7",
            desc: "Vigilancia de disponibilidad y rendimiento, con alertas inmediatas en caso de problema.",
          },
          {
            title: "Actualizaciones y backups",
            desc: "Actualizaciones de seguridad regulares y copias de seguridad para dormir tranquilo.",
          },
          {
            title: "Correcciones y mejoras",
            desc: "Resolución rápida de problemas y mejoras continuas basadas en datos de uso.",
          },
          {
            title: "Soporte prioritario",
            desc: "Un socio técnico disponible cuando lo necesita, sin esperas ni incertidumbres.",
          },
        ],
        faqs: [
          {
            q: "¿Por qué necesito mantenimiento si el sitio ya está hecho?",
            a: "Un sitio web es software vivo: la tecnología se actualiza, surgen vulnerabilidades de seguridad y el rendimiento puede degradarse. El mantenimiento protege su inversión y garantiza que el sitio siga rápido, seguro y convirtiendo.",
          },
          {
            q: "¿Qué ocurre si el sitio tiene un problema?",
            a: "Con monitorización activa, muchas veces detectamos y resolvemos el problema antes de que lo note. Si surge algo, el soporte prioritario garantiza una respuesta rápida para minimizar cualquier impacto en el negocio.",
          },
          {
            q: "¿El mantenimiento es un coste fijo mensual?",
            a: "Solemos trabajar con planes mensuales adaptados a las necesidades de cada sistema, para que tenga un coste previsible y la certeza de estar siempre acompañado, sin sorpresas.",
          },
        ],
      },
      fr: {
        metaTitle: "Maintenance — Votre Système Toujours Rapide et Sécurisé",
        metaDescription:
          "Monitoring, mises à jour et amélioration continue. Nous gardons votre site web et votre système rapides, sécurisés et toujours opérationnels.",
        eyebrow: "Maintenance",
        title: "Rapide, sécurisé et toujours opérationnel.",
        subtitle:
          "Un système de croissance a besoin d'un soin continu. Nous surveillons, mettons à jour et améliorons pour que votre site web ne prenne jamais de retard.",
        intro:
          "La maintenance garantit que l'investissement dans votre site web continue de porter ses fruits dans le temps. Nous surveillons la disponibilité et les performances, appliquons les mises à jour de sécurité, corrigeons les problèmes avant qu'ils n'affectent les clients et améliorons en continu, pour que votre système soit toujours au meilleur de sa forme.",
        benefits: [
          {
            title: "Une tranquillité totale",
            desc: "Dormez sur vos deux oreilles en sachant que quelqu'un surveille et prend soin de votre système chaque jour.",
          },
          {
            title: "Une sécurité à jour",
            desc: "Des mises à jour et des bonnes pratiques qui protègent le site contre les vulnérabilités et les attaques.",
          },
          {
            title: "Des performances maintenues",
            desc: "Nous garantissons que la vitesse et les Core Web Vitals restent au vert dans le temps.",
          },
        ],
        deliverables: [
          {
            title: "Monitoring 24/7",
            desc: "Surveillance de la disponibilité et des performances, avec des alertes immédiates en cas de problème.",
          },
          {
            title: "Mises à jour et sauvegardes",
            desc: "Mises à jour de sécurité régulières et sauvegardes pour dormir tranquille.",
          },
          {
            title: "Corrections et améliorations",
            desc: "Résolution rapide des problèmes et améliorations continues basées sur les données d'utilisation.",
          },
          {
            title: "Support prioritaire",
            desc: "Un partenaire technique disponible quand vous en avez besoin, sans attente ni incertitude.",
          },
        ],
        faqs: [
          {
            q: "Pourquoi ai-je besoin de maintenance si le site est déjà réalisé ?",
            a: "Un site web est un logiciel vivant : la technologie évolue, des vulnérabilités de sécurité apparaissent et les performances peuvent se dégrader. La maintenance protège votre investissement et garantit que le site reste rapide, sécurisé et convertissant.",
          },
          {
            q: "Que se passe-t-il si le site a un problème ?",
            a: "Avec un monitoring actif, nous détectons et résolvons souvent le problème avant que vous ne le remarquiez. Si quelque chose survient, le support prioritaire garantit une réponse rapide pour minimiser tout impact sur l'entreprise.",
          },
          {
            q: "La maintenance est-elle un coût mensuel fixe ?",
            a: "Nous travaillons généralement en formules mensuelles adaptées aux besoins de chaque système, pour que vous ayez un coût prévisible et la certitude d'être toujours accompagné, sans surprises.",
          },
        ],
      },
    },
  },
  {
    slug: "consulting",
    iconKey: "Compass",
    order: 9,
    keywords: [
      "consultoria digital",
      "estratégia digital",
      "consultoria de crescimento",
      "transformação digital",
    ],
    content: {
      pt: {
        metaTitle: "Consultoria — Estratégia Digital de Raiz",
        metaDescription:
          "Estratégia digital de raiz: onde crescer, como crescer e que sistema construir para lá chegar. Um plano claro e orientado a resultados.",
        eyebrow: "Consultoria",
        title: "Um plano claro para crescer online.",
        subtitle:
          "Antes de construir, é preciso saber o quê e porquê. Desenhamos a estratégia digital que define onde crescer e que sistema o leva lá.",
        intro:
          "A consultoria estratégica é o ponto de partida de qualquer crescimento sustentável. Analisamos o seu negócio, mercado e concorrência, identificamos as maiores oportunidades e desenhamos um roteiro digital claro — que peças construir, por que ordem e com que objetivos mensuráveis — para não investir a adivinhar.",
        benefits: [
          {
            title: "Clareza antes do investimento",
            desc: "Saiba exatamente onde está a oportunidade antes de gastar tempo e dinheiro a construir.",
          },
          {
            title: "Prioridades certas",
            desc: "Foco no que gera mais retorno primeiro, em vez de dispersar recursos por todas as frentes.",
          },
          {
            title: "Roteiro acionável",
            desc: "Um plano concreto com passos, prazos e métricas — não um relatório que fica na gaveta.",
          },
        ],
        deliverables: [
          {
            title: "Diagnóstico digital",
            desc: "Auditoria da sua presença atual, mercado e concorrência para identificar oportunidades.",
          },
          {
            title: "Estratégia e roteiro",
            desc: "Plano priorizado das peças a construir, por ordem e com objetivos mensuráveis.",
          },
          {
            title: "Definição de objetivos e KPIs",
            desc: "Metas claras e indicadores para medir o progresso e o retorno de forma objetiva.",
          },
          {
            title: "Acompanhamento estratégico",
            desc: "Apoio contínuo para ajustar a estratégia à medida que o negócio e o mercado evoluem.",
          },
        ],
        faqs: [
          {
            q: "Preciso de consultoria se já sei o que quero?",
            a: "Muitas vezes o que parece ser o problema não é a verdadeira oportunidade. A consultoria valida a sua intuição com dados e garante que investe no que realmente gera crescimento — evitando gastar em soluções que não movem o negócio.",
          },
          {
            q: "A consultoria obriga a contratar os outros serviços?",
            a: "Não. A estratégia é um serviço autónomo e o roteiro é seu, para executar como preferir. Se quiser, podemos construir o sistema; se não, fica com um plano claro para avançar por conta própria ou com quem entender.",
          },
          {
            q: "Como é o processo de consultoria?",
            a: "Começa com um diagnóstico do seu negócio, mercado e concorrência. A partir daí, desenhamos a estratégia e um roteiro priorizado com objetivos mensuráveis, que apresentamos e discutimos consigo para garantir alinhamento total.",
          },
        ],
      },
      en: {
        metaTitle: "Consulting — Digital Strategy From the Ground Up",
        metaDescription:
          "Digital strategy from the ground up: where to grow, how to grow and what system to build to get there. A clear, results-driven plan.",
        eyebrow: "Consulting",
        title: "A clear plan to grow online.",
        subtitle:
          "Before building, you need to know what and why. We design the digital strategy that defines where to grow and what system gets you there.",
        intro:
          "Strategic consulting is the starting point of any sustainable growth. We analyze your business, market and competition, identify the biggest opportunities and design a clear digital roadmap — which pieces to build, in what order and with what measurable goals — so you don't invest by guessing.",
        benefits: [
          {
            title: "Clarity before investment",
            desc: "Know exactly where the opportunity is before spending time and money building.",
          },
          {
            title: "The right priorities",
            desc: "Focus on what drives the most return first, instead of spreading resources everywhere.",
          },
          {
            title: "An actionable roadmap",
            desc: "A concrete plan with steps, timelines and metrics — not a report that sits in a drawer.",
          },
        ],
        deliverables: [
          {
            title: "Digital diagnosis",
            desc: "An audit of your current presence, market and competition to identify opportunities.",
          },
          {
            title: "Strategy and roadmap",
            desc: "A prioritized plan of the pieces to build, in order and with measurable goals.",
          },
          {
            title: "Goals and KPIs",
            desc: "Clear targets and indicators to measure progress and return objectively.",
          },
          {
            title: "Strategic support",
            desc: "Ongoing support to adjust the strategy as your business and market evolve.",
          },
        ],
        faqs: [
          {
            q: "Do I need consulting if I already know what I want?",
            a: "Often what seems to be the problem isn't the real opportunity. Consulting validates your intuition with data and ensures you invest in what truly drives growth — avoiding spending on solutions that don't move the business.",
          },
          {
            q: "Does consulting require hiring the other services?",
            a: "No. Strategy is a standalone service and the roadmap is yours to execute however you prefer. If you want, we can build the system; if not, you keep a clear plan to move forward on your own or with whoever you choose.",
          },
          {
            q: "What does the consulting process look like?",
            a: "It starts with a diagnosis of your business, market and competition. From there, we design the strategy and a prioritized roadmap with measurable goals, which we present and discuss with you to ensure full alignment.",
          },
        ],
      },
      es: {
        metaTitle: "Consultoría — Estrategia Digital Desde la Base",
        metaDescription:
          "Estrategia digital desde la base: dónde crecer, cómo crecer y qué sistema construir para llegar. Un plan claro y orientado a resultados.",
        eyebrow: "Consultoría",
        title: "Un plan claro para crecer online.",
        subtitle:
          "Antes de construir, hay que saber el qué y el porqué. Diseñamos la estrategia digital que define dónde crecer y qué sistema le lleva allí.",
        intro:
          "La consultoría estratégica es el punto de partida de cualquier crecimiento sostenible. Analizamos su negocio, mercado y competencia, identificamos las mayores oportunidades y diseñamos una hoja de ruta digital clara —qué piezas construir, en qué orden y con qué objetivos medibles— para que no invierta adivinando.",
        benefits: [
          {
            title: "Claridad antes de invertir",
            desc: "Sepa exactamente dónde está la oportunidad antes de gastar tiempo y dinero en construir.",
          },
          {
            title: "Las prioridades adecuadas",
            desc: "Foco en lo que genera más retorno primero, en vez de dispersar recursos en todos los frentes.",
          },
          {
            title: "Una hoja de ruta accionable",
            desc: "Un plan concreto con pasos, plazos y métricas, no un informe que se queda en un cajón.",
          },
        ],
        deliverables: [
          {
            title: "Diagnóstico digital",
            desc: "Auditoría de su presencia actual, mercado y competencia para identificar oportunidades.",
          },
          {
            title: "Estrategia y hoja de ruta",
            desc: "Un plan priorizado de las piezas a construir, en orden y con objetivos medibles.",
          },
          {
            title: "Definición de objetivos y KPIs",
            desc: "Metas claras e indicadores para medir el progreso y el retorno de forma objetiva.",
          },
          {
            title: "Acompañamiento estratégico",
            desc: "Apoyo continuo para ajustar la estrategia a medida que el negocio y el mercado evolucionan.",
          },
        ],
        faqs: [
          {
            q: "¿Necesito consultoría si ya sé lo que quiero?",
            a: "Muchas veces lo que parece ser el problema no es la verdadera oportunidad. La consultoría valida su intuición con datos y garantiza que invierta en lo que realmente genera crecimiento, evitando gastar en soluciones que no mueven el negocio.",
          },
          {
            q: "¿La consultoría obliga a contratar los demás servicios?",
            a: "No. La estrategia es un servicio autónomo y la hoja de ruta es suya, para ejecutarla como prefiera. Si quiere, podemos construir el sistema; si no, se queda con un plan claro para avanzar por su cuenta o con quien decida.",
          },
          {
            q: "¿Cómo es el proceso de consultoría?",
            a: "Comienza con un diagnóstico de su negocio, mercado y competencia. A partir de ahí, diseñamos la estrategia y una hoja de ruta priorizada con objetivos medibles, que presentamos y discutimos con usted para garantizar una alineación total.",
          },
        ],
      },
      fr: {
        metaTitle: "Conseil — Une Stratégie Digitale Dès la Base",
        metaDescription:
          "Une stratégie digitale dès la base : où croître, comment croître et quel système construire pour y arriver. Un plan clair et orienté résultats.",
        eyebrow: "Conseil",
        title: "Un plan clair pour croître en ligne.",
        subtitle:
          "Avant de construire, il faut savoir quoi et pourquoi. Nous concevons la stratégie digitale qui définit où croître et quel système vous y mène.",
        intro:
          "Le conseil stratégique est le point de départ de toute croissance durable. Nous analysons votre entreprise, votre marché et votre concurrence, identifions les plus grandes opportunités et concevons une feuille de route digitale claire — quelles pièces construire, dans quel ordre et avec quels objectifs mesurables — pour que vous n'investissiez pas au hasard.",
        benefits: [
          {
            title: "De la clarté avant d'investir",
            desc: "Sachez exactement où se trouve l'opportunité avant de dépenser temps et argent à construire.",
          },
          {
            title: "Les bonnes priorités",
            desc: "Se concentrer d'abord sur ce qui génère le plus de retour, plutôt que de disperser les ressources sur tous les fronts.",
          },
          {
            title: "Une feuille de route actionnable",
            desc: "Un plan concret avec étapes, échéances et métriques, pas un rapport qui reste dans un tiroir.",
          },
        ],
        deliverables: [
          {
            title: "Diagnostic digital",
            desc: "Un audit de votre présence actuelle, de votre marché et de votre concurrence pour identifier les opportunités.",
          },
          {
            title: "Stratégie et feuille de route",
            desc: "Un plan priorisé des pièces à construire, dans l'ordre et avec des objectifs mesurables.",
          },
          {
            title: "Définition des objectifs et KPIs",
            desc: "Des cibles claires et des indicateurs pour mesurer le progrès et le retour de façon objective.",
          },
          {
            title: "Accompagnement stratégique",
            desc: "Un soutien continu pour ajuster la stratégie à mesure que l'entreprise et le marché évoluent.",
          },
        ],
        faqs: [
          {
            q: "Ai-je besoin de conseil si je sais déjà ce que je veux ?",
            a: "Souvent, ce qui semble être le problème n'est pas la véritable opportunité. Le conseil valide votre intuition avec des données et garantit que vous investissez dans ce qui génère réellement de la croissance, en évitant de dépenser dans des solutions qui ne font pas avancer l'entreprise.",
          },
          {
            q: "Le conseil oblige-t-il à souscrire les autres services ?",
            a: "Non. La stratégie est un service autonome et la feuille de route vous appartient, à exécuter comme vous le préférez. Si vous le souhaitez, nous pouvons construire le système ; sinon, vous conservez un plan clair pour avancer par vos propres moyens ou avec qui vous voulez.",
          },
          {
            q: "Comment se déroule le processus de conseil ?",
            a: "Il commence par un diagnostic de votre entreprise, de votre marché et de votre concurrence. À partir de là, nous concevons la stratégie et une feuille de route priorisée avec des objectifs mesurables, que nous présentons et discutons avec vous pour garantir un alignement total.",
          },
        ],
      },
    },
  },
];

/**
 * Per-locale URL slugs. The object key is the canonical id (= English slug).
 * PT/ES get native slugs so PT users see /servicos/desenvolvimento-web.
 */
const localizedSlugs: Record<string, Record<Locale, string>> = {
  "website-development": {
    pt: "desenvolvimento-web",
    en: "website-development",
    es: "desarrollo-web",
    fr: "developpement-web",
  },
  seo: { pt: "seo", en: "seo", es: "seo", fr: "seo" },
  "ai-seo": { pt: "ai-seo", en: "ai-seo", es: "ai-seo", fr: "ai-seo" },
  "local-seo": {
    pt: "seo-local",
    en: "local-seo",
    es: "seo-local",
    fr: "seo-local",
  },
  automation: {
    pt: "automacao",
    en: "automation",
    es: "automatizacion",
    fr: "automatisation",
  },
  "artificial-intelligence": {
    pt: "inteligencia-artificial",
    en: "artificial-intelligence",
    es: "inteligencia-artificial",
    fr: "intelligence-artificielle",
  },
  analytics: {
    pt: "analytics",
    en: "analytics",
    es: "analytics",
    fr: "analytics",
  },
  maintenance: {
    pt: "manutencao",
    en: "maintenance",
    es: "mantenimiento",
    fr: "maintenance",
  },
  consulting: {
    pt: "consultoria",
    en: "consulting",
    es: "consultoria",
    fr: "conseil",
  },
};

/** The URL slug for a canonical service id in a given locale. */
export function slugFor(canonical: string, locale: Locale): string {
  return localizedSlugs[canonical]?.[locale] ?? canonical;
}

/** Resolve the canonical id from a localized slug seen in the URL. */
export function canonicalFromLocalizedSlug(
  slug: string,
  locale: Locale,
): string | undefined {
  const hit = Object.keys(localizedSlugs).find(
    (canonical) => localizedSlugs[canonical][locale] === slug,
  );
  return hit ?? (localizedSlugs[slug] ? slug : undefined);
}

/** { locale, slug } pairs for generateStaticParams (localized per locale). */
export function localizedServiceParams(locales: readonly Locale[]) {
  return locales.flatMap((locale) =>
    services.map((s) => ({ locale, slug: slugFor(s.slug, locale) })),
  );
}

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/** Content for a locale, falling back to EN then PT so no page is ever empty. */
export function getServiceContent(
  service: Service,
  locale: Locale,
): ServiceContent {
  return (
    service.content[locale] ??
    service.content.en ??
    (service.content.pt as ServiceContent)
  );
}

export const serviceSlugs = services.map((s) => s.slug);
