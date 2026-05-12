import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
