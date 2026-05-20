"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { FileText, X, ArrowRight, Check } from "lucide-react"
import {
  FEATURES_CATALOG, ADDON_CATALOG, DEFAULT_PRICES,
  PROPOSAL_KIND_LABEL, defaultFeatures, type ProposalKind,
} from "@/lib/leads/proposal-catalogs"
import { createProposal } from "@/lib/leads/proposal-mutations"

export function ProposalBuilderButton({ leadId }: { leadId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [kind, setKind] = useState<ProposalKind>("new")
  const [basePrice, setBasePrice] = useState(DEFAULT_PRICES.new)
  const [features, setFeatures] = useState<Set<string>>(new Set(defaultFeatures()))
  const [addons, setAddons] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  function pickKind(k: ProposalKind) {
    setKind(k)
    setBasePrice(DEFAULT_PRICES[k])
  }

  function toggleFeature(label: string) {
    const n = new Set(features)
    n.has(label) ? n.delete(label) : n.add(label)
    setFeatures(n)
  }

  function toggleAddon(label: string) {
    const n = new Set(addons)
    n.has(label) ? n.delete(label) : n.add(label)
    setAddons(n)
  }

  // Live totals
  let oneTime = basePrice
  let monthly = 0
  for (const a of ADDON_CATALOG) {
    if (!addons.has(a.label)) continue
    if (a.kind === "/mês") monthly += a.price
    else oneTime += a.price
  }

  function submit() {
    setError(null)
    startTransition(async () => {
      try {
        const r = await createProposal({
          leadId, kind, basePrice,
          features: [...features],
          addons:   [...addons],
        })
        setOpen(false)
        router.push(`/admin/leads/${leadId}/proposal/${r.proposalId}`)
      } catch (e) {
        setError((e as Error).message)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-orange-500 hover:bg-orange-600 text-white"
      >
        <FileText className="w-3.5 h-3.5" /> Criar proposta
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Construir proposta</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Kind + base price */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5">Tipo</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["new", "rebuild"] as ProposalKind[]).map((k) => (
                      <button
                        key={k}
                        onClick={() => pickKind(k)}
                        className={`px-3 py-2 text-sm font-medium rounded border ${
                          kind === k
                            ? "border-orange-500 bg-orange-50 text-orange-900"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {PROPOSAL_KIND_LABEL[k]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-widest text-gray-500 block mb-1.5">Preço base (€)</label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(parseInt(e.target.value) || 0)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 tabular-nums"
                  />
                </div>
              </div>

              {/* Features by category */}
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Features incluídas</h4>
              <div className="space-y-3 mb-5">
                {Object.entries(FEATURES_CATALOG).map(([cat, items]) => (
                  <div key={cat} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-[11px] font-medium text-gray-700 mb-2">{cat}</p>
                    <div className="space-y-1">
                      {items.map((f) => (
                        <label key={f.label} className="flex items-start gap-2 text-xs text-gray-700 cursor-pointer hover:text-gray-900">
                          <input
                            type="checkbox"
                            checked={features.has(f.label)}
                            onChange={() => toggleFeature(f.label)}
                            className="mt-0.5 accent-orange-500"
                          />
                          <span>{f.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Addons */}
              <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Add-ons (com preço extra)</h4>
              <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                {ADDON_CATALOG.map((a) => (
                  <label key={a.label} className="flex items-center justify-between gap-2 text-xs text-gray-700 cursor-pointer hover:text-gray-900">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={addons.has(a.label)}
                        onChange={() => toggleAddon(a.label)}
                        className="accent-orange-500"
                      />
                      <span>{a.label}</span>
                    </span>
                    <span className="tabular-nums text-gray-500">
                      {a.price.toLocaleString("pt-PT")} €{a.kind === "/mês" ? "/mês" : ""}
                    </span>
                  </label>
                ))}
              </div>

              {error && (
                <p className="mt-4 text-xs text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {error}
                </p>
              )}
            </div>

            {/* Totals + submit */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-3 bg-gray-50">
              <div className="text-sm">
                <span className="text-gray-500">Total: </span>
                <span className="font-semibold text-gray-900 tabular-nums">
                  {oneTime.toLocaleString("pt-PT")} € <span className="text-xs text-gray-500">one-time</span>
                </span>
                {monthly > 0 && (
                  <>
                    <span className="text-gray-400 mx-2">+</span>
                    <span className="font-semibold text-gray-900 tabular-nums">
                      {monthly.toLocaleString("pt-PT")} €<span className="text-xs text-gray-500">/mês</span>
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                  Cancelar
                </button>
                <button
                  onClick={submit}
                  disabled={pending}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg disabled:opacity-40"
                >
                  {pending ? "A criar…" : "Criar e abrir"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
