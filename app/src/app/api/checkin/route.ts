import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code, studentId } = await req.json()

  let studentDocId: string
  let firstName: string
  let lastName: string
  let checkInToken: string | null = null

  if (studentId) {
    const doc = await adminDb.collection('students').doc(studentId).get()
    if (!doc.exists) {
      return NextResponse.json({ success: false, message: 'Aluno não encontrado.' })
    }
    studentDocId = doc.id
    ;({ firstName, lastName } = doc.data() as { firstName: string; lastName: string })
  } else if (code) {
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
    studentDocId = student.id
    ;({ firstName, lastName } = student.data() as { firstName: string; lastName: string })
    checkInToken = code
  } else {
    return NextResponse.json({ success: false, message: 'Requisição inválida.' }, { status: 400 })
  }

  await adminDb.collection('checkins').add({
    studentId: studentDocId,
    ...(checkInToken ? { checkInToken } : {}),
    firstName,
    lastName,
    checkedInAt: new Date().toISOString(),
    registeredBy: session.user?.email ?? null,
  })

  return NextResponse.json({ success: true, firstName, lastName })
}
