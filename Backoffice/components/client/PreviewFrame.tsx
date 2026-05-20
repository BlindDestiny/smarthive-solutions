"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { X, RefreshCw, Upload, Monitor, Tablet, Smartphone, ExternalLink, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Device = "desktop" | "tablet" | "mobile"

const deviceWidths: Record<Device, string> = {
  desktop: "100%",
  tablet:  "768px",
  mobile:  "390px",
}

const deviceIcons = { desktop: Monitor, tablet: Tablet, mobile: Smartphone }

// Portas locais por slug
const LOCAL_PORTS: Record<string, number> = {
  "cave-lounge":        3005,
  "porto-dos-ribeiros": 3003,
  "cleaning-website":   3004,
  "restaurant-website": 3002,
}

export default function PreviewFrame({
  slug,
  tenantName,
  websiteUrl,
  isDraft,
  publishedAt,
}: {
  slug: string
  tenantName: string
  websiteUrl: string | null
  isDraft: boolean
  publishedAt: string | null
}) {
  const router = useRouter()
  const [device, setDevice] = useState<Device>("desktop")
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Ao montar: gerar token e activar draft mode no website
  useEffect(() => {
    async function initPreview() {
      setLoading(true)
      setError(null)

      try {
        // 1. Gerar preview token no backoffice
        const tokenRes = await fetch("/api/client/preview-token", { method: "POST" })
        if (!tokenRes.ok) throw new Error("Erro ao gerar token de preview.")
        const { token } = await tokenRes.json()

        // 2. Preview usa SEMPRE o servidor local — a websiteUrl (Vercel) é só para produção publicada
        const localPort = LOCAL_PORTS[slug]
        const previewBase = `http://localhost:${localPort}`

        // 3. URL que activa draft mode no website local
        const draftUrl = `${previewBase}/api/draft?token=${token}&backoffice=${encodeURIComponent(window.location.origin)}`

        setIframeUrl(draftUrl)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro desconhecido.")
      } finally {
        setLoading(false)
      }
    }

    initPreview()
  }, [slug])

  function refresh() {
    setIframeKey((k) => k + 1)
    setLoading(true)
  }

  async function handlePublish() {
    setPublishing(true)
    const res = await fetch("/api/client/publish", { method: "POST" })
    setPublishing(false)
    if (res.ok) {
      setPublished(true)
      setTimeout(() => setPublished(false), 4000)
    }
  }

  const localPort = LOCAL_PORTS[slug]
  const localUrl = `http://localhost:${localPort}`

  return (
    <div className="flex flex-col h-screen bg-gray-900 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-950 border-b border-gray-800 shrink-0">
        <button onClick={() => router.back()}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gray-700" />

        {/* Estado */}
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", isDraft ? "bg-amber-400 animate-pulse" : "bg-green-400")} />
          <span className="text-xs text-gray-400">
            {isDraft ? "Rascunho — Draft Mode activo" : "Publicado"}
            {publishedAt && !isDraft && (
              <span className="ml-1 text-gray-600">· {new Date(publishedAt).toLocaleDateString("pt-PT")}</span>
            )}
          </span>
        </div>

        <div className="w-px h-5 bg-gray-700" />

        {/* URL bar */}
        <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Draft Mode" />
          <span className="text-xs text-gray-400 font-mono truncate">{localUrl}</span>
          <a href={localUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 shrink-0">
            <ExternalLink className="w-3 h-3" />
          </a>
          {websiteUrl && (
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer"
              className="text-gray-600 hover:text-sky-400 shrink-0 ml-1" title="Ver versão publicada">
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* Device */}
        <div className="flex items-center gap-0.5 bg-gray-800 rounded-lg p-0.5">
          {(["desktop", "tablet", "mobile"] as Device[]).map((d) => {
            const Icon = deviceIcons[d]
            return (
              <button key={d} onClick={() => setDevice(d)}
                className={cn("p-1.5 rounded-md transition-colors",
                  device === d ? "bg-gray-600 text-white" : "text-gray-500 hover:text-gray-300")}>
                <Icon className="w-3.5 h-3.5" />
              </button>
            )
          })}
        </div>

        <button onClick={refresh}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gray-700" />

        <button onClick={handlePublish} disabled={publishing}
          className={cn("flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-lg transition-colors",
            published ? "bg-green-500 text-white" : "bg-sky-500 hover:bg-sky-400 disabled:bg-sky-800 text-white")}>
          <Upload className="w-3.5 h-3.5" />
          {publishing ? "A publicar..." : published ? "Publicado!" : "Publicar"}
        </button>

        <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-white transition-colors">
          ← Editar
        </button>
      </div>

      {/* Iframe area */}
      <div className="flex-1 overflow-auto bg-gray-800 flex items-start justify-center p-4">
        <div className="relative transition-all duration-300 bg-white shadow-2xl rounded-lg overflow-hidden"
          style={{ width: deviceWidths[device], maxWidth: "100%", minHeight: "100%" }}>

          {loading && (
            <div className="absolute inset-0 bg-gray-950 flex flex-col items-center justify-center z-10 gap-4">
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
              <p className="text-gray-400 text-sm">A activar Draft Mode...</p>
            </div>
          )}

          {error ? (
            <div className="flex flex-col items-center justify-center min-h-96 p-12 text-center gap-4">
              <Monitor className="w-12 h-12 text-gray-300" />
              <div>
                <p className="font-semibold text-gray-800 mb-1">Servidor local não está a correr</p>
                <p className="text-sm text-gray-500 mb-6 max-w-sm">
                  Para ver o preview com os estilos reais do website, arranca o servidor local numa nova terminal.
                </p>
                <div className="bg-gray-950 text-green-400 rounded-xl px-5 py-3 font-mono text-sm text-left">
                  <span className="text-gray-500">$ </span>cd ../smarthive-solutions/{slug}<br />
                  <span className="text-gray-500">$ </span>npm run dev -- --port {localPort}
                </div>
              </div>
              <button onClick={refresh}
                className="mt-4 flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300">
                <RefreshCw className="w-4 h-4" /> Tentar de novo
              </button>
            </div>
          ) : iframeUrl ? (
            <iframe
              key={iframeKey}
              src={iframeUrl}
              className="w-full border-0"
              style={{ height: "calc(100vh - 80px)", minHeight: "600px" }}
              title={`Preview — ${tenantName}`}
              onLoad={() => setLoading(false)}
              onError={() => { setError("Não foi possível carregar o website."); setLoading(false) }}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
