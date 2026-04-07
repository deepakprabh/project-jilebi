import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { sendConfirmationEmail } from '@/lib/resend'
import { rateLimit } from '@/lib/rate-limit'

const REQUIRED_FIELDS = ['name', 'email', 'phone', 'party_size', 'date', 'time_slot_id', 'language']

export async function POST(req: NextRequest) {
  // Rate limit: 5 reservations per IP per minute
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { limited, remaining, resetAt } = rateLimit(ip, 5, 60_000)
  if (limited) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          'X-RateLimit-Remaining': '0',
        },
      }
    )
  }

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
