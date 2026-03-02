// app/join/page.tsx (para App Router)
// or pages/join.tsx (para Pages Router)

'use client'

import React, { useState, useRef, useEffect } from 'react'

export default function JoinWithCode() {
  const [code, setCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    // Focar no input automaticamente ao carregar a página
    inputRef.current?.focus()

    // Cleanup do timeout
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const playBeep = (count: number) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    const playSingleBeep = (time: number) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      gainNode.gain.value = 0.3
      
      oscillator.start(time)
      oscillator.stop(time + 0.1)
    }

    // Tocar múltiplos bips com intervalo de 0.15 segundos
    for (let i = 0; i < count; i++) {
      playSingleBeep(audioContext.currentTime + (i * 0.15))
    }
  }

  const resetForNextCustomer = () => {
    setCode('')
    setSuccess(false)
    setSuccessMessage('')
    setError('')
    setIsProcessing(false)
    
    // Focar no input para o próximo cliente
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const fakeHttpRequest = async (code: string): Promise<{ success: boolean; message: string }> => {
    // Simular latência de rede (300ms a 800ms)
    const delay = Math.random() * 500 + 300
    await new Promise(resolve => setTimeout(resolve, delay))

    // Código válido (você pode alterar para o código desejado)
    const VALID_CODE = '123456'

    if (code === VALID_CODE) {
      return {
        success: true,
        message: 'Acesso permitido! Bem-vindo à academia!'
      }
    } else {
      return {
        success: false,
        message: 'Código inválido. Tente novamente.'
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!code.trim()) {
      setError('Por favor, insira um código')
      return
    }

    // Cancelar qualquer timeout pendente
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setIsProcessing(true)
    setError('')
    setSuccess(false)
    setSuccessMessage('')

    try {
      // Fazer a requisição fake
      const response = await fakeHttpRequest(code)

      if (response.success) {
        // Código correto - um bip
        playBeep(1)
        setSuccess(true)
        setSuccessMessage(response.message)
        
        // Limpar tudo após 5 segundos para o próximo cliente
        timeoutRef.current = setTimeout(() => {
          resetForNextCustomer()
        }, 5000)
      } else {
        // Código errado - três bips
        playBeep(3)
        setError(response.message)
        setIsProcessing(false)
        
        // Limpar o campo e focar novamente
        setCode('')
        inputRef.current?.focus()
      }
    } catch (error) {
      // Erro na requisição
      playBeep(3)
      setError('Erro na comunicação. Tente novamente.')
      setIsProcessing(false)
      setCode('')
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Limpar erro ao digitar
    if (error) {
      setError('')
    }
  }

  const handleManualReset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    resetForNextCustomer()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo ou título */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <svg 
              className="w-12 h-12 text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Acesso à Academia</h1>
          <p className="text-gray-600 mt-2">Digite seu código de acesso para entrar</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="code" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Código de Acesso
            </label>
            <input
              ref={inputRef}
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing || success}
              className={`
                w-full px-4 py-4 text-2xl text-center tracking-widest font-mono
                border-2 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all duration-200
                ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}
                ${success ? 'border-green-500 bg-green-50' : ''}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
              placeholder="000000"
              maxLength={10}
              autoComplete="off"
            />
            
            {/* Mensagem de erro */}
            {error && (
              <div className="mt-3 flex items-center text-red-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Mensagem de sucesso */}
            {success && successMessage && (
              <div className="mt-3 p-4 bg-green-100 border border-green-400 rounded-lg">
                <div className="flex items-center text-green-700">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{successMessage}</span>
                </div>
                
                {/* Timer/Progress bar */}
                <div className="mt-2 w-full bg-green-200 rounded-full h-1.5">
                  <div 
                    className="bg-green-600 h-1.5 rounded-full transition-all duration-[5000ms] linear"
                    style={{ width: success ? '100%' : '0%' }}
                  />
                </div>
                <p className="text-xs text-green-600 mt-1 text-center">
                  Aguarde 5 segundos para o próximo cliente...
                </p>
              </div>
            )}
          </div>

          {/* Botão de submit (opcional, pode enviar com Enter) */}
          {!success && (
            <button
              type="submit"
              disabled={isProcessing}
              className={`
                w-full py-4 px-4 rounded-xl text-white font-semibold text-lg
                transition-all duration-200 transform
                focus:outline-none focus:ring-2 focus:ring-offset-2
                bg-blue-600 hover:bg-blue-700 focus:ring-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          )}

          {/* Botão de reset manual (aparece apenas durante o sucesso) */}
          {success && (
            <button
              type="button"
              onClick={handleManualReset}
              className="w-full py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-semibold text-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Pular espera (próximo cliente)
            </button>
          )}
        </form>

        {/* Instruções */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Digite seu código e pressione Enter</p>
          <p className="mt-1 text-xs">
            (Use o código <span className="font-mono bg-gray-100 px-2 py-1 rounded">123456</span> para testar)
          </p>
        </div>

        {/* Indicador de status do código */}
        <div className="mt-4 flex justify-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${code.length > 0 ? 'bg-blue-500' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${code.length > 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${code.length > 4 ? 'bg-blue-500' : 'bg-gray-300'}`} />
          <div className={`w-3 h-3 rounded-full ${code.length > 6 ? 'bg-blue-500' : 'bg-gray-300'}`} />
        </div>

        {/* Contador de tentativas (opcional) */}
        {isProcessing && (
          <div className="mt-4 text-center text-xs text-gray-400">
            Simulando requisição HTTP...
          </div>
        )}
      </div>
    </div>
  )
}