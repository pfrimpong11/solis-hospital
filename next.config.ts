import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Enable CSS modules and global CSS
  webpack: (config) => {
    // Add proper handling for CSS files
    config.module.rules.forEach((rule: any) => {
      const { oneOf } = rule;
      if (oneOf) {
        oneOf.forEach((one: any) => {
          if (!one.issuer) return;
          if (one.issuer.and && one.issuer.and.length > 0) {
            one.issuer.or = [...(one.issuer.or || []), /\.tsx?$/i];
          }
        });
      }
    });
    return config;
  }
};

export default nextConfig;
