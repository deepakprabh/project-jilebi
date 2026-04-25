'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import Image from 'next/image'
import { galleryImages } from '@/data/gallery'
import GoldenRule from '@/components/ui/GoldenRule'
import Lightbox from '@/components/ui/Lightbox'

export default function Gallery() {
  const t = useTranslations('gallery')
  const locale = useLocale()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const prevIndexRef = useRef<number | null>(null)

  // Restore focus to the originating thumbnail when the lightbox closes
  useEffect(() => {
    if (prevIndexRef.current !== null && lightboxIndex === null) {
      buttonRefs.current[prevIndexRef.current]?.focus()
    }
    prevIndexRef.current = lightboxIndex
  }, [lightboxIndex])

  return (
    <section id="gallery" className="section-padding bg-ivory">
      <div className="max-w-7xl mx-auto">
        <p className="section-eyebrow mb-5">{t('label')}</p>
        <h2 className="section-title mb-3">{t('title')}</h2>
        <GoldenRule />

        <ul className="mt-12 columns-2 md:columns-3 gap-5">
          {galleryImages.map((img, i) => {
            const alt = locale === 'en' ? img.alt.en : img.alt.de
            return (
              <li key={img.src} className="break-inside-avoid mb-5">
                <button
                  ref={(el) => {
                    buttonRefs.current[i] = el
                  }}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={alt}
                  className="group block w-full overflow-hidden bg-sand"
                >
                  <span className="relative aspect-square block">
                    <Image
                      src={`/gallery/${img.src}`}
                      alt={alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 50vw"
                      className="object-cover transition-transform duration-[600ms] group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/15 group-focus-visible:bg-charcoal/15 transition-colors duration-300"
                    />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          src={galleryImages[lightboxIndex].src}
          alt={locale === 'en' ? galleryImages[lightboxIndex].alt.en : galleryImages[lightboxIndex].alt.de}
          onClose={() => setLightboxIndex(null)}
          onPrev={() =>
            setLightboxIndex(
              (lightboxIndex - 1 + galleryImages.length) % galleryImages.length,
            )
          }
          onNext={() =>
            setLightboxIndex((lightboxIndex + 1) % galleryImages.length)
          }
          prevLabel={t('prev')}
          nextLabel={t('next')}
          closeLabel={t('close')}
        />
      )}
    </section>
  )
}
