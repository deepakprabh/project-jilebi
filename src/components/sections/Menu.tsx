'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { menu, MenuCategory } from '@/data/menu'
import GoldenRule from '@/components/ui/GoldenRule'

export default function Menu() {
  const t = useTranslations('menu')
  const locale = useLocale()
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('starters')

  const categories: MenuCategory[] = ['starters', 'mains', 'desserts', 'drinks']

  return (
    <section id="menu" className="section-padding bg-ivory">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-gold mb-4">{t('label')}</p>
        <h2 className="section-title mb-2">{t('title')}</h2>
        <GoldenRule />

        {/* Category tabs */}
        <div className="flex gap-1 mt-8 mb-10 border-b border-sand">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-3 text-xs tracking-widest uppercase transition-colors ${
                activeCategory === cat
                  ? 'text-charcoal border-b-2 border-gold -mb-px'
                  : 'text-muted hover:text-charcoal'
              }`}
            >
              {t(`categories.${cat}`)}
            </button>
          ))}
        </div>

        {/* Menu items */}
        <div className="divide-y divide-sand">
          {menu[activeCategory].map((item) => (
            <div key={item.id} className="py-5 flex justify-between items-start gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-charcoal">
                    {locale === 'en' ? item.nameEN : item.nameDE}
                  </span>
                  {item.dietary === 'veg' && (
                    <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" title={t('veg')} />
                  )}
                  {item.dietary === 'spicy' && (
                    <span className="text-xs" title={t('spicy')}>🌶</span>
                  )}
                  {item.dietary === 'veg-spicy' && (
                    <>
                      <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" title={t('veg')} />
                      <span className="text-xs" title={t('spicy')}>🌶</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  {locale === 'en' ? item.descEN : item.descDE}
                </p>
              </div>
              <span className="text-sm font-medium text-charcoal flex-shrink-0">
                €{item.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
