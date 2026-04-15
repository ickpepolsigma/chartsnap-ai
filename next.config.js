/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bcrypt'],
  },
  images: {
    remotePatterns: [],
  },
  compress: true,
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
}

module.exports = nextConfig
