import { NextResponse } from 'next/server'
 
export async function GET() {
  return new NextResponse(`User-agent: *
Allow: /

Sitemap: ${process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000'}/sitemap.xml`, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}