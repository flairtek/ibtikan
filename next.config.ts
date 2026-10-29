import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "ybzedgivimattgyiptjo.supabase.co",
      },
    ],
  },
  cacheComponents: {
    sizeLimit: 10000,
    paths: [
      {
        regex: /^\/about$/,
        dynamic: 'force-dynamic',
      },
    ],
  },
};

export default nextConfig;
