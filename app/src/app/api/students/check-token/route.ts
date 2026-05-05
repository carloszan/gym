import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const excludeId = searchParams.get('excludeId')

  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })

  const snapshot = await adminDb.collection('students').where('checkInToken', '==', token).get()
  const unique = snapshot.empty || (!!excludeId && snapshot.docs.every(doc => doc.id === excludeId))

  return NextResponse.json({ unique })
}
