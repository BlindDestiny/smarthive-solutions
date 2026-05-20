"use client"

import { useState, useTransition } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import type { LeadStatus } from "@prisma/client"
import { ALL_STATUSES, STATUS_COLOR, STATUS_LABEL } from "@/lib/leads/types"
import { setLeadStatus } from "@/lib/leads/mutations"
import { KanbanCard, type KanbanCardData } from "./KanbanCard"

interface KanbanColumn {
  status: LeadStatus
  rows: KanbanCardData[]
  total: number
}

interface KanbanBoardProps {
  initial: KanbanColumn[]
}

function DroppableColumn({
  status, count, total, children,
}: {
  status: LeadStatus
  count: number
  total: number
  children: React.ReactNode
}) {
  const { isOver, setNodeRef } = useDroppable({ id: status })
  return (
    <div
      ref={setNodeRef}
      className={`shrink-0 w-72 bg-gray-50 rounded-xl border ${
        isOver ? "border-sky-400 bg-sky-50" : "border-gray-200"
      } flex flex-col h-[calc(100vh-220px)]`}
    >
      <div className="px-3 py-3 border-b border-gray-200 sticky top-0 bg-gray-50/95 backdrop-blur rounded-t-xl">
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${STATUS_COLOR[status]}`}>
            {STATUS_LABEL[status]}
          </span>
          <span className="text-[11px] text-gray-500 tabular-nums">
            {count}{count < total ? ` / ${total}` : ""}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[60px]">
        {children}
        {count === 0 && (
          <p className="text-center text-xs text-gray-400 pt-4">— vazia —</p>
        )}
      </div>
    </div>
  )
}

export function KanbanBoard({ initial }: KanbanBoardProps) {
  const [columns, setColumns] = useState(initial)
  const [active, setActive] = useState<KanbanCardData | null>(null)
  const [, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  )

  function handleDragStart(e: DragStartEvent) {
    const data = e.active.data.current as KanbanCardData | undefined
    if (data) setActive(data)
  }

  function handleDragEnd(e: DragEndEvent) {
    const overId = e.over?.id
    const card = active
    setActive(null)
    if (!card || !overId) return

    const fromCol = columns.find((c) => c.rows.some((r) => r.id === card.id))
    const toStatus = overId as LeadStatus
    if (!fromCol || fromCol.status === toStatus) return

    // Optimistic update
    const previous = columns
    const next = columns.map((c) => {
      if (c.status === fromCol.status) {
        return { ...c, rows: c.rows.filter((r) => r.id !== card.id), total: c.total - 1 }
      }
      if (c.status === toStatus) {
        return { ...c, rows: [card, ...c.rows], total: c.total + 1 }
      }
      return c
    })
    setColumns(next)
    setError(null)

    startTransition(async () => {
      try {
        await setLeadStatus(card.id, toStatus)
      } catch (e) {
        setColumns(previous)
        setError(`Falhou: ${(e as Error).message}`)
      }
    })
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      {error && (
        <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          {error}
        </div>
      )}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {columns.map((col) => (
          <DroppableColumn
            key={col.status}
            status={col.status}
            count={col.rows.length}
            total={col.total}
          >
            {col.rows.map((card) => (
              <KanbanCard key={card.id} data={card} />
            ))}
          </DroppableColumn>
        ))}
      </div>
      <DragOverlay>
        {active ? <KanbanCard data={active} /> : null}
      </DragOverlay>
    </DndContext>
  )
}
