/**
 * @jest-environment node
 */
import { updateReservationStatus } from './actions'

const mockFrom = jest.fn()
const mockSendCancellationEmail = jest.fn()

jest.mock('@/lib/supabase', () => ({
  getSupabaseAdmin: () => ({ from: mockFrom }),
}))
jest.mock('@/lib/auth', () => ({
  isAdminSession: () => Promise.resolve(true),
}))
jest.mock('@/lib/resend', () => ({
  sendCancellationEmail: (...args: unknown[]) => mockSendCancellationEmail(...args),
}))

describe('updateReservationStatus', () => {
  beforeEach(() => {
    mockFrom.mockReset()
    mockSendCancellationEmail.mockReset()
  })

  it('awaits cancellation email delivery before resolving', async () => {
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
          select: () => ({
            single: () => Promise.resolve({ data: reservation, error: null }),
          }),
        }),
      }),
    })

    let settled = false
    const resultPromise = updateReservationStatus(reservation.id, 'cancelled').then((result) => {
      settled = true
      return result
    })

    await new Promise((resolve) => setImmediate(resolve))
    expect(mockSendCancellationEmail).toHaveBeenCalledWith(reservation)
    expect(settled).toBe(false)

    resolveEmail?.()
    await expect(resultPromise).resolves.toEqual(reservation)
  })
})
