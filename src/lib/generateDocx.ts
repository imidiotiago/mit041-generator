'use client'

import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { saveAs } from 'file-saver'
import { FormData } from '@/types/form'

export async function generateDocx(data: FormData) {
  // Carregar o template (documento original com placeholders)
  const response = await fetch('/template.docx')
  if (!response.ok) throw new Error('Template não encontrado')

  const arrayBuffer = await response.arrayBuffer()
  const zip = new PizZip(arrayBuffer)

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    errorLogging: false,
  })

  const filiaisDesc = data.filiais
    .map(f => `${f.nome} — ${f.cidade}/${f.uf}`)
    .join(', ')

  const gaps = data.gaps.map((g, i) => ({
    gapId: String(i + 1),
    processo: g.processo,
    subprocesso: g.subprocesso,
    descricao: g.descricao,
    situacaoEsperada: g.situacaoEsperada,
    possiveiseguir: g.possiveiseguir,
    existeContorno: g.existeContorno,
  }))

  doc.render({
    // Ambientação
    nomeCliente: data.nomeCliente,
    nomeFantasia: data.nomeCliente,
    codigoCliente: data.codigoCliente,
    nomeProjeto: data.nomeProjeto,
    codigoProjeto: data.codigoProjeto,
    segmentoCliente: data.segmentoCliente,
    unidadeTotvs: data.unidadeTotvs,
    data: data.data,
    propostaComercial: data.propostaComercial,
    gerenteTotvs: data.gerenteTotvs,
    gerenteCliente: data.gerenteCliente,

    // Operação
    filiaisDesc,
    qtdSkus: data.qtdSkus.toLocaleString('pt-BR'),
    qtdTurnos: String(data.qtdTurnos),
    diasSemana: data.diasSemana,
    operadoresExpedicao: String(data.operadoresPorTurnoExpedicao),
    operadoresRecebimento: String(data.operadoresPorTurnoRecebimento),
    nfsMes: data.nfsMes.toLocaleString('pt-BR'),
    nfsExpedicaoMes: data.nfsExpedicaoMes.toLocaleString('pt-BR'),
    erpUtilizado: data.erpUtilizado,

    // Aceite
    aprovadoPor: data.aprovadoPor || '______________________________',
    dataAceite: data.dataAceite || '____/____/________',

    // GAPs (loop)
    gaps,
  })

  const blob = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    compression: 'DEFLATE',
  })

  const clientSlug = data.nomeCliente.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
  saveAs(blob, `MIT041_${clientSlug}_V1.docx`)
}
