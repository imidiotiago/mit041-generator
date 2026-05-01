'use client'

import { useState } from 'react'
import { FormData, Gap } from '@/types/form'

interface Props {
  data: FormData
  onChange: (field: keyof FormData, value: unknown) => void
}

const emptyGap = (): Gap => ({
  id: crypto.randomUUID(),
  processo: '',
  subprocesso: '',
  descricao: '',
  situacaoEsperada: '',
  possiveiseguir: 'Sim',
  existeContorno: 'Sim',
})

const PROCESSOS = ['Recebimento', 'Armazenagem', 'Separação', 'Conferência', 'Expedição', 'Inventário', 'Integração', 'Movimentação', 'Outro']

export default function Step5Gaps({ data, onChange }: Props) {
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState<Gap>(emptyGap())
  const [editingId, setEditingId] = useState<string | null>(null)

  function updateGaps(gaps: Gap[]) { onChange('gaps', gaps) }

  function saveGap() {
    if (!draft.processo || !draft.descricao) return
    if (editingId) {
      updateGaps(data.gaps.map(g => g.id === editingId ? draft : g))
      setEditingId(null)
    } else {
      updateGaps([...data.gaps, draft])
    }
    setDraft(emptyGap())
    setAdding(false)
  }

  function startEdit(gap: Gap) {
    setDraft({ ...gap })
    setEditingId(gap.id)
    setAdding(true)
  }

  function removeGap(id: string) {
    updateGaps(data.gaps.filter(g => g.id !== id))
  }

  function cancel() {
    setAdding(false)
    setEditingId(null)
    setDraft(emptyGap())
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Registre os pontos da operação do cliente que não estão contemplados no produto padrão WMS SaaS.
        Se não houver GAPs identificados, deixe esta seção vazia.
      </p>

      {data.gaps.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Processo</th>
                <th className="p-2 text-left">Subprocesso</th>
                <th className="p-2 text-left">Descrição</th>
                <th className="p-2 text-center">Seguir?</th>
                <th className="p-2 text-center">Contorno?</th>
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {data.gaps.map((gap, i) => (
                <tr key={gap.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-2 border-b">{i + 1}</td>
                  <td className="p-2 border-b">{gap.processo}</td>
                  <td className="p-2 border-b">{gap.subprocesso}</td>
                  <td className="p-2 border-b max-w-[200px] truncate" title={gap.descricao}>{gap.descricao}</td>
                  <td className="p-2 border-b text-center">{gap.possiveiseguir}</td>
                  <td className="p-2 border-b text-center">{gap.existeContorno}</td>
                  <td className="p-2 border-b">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(gap)} className="text-blue-600 hover:text-blue-800">✏</button>
                      <button onClick={() => removeGap(gap.id)} className="text-red-400 hover:text-red-600">✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {adding ? (
        <div className="border border-blue-200 rounded-xl p-4 bg-blue-50 space-y-3">
          <h4 className="text-sm font-semibold text-blue-900">{editingId ? 'Editar GAP' : 'Novo GAP'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="label">Processo *</label>
              <select className="input" value={draft.processo} onChange={e => setDraft(d => ({ ...d, processo: e.target.value }))}>
                <option value="">Selecione...</option>
                {PROCESSOS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Subprocesso</label>
              <input className="input" value={draft.subprocesso} onChange={e => setDraft(d => ({ ...d, subprocesso: e.target.value }))} placeholder="Ex: Conferência, Paletização" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Descrição da situação atual *</label>
              <textarea className="input min-h-[64px] resize-none" value={draft.descricao} onChange={e => setDraft(d => ({ ...d, descricao: e.target.value }))} placeholder="Descreva como funciona atualmente no cliente" />
            </div>
            <div className="md:col-span-2">
              <label className="label">Situação esperada / funcionalidade desejada</label>
              <textarea className="input min-h-[64px] resize-none" value={draft.situacaoEsperada} onChange={e => setDraft(d => ({ ...d, situacaoEsperada: e.target.value }))} placeholder="Descreva o que o cliente espera no novo sistema" />
            </div>
            <div>
              <label className="label">É possível seguir sem esta funcionalidade?</label>
              <select className="input" value={draft.possiveiseguir} onChange={e => setDraft(d => ({ ...d, possiveiseguir: e.target.value as 'Sim' | 'Não' }))}>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>
            <div>
              <label className="label">Existe contorno?</label>
              <select className="input" value={draft.existeContorno} onChange={e => setDraft(d => ({ ...d, existeContorno: e.target.value as 'Sim' | 'Não' }))}>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={saveGap} disabled={!draft.processo || !draft.descricao} className="btn-primary text-sm disabled:opacity-40">
              {editingId ? 'Salvar alteração' : 'Adicionar GAP'}
            </button>
            <button onClick={cancel} className="btn-ghost text-sm">Cancelar</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium border border-blue-300 rounded-lg px-4 py-2 hover:bg-blue-50 transition-colors">
          + Adicionar GAP
        </button>
      )}
    </div>
  )
}
