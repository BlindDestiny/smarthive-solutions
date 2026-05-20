"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", slug: "", userEmail: "", userName: "", userPassword: "", planId: "" })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => {
      const next = { ...prev, [name]: value }
      if (name === "name") next.slug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("/api/admin/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Erro ao criar cliente.")
      return
    }
    router.push("/admin/clients")
  }

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/admin/clients" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Voltar aos clientes
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Novo Cliente</h1>
      <p className="text-gray-500 mb-8">Cria um novo tenant e conta de utilizador.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-medium text-gray-900">Empresa / Negócio</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome da empresa</label>
              <input name="name" value={form.name} onChange={handleChange} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" placeholder="Cave Lounge" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug (URL)</label>
              <input name="slug" value={form.slug} onChange={handleChange} required pattern="[a-z0-9-]+" className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent font-mono" placeholder="cave-lounge" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Plano</label>
            <select name="planId" value={form.planId} onChange={handleChange} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white">
              <option value="">Selecionar plano...</option>
              <option value="plan-free">Gratuito — €0/mês</option>
              <option value="plan-landing">Landing Page — €49/mês</option>
              <option value="plan-pro">Landing + Subscrição — €99/mês</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-medium text-gray-900">Conta de Acesso do Cliente</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome</label>
              <input name="userName" value={form.userName} onChange={handleChange} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" placeholder="João Silva" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input name="userEmail" type="email" value={form.userEmail} onChange={handleChange} required className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" placeholder="joao@empresa.pt" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password inicial</label>
            <input name="userPassword" type="password" value={form.userPassword} onChange={handleChange} required minLength={8} className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" placeholder="Mínimo 8 caracteres" />
          </div>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors">
            {loading ? "A criar..." : "Criar Cliente"}
          </button>
          <Link href="/admin/clients" className="px-6 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">Cancelar</Link>
        </div>
      </form>
    </div>
  )
}
