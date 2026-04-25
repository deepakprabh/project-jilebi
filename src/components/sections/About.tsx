import Image from 'next/image'
import { useTranslations } from 'next-intl'
import GoldenRule from '@/components/ui/GoldenRule'

export default function About() {
  const t = useTranslations('about')

  return (
    <section id="about" className="section-padding bg-ivory">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Atmosphere image */}
        <div className="relative h-80 lg:h-[460px] bg-sand overflow-hidden order-2 lg:order-1">
          <Image
            src="/about.jpg"
            alt={t('image_alt')}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* Text */}
        <div className="order-1 lg:order-2">
          <p className="section-eyebrow mb-5">{t('label')}</p>
          <h2 className="section-title mb-3">{t('title')}</h2>
          <GoldenRule />
          <p className="text-charcoal/75 text-base leading-[1.7] mt-5 max-w-prose">
            {t('body')}
          </p>
        </div>
      </div>
    </section>
  )
}
