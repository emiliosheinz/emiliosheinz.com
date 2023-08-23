const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Follows TailwindCSS screens breakpoints
    deviceSizes: [640, 768, 1024, 1280, 1536],
  },
}

module.exports = withContentlayer(nextConfig)
