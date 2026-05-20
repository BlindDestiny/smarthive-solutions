// In-memory preview token store (single-instance, sufficient for dev and prod)
export const previewTokens = new Map<string, { tenantId: string; slug: string; expiry: Date }>()

export function validatePreviewToken(token: string): string | null {
  const entry = previewTokens.get(token)
  if (!entry) return null
  if (entry.expiry < new Date()) {
    previewTokens.delete(token)
    return null
  }
  return entry.tenantId
}
