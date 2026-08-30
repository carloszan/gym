'use client'

import { useEffect, useState } from 'react'
import type { InactiveStudentsData } from '@/app/api/reports/inactive-students/route'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR')
}

const DEFAULT_MIN_DAYS = 14

export default function InactiveStudentsDashboard() {
  const [minDaysInput, setMinDaysInput] = useState(String(DEFAULT_MIN_DAYS))
  const [data, setData] = useState<InactiveStudentsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData(DEFAULT_MIN_DAYS)
  }, [])

  async function fetchData(minDays: number) {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ minDays: String(minDays) })
      const res = await fetch(`/api/reports/inactive-students?${params}`)
      if (!res.ok) throw new Error()
      setData(await res.json())
    } catch {
      setError('Não foi possível carregar os dados. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleFilter() {
    const parsed = parseInt(minDaysInput)
    fetchData(Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_MIN_DAYS)
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Alunos Inativos</h1>
          <p className="text-gray-500 text-sm mt-1">Alunos que pararam de frequentar a academia</p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-3 mb-6 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Dias sem check-in (mínimo)</label>
            <input
              type="number"
              min={0}
              value={minDaysInput}
              onChange={e => setMinDaysInput(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-40"
            />
          </div>
          <button
            onClick={handleFilter}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
          >
            Filtrar
          </button>
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
        ) : data && (
          <>
            {/* Summary card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">Alunos inativos</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{data.students.length}</p>
              </div>
            </div>

            {/* Table */}
            {data.students.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">
                Nenhum aluno inativo encontrado para esse período.
              </div>
            ) : (
              <>
                <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
                      <tr>
                        <th className="px-4 py-3 text-left">Nome</th>
                        <th className="px-4 py-3 text-left">Telefone</th>
                        <th className="px-4 py-3 text-left">Aluno desde</th>
                        <th className="px-4 py-3 text-left">Último check-in</th>
                        <th className="px-4 py-3 text-left">Dias sem vir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.students.map(s => (
                        <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-800">{s.firstName} {s.lastName}</td>
                          <td className="px-4 py-3 text-gray-600">{s.phone || '—'}</td>
                          <td className="px-4 py-3 text-gray-600">{s.startDate ? formatDate(s.startDate) : '—'}</td>
                          <td className="px-4 py-3 text-gray-600">{formatDate(s.lastCheckInAt)}</td>
                          <td className="px-4 py-3 text-gray-600">{s.daysSinceLastCheckIn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-3">
                  {data.students.map(s => (
                    <div key={s.id} className="bg-white rounded-xl shadow p-4 space-y-1">
                      <p className="font-semibold text-gray-800">{s.firstName} {s.lastName}</p>
                      {s.phone && <p className="text-sm text-gray-600">{s.phone}</p>}
                      {s.startDate && <p className="text-sm text-gray-600">Aluno desde: {formatDate(s.startDate)}</p>}
                      <p className="text-sm text-gray-600">Último check-in: {formatDate(s.lastCheckInAt)}</p>
                      <p className="text-xs text-gray-400">{s.daysSinceLastCheckIn} dias sem vir</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
