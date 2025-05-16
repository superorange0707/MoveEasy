/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Ensure Playwright is only included in server-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        playwright: false,
      };
    }
    return config;
  },
  // Experimental features needed for Playwright
  experimental: {
    serverComponentsExternalPackages: ['playwright'],
  },
};

module.exports = nextConfig; 