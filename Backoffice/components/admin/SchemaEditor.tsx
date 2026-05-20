"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Save, ChevronDown, GripVertical, Download } from "lucide-react"
import { type ContentField, type ContentFieldType, FIELD_TYPES, SCHEMA_TEMPLATES, groupBySection } from "@/lib/content-schema"
import { cn } from "@/lib/utils"

const FIELD_TYPE_ICONS: Record<ContentFieldType, string> = {
  text:     "Aa",
  textarea: "¶",
  image:    "🖼",
  url:      "🔗",
  email:    "✉",
  phone:    "📞",
  color:    "🎨",
  number:   "#",
}

export default function SchemaEditor({
  tenantId,
  initialFields,
}: {
  tenantId: string
  initialFields: ContentField[]
}) {
  const router = useRouter()
  const [fields, setFields] = useState<ContentField[]>(initialFields)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  function addField() {
    const newField: ContentField = {
      key: "",
      label: "",
      type: "text",
      section: "Geral",
      placeholder: "",
    }
    setFields((prev) => [...prev, newField])
    setEditingIndex(fields.length)
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index))
    if (editingIndex === index) setEditingIndex(null)
  }

  function updateField(index: number, patch: Partial<ContentField>) {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)))
  }

  function applyTemplate(templateKey: string) {
    const template = SCHEMA_TEMPLATES[templateKey]
    if (!template) return
    if (fields.length > 0 && !confirm(`Substituir os ${fields.length} campos actuais pelo template "${template.label}"?`)) return
    setFields(template.fields)
    setShowTemplates(false)
    setEditingIndex(null)
  }

  async function handleSave() {
    // Validar que todos os campos têm key e label
    const invalid = fields.some((f) => !f.key.trim() || !f.label.trim())
    if (invalid) {
      alert("Todos os campos precisam de ter uma chave e um nome.")
      return
    }
    const duplicateKeys = fields.map((f) => f.key).filter((k, i, arr) => arr.indexOf(k) !== i)
    if (duplicateKeys.length > 0) {
      alert(`Chaves duplicadas: ${duplicateKeys.join(", ")}`)
      return
    }

    setLoading(true)
    const res = await fetch(`/api/admin/tenants/${tenantId}/schema`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    })
    setLoading(false)
    if (res.ok) {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const sections = [...new Set(fields.map((f) => f.section))].filter(Boolean)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {fields.length} campo{fields.length !== 1 ? "s" : ""} definido{fields.length !== 1 ? "s" : ""}
            {sections.length > 0 && ` · ${sections.length} secção${sections.length !== 1 ? "ões" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Templates */}
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700"
            >
              <Download className="w-3.5 h-3.5" />
              Importar template
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showTemplates && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-[200px] py-1">
                {Object.entries(SCHEMA_TEMPLATES).map(([key, { label }]) => (
                  <button
                    key={key}
                    onClick={() => applyTemplate(key)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={addField}
            className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo campo
          </button>
        </div>
      </div>

      {/* Preview por secções */}
      {fields.length > 0 && editingIndex === null && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pré-visualização</p>
          {Object.entries(groupBySection(fields)).map(([section, sectionFields]) => (
            <div key={section}>
              <p className="text-xs font-semibold text-gray-400 mb-1.5">{section}</p>
              <div className="flex flex-wrap gap-1.5">
                {sectionFields.map((field) => (
                  <span
                    key={field.key}
                    onClick={() => setEditingIndex(fields.indexOf(field))}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 cursor-pointer hover:border-sky-300 hover:bg-sky-50 transition-colors"
                  >
                    <span className="text-gray-400">{FIELD_TYPE_ICONS[field.type]}</span>
                    {field.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lista de campos */}
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div
            key={index}
            className={cn(
              "bg-white border rounded-xl transition-all",
              editingIndex === index ? "border-sky-300 shadow-sm" : "border-gray-200"
            )}
          >
            {/* Campo colapsado */}
            {editingIndex !== index ? (
              <div
                className="flex items-center gap-3 p-3 cursor-pointer"
                onClick={() => setEditingIndex(index)}
              >
                <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                <span className="text-sm text-gray-400 font-mono w-4 text-center shrink-0">
                  {FIELD_TYPE_ICONS[field.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-800">
                    {field.label || <span className="text-gray-400 italic">Sem nome</span>}
                  </span>
                  {field.key && (
                    <span className="ml-2 text-xs text-gray-400 font-mono">{field.key}</span>
                  )}
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded shrink-0">
                  {field.section || "—"}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeField(index) }}
                  className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Campo expandido para edição */
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nome do campo</label>
                    <input
                      value={field.label}
                      onChange={(e) => updateField(index, { label: e.target.value })}
                      placeholder="Ex: Título Principal"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Chave <span className="text-gray-400">(identificador único)</span>
                    </label>
                    <input
                      value={field.key}
                      onChange={(e) => updateField(index, { key: e.target.value.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z0-9.]/g, "") })}
                      placeholder="Ex: hero.title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tipo</label>
                    <select
                      value={field.type}
                      onChange={(e) => updateField(index, { type: e.target.value as ContentFieldType })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      {FIELD_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Secção</label>
                    <input
                      value={field.section}
                      onChange={(e) => updateField(index, { section: e.target.value })}
                      placeholder="Ex: Hero, Contacto, SEO"
                      list={`sections-${index}`}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <datalist id={`sections-${index}`}>
                      {sections.map((s) => <option key={s} value={s} />)}
                    </datalist>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Placeholder</label>
                    <input
                      value={field.placeholder ?? ""}
                      onChange={(e) => updateField(index, { placeholder: e.target.value })}
                      placeholder="Texto de exemplo..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Dica de ajuda</label>
                    <input
                      value={field.hint ?? ""}
                      onChange={(e) => updateField(index, { hint: e.target.value })}
                      placeholder="Ex: Máximo 60 caracteres"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={field.required ?? false}
                      onChange={(e) => updateField(index, { required: e.target.checked })}
                      className="rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                    />
                    Campo obrigatório
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeField(index)}
                      className="text-sm text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Remover
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 text-sm mb-3">Nenhum campo definido.</p>
          <div className="flex items-center justify-center gap-2">
            <button onClick={addField} className="text-sm text-sky-600 hover:text-sky-700 font-medium">
              Adicionar campo
            </button>
            <span className="text-gray-300">ou</span>
            <button onClick={() => setShowTemplates(true)} className="text-sm text-sky-600 hover:text-sky-700 font-medium">
              importar template
            </button>
          </div>
        </div>
      )}

      {/* Guardar */}
      {fields.length > 0 && (
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-950 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? "A guardar..." : "Guardar schema"}
          </button>
          {saved && <span className="text-sm text-green-600 font-medium">Schema guardado!</span>}
        </div>
      )}
    </div>
  )
}
