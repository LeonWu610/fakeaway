import { useEffect, useState } from 'react'
import { getImageVariants } from '../../utils/imageUrl'

export default function AppImage({
  src,
  alt,
  className,
  sizes,
  width,
  height,
  priority = false,
}) {
  const [useOriginal, setUseOriginal] = useState(false)
  const variants = useOriginal ? null : getImageVariants(src)

  useEffect(() => {
    setUseOriginal(false)
  }, [src])

  return (
    <img
      src={variants?.src || src}
      srcSet={variants?.srcSet}
      sizes={variants ? sizes : undefined}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      onError={variants ? () => setUseOriginal(true) : undefined}
    />
  )
}
