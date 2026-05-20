"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Zap, Eye, EyeOff } from "lucide-react"

function ResetForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError("As passwords não coincidem."); return }

    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })

    setLoading(false)

    if (res.ok) {
      setDone(true)
      setTimeout(() => router.push("/login"), 3000)
    } else {
      const data = await res.json()
      setError(data.error || "Erro ao redefinir password.")
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Link inválido.</p>
        <Link href="/forgot-password" className="text-sky-600 text-sm mt-2 inline-block">Pedir novo link</Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-600 text-xl">✓</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Password redefinida</h2>
        <p className="text-gray-500 text-sm">A redirecionar para o login...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Nova password</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Mínimo 8 caracteres"
            className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          <button type="button" onClick={() => setShowPw(!showPw)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar password</label>
        <input
          type={showPw ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          placeholder="Repetir password"
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
        {loading ? "A guardar..." : "Definir nova password"}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">SmartHive</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-1.5">Nova password</h2>
          <p className="text-gray-500 text-sm mb-6">Escolhe uma password segura para a tua conta.</p>
          <Suspense>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
