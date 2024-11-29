/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    // Handle sharp and its dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      'detect-libc': false,
      'color': false,
      'color-string': false,
      'color-convert': false,
      'color-name': false
    };

    // Add cache configuration
    config.cache = {
      type: 'filesystem',
      allowCollectingMemory: true,
      store: 'pack',
      buildDependencies: {
        config: [__filename]
      }
    };

    return config;
  },
  outputFileTracingRoot: process.env.NODE_ENV === 'development' ? 
    process.cwd() : undefined,
  output: 'standalone'
};

module.exports = nextConfig;
