import { getSupabaseAdmin } from '@/lib/supabase'
import { isAdminSession } from '@/lib/auth'
import ReservationTable from '@/components/admin/ReservationTable'
import AdminLogin from '@/components/admin/AdminLogin'
import { updateReservationStatus } from './actions'

export default async function AdminPage() {
  const authorized = await isAdminSession()

  if (!authorized) {
    return (
      <main className="min-h-screen bg-ivory flex items-center justify-center">
        <AdminLogin />
      </main>
    )
  }

  const { data: reservations, error } = await getSupabaseAdmin()
    .from('reservations')
    .select('*, time_slots(start_time, end_time)')
    .order('date', { ascending: true })

  if (error) {
    return <main className="p-8 text-red-600">Fehler: {error.message}</main>
  }

  return (
    <main className="min-h-screen bg-ivory section-padding">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-charcoal tracking-brand uppercase">Jilebi Admin</h1>
          <span className="text-xs text-muted">{reservations?.length ?? 0} Reservierungen</span>
        </div>
        <ReservationTable reservations={reservations ?? []} updateStatus={updateReservationStatus} />
      </div>
    </main>
  )
}
