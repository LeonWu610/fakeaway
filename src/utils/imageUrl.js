const VARIANT_ROOT = '/images/variants-v1'
const IMAGE_PATH_MARKER = '/images/'
const SUPPORTED_FOLDERS = new Set(['merchants', 'products'])

function splitUrl(value) {
  const markerIndex = value.indexOf(IMAGE_PATH_MARKER)
  if (markerIndex < 0) return null

  const prefix = value.slice(0, markerIndex)
  const imagePath = value.slice(markerIndex + IMAGE_PATH_MARKER.length)
  const [pathname] = imagePath.split(/[?#]/, 1)
  const parts = pathname.split('/')
  if (parts.length < 2 || !SUPPORTED_FOLDERS.has(parts[0]) || parts.includes('variants-v1')) return null

  const filename = parts.at(-1)
  const extensionIndex = filename.lastIndexOf('.')
  if (extensionIndex <= 0) return null
  parts[parts.length - 1] = `${filename.slice(0, extensionIndex)}.webp`
  return { prefix, path: parts.join('/') }
}

export function getImageVariantUrl(src, size) {
  if (typeof src !== 'string' || ![320, 640].includes(size)) return null
  const parsed = splitUrl(src)
  if (!parsed) return null
  return `${parsed.prefix}${VARIANT_ROOT}/${size}/${parsed.path}`
}

export function getImageVariants(src) {
  const small = getImageVariantUrl(src, 320)
  const large = getImageVariantUrl(src, 640)
  if (!small || !large) return null
  return {
    src: large,
    srcSet: `${small} 320w, ${large} 640w`,
  }
}
