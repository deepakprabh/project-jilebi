import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendConfirmationEmail } from '@/lib/resend'

const REQUIRED_FIELDS = ['name', 'email', 'phone', 'party_size', 'date', 'time_slot_id', 'language']

export async function POST(req: NextRequest) {
  const body = await req.json()

  const missing = REQUIRED_FIELDS.filter((f) => body[f] == null || body[f] === '')
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing fields: ${missing.join(', ')}` }, { status: 400 })
  }

  const { data, error } = await getSupabaseAdmin()
    .from('reservations')
    .insert({
      name: body.name,
      email: body.email,
      phone: body.phone,
      party_size: body.party_size,
      date: body.date,
      time_slot_id: body.time_slot_id,
      language: body.language,
      notes: body.notes ?? null,
      status: 'pending',
    })
    .select('*, time_slots(start_time, end_time)')

  if (error) {
    const isCapacity = error.message.includes('Slot capacity exceeded')
    return NextResponse.json(
      { error: isCapacity ? 'This time slot is fully booked' : error.message },
      { status: isCapacity ? 409 : 500 }
    )
  }

  const reservation = data[0]

  // Fire-and-forget confirmation email
  sendConfirmationEmail(reservation).catch(console.error)

  return NextResponse.json({ reservation }, { status: 201 })
}
