/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: [
      'v5.airtableusercontent.com',
      'v4.airtableusercontent.com',
      'v3.airtableusercontent.com',
      'dl.airtable.com',
      'xntdrrorftkvvgelstgs.supabase.co'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.airtableusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'dl.airtable.com',
      },
      {
        protocol: 'https',
        hostname: 'xntdrrorftkvvgelstgs.supabase.co',
        pathname: '/storage/v1/object/public/**',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,  // Add this line
    minimumCacheTTL: 60,  // Add this line
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    const isProduction = process.env.NODE_ENV === 'production';
    return [
      {
        source: '/(about|certification)',
        has: [
          {
            type: 'host',
            value: '(?!localhost:3000).*',
          },
        ],
        permanent: false,
        destination: '/',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(about|certification)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'localhost:3000'
          }
        ]
      },
      {
        // Add this new headers configuration for images
        source: '/api/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
