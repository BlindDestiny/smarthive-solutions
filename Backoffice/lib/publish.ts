export async function triggerClientRedeploy(tenantSlug: string): Promise<boolean> {
  const envKey = `DEPLOY_HOOK_${tenantSlug.toUpperCase().replace(/-/g, "_")}`
  const hookUrl = process.env[envKey]

  if (!hookUrl) {
    console.warn(`No deploy hook configured for tenant: ${tenantSlug} (env: ${envKey})`)
    return false
  }

  const res = await fetch(hookUrl, { method: "POST" })
  return res.ok
}
