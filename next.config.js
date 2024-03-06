/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    domains: ["cdn.jsdelivr.net", "ipfs.filebase.io"],
  },
  eslint: {
    // Ignore ESLint during build steps
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
