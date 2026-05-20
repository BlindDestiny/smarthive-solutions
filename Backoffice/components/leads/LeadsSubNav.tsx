"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Table2, KanbanSquare, CalendarDays, Send, BarChart3, Download,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ThemeToggle"

const ITEMS = [
  { href: "/admin/leads",          label: "Tabela",     icon: Table2,        exact: true  },
  { href: "/admin/leads/pipeline", label: "Pipeline",   icon: KanbanSquare,  exact: false },
  { href: "/admin/leads/calendar", label: "Calendário", icon: CalendarDays,  exact: false },
  { href: "/admin/leads/outreach", label: "Outreach",   icon: Send,          exact: false },
  { href: "/admin/leads/reports",  label: "Reports",    icon: BarChart3,     exact: false },
  { href: "/admin/leads/ingest",   label: "Ingest",     icon: Download,      exact: false },
]

export function LeadsSubNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
      <div className="max-w-[1600px] mx-auto px-6 flex items-center gap-1 overflow-x-auto">
        <div className="flex items-center gap-1 flex-1 min-w-0">
          {ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "shrink-0 inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  active
                    ? "border-sky-500 text-sky-700 dark:text-sky-400"
                    : "border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            )
          })}
        </div>
        <ThemeToggle />
      </div>
    </nav>
  )
}
