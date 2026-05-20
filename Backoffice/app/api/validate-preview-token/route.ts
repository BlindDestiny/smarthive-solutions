import { NextRequest, NextResponse } from "next/server"
import { previewTokens } from "@/lib/preview-tokens"

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token")
  const slug = req.nextUrl.searchParams.get("slug")

  if (!token || !slug) {
    return NextResponse.json({ valid: false }, { status: 400 })
  }

  const entry = previewTokens.get(token)
  if (!entry || entry.expiry < new Date()) {
    previewTokens.delete(token)
    return NextResponse.json({ valid: false }, { status: 401 })
  }

  return NextResponse.json({ valid: true, tenantId: entry.tenantId })
}
