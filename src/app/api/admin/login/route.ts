import { NextRequest, NextResponse } from 'next/server'
import { loginAdmin } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { getClientIp, isSameOrigin } from '@/lib/request-security'

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const ip = getClientIp(req)
  const { limited, resetAt } = rateLimit(`admin-login:${ip}`, 5, 15 * 60_000)
  if (limited) {
    return NextResponse.json(
      { error: 'Too many login attempts. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)) },
      }
    )
  }

  let password: unknown
  try {
    ;({ password } = await req.json())
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (typeof password !== 'string') {
    return NextResponse.json({ error: 'Invalid password' }, { status: 400 })
  }

  return loginAdmin(password)
}
