"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Plan = { id: string; name: string; priceEur: number }
type Tenant = { id: string; name: string; status: string; planId: string | null }

export default function EditTenantForm({ tenant, plans }: { tenant: Tenant; plans: Plan[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: tenant.name,
    planId: tenant.planId ?? "",
    status: tenant.status,
  })

  async function handleSave() {
    setLoading(true)
    setSaved(false)
    await fetch(`/api/admin/tenants/${tenant.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setLoading(false)
    setSaved(true)
    router.refresh()
  }

  async function handleSuspend() {
    setLoading(true)
    await fetch(`/api/admin/tenants/${tenant.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: tenant.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED" }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 className="font-medium text-gray-900">Configurações</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome</label>
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Plano</label>
          <select
            value={form.planId}
            onChange={(e) => setForm((p) => ({ ...p, planId: e.target.value }))}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white"
          >
            <option value="">Sem plano</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} — €{plan.priceEur}/mês
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {loading ? "A guardar..." : "Guardar"}
        </button>
        {saved && <span className="text-sm text-green-600">Guardado!</span>}

        <button
          onClick={handleSuspend}
          disabled={loading}
          className="ml-auto text-sm font-medium px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
        >
          {tenant.status === "SUSPENDED" ? "Reativar cliente" : "Suspender cliente"}
        </button>
      </div>
    </div>
  )
}
