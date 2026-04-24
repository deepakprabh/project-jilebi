import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function ImpressumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <main className="section-padding max-w-2xl mx-auto">
      {locale === 'en' && (
        <p className="text-xs text-muted mb-6 italic">
          This page is only available in German as required by German law (TMG § 5).
        </p>
      )}
      <h1 className="section-title mb-6">Impressum</h1>

      <p className="text-xs text-gold/80 mb-6 italic">
        Hinweis: Diese Seite ist Teil einer Portfolio-Demo. Die Kontaktdaten sind Platzhalter.
      </p>

      <section className="text-sm text-muted leading-relaxed space-y-4">
        <section>
          <h2 className="text-charcoal font-medium mb-1">Angaben gemäß § 5 TMG</h2>
          <p>Jilebi Restaurant<br />
          Marktstraße 8<br />
          72622 Nürtingen<br />
          Deutschland</p>
        </section>
        <section>
          <h2 className="text-charcoal font-medium mb-1">Kontakt</h2>
          <p>Telefon: +49 7022 904 030<br />
          E-Mail: info@jilebi.de</p>
        </section>
        <section>
          <h2 className="text-charcoal font-medium mb-1">Verantwortlich für den Inhalt</h2>
          <p>Deepak Prabhakaran<br />Marktstraße 8, 72622 Nürtingen</p>
        </section>
      </section>

      <Link href="/" className="inline-block mt-8 text-xs tracking-widest uppercase text-gold hover:text-charcoal transition-colors">
        ← Zurück
      </Link>
    </main>
  )
}
