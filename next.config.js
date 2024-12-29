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
    minimumCacheTTL: 60,
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
        // Apply to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index,follow'
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, must-revalidate'
          }
        ],
      },
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
  },
  poweredByHeader: false,  // Remove X-Powered-By header for security
  compress: true,         // Enable compression
  generateEtags: true,    // Enable ETags for caching
};

module.exports = nextConfig;
