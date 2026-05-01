'use client'

import { FormData } from '@/types/form'

interface Props {
  data: FormData
  onChange: (field: keyof FormData, value: unknown) => void
}

export default function Step4Cadastros({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipos de estoque utilizados
            <span className="text-gray-400 font-normal ml-1">(opcional — ex: Bloqueado, Qualidade, Avariado)</span>
          </label>
          <input className="input" value={data.tiposEstoque} onChange={e => onChange('tiposEstoque', e.target.value)} placeholder="Separe por vírgula" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Características de estoque</h3>
        <div className="space-y-3">
          <Toggle
            label="Controle por data de validade"
            hint="Produtos têm validade controlada no WMS"
            checked={data.temControleValidade}
            onChange={v => onChange('temControleValidade', v)}
          />
          <Toggle
            label="Controle por lote"
            hint="Produtos são rastreados por número de lote"
            checked={data.temControleLote}
            onChange={v => onChange('temControleLote', v)}
          />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Picking</h3>
        <div className="space-y-3">
          <Toggle
            label="Picking fixo"
            hint="Cada SKU terá um endereço de picking dedicado com quantidade máxima e ponto de reabastecimento"
            checked={data.temPickingFixo}
            onChange={v => onChange('temPickingFixo', v)}
          />
          {data.temPickingFixo && (
            <Toggle
              label="Curva ABC já mapeada"
              hint="A curva ABC dos produtos foi analisada e está disponível para dimensionar o picking"
              checked={data.temCurvaABC}
              onChange={v => onChange('temCurvaABC', v)}
            />
          )}
        </div>
        {data.temPickingFixo && !data.temCurvaABC && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              ⚠ Sem a curva ABC, as rotinas de reabastecimento de picking podem ser inviáveis. Isso será registrado como alerta no documento.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function Toggle({ label, hint, checked, onChange }: {
  label: string; hint: string; checked: boolean; onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <div className="relative mt-0.5">
        <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
        <div className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-300'}`} />
        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-500">{hint}</p>
      </div>
    </label>
  )
}
