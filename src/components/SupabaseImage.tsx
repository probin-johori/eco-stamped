'use client'

import Image from 'next/image'
import { useState } from 'react'

interface SupabaseImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  quality?: number
  priority?: boolean
  sizes?: string
  className?: string
  onError?: () => void
  isLCP?: boolean // New prop to explicitly mark LCP images
}

const SupabaseImage: React.FC<SupabaseImageProps> = ({
  src,
  alt,
  fill = false,
  width,
  height,
  quality = 85, // Changed default to 85 for better performance/quality balance
  priority = false,
  sizes = '100vw', // Default sizes prop
  className,
  onError,
  isLCP = false, // Default to false
}) => {
  const getImageUrl = (url: string): string => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    return `${supabaseUrl}/storage/v1/object/public/${url}`
  }

  const [imgSrc, setImgSrc] = useState<string>(getImageUrl(src))

  const handleError = () => {
    onError?.()
    setImgSrc('') // Clear the source to trigger fallback
  }

  if (!imgSrc) {
    return null
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      quality={quality}
      priority={priority || isLCP} // Automatically set priority if it's an LCP image
      sizes={sizes}
      className={className}
      onError={handleError}
      loading={priority || isLCP ? 'eager' : 'lazy'} // Explicit loading strategy
    />
  )
}

export default SupabaseImage
