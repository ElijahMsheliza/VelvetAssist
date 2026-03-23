import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;

const nextConfig: NextConfig = {
  // output: "export", // Removed for Supabase Auth & SSR
  basePath: isGithubActions ? "/VelvetAssist" : "",
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
