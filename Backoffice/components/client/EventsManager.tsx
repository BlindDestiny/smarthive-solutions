"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Calendar, Pencil, X, Check, Ban } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"

type Event = {
  id: string
  title: string
  description: string
  date: string
  price: number | null
  capacity: number | null
  imageUrl: string
  isPublished: boolean
  isEnded: boolean
}

type EditForm = {
  title: string
  description: string
  date: string
  price: string
  capacity: string
}

export default function EventsManager({
  websiteId,
  initialEvents,
}: {
  websiteId: string
  initialEvents: Event[]
}) {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [showNewForm, setShowNewForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [newForm, setNewForm] = useState<EditForm>({ title: "", description: "", date: "", price: "", capacity: "" })
  const [editForm, setEditForm] = useState<EditForm>({ title: "", description: "", date: "", price: "", capacity: "" })

  // ── Criar ──────────────────────────────────────────────────────────────────
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving("new")
    const res = await fetch("/api/client/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newForm.title,
        description: newForm.description || undefined,
        date: new Date(newForm.date).toISOString(),
        price: newForm.price ? parseFloat(newForm.price) : null,
        capacity: newForm.capacity ? parseInt(newForm.capacity) : null,
      }),
    })
    setSaving(null)
    if (res.ok) {
      setShowNewForm(false)
      setNewForm({ title: "", description: "", date: "", price: "", capacity: "" })
      router.refresh()
    }
  }

  // ── Abrir edição ───────────────────────────────────────────────────────────
  function startEdit(event: Event) {
    setEditingId(event.id)
    const localDate = new Date(event.date)
    const pad = (n: number) => String(n).padStart(2, "0")
    const formatted = `${localDate.getFullYear()}-${pad(localDate.getMonth() + 1)}-${pad(localDate.getDate())}T${pad(localDate.getHours())}:${pad(localDate.getMinutes())}`
    setEditForm({
      title: event.title,
      description: event.description ?? "",
      date: formatted,
      price: event.price != null ? String(event.price) : "",
      capacity: event.capacity != null ? String(event.capacity) : "",
    })
  }

  // ── Guardar edição ─────────────────────────────────────────────────────────
  async function handleSaveEdit(id: string) {
    setSaving(id)
    const res = await fetch(`/api/client/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editForm.title,
        description: editForm.description || undefined,
        date: new Date(editForm.date).toISOString(),
        price: editForm.price ? parseFloat(editForm.price) : null,
        capacity: editForm.capacity ? parseInt(editForm.capacity) : null,
      }),
    })
    setSaving(null)
    if (res.ok) {
      const updated = await res.json()
      setEvents((prev) => prev.map((e) => e.id === id ? { ...e, ...updated } : e))
      setEditingId(null)
    }
  }

  // ── Terminar evento ────────────────────────────────────────────────────────
  async function handleEnd(id: string) {
    setSaving(id + "-end")
    const res = await fetch(`/api/client/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isEnded: true, isPublished: false }),
    })
    setSaving(null)
    if (res.ok) {
      setEvents((prev) => prev.map((e) => e.id === id ? { ...e, isEnded: true, isPublished: false } : e))
    }
  }

  // ── Reativar evento ────────────────────────────────────────────────────────
  async function handleReactivate(id: string) {
    setSaving(id + "-end")
    const res = await fetch(`/api/client/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isEnded: false }),
    })
    setSaving(null)
    if (res.ok) {
      setEvents((prev) => prev.map((e) => e.id === id ? { ...e, isEnded: false } : e))
    }
  }

  const active  = events.filter((e) => !e.isEnded)
  const ended   = events.filter((e) => e.isEnded)

  return (
    <div className="space-y-6">
      {/* Eventos ativos */}
      <div className="space-y-3">
        {active.length === 0 && !showNewForm && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Nenhum evento ativo.</p>
          </div>
        )}

        {active.map((event) => (
          <div key={event.id} className={cn("bg-white rounded-xl border overflow-hidden transition-all", editingId === event.id ? "border-sky-300 shadow-sm" : "border-gray-200")}>
            {editingId === event.id ? (
              /* Modo edição */
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Título</label>
                    <input value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Data e hora</label>
                    <input type="datetime-local" value={editForm.date} onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Preço (€)</label>
                    <input type="number" step="0.01" value={editForm.price} onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
                      placeholder="0.00" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Descrição</label>
                    <textarea value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSaveEdit(event.id)} disabled={saving === event.id}
                    className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-colors">
                    <Check className="w-3.5 h-3.5" />
                    {saving === event.id ? "A guardar..." : "Guardar"}
                  </button>
                  <button onClick={() => setEditingId(null)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 px-3.5 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <X className="w-3.5 h-3.5" /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              /* Modo visualização */
              <div className="flex items-start gap-4 p-5">
                <div className="w-12 h-12 bg-sky-50 border border-sky-100 rounded-xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-sky-600 leading-none">{new Date(event.date).toLocaleDateString("pt-PT", { day: "2-digit" })}</span>
                  <span className="text-[10px] text-sky-500 uppercase">{new Date(event.date).toLocaleDateString("pt-PT", { month: "short" })}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(event.date).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
                    {event.price != null && ` · €${event.price}`}
                  </p>
                  {event.description && <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{event.description}</p>}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => startEdit(event)} className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors" title="Editar">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleEnd(event.id)} disabled={saving === event.id + "-end"}
                    className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Terminar evento">
                    <Ban className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Formulário novo evento */}
      {showNewForm ? (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-sky-200 p-5 space-y-4">
          <h3 className="font-medium text-gray-900 text-sm">Novo Evento</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Título</label>
              <input value={newForm.title} onChange={(e) => setNewForm((p) => ({ ...p, title: e.target.value }))} required
                placeholder="Nome do evento" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Data e hora</label>
              <input type="datetime-local" value={newForm.date} onChange={(e) => setNewForm((p) => ({ ...p, date: e.target.value }))} required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Preço (€)</label>
              <input type="number" step="0.01" value={newForm.price} onChange={(e) => setNewForm((p) => ({ ...p, price: e.target.value }))}
                placeholder="0.00" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Descrição</label>
              <textarea value={newForm.description} onChange={(e) => setNewForm((p) => ({ ...p, description: e.target.value }))} rows={3}
                placeholder="Descrição do evento..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving === "new"}
              className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              {saving === "new" ? "A criar..." : "Criar evento"}
            </button>
            <button type="button" onClick={() => setShowNewForm(false)}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">Cancelar</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowNewForm(true)}
          className="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-sky-300 hover:text-sky-600 transition-colors">
          <Plus className="w-4 h-4" /> Adicionar evento
        </button>
      )}

      {/* Eventos terminados */}
      {ended.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Terminados ({ended.length})</p>
          <div className="space-y-2">
            {ended.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl opacity-60">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-500 line-through">{event.title}</p>
                  <p className="text-xs text-gray-400">{formatDate(event.date)}</p>
                </div>
                <button onClick={() => handleReactivate(event.id)} disabled={saving === event.id + "-end"}
                  className="text-xs text-gray-400 hover:text-sky-600 px-2.5 py-1.5 rounded-lg hover:bg-sky-50 border border-gray-200 hover:border-sky-200 transition-colors whitespace-nowrap">
                  Reativar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
