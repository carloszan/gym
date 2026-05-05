export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Política de Privacidade</h1>
          <p className="text-gray-500 text-sm mt-1">Aquarius</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-2">Introdução</h2>
            <p className="text-sm text-gray-600">
              A Aquarius é responsável pelo tratamento dos dados pessoais coletados por meio deste sistema.
              Esta política descreve quais dados coletamos, como os utilizamos e como protegemos suas informações,
              em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-2">Dados que coletamos</h2>
            <p className="text-sm text-gray-600 mb-3"><strong>Alunos:</strong></p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mb-3">
              <li>Dados de identificação: nome, CPF, RG, data de nascimento, gênero</li>
              <li>Contato: e-mail, telefone, endereço completo</li>
              <li>Emergência: nome, telefone e parentesco do contato de emergência</li>
              <li>Saúde: problemas de saúde, medicamentos em uso, alergias</li>
              <li>Matrícula: plano, forma de pagamento, data de início, mensalidade</li>
            </ul>
            <p className="text-sm text-gray-600 mb-1"><strong>Operadores (staff):</strong></p>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              <li>E-mail via autenticação Google (OAuth)</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-2">Como usamos os dados</h2>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Gestão de matrículas e cadastro de alunos</li>
              <li>Controle de acesso à academia via código de check-in</li>
              <li>Registro e relatórios de frequência</li>
              <li>Contato em situações de emergência</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-2">Armazenamento e segurança</h2>
            <p className="text-sm text-gray-600">
              Os dados são armazenados no Firebase Firestore (Google Cloud), com acesso restrito a operadores
              autenticados. Não compartilhamos dados com terceiros.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-2">Seus direitos (LGPD)</h2>
            <p className="text-sm text-gray-600 mb-2">Você tem direito a:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Confirmar a existência do tratamento dos seus dados</li>
              <li>Acessar, corrigir ou atualizar seus dados</li>
              <li>Solicitar a exclusão dos seus dados</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-2">Contato</h2>
            <p className="text-sm text-gray-600">
              Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato com a Aquarius diretamente na recepção ou pelos canais oficiais da academia.
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">Última atualização: maio de 2025</p>
      </div>
    </div>
  )
}
