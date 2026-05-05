import Link from 'next/link'

export default function About() {
  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Sobre o Sistema</h1>
          <p className="text-gray-500 text-sm mt-1">Sistema de gestão da Aquarius</p>
        </div>

        <p className="text-gray-600 mb-8">
          Este sistema foi desenvolvido para facilitar a gestão da Aquarius.
          Controle entradas, gerencie alunos e acompanhe relatórios de frequência em um só lugar.
        </p>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-5 flex gap-4 items-start">
            <span className="text-2xl">🏃</span>
            <div>
              <h2 className="font-semibold text-gray-800">Entrada de Alunos</h2>
              <p className="text-sm text-gray-500 mt-1">Registre a entrada dos alunos com código de acesso de forma rápida e segura.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5 flex gap-4 items-start">
            <span className="text-2xl">👥</span>
            <div>
              <h2 className="font-semibold text-gray-800">Gestão de Alunos</h2>
              <p className="text-sm text-gray-500 mt-1">Cadastre, edite e gerencie todos os alunos da academia em um só lugar.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5 flex gap-4 items-start">
            <span className="text-2xl">📊</span>
            <div>
              <h2 className="font-semibold text-gray-800">Relatórios</h2>
              <p className="text-sm text-gray-500 mt-1">Acompanhe o histórico de entradas com filtros por período.</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-6 text-center space-x-3">
          <Link href="/politica-de-privacidade" className="hover:text-gray-600 underline">
            Política de Privacidade
          </Link>
          <span>·</span>
          <Link href="/termos-de-uso" className="hover:text-gray-600 underline">
            Termos de Uso
          </Link>
          <span>·</span>
          <Link href="/politica-de-cookies" className="hover:text-gray-600 underline">
            Política de Cookies
          </Link>
        </p>
      </div>
    </div>
  )
}
