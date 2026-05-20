"use client"

import { useState } from "react"
import { LogIn } from "lucide-react"

export default function ImpersonateButton({ tenantId }: { tenantId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleImpersonate() {
    setLoading(true)
    setError("")

    const res = await fetch("/api/admin/impersonate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Erro ao gerar acesso.")
      return
    }

    const { token, userName } = await res.json()
    // Abrir em nova tab para o admin não perder a sessão
    window.open(`/impersonate?token=${token}`, "_blank")
  }

  return (
    <div>
      <button
        onClick={handleImpersonate}
        disabled={loading}
        className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg border border-purple-200 text-purple-600 hover:bg-purple-50 disabled:opacity-50 transition-colors"
      >
        <LogIn className="w-3.5 h-3.5" />
        {loading ? "A gerar acesso..." : "Entrar como cliente"}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
