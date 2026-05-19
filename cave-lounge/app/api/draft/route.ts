import { draftMode } from "next/headers"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  const backofficeUrl = req.nextUrl.searchParams.get("backoffice") ?? process.env.BACKOFFICE_URL ?? "http://localhost:3010"

  if (!token) redirect("/")

  // Validar token com o backoffice
  try {
    const validation = await fetch(
      `${backofficeUrl}/api/validate-preview-token?token=${token}&slug=${process.env.NEXT_PUBLIC_SITE_SLUG ?? "cave-lounge"}`,
      { cache: "no-store" }
    )
    if (!validation.ok) redirect("/?error=invalid-token")
  } catch {
    redirect("/?error=backoffice-unreachable")
  }

  // Activar Draft Mode
  const dm = await draftMode()
  dm.enable()

  // Guardar o token em cookie para o page.tsx o usar nas fetch calls
  const cookieStore = await cookies()
  cookieStore.set("preview-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 30, // 30 minutos
  })

  redirect("/")
}
