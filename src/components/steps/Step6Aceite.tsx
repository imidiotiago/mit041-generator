'use client'

import { FormData } from '@/types/form'

interface Props {
  data: FormData
  onChange: (field: keyof FormData, value: unknown) => void
}

export default function Step6Aceite({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
        Esta é a última etapa. Informe quem assina o documento pelo cliente. O campo de assinatura ficará em branco no documento para ser preenchido à mão ou via assinatura digital.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome do aprovador (cliente) *</label>
          <input className="input" value={data.aprovadoPor} onChange={e => onChange('aprovadoPor', e.target.value)} placeholder="Ex: João Silva" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data de aceite <span className="text-gray-400 font-normal">(deixe vazio para preencher na assinatura)</span></label>
          <input className="input" type="date" value={toInputDate(data.dataAceite)} onChange={e => onChange('dataAceite', fromInputDate(e.target.value))} />
        </div>
      </div>

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Resumo do documento que será gerado</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <span className="font-medium">Cliente:</span><span>{data.nomeCliente || '—'}</span>
          <span className="font-medium">Projeto:</span><span>{data.codigoProjeto || '—'}</span>
          <span className="font-medium">ERP:</span><span>{data.erpUtilizado}</span>
          <span className="font-medium">SKUs:</span><span>{data.qtdSkus.toLocaleString('pt-BR')}</span>
          <span className="font-medium">Docas:</span><span>{data.qtdDocas}</span>
          <span className="font-medium">Unidades:</span><span>{data.filiais.length}</span>
          <span className="font-medium">GAPs:</span><span>{data.gaps.length} registrado{data.gaps.length !== 1 ? 's' : ''}</span>
          <span className="font-medium">Picking fixo:</span><span>{data.temPickingFixo ? 'Sim' : 'Não'}</span>
        </div>
      </div>
    </div>
  )
}

function toInputDate(ptDate: string) {
  if (!ptDate) return ''
  const [d, m, y] = ptDate.split('/')
  if (!d || !m || !y) return ''
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
}

function fromInputDate(iso: string) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
