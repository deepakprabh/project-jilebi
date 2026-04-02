'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { DayPicker } from 'react-day-picker'
import { format, addDays, startOfToday } from 'date-fns'
import { de, enGB } from 'date-fns/locale'
import 'react-day-picker/style.css'
import GoldenRule from '@/components/ui/GoldenRule'
import TimeSlotPicker, { Slot } from '@/components/ui/TimeSlotPicker'

type FormState = {
  name: string
  party_size: string
  email: string
  phone: string
  notes: string
}

export default function Reservation() {
  const t = useTranslations('reservation')
  const locale = useLocale()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [slots, setSlots] = useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({ name: '', party_size: '2', email: '', phone: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = startOfToday()
  const maxDate = addDays(today, 30)

  async function handleDateSelect(date: Date | undefined) {
    setSelectedDate(date)
    setSelectedSlotId(null)
    if (!date) return
    setLoadingSlots(true)
    try {
      const res = await fetch(`/api/availability?date=${format(date, 'yyyy-MM-dd')}`)
      const data = await res.json()
      setSlots(data.slots ?? [])
    } catch {
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDate || !selectedSlotId) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          party_size: parseInt(form.party_size, 10),
          date: format(selectedDate, 'yyyy-MM-dd'),
          time_slot_id: selectedSlotId,
          language: locale,
        }),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
    } catch {
      setError(t('error'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="reservation" className="section-padding bg-white">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs tracking-widest uppercase text-gold mb-4">{t('label')}</p>
        <h2 className="section-title mb-2">{t('title')}</h2>
        <GoldenRule />

        {success ? (
          <div className="mt-10 p-8 border border-gold max-w-lg">
            <h3 className="font-serif text-xl text-charcoal mb-2">{t('success_title')}</h3>
            <p className="text-sm text-muted">{t('success_body')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: date + slot */}
            <div>
              <p className="text-xs tracking-widest uppercase text-muted mb-4">{t('date_label')}</p>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={[{ before: addDays(today, 1) }, { after: maxDate }]}
                locale={locale === 'en' ? enGB : de}
              />

              {selectedDate && (
                <div className="mt-6">
                  <p className="text-xs tracking-widest uppercase text-muted mb-3">{t('slot_label')}</p>
                  {loadingSlots ? (
                    <p className="text-xs text-muted">...</p>
                  ) : slots.length === 0 ? (
                    <p className="text-xs text-muted">{t('no_slots')}</p>
                  ) : (
                    <TimeSlotPicker slots={slots} selected={selectedSlotId} onSelect={setSelectedSlotId} />
                  )}
                </div>
              )}
            </div>

            {/* Right: form */}
            <div className="flex flex-col gap-4">
              {[
                { key: 'name', type: 'text', required: true },
                { key: 'email', type: 'email', required: true },
                { key: 'phone', type: 'tel', required: true },
              ].map(({ key, type, required }) => (
                <input
                  key={key}
                  type={type}
                  required={required}
                  placeholder={t(`form.${key}`)}
                  value={form[key as keyof FormState]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="border-b border-sand bg-transparent pb-2 text-sm text-charcoal placeholder-muted focus:border-gold focus:outline-none transition-colors"
                />
              ))}

              <select
                value={form.party_size}
                onChange={(e) => setForm({ ...form, party_size: e.target.value })}
                className="border-b border-sand bg-transparent pb-2 text-sm text-charcoal focus:border-gold focus:outline-none transition-colors"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} {t('form.party_size')}</option>
                ))}
              </select>

              <textarea
                placeholder={t('form.notes')}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="border-b border-sand bg-transparent pb-2 text-sm text-charcoal placeholder-muted focus:border-gold focus:outline-none transition-colors resize-none"
              />

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={!selectedDate || !selectedSlotId || submitting}
                className="btn-primary mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? '...' : t('form.submit')}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
