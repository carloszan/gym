'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  membershipType: string
  startDate: string
  createdAt: string
}

interface ApiResponse {
  students: Student[]
  hasMore: boolean
}

const PAGE_SIZE = 20

export default function ListaPage() {
  const { status } = useSession()
  const router = useRouter()

  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const [cursors, setCursors] = useState<string[]>([''])
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetchPage(cursors[currentPage])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, currentPage])

  async function fetchPage(cursor: string) {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ limit: String(PAGE_SIZE) })
      if (cursor) params.set('startAfter', cursor)
      const res = await fetch(`/api/students?${params}`)
      if (!res.ok) throw new Error('Erro ao carregar alunos')
      const data: ApiResponse = await res.json()
      setStudents(data.students)
      setHasMore(data.hasMore)
    } catch {
      setError('Não foi possível carregar a lista. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function goNext() {
    const nextCursor = students[students.length - 1].id
    setCursors(prev => [...prev, nextCursor])
    setCurrentPage(p => p + 1)
  }

  function goPrev() {
    setCursors(prev => prev.slice(0, -1))
    setCurrentPage(p => p - 1)
  }

  function formatDate(iso: string) {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('pt-BR')
  }

  if (status !== 'authenticated') return null

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Lista de Alunos</h1>
          <p className="text-gray-500 text-sm mt-1">Alunos cadastrados na academia</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Nenhum aluno cadastrado ainda.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
                  <tr>
                    <th className="px-4 py-3 text-left">Nome</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Telefone</th>
                    <th className="px-4 py-3 text-left">Plano</th>
                    <th className="px-4 py-3 text-left">Início</th>
                    <th className="px-4 py-3 text-left">Cadastrado em</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">{s.firstName} {s.lastName}</td>
                      <td className="px-4 py-3 text-gray-600">{s.email || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{s.phone || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{s.membershipType || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(s.startDate)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(s.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {students.map(s => (
                <div key={s.id} className="bg-white rounded-xl shadow p-4 space-y-2">
                  <p className="font-semibold text-gray-800">{s.firstName} {s.lastName}</p>
                  {s.email && <p className="text-sm text-gray-600">{s.email}</p>}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                    {s.phone && <span>{s.phone}</span>}
                    {s.membershipType && <span>{s.membershipType}</span>}
                    {s.startDate && <span>Início: {formatDate(s.startDate)}</span>}
                    <span>Cadastrado: {formatDate(s.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={goPrev}
                disabled={currentPage === 0}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-500">Página {currentPage + 1}</span>
              <button
                onClick={goNext}
                disabled={!hasMore}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Próximo →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
