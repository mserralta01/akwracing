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
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      'detect-libc': false,
      'color': false,
      'color-string': false,
      'color-convert': false,
      'color-name': false
    };

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
