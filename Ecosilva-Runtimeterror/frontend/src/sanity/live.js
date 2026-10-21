// Sanity Live disabled for static export — queries return empty data
export async function sanityFetch({ query, params } = {}) {
  return { data: null }
}

export function SanityLive() {
  return null
}
