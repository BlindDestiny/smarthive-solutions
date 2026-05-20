"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import { VERTICAL_LABEL } from "@/lib/pitch"
import type { LeadBusinessType } from "@prisma/client"

interface VerticalRow {
  businessType: LeadBusinessType
  total: number
  contacted: number
  meeting: number
  won: number
}

export function VerticalDistribution({ data }: { data: VerticalRow[] }) {
  const chartData = data.map((d) => ({
    name:    VERTICAL_LABEL[d.businessType],
    total:   d.total,
    contacted: d.contacted,
    won:     d.won,
  }))

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 8, right: 20, bottom: 8, left: 0 }}
        barGap={2}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: "#374151" }}
          width={130}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, border: "1px solid #e5e7eb", borderRadius: 6 }}
          formatter={(v) => Number(v ?? 0).toLocaleString("pt-PT")}
        />
        <Bar dataKey="total"     fill="#cbd5e1" name="Total"      radius={[0, 2, 2, 0]} />
        <Bar dataKey="contacted" fill="#0ea5e9" name="Contactado" radius={[0, 2, 2, 0]} />
        <Bar dataKey="won"       fill="#10b981" name="Fechado"    radius={[0, 2, 2, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
