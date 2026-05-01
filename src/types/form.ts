export interface Gap {
  id: string
  processo: string
  subprocesso: string
  descricao: string
  situacaoEsperada: string
  possiveiseguir: 'Sim' | 'Não'
  existeContorno: 'Sim' | 'Não'
}

export interface Filial {
  nome: string
  cidade: string
  uf: string
}

export interface FormData {
  // Step 1 — Ambientação
  nomeCliente: string
  codigoCliente: string
  nomeProjeto: string
  codigoProjeto: string
  segmentoCliente: string
  unidadeTotvs: string
  data: string
  propostaComercial: string
  gerenteTotvs: string
  gerenteCliente: string

  // Step 2 — Layout do Armazém
  filiais: Filial[]
  qtdDocas: number
  temPortaPallet: boolean
  temBlocado: boolean
  formatoCoordenadas: string

  // Step 3 — Operação
  qtdSkus: number
  qtdTurnos: number
  operadoresPorTurnoExpedicao: number
  operadoresPorTurnoRecebimento: number
  nfsMes: number
  nfsExpedicaoMes: number
  diasSemana: string

  // Step 4 — Cadastros & Características
  erpUtilizado: string
  temControleValidade: boolean
  temControleLote: boolean
  tiposEstoque: string
  temPickingFixo: boolean
  temCurvaABC: boolean

  // Step 5 — GAPs
  gaps: Gap[]

  // Step 6 — Aceite
  aprovadoPor: string
  dataAceite: string
}

export const defaultFormData: FormData = {
  nomeCliente: '',
  codigoCliente: '',
  nomeProjeto: 'Projeto de Implantação do WMS SaaS',
  codigoProjeto: '',
  segmentoCliente: '',
  unidadeTotvs: '',
  data: new Date().toLocaleDateString('pt-BR'),
  propostaComercial: '',
  gerenteTotvs: '',
  gerenteCliente: '',

  filiais: [{ nome: 'Matriz', cidade: '', uf: '' }],
  qtdDocas: 12,
  temPortaPallet: true,
  temBlocado: false,
  formatoCoordenadas: 'Bloco (B), Rua (R), Prédio (P), Andar (A), Apartamento (A)',

  qtdSkus: 2000,
  qtdTurnos: 3,
  operadoresPorTurnoExpedicao: 20,
  operadoresPorTurnoRecebimento: 10,
  nfsMes: 110,
  nfsExpedicaoMes: 32000,
  diasSemana: 'segunda a sábado',

  erpUtilizado: 'WINTHOR',
  temControleValidade: true,
  temControleLote: false,
  tiposEstoque: '',
  temPickingFixo: true,
  temCurvaABC: false,

  gaps: [],

  aprovadoPor: '',
  dataAceite: '',
}
