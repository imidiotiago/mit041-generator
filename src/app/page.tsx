import FormWizard from '@/components/FormWizard'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-900 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
          TOTVS WMS SaaS
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Gerador de Documento MIT041
        </h1>
        <p className="text-gray-600 text-lg">
          Preencha o questionário e baixe o Diagrama de Processos pronto para assinatura em <strong>Word</strong> e <strong>PDF</strong>.
        </p>
      </div>

      <FormWizard />

      <p className="text-center text-xs text-gray-400 mt-10">
        Gerado localmente no browser · Nenhum dado é enviado a servidores
      </p>
    </main>
  )
}
