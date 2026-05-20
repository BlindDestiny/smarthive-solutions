"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LayoutDashboard, Globe, Image, Calendar, Share2, Settings, LogOut, Zap, Eye, UtensilsCrossed, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  tenantName: string
  tenantSlug: string
  hasEvents: boolean
  hasSocial: boolean
  hasMenu?: boolean
  hasReservations?: boolean
}

export default function ClientSidebar({ tenantName, tenantSlug, hasEvents, hasSocial, hasMenu, hasReservations }: Props) {
  const pathname = usePathname()

  const navItems = [
    { href: "/dashboard",               label: "Dashboard",      icon: LayoutDashboard, exact: true,  show: true },
    { href: "/dashboard/website",       label: "Conteúdo",       icon: Globe,           exact: false, show: true },
    { href: "/dashboard/images",        label: "Imagens",        icon: Image,           exact: false, show: true },
    { href: "/dashboard/events",        label: "Eventos",        icon: Calendar,        exact: false, show: hasEvents },
    { href: "/dashboard/social",        label: "Redes Sociais",  icon: Share2,          exact: false, show: hasSocial },
    { href: "/dashboard/menu",          label: "Menu",           icon: UtensilsCrossed, exact: false, show: !!hasMenu },
    { href: "/dashboard/reservations",  label: "Reservas",       icon: Phone,           exact: false, show: !!hasReservations },
    { href: "/dashboard/settings",      label: "Definições",     icon: Settings,        exact: false, show: true },
  ]

  return (
    <aside className="w-60 shrink-0 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-gray-900 font-semibold text-sm leading-none truncate">{tenantName}</p>
          <p className="text-gray-400 text-xs mt-0.5">SmartHive</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.filter((i) => i.show).map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-sky-50 text-sky-600"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}

        {/* Preview — link externo, abre fullscreen */}
        <Link
          href={`/preview/${tenantSlug}`}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        >
          <Eye className="w-4 h-4 shrink-0" />
          Pré-visualizar
        </Link>
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-900 hover:bg-gray-50 w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
