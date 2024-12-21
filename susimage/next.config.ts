/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Since this will be hosted at krisciu.github.io/susimage
  basePath: '/susimage',
  assetPrefix: '/susimage/',
}

module.exports = nextConfig