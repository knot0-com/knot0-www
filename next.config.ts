import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize barrel file imports for icon libraries
  // Rule: bundle-barrel-imports (CRITICAL)
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
