import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  // ADMIN sees everything; CALLER only the CRM (/admin/leads/*).
  // The leads layout enforces CALLER-or-ADMIN; here we just keep CLIENT out.
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "CALLER")) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
