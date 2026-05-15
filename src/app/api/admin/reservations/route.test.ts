/**
 * @jest-environment node
 */
import { PATCH } from './route'
import { NextRequest } from 'next/server'

const mockFrom = jest.fn()
const mockSendCancellationEmail = jest.fn()

jest.mock('@/lib/supabase', () => ({
  getSupabaseAdmin: () => ({ from: mockFrom }),
}))
jest.mock('@/lib/auth', () => ({
  isAdminAuthorized: () => true,
}))
jest.mock('@/lib/resend', () => ({
  sendCancellationEmail: (...args: unknown[]) => mockSendCancellationEmail(...args),
}))

describe('PATCH /api/admin/reservations', () => {
  beforeEach(() => {
    mockFrom.mockReset()
    mockSendCancellationEmail.mockReset()
  })

  it('awaits cancellation email delivery before returning the updated reservation', async () => {
    const reservation = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Maria Müller',
      email: 'maria@example.de',
      date: '2026-04-15',
      language: 'de',
      party_size: 2,
      status: 'cancelled',
      time_slots: { start_time: '18:00:00', end_time: '20:00:00' },
    }

    let resolveEmail: (() => void) | undefined
    mockSendCancellationEmail.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveEmail = resolve
        }),
    )

    mockFrom.mockReturnValueOnce({
      update: () => ({
        eq: () => ({
          select: () => Promise.resolve({ data: [reservation], error: null }),
        }),
      }),
    })

    const req = new NextRequest('http://localhost/api/admin/reservations', {
      method: 'PATCH',
      body: JSON.stringify({ id: reservation.id, status: 'cancelled' }),
    })

    let settled = false
    const responsePromise = PATCH(req).then((res) => {
      settled = true
      return res
    })

    await new Promise((resolve) => setImmediate(resolve))
    expect(mockSendCancellationEmail).toHaveBeenCalledWith(reservation)
    expect(settled).toBe(false)

    resolveEmail?.()
    const res = await responsePromise
    expect(res.status).toBe(200)
  })
})
