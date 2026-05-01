'use client'

import { FormData } from '@/types/form'

interface Props {
  data: FormData
  onChange: (field: keyof FormData, value: unknown) => void
}

export default function Step1Ambientacao({ data, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Nome do cliente *" required>
          <input className="input" value={data.nomeCliente} onChange={e => onChange('nomeCliente', e.target.value)} placeholder="Ex: DEYCON COMÉRCIO E DISTRIBUIÇÃO LTDA" />
        </Field>
        <Field label="Código de cliente *" required>
          <input className="input" value={data.codigoCliente} onChange={e => onChange('codigoCliente', e.target.value)} placeholder="Ex: TFEPH6" />
        </Field>
        <Field label="Nome do projeto">
          <input className="input" value={data.nomeProjeto} onChange={e => onChange('nomeProjeto', e.target.value)} />
        </Field>
        <Field label="Código do projeto *" required>
          <input className="input" value={data.codigoProjeto} onChange={e => onChange('codigoProjeto', e.target.value)} placeholder="Ex: 26870044" />
        </Field>
        <Field label="Segmento do cliente *" required>
          <input className="input" value={data.segmentoCliente} onChange={e => onChange('segmentoCliente', e.target.value)} placeholder="Ex: Distribuidora de alimentos" />
        </Field>
        <Field label="Unidade TOTVS *" required>
          <input className="input" value={data.unidadeTotvs} onChange={e => onChange('unidadeTotvs', e.target.value)} placeholder="Ex: CES SUPPLY – JOI" />
        </Field>
        <Field label="Data do documento">
          <input className="input" type="date" value={toInputDate(data.data)} onChange={e => onChange('data', fromInputDate(e.target.value))} />
        </Field>
        <Field label="Proposta comercial">
          <input className="input" value={data.propostaComercial} onChange={e => onChange('propostaComercial', e.target.value)} placeholder="Ex: AAQCAHG" />
        </Field>
        <Field label="Gerente/Coordenador TOTVS *" required>
          <input className="input" value={data.gerenteTotvs} onChange={e => onChange('gerenteTotvs', e.target.value)} placeholder="Nome do consultor responsável" />
        </Field>
        <Field label="Gerente/Coordenador cliente *" required>
          <input className="input" value={data.gerenteCliente} onChange={e => onChange('gerenteCliente', e.target.value)} placeholder="Nome do gerente do cliente" />
        </Field>
      </div>
    </div>
  )
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
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
