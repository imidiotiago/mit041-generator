'use client'

import React from 'react'
import {
  Document, Page, Text, View, StyleSheet, pdf, Font,
} from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { FormData } from '@/types/form'

const BLUE = '#003087'
const LIGHT_BLUE = '#D6E4F7'
const GRAY = '#F2F2F2'
const DARK = '#1a1a1a'
const MID = '#444444'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10, color: DARK, paddingTop: 50, paddingBottom: 50, paddingHorizontal: 50 },
  coverPage: { fontFamily: 'Helvetica', fontSize: 10, color: DARK, paddingTop: 100, paddingBottom: 50, paddingHorizontal: 60, backgroundColor: '#fafafa' },
  coverTitle: { fontSize: 32, fontFamily: 'Helvetica-Bold', color: BLUE, textAlign: 'center', marginBottom: 8 },
  coverSubtitle: { fontSize: 22, color: MID, textAlign: 'center', marginBottom: 40 },
  coverClient: { fontSize: 18, fontFamily: 'Helvetica-Bold', textAlign: 'center', marginBottom: 8 },
  coverInfo: { fontSize: 12, color: '#666666', textAlign: 'center', marginBottom: 4 },
  coverLine: { height: 3, backgroundColor: BLUE, marginVertical: 30, marginHorizontal: 40 },
  h1: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: BLUE, marginTop: 18, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: LIGHT_BLUE, paddingBottom: 4 },
  h2: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: MID, marginTop: 12, marginBottom: 6 },
  h3: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: MID, marginTop: 8, marginBottom: 4 },
  p: { fontSize: 10, lineHeight: 1.6, marginBottom: 6, color: DARK },
  bullet: { fontSize: 10, lineHeight: 1.6, marginBottom: 3, marginLeft: 16 },
  table: { width: '100%', marginBottom: 12 },
  tableHeader: { flexDirection: 'row', backgroundColor: BLUE },
  tableHeaderCell: { flex: 1, padding: 6, fontSize: 9, fontFamily: 'Helvetica-Bold', color: 'white', textAlign: 'center', borderRightWidth: 1, borderRightColor: '#002060' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  tableRowAlt: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e0e0e0', backgroundColor: GRAY },
  tableCell: { flex: 1, padding: 5, fontSize: 9, borderRightWidth: 1, borderRightColor: '#e0e0e0' },
  tableCellLabel: { flex: 1, padding: 5, fontSize: 9, fontFamily: 'Helvetica-Bold', borderRightWidth: 1, borderRightColor: '#e0e0e0' },
  header: { position: 'absolute', top: 18, left: 50, right: 50, fontSize: 8, color: '#999999', flexDirection: 'row', justifyContent: 'space-between' },
  footer: { position: 'absolute', bottom: 20, left: 50, right: 50, fontSize: 8, color: '#999999', textAlign: 'center' },
  important: { backgroundColor: '#FFF3CD', padding: 8, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#FFC107' },
  importantText: { fontSize: 10, color: '#856404' },
})

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.h1}>{title}</Text>
}

function SubHeader({ title }: { title: string }) {
  return <Text style={styles.h2}>{title}</Text>
}

function Para({ children }: { children: React.ReactNode }) {
  return <Text style={styles.p}>{children}</Text>
}

function Bullet({ text }: { text: string }) {
  return <Text style={styles.bullet}>• {text}</Text>
}

function InfoTable({ rows }: { rows: [string, string][] }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>Campo</Text>
        <Text style={styles.tableHeaderCell}>Informação</Text>
      </View>
      {rows.map(([label, value], i) => (
        <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
          <Text style={[styles.tableCellLabel, { flex: 1.2 }]}>{label}</Text>
          <Text style={styles.tableCell}>{value}</Text>
        </View>
      ))}
    </View>
  )
}

function PageHeader({ client }: { client: string }) {
  return (
    <View style={styles.header} fixed>
      <Text>TOTVS WMS SaaS — Diagrama dos Processos (MIT041)</Text>
      <Text>{client}</Text>
    </View>
  )
}

function PageFooter() {
  return (
    <Text style={styles.footer} render={({ pageNumber, totalPages }) =>
      `Confidencial — Página ${pageNumber} de ${totalPages}`
    } fixed />
  )
}

function MIT041Document({ data }: { data: FormData }) {
  const filiaisDesc = data.filiais.map(f => `${f.nome} (${f.cidade}/${f.uf})`).join(', ')
  const estruturas: string[] = []
  if (data.temPortaPallet) estruturas.push('porta pallets')
  if (data.temBlocado) estruturas.push('blocado armazenagem')

  return (
    <Document title={`MIT041 - ${data.nomeCliente}`} author="TOTVS WMS SaaS">

      {/* ── CAPA ── */}
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverTitle}>TOTVS WMS SaaS</Text>
        <Text style={styles.coverSubtitle}>Diagrama dos Processos</Text>
        <View style={styles.coverLine} />
        <Text style={styles.coverClient}>{data.nomeCliente}</Text>
        <Text style={styles.coverInfo}>Código do Projeto: {data.codigoProjeto}</Text>
        <Text style={styles.coverInfo}>Versão 1.0 — {data.data}</Text>
        <Text style={{ ...styles.coverInfo, marginTop: 30 }}>Consultor: {data.gerenteTotvs}</Text>
        <Text style={styles.coverInfo}>Gerente Cliente: {data.gerenteCliente}</Text>
        <Text style={styles.coverInfo}>Unidade TOTVS: {data.unidadeTotvs}</Text>
      </Page>

      {/* ── CONTEÚDO ── */}
      <Page size="A4" style={styles.page}>
        <PageHeader client={data.nomeCliente} />
        <PageFooter />

        {/* 1. Ambientação */}
        <SectionHeader title="1. Ambientação" />
        <InfoTable rows={[
          ['Nome do cliente', data.nomeCliente],
          ['Código de cliente', data.codigoCliente],
          ['Nome do projeto', data.nomeProjeto],
          ['Código do projeto', data.codigoProjeto],
          ['Segmento cliente', data.segmentoCliente],
          ['Unidade TOTVS', data.unidadeTotvs],
          ['Data', data.data],
          ['Proposta comercial', data.propostaComercial],
          ['Gerente/Coordenador TOTVS', data.gerenteTotvs],
          ['Gerente/Coordenador cliente', data.gerenteCliente],
        ]} />

        {/* 2. Histórico de versões */}
        <SectionHeader title="2. Histórico de Versões" />
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            {['Data', 'Versão', 'Modificado por', 'Descrição'].map(h => (
              <Text key={h} style={styles.tableHeaderCell}>{h}</Text>
            ))}
          </View>
          <View style={styles.tableRow}>
            {[data.data, '01', data.gerenteTotvs, 'Primeira versão do documento'].map((c, i) => (
              <Text key={i} style={styles.tableCell}>{c}</Text>
            ))}
          </View>
        </View>

        {/* 3. Introdução */}
        <SectionHeader title="3. Introdução" />
        <Para>
          {`Este documento registra o levantamento detalhado dos processos operacionais da empresa ${data.nomeCliente}, visando a implantação do TOTVS WMS SaaS. A análise abrange as principais etapas da cadeia logística, desde o recebimento de mercadorias até a expedição.`}
        </Para>
        <Para>
          {`O projeto abrangerá as unidades: ${filiaisDesc}. A implantação ocorrerá paralelamente à adoção do ERP ${data.erpUtilizado}.`}
        </Para>
        <Para>
          {`O modelo operacional conta com aproximadamente ${data.qtdSkus.toLocaleString('pt-BR')} produtos. As operações acontecem em ${data.qtdTurnos} turnos, de ${data.diasSemana}, com ${data.operadoresPorTurnoExpedicao} operadores/turno na expedição e ${data.operadoresPorTurnoRecebimento} no recebimento.`}
        </Para>
        <Para>
          {`Volume estimado: ${data.nfsMes.toLocaleString('pt-BR')} NFs de entrada/mês e ${data.nfsExpedicaoMes.toLocaleString('pt-BR')} NFs de saída/mês.`}
        </Para>

        {/* 4. Layout dos Armazéns */}
        <SectionHeader title="4. Layout dos Armazéns" />
        <SubHeader title="4.1. Estrutura Física" />
        <Para>{`Estruturas utilizadas: ${estruturas.join(' e ')}, além de ${data.qtdDocas} docas para recebimento e expedição.`}</Para>
        {data.temPortaPallet && (
          <>
            <Text style={styles.h3}>4.1.1. Porta Pallet</Text>
            <Para>{`Coordenadas no formato padrão WMS SaaS: ${data.formatoCoordenadas}.`}</Para>
          </>
        )}
        {data.temBlocado && (
          <>
            <Text style={styles.h3}>4.1.2. Blocado</Text>
            <Para>As coordenadas para armazenagem blocado serão definidas durante a parametrização.</Para>
          </>
        )}

        {/* 5. Cadastros */}
        <SectionHeader title="5. Cadastros" />
        <SubHeader title="5.1. Tipo Segmento" />
        <Para>Principais funcionalidades utilizadas:</Para>
        <Bullet text="Recebimento de produtos acabados e matérias-primas" />
        <Bullet text="Mapeamento de endereços e localizações" />
        <Bullet text="Armazenagem" />
        {data.temPickingFixo && <Bullet text="Mapeamento e reabastecimento de Picking" />}
        <Bullet text="Separação de pedidos" />
        <Bullet text="Conferência de embarque" />
        <Bullet text="Inventário" />
        <SubHeader title="5.2. Tipo de Estoque" />
        <Para>{data.tiposEstoque
          ? `Tipos identificados: ${data.tiposEstoque}.`
          : 'Tipos de estoque a serem identificados e cadastrados conforme bloqueios adotados pelo cliente.'
        }</Para>
        <SubHeader title="5.3. Produtos" />
        <Para>{`Aproximadamente ${data.qtdSkus.toLocaleString('pt-BR')} produtos. Todos devem possuir EAN13/DUN14, lastro, camada, peso, altura, largura e comprimento.`}</Para>
        <SubHeader title="5.4. Características de Estoque" />
        <Para>{[
          data.temControleValidade ? 'Controle por data de validade.' : '',
          data.temControleLote ? 'Controle por lote.' : '',
        ].filter(Boolean).join(' ') || 'Sem características especiais de estoque definidas.'}</Para>

        {/* 6. Fluxo Macro */}
        <SectionHeader title="6. Fluxo Macro dos Processos" />
        <Para>Recebimento: integração da NF → integração WMS → criação do processo → conferência via coletor → armazenagem.</Para>
        <Para>Expedição: faturamento ERP → integração → planejamento de separação → separação → conferência → embarque.</Para>

        {/* 7–16: Processos */}
        <SectionHeader title="7. Entrada de Mercadorias" />
        <Para>{`O processo inicia após lançamento da NF de compra no ERP ${data.erpUtilizado}. O serviço de integração envia o documento ao WMS (INTEGRAÇÃO > MONITOR DE TRANSAÇÕES). O processo de recebimento é criado manualmente, permitindo agrupamento de notas por caminhão. A conferência ocorre via coletor mobile.`}</Para>

        <SectionHeader title="8. Gestão do Armazém" />
        <Para>Controle de estoque por unitizador, produto, SKU e características. Gestão visual de ocupação por armazém e endereço. Histórico completo de movimentações.</Para>

        <SectionHeader title="9. Picking" />
        {data.temPickingFixo ? (
          <>
            <Para>Todos os SKUs terão locais de picking fixos. Reposição automática por demanda ou agendamento ao atingir o ponto de reabastecimento.</Para>
            {!data.temCurvaABC && (
              <View style={styles.important}>
                <Text style={styles.importantText}>⚠ ATENÇÃO: Recomenda-se mapear a curva ABC dos produtos antes da entrada em produção para dimensionar corretamente os locais de picking.</Text>
              </View>
            )}
          </>
        ) : (
          <Para>Sem picking fixo. Separações realizadas diretamente dos endereços de armazenagem.</Para>
        )}

        <SectionHeader title="10. Integração de Pedidos" />
        <Para>{`Pedidos faturados no ERP ${data.erpUtilizado} são integrados automaticamente com o WMS SaaS via monitor de transações.`}</Para>

        <SectionHeader title="11. Planejamento de Separação" />
        <Para>{'Após integração, documentos ficam disponíveis em EXPEDIÇÃO > DOCUMENTOS DE EXPEDIÇÃO. O usuário cria o processo de expedição agrupando por carga ou pedido a pedido.'}</Para>

        <SectionHeader title="12. Separação de Produtos" />
        <Para>Mobile indica endereços, produtos, lotes e quantidades. Após separação, produtos vão ao Stage para conferência. Operadores não têm permissão para cortar pedidos.</Para>

        <SectionHeader title="13. Processo Conferência" />
        <Para>Conferente bipa SKU, informa características e quantidade. Sistema valida divergências. Volumes são criados durante ou ao finalizar a conferência.</Para>

        <SectionHeader title="14. Processo de Baixa de Estoque" />
        <Para>{`Baixa automática no WMS após conferência. Integração enviada ao ERP ${data.erpUtilizado} com status: Pedido separado e liberado para faturamento.`}</Para>

        <SectionHeader title="15. Faturamento de Pedido" />
        <Para>{`Após separação e conferência, o WMS envia confirmação ao ERP ${data.erpUtilizado} para liberar faturamento. NFs faturadas não precisam ser reintegradas ao WMS.`}</Para>

        <SectionHeader title="16. Embarque de Produtos" />
        <Para>Após conferência finalizada, produtos ficam segregados em seus endereços aguardando coleta da transportadora. O controle de embarque é feito no WMS SaaS.</Para>

        <SectionHeader title="17. Movimentação de Produtos" />
        <SubHeader title="17.1. Movimentação Manual" />
        <Para>Todas as movimentações manuais via Transferência por bipe de Unitizador/Endereço no coletor, com sugestão de endereço.</Para>
        <SubHeader title="17.2. Alterar Tipo de Estoque / Condição / SKU" />
        <Para>{`Alteração em lote de SKU, condição, características, selos e tipo de estoque. Somente alterações de tipo de estoque bloqueante são integradas ao ERP ${data.erpUtilizado}.`}</Para>
        <SubHeader title="17.3. Processo de Inventário" />
        <Para>Inventário planejado por Endereço ou Produto com atribuição de contagens. Requer duas contagens iguais não sequenciais para finalização. Ajustes automáticos no WMS e integração enviada ao ERP.</Para>
        <SubHeader title="17.4. Entrada/Saída de Estoque Simplificada" />
        <Para>{`Movimentação simplificada via mobile, usada principalmente na carga inicial. Não integra com ERP ${data.erpUtilizado}.`}</Para>

        <SectionHeader title="18. Integrações" />
        <SubHeader title="18.1. Painel de Integração" />
        <Para>Acompanhamento de todas as integrações com filtros e status: Integrado, Com erros de negócio, Erro de integração.</Para>
        <SubHeader title="18.2. Estrutura Necessária" />
        <Bullet text="Usuário/senha exclusivos para integração" />
        <Bullet text="APIs publicadas (expedição contínua atualizada)" />
        <Bullet text="URL + caminho de acesso conforme swagger" />
        <Bullet text="Acesso à internet e firewall liberado" />
        <Bullet text="Diretórios Propath no app server atualizados" />

        {/* 19. GAPs */}
        <SectionHeader title="19. GAPs do Processo" />
        {data.gaps.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              {['ID', 'Processo', 'Subprocesso', 'Descrição', 'Situação Esperada', 'Seguir?', 'Contorno?'].map(h => (
                <Text key={h} style={[styles.tableHeaderCell, { fontSize: 8 }]}>{h}</Text>
              ))}
            </View>
            {data.gaps.map((gap, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, { fontSize: 8 }]}>{i + 1}</Text>
                <Text style={[styles.tableCell, { fontSize: 8 }]}>{gap.processo}</Text>
                <Text style={[styles.tableCell, { fontSize: 8 }]}>{gap.subprocesso}</Text>
                <Text style={[styles.tableCell, { fontSize: 8 }]}>{gap.descricao}</Text>
                <Text style={[styles.tableCell, { fontSize: 8 }]}>{gap.situacaoEsperada}</Text>
                <Text style={[styles.tableCell, { fontSize: 8, textAlign: 'center' }]}>{gap.possiveiseguir}</Text>
                <Text style={[styles.tableCell, { fontSize: 8, textAlign: 'center' }]}>{gap.existeContorno}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Para>Nenhum GAP identificado neste levantamento.</Para>
        )}

        {/* 20. Aceite */}
        <SectionHeader title="20. Aceite" />
        <Para>Confirmo que os processos descritos neste documento refletem as necessidades da minha operação e atendem às expectativas propostas pelo negócio.</Para>
        <View style={{ marginTop: 20, ...styles.table }}>
          <View style={styles.tableHeader}>
            {['Aprovado por', 'Assinatura', 'Data'].map(h => (
              <Text key={h} style={styles.tableHeaderCell}>{h}</Text>
            ))}
          </View>
          <View style={[styles.tableRow, { height: 40 }]}>
            <Text style={styles.tableCell}>{data.aprovadoPor || ''}</Text>
            <Text style={styles.tableCell}> </Text>
            <Text style={styles.tableCell}>{data.dataAceite || ''}</Text>
          </View>
        </View>

      </Page>
    </Document>
  )
}

export async function generatePdf(data: FormData) {
  const blob = await pdf(<MIT041Document data={data} />).toBlob()
  saveAs(blob, `MIT041_${data.nomeCliente.replace(/\s+/g, '_')}_V1.pdf`)
}
