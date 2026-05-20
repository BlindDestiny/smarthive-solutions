import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: "Email obrigatório." }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email } })

  // Responder sempre com sucesso para não revelar se o email existe
  if (!user) return NextResponse.json({ ok: true })

  const token = randomBytes(32).toString("hex")
  const expiry = new Date(Date.now() + 1000 * 60 * 60) // 1 hora

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExp: expiry },
  })

  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`

  if (process.env.RESEND_API_KEY) {
    await resend.emails.send({
      from: "SmartHive <noreply@smarthive.pt>",
      to: email,
      subject: "Recuperação de password — SmartHive",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="margin:0 0 8px">Recuperar password</h2>
          <p style="color:#6b7280;margin:0 0 24px">
            Clica no botão abaixo para definir uma nova password. O link é válido durante 1 hora.
          </p>
          <a href="${resetUrl}"
             style="display:inline-block;background:#0ea5e9;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600">
            Definir nova password
          </a>
          <p style="color:#9ca3af;font-size:12px;margin:24px 0 0">
            Se não pediste a recuperação, ignora este email.
          </p>
        </div>
      `,
    })
  } else {
    // Dev: mostrar o link no terminal
    console.log(`\n🔑 Reset link (dev): ${resetUrl}\n`)
  }

  return NextResponse.json({ ok: true })
}
