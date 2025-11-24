import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployments
  output: 'standalone',

  // Serve the app under /Fin_Tech
  basePath: '/Fin_Tech',
  assetPrefix: '/Fin_Tech',

  // Disable image optimization to fix local development issues
  images: {
    unoptimized: true,
  },

  // Enable compression
  compress: true,

  // Security headers
  async headers() {
    return [
      {
        // Scope headers to the basePath
        source: '/Fin_Tech/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Environment variables to expose to the client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '/Fin_Tech',
  },

  // Experimental features
  experimental: {
    // Add experimental features here if needed
  },
};

export default nextConfig;
