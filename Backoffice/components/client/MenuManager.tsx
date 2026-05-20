"use client"

import { useState, useMemo } from "react"
import { Plus, Pencil, Trash2, Check, X, Leaf, Tag } from "lucide-react"
import { cn } from "@/lib/utils"

type MenuItem = {
  id: string
  category: string
  name: string
  description: string | null
  price: number
  badge: string | null
  imageUrl: string | null
  isVegetarian: boolean
  isAvailable: boolean
  order: number
}

type FormState = {
  category: string
  name: string
  description: string
  price: string
  badge: string
  isVegetarian: boolean
  isAvailable: boolean
}

const EMPTY_FORM: FormState = {
  category: "",
  name: "",
  description: "",
  price: "",
  badge: "",
  isVegetarian: false,
  isAvailable: true,
}

function itemToForm(item: MenuItem): FormState {
  return {
    category: item.category,
    name: item.name,
    description: item.description ?? "",
    price: String(item.price),
    badge: item.badge ?? "",
    isVegetarian: item.isVegetarian,
    isAvailable: item.isAvailable,
  }
}

export default function MenuManager({ initialItems }: { initialItems: MenuItem[] }) {
  const [items, setItems] = useState<MenuItem[]>(initialItems)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM)
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  const categories = useMemo(() => [...new Set(items.map((i) => i.category))], [items])
  const activeTab = activeCategory ?? categories[0] ?? ""
  const visibleItems = items.filter((i) => i.category === activeTab)

  async function handleSaveEdit() {
    if (!editingId) return
    setSaving(true)
    const res = await fetch(`/api/client/menu/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editForm,
        price: parseFloat(editForm.price) || 0,
        badge: editForm.badge || undefined,
        description: editForm.description || undefined,
      }),
    })
    if (res.ok) {
      const updated = await res.json()
      setItems((prev) => prev.map((i) => (i.id === editingId ? updated : i)))
      setEditingId(null)
    }
    setSaving(false)
  }

  async function handleAdd() {
    if (!addForm.name || !addForm.category || !addForm.price) return
    setSaving(true)
    const res = await fetch("/api/client/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...addForm,
        price: parseFloat(addForm.price) || 0,
        badge: addForm.badge || undefined,
        description: addForm.description || undefined,
        order: items.filter((i) => i.category === addForm.category).length,
      }),
    })
    if (res.ok) {
      const created = await res.json()
      setItems((prev) => [...prev, created])
      setAddForm(EMPTY_FORM)
      setShowAdd(false)
      setActiveCategory(created.category)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    const res = await fetch(`/api/client/menu/${id}`, { method: "DELETE" })
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id))
    }
    setDeletingId(null)
  }

  const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
  const labelClass = "block text-xs font-medium text-gray-600 mb-1"

  return (
    <div>
      {/* View toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setPreviewMode(false)}
            className={cn("px-3 py-1.5 text-sm rounded-md transition-colors", !previewMode ? "bg-white shadow-sm text-gray-900 font-medium" : "text-gray-500")}
          >
            Editar
          </button>
          <button
            onClick={() => setPreviewMode(true)}
            className={cn("px-3 py-1.5 text-sm rounded-md transition-colors", previewMode ? "bg-white shadow-sm text-gray-900 font-medium" : "text-gray-500")}
          >
            Preview
          </button>
        </div>
        <button
          onClick={() => { setShowAdd(true); setAddForm(EMPTY_FORM) }}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Novo item
        </button>
      </div>

      {/* Category tabs */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === cat
                  ? "border-sky-500 text-sky-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {cat}
              <span className="ml-2 text-xs text-gray-400">
                ({items.filter((i) => i.category === cat).length})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Preview Mode */}
      {previewMode ? (
        <div className="grid md:grid-cols-2 gap-x-10">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex items-start justify-between gap-6 py-4 border-b border-gray-100",
                !item.isAvailable && "opacity-40"
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                  {item.isVegetarian && <Leaf className="w-3.5 h-3.5 text-green-500" />}
                  {item.badge && (
                    <span className="text-[10px] font-medium uppercase tracking-wide text-amber-600 border border-amber-200 bg-amber-50 px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                  {!item.isAvailable && (
                    <span className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded">Indisponível</span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                )}
              </div>
              <span className="font-semibold text-gray-900 text-sm shrink-0">€{item.price.toFixed(2)}</span>
            </div>
          ))}
          {visibleItems.length === 0 && (
            <p className="text-sm text-gray-400 py-8">Nenhum item nesta categoria.</p>
          )}
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-3">
          {visibleItems.map((item) =>
            editingId === item.id ? (
              /* Inline edit form */
              <div key={item.id} className="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Nome</label>
                    <input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Categoria</label>
                    <input value={editForm.category} onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Descrição</label>
                  <textarea value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} rows={2} className={inputClass + " resize-none"} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Preço (€)</label>
                    <input type="number" step="0.01" min="0" value={editForm.price} onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Badge (opcional)</label>
                    <input value={editForm.badge} onChange={(e) => setEditForm((p) => ({ ...p, badge: e.target.value }))} placeholder="Ex: Favorito" className={inputClass} />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={editForm.isVegetarian} onChange={(e) => setEditForm((p) => ({ ...p, isVegetarian: e.target.checked }))} className="rounded" />
                    <Leaf className="w-3.5 h-3.5 text-green-500" /> Vegetariano
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={editForm.isAvailable} onChange={(e) => setEditForm((p) => ({ ...p, isAvailable: e.target.checked }))} className="rounded" />
                    Disponível
                  </label>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={handleSaveEdit} disabled={saving} className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
                    <Check className="w-3.5 h-3.5" /> {saving ? "A guardar..." : "Guardar"}
                  </button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <X className="w-3.5 h-3.5" /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              /* Normal row */
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-4 p-3.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors group",
                  !item.isAvailable && "opacity-60"
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    {item.isVegetarian && <Leaf className="w-3.5 h-3.5 text-green-500" />}
                    {item.badge && (
                      <span className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-amber-600 border border-amber-200 bg-amber-50 px-1.5 py-0.5 rounded">
                        <Tag className="w-2.5 h-2.5" /> {item.badge}
                      </span>
                    )}
                    {!item.isAvailable && (
                      <span className="text-[10px] text-gray-400 border border-gray-200 px-1.5 py-0.5 rounded">Indisponível</span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-md">{item.description}</p>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-700 shrink-0">€{item.price.toFixed(2)}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditingId(item.id); setEditForm(itemToForm(item)) }}
                    className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          )}

          {visibleItems.length === 0 && !showAdd && (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-400">Nenhum item nesta categoria.</p>
            </div>
          )}
        </div>
      )}

      {/* Add item form */}
      {showAdd && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium text-gray-800">Novo item</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nome *</label>
              <input value={addForm.name} onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))} placeholder="Ex: Pão de Queijo" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Categoria *</label>
              <input
                value={addForm.category}
                onChange={(e) => setAddForm((p) => ({ ...p, category: e.target.value }))}
                placeholder="Ex: Entradas"
                list="categories-list"
                className={inputClass}
              />
              <datalist id="categories-list">
                {categories.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>
          <div>
            <label className={labelClass}>Descrição</label>
            <textarea value={addForm.description} onChange={(e) => setAddForm((p) => ({ ...p, description: e.target.value }))} rows={2} placeholder="Descrição do item..." className={inputClass + " resize-none"} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Preço (€) *</label>
              <input type="number" step="0.01" min="0" value={addForm.price} onChange={(e) => setAddForm((p) => ({ ...p, price: e.target.value }))} placeholder="0.00" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Badge (opcional)</label>
              <input value={addForm.badge} onChange={(e) => setAddForm((p) => ({ ...p, badge: e.target.value }))} placeholder="Ex: Favorito, Novo" className={inputClass} />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={addForm.isVegetarian} onChange={(e) => setAddForm((p) => ({ ...p, isVegetarian: e.target.checked }))} className="rounded" />
              <Leaf className="w-3.5 h-3.5 text-green-500" /> Vegetariano
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={addForm.isAvailable} onChange={(e) => setAddForm((p) => ({ ...p, isAvailable: e.target.checked }))} className="rounded" />
              Disponível
            </label>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button onClick={handleAdd} disabled={saving || !addForm.name || !addForm.category || !addForm.price} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-40">
              <Plus className="w-3.5 h-3.5" /> {saving ? "A criar..." : "Criar item"}
            </button>
            <button onClick={() => setShowAdd(false)} className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
