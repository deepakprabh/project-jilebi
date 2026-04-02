import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminAuthorized } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, is_blocked } = await req.json()
  if (!id || is_blocked == null) {
    return NextResponse.json({ error: 'id and is_blocked required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('time_slots')
    .update({ is_blocked })
    .eq('id', id)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ slot: data[0] })
}
