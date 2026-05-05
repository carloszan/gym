'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import StudentForm, { FormData } from '@/components/student-form'

export default function StudentRegistrationPage() {
  const router = useRouter()
  const { status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  if (status !== 'authenticated') return null

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setIsSubmitting(false)
    if (res.ok) router.push('/')
  }

  return <StudentForm mode="create" isSubmitting={isSubmitting} onSubmit={handleSubmit} />
}
