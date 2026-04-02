'use client'

import { useState } from 'react'
import StatusBadge from '@/components/ui/StatusBadge'

type Reservation = {
  id: string
  name: string
  email: string
  phone: string
  party_size: number
  date: string
  notes: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  time_slots: { start_time: string; end_time: string } | null
}

export default function ReservationTable({
  reservations: initial,
  password,
}: {
  reservations: Reservation[]
  password: string
}) {
  const [reservations, setReservations] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)

  async function updateStatus(id: string, status: 'confirmed' | 'cancelled') {
    setLoading(id)
    const res = await fetch('/api/admin/reservations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${password}` },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) {
      const { reservation } = await res.json()
      setReservations((prev) => prev.map((r) => (r.id === id ? reservation : r)))
    }
    setLoading(null)
  }

  // Group by date
  const grouped = reservations.reduce<Record<string, Reservation[]>>((acc, r) => {
    acc[r.date] = [...(acc[r.date] ?? []), r]
    return acc
  }, {})

  return (
    <div className="space-y-10">
      {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, group]) => (
          <div key={date}>
            <h2 className="text-sm font-medium text-charcoal mb-3 tracking-wide">
              {new Date(date).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h2>
            <div className="divide-y divide-sand border border-sand rounded-sm">
              {group.map((r) => (
                <div key={r.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-charcoal">{r.name}</span>
                      <StatusBadge status={r.status} />
                    </div>
                    <div className="text-xs text-muted mt-0.5">
                      {r.time_slots?.start_time} – {r.time_slots?.end_time} · {r.party_size} Pers. · {r.phone}
                    </div>
                    {r.notes && <div className="text-xs text-muted italic mt-0.5">"{r.notes}"</div>}
                  </div>
                  {r.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(r.id, 'confirmed')}
                        disabled={loading === r.id}
                        className="px-3 py-1.5 text-xs bg-green-600 text-white hover:bg-green-700 disabled:opacity-40"
                      >
                        Bestätigen
                      </button>
                      <button
                        onClick={() => updateStatus(r.id, 'cancelled')}
                        disabled={loading === r.id}
                        className="px-3 py-1.5 text-xs bg-red-600 text-white hover:bg-red-700 disabled:opacity-40"
                      >
                        Stornieren
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  )
}
