"use client"

import { useDraggable } from "@dnd-kit/core"
import Link from "next/link"
import { Phone, Mail, Globe, Star, ExternalLink } from "lucide-react"
import { VERTICAL_LABEL } from "@/lib/pitch"
import type { LeadBusinessType } from "@prisma/client"

export interface KanbanCardData {
  id: string
  name: string
  city: string | null
  reviews: number
  rating: number | null
  priority: number
  phone: string | null
  email: string | null
  website: string | null
  businessType: LeadBusinessType
  attempts?: number
}

export function KanbanCard({ data }: { data: KanbanCardData }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: data.id,
    data,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : undefined,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group bg-white border border-gray-200 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-shadow ${
        isDragging ? "shadow-2xl opacity-90 ring-2 ring-sky-400" : "hover:shadow-md hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-gray-900 leading-tight break-words flex-1">
          {data.name}
        </p>
        <Link
          href={`/admin/leads/${data.id}`}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="shrink-0 text-gray-300 hover:text-sky-500"
          title="Abrir detalhe"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">
        {VERTICAL_LABEL[data.businessType]}
        {data.city ? ` · ${data.city}` : ""}
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-500">
        <div className="inline-flex items-center gap-1.5">
          {data.rating != null && (
            <span className="inline-flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              {data.rating.toFixed(1)}
            </span>
          )}
          {data.priority > 0 && <span className="tabular-nums">prio {data.priority}</span>}
          {(data.attempts ?? 0) > 0 && (
            <span className="tabular-nums">📞{data.attempts}</span>
          )}
        </div>
        <div className="inline-flex items-center gap-1.5 text-gray-400">
          <Globe className={`w-3 h-3 ${data.website ? "text-emerald-500" : ""}`} />
          <Mail  className={`w-3 h-3 ${data.email   ? "text-amber-500"   : ""}`} />
          <Phone className={`w-3 h-3 ${data.phone   ? "text-violet-500" : ""}`} />
        </div>
      </div>
    </div>
  )
}
