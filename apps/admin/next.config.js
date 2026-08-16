/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://omnipost-api.onrender.com';

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@omnipost/types', '@omnipost/validation', '@omnipost/ui', '@omnipost/shared'],
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
