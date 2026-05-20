"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Upload, Trash2, ImageIcon } from "lucide-react"
import Image from "next/image"

type ImageItem = { id: string; url: string; filename: string }

export default function ImageUploader({ initialImages }: { initialImages: ImageItem[] }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<ImageItem[]>(initialImages)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/client/images", {
      method: "POST",
      body: formData,
    })

    setUploading(false)

    if (!res.ok) {
      setError("Erro ao fazer upload. Tenta novamente.")
      return
    }

    const data = await res.json()
    setImages((prev) => [data, ...prev])
    router.refresh()

    if (inputRef.current) inputRef.current.value = ""
  }

  async function handleDelete(imageId: string) {
    await fetch(`/api/client/images/${imageId}`, { method: "DELETE" })
    setImages((prev) => prev.filter((i) => i.id !== imageId))
  }

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-sky-400 hover:bg-sky-50 transition-all"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-700">
          {uploading ? "A fazer upload..." : "Clica para fazer upload de uma imagem"}
        </p>
        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP até 5MB</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
      )}

      {/* Grid de imagens */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <Image
                src={image.url}
                alt={image.filename}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <button
                  onClick={() => handleDelete(image.id)}
                  className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-all">
                <p className="text-white text-xs truncate">{image.filename}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8">
          <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Nenhuma imagem ainda.</p>
        </div>
      )}
    </div>
  )
}
