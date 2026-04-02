'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { galleryImages } from '@/data/gallery'
import GoldenRule from '@/components/ui/GoldenRule'
import Lightbox from '@/components/ui/Lightbox'

export default function Gallery() {
  const t = useTranslations('gallery')
  const locale = useLocale()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  return (
    <section id="gallery" className="section-padding bg-ivory">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-gold mb-4">{t('label')}</p>
        <h2 className="section-title mb-2">{t('title')}</h2>
        <GoldenRule />

        <div className="mt-10 columns-2 md:columns-3 gap-4">
          {galleryImages.map((img, i) => (
            <div
              key={img.src}
              className="break-inside-avoid mb-4 cursor-pointer overflow-hidden rounded-sm group"
              onClick={() => setLightboxIndex(i)}
            >
              <div className="relative aspect-square bg-sand">
                <Image
                  src={`/gallery/${img.src}`}
                  alt={locale === 'en' ? img.alt.en : img.alt.de}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          src={galleryImages[lightboxIndex].src}
          alt={locale === 'en' ? galleryImages[lightboxIndex].alt.en : galleryImages[lightboxIndex].alt.de}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length)}
          onNext={() => setLightboxIndex((lightboxIndex + 1) % galleryImages.length)}
        />
      )}
    </section>
  )
}
