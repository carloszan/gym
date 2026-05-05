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

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100)
  const startAfterId = searchParams.get('startAfter')

  let query = adminDb.collection('students').orderBy('createdAt', 'desc').limit(limit + 1)

  if (startAfterId) {
    const cursorDoc = await adminDb.collection('students').doc(startAfterId).get()
    if (cursorDoc.exists) query = query.startAfter(cursorDoc)
  }

  const snapshot = await query.get()
  const hasMore = snapshot.docs.length > limit
  const docs = hasMore ? snapshot.docs.slice(0, limit) : snapshot.docs
  const students = docs.map(doc => ({ id: doc.id, ...doc.data() }))

  return NextResponse.json({ students, hasMore })
}
