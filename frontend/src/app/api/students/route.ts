import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const ref = await adminDb.collection('students').add({
    ...data,
    createdAt: new Date().toISOString(),
  })

  return NextResponse.json({ id: ref.id }, { status: 201 })
}

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const snapshot = await adminDb.collection('students').orderBy('createdAt', 'desc').get()
  const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  return NextResponse.json(students)
}
