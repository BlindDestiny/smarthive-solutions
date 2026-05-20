import { type ContentSchema, groupBySection } from "@/lib/content-schema"

function PreviewImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  if (!src) return (
    <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}>
      <span className="text-gray-400 text-sm">Sem imagem</span>
    </div>
  )
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} className={`object-cover ${className}`} />
}

// Renderização específica da secção Hero
function HeroSection({ content }: { content: Record<string, string> }) {
  const image = content["hero.image"] || content["hero.bg"] || ""
  const title1 = content["hero.title1"] || content["hero.title"] || ""
  const title2 = content["hero.title2"] || ""
  const eyebrow = content["hero.eyebrow"] || content["hero.tag"] || ""
  const subtitle = content["hero.subtitle"] || content["hero.tagline"] || ""
  const cta1 = content["hero.cta_primary"] || content["hero.cta"] || "Saber Mais"
  const cta2 = content["hero.cta_secondary"] || ""
  const address = content["hero.address"] || ""
  const rating = content["hero.rating"] || ""

  return (
    <div className="relative overflow-hidden bg-gray-900 min-h-[420px] flex flex-col justify-end">
      {image && (
        <img src={image} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      )}
      <div className="relative z-10 p-10 pb-12 text-white">
        {eyebrow && (
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-medium mb-5">
            {eyebrow}
          </div>
        )}
        {rating && <div className="text-yellow-400 text-sm mb-3">★ {rating}</div>}
        <h1 className="text-4xl sm:text-5xl font-black leading-none tracking-tight mb-3">
          {title1}
          {title2 && <><br /><span className="text-sky-400">{title2}</span></>}
        </h1>
        {subtitle && (
          <p className="text-white/70 text-base max-w-lg mb-6">{subtitle}</p>
        )}
        {address && <p className="text-white/50 text-sm mb-5">{address}</p>}
        <div className="flex flex-wrap gap-3">
          {cta1 && (
            <span className="bg-white text-gray-900 font-semibold px-5 py-2.5 rounded-full text-sm cursor-default">
              {cta1}
            </span>
          )}
          {cta2 && (
            <span className="border border-white/40 text-white font-medium px-5 py-2.5 rounded-full text-sm cursor-default">
              {cta2}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Renderização de uma secção genérica
function GenericSection({ section, fields, content }: {
  section: string
  fields: ContentSchema
  content: Record<string, string>
}) {
  const imageFields = fields.filter((f) => f.type === "image")
  const textFields = fields.filter((f) => f.type !== "image")
  const mainImage = imageFields[0] ? content[imageFields[0].key] : ""

  return (
    <div className="px-8 py-10 border-b border-gray-100 last:border-0">
      <div className={`flex gap-10 ${mainImage ? "items-start" : ""}`}>
        {/* Conteúdo */}
        <div className="flex-1 space-y-4">
          <div className="inline-block text-xs font-bold text-sky-500 uppercase tracking-widest border border-sky-200 bg-sky-50 px-2.5 py-1 rounded">
            {section}
          </div>
          {textFields.map((field) => {
            const value = content[field.key]
            if (!value) return null

            // Detectar campos de "título" pelo nome
            const isTitle = /title|heading|name|nome/i.test(field.key)
            const isSubtitle = /subtitle|tagline|label/i.test(field.key)
            const isLong = field.type === "textarea"
            const isContact = /phone|email|address|morada|telefone|hours|hor/i.test(field.key)

            if (isContact) {
              return (
                <div key={field.key} className="flex items-start gap-2">
                  <span className="text-gray-400 text-xs mt-0.5 min-w-[80px]">{field.label}</span>
                  <span className="text-sm text-gray-700">{value}</span>
                </div>
              )
            }

            if (isTitle && !isSubtitle) {
              return <h2 key={field.key} className="text-2xl font-bold text-gray-900 leading-snug">{value}</h2>
            }

            if (isSubtitle) {
              return <p key={field.key} className="text-base text-gray-500 font-medium">{value}</p>
            }

            if (isLong) {
              return <p key={field.key} className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{value}</p>
            }

            return <p key={field.key} className="text-sm text-gray-700">{value}</p>
          })}

          {/* Outros campos de imagem além do primeiro */}
          {imageFields.slice(1).map((field) => (
            content[field.key] ? (
              <div key={field.key}>
                <p className="text-xs text-gray-400 mb-1">{field.label}</p>
                <PreviewImage src={content[field.key]} alt={field.label} className="h-24 w-40 rounded-lg" />
              </div>
            ) : null
          ))}
        </div>

        {/* Imagem principal */}
        {mainImage && (
          <PreviewImage
            src={mainImage}
            alt={section}
            className="w-64 h-48 rounded-xl shrink-0"
          />
        )}
      </div>
    </div>
  )
}

export default function PreviewRenderer({
  schema,
  content,
  tenantName,
}: {
  schema: ContentSchema
  content: Record<string, string>
  tenantName: string
}) {
  const sections = groupBySection(schema)
  const sectionNames = Object.keys(sections)

  const heroFields = sections["Hero"]
  const nonHeroSections = sectionNames.filter((s) => s !== "Hero")

  return (
    <div className="font-sans">
      {/* Navbar simulada */}
      <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between">
        <span className="font-bold text-gray-900">{tenantName}</span>
        <div className="flex gap-6 text-sm text-gray-500">
          {nonHeroSections.slice(0, 4).map((s) => (
            <span key={s} className="cursor-default hover:text-gray-900 transition-colors">{s}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      {heroFields && (
        <HeroSection content={content} />
      )}

      {/* Restantes secções */}
      {nonHeroSections.map((section) => {
        // SEO — não renderizar no preview visual
        if (section === "SEO") return null

        return (
          <GenericSection
            key={section}
            section={section}
            fields={sections[section]}
            content={content}
          />
        )
      })}

      {/* Footer simulado */}
      <div className="bg-gray-900 text-white px-8 py-8">
        <div className="flex items-center justify-between">
          <span className="font-bold">{tenantName}</span>
          <span className="text-gray-400 text-xs">Website por SmartHive Solutions</span>
        </div>
      </div>
    </div>
  )
}
