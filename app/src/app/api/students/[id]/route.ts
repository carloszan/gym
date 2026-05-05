import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const doc = await adminDb.collection('students').doc(id).get()
  if (!doc.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ id: doc.id, ...doc.data() })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const data = await req.json()
  await adminDb.collection('students').doc(id).update({
    ...data,
    updatedAt: new Date().toISOString(),
  })

  return NextResponse.json({ id })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await adminDb.collection('students').doc(id).delete()
  return NextResponse.json({ id })
}
