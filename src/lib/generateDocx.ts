import {
  Document, Packer, Paragraph, Table, TableRow, TableCell,
  TextRun, HeadingLevel, AlignmentType, WidthType,
  ShadingType, TableLayoutType, convertInchesToTwip, PageBreak,
  Header, Footer,
} from 'docx'
import { saveAs } from 'file-saver'
import { FormData } from '@/types/form'

const TOTVS_BLUE = '003087'
const LIGHT_BLUE = 'D6E4F7'
const GRAY = 'F2F2F2'

function h1(text: string) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
  })
}

function h2(text: string) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
  })
}

function h3(text: string) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
  })
}

function p(text: string, bold = false) {
  return new Paragraph({
    children: [new TextRun({ text, bold, size: 22 })],
    spacing: { before: 100, after: 100 },
  })
}

function labelValue(label: string, value: string) {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 22 }),
      new TextRun({ text: value, size: 22 }),
    ],
    spacing: { before: 80, after: 80 },
  })
}

function tableHeader(cells: string[]) {
  return new TableRow({
    tableHeader: true,
    children: cells.map(cell =>
      new TableCell({
        shading: { type: ShadingType.CLEAR, fill: TOTVS_BLUE },
        children: [new Paragraph({
          children: [new TextRun({ text: cell, bold: true, color: 'FFFFFF', size: 20 })],
          alignment: AlignmentType.CENTER,
        })],
      })
    ),
  })
}

function tableRow(cells: string[], shade = false) {
  return new TableRow({
    children: cells.map(cell =>
      new TableCell({
        shading: shade ? { type: ShadingType.CLEAR, fill: GRAY } : undefined,
        children: [new Paragraph({
          children: [new TextRun({ text: cell, size: 20 })],
          spacing: { before: 60, after: 60 },
        })],
      })
    ),
  })
}

export async function generateDocx(data: FormData) {
  const filiaisDesc = data.filiais.map(f => `${f.nome} (${f.cidade}/${f.uf})`).join(', ')
  const estruturas: string[] = []
  if (data.temPortaPallet) estruturas.push('porta pallets')
  if (data.temBlocado) estruturas.push('blocado armazenagem')

  const doc = new Document({
    numbering: {
      config: [],
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1.25),
          },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [
              new TextRun({ text: 'TOTVS WMS SaaS — Diagrama dos Processos (MIT041)', size: 18, color: '666666' }),
            ],
            alignment: AlignmentType.RIGHT,
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            children: [
              new TextRun({ text: `Confidencial — ${data.nomeCliente || 'Cliente'}`, size: 18, color: '666666' }),
            ],
            alignment: AlignmentType.CENTER,
          })],
        }),
      },
      children: [
        // ─── CAPA ───────────────────────────────────────────────────────────
        new Paragraph({
          children: [new TextRun({ text: '', break: 4 })],
        }),
        new Paragraph({
          children: [new TextRun({
            text: 'TOTVS WMS SaaS',
            bold: true, size: 52, color: TOTVS_BLUE,
          })],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [new TextRun({
            text: 'Diagrama dos Processos',
            bold: true, size: 40, color: '444444',
          })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 400 },
        }),
        new Paragraph({
          children: [new TextRun({ text: data.nomeCliente, bold: true, size: 32 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `Código do Projeto: ${data.codigoProjeto}`, size: 24, color: '666666' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `Versão 1.0 — ${data.data}`, size: 24, color: '666666' })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `Consultor: ${data.gerenteTotvs}`, size: 22 })],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ children: [new PageBreak()] }),

        // ─── 1. AMBIENTAÇÃO ─────────────────────────────────────────────────
        h1('1. Ambientação'),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          layout: TableLayoutType.FIXED,
          rows: [
            tableHeader(['Campo', 'Informação']),
            tableRow(['Nome do cliente', data.nomeCliente], false),
            tableRow(['Código de cliente', data.codigoCliente], true),
            tableRow(['Nome do projeto', data.nomeProjeto], false),
            tableRow(['Código do projeto', data.codigoProjeto], true),
            tableRow(['Segmento cliente', data.segmentoCliente], false),
            tableRow(['Unidade TOTVS', data.unidadeTotvs], true),
            tableRow(['Data', data.data], false),
            tableRow(['Proposta comercial', data.propostaComercial], true),
            tableRow(['Gerente/Coordenador TOTVS', data.gerenteTotvs], false),
            tableRow(['Gerente/Coordenador cliente', data.gerenteCliente], true),
          ],
        }),

        // ─── 2. HISTÓRICO DE VERSÕES ────────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('2. Histórico de Versões'),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            tableHeader(['Data', 'Versão', 'Modificado por', 'Descrição da Mudança']),
            tableRow([data.data, '01', data.gerenteTotvs, 'Primeira versão do documento']),
          ],
        }),

        // ─── 3. INTRODUÇÃO ──────────────────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('3. Introdução'),
        p(`Este documento tem como objetivo registrar o levantamento detalhado dos processos operacionais da empresa ${data.nomeCliente}, visando a implantação do TOTVS WMS SaaS nos armazéns do cliente. A análise abrange as principais etapas da cadeia logística, desde o recebimento de mercadorias até a expedição, garantindo que o novo sistema seja configurado para atender às necessidades específicas.`),
        p('Durante este levantamento, foram mapeados os fluxos atuais, indicadas possíveis oportunidades de melhoria e definidos os requisitos funcionais e operacionais para uma transição eficiente e sem impactos negativos às operações. Além disso, foi considerada a integração com o ERP e demais particularidades do ambiente logístico.'),
        p('O resultado deste estudo servirá como base para a parametrização do WMS, garantindo que a solução esteja alinhada com as boas práticas de mercado e com as expectativas do cliente, promovendo maior controle, rastreabilidade e eficiência.'),
        p(`O projeto WMS SaaS abrangerá as unidades: ${filiaisDesc}. A implantação do WMS ocorrerá paralelamente à adoção do ERP ${data.erpUtilizado}.`),
        p(`Atualmente, o modelo operacional conta com aproximadamente ${data.qtdSkus.toLocaleString('pt-BR')} produtos cadastrados. As operações acontecem em ${data.qtdTurnos} turnos, de ${data.diasSemana}, contando com aproximadamente ${data.operadoresPorTurnoExpedicao} operadores por turno executando tarefas de expedição e ${data.operadoresPorTurnoRecebimento} pessoas alocadas no recebimento.`),
        p(`Estima-se o recebimento de aproximadamente ${data.nfsMes.toLocaleString('pt-BR')} notas fiscais por mês e a expedição de aproximadamente ${data.nfsExpedicaoMes.toLocaleString('pt-BR')} notas fiscais/mês.`),

        // ─── 4. LAYOUT DOS ARMAZÉNS ─────────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('4. Layout dos Armazéns'),
        h2('4.1. Estrutura Física'),
        p(`As estruturas físicas utilizadas pelo cliente serão: ${estruturas.join(' e ')}, além de ${data.qtdDocas} docas utilizadas tanto no recebimento quanto na expedição.`),

        ...(data.temPortaPallet ? [
          h3('4.1.1. Endereços de Armazenagem — Porta Pallet'),
          p(`As coordenadas padrão do WMS SaaS serão mantidas para a estrutura porta pallets no formato: ${data.formatoCoordenadas}.`),
        ] : []),

        ...(data.temBlocado ? [
          h3('4.1.2. Endereços de Armazenagem — Blocado'),
          p('As coordenadas para a estrutura de armazenagem blocado serão definidas conforme padrão WMS SaaS e alinhadas durante a etapa de parametrização.'),
        ] : []),

        h3(`4.1.${data.temBlocado ? 3 : 2}. Endereços Funcionais — Docas`),
        p(`O armazém contará com ${data.qtdDocas} docas onde serão realizadas as expedições e recebimentos diariamente.`),

        // ─── 5. CADASTROS ───────────────────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('5. Cadastros'),
        h2('5.1. Tipo Segmento Unidade Organizacional'),
        p(`O cliente é uma ${data.segmentoCliente} e, com base nisso, as principais funcionalidades utilizadas serão:`),
        ...[
          'Recebimento de produtos acabados e matérias-primas;',
          'Mapeamento de endereços e localizações;',
          'Armazenagem;',
          ...(data.temPickingFixo ? ['Mapeamento de Picking;', 'Reabastecimento de Picking;'] : []),
          'Separação de pedidos;',
          'Conferência de embarque;',
          'Inventário.',
        ].map(item => new Paragraph({
          children: [new TextRun({ text: `• ${item}`, size: 22 })],
          spacing: { before: 60, after: 60 },
          indent: { left: 360 },
        })),
        p('Com base na característica do cliente, o WMS SaaS deverá ser parametrizado com o segmento de Distribuidor.'),

        h2('5.2. Tipo de Estoque'),
        p(`Os tipos de estoque cadastrados no WMS SaaS serão utilizados para bloqueio de saldos em ambos os sistemas. ${data.tiposEstoque ? 'Tipos identificados: ' + data.tiposEstoque + '.' : 'Os tipos de estoque serão identificados e cadastrados de acordo com os bloqueios adotados pelo cliente.'}`),

        h2('5.3. Produtos'),
        p(`O cliente iniciará suas operações controlando aproximadamente ${data.qtdSkus.toLocaleString('pt-BR')} produtos. Será necessário realizar um saneamento dos cadastros. Todos os produtos deverão possuir código de barras EAN13/DUN14, lastro e camada, peso, altura, largura e comprimento conhecidos.`),

        h2('5.4. Características de Estoque'),
        p(`Referente às características de estoque:${data.temControleValidade ? ' os produtos serão controlados por data de validade visando rastreabilidade.' : ''}${data.temControleLote ? ' Também haverá controle por lote.' : ''}`),

        // ─── 6. FLUXO MACRO ─────────────────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('6. Fluxo Macro dos Processos'),
        p(`O recebimento de matérias-primas compradas, bem como de produtos acabados produzidos em terceiros, seguirão o mesmo fluxo padrão do WMS SaaS: integração da NF de compra no ERP → integração automática com WMS → criação do processo de recebimento → conferência via coletor → armazenagem.`),
        p('As tarefas de expedição no WMS SaaS terão início a partir do faturamento de um pedido no ERP, seguindo o fluxo: faturamento → integração → planejamento de separação → separação → conferência → embarque.'),

        // ─── 7. ENTRADA DE MERCADORIAS ──────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('7. Entrada de Mercadorias'),
        h2('7.1. Recebimento de Materiais via Liberação da Qualidade'),
        p(`O processo de entrada de mercadorias no WMS SaaS iniciará após o lançamento da nota fiscal de compra no ERP ${data.erpUtilizado}. Após o lançamento, o serviço de integração fará o envio do documento ao WMS, cujo controle deverá ser realizado na tela: INTEGRAÇÃO > MONITOR DE TRANSAÇÕES.`),
        p('Com o documento integrado, o usuário criará o processo de recebimento. Este processo será manual, permitindo o agrupamento de notas de acordo com a quantidade de notas recebidas em um mesmo caminhão.'),
        p('Após a criação do processo, o usuário selecionará os documentos a serem recebidos e informará o endereço de conferência. A conferência de recebimento ocorrerá via coletor de dados (mobile).'),

        // ─── 8. GESTÃO DO ARMAZÉM ───────────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('8. Gestão do Armazém'),
        p('O sistema oferece controle abrangente de estoque por unitizador, produto, SKU e características (lote, validade, produção etc.). A consulta de estoque é flexível e apresentada em modo treeview, permitindo também a consulta em vários locais ou unidades.'),
        p('É possível realizar gestão visual da ocupação por armazéns, endereços e grupos de endereços. Todas as movimentações são registradas no histórico, permitindo rastreabilidade histórica completa.'),

        // ─── 9. PICKING ─────────────────────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('9. Picking'),
        ...(data.temPickingFixo ? [
          p(`Em seu layout, todos os SKUs possuirão locais de picking fixos em um dos níveis dos endereços dos armazéns. O ponto de reposição será definido na etapa de testes, e a reposição sempre ocorrerá com base na quantidade máxima estabelecida. Quando o produto atingir o ponto de reabastecimento no endereço, será solicitado automaticamente o reabastecimento por demanda ou agendamento.`),
          p('Para trabalhar com picking no WMS SaaS, primeiro deverá ser criado um mapeamento de picking para todos os SKUs, relacionando cada SKU a um endereço de picking e definindo a quantidade máxima e o ponto de reabastecimento. Em seguida, deve-se configurar o agendamento de reabastecimento automático.'),
          ...(data.temCurvaABC ? [
            p('A curva ABC dos produtos foi mapeada e será utilizada como base para dimensionamento dos locais de picking.'),
          ] : [
            p('IMPORTANTE: Para viabilidade das rotinas de reabastecimento, é necessário analisar a curva ABC dos produtos e a previsão de demanda por período. Recomenda-se realizar este mapeamento antes da entrada em produção.'),
          ]),
        ] : [
          p('O cliente não utilizará picking fixo em sua operação. As separações ocorrerão diretamente dos endereços de armazenagem conforme configuração do WMS SaaS.'),
        ]),

        // ─── 10. INTEGRAÇÃO DE PEDIDOS ──────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('10. Integração de Pedidos'),
        p(`No ERP ${data.erpUtilizado}, os pedidos faturados serão integrados automaticamente com o WMS SaaS. Após a integração, o controle deverá ser realizado através do monitor de integrações (INTEGRAÇÃO > MONITOR DE TRANSAÇÕES).`),

        // ─── 11. PLANEJAMENTO DE SEPARAÇÃO ──────────────────────────────────
        h1('11. Planejamento de Separação'),
        p('Após a integração do pedido com o WMS SaaS, os documentos de expedição ficarão disponíveis em EXPEDIÇÃO > DOCUMENTOS DE EXPEDIÇÃO. Os documentos apresentam os status: Disponível (aguardando processo), Associado (processo em andamento) e Inativo (retornado ao ERP).'),
        p('O planejamento de expedição será realizado na tela "EXPEDIÇÃO" através do botão "NOVO PROCESSO". O usuário informará o tipo de agrupamento e selecionará os documentos conforme critério (por carga ou pedido a pedido).'),
        p('O WMS SaaS disponibiliza configuração de ordenação de estoque (GESTÃO > CONFIGURAÇÃO > ORDENAÇÃO DE ESTOQUE) para nortear a seleção automática de saldo.'),

        // ─── 12. SEPARAÇÃO DE PRODUTOS ──────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('12. Separação de Produtos'),
        p('Após liberação dos pedidos para separação via desktop, os documentos ficarão disponíveis para separação no WMS mobile. O planejador imprimirá as etiquetas de documento de saída com código de barras do processo/pedido.'),
        p('No mobile, o sistema indicará os endereços, produtos, lotes e quantidades a serem separadas. Após a separação, o sistema solicitará um Stage onde os produtos serão descarregados para conferência.'),
        p('Fica definido que os operadores não terão permissão para cortar pedidos. O parâmetro "Quantidade diferente da solicitada" restringirá tal ação tanto na seleção de estoque quanto na conferência.'),

        // ─── 13. PROCESSO CONFERÊNCIA ───────────────────────────────────────
        h1('13. Processo Conferência'),
        p('Após o separador descarregar os produtos na área de conferência, o colaborador com perfil de conferente selecionará os documentos que deseja conferir. O processo consiste em bipar o SKU, informar características e informar quantidade.'),
        p('Após finalizar a conferência, o sistema valida se existe alguma divergência e informa ao colaborador. No mobile é possível consultar as quantidades solicitadas versus conferidas do pedido.'),
        p('O processo de criação dos volumes é executado durante ou ao finalizar a conferência. A forma de configuração que mais se adaptar ao processo do cliente será definida durante os testes.'),

        // ─── 14. PROCESSO DE BAIXA DE ESTOQUE ───────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('14. Processo de Baixa de Estoque'),
        p(`O processo de baixa de estoque será efetuado de forma automática no WMS SaaS após término da conferência do pedido, e a integração será enviada ao ERP ${data.erpUtilizado}, alterando o status para: Pedido separado e liberado para faturamento.`),

        // ─── 15. FATURAMENTO DE PEDIDO ──────────────────────────────────────
        h1('15. Faturamento de Pedido'),
        p(`Após os processos de separação, conferência e baixa dos estoques, o WMS SaaS enviará a integração de confirmação do pedido para liberar o faturamento no ERP ${data.erpUtilizado}. Depois que os pedidos são faturados, as notas fiscais não precisam ser integradas de volta ao WMS SaaS.`),

        // ─── 16. EMBARQUE DE PRODUTOS ───────────────────────────────────────
        h1('16. Embarque de Produtos'),
        p('Após o processo de conferência finalizado, os produtos ficam segregados em seus devidos endereços para posterior coleta da transportadora. O processo de embarque será controlado no WMS SaaS.'),

        // ─── 17. MOVIMENTAÇÃO DE PRODUTOS ───────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('17. Movimentação de Produtos'),
        h2('17.1. Movimentação Manual'),
        p('Todas as movimentações manuais ocorrerão pela funcionalidade de Transferência via bipe de Unitizador/Endereço, através do coletor de dados, com uso de sugestão de endereço conforme mapeamentos previamente configurados.'),
        p('Nos casos de movimentações fracionadas, será necessário fazer a divisão e fusão do item, ou a reunitização quando necessário.'),

        h2('17.2. Alterar Tipo de Estoque / Condição / SKU'),
        p(`O WMS SaaS disponibiliza a função de alteração em lote de SKU, condição, características de estoque, selos e tipo de estoque. De forma integrada com o ERP ${data.erpUtilizado}, somente a alteração do tipo de estoque que bloqueia o estoque é transmitida; as demais são tratadas apenas no WMS SaaS.`),

        h2('17.3. Processo de Inventário'),
        p('Com a implantação do WMS SaaS, o colaborador poderá planejar os inventários por Endereço ou Produto, atribuir contagens a usuários e considerar o estoque como primeira contagem ou não.'),
        p('Para finalização do inventário, é necessário que se tenha duas contagens iguais não sequenciais. Após a execução, o usuário realizará análise dos dados antes da efetivação.'),
        p(`Feita a efetivação do inventário no WMS, serão efetuados ajustes automáticos no saldo em estoque. Uma integração do tipo inventário será gerada e enviada ao ERP ${data.erpUtilizado} para que o usuário possa seguir com os ajustes.`),

        h2('17.4. Entrada/Saída de Estoque Simplificada'),
        p('O processo de entrada/saída de estoque poderá ser realizado via mobile. O colaborador informará uma etiqueta unitizadora, o endereço, o tipo de estoque e a quantidade. Este recurso é muito utilizado na carga inicial de saldos.'),
        p(`Importante: esta funcionalidade não está integrada com o ERP ${data.erpUtilizado}.`),

        // ─── 18. INTEGRAÇÕES ────────────────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('18. Integrações'),
        h2('18.1. Painel de Integração'),
        p('No painel de integração, o colaborador poderá acompanhar todas as integrações que ocorrem no WMS SaaS, com vários filtros disponíveis. Os status apresentados são:'),
        ...[
          'Integrado: sem erros;',
          'Com erros de negócio: erros de processo que devem ser corrigidos pelo usuário para posterior reprocessamento;',
          'Erro de integração: erros a cargo da equipe de integração (ex.: servidor REST fora).',
        ].map(item => new Paragraph({
          children: [new TextRun({ text: `• ${item}`, size: 22 })],
          spacing: { before: 60, after: 60 },
          indent: { left: 360 },
        })),

        h2('18.2. Estrutura Necessária para Utilizar a Integração'),
        ...[
          'Usuário e senha exclusivos para a integração;',
          'APIs publicadas para execução (expedição contínua atualizada);',
          'URL + caminho de acesso das APIs, conforme descrito no swagger;',
          'Acesso à internet;',
          'Liberação do firewall para a URL executada;',
          'Diretórios "Propath" no app server atualizados.',
        ].map(item => new Paragraph({
          children: [new TextRun({ text: `• ${item}`, size: 22 })],
          spacing: { before: 60, after: 60 },
          indent: { left: 360 },
        })),

        // ─── 19. GAPS ───────────────────────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('19. GAPs do Processo'),
        p('Neste tópico estão relacionados os pontos necessários à operação do cliente que não estão contemplados no escopo deste projeto, seja por escopo ou por limitações em relação ao produto padrão.'),
        ...(data.gaps.length > 0 ? [
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              tableHeader(['ID', 'Processo', 'Subprocesso', 'Descrição', 'Situação Esperada', 'Possível seguir?', 'Contorno?']),
              ...data.gaps.map((gap, i) =>
                tableRow([
                  String(i + 1),
                  gap.processo,
                  gap.subprocesso,
                  gap.descricao,
                  gap.situacaoEsperada,
                  gap.possiveiseguir,
                  gap.existeContorno,
                ], i % 2 === 1)
              ),
            ],
          }),
        ] : [
          p('Nenhum GAP identificado neste levantamento.'),
        ]),

        // ─── 20. ACEITE ─────────────────────────────────────────────────────
        new Paragraph({ children: [new PageBreak()] }),
        h1('20. Aceite'),
        p('Confirmo que os processos descritos neste documento refletem as necessidades da minha operação e atendem às expectativas propostas pelo negócio.'),
        new Paragraph({ spacing: { before: 400 } }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            tableHeader(['Aprovado por', 'Assinatura', 'Data']),
            tableRow([data.aprovadoPor || '______________________________', '______________________________', data.dataAceite || '____/____/________']),
          ],
        }),
      ],
    }],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `MIT041_${data.nomeCliente.replace(/\s+/g, '_')}_V1.docx`)
}
