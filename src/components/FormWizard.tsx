'use client'

import { useState, useCallback } from 'react'
import { FormData, defaultFormData } from '@/types/form'
import Step1Ambientacao from './steps/Step1Ambientacao'
import Step2Armazem from './steps/Step2Armazem'
import Step3Operacao from './steps/Step3Operacao'
import Step4Cadastros from './steps/Step4Cadastros'
import Step5Gaps from './steps/Step5Gaps'
import Step6Aceite from './steps/Step6Aceite'

const STEPS = [
  { id: 1, label: 'Ambientação', icon: '🏢' },
  { id: 2, label: 'Armazém', icon: '🏭' },
  { id: 3, label: 'Operação', icon: '⚙️' },
  { id: 4, label: 'Cadastros', icon: '📋' },
  { id: 5, label: 'GAPs', icon: '🔍' },
  { id: 6, label: 'Aceite', icon: '✅' },
]

export default function FormWizard() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<FormData>(defaultFormData)
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)

  const onChange = useCallback((field: keyof FormData, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }))
  }, [])

  async function handleGenerate() {
    setGenerating(true)
    try {
      const { generateDocx } = await import('@/lib/generateDocx')
      const { generatePdf } = await import('@/lib/generatePdf')
      await generateDocx(data)
      await generatePdf(data)
      setDone(true)
    } finally {
      setGenerating(false)
    }
  }

  if (done) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-6xl">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800">Documento gerado com sucesso!</h2>
        <p className="text-gray-600">O arquivo <strong>.docx</strong> e o <strong>.pdf</strong> foram baixados automaticamente.</p>
        <div className="flex gap-3 justify-center mt-6">
          <button onClick={() => { setDone(false); setStep(1); setData(defaultFormData) }} className="btn-ghost">
            Novo documento
          </button>
          <button onClick={() => { setDone(false); setStep(6) }} className="btn-primary">
            Editar e regenerar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <button
                onClick={() => setStep(s.id)}
                className={`flex flex-col items-center gap-1 group transition-opacity ${step >= s.id ? 'opacity-100' : 'opacity-40'}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  step === s.id ? 'bg-blue-600 border-blue-600 text-white' :
                  step > s.id ? 'bg-blue-100 border-blue-400 text-blue-700' :
                  'bg-white border-gray-300 text-gray-500'
                }`}>
                  {step > s.id ? '✓' : s.id}
                </div>
                <span className="text-xs text-gray-600 hidden sm:block">{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 transition-colors ${step > s.id ? 'bg-blue-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {STEPS[step - 1].icon} {STEPS[step - 1].label}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Etapa {step} de {STEPS.length}</p>
        </div>

        <div className="min-h-[300px]">
          {step === 1 && <Step1Ambientacao data={data} onChange={onChange} />}
          {step === 2 && <Step2Armazem data={data} onChange={onChange} />}
          {step === 3 && <Step3Operacao data={data} onChange={onChange} />}
          {step === 4 && <Step4Cadastros data={data} onChange={onChange} />}
          {step === 5 && <Step5Gaps data={data} onChange={onChange} />}
          {step === 6 && <Step6Aceite data={data} onChange={onChange} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
            className="btn-ghost disabled:opacity-0"
          >
            ← Anterior
          </button>

          {step < STEPS.length ? (
            <button onClick={() => setStep(s => s + 1)} className="btn-primary">
              Próximo →
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={generating || !data.nomeCliente || !data.gerenteTotvs}
              className="btn-generate disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Gerando...
                </span>
              ) : (
                '⬇ Gerar Word + PDF'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
