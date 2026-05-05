'use client'

import React, { useState, useEffect } from 'react'

export interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  gender: string
  cpf: string
  rg: string
  zipCode: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  emergencyName: string
  emergencyPhone: string
  emergencyRelationship: string
  hasHealthIssues: boolean
  healthDescription: string
  takesMedication: boolean
  medicationDescription: string
  hasAllergies: boolean
  allergiesDescription: string
  membershipType: string
  paymentMethod: string
  startDate: string
  monthlyFee: number
  occupation: string
  howDidYouFind: string
  goals: string
  checkInToken: string
}

const defaultFormData: FormData = {
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
  occupation: '',
  howDidYouFind: '',
  goals: '',
  checkInToken: '',
}

const planosAssinatura = [
  { id: 'padrao', name: 'Padrão - Acesso total', price: 80.00 },
]

interface StudentFormProps {
  initialData?: Partial<FormData>
  onSubmit: (data: FormData) => Promise<void>
  isSubmitting: boolean
  mode: 'create' | 'edit'
  studentId?: string
}

export default function StudentForm({ initialData, onSubmit, isSubmitting, mode, studentId }: StudentFormProps) {
  const [formData, setFormData] = useState<FormData>({ ...defaultFormData, ...initialData })
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [tokenStatus, setTokenStatus] = useState<'idle' | 'checking' | 'unique' | 'taken'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      if (cancelled) return
      if (!formData.checkInToken) {
        setTokenStatus('idle')
        return
      }
      setTokenStatus('checking')
      const params = new URLSearchParams({ token: formData.checkInToken })
      if (studentId) params.set('excludeId', studentId)
      const res = await fetch(`/api/students/check-token?${params}`)
      const data = await res.json()
      if (!cancelled) setTokenStatus(data.unique ? 'unique' : 'taken')
    }, 500)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [formData.checkInToken, studentId])

  const generateToken = () => {
    const token = String(Math.floor(100000 + Math.random() * 900000))
    setFormData(prev => ({ ...prev, checkInToken: token }))
    setTokenStatus('idle')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep !== 5) return
    if (!formData.checkInToken || tokenStatus !== 'unique') return
    await onSubmit(formData)
  }

  const nextStep = () => {
    if (currentStep === 1) {
      const newErrors: Partial<Record<keyof FormData, string>> = {}
      if (!formData.firstName.trim()) newErrors.firstName = 'Campo obrigatório'
      if (!formData.lastName.trim()) newErrors.lastName = 'Campo obrigatório'
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }
    }
    setErrors({})
    setCurrentStep(prev => Math.min(prev + 1, 5))
  }
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={`${inputClass} ${errors.firstName ? 'border-red-500' : ''}`} />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={`${inputClass} ${errors.lastName ? 'border-red-500' : ''}`} />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(00) 00000-0000" required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento *</label>
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className={inputClass}>
                  <option value="">Selecione o gênero</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                  <option value="prefiro-nao-dizer">Prefiro não dizer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                <input type="text" name="cpf" value={formData.cpf} onChange={handleInputChange} placeholder="000.000.000-00" required className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
                <input type="text" name="rg" value={formData.rg} onChange={handleInputChange} placeholder="00.000.000-0" className={inputClass} />
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
                  <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="00000-000" required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rua *</label>
                  <input type="text" name="street" value={formData.street} onChange={handleInputChange} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                  <input type="text" name="number" value={formData.number} onChange={handleInputChange} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                  <input type="text" name="complement" value={formData.complement} onChange={handleInputChange} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                  <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} maxLength={2} placeholder="SP" required className={inputClass} />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contato de Emergência</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Contato *</label>
                  <input type="text" name="emergencyName" value={formData.emergencyName} onChange={handleInputChange} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone do Contato *</label>
                  <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleInputChange} placeholder="(00) 00000-0000" required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parentesco/Relação *</label>
                  <input type="text" name="emergencyRelationship" value={formData.emergencyRelationship} onChange={handleInputChange} placeholder="Cônjuge, Pai, Amigo, etc." required className={inputClass} />
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
                <input type="checkbox" name="hasHealthIssues" checked={formData.hasHealthIssues} onChange={handleInputChange} className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                <label className="ml-2 block text-sm text-gray-700">Possui algum problema de saúde?</label>
              </div>
              {formData.hasHealthIssues && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Por favor, descreva:</label>
                  <textarea name="healthDescription" value={formData.healthDescription} onChange={handleInputChange} rows={3} className={inputClass} />
                </div>
              )}
              <div className="flex items-center">
                <input type="checkbox" name="takesMedication" checked={formData.takesMedication} onChange={handleInputChange} className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                <label className="ml-2 block text-sm text-gray-700">Faz uso de medicação contínua?</label>
              </div>
              {formData.takesMedication && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quais medicamentos?</label>
                  <textarea name="medicationDescription" value={formData.medicationDescription} onChange={handleInputChange} rows={3} className={inputClass} />
                </div>
              )}
              <div className="flex items-center">
                <input type="checkbox" name="hasAllergies" checked={formData.hasAllergies} onChange={handleInputChange} className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                <label className="ml-2 block text-sm text-gray-700">Possui alguma alergia?</label>
              </div>
              {formData.hasAllergies && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quais alergias?</label>
                  <textarea name="allergiesDescription" value={formData.allergiesDescription} onChange={handleInputChange} rows={3} className={inputClass} />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Objetivos na Academia</label>
              <textarea name="goals" value={formData.goals} onChange={handleInputChange} rows={3} placeholder="Quais são seus principais objetivos? (Perda de peso, ganho de massa muscular, condicionamento físico, etc.)" className={inputClass} />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Plano e Pagamento</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Plano *</label>
              <select name="membershipType" value={formData.membershipType} onChange={handleInputChange} required className={inputClass}>
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
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} required className={inputClass}>
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
              <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profissão</label>
              <input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} placeholder="Ex: Estudante, Professor, Engenheiro" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Como nos conheceu?</label>
              <select name="howDidYouFind" value={formData.howDidYouFind} onChange={handleInputChange} className={inputClass}>
                <option value="">Selecione uma opção</option>
                <option value="redes-sociais">Redes Sociais</option>
                <option value="amigo">Amigo/Família</option>
                <option value="google">Google</option>
                <option value="panfleto">Panfleto/Propaganda</option>
                <option value="outro">Outro</option>
              </select>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Token de Acesso</h2>
            <p className="text-sm text-gray-600">Este código de 6 dígitos será usado para registrar a entrada do aluno na academia.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Token de Check-in *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="checkInToken"
                  value={formData.checkInToken}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setFormData(prev => ({ ...prev, checkInToken: val }))
                  }}
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  placeholder="000000"
                  className={`${inputClass} tracking-widest text-lg font-mono`}
                />
                <button
                  type="button"
                  onClick={generateToken}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 whitespace-nowrap"
                >
                  Gerar Token
                </button>
              </div>
              <div className="mt-2 text-sm">
                {tokenStatus === 'checking' && <span className="text-gray-500">Verificando disponibilidade...</span>}
                {tokenStatus === 'unique' && <span className="text-green-600">✓ Token disponível</span>}
                {tokenStatus === 'taken' && <span className="text-red-600">✗ Token já está em uso</span>}
              </div>
            </div>
          </div>
        )
    }
  }

  const title = mode === 'edit' ? 'Editar Aluno' : 'Cadastro de Aluno'
  const subtitle = mode === 'edit' ? 'Atualize as informações do aluno' : 'Preencha todas as informações necessárias para se tornar um membro'

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-blue-100 mt-2">{subtitle}</p>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                    {step}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:block">
                    {step === 1 && 'Pessoal'}
                    {step === 2 && 'Endereço'}
                    {step === 3 && 'Saúde'}
                    {step === 4 && 'Plano'}
                    {step === 5 && 'Acesso'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {renderStep()}

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
              {currentStep < 5 ? (
                <button
                  key="next-btn"
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Próximo
                </button>
              ) : (
                <button
                  key="submit-btn"
                  type="submit"
                  disabled={isSubmitting || !formData.checkInToken || tokenStatus !== 'unique'}
                  className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Salvando...' : mode === 'edit' ? 'Salvar Alterações' : 'Finalizar Cadastro'}
                </button>
              )}
            </div>
          </form>
        </div>

        <p className="text-sm text-gray-500 mt-4 text-center">* Campos obrigatórios</p>
      </div>
    </div>
  )
}
