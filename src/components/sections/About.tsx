import { useTranslations } from 'next-intl'
import GoldenRule from '@/components/ui/GoldenRule'

export default function About() {
  const t = useTranslations('about')

  return (
    <section id="about" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Atmosphere image placeholder */}
        <div className="h-80 lg:h-[420px] bg-sand rounded-sm flex items-center justify-center order-2 lg:order-1">
          {/* Replace with: <Image src="/about.jpg" alt="Jilebi interior" fill className="object-cover rounded-sm" /> */}
          <p className="text-xs tracking-widest uppercase text-muted">Atmosphere photo</p>
        </div>

        {/* Text */}
        <div className="order-1 lg:order-2">
          <p className="text-xs tracking-widest uppercase text-gold mb-4">{t('label')}</p>
          <h2 className="section-title mb-2">{t('title')}</h2>
          <GoldenRule />
          <p className="text-muted text-sm leading-relaxed mt-4">{t('body')}</p>
        </div>
      </div>
    </section>
  )
}
