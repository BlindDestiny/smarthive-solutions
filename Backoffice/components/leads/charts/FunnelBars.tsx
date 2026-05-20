"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"

interface FunnelStep {
  label: string
  value: number
  pct:   number
}

const COLORS = ["#94a3b8", "#0ea5e9", "#06b6d4", "#a78bfa", "#10b981"]

export function FunnelBars({ data }: { data: FunnelStep[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 20, bottom: 8, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#6b7280" }} />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fontSize: 12, fill: "#374151" }}
          width={110}
        />
        <Tooltip
          formatter={(v, _n, p) => {
            const n = Number(v ?? 0)
            const pct = (p?.payload as FunnelStep | undefined)?.pct ?? 0
            return [`${n.toLocaleString("pt-PT")} (${pct.toFixed(1)}%)`, "Leads"]
          }}
          contentStyle={{ fontSize: 12, border: "1px solid #e5e7eb", borderRadius: 6 }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i] ?? "#0ea5e9"} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
