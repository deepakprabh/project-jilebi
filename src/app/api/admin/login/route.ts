import { NextRequest } from 'next/server'
import { loginAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  return loginAdmin(password)
}
