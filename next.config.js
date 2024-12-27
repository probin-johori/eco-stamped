/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v5.airtableusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'dl.airtable.com',
      },
      {
        protocol: 'https',
        hostname: 'v4.airtableusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'v3.airtableusercontent.com',
      },
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
