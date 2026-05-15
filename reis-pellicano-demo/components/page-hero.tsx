export default function PageHero({
  eyebrow,
  title,
  italic,
  description,
}: {
  eyebrow: string
  title: string
  italic?: string
  description?: string
}) {
  return (
    <section className="pt-40 pb-20 bg-rp-ink text-white">
      <div className="container-rp">
        <div className="flex items-center gap-3 mb-6">
          <span className="gold-rule" />
          <span className="eyebrow-dark">{eyebrow}</span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl leading-[1.05] max-w-4xl">
          {title}
          {italic && <span className="block italic text-rp-goldLight">{italic}</span>}
        </h1>
        {description && (
          <p className="mt-8 text-white/75 text-lg leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
