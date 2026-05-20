import { auth } from "@/lib/auth"

export default async function SettingsPage() {
  const session = await auth()

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Definições</h1>
        <p className="text-gray-500 mt-1">Dados da tua conta.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-medium text-gray-900">Perfil</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 mb-1">Nome</p>
            <p className="font-medium text-gray-800">{session?.user.name}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Email</p>
            <p className="font-medium text-gray-800">{session?.user.email}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">Para alterar password ou dados, contacta o suporte.</p>
        </div>
      </div>
    </div>
  )
}
