import { cn } from "@/lib/utils"

type Status = "ACTIVE" | "SUSPENDED" | "TRIAL"

const config: Record<Status, { label: string; className: string }> = {
  ACTIVE: { label: "Ativo", className: "bg-green-50 text-green-700 border-green-200" },
  SUSPENDED: { label: "Suspenso", className: "bg-red-50 text-red-700 border-red-200" },
  TRIAL: { label: "Trial", className: "bg-amber-50 text-amber-700 border-amber-200" },
}

export default function TenantStatusBadge({ status }: { status: Status }) {
  const { label, className } = config[status]
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", className)}>
      {label}
    </span>
  )
}
