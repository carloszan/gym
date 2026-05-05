'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import StudentForm, { FormData } from '@/components/student-form'

export default function EditStudentPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { status } = useSession()

  const [initialData, setInitialData] = useState<Partial<FormData> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch(`/api/students/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Aluno não encontrado')
        return r.json()
      })
      .then(setInitialData)
      .catch(() => setError('Não foi possível carregar os dados do aluno.'))
  }, [status, id])

  if (status !== 'authenticated') return null

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow p-8 text-center space-y-4">
          <p className="text-red-600">{error}</p>
          <button onClick={() => router.push('/lista')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Voltar à lista
          </button>
        </div>
      </div>
    )
  }

  if (!initialData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    )
  }

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setIsSubmitting(false)
    router.push('/lista')
  }

  return <StudentForm mode="edit" initialData={initialData} isSubmitting={isSubmitting} onSubmit={handleSubmit} studentId={id} />
}
