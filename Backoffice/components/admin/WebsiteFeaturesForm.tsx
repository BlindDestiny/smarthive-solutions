"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Share2, UtensilsCrossed, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

type Features = {
  hasEvents: boolean
  hasSocial: boolean
  hasMenu: boolean
  hasReservations: boolean
}

type Props = {
  tenantId: string
  features: Features
}

const FEATURE_LIST = [
  { key: "hasEvents",       label: "Eventos",        description: "Gestão de eventos, datas e bilhetes", icon: Calendar },
  { key: "hasSocial",       label: "Redes Sociais",  description: "Links para Instagram, Facebook, etc.", icon: Share2 },
  { key: "hasMenu",         label: "Menu / Ementa",  description: "CRUD de items do menu por categoria",  icon: UtensilsCrossed },
  { key: "hasReservations", label: "Reservas",       description: "Editor de contacto, telefone e WhatsApp", icon: Phone },
] as const

export default function WebsiteFeaturesForm({ tenantId, features: initialFeatures }: Props) {
  const router = useRouter()
  const [features, setFeatures] = useState<Features>(initialFeatures)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await fetch(`/api/admin/tenants/${tenantId}/website`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(features),
    })
    setSaving(false)
    setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-5">
        <h2 className="font-medium text-gray-900">Funcionalidades do Website</h2>
        <p className="text-sm text-gray-400 mt-1">
          Activa ou desactiva secções no painel do cliente.
        </p>
      </div>

      <div className="space-y-3">
        {FEATURE_LIST.map(({ key, label, description, icon: Icon }) => {
          const enabled = features[key as keyof Features]
          return (
            <div
              key={key}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-colors cursor-pointer",
                enabled ? "border-sky-200 bg-sky-50" : "border-gray-200 bg-gray-50"
              )}
              onClick={() => setFeatures((p) => ({ ...p, [key]: !p[key as keyof Features] }))}
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", enabled ? "bg-sky-100" : "bg-gray-200")}>
                  <Icon className={cn("w-4 h-4", enabled ? "text-sky-600" : "text-gray-400")} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400">{description}</p>
                </div>
              </div>
              <div className={cn(
                "relative w-10 h-5 rounded-full transition-colors shrink-0",
                enabled ? "bg-sky-500" : "bg-gray-300"
              )}>
                <div className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                  enabled ? "translate-x-5" : "translate-x-0.5"
                )} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {saving ? "A guardar..." : "Guardar"}
        </button>
        {saved && <span className="text-sm text-green-600">Funcionalidades actualizadas!</span>}
      </div>
    </div>
  )
}
