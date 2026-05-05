export default function TermosDeUso() {
  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Termos de Uso</h1>
          <p className="text-gray-500 text-sm mt-1">Aquarius</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-2">Aceitação dos Termos</h2>
            <p className="text-sm text-gray-600">
              Ao utilizar este sistema, você concorda com os presentes Termos de Uso.
              O uso do sistema é restrito a funcionários e operadores autorizados pela Aquarius.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-2">Uso Permitido</h2>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Cadastro e gestão de alunos da academia</li>
              <li>Registro de entradas via código de check-in</li>
              <li>Consulta de relatórios de frequência</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-2">Responsabilidades do Operador</h2>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Manter a confidencialidade das credenciais de acesso</li>
              <li>Inserir dados corretos e atualizados dos alunos</li>
              <li>Não compartilhar acesso com pessoas não autorizadas</li>
              <li>Reportar qualquer uso indevido à administração da academia</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-2">Dados dos Alunos</h2>
            <p className="text-sm text-gray-600">
              Os dados cadastrados pertencem à Aquarius e aos próprios alunos.
              Devem ser utilizados exclusivamente para fins de gestão interna da academia,
              em conformidade com a nossa{' '}
              <a href="/politica-de-privacidade" className="text-blue-600 hover:underline">
                Política de Privacidade
              </a>.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-2">Modificações</h2>
            <p className="text-sm text-gray-600">
              A Aquarius reserva-se o direito de alterar estes Termos de Uso a qualquer momento.
              O uso continuado do sistema após alterações implica a aceitação dos novos termos.
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">Última atualização: maio de 2025</p>
      </div>
    </div>
  )
}
