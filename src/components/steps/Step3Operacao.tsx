'use client'

import { FormData } from '@/types/form'

interface Props {
  data: FormData
  onChange: (field: keyof FormData, value: unknown) => void
}

export default function Step3Operacao({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Quantidade de SKUs *">
          <input className="input" type="number" min={1} value={data.qtdSkus} onChange={e => onChange('qtdSkus', Number(e.target.value))} />
        </Field>
        <Field label="Quantidade de turnos">
          <select className="input" value={data.qtdTurnos} onChange={e => onChange('qtdTurnos', Number(e.target.value))}>
            {[1, 2, 3].map(n => <option key={n} value={n}>{n} turno{n > 1 ? 's' : ''}</option>)}
          </select>
        </Field>
        <Field label="Dias de operação">
          <input className="input" value={data.diasSemana} onChange={e => onChange('diasSemana', e.target.value)} placeholder="Ex: segunda a sábado" />
        </Field>
        <Field label="Operadores/turno (expedição)">
          <input className="input" type="number" min={1} value={data.operadoresPorTurnoExpedicao} onChange={e => onChange('operadoresPorTurnoExpedicao', Number(e.target.value))} />
        </Field>
        <Field label="Operadores/turno (recebimento)">
          <input className="input" type="number" min={1} value={data.operadoresPorTurnoRecebimento} onChange={e => onChange('operadoresPorTurnoRecebimento', Number(e.target.value))} />
        </Field>
        <Field label="NFs de entrada / mês">
          <input className="input" type="number" min={0} value={data.nfsMes} onChange={e => onChange('nfsMes', Number(e.target.value))} />
        </Field>
        <Field label="NFs de saída (expedição) / mês">
          <input className="input" type="number" min={0} value={data.nfsExpedicaoMes} onChange={e => onChange('nfsExpedicaoMes', Number(e.target.value))} />
        </Field>
        <Field label="ERP utilizado *">
          <select className="input" value={data.erpUtilizado} onChange={e => onChange('erpUtilizado', e.target.value)}>
            <option value="WINTHOR">WINTHOR</option>
            <option value="PROTHEUS">PROTHEUS</option>
            <option value="SAP">SAP</option>
            <option value="DATASUL">DATASUL</option>
            <option value="Outro">Outro</option>
          </select>
        </Field>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  )
}
