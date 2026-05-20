import { Send, Mail, MessageSquare } from "lucide-react"

export default function OutreachPage() {
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-widest text-sky-600 mb-1">Lead Machine</p>
        <h1 className="text-3xl font-semibold text-gray-900">Outreach</h1>
        <p className="text-sm text-gray-500 mt-1">
          Templates de email/WhatsApp + envio em lote (em construção)
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-gray-900">Templates de email</h3>
          </div>
          <p className="text-sm text-gray-500">
            Por vertical + por momento do funnel (cold initial, follow-up #1,
            follow-up #2, breakup). Renderiza com dados do lead, envia via
            Resend, regista no <code className="text-gray-700 bg-gray-100 px-1 rounded text-xs">LeadEmailLog</code>.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-gray-900">WhatsApp links</h3>
          </div>
          <p className="text-sm text-gray-500">
            Gera <code className="text-gray-700 bg-gray-100 px-1 rounded text-xs">wa.me/351...</code>{" "}
            com texto pré-preenchido por vertical. Click no detalhe do lead
            abre WhatsApp Web/App, regista atividade automaticamente.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 border-dashed rounded-xl p-8 text-center">
        <Send className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-gray-900">Phase 5 — Outreach automation</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
          Pré-requisito: <strong className="text-gray-700">SPF + DKIM</strong> do
          smarthivesolutions.pt validados (passo já documentado). Depois disso:
          templates por vertical + sequência automática + tracking de aberturas.
        </p>
      </div>
    </div>
  )
}
