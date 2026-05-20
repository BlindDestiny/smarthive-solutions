"use client"

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"

interface SeriesPoint {
  week:     string  // "2026-W18"
  calls:    number
  emails:   number
  meetings: number
}

export function ActivityWeekly({ data }: { data: SeriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 20, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="week" tick={{ fontSize: 10, fill: "#6b7280" }} />
        <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
        <Tooltip
          contentStyle={{ fontSize: 12, border: "1px solid #e5e7eb", borderRadius: 6 }}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line type="monotone" dataKey="calls"    stroke="#0ea5e9" strokeWidth={2} dot={{ r: 2 }} name="Chamadas" />
        <Line type="monotone" dataKey="emails"   stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} name="Emails" />
        <Line type="monotone" dataKey="meetings" stroke="#a78bfa" strokeWidth={2} dot={{ r: 2 }} name="Reuniões" />
      </LineChart>
    </ResponsiveContainer>
  )
}
