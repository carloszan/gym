import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { adminDb } from '@/lib/firebase-admin'

export interface InactiveStudent {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  membershipType: string
  startDate: string
  lastCheckInAt: string
  daysSinceLastCheckIn: number
}

export interface InactiveStudentsData {
  students: InactiveStudent[]
  minDays: number
}

const DEFAULT_MIN_DAYS = 14
const MS_PER_DAY = 24 * 60 * 60 * 1000

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const minDaysParam = parseInt(searchParams.get('minDays') ?? '')
  const minDays = Number.isFinite(minDaysParam) && minDaysParam >= 0 ? minDaysParam : DEFAULT_MIN_DAYS

  const [studentsSnapshot, checkinsSnapshot] = await Promise.all([
    adminDb.collection('students').get(),
    adminDb.collection('checkins').get(),
  ])

  const lastCheckInByStudent = new Map<string, string>()
  for (const doc of checkinsSnapshot.docs) {
    const d = doc.data()
    const studentId: string = d.studentId
    const checkedInAt: string = d.checkedInAt
    const current = lastCheckInByStudent.get(studentId)
    if (!current || checkedInAt > current) {
      lastCheckInByStudent.set(studentId, checkedInAt)
    }
  }

  const now = Date.now()

  const students: InactiveStudent[] = studentsSnapshot.docs
    .map(doc => {
      const lastCheckInAt = lastCheckInByStudent.get(doc.id)
      if (!lastCheckInAt) return null

      const daysSinceLastCheckIn = Math.floor((now - new Date(lastCheckInAt).getTime()) / MS_PER_DAY)
      if (daysSinceLastCheckIn < minDays) return null

      const d = doc.data()
      return {
        id: doc.id,
        firstName: d.firstName ?? '',
        lastName: d.lastName ?? '',
        phone: d.phone ?? '',
        email: d.email ?? '',
        membershipType: d.membershipType ?? '',
        startDate: d.startDate ?? '',
        lastCheckInAt,
        daysSinceLastCheckIn,
      }
    })
    .filter((s): s is InactiveStudent => s !== null)
    .sort((a, b) => b.daysSinceLastCheckIn - a.daysSinceLastCheckIn)

  const data: InactiveStudentsData = { students, minDays }

  return NextResponse.json(data)
}
