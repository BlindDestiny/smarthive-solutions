import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Login normal com email + password
    Credentials({
      id: "credentials",
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
        if (!user) return null

        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!valid) return null

        return { id: user.id, email: user.email, name: user.name, role: user.role, tenantId: user.tenantId }
      },
    }),

    // Impersonation — token de uso único gerado pelo admin
    Credentials({
      id: "impersonate",
      async authorize(credentials) {
        const token = credentials?.token as string | undefined
        if (!token) return null

        const user = await prisma.user.findFirst({
          where: {
            impersonateToken: token,
            impersonateExpiry: { gt: new Date() },
          },
        })
        if (!user) return null

        // Invalidar token após uso
        await prisma.user.update({
          where: { id: user.id },
          data: { impersonateToken: null, impersonateExpiry: null },
        })

        return { id: user.id, email: user.email, name: user.name, role: user.role, tenantId: user.tenantId }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role as string
        token.tenantId = user.tenantId as string | null
      }
      return token
    },
    session({ session, token }) {
      session.user.role = token.role as string
      session.user.tenantId = token.tenantId as string | null
      return session
    },
  },
  pages: { signIn: "/login", error: "/login" },
  session: { strategy: "jwt" },
})
