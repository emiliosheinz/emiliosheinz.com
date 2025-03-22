const { withContentlayer } = require("next-contentlayer2");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Follows TailwindCSS screens breakpoints
    deviceSizes: [640, 768, 1024, 1280, 1536],
    remotePatterns: [
      // Youtube allow youtube thumbnails to be loaded
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
        port: "",
      },
    ],
  },
};

module.exports = withContentlayer(nextConfig);
