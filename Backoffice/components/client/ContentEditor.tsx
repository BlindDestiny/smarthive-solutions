"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save, ImageIcon, Link2, Mail, Phone, Hash, Palette } from "lucide-react"
import { type ContentField, type ContentSchema, groupBySection } from "@/lib/content-schema"

const TYPE_ICON: Record<string, React.ReactNode> = {
  image:   <ImageIcon className="w-3.5 h-3.5" />,
  url:     <Link2 className="w-3.5 h-3.5" />,
  email:   <Mail className="w-3.5 h-3.5" />,
  phone:   <Phone className="w-3.5 h-3.5" />,
  number:  <Hash className="w-3.5 h-3.5" />,
  color:   <Palette className="w-3.5 h-3.5" />,
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: ContentField
  value: string
  onChange: (key: string, value: string) => void
}) {
  const base = "w-full border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-shadow"

  if (field.type === "textarea") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        rows={4}
        className={`${base} px-3.5 py-2.5 resize-none`}
      />
    )
  }

  if (field.type === "image") {
    return (
      <div className="space-y-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          placeholder="https://... ou /uploads/..."
          className={`${base} px-3.5 py-2.5`}
        />
        {value && (
          <div className="relative h-24 w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    )
  }

  if (field.type === "color") {
    return (
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="h-10 w-16 rounded-lg border border-gray-300 cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(field.key, e.target.value)}
          placeholder="#000000"
          className={`flex-1 ${base} px-3.5 py-2.5 font-mono`}
        />
      </div>
    )
  }

  const inputType =
    field.type === "email" ? "email"
    : field.type === "phone" ? "tel"
    : field.type === "number" ? "number"
    : field.type === "url" ? "url"
    : "text"

  return (
    <div className="relative">
      {TYPE_ICON[field.type] && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
          {TYPE_ICON[field.type]}
        </div>
      )}
      <input
        type={inputType}
        value={value}
        onChange={(e) => onChange(field.key, e.target.value)}
        placeholder={field.placeholder}
        className={`${base} py-2.5 ${TYPE_ICON[field.type] ? "pl-9 pr-3.5" : "px-3.5"}`}
      />
    </div>
  )
}

export default function ContentEditor({
  schema,
  initialContent,
}: {
  schema: ContentSchema
  initialContent: Record<string, string>
}) {
  const router = useRouter()
  const [content, setContent] = useState<Record<string, string>>(initialContent)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  function handleChange(key: string, value: string) {
    setContent((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setLoading(true)
    setError("")
    const res = await fetch("/api/client/website", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: content }),
    })
    setLoading(false)
    if (!res.ok) { setError("Erro ao guardar. Tenta novamente."); return }
    setSaved(true)
    router.refresh()
    setTimeout(() => setSaved(false), 3000)
  }

  if (schema.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
        <p className="text-amber-800 font-medium mb-1">Nenhum schema definido</p>
        <p className="text-amber-600 text-sm">O administrador ainda não configurou os campos deste website.</p>
      </div>
    )
  }

  const sections = groupBySection(schema)

  return (
    <div className="space-y-6">
      {Object.entries(sections).map(([section, fields]) => (
        <div key={section} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-medium text-gray-900 text-sm">{section}</h2>
          </div>
          <div className="px-6 py-5 space-y-5">
            {fields.map((field) => (
              <div key={field.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <span className="text-xs text-gray-400 font-mono">{field.key}</span>
                </div>
                <FieldInput
                  field={field}
                  value={content[field.key] ?? ""}
                  onChange={handleChange}
                />
                {field.hint && (
                  <p className="text-xs text-gray-400 mt-1.5">{field.hint}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-gray-950 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <Save className="w-4 h-4" />
          {loading ? "A guardar..." : "Guardar alterações"}
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">Guardado!</span>}
      </div>
    </div>
  )
}
