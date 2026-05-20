import { auth } from "@/lib/auth"
import { getClientWebsite } from "@/lib/permissions"
import { type ContentSchema } from "@/lib/content-schema"
import ContentEditor from "@/components/client/ContentEditor"
import { Phone } from "lucide-react"

const CONTACT_SECTIONS = ["Contacto", "Reservas", "Contact", "Reservations"]

export default async function ReservationsPage() {
  const session = await auth()
  const tenantId = session!.user.tenantId!

  const website = await getClientWebsite(tenantId)
  const fullSchema = (website?.contentSchema ?? []) as ContentSchema

  // Filter to only contact/reservations-related sections
  const schema = fullSchema.filter((f) => CONTACT_SECTIONS.includes(f.section))

  const contentMap: Record<string, string> = {}
  website?.contents.forEach((c) => { contentMap[c.key] = c.value })

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reservas & Contacto</h1>
        <p className="text-gray-500 mt-1">
          Edita o telefone, WhatsApp, morada e horário exibidos no website.
        </p>
      </div>

      {schema.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <Phone className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <p className="font-medium text-gray-800 mb-1">Nenhum campo de contacto configurado</p>
          <p className="text-sm text-gray-500">
            O administrador ainda não adicionou campos de Contacto ao schema deste website.
          </p>
        </div>
      ) : (
        <ContentEditor schema={schema} initialContent={contentMap} />
      )}
    </div>
  )
}
