import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // This will work for both vercel.app and your custom domain when you set it up
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : 'http://localhost:3000'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}
