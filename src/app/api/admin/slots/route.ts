import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'
import { isAdminAuthorized } from '@/lib/auth'
import { isSameOrigin } from '@/lib/request-security'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function PATCH(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { id, is_blocked } = body as { id?: unknown; is_blocked?: unknown }
  if (typeof id !== 'string' || !UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }
  if (typeof is_blocked !== 'boolean') {
    return NextResponse.json({ error: 'is_blocked must be a boolean' }, { status: 400 })
  }

  const { data, error } = await getSupabaseAdmin()
    .from('time_slots')
    .update({ is_blocked })
    .eq('id', id)
    .select()

  if (error) {
    console.error('[admin slots] update failed:', error)
    return NextResponse.json({ error: 'Unable to update slot' }, { status: 500 })
  }
  if (!data[0]) {
    return NextResponse.json({ error: 'Slot not found' }, { status: 404 })
  }
  return NextResponse.json({ slot: data[0] })
}
