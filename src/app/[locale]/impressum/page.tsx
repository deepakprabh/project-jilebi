import Link from 'next/link'

export default function ImpressumPage() {
  return (
    <main className="section-padding max-w-2xl mx-auto">
      <h1 className="font-serif text-3xl text-charcoal tracking-brand uppercase mb-6">Impressum</h1>

      <section className="text-sm text-muted leading-relaxed space-y-4">
        <div>
          <h2 className="text-charcoal font-medium mb-1">Angaben gemäß § 5 TMG</h2>
          <p>Jilebi Restaurant<br />
          Musterstraße 1<br />
          72622 Nürtingen<br />
          Deutschland</p>
        </div>
        <div>
          <h2 className="text-charcoal font-medium mb-1">Kontakt</h2>
          <p>Telefon: +49 7022 123 456<br />
          E-Mail: info@jilebi.de</p>
        </div>
        <div>
          <h2 className="text-charcoal font-medium mb-1">Verantwortlich für den Inhalt</h2>
          <p>[Ihr Name]<br />Musterstraße 1, 72622 Nürtingen</p>
        </div>
      </section>

      <Link href="/" className="inline-block mt-8 text-xs tracking-widest uppercase text-gold hover:text-charcoal transition-colors">
        ← Zurück
      </Link>
    </main>
  )
}
