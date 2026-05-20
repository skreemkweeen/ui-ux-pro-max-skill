import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Add glslify loader for shader files
    config.module.rules.push({
      test: /\.(glsl|vs|fs)$/,
      use: ['raw-loader', 'glslify-loader'],
    })

    // Optimize Three.js bundle
    config.resolve.alias = {
      ...config.resolve.alias,
      three: 'three/build/three.min.js',
    }

    // Add shader include support
    config.resolve.extensions = [
      ...config.resolve.extensions,
      '.glsl',
      '.vs',
      '.fs',
    ]

    return config
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['three', '@react-three/fiber'],
  },

  // Compression
  compress: true,

  // Production source maps
  productionBrowserSourceMaps: false,

  // SwcMinify
  swcMinify: true,

  // Headers for performance
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/models/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Redirects for legacy URLs
  async redirects() {
    return []
  },
}

export default nextConfig
