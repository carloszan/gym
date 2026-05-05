// app/checkin/page.tsx

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

function playSuccessSound() {
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  const ctx = new AudioContextClass()
  const now = ctx.currentTime

  const playNote = (freq: number, start: number, end: number) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, now + start)
    gain.gain.linearRampToValueAtTime(0.35, now + start + 0.04)
    gain.gain.linearRampToValueAtTime(0, now + end)
    osc.start(now + start)
    osc.stop(now + end)
  }

  playNote(523, 0, 0.18)   // C5
  playNote(784, 0.2, 0.42) // G5
}

function playErrorSound() {
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  const ctx = new AudioContextClass()
  const now = ctx.currentTime

  const playBuzz = (freq: number, start: number, end: number) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'square'
    osc.frequency.value = freq
    gain.gain.value = 0.1
    osc.start(now + start)
    osc.stop(now + end)
  }

  playBuzz(280, 0, 0.16)
  playBuzz(180, 0.22, 0.38)
}

export default function CheckinPage() {
  const { status } = useSession()
  const router = useRouter()

  const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null))
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const code = digits.join('')

  const resetForNextStudent = () => {
    setDigits(Array(6).fill(''))
    setSuccess(false)
    setSuccessMessage('')
    setError('')
    setIsProcessing(false)
    setTimeout(() => inputRefs.current[0]?.focus(), 100)
  }

  const submitCode = async (submittedCode: string) => {
    if (!submittedCode.trim() || submittedCode.length < 6) return
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    setIsProcessing(true)
    setError('')
    setSuccess(false)
    setSuccessMessage('')

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: submittedCode }),
      })
      const response: { success: boolean; message?: string; firstName?: string; lastName?: string } = await res.json()

      if (response.success) {
        playSuccessSound()
        setSuccess(true)
        setSuccessMessage(`Bem-vindo à Aquarius, ${response.firstName ?? ''} ${response.lastName ?? ''}!`)
        timeoutRef.current = setTimeout(() => resetForNextStudent(), 5000)
      } else {
        playErrorSound()
        setError(response.message ?? 'Código inválido. Tente novamente.')
        setIsProcessing(false)
        setDigits(Array(6).fill(''))
        setTimeout(() => inputRefs.current[0]?.focus(), 50)
      }
    } catch {
      playErrorSound()
      setError('Erro na comunicação. Tente novamente.')
      setIsProcessing(false)
      setDigits(Array(6).fill(''))
      setTimeout(() => inputRefs.current[0]?.focus(), 50)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitCode(code)
  }

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    if (!digit) return

    if (error) setError('')

    const next = [...digits]
    next[index] = digit
    setDigits(next)

    const nextCode = next.join('')
    if (index < 5) {
      inputRefs.current[index + 1]?.focus()
    } else if (nextCode.length === 6) {
      inputRefs.current[index]?.blur()
      submitCode(nextCode)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (error) setError('')

    if (e.key === 'Backspace') {
      e.preventDefault()
      if (digits[index]) {
        const next = [...digits]
        next[index] = ''
        setDigits(next)
      } else if (index > 0) {
        const next = [...digits]
        next[index - 1] = ''
        setDigits(next)
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return

    const next = Array(6).fill('')
    pasted.split('').forEach((ch, i) => { next[i] = ch })
    setDigits(next)

    if (pasted.length === 6) {
      submitCode(pasted)
    } else {
      inputRefs.current[pasted.length]?.focus()
    }
  }

  const handleManualReset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    resetForNextStudent()
  }

  const boxClass = (i: number) => {
    const filledCount = digits.filter(Boolean).length
    const isActive = filledCount === i && !isProcessing && !success
    const isFilled = !!digits[i]

    if (success) return 'border-green-500 bg-green-50 text-green-700'
    if (error) return 'border-red-500 bg-red-50 text-red-700'
    if (isActive) return 'border-blue-500 ring-2 ring-blue-200 bg-white'
    if (isFilled) return 'border-blue-400 bg-blue-50 text-blue-800'
    return 'border-gray-300 bg-gray-50 text-gray-400'
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
      return
    }
    if (status === 'authenticated') {
      inputRefs.current[0]?.focus()
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [status, router])

  if (status !== 'authenticated') return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Acesso à Aquarius</h1>
          <p className="text-gray-600 mt-2">Digite seu código de acesso para entrar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  value={digits[i]}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  onFocus={(e) => e.target.select()}
                  disabled={isProcessing || success}
                  maxLength={1}
                  autoComplete="off"
                  className={`
                    w-12 h-14 rounded-xl border-2 text-2xl text-center font-mono font-bold
                    focus:outline-none transition-all duration-150
                    disabled:cursor-not-allowed disabled:opacity-60
                    ${boxClass(i)}
                  `}
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center text-red-600 text-sm justify-center">
                <svg className="w-4 h-4 mr-1 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && successMessage && (
              <div className="mt-3 p-4 bg-green-100 border border-green-400 rounded-lg">
                <div className="flex items-center text-green-700">
                  <svg className="w-5 h-5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{successMessage}</span>
                </div>
                <div className="mt-2 w-full bg-green-200 rounded-full h-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full transition-all duration-[5000ms] linear" style={{ width: success ? '100%' : '0%' }} />
                </div>
                <p className="text-xs text-green-600 mt-1 text-center">Aguarde 5 segundos para o próximo aluno...</p>
              </div>
            )}
          </div>

          {!success && (
            <button
              type="submit"
              disabled={isProcessing || code.length < 6}
              className="w-full py-4 px-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verificando...
                </span>
              ) : 'Entrar'}
            </button>
          )}

          {success && (
            <button
              type="button"
              onClick={handleManualReset}
              className="w-full py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-semibold text-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Pular espera (próximo aluno)
            </button>
          )}
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Digite seu código e pressione Enter</p>
        </div>
      </div>
    </div>
  )
}
