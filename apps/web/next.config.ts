import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@imposter/game-engine",
    "@imposter/shared",
    "@imposter/types",
    "@imposter/ui",
  ],
};

export default nextConfig;

