export const PUBLIC_BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''

// Prefix a path with the public base path. Ensures single slash behavior.
export function withBase(path: string) {
  if (!path) return PUBLIC_BASE || ''
  if (!PUBLIC_BASE) return path
  // Ensure path starts with '/'
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${PUBLIC_BASE}${normalized}`
}

// Helper for public asset paths
export function publicAsset(assetPath: string) {
  return withBase(assetPath)
}
