'use client'

import { FormData, Filial } from '@/types/form'

interface Props {
  data: FormData
  onChange: (field: keyof FormData, value: unknown) => void
}

export default function Step2Armazem({ data, onChange }: Props) {
  function updateFilial(i: number, field: keyof Filial, value: string) {
    const updated = data.filiais.map((f, idx) => idx === i ? { ...f, [field]: value } : f)
    onChange('filiais', updated)
  }
  function addFilial() {
    onChange('filiais', [...data.filiais, { nome: '', cidade: '', uf: '' }])
  }
  function removeFilial(i: number) {
    onChange('filiais', data.filiais.filter((_, idx) => idx !== i))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Unidades / Filiais</h3>
        <div className="space-y-2">
          {data.filiais.map((f, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input className="input flex-[2]" value={f.nome} onChange={e => updateFilial(i, 'nome', e.target.value)} placeholder="Nome (ex: Matriz, Filial Curitiba)" />
              <input className="input flex-[2]" value={f.cidade} onChange={e => updateFilial(i, 'cidade', e.target.value)} placeholder="Cidade" />
              <select className="input flex-1" value={f.uf} onChange={e => updateFilial(i, 'uf', e.target.value)}>
                <option value="">UF</option>
                {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
              {data.filiais.length > 1 && (
                <button onClick={() => removeFilial(i)} className="text-red-400 hover:text-red-600 text-sm px-2">✕</button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addFilial} className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium">+ Adicionar unidade</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade de docas *</label>
          <input className="input" type="number" min={1} value={data.qtdDocas} onChange={e => onChange('qtdDocas', Number(e.target.value))} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Formato das coordenadas</label>
          <input className="input" value={data.formatoCoordenadas} onChange={e => onChange('formatoCoordenadas', e.target.value)} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Estruturas físicas utilizadas</h3>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-blue-600" checked={data.temPortaPallet} onChange={e => onChange('temPortaPallet', e.target.checked)} />
            <span className="text-sm text-gray-700">Porta Pallet</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-blue-600" checked={data.temBlocado} onChange={e => onChange('temBlocado', e.target.checked)} />
            <span className="text-sm text-gray-700">Blocado Armazenagem</span>
          </label>
        </div>
      </div>
    </div>
  )
}

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
