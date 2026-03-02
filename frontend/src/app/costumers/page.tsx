// app/register/page.tsx (para App Router)
// ou pages/register.tsx (para Pages Router)

'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface FormData {
  // Informações Pessoais
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  gender: string
  cpf: string
  rg: string
  
  // Endereço
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  
  // Contato de Emergência
  emergencyName: string
  emergencyPhone: string
  emergencyRelationship: string
  
  // Informações de Saúde
  hasHealthIssues: boolean
  healthDescription: string
  takesMedication: boolean
  medicationDescription: string
  hasAllergies: boolean
  allergiesDescription: string
  
  // Informações do Plano
  membershipType: string
  paymentMethod: string
  startDate: string
  monthlyFee: number
  contractAccepted: boolean
  
  // Informações Adicionais
  occupation: string
  howDidYouFind: string
  goals: string
  photoConsent: boolean
}

export default function FormularioRegistroAcademia() {
  const router = useRouter()
  const { data: session, status } = useSession()

  // redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  if (status !== 'authenticated') {
    return null
  }

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    cpf: '',
    rg: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    hasHealthIssues: false,
    healthDescription: '',
    takesMedication: false,
    medicationDescription: '',
    hasAllergies: false,
    allergiesDescription: '',
    membershipType: '',
    paymentMethod: '',
    startDate: new Date().toISOString().split('T')[0],
    monthlyFee: 0,
    contractAccepted: false,
    occupation: '',
    howDidYouFind: '',
    goals: '',
    photoConsent: false
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const planosAssinatura = [
    { id: 'basico', name: 'Básico - Acesso em horário reduzido', price: 49.90 },
    { id: 'padrao', name: 'Padrão - Acesso total', price: 79.90 },
    { id: 'premium', name: 'Premium - Acesso total + Personal Trainer', price: 129.90 },
    { id: 'estudante', name: 'Estudante - Carteirinha de estudante válida', price: 59.90 },
    { id: 'anual', name: 'Anual - Plano anual pré-pago', price: 899.90 }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simular chamada à API
    setTimeout(() => {
      console.log('Formulário enviado:', formData)
      setIsSubmitting(false)
      router.push('/registro-sucesso')
    }, 1500)
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações Pessoais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento *</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione o gênero</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                  <option value="prefiro-nao-dizer">Prefiro não dizer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
                <input
                  type="text"
                  name="rg"
                  value={formData.rg}
                  onChange={handleInputChange}
                  placeholder="00.000.000-0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Endereço</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="00000-000"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rua *</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                  <input
                    type="text"
                    name="complement"
                    value={formData.complement}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                  <input
                    type="text"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    maxLength={2}
                    placeholder="SP"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contato de Emergência</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Contato *</label>
                  <input
                    type="text"
                    name="emergencyName"
                    value={formData.emergencyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone do Contato *</label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parentesco/Relação *</label>
                  <input
                    type="text"
                    name="emergencyRelationship"
                    value={formData.emergencyRelationship}
                    onChange={handleInputChange}
                    placeholder="Cônjuge, Pai, Amigo, etc."
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações de Saúde</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasHealthIssues"
                  checked={formData.hasHealthIssues}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Possui algum problema de saúde?
                </label>
              </div>
              
              {formData.hasHealthIssues && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Por favor, descreva:</label>
                  <textarea
                    name="healthDescription"
                    value={formData.healthDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="takesMedication"
                  checked={formData.takesMedication}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Faz uso de medicação contínua?
                </label>
              </div>
              
              {formData.takesMedication && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quais medicamentos?</label>
                  <textarea
                    name="medicationDescription"
                    value={formData.medicationDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasAllergies"
                  checked={formData.hasAllergies}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Possui alguma alergia?
                </label>
              </div>
              
              {formData.hasAllergies && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quais alergias?</label>
                  <textarea
                    name="allergiesDescription"
                    value={formData.allergiesDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos na Academia</label>
              <textarea
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                rows={3}
                placeholder="Quais são seus principais objetivos? (Perda de peso, ganho de massa muscular, condicionamento físico, etc.)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Plano e Pagamento</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Plano *</label>
              <select
                name="membershipType"
                value={formData.membershipType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um plano</option>
                {planosAssinatura.map(plano => (
                  <option key={plano.id} value={plano.id}>
                    {plano.name} - R$ {plano.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento *</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione a forma de pagamento</option>
                <option value="credito">Cartão de Crédito</option>
                <option value="debito">Cartão de Débito</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="boleto">Boleto Bancário</option>
                <option value="pix">PIX</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Início *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profissão</label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                placeholder="Ex: Estudante, Professor, Engenheiro"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Como nos conheceu?</label>
              <select
                name="howDidYouFind"
                value={formData.howDidYouFind}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma opção</option>
                <option value="redes-sociais">Redes Sociais</option>
                <option value="amigo">Amigo/Família</option>
                <option value="google">Google</option>
                <option value="panfleto">Panfleto/Propaganda</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="photoConsent"
                  checked={formData.photoConsent}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Autorizo o uso de minha foto para identificação
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="contractAccepted"
                  checked={formData.contractAccepted}
                  onChange={handleInputChange}
                  required
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Li e concordo com os termos e condições da academia *
                </label>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Cabeçalho */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
            <h1 className="text-2xl font-bold text-white">Cadastro de Aluno</h1>
            <p className="text-blue-100 mt-2">Preencha todas as informações necessárias para se tornar um membro</p>
          </div>

          {/* Indicador de Progresso */}
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                    {step === 1 && 'Pessoal'}
                    {step === 2 && 'Endereço'}
                    {step === 3 && 'Saúde'}
                    {step === 4 && 'Plano'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-6">
            {renderStep()}

            {/* Botões de Navegação */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Anterior
                </button>
              )}
              
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Próximo
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Enviando...' : 'Finalizar Cadastro'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Nota de Campos Obrigatórios */}
        <p className="text-sm text-gray-500 mt-4 text-center">
          * Campos obrigatórios
        </p>
      </div>
    </div>
  )
}