"use client"

import { useEffect, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Zap } from "lucide-react"
import { Suspense } from "react"

function ImpersonateContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "error">("loading")

  useEffect(() => {
    if (!token) { setStatus("error"); return }

    signIn("impersonate", { token, redirect: false }).then((res) => {
      if (res?.ok) {
        router.push("/dashboard")
      } else {
        setStatus("error")
      }
    })
  }, [token, router])

  if (status === "error") {
    return (
      <div className="text-center">
        <p className="text-xl font-bold text-gray-900 mb-2">Link inválido ou expirado</p>
        <p className="text-gray-400 text-sm mb-6">O link de acesso expirou (10 minutos) ou já foi utilizado.</p>
        <a href="/login" className="text-sky-600 hover:underline text-sm">Voltar ao login</a>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-600 text-sm">A entrar como cliente...</p>
    </div>
  )
}

export default function ImpersonatePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">SmartHive</span>
        </div>
        <Suspense fallback={<div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />}>
          <ImpersonateContent />
        </Suspense>
      </div>
    </div>
  )
}
