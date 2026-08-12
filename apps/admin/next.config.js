/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@omnipost/types', '@omnipost/validation', '@omnipost/ui'],
  async rewrites() {
    return [
      {
        source: '/api/v1/admin/:path*',
        destination: 'http://localhost:3001/api/v1/admin/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
