'use server'

import { getSupabaseAdmin } from '@/lib/supabase'
import { isAdminSession } from '@/lib/auth'
import { sendCancellationEmail } from '@/lib/resend'

export async function updateReservationStatus(id: string, status: 'confirmed' | 'cancelled') {
  const authorized = await isAdminSession()
  if (!authorized) throw new Error('Unauthorized')

  const { data, error } = await getSupabaseAdmin()
    .from('reservations')
    .update({ status })
    .eq('id', id)
    .select('*, time_slots(start_time, end_time)')
    .single()

  if (error) throw new Error(error.message)

  if (status === 'cancelled') {
    sendCancellationEmail(data).catch(console.error)
  }

  return data
}
