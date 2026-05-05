import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code } = await req.json()

  if (!/^\d{1,6}$/.test(code)) {
    return NextResponse.json({ success: false, message: 'Código inválido. Tente novamente.' })
  }

  const snapshot = await adminDb
    .collection('students')
    .where('checkInToken', '==', code)
    .limit(1)
    .get()

  if (snapshot.empty) {
    return NextResponse.json({ success: false, message: 'Código inválido. Tente novamente.' })
  }

  const student = snapshot.docs[0]
  const { firstName, lastName } = student.data()

  await adminDb.collection('checkins').add({
    studentId: student.id,
    checkInToken: code,
    firstName,
    lastName,
    checkedInAt: new Date().toISOString(),
    registeredBy: session.user?.email ?? null,
  })

  return NextResponse.json({ success: true, firstName, lastName })
}
