import { NextRequest } from 'next/server'

const TRUSTED_ORIGIN_ENV = 'APP_ORIGIN'

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip')?.trim() ||
    'unknown'
  )
}

export function isSameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true

  const allowedOrigin = process.env[TRUSTED_ORIGIN_ENV] ?? req.nextUrl.origin
  return origin === allowedOrigin
}

export function isValidDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

export function getUtcDayOfWeek(dateOnly: string): number {
  const [year, month, day] = dateOnly.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay()
}

export function isWithinReservationWindow(dateOnly: string, now = new Date()): boolean {
  const [year, month, day] = dateOnly.split('-').map(Number)
  const requested = Date.UTC(year, month - 1, day)
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const min = today + 24 * 60 * 60 * 1000
  const max = today + 30 * 24 * 60 * 60 * 1000

  return requested >= min && requested <= max
}
