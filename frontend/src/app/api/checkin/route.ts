import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { adminDb } from '@/lib/firebase-admin'

const TEST_CODE = '123456'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code } = await req.json()

  if (code !== TEST_CODE) {
    return NextResponse.json({ success: false, message: 'Código inválido. Tente novamente.' })
  }

  await adminDb.collection('checkins').add({
    code,
    checkedInAt: new Date().toISOString(),
    registeredBy: session.user?.email ?? null,
  })

  return NextResponse.json({ success: true, message: 'Acesso permitido! Bem-vindo à academia!' })
}
