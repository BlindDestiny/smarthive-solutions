import { PhoneCall, Mail, Globe, Users } from "lucide-react"

interface StatsBarProps {
  stats: {
    total: number
    withWebsite: number
    withEmail: number
    withPhone: number
  }
}

export function StatsBar({ stats }: StatsBarProps) {
  const items = [
    { label: "Leads filtrados", value: stats.total,       icon: Users,     color: "sky" },
    { label: "Com website",     value: stats.withWebsite, icon: Globe,     color: "emerald" },
    { label: "Com email",       value: stats.withEmail,   icon: Mail,      color: "amber" },
    { label: "Com telefone",    value: stats.withPhone,   icon: PhoneCall, color: "violet" },
  ] as const

  const colorMap = {
    sky:     "bg-sky-50 text-sky-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber:   "bg-amber-50 text-amber-600",
    violet:  "bg-violet-50 text-violet-600",
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-medium uppercase tracking-widest text-gray-500">
                {item.label}
              </p>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colorMap[item.color]}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900 tabular-nums">
              {item.value.toLocaleString("pt-PT")}
            </p>
          </div>
        )
      })}
    </div>
  )
}
