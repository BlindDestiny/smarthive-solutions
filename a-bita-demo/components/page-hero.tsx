export default function PageHero({
  eyebrow,
  title,
  script,
  description,
}: {
  eyebrow: string
  title: string
  script?: string
  description?: string
}) {
  return (
    <section className="pt-40 pb-20 bg-bita-forest text-bita-cream">
      <div className="container-bita">
        <div className="flex items-center gap-3 mb-6">
          <span className="cream-rule" />
          <span className="eyebrow-cream">{eyebrow}</span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05] italic max-w-4xl">
          {title}
          {script && <span className="block font-script not-italic text-bita-goldLight text-6xl md:text-8xl mt-2">{script}</span>}
        </h1>
        {description && (
          <p className="mt-8 text-bita-cream/75 text-lg leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
