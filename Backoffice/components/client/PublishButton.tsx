"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, CheckCircle } from "lucide-react"

export default function PublishButton({
  isDraft,
  publishedAt,
}: {
  isDraft: boolean
  publishedAt: string | null
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handlePublish() {
    setLoading(true)
    setDone(false)

    const res = await fetch("/api/client/publish", { method: "POST" })

    setLoading(false)

    if (res.ok) {
      setDone(true)
      router.refresh()
      setTimeout(() => setDone(false), 3000)
    }
  }

  if (done) {
    return (
      <button className="flex items-center gap-2 bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg">
        <CheckCircle className="w-4 h-4" />
        Publicado!
      </button>
    )
  }

  return (
    <button
      onClick={handlePublish}
      disabled={loading}
      className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
    >
      <Upload className="w-4 h-4" />
      {loading ? "A publicar..." : isDraft ? "Publicar website" : "Re-publicar"}
    </button>
  )
}
