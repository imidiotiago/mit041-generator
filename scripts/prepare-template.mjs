/**
 * Prepara o template MIT041 a partir do documento original.
 * Substitui dados do cliente pelos placeholders do docxtemplater.
 *
 * Executar uma vez: node scripts/prepare-template.mjs
 */

import PizZip from 'pizzip'
import { readFileSync, writeFileSync } from 'fs'

const docx = readFileSync('./public/template-original.docx', 'binary')
const zip = new PizZip(docx)

let xml = zip.files['word/document.xml'].asText()

// ─── SUBSTITUIÇÕES SIMPLES (ambientação + histórico + introdução) ────────────

const simple = [
  // Ambientação table + histórico
  ['DEYCON COMERCIO E DISTRIBUICAO LTDA', '{nomeCliente}'],
  ['TFEPH6',                              '{codigoCliente}'],
  ['Projeto de Implantação do WMS SaaS',  '{nomeProjeto}'],
  ['26870044',                            '{codigoProjeto}'],
  ['Distribuidora de alimentos',          '{segmentoCliente}'],
  ['CES SUPPLY',                          '{unidadeTotvs}'],
  ['AAQCAHGerente',                       'AAQCAHGerente'], // keep adjacent text safe
  ['AAQCAHG',                             '{propostaComercial}'],
  ['Imidio Tiago Timotio',                '{gerenteTotvs}'],
  ['Silviane Cecilia Costa ',             '{gerenteTotvs_}'], // will merge below
  ['Stenger',                             '{_gerenteTotvs}'], // will merge below
  ['Everton Henn',                        '{gerenteCliente}'],

  // Datas — aparecem no histórico e aceite
  // Cuidado: 30/04/2026 aparece 3x (ambientação, histórico, aceite)
  // Vamos trocar todas por {data} — o template preencherá corretamente
  ['30/04/2026',                          '{data}'],

  // Corpo da introdução — referências ao cliente
  ['DEYCON comércio e distribuição LTDA, também conhecida como Grupo Pegoraro.',
   '{nomeCliente}, também conhecida como {nomeFantasia}.'],
  ['DEYCON comércio e distribuição LTDA',  '{nomeCliente}'],
  ['DEYCON',                               '{nomeCliente}'],

  // Números operacionais na introdução
  ['aproximadamente 2000 produtos cadastrados',
   'aproximadamente {qtdSkus} produtos cadastrados'],
  ['As operações acontecem em três turnos, de segunda a sábado e contando com aproximadamente 20 operadores por turno executando tarefas de expedição e 10 pessoas alocadas no recebimento.',
   'As operações acontecem em {qtdTurnos} turnos, de {diasSemana}, contando com aproximadamente {operadoresExpedicao} operadores por turno executando tarefas de expedição e {operadoresRecebimento} pessoas alocadas no recebimento.'],
  ['Estima-se o recebimento de aproximadamente 110 notas fiscais por mês e a expedição de aproximadamente 32.000 notas fiscais / mês, refletindo a realidade atual da DEYCON.',
   'Estima-se o recebimento de aproximadamente {nfsMes} notas fiscais por mês e a expedição de aproximadamente {nfsExpedicaoMes} notas fiscais/mês.'],

  // ERP ao longo do documento
  ['ERP WINTHOR',    'ERP {erpUtilizado}'],
  ['ERP Winthor',    'ERP {erpUtilizado}'],
  ['no WINTHOR',     'no {erpUtilizado}'],
  ['no Winthor',     'no {erpUtilizado}'],
  ['do WINTHOR',     'do {erpUtilizado}'],
  ['do Winthor',     'do {erpUtilizado}'],
  ['ao WINTHOR',     'ao {erpUtilizado}'],
  ['ao Winthor',     'ao {erpUtilizado}'],
  ['com o WINTHOR',  'com o {erpUtilizado}'],
  ['ERP PROTHEUS',   'ERP {erpUtilizado}'],

  // Projeto abrangerá — filiais
  ['O projeto WMS SaaS abrangerá a matriz/SC e as filiais de Curitiba/PR e Londrina/PR.',
   'O projeto WMS SaaS abrangerá: {filiaisDesc}.'],

  // Aceite
]

// Merge split gerenteTotvs (Silviane Costa Stenger foi dividida em 2 runs)
xml = xml.replace('{gerenteTotvs_}', '{gerenteTotvs}')
xml = xml.replace('{_gerenteTotvs}', '')

for (const [from, to] of simple) {
  // Replace all occurrences
  while (xml.includes(from)) {
    xml = xml.replace(from, to)
  }
}

// ─── ACEITE — substituir nome do aprovador ───────────────────────────────────
xml = xml.replace(/>Everton Henn<\/w:t>/g, '>{aprovadoPor}</w:t>')

// ─── SUMÁRIO — recriar com campo TOC do Word ─────────────────────────────────
// (O Word vai gerar o TOC ao abrir o arquivo — não precisa de modificação)

// ─── TABELA DE GAPS — substituir linhas por template de loop ─────────────────
// Estratégia: encontrar o início e fim da tabela de GAPs e substituir as
// linhas de dados por um template {#gaps}...{/gaps}

// O cabeçalho da tabela de GAPs tem "IDProcessoSubprocessoDescriçãoSituação esperada"
// As linhas de dados seguem depois

// Encontrar a tabela de GAPs pelo texto identificador
const gapTableHeaderMarker = 'É possível seguir sem esta funcionalidade?'
const gapIdx = xml.indexOf(gapTableHeaderMarker)

if (gapIdx > -1) {
  // Encontrar o início da tabela (<w:tbl>) que contém este header
  const tblStart = xml.lastIndexOf('<w:tbl ', gapIdx)
  const tblEnd = xml.indexOf('</w:tbl>', gapIdx) + '</w:tbl>'.length

  const originalTable = xml.substring(tblStart, tblEnd)

  // Encontrar todas as linhas (<w:tr>) da tabela
  const rowMatches = [...originalTable.matchAll(/<w:tr[ >][\s\S]*?<\/w:tr>/g)]

  if (rowMatches.length >= 2) {
    // Primeira linha = cabeçalho (manter)
    const headerRow = rowMatches[0][0]

    // Construir template de linha de dados para docxtemplater
    // Copiar estrutura da primeira linha de dados e substituir conteúdo
    const dataRowTemplate = buildGapRowTemplate(rowMatches[1][0])

    const newTableXml =
      `<w:tbl ` + originalTable.substring('<w:tbl '.length, originalTable.indexOf('>') + 1) +
      extractTableProperties(originalTable) +
      headerRow +
      `{#gaps}` + dataRowTemplate + `{/gaps}` +
      `</w:tbl>`

    xml = xml.substring(0, tblStart) + newTableXml + xml.substring(tblEnd)
    console.log('✓ Tabela de GAPs substituída por template de loop')
  }
} else {
  console.warn('⚠ Tabela de GAPs não encontrada')
}

function extractTableProperties(tblXml) {
  const match = tblXml.match(/<w:tblPr>[\s\S]*?<\/w:tblPr>/)
  return match ? match[0] : ''
}

function buildGapRowTemplate(existingRow) {
  // Pegar a estrutura de células da linha existente
  const cells = [...existingRow.matchAll(/<w:tc>[\s\S]*?<\/w:tc>/g)]

  if (cells.length < 7) {
    // Construir linha genérica com 7 colunas
    return buildGenericGapRow()
  }

  // Substituir o conteúdo de cada célula pelo placeholder correspondente
  const placeholders = [
    '{gapId}',
    '{processo}',
    '{subprocesso}',
    '{descricao}',
    '{situacaoEsperada}',
    '{possiveiseguir}',
    '{existeContorno}',
  ]

  let row = existingRow
  cells.forEach((cell, i) => {
    if (i < placeholders.length) {
      // Substituir texto dentro da célula pelo placeholder
      const newCell = cell[0].replace(/<w:t[^>]*>[\s\S]*?<\/w:t>/g,
        (match, idx) => idx === 0 ? `<w:t>${placeholders[i]}</w:t>` : '<w:t></w:t>')
      row = row.replace(cell[0], newCell)
    }
  })

  return row
}

function buildGenericGapRow() {
  const cell = (placeholder) => `<w:tc><w:p><w:r><w:t>${placeholder}</w:t></w:r></w:p></w:tc>`
  return `<w:tr>${['gapId','processo','subprocesso','descricao','situacaoEsperada','possiveiseguir','existeContorno'].map(p => cell('{'+p+'}')).join('')}</w:tr>`
}

// ─── SALVAR TEMPLATE ─────────────────────────────────────────────────────────
zip.file('word/document.xml', xml)

const output = zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' })
writeFileSync('./public/template.docx', output)

console.log('✓ Template salvo em public/template.docx')
console.log('  Tamanho:', Math.round(output.length / 1024), 'KB')
