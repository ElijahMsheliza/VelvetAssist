import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/VelvetAssist" : "",
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
