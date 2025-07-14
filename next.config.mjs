/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize for production
  compress: true,

  // Enable static optimization
  trailingSlash: false,

  // Image optimization settings
  images: {
    domains: ["res.cloudinary.com"],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },

  // Environment variables that should be available on the client side
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Remove experimental optimizeCss as it's causing issues
  // experimental: {
  //   optimizeCss: true,
  // },

  // Headers for better security and performance
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
