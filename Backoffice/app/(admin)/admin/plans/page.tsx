import { prisma } from "@/lib/prisma"
import { Check } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export default async function PlansPage() {
  const plans = await prisma.plan.findMany({ orderBy: { priceEur: "asc" } })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Planos</h1>
        <p className="text-gray-500 mt-1">Gerir os planos disponíveis na plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const features = plan.features as Record<string, unknown>
          return (
            <div key={plan.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="mb-4">
                <h2 className="font-semibold text-gray-900 text-lg">{plan.name}</h2>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {plan.priceEur === 0 ? "Grátis" : formatCurrency(plan.priceEur)}
                  {plan.priceEur > 0 && <span className="text-base font-normal text-gray-400">/mês</span>}
                </p>
              </div>
              <ul className="space-y-2 text-sm">
                {features["hasLanding"] === true && <li className="flex items-center gap-2 text-gray-700"><Check className="w-4 h-4 text-green-500" />Landing Page</li>}
                {features["hasSubscription"] === true && <li className="flex items-center gap-2 text-gray-700"><Check className="w-4 h-4 text-green-500" />Sistema de Subscrição</li>}
                {features["customDomain"] === true && <li className="flex items-center gap-2 text-gray-700"><Check className="w-4 h-4 text-green-500" />Domínio personalizado</li>}
                <li className="flex items-center gap-2 text-gray-700"><Check className="w-4 h-4 text-green-500" />Até {String(features["maxImages"] ?? 0)} imagens</li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400">ID: {plan.id}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
