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
};

module.exports = nextConfig;
