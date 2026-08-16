/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://omnipost-api.onrender.com';

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/admin/:path*',
        destination: `${apiUrl}/api/v1/admin/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
