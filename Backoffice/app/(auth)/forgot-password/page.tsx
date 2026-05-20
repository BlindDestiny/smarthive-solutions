"use client"

import { useState } from "react"
import Link from "next/link"
import { Zap, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    setLoading(false)
    if (res.ok) {
      setDone(true)
    } else {
      setError("Erro ao processar o pedido. Tenta novamente.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">SmartHive</span>
        </div>

        {done ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
            <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">✓</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Email enviado</h2>
            <p className="text-gray-500 text-sm mb-6">
              Se o email <strong>{email}</strong> estiver registado, receberás as instruções em breve.
              Verifica também a pasta de spam.
            </p>
            <Link href="/login" className="text-sky-600 hover:text-sky-700 text-sm font-medium">
              Voltar ao login
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <Link href="/login" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Link>

            <h2 className="text-2xl font-bold text-gray-900 mb-1.5">Esqueceu a password?</h2>
            <p className="text-gray-500 text-sm mb-6">
              Introduz o teu email e enviamos um link para recuperares o acesso.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  placeholder="email@exemplo.pt"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-950 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3 rounded-xl text-sm transition-colors"
              >
                {loading ? "A enviar..." : "Enviar link de recuperação"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
