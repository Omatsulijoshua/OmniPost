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
};

module.exports = nextConfig;
