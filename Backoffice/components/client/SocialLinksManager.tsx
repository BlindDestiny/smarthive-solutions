"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Instagram, Facebook, Twitter, Youtube, Linkedin, Globe } from "lucide-react"

type SocialLink = { id: string; platform: string; url: string; icon: string; order: number }

const PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: "Instagram" },
  { value: "facebook", label: "Facebook", icon: "Facebook" },
  { value: "twitter", label: "X / Twitter", icon: "Twitter" },
  { value: "youtube", label: "YouTube", icon: "Youtube" },
  { value: "linkedin", label: "LinkedIn", icon: "Linkedin" },
  { value: "website", label: "Website", icon: "Globe" },
]

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Instagram, Facebook, Twitter, Youtube, Linkedin, Globe,
}

export default function SocialLinksManager({
  websiteId,
  initialLinks,
}: {
  websiteId: string
  initialLinks: SocialLink[]
}) {
  const router = useRouter()
  const [links, setLinks] = useState<SocialLink[]>(initialLinks)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ platform: "instagram", url: "", icon: "Instagram" })

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/client/social", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: links.length }),
    })

    setLoading(false)
    if (res.ok) {
      setShowForm(false)
      setForm({ platform: "instagram", url: "", icon: "Instagram" })
      router.refresh()
    }
  }

  async function handleDelete(linkId: string) {
    await fetch(`/api/client/social/${linkId}`, { method: "DELETE" })
    setLinks((prev) => prev.filter((l) => l.id !== linkId))
  }

  function handlePlatformChange(value: string) {
    const platform = PLATFORMS.find((p) => p.value === value)
    setForm((prev) => ({ ...prev, platform: value, icon: platform?.icon ?? "Globe" }))
  }

  return (
    <div className="space-y-3">
      {links.map((link) => {
        const Icon = ICONS[link.icon] ?? Globe
        return (
          <div key={link.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 capitalize">{link.platform}</p>
              <p className="text-xs text-gray-400 truncate">{link.url}</p>
            </div>
            <button
              onClick={() => handleDelete(link.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )
      })}

      {links.length === 0 && !showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Globe className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Nenhuma rede social adicionada.</p>
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-sky-200 p-5 space-y-4">
          <h3 className="font-medium text-gray-900">Nova Rede Social</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Plataforma</label>
              <select
                value={form.platform}
                onChange={(e) => handlePlatformChange(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white"
              >
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">URL</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                required
                placeholder="https://instagram.com/..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? "A adicionar..." : "Adicionar"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-sky-300 hover:text-sky-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar rede social
        </button>
      )}
    </div>
  )
}
