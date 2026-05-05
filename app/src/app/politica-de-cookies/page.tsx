export default function PoliticaDeCookies() {
  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Política de Cookies</h1>
          <p className="text-gray-500 text-sm mt-1">SJN Academia</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-2">O que são cookies</h2>
            <p className="text-sm text-gray-600">
              Cookies são pequenos arquivos de texto armazenados no seu navegador quando você acessa um site.
              Eles permitem que o sistema reconheça seu dispositivo e mantenha informações entre sessões.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Cookies que utilizamos</h2>

            <p className="text-sm font-medium text-gray-700 mb-2">Essenciais</p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm text-gray-600 border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                    <th className="text-left px-3 py-2">Cookie</th>
                    <th className="text-left px-3 py-2">Finalidade</th>
                    <th className="text-left px-3 py-2">Duração</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">next-auth.session-token</td>
                    <td className="px-3 py-2">Manter sessão autenticada</td>
                    <td className="px-3 py-2">Sessão</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm font-medium text-gray-700 mb-2">Analíticos <span className="text-xs text-gray-400 font-normal">(em breve — Google Analytics)</span></p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-600 border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                    <th className="text-left px-3 py-2">Cookie</th>
                    <th className="text-left px-3 py-2">Finalidade</th>
                    <th className="text-left px-3 py-2">Duração</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">_ga</td>
                    <td className="px-3 py-2">Identificar usuários únicos</td>
                    <td className="px-3 py-2">2 anos</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">_ga_*</td>
                    <td className="px-3 py-2">Manter estado da sessão</td>
                    <td className="px-3 py-2">2 anos</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">_gid</td>
                    <td className="px-3 py-2">Distinguir usuários</td>
                    <td className="px-3 py-2">24 horas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-2">Google Analytics</h2>
            <p className="text-sm text-gray-600">
              Utilizaremos o Google Analytics para medir o uso do sistema de forma anonimizada.
              Os dados coletados são enviados ao Google e tratados conforme a{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Política de Privacidade do Google
              </a>.
              Nenhum dado pessoal identificável é transmitido.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-2">Como gerenciar cookies</h2>
            <p className="text-sm text-gray-600 mb-2">
              Você pode bloquear ou excluir cookies pelas configurações do seu navegador.
            </p>
            <p className="text-sm text-gray-600">
              Atenção: bloquear o cookie de sessão (<span className="font-mono text-xs">next-auth.session-token</span>) impedirá o login no sistema.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-2">Atualizações</h2>
            <p className="text-sm text-gray-600">
              Esta política pode ser atualizada conforme novas funcionalidades forem implementadas.
              Recomendamos revisá-la periodicamente.
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">Última atualização: maio de 2025</p>
      </div>
    </div>
  )
}
