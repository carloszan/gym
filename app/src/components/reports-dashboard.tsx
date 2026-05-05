'use client'

import { useEffect, useState } from 'react'
import type { ReportData } from '@/app/api/reports/checkins/route'

function toDateInput(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('pt-BR')
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR')
}

export default function ReportsDashboard() {
  const today = new Date()
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [startDate, setStartDate] = useState(toDateInput(thirtyDaysAgo))
  const [endDate, setEndDate] = useState(toDateInput(today))
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchData() {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ startDate, endDate })
      const res = await fetch(`/api/reports/checkins?${params}`)
      if (!res.ok) throw new Error()
      setData(await res.json())
    } catch {
      setError('Não foi possível carregar os dados. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const maxDayCount = data?.stats.byDay.length
    ? Math.max(...data.stats.byDay.map(d => d.count))
    : 1

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Painel de Entradas</h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe as entradas dos alunos</p>
        </div>

        {/* Date filter */}
        <div className="flex flex-wrap gap-3 mb-6 items-end">
          <div>
            <label className="block text-xs text-gray-500 mb-1">De</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Até</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={fetchData}
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
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">Total de entradas</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{data.stats.total}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">Alunos únicos</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{data.stats.uniqueStudents}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4">
                <p className="text-sm text-gray-500">Dia mais movimentado</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {data.stats.mostActiveDay ? formatDate(data.stats.mostActiveDay) : '—'}
                </p>
              </div>
            </div>

            {/* Bar chart */}
            {data.stats.byDay.length > 0 && (
              <div className="bg-white rounded-xl shadow p-4 mb-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">Entradas por dia</h2>
                <div className="space-y-2">
                  {data.stats.byDay.map(({ date, count }) => (
                    <div key={date} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-20 shrink-0">{formatDate(date)}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${(count / maxDayCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-6 text-right shrink-0">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Check-ins table */}
            {data.checkins.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-sm">
                Nenhuma entrada no período selecionado.
              </div>
            ) : (
              <>
                <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wide">
                      <tr>
                        <th className="px-4 py-3 text-left">Nome</th>
                        <th className="px-4 py-3 text-left">Data/Hora</th>
                        <th className="px-4 py-3 text-left">Registrado por</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.checkins.map(c => (
                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-800">{c.firstName} {c.lastName}</td>
                          <td className="px-4 py-3 text-gray-600">{formatDateTime(c.checkedInAt)}</td>
                          <td className="px-4 py-3 text-gray-600">{c.registeredBy ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-3">
                  {data.checkins.map(c => (
                    <div key={c.id} className="bg-white rounded-xl shadow p-4 space-y-1">
                      <p className="font-semibold text-gray-800">{c.firstName} {c.lastName}</p>
                      <p className="text-sm text-gray-600">{formatDateTime(c.checkedInAt)}</p>
                      {c.registeredBy && <p className="text-xs text-gray-400">{c.registeredBy}</p>}
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
