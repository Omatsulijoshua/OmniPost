/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@omnipost/ui',
    '@omnipost/types',
    '@omnipost/validation',
    '@omnipost/platform-core',
    '@omnipost/ai-core',
    '@omnipost/media-core',
    '@omnipost/shared',
  ],
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: 'admin-gamma-ten-89.vercel.app',
            },
          ],
          destination: '/admin',
        },
      ],
    };
  },
};

module.exports = nextConfig;
