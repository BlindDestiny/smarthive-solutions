"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition, useEffect } from "react"
import { Search, X, Filter as FilterIcon } from "lucide-react"
import { ALL_STATUSES, ALL_VERTICALS, STATUS_LABEL } from "@/lib/leads/types"
import { VERTICAL_LABEL } from "@/lib/pitch"

interface LeadFiltersProps {
  cities: string[]
  initialSearch?: string
}

export function LeadFilters({ cities, initialSearch }: LeadFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(initialSearch ?? "")

  // Keep input in sync when URL changes externally
  useEffect(() => { setSearchValue(initialSearch ?? "") }, [initialSearch])

  function applyParam(key: string, value?: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "") params.set(key, value)
    else params.delete(key)
    params.delete("page")
    startTransition(() => router.push(`?${params.toString()}`))
  }

  function applyMany(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v) params.set(k, v); else params.delete(k)
    }
    params.delete("page")
    startTransition(() => router.push(`?${params.toString()}`))
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault()
    applyParam("q", searchValue.trim() || null)
  }

  function clearAll() {
    setSearchValue("")
    startTransition(() => router.push("?"))
  }

  const hasActive = ["q", "status", "vertical", "city", "web", "email", "phone", "prio"]
    .some((k) => searchParams.get(k))

  const select =
    "h-9 px-2.5 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 " +
    "appearance-none bg-no-repeat focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      {/* Search bar */}
      <form onSubmit={submitSearch} className="flex items-center gap-3 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Pesquisar lead por nome..."
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="h-10 px-4 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg disabled:opacity-50"
        >
          Pesquisar
        </button>
        {hasActive && (
          <button
            type="button"
            onClick={clearAll}
            className="h-10 px-3 text-xs font-medium text-gray-600 hover:text-gray-900 inline-flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" /> Limpar tudo
          </button>
        )}
      </form>

      {/* Filter selects */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-gray-500 mr-1">
          <FilterIcon className="w-3 h-3" /> Filtros
        </div>

        <select
          value={searchParams.get("status") ?? ""}
          onChange={(e) => applyParam("status", e.target.value || null)}
          className={select}
        >
          <option value="">Todos os status</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>

        <select
          value={searchParams.get("vertical") ?? ""}
          onChange={(e) => applyParam("vertical", e.target.value || null)}
          className={select}
        >
          <option value="">Todos os verticais</option>
          {ALL_VERTICALS.map((v) => (
            <option key={v} value={v}>{VERTICAL_LABEL[v]}</option>
          ))}
        </select>

        <select
          value={searchParams.get("city") ?? ""}
          onChange={(e) => applyParam("city", e.target.value || null)}
          className={select}
        >
          <option value="">Todas as cidades</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={searchParams.get("web") ?? ""}
          onChange={(e) => applyParam("web", e.target.value || null)}
          className={select}
        >
          <option value="">Website (qualquer)</option>
          <option value="1">Com website</option>
          <option value="0">Sem website</option>
        </select>

        <select
          value={searchParams.get("email") ?? ""}
          onChange={(e) => applyParam("email", e.target.value || null)}
          className={select}
        >
          <option value="">Email (qualquer)</option>
          <option value="1">Com email</option>
          <option value="0">Sem email</option>
        </select>

        <select
          value={searchParams.get("phone") ?? ""}
          onChange={(e) => applyParam("phone", e.target.value || null)}
          className={select}
        >
          <option value="">Telefone (qualquer)</option>
          <option value="1">Com telefone</option>
          <option value="0">Sem telefone</option>
        </select>

        <select
          value={searchParams.get("prio") ?? ""}
          onChange={(e) => applyParam("prio", e.target.value || null)}
          className={select}
        >
          <option value="">Prioridade (qualquer)</option>
          <option value="40">≥ 40</option>
          <option value="60">≥ 60</option>
          <option value="80">≥ 80</option>
        </select>

        {pending && (
          <span className="text-xs text-gray-400">a atualizar…</span>
        )}
      </div>
    </div>
  )
}
