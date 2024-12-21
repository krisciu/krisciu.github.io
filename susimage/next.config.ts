/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true, // Required for static export
  },
  basePath: '/susimage', // Replace with your actual repository name
  assetPrefix: '/susimage', // Replace with your actual repository name
}

module.exports = nextConfig