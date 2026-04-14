const FALLBACK_SITE_URL = 'https://awkward-joete-coggiri-bd417fe3.koyeb.app/'

function normalizeSiteUrl(url: string) {
  return url.endsWith('/') ? url : `${url}/`
}

export const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL
)

export function getCanonicalUrl(path = '/') {
  return new URL(path, SITE_URL).toString()
}
