export type ContentFieldType =
  | "text"
  | "textarea"
  | "image"
  | "url"
  | "email"
  | "phone"
  | "color"
  | "number"

export type ContentField = {
  key: string          // ex: "hero.title"
  label: string        // ex: "Título Principal"
  type: ContentFieldType
  section: string      // ex: "Hero", "Contacto", "SEO"
  placeholder?: string
  required?: boolean
  hint?: string        // texto de ajuda
}

export type ContentSchema = ContentField[]

// Templates prontos para os tipos de website mais comuns
export const SCHEMA_TEMPLATES: Record<string, { label: string; fields: ContentSchema }> = {
  restaurant: {
    label: "Restaurante / Bar",
    fields: [
      { key: "hero.title",         label: "Título Principal",    type: "text",     section: "Hero",      placeholder: "Ex: Cave Lounge" },
      { key: "hero.subtitle",      label: "Subtítulo",           type: "text",     section: "Hero",      placeholder: "Ex: Bar & Cocktails em Lisboa" },
      { key: "hero.image",         label: "Imagem de Fundo",     type: "image",    section: "Hero" },
      { key: "about.title",        label: "Título Sobre Nós",    type: "text",     section: "Sobre Nós", placeholder: "Ex: A Nossa História" },
      { key: "about.text",         label: "Texto Sobre Nós",     type: "textarea", section: "Sobre Nós" },
      { key: "about.image",        label: "Imagem Sobre Nós",    type: "image",    section: "Sobre Nós" },
      { key: "menu.title",         label: "Título da Ementa",    type: "text",     section: "Ementa",    placeholder: "Ex: A Nossa Carta" },
      { key: "menu.description",   label: "Descrição da Ementa", type: "textarea", section: "Ementa" },
      { key: "contact.phone",         label: "Telefone / WhatsApp",  type: "phone",    section: "Contacto",  placeholder: "+351 900 000 000" },
      { key: "contact.email",         label: "Email",                type: "email",    section: "Contacto",  placeholder: "info@restaurante.pt" },
      { key: "contact.address",       label: "Morada",               type: "text",     section: "Contacto",  placeholder: "Rua Exemplo, 123, Lisboa" },
      { key: "contact.address_zip",   label: "Código Postal",        type: "text",     section: "Contacto",  placeholder: "4200-196 Porto" },
      { key: "contact.hours_weekday", label: "Horário (Seg–Qui)",    type: "text",     section: "Contacto",  placeholder: "Dom–Qui: 07h–22h" },
      { key: "contact.hours_weekend", label: "Horário (Sex–Sáb)",    type: "text",     section: "Contacto",  placeholder: "Sex–Sáb: 07h–00h" },
      { key: "contact.amenities",     label: "Comodidades",          type: "text",     section: "Contacto",  placeholder: "Wi-Fi grátis · Esplanada · Vegetariano" },
      { key: "contact.whatsapp_msg",  label: "Mensagem WhatsApp",    type: "text",     section: "Contacto",  placeholder: "Olá! Gostaria de fazer uma reserva." },
      { key: "seo.title",          label: "Título SEO",          type: "text",     section: "SEO",       hint: "Ideal entre 50-60 caracteres" },
      { key: "seo.description",    label: "Descrição SEO",       type: "textarea", section: "SEO",       hint: "Ideal entre 140-160 caracteres" },
    ],
  },
  cleaning: {
    label: "Serviços de Limpeza",
    fields: [
      { key: "hero.title",         label: "Título Principal",    type: "text",     section: "Hero" },
      { key: "hero.subtitle",      label: "Subtítulo",           type: "text",     section: "Hero" },
      { key: "hero.image",         label: "Imagem Hero",         type: "image",    section: "Hero" },
      { key: "about.title",        label: "Título Sobre Nós",    type: "text",     section: "Sobre Nós" },
      { key: "about.text",         label: "Texto Sobre Nós",     type: "textarea", section: "Sobre Nós" },
      { key: "services.title",     label: "Título Serviços",     type: "text",     section: "Serviços" },
      { key: "services.subtitle",  label: "Subtítulo Serviços",  type: "text",     section: "Serviços" },
      { key: "pricing.title",      label: "Título Preços",       type: "text",     section: "Preços" },
      { key: "contact.phone",      label: "Telefone",            type: "phone",    section: "Contacto" },
      { key: "contact.email",      label: "Email",               type: "email",    section: "Contacto" },
      { key: "contact.address",    label: "Morada",              type: "text",     section: "Contacto" },
      { key: "seo.title",          label: "Título SEO",          type: "text",     section: "SEO" },
      { key: "seo.description",    label: "Descrição SEO",       type: "textarea", section: "SEO" },
    ],
  },
  landing: {
    label: "Landing Page Genérica",
    fields: [
      { key: "hero.title",         label: "Título Principal",    type: "text",     section: "Hero" },
      { key: "hero.subtitle",      label: "Subtítulo",           type: "text",     section: "Hero" },
      { key: "hero.cta",           label: "Texto do Botão CTA",  type: "text",     section: "Hero",    placeholder: "Ex: Saber Mais" },
      { key: "hero.image",         label: "Imagem Hero",         type: "image",    section: "Hero" },
      { key: "about.title",        label: "Título Sobre",        type: "text",     section: "Sobre" },
      { key: "about.text",         label: "Texto Sobre",         type: "textarea", section: "Sobre" },
      { key: "contact.phone",      label: "Telefone",            type: "phone",    section: "Contacto" },
      { key: "contact.email",      label: "Email",               type: "email",    section: "Contacto" },
      { key: "seo.title",          label: "Título SEO",          type: "text",     section: "SEO" },
      { key: "seo.description",    label: "Descrição SEO",       type: "textarea", section: "SEO" },
    ],
  },
}

export const FIELD_TYPES: { value: ContentFieldType; label: string }[] = [
  { value: "text",     label: "Texto curto" },
  { value: "textarea", label: "Texto longo" },
  { value: "image",    label: "Imagem" },
  { value: "url",      label: "URL / Link" },
  { value: "email",    label: "Email" },
  { value: "phone",    label: "Telefone" },
  { value: "color",    label: "Cor" },
  { value: "number",   label: "Número" },
]

// Agrupar campos por secção
export function groupBySection(fields: ContentSchema): Record<string, ContentField[]> {
  return fields.reduce((acc, field) => {
    if (!acc[field.section]) acc[field.section] = []
    acc[field.section].push(field)
    return acc
  }, {} as Record<string, ContentField[]>)
}
