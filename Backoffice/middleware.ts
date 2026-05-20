import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  const isAuthed = !!session
  const isAdmin = session?.user?.role === "ADMIN"

  if (!isAuthed && (pathname.startsWith("/admin") || pathname.startsWith("/dashboard"))) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (isAuthed && pathname === "/login") {
    const dest = isAdmin ? "/admin/dashboard" : "/dashboard"
    return NextResponse.redirect(new URL(dest, req.url))
  }

  if (isAuthed && !isAdmin && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
})

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login"],
}
