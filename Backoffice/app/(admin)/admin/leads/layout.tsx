import Link from "next/link"
import { Table2, KanbanSquare, CalendarDays, Send, BarChart3 } from "lucide-react"
import { LeadsSubNav } from "@/components/leads/LeadsSubNav"

export default function LeadsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <LeadsSubNav />
      {children}
    </div>
  )
}
