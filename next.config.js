/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/chartsnap-ai',
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [],
  },
  compress: true,
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
}

module.exports = nextConfig
