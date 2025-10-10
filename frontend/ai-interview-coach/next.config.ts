import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    appDir: true,
  },
  srcDir: "src",
};

export default nextConfig;
