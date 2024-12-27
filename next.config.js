/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['v5.airtableusercontent.com', 'v4.airtableusercontent.com', 'v3.airtableusercontent.com', 'dl.airtable.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.airtableusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'dl.airtable.com',
      }
    ],
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
      }
    ];
  }
};

module.exports = nextConfig;
