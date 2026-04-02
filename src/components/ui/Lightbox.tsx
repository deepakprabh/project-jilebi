'use client'

import { useEffect } from 'react'
import Image from 'next/image'

type Props = {
  src: string
  alt: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function Lightbox({ src, alt, onClose, onPrev, onNext }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext])

  return (
    <div
      className="fixed inset-0 z-50 bg-charcoal/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onPrev} className="absolute left-4 text-ivory text-3xl px-4 py-2" aria-label="Previous">‹</button>
      <div className="relative w-full max-w-3xl max-h-[80vh] mx-8" onClick={(e) => e.stopPropagation()}>
        <Image src={`/gallery/${src}`} alt={alt} width={900} height={600} className="object-contain w-full h-full" />
      </div>
      <button onClick={onNext} className="absolute right-4 text-ivory text-3xl px-4 py-2" aria-label="Next">›</button>
      <button onClick={onClose} className="absolute top-4 right-4 text-ivory text-2xl px-3 py-1" aria-label="Close">✕</button>
    </div>
  )
}
