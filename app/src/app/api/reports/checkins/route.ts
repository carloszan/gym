import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { adminDb } from '@/lib/firebase-admin'

export interface CheckInRecord {
  id: string
  studentId: string
  firstName: string
  lastName: string
  checkedInAt: string
  registeredBy: string | null
}

export interface DayCount {
  date: string
  count: number
}

export interface ReportData {
  checkins: CheckInRecord[]
  stats: {
    total: number
    uniqueStudents: number
    byDay: DayCount[]
    mostActiveDay: string | null
  }
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const startDate = searchParams.get('startDate') ?? thirtyDaysAgo.toISOString().slice(0, 10)
  const endDate = searchParams.get('endDate') ?? now.toISOString().slice(0, 10)

  const startISO = `${startDate}T00:00:00.000Z`
  const endISO = `${endDate}T23:59:59.999Z`

  const snapshot = await adminDb
    .collection('checkins')
    .where('checkedInAt', '>=', startISO)
    .where('checkedInAt', '<=', endISO)
    .orderBy('checkedInAt', 'desc')
    .get()

  const checkins: CheckInRecord[] = snapshot.docs.map(doc => {
    const d = doc.data()
    return {
      id: doc.id,
      studentId: d.studentId,
      firstName: d.firstName,
      lastName: d.lastName,
      checkedInAt: d.checkedInAt,
      registeredBy: d.registeredBy ?? null,
    }
  })

  const uniqueStudents = new Set(checkins.map(c => c.studentId)).size

  const byDayMap: Record<string, number> = {}
  for (const c of checkins) {
    const date = c.checkedInAt.slice(0, 10)
    byDayMap[date] = (byDayMap[date] ?? 0) + 1
  }

  const byDay: DayCount[] = Object.entries(byDayMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const mostActiveDay = byDay.length > 0
    ? byDay.reduce((a, b) => (a.count >= b.count ? a : b)).date
    : null

  const data: ReportData = {
    checkins,
    stats: { total: checkins.length, uniqueStudents, byDay, mostActiveDay },
  }

  return NextResponse.json(data)
}
