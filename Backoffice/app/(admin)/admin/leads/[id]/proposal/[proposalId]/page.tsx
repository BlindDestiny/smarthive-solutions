import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Printer, Send, Check } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { ADDON_CATALOG, PROPOSAL_KIND_LABEL, type ProposalKind } from "@/lib/leads/proposal-catalogs"
import { MarkSentButton } from "@/components/leads/MarkProposalSentButton"

export const dynamic = "force-dynamic"

export default async function ProposalPage({
  params,
}: { params: Promise<{ id: string; proposalId: string }> }) {
  const { id, proposalId } = await params
  const proposal = await prisma.leadProposal.findUnique({
    where: { id: proposalId },
    include: { lead: { include: { crmState: true } } },
  })
  if (!proposal || proposal.leadId !== id) notFound()

  const features = (proposal.features as string[] | null) ?? []
  const addons   = (proposal.addons   as string[] | null) ?? []
  const oneTime  = Number(proposal.totalOneTime ?? 0)
  const monthly  = Number(proposal.totalRecurring ?? 0)

  const addonsWithPrice = addons
    .map((lbl) => ADDON_CATALOG.find((a) => a.label === lbl))
    .filter((a): a is typeof ADDON_CATALOG[number] => Boolean(a))

  return (
    <>
      {/* Top bar — hidden on print */}
      <div className="print:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
          <Link href={`/admin/leads/${id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" /> Voltar ao lead
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-gray-500">
              Status: <strong className="text-gray-700">{proposal.status.toLowerCase()}</strong>
            </span>
            <button
              onClick={() => { if (typeof window !== "undefined") window.print() }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-900 text-white hover:bg-black print:hidden"
              type="button"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimir / PDF
            </button>
            {proposal.status === "DRAFT" && (
              <MarkSentButton proposalId={proposalId} />
            )}
          </div>
        </div>
      </div>

      {/* Printable proposal */}
      <div className="max-w-3xl mx-auto px-8 py-12 print:py-0 print:px-0">
        {/* Letterhead */}
        <header className="mb-12 border-b-2 border-gray-900 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-sky-600 font-medium mb-2">
                Proposta · Smart Hive Solutions
              </p>
              <h1 className="text-4xl font-semibold text-gray-900 leading-tight">
                {proposal.lead.name}
              </h1>
              {proposal.lead.city && (
                <p className="text-sm text-gray-500 mt-1">{proposal.lead.city}</p>
              )}
            </div>
            <div className="text-right text-xs text-gray-500 leading-relaxed">
              <p className="font-medium text-gray-700">Smart Hive Solutions</p>
              <p>geral@smarthivesolutions.pt</p>
              <p>smarthivesolutions.pt</p>
              <p className="mt-2 tabular-nums">
                {new Date(proposal.createdAt).toLocaleDateString("pt-PT")}
              </p>
              <p className="text-[10px] tabular-nums text-gray-400 mt-0.5">
                №&nbsp;{proposal.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        </header>

        {/* Scope */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Âmbito</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Esta proposta cobre a {PROPOSAL_KIND_LABEL[proposal.kind as ProposalKind].toLowerCase()} para a{" "}
            <strong>{proposal.lead.name}</strong>, com o conjunto de funcionalidades e
            extras detalhados abaixo. Apresentamos preço fechado, sem surpresas.
          </p>
        </section>

        {/* Features */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Incluído</h2>
          <ul className="space-y-1.5">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Add-ons */}
        {addonsWithPrice.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Extras selecionados</h2>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {addonsWithPrice.map((a) => (
                  <tr key={a.label}>
                    <td className="py-2 text-gray-700">{a.label}</td>
                    <td className="py-2 text-right tabular-nums text-gray-700">
                      {a.price.toLocaleString("pt-PT")} €{a.kind === "/mês" ? "/mês" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {/* Pricing */}
        <section className="mb-10 bg-gray-50 border border-gray-200 rounded-xl p-6 print:bg-white print:border-2 print:border-gray-900">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Investimento</h2>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-gray-700">Pagamento único (one-time)</span>
              <span className="text-2xl font-semibold text-gray-900 tabular-nums">
                {oneTime.toLocaleString("pt-PT")} €
              </span>
            </div>
            {monthly > 0 && (
              <div className="flex items-baseline justify-between pt-2 border-t border-gray-200">
                <span className="text-sm text-gray-700">Mensalidade recorrente</span>
                <span className="text-2xl font-semibold text-gray-900 tabular-nums">
                  {monthly.toLocaleString("pt-PT")} €<span className="text-sm font-normal text-gray-500">/mês</span>
                </span>
              </div>
            )}
          </div>
          <p className="text-[11px] text-gray-500 mt-4 leading-relaxed">
            Valores não incluem IVA à taxa em vigor. Faturação: 50% adjudicação + 50% entrega.
            Mensalidades faturadas no início de cada mês.
          </p>
        </section>

        {/* Terms */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Condições</h2>
          <ul className="text-sm text-gray-700 space-y-1.5 leading-relaxed">
            <li>• Prazo de entrega típico: 3-5 semanas a partir da adjudicação e receção de conteúdos</li>
            <li>• 2 rondas de revisão incluídas no escopo</li>
            <li>• Hospedagem no primeiro ano, renovação anual à parte</li>
            <li>• Garantia de 90 dias após go-live para correções</li>
            <li>• Validade desta proposta: 30 dias</li>
          </ul>
        </section>

        <footer className="pt-8 border-t border-gray-200 text-center text-xs text-gray-400 print:fixed print:bottom-4 print:inset-x-0">
          Smart Hive Solutions · proposta nº&nbsp;{proposal.id.slice(-8).toUpperCase()} · gerada por{" "}
          {new Date(proposal.createdAt).toLocaleDateString("pt-PT")}
        </footer>
      </div>

      <style>{`@media print {
        body { background: white !important; }
        nav, aside, header[role="banner"] { display: none !important; }
      }`}</style>
    </>
  )
}
