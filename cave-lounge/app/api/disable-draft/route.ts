import { draftMode } from "next/headers"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function GET() {
  const dm = await draftMode()
  dm.disable()

  const cookieStore = await cookies()
  cookieStore.delete("preview-token")

  redirect("/")
}
