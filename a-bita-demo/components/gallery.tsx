const photos = [
  { src: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=900&q=80',  caption: 'Ovos rotos d’a Bita',     tilt: '-2' },
  { src: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=80',  caption: 'Cappuccino artesanal',        tilt: '3' },
  { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80', caption: 'Carrot cake premiado',       tilt: '-1' },
  { src: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=900&q=80', caption: 'Pão de massa-mãe',           tilt: '2' },
  { src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=900&q=80', caption: 'Panquecas de domingo',       tilt: '-3' },
  { src: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=900&q=80', caption: 'Açaí bowl colorido',         tilt: '1' },
  { src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80',  caption: 'Tigela de bom humor',         tilt: '2' },
  { src: 'https://images.unsplash.com/photo-1559054663-e8d23213f55c?auto=format&fit=crop&w=900&q=80',  caption: 'Chá d’a Bita',           tilt: '-2' },
]

export default function Gallery() {
  return (
    <section className="section bg-bita-surface overflow-hidden">
      <div className="container-bita">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="gold-rule" />
            <span className="eyebrow">Pequenos prazeres</span>
            <span className="gold-rule" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-bita-ink leading-tight italic">
            Espreite a nossa mesa
          </h2>
          <p className="font-script text-2xl text-bita-gold mt-3">
            antes de a ocupar
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {photos.map((p, i) => (
            <figure
              key={i}
              className="group relative"
              style={{ transform: `rotate(${p.tilt}deg)` }}
            >
              <div className="bg-bita-cream p-3 shadow-md group-hover:shadow-2xl transition-shadow duration-500">
                <div
                  className="aspect-square bg-cover bg-center"
                  style={{ backgroundImage: `url('${p.src}')` }}
                />
                <figcaption className="font-script text-xl text-bita-forest text-center mt-2">
                  {p.caption}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
