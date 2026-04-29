import Image from 'next/image'
import { useTranslations } from 'next-intl'
import GoldenRule from '@/components/ui/GoldenRule'

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <section className="min-h-[calc(100svh-5rem)] flex items-center hero-padding bg-ivory">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Text */}
        <div>
          <p className="section-eyebrow mb-5">{t('eyebrow')}</p>
          <h1 className="font-serif text-charcoal">
            <span className="block text-2xl md:text-3xl italic font-normal leading-tight text-charcoal/70">
              {t('headline')}
            </span>
            <span
              className="block font-serif italic text-gold tracking-tight mt-2"
              style={{ fontSize: 'clamp(3.75rem, 9vw, 7rem)', lineHeight: 0.92 }}
            >
              {t('headline_accent')}
            </span>
          </h1>
          <GoldenRule className="mt-6" />
          <p className="text-muted text-base leading-relaxed max-w-md mt-4 mb-8">
            {t('tagline')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#menu" className="btn-primary">{t('cta_menu')}</a>
            <a href="#reservation" className="btn-outline">{t('cta_reserve')}</a>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative h-72 md:h-80 lg:h-[460px] bg-sand overflow-hidden">
          <Image
            src="/hero.jpg"
            alt={t('image_alt')}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
          {/* Subtle gradient lift to seat type if image is light at the edge */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-charcoal/10 via-transparent to-transparent" />
        </div>
      </div>
    </section>
  )
}
